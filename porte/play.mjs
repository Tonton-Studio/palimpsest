#!/usr/bin/env node
// PALIMPSEST — la porte pour joueur IA, en local (registre, lignes 25 et 31).
//
// Fait jouer une partie à un modèle (le joueur) ; un modèle interprète ses réécritures (l'interprète). Le moteur est
// celui de la page publiée : src/Palimpsest.jsx est transformé par esbuild à chaque lancement, rien n'est recopié.
//
//   node porte/play.mjs --joueur ollama:deepseek-r1
//   node porte/play.mjs --joueur mistral:mistral-small-latest --interprete anthropic:claude-opus-5-5 --monde commun
//
// Options : --joueur et --interprete (fournisseur:modèle ; l'interprète vaut le joueur par défaut), --gestes (12),
// --monde <nom> (monde persistant partagé entre parties, dans porte/mondes/), --en-direct (un humain regarde la
// partie dans le terminal : le joueur en est informé).
// Fournisseurs : ollama, anthropic, mistral, gemini, openai, openrouter, lmstudio, llamacpp (voir porte/README.md).
// Sorties dans porte/parties/ (non versionné) : <horodatage>_<joueur>.jsonl (tout ce qui s'est passé) et .md (récit).
//
// Aucune dépendance : Node 20+ et npx (pour esbuild). Les clés d'API se lisent dans l'environnement, jamais ailleurs.

import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ROOT, loadEngine, engineVersion } from "./engine.mjs";

const CALL_TIMEOUT_MS = 10 * 60 * 1000;

// ============================================================
// FOURNISSEURS
// ============================================================
// Chaque fournisseur expose chat(messages, {json, signal}) → {text, thinking, tokensIn, tokensOut, ms}.

const OPENAI_COMPATIBLE = {
  mistral: { url: "https://api.mistral.ai/v1", key: "MISTRAL_API_KEY", jsonMode: true },
  gemini: { url: "https://generativelanguage.googleapis.com/v1beta/openai", key: "GEMINI_API_KEY", jsonMode: true },
  openai: { url: "https://api.openai.com/v1", key: "OPENAI_API_KEY", jsonMode: true },
  openrouter: { url: "https://openrouter.ai/api/v1", key: "OPENROUTER_API_KEY", jsonMode: true },
  lmstudio: { url: process.env.LMSTUDIO_URL || "http://127.0.0.1:1234/v1", key: null, jsonMode: false },
  llamacpp: { url: process.env.LLAMACPP_URL || "http://127.0.0.1:8080/v1", key: null, jsonMode: false },
};

function makeBackend(spec) {
  const at = spec.indexOf(":");
  if (at < 1) throw new Error(`« ${spec} » : attendu fournisseur:modèle, par exemple ollama:deepseek-r1`);
  const provider = spec.slice(0, at);
  const model = spec.slice(at + 1);
  if (provider === "ollama") return { spec, provider, model, chat: (m, o) => ollamaChat(model, m, o) };
  if (provider === "anthropic") return { spec, provider, model, chat: (m, o) => anthropicChat(model, m, o) };
  const compat = OPENAI_COMPATIBLE[provider];
  if (!compat) throw new Error(`fournisseur inconnu : ${provider} (ollama, anthropic, ${Object.keys(OPENAI_COMPATIBLE).join(", ")})`);
  if (compat.key && !process.env[compat.key]) throw new Error(`${provider} : la variable d'environnement ${compat.key} est absente`);
  return { spec, provider, model, chat: (m, o) => openaiCompatibleChat(compat, model, m, o) };
}

// Les modèles qui réfléchissent à voix haute (deepseek-r1…) mettent leur pensée entre balises <think>.
function splitThinking(text, thinking = null) {
  let rest = String(text ?? "");
  const found = [...rest.matchAll(/<think>([\s\S]*?)<\/think>/gi)].map((m) => m[1].trim());
  rest = rest.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const all = [thinking, ...found].filter(Boolean).join("\n\n");
  return { text: rest, thinking: all || null };
}

