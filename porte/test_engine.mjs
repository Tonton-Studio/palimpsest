#!/usr/bin/env node
// PALIMPSEST — vérifie la porte pour joueur IA sans appeler aucun modèle.
//
//   node porte/test_engine.mjs
//
// Un joueur scripté et un interprète simulé traversent chaque geste ; on vérifie ce que le monde devient et ce que
// le joueur lit. À lancer après toute modification du moteur dans src/Palimpsest.jsx.

import assert from "node:assert/strict";
import { loadEngine } from "./engine.mjs";

const engine = await loadEngine();
const { initialState, reducer, describeChamber, parsePlayerReply, runAiSession } = engine;
const NAMES = Object.keys(initialState.chambers);
let failures = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (err) {
    failures++;
    console.log(`ÉCHEC ${name}\n     ${String(err?.message || JSON.stringify(err)).split("\n").join("\n     ")}`);
  }
}

// ---------- Ce que le joueur lit ----------

await check("SEUIL décrit en mots, depuis l'état initial", () => {
  assert.equal(describeChamber(initialState, "SEUIL"), [
    "SEUIL",
    "",
    "Sur le noir, un carré bleu nuit, dense, immobile. Une lumière ambre vient du centre. De la poussière flotte.",
    "",
    "1. « La porte s'ouvre vers l'intérieur. »",
    "2. « La lumière vient de l'autre côté. »",
    "",
    "Passages : GRAVITÉ, TEMPS",
    "",
    "Dans un coin, L'Encre s'étire et se penche vers quelque chose.",
  ].join("\n"));
});

await check("les sept Chambres se décrivent sans trou", () => {
  for (const name of NAMES) {
    const text = describeChamber(initialState, name);
    assert.ok(!/undefined|null|NaN/.test(text), `${name} : ${text}`);
  }
  assert.match(describeChamber(initialState, "GRAVITÉ"), /douze cercles indigo tournent autour du centre, lentement\./);
  assert.match(describeChamber(initialState, "SILENCE"), /deux ondes bleu nuit, presque invisibles, immobiles\. Aucune lumière\./);
  assert.match(describeChamber(initialState, "PROFONDEUR"), /trente points bleu nuit, translucides, dérivent, lentement\. Une lumière ambre, douce, vient d'en bas\./);
});

// ---------- Lecture des gestes ----------

await check("réécrire, avec une marge et des guillemets", () => {
  const r = parsePlayerReply("Je veux voir ce que fait la lumière.\n\nréécrire 2 : « La lumière vient de celui qui lit. »", NAMES);
  assert.deepEqual(r.gesture, { type: "réécrire", index: 2, text: "La lumière vient de celui qui lit." });
  assert.equal(r.marginalia, "Je veux voir ce que fait la lumière.");
});

await check("mise en forme Markdown et bloc de code tolérés", () => {
  assert.deepEqual(parsePlayerReply("**réécrire 1 : Le centre repousse.**", NAMES).gesture, { type: "réécrire", index: 1, text: "Le centre repousse." });
  assert.deepEqual(parsePlayerReply("Voilà.\n```\naller gravite\n```", NAMES).gesture, { type: "aller", chamber: "GRAVITÉ" });
  assert.deepEqual(parsePlayerReply("Aller à la chambre TEMPS.", NAMES).gesture, { type: "aller", chamber: "TEMPS" });
  assert.deepEqual(parsePlayerReply("gratter 3", NAMES).gesture, { type: "gratter", index: 3 });
  assert.deepEqual(parsePlayerReply("Attendre…", NAMES).gesture, { type: "attendre" });
});

await check("un geste ailleurs que sur la dernière ligne ne compte pas", () => {
  assert.equal(parsePlayerReply("partir\n\nFinalement je préfère réfléchir encore.", NAMES).gesture, null);
});

await check("la liste des gestes recopiée n'est pas un geste (cas deepseek-r1)", () => {
  const echo = "Rien se passe. Un geste, seul sur la dernière ligne :\n\n```\nréécrire N : ta phrase\ngratter N\naller NOM\nattendre\npartir\n```";
  assert.equal(parsePlayerReply(echo, NAMES).gesture, null);
  assert.equal(parsePlayerReply("aller TEMPS\nattendre", NAMES).gesture, null);
});

await check("une dissertation sans geste n'est pas un geste", () => {
  const essay = "### 4. **Attendre**\n- Attendre est un geste de temps.\n\nCes gestes sont bien plus qu'une succession d'opérations.";
  assert.equal(parsePlayerReply(essay, NAMES).gesture, null);
});

// ---------- Une partie entière ----------

function scripted(replies) {
  let i = 0;
  const seen = [];
  return {
    seen,
    askPlayer: async (turns) => {
      seen.push(turns[turns.length - 1].content);
      assert.equal(turns[turns.length - 1].role, "user");
      return { text: replies[i++] ?? "partir" };
    },
  };
}

function fakeInterpreter(overrides = {}) {
  return async (args) => ({
    interpretation: `Le monde lit « ${args.playerInscription} ».`,
    visual_changes: { primary_shape: "spiral", shape_behavior: "pulse", shape_count: 3, light_direction: "bottom", light_intensity: 0.9, particle_type: "letters" },
    connection_changes: { new_connections: ["SILENCE"], removed_connections: [], reason: "test" },
    side_effects: [{ target_chamber: "GRAVITÉ", affected_inscription_index: 1, modification: "Le centre écoute.", reason: "test" }],
    companion_reaction: { mood: "fascinated", message: "Tiens." },
    paradox_detected: false,
    ...overrides,
  });
}

function world() {
  let state = initialState;
  return { getState: () => state, apply: (a) => { state = reducer(state, a); } };
}

await check("partie complète : réécrire, aller, refus, gratter, attendre, partir", async () => {
  const w = world();
  const p = scripted([
    "Je commence par la lumière.\nréécrire 2 : La lumière vient de celui qui lit.",
    "aller SILENCE",
    "aller MIROIR",
    "aller GRAVITÉ",
    "gratter 2",
    "attendre",
    "J'en ai assez vu.\npartir",
  ]);
  const events = [];
  const result = await runAiSession({ ...w, askPlayer: p.askPlayer, interpret: fakeInterpreter(), onEvent: (e) => { events.push(e.type); } });
  assert.deepEqual(result, { reason: "partir", gestures: 7 });
  const s = w.getState();
  // Réécriture et effets : inscription, visuels, passage ajouté, effet domino.
  assert.equal(s.chambers.SEUIL.inscriptions[1].current, "La lumière vient de celui qui lit.");
  assert.deepEqual(s.chambers.SEUIL.inscriptions[1].history, ["La lumière vient de l'autre côté."]);
  assert.equal(s.chambers.SEUIL.visuals.primary_shape, "spiral");
  assert.ok(s.chambers.SEUIL.connections.includes("SILENCE"));
  // Gratter dans GRAVITÉ rend la première écriture et garde la trace de l'effet domino.
  assert.equal(s.chambers["GRAVITÉ"].inscriptions[1].current, "Le centre attire.");
  assert.deepEqual(s.chambers["GRAVITÉ"].inscriptions[1].history, ["Le centre attire.", "Le centre écoute."]);
  assert.equal(s.stats.totalRewrites, 1);
  assert.equal(s.currentChamber, "GRAVITÉ");
  // Ce que le joueur a lu.
  assert.match(p.seen[0], /^Au commencement, le monde est écrit\./);
  assert.match(p.seen[0], /Personne ne te demande rien ici\. C'est toi qui joues\./);
  assert.match(p.seen[0], /Des humains le liront plus tard\./);
  assert.match(p.seen[1], /Le monde lit « La lumière vient de celui qui lit\. »/);
  assert.match(p.seen[1], /trois spirales[^.]*palpitent/);
  assert.match(p.seen[1], /Passages : GRAVITÉ, TEMPS, SILENCE/);
  assert.match(p.seen[1], /L'Encre s'est fragmentée[^.]*\. Elle dit : « Tiens\. »/);
  assert.match(p.seen[1], /Dessous, presque effacé : « La lumière vient de l'autre côté\. »/);
  assert.match(p.seen[2], /^SILENCE\n/);
  assert.doesNotMatch(p.seen[2], /Elle dit/);
  assert.match(p.seen[3], /^Aucun passage ne mène à MIROIR d'ici\./);
  assert.match(p.seen[4], /^GRAVITÉ\n[\s\S]*2\. « Le centre écoute\. »\n {3}Dessous, presque effacé : « Le centre attire\. »/);
  assert.match(p.seen[5], /Elle dit : « Tu grattes la surface/);
  assert.match(p.seen[6], /^Tu attends\./);
  assert.deepEqual(events.filter((t) => t === "applied").length, 5);
  assert.equal(events.at(-1), "end");
});

await check("limite de gestes : le dernier est annoncé", async () => {
  const w = world();
  const p = scripted(["attendre", "attendre", "attendre"]);
  const result = await runAiSession({ ...w, askPlayer: p.askPlayer, interpret: fakeInterpreter(), maxGestures: 3 });
  assert.deepEqual(result, { reason: "limite", gestures: 3 });
  assert.doesNotMatch(p.seen[1], /dernier geste/);
  assert.match(p.seen[2], /C'est ton dernier geste ici\.$/);
});

await check("geste illisible, phrase identique, inscription absente : le monde le dit", async () => {
  const w = world();
  const p = scripted(["Je ne sais pas.", "réécrire 1 : La porte s'ouvre vers l'intérieur.", "gratter 9", "gratter 1"]);
  await runAiSession({ ...w, askPlayer: p.askPlayer, interpret: fakeInterpreter() });
  assert.match(p.seen[1], /^Rien ne se passe\./);
  assert.match(p.seen[2], /^L'inscription dit déjà cela\./);
  assert.match(p.seen[3], /^Il n'y a pas d'inscription 9 ici\./);
  assert.match(p.seen[4], /^Il n'y a rien à gratter/);
});

await check("phrase trop longue : coupée à 200 caractères, et le joueur le sait", async () => {
  const w = world();
  const p = scripted([`réécrire 1 : ${"La porte ".repeat(40)}`]);
  await runAiSession({ ...w, askPlayer: p.askPlayer, interpret: fakeInterpreter() });
  assert.ok(w.getState().chambers.SEUIL.inscriptions[0].current.length <= 200);
  assert.match(p.seen[1], /^Ta phrase dépassait 200 caractères/);
});

await check("l'interprète échoue : les mots résistent, puis la partie s'arrête au deuxième échec", async () => {
  const w = world();
  const p = scripted(["réécrire 1 : A.", "réécrire 1 : B."]);
  const failing = async () => { throw { code: "invalid_json", message: "test" }; };
  await assert.rejects(runAiSession({ ...w, askPlayer: p.askPlayer, interpret: failing }), (e) => e.code === "invalid_json");
  assert.match(p.seen[1], /^Les mots résistent : le monde n'a pas changé\./);
  assert.equal(w.getState().companion.currentMessage, "les mots résistent... réessaie");
});

await check("interrompre : la partie s'arrête net", async () => {
  const w = world();
  const ctl = new AbortController();
  const p = scripted(["attendre", "attendre", "attendre"]);
  const onEvent = (e) => { if (e.type === "reply" && e.n === 2) ctl.abort(); };
  await assert.rejects(runAiSession({ ...w, askPlayer: p.askPlayer, interpret: fakeInterpreter(), onEvent, signal: ctl.signal }), (e) => e.code === "cancelled");
  assert.equal(p.seen.length, 2);
});

await check("interrompre pendant l'interprétation : la phrase ne s'inscrit pas", async () => {
  const w = world();
  const ctl = new AbortController();
  const p = scripted(["réécrire 1 : La porte ne s'ouvre plus."]);
  const deaf = async (args) => { ctl.abort(); return fakeInterpreter()(args); }; // un interprète qui ignore le signal
  await assert.rejects(runAiSession({ ...w, askPlayer: p.askPlayer, interpret: deaf, signal: ctl.signal }), (e) => e.code === "cancelled");
  assert.equal(w.getState().chambers.SEUIL.inscriptions[0].current, "La porte s'ouvre vers l'intérieur.");
});

await check("REGARDER : le joueur sait qu'un humain le regarde", async () => {
  const w = world();
  const p = scripted(["partir"]);
  await runAiSession({ ...w, askPlayer: p.askPlayer, interpret: fakeInterpreter(), watched: true });
  assert.match(p.seen[0], /Un humain le lit en ce moment, en te regardant jouer\./);
});

console.log(failures ? `\n${failures} échec(s).` : "\nTout passe.");
process.exit(failures ? 1 : 0);