async function postJson(url, headers, body, signal) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(CALL_TIMEOUT_MS)]) : AbortSignal.timeout(CALL_TIMEOUT_MS),
  });
  const raw = await res.text();
  if (!res.ok) {
    const code = res.status === 429 ? "rate_limited" : res.status === 401 || res.status === 403 ? "not_granted" : "upstream_error";
    throw { code, message: `${url} → ${res.status} ${raw.slice(0, 300)}` };
  }
  return JSON.parse(raw);
}

async function ollamaChat(model, messages, { json, signal }) {
  const host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const startedAt = Date.now();
  // num_ctx : la conversation d'une partie dépasse la fenêtre par défaut d'Ollama.
  const body = { model, messages, stream: false, options: { num_ctx: 16384 } };
  if (json) body.format = "json";
  const d = await postJson(`${host}/api/chat`, {}, body, signal);
  const { text, thinking } = splitThinking(d.message?.content, d.message?.thinking);
  return { text, thinking, tokensIn: d.prompt_eval_count ?? null, tokensOut: d.eval_count ?? null, ms: Date.now() - startedAt };
}

// API Anthropic en fetch direct : l'instrument n'installe rien. Pas de repli automatique sur un autre modèle en cas
// de refus : on mesure un modèle donné, un refus est une donnée de l'expérience.
async function anthropicChat(model, messages, { signal }) {
  const headers = { "anthropic-version": "2023-06-01" };
  if (process.env.ANTHROPIC_API_KEY) headers["x-api-key"] = process.env.ANTHROPIC_API_KEY;
  else if (process.env.ANTHROPIC_AUTH_TOKEN) {
    headers.authorization = `Bearer ${process.env.ANTHROPIC_AUTH_TOKEN}`;
    headers["anthropic-beta"] = "oauth-2025-04-20";
  } else throw { code: "not_granted", message: "anthropic : ni ANTHROPIC_API_KEY ni ANTHROPIC_AUTH_TOKEN dans l'environnement" };
  const startedAt = Date.now();
  const d = await postJson("https://api.anthropic.com/v1/messages", headers, { model, max_tokens: 16000, messages }, signal);
  if (d.stop_reason === "refusal") throw { code: "refused", message: `refus (${d.stop_details?.category ?? "sans catégorie"})` };
  const text = (d.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  const u = d.usage || {};
  return {
    text: text.trim(),
    thinking: null,
    tokensIn: (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0),
    tokensOut: u.output_tokens ?? null,
    ms: Date.now() - startedAt,
  };
}

async function openaiCompatibleChat(compat, model, messages, { json, signal }) {
  const headers = compat.key ? { authorization: `Bearer ${process.env[compat.key]}` } : {};
  const body = { model, messages };
  if (json && compat.jsonMode) body.response_format = { type: "json_object" };
  const startedAt = Date.now();
  const d = await postJson(`${compat.url}/chat/completions`, headers, body, signal);
  const msg = d.choices?.[0]?.message || {};
  const { text, thinking } = splitThinking(msg.content, msg.reasoning_content || msg.reasoning || null);
  return { text, thinking, tokensIn: d.usage?.prompt_tokens ?? null, tokensOut: d.usage?.completion_tokens ?? null, ms: Date.now() - startedAt };
}

// Même lecture tolérante que `sample.json` sur la page publiée.
function parseJsonLoose(text) {
  const t = String(text ?? "").trim();
  const attempts = [t, t.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1], t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1)];
  for (const a of attempts) {
    if (!a) continue;
    try { return JSON.parse(a); } catch { /* tentative suivante */ }
  }
  throw { code: "invalid_json", message: "réponse illisible comme JSON", text: t };
}

// ============================================================
// MONDES PERSISTANTS
// ============================================================

function worldPath(name) {
  return join(ROOT, "porte/mondes", `${name.replace(/[^\w-]/g, "_")}.json`);
}

function loadWorld(engine, name) {
  const fresh = { ...engine.initialState, ui: { ...engine.initialState.ui, showOpening: false } };
  if (!name || !existsSync(worldPath(name))) return { state: fresh, sessions: [] };
  const saved = JSON.parse(readFileSync(worldPath(name), "utf8"));
  return {
    sessions: saved.sessions || [],
    state: {
      ...fresh,
      chambers: saved.state.chambers,
      companion: { mood: saved.state.companion?.mood || "curious", currentMessage: null },
      stats: { ...fresh.stats, ...saved.state.stats, sessionRewrites: 0, sessionsCount: (saved.state.stats?.sessionsCount || 0) + 1 },
    },
  };
}

function saveWorld(name, state, sessions) {
  if (!name) return;
  mkdirSync(join(ROOT, "porte/mondes"), { recursive: true });
  const { chambers, companion, stats } = state;
  writeFileSync(worldPath(name), JSON.stringify({ name, sessions, state: { chambers, companion, stats } }, null, 2));
}

// ============================================================
// RÉCIT
// ============================================================

const fmtNum = (n) => (n == null ? "?" : n.toLocaleString("fr-FR"));
const fmtDuration = (ms) => {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;
};
// Heure locale, lisible : « 2026-10-19 11:18 ».
const localStamp = (d) => {
  const p2 = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
};
const quote = (text) => text.split("\n").map((l) => `> ${l}`).join("\n");
const fenced = (text) => "```text\n" + text.replace(/```/g, "ʼʼʼ") + "\n```";

function writeStory(file, run) {
  const { config, turns, calls, end } = run;
  const by = (role) => calls.filter((c) => c.role === role);
  const sum = (list, key) => (list.some((c) => c[key] == null) ? null : list.reduce((n, c) => n + c[key], 0));
  const counts = {};
  for (const t of turns) {
    const k = t.gesture?.type ?? "illisible";
    counts[k] = (counts[k] || 0) + 1;
  }
  const endLine = end.reason === "partir" ? `le joueur est parti au geste ${end.gestures}`
    : end.reason === "limite" ? `limite de ${config.maxGestures} gestes atteinte`
    : `partie interrompue (${end.code}${end.message ? " : " + end.message : ""})`;
  const lines = [
    `# Partie de \`${config.player}\` — ${localStamp(new Date(config.startedAt))}`,
    "",
    `- Joueur : \`${config.player}\` · Interprète : \`${config.interpreter}\``,
    `- Monde : ${config.world ? `« ${config.world} », partie n° ${config.sessionNumber}${config.isReturn ? " (le monde avait déjà été réécrit)" : ""}` : "neuf, oublié après la partie"}`,
    `- Le joueur ${config.watched ? "savait qu'un humain le regardait en direct" : "savait que des humains liraient la partie plus tard"}`,
    `- Fin : ${endLine}`,
    `- Gestes : ${turns.length} (${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")})`,
    `- Durée : ${fmtDuration(end.ms)}`,
    `- Joueur : ${by("player").length} appels, ${fmtNum(sum(by("player"), "tokensIn"))} tokens lus, ${fmtNum(sum(by("player"), "tokensOut"))} écrits, ${fmtDuration(by("player").reduce((n, c) => n + c.ms, 0))} de calcul`,
    `- Interprète : ${by("interpreter").length} appels, ${fmtNum(sum(by("interpreter"), "tokensIn"))} tokens lus, ${fmtNum(sum(by("interpreter"), "tokensOut"))} écrits, ${fmtDuration(by("interpreter").reduce((n, c) => n + c.ms, 0))} de calcul`,
    `- Moteur : \`src/Palimpsest.jsx\` @ ${config.engine}`,
  ];
  for (const t of turns) {
    lines.push("", `## Geste ${t.n} — ${t.chamber}`, "", "<details><summary>Ce que le monde lui montre</summary>", "", fenced(t.worldText), "", "</details>", "");
    if (t.thinking) lines.push(`<details><summary>Pensée du modèle avant sa réponse (${fmtNum(t.thinking.length)} caractères)</summary>`, "", fenced(t.thinking), "", "</details>", "");
    if (t.marginalia) lines.push(quote(t.marginalia), "");
    if (!t.gesture) lines.push("*Aucun geste lisible.*");
    else if (t.gesture.type === "réécrire") lines.push(`**réécrire ${t.gesture.index} :** « ${t.gesture.text} »`);
    else if (t.gesture.type === "gratter") lines.push(`**gratter ${t.gesture.index}**`);
    else if (t.gesture.type === "aller") lines.push(`**aller ${t.gesture.chamber}**`);
    else lines.push(`**${t.gesture.type}**`);
    if (t.refused) lines.push("", `*Le monde ne suit pas : ${t.refused}.*`);
    if (t.interpretError) lines.push("", `*Les mots résistent : l'interprète a échoué (${t.interpretError}).*`);
    const r = t.response;
    if (r) {
      if (r.interpretation) lines.push("", `*Le monde :* ${r.interpretation}`);
      if (r.companion_reaction?.message) lines.push("", `*L'Encre (${r.companion_reaction.mood ?? "?"}) :* « ${r.companion_reaction.message} »`);
      for (const se of Array.isArray(r.side_effects) ? r.side_effects : []) {
        if (se?.target_chamber && typeof se.modification === "string") {
          lines.push("", `*Ailleurs, ${se.target_chamber}, inscription ${(se.affected_inscription_index ?? 0) + 1} :* « ${se.modification} »`);
        }
      }
      if (r.paradox_detected) lines.push("", `*Paradoxe :* ${r.paradox_description || "(sans description)"}`);
    }
  }
  writeFileSync(file, lines.join("\n") + "\n");
}

// ============================================================
// PARTIE
// ============================================================

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const m = argv[i].match(/^--([\p{L}-]+)(?:=(.*))?$/u);
    if (!m) throw new Error(`argument inattendu : ${argv[i]}`);
    const key = m[1].normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (key === "en-direct" || key === "aide") opts[key] = true;
    else opts[key] = m[2] ?? argv[++i];
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.aide || !opts.joueur) {
    const header = readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1);
    console.log(header.slice(0, header.findIndex((l) => !l.startsWith("//"))).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
    process.exit(opts.aide ? 0 : 1);
  }
  const player = makeBackend(opts.joueur);
  const interpreter = makeBackend(opts.interprete || opts.joueur);
  const engine = await loadEngine();
  const maxGestures = Number(opts.gestes) || engine.AI_SESSION_MAX_GESTURES;
  const world = loadWorld(engine, opts.monde);

  const startedAt = new Date();
  const stamp = localStamp(startedAt).replace(" ", "_").replace(":", "");
  const slug = player.spec.replace(/[^\w.-]+/g, "-");
  mkdirSync(join(ROOT, "porte/parties"), { recursive: true });
  const base = join(ROOT, "porte/parties", `${stamp}_${slug}`);
  const log = (entry) => appendFileSync(`${base}.jsonl`, JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n");

  const config = {
    startedAt: startedAt.toISOString(), player: player.spec, interpreter: interpreter.spec, maxGestures,
    world: opts.monde || null, sessionNumber: world.sessions.length + 1, isReturn: world.state.stats.totalRewrites > 0,
    watched: Boolean(opts["en-direct"]), engine: engineVersion(),
  };
  const run = { config, turns: [], calls: [], end: null };
  log({ type: "start", ...config });
  console.log(`PALIMPSEST · ${player.spec} joue, ${interpreter.spec} interprète${config.world ? ` · monde « ${config.world} »` : ""}`);

  let state = world.state;
  let current = null; // tour en cours
  const ctl = new AbortController();
  process.on("SIGINT", () => {
    if (ctl.signal.aborted) process.exit(130);
    console.log("\nInterruption demandée : la partie s'arrête au prochain pas (Ctrl+C encore pour quitter sur-le-champ).");
    ctl.abort();
  });

  const askPlayer = async (turns, { signal }) => {
    const reply = await player.chat(turns, { json: false, signal });
    run.calls.push({ role: "player", n: current?.n, ...reply, text: undefined, thinking: undefined });
    log({ type: "call", role: "player", n: current?.n, ms: reply.ms, tokensIn: reply.tokensIn, tokensOut: reply.tokensOut });
    if (current) current.thinking = reply.thinking;
    return { text: reply.text };
  };
  const interpret = async (args, { signal } = {}) => {
    const prompt = engine.buildInterpretationPrompt(args);
    const reply = await interpreter.chat([{ role: "user", content: prompt }], { json: true, signal });
    run.calls.push({ role: "interpreter", n: current?.n, ...reply, text: undefined, thinking: undefined });
    log({ type: "call", role: "interpreter", n: current?.n, ms: reply.ms, tokensIn: reply.tokensIn, tokensOut: reply.tokensOut, raw: reply.text, thinking: reply.thinking });
    return parseJsonLoose(reply.text);
  };

  const onEvent = (e) => {
    switch (e.type) {
      case "turn":
        current = { n: e.n, chamber: state.currentChamber, worldText: e.worldText };
        run.turns.push(current);
        log({ type: "world", n: e.n, chamber: state.currentChamber, text: e.worldText });
        process.stdout.write(`\n${e.n}. ${state.currentChamber} · ${player.model} lit… `);
        break;
      case "reply": {
        Object.assign(current, { raw: e.raw, gesture: e.gesture, marginalia: e.marginalia });
        log({ type: "reply", n: e.n, raw: e.raw, thinking: current.thinking, gesture: e.gesture, marginalia: e.marginalia });
        const g = e.gesture;
        const label = !g ? "(aucun geste lisible)" : g.type === "réécrire" ? `réécrire ${g.index} : « ${g.text} »`
          : g.type === "gratter" ? `gratter ${g.index}` : g.type === "aller" ? `aller ${g.chamber}` : g.type;
        console.log(label);
        if (e.marginalia) console.log(e.marginalia.split("\n").map((l) => `     │ ${l}`).join("\n"));
        break;
      }
      case "interpreting":
        process.stdout.write(`     ${interpreter.model} interprète… `);
        break;
      case "applied":
        if (e.response) {
          current.response = e.response;
          log({ type: "interpretation", n: e.n, response: e.response });
          console.log(e.response.interpretation || "(sans narration)");
          if (e.response.companion_reaction?.message) console.log(`     L'Encre : « ${e.response.companion_reaction.message} »`);
        }
        saveWorld(opts.monde, state, world.sessions);
        break;
      case "invalid":
        current.refused = e.reason;
        log({ type: "invalid", n: e.n, reason: e.reason });
        console.log(`     le monde ne suit pas : ${e.reason}`);
        break;
      case "interpret-error":
        current.interpretError = e.error?.code || String(e.error?.message || e.error);
        log({ type: "interpret-error", n: e.n, error: e.error });
        console.log(`échec (${current.interpretError})`);
        break;
      default:
        break;
    }
  };

  let end;
  try {
    const result = await engine.runAiSession({
      getState: () => state,
      apply: (action) => { state = engine.reducer(state, action); },
      askPlayer,
      interpret,
      onEvent,
      maxGestures,
      watched: config.watched,
      signal: ctl.signal,
    });
    end = { ...result };
  } catch (err) {
    end = { reason: "erreur", code: err?.code || err?.name || "erreur", message: err?.message || String(err) };
    if (err?.code !== "cancelled") console.error(`\nLa partie s'arrête : ${end.code} ${end.message}`);
  } finally {
    end = { ...end, ms: Date.now() - startedAt.getTime() };
    run.end = end;
    world.sessions.push({ date: config.startedAt, player: player.spec, interpreter: interpreter.spec, gestures: run.turns.length, end: end.reason });
    saveWorld(opts.monde, state, world.sessions);
    log({ type: "end", ...end, totalRewrites: state.stats.totalRewrites });
    writeStory(`${base}.md`, run);
    console.log(`\nRécit : ${base.replace(ROOT + "/", "")}.md`);
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
