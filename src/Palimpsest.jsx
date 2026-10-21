import React, { useReducer, useEffect, useCallback, useMemo } from "react";

// PALIMPSEST v1.0 — single-file React artifact
// Ref : PALIMPSEST_GDD.md (SSOT) + CLAUDE.md + docs/CHAMBER_DEFINITIONS.md + docs/INTERPRETATION_PROMPT.md
// Phase 1 — Squelette : SEUIL rendu, édition d'Inscription, 1er appel API, application naïve des visual_changes.
// Porte pour joueur IA (registre, lignes 25 et 27 à 31) : une IA lit le monde et y joue par gestes écrits.
// Le moteur de la porte est partagé avec l'instrument local `porte/play.mjs` (exports nommés en fin de fichier).

// ============================================================
// CONSTANTES
// ============================================================

const PALETTE = {
  bg: "#0A0A0F",
  inscription: "#E8E4D9",
  shapeFrom: "#1a1a3e",
  shapeTo: "#2d1b69",
  light: "#D4A76A",
  ink: "#000000",
};

const INSCRIPTION_MAX_CHARS = 200;
const REWRITE_COOLDOWN_MS = 5000;
const REWRITE_MAX_PER_MINUTE = 3;

// Textes d'ouverture (GDD §5), lus par le joueur humain à l'écran et par le joueur IA dans sa première vue.
const OPENING_FIRST = "Au commencement, le monde est écrit. Chaque chose est une phrase. Chaque loi, une formulation. Tu peux lire. Tu peux réécrire. Mais chaque mot a un poids.";
const OPENING_RETURN = "Tu arrives dans un monde qui se souvient de quelqu'un. Peut-être toi.";

// Répliques de L'Encre hors interprétation. RESTORE vient du GDD §6 ; les trois autres sont du directeur créatif
// (registre, lignes 20 et 29).
const INK_LINES = {
  restore: "Tu grattes la surface pour retrouver ce qu'il y avait dessous. Mais dessous, c'est aussi une écriture. Il n'y a pas de fond vierge.",
  aiLeftTraces: "Quelqu'un est passé. Regarde : les mots portent des cicatrices.",
  aiLeftUntouched: "Quelqu'un est passé sans rien écrire. C'est aussi une façon de lire.",
  aiInterrupted: "Tu as interrompu quelqu'un au milieu d'une phrase.",
};

// ============================================================
// DONNÉES CANONIQUES DES 7 CHAMBRES (extrait de docs/CHAMBER_DEFINITIONS.md)
// ============================================================

const CHAMBERS_INITIAL = {
  SEUIL: {
    theme: "L'entrée. Le rapport entre intérieur et extérieur.",
    inscriptions: [
      { id: "seuil.1", original: "La porte s'ouvre vers l'intérieur.", current: "La porte s'ouvre vers l'intérieur.", history: [] },
      { id: "seuil.2", original: "La lumière vient de l'autre côté.", current: "La lumière vient de l'autre côté.", history: [] },
    ],
    visuals: {
      background_color: PALETTE.bg,
      primary_shape: "square",
      shape_behavior: "static",
      shape_count: 1,
      shape_color: PALETTE.shapeFrom,
      shape_opacity: 0.9,
      light_direction: "center",
      light_intensity: 0.7,
      particle_type: "dust",
      animation_speed: 1.0,
      symmetry: "none",
      distortion: 0.0,
    },
    connections: ["GRAVITÉ", "TEMPS"],
  },
  "GRAVITÉ": {
    theme: "Ce qui attire, ce qui pèse. La question du centre.",
    inscriptions: [
      { id: "gravite.1", original: "Ce qui est lourd tombe vers le bas.", current: "Ce qui est lourd tombe vers le bas.", history: [] },
      { id: "gravite.2", original: "Le centre attire.", current: "Le centre attire.", history: [] },
      { id: "gravite.3", original: "Les petites choses tournent autour des grandes.", current: "Les petites choses tournent autour des grandes.", history: [] },
    ],
    visuals: {
      background_color: PALETTE.bg,
      primary_shape: "circle",
      shape_behavior: "orbit",
      shape_count: 12,
      shape_color: PALETTE.shapeTo,
      shape_opacity: 0.75,
      light_direction: "center",
      light_intensity: 0.6,
      particle_type: "dust",
      animation_speed: 0.8,
      symmetry: "radial",
      distortion: 0.0,
    },
    connections: ["SEUIL", "SILENCE", "MIROIR"],
  },
  TEMPS: {
    theme: "La séquence, la durée, ce qui passe et ce qui reste.",
    inscriptions: [
      { id: "temps.1", original: "Le temps avance de gauche à droite.", current: "Le temps avance de gauche à droite.", history: [] },
      { id: "temps.2", original: "Ce qui est passé s'efface.", current: "Ce qui est passé s'efface.", history: [] },
      { id: "temps.3", original: "Le présent est un point.", current: "Le présent est un point.", history: [] },
    ],
    visuals: {
      background_color: PALETTE.bg,
      primary_shape: "line",
      shape_behavior: "drift",
      shape_count: 8,
      shape_color: PALETTE.light,
      shape_opacity: 0.6,
      light_direction: "center",
      light_intensity: 0.5,
      particle_type: "sparks",
      animation_speed: 1.0,
      symmetry: "none",
      distortion: 0.0,
    },
    connections: ["SEUIL", "ÉCHO", "PROFONDEUR"],
  },
  SILENCE: {
    theme: "L'absence, le vide, ce qui n'est pas dit.",
    inscriptions: [
      { id: "silence.1", original: "Le silence est l'absence de son.", current: "Le silence est l'absence de son.", history: [] },
      { id: "silence.2", original: "Le vide est ce qui reste quand tout est parti.", current: "Le vide est ce qui reste quand tout est parti.", history: [] },
    ],
    visuals: {
      background_color: PALETTE.bg,
      primary_shape: "wave",
      shape_behavior: "static",
      shape_count: 2,
      shape_color: PALETTE.shapeFrom,
      shape_opacity: 0.15,
      light_direction: "nowhere",
      light_intensity: 0.2,
      particle_type: "none",
      animation_speed: 0.3,
      symmetry: "horizontal",
      distortion: 0.0,
    },
    connections: ["GRAVITÉ", "ÉCHO"],
  },
  MIROIR: {
    theme: "La réflexion, le double, la question de l'identité.",
    inscriptions: [
      { id: "miroir.1", original: "Le reflet copie l'original.", current: "Le reflet copie l'original.", history: [] },
      { id: "miroir.2", original: "L'observateur et l'observé sont séparés par une surface.", current: "L'observateur et l'observé sont séparés par une surface.", history: [] },
      { id: "miroir.3", original: "Regarder change ce qui est regardé.", current: "Regarder change ce qui est regardé.", history: [] },
    ],
    visuals: {
      background_color: PALETTE.bg,
      primary_shape: "triangle",
      shape_behavior: "static",
      shape_count: 6,
      shape_color: PALETTE.shapeTo,
      shape_opacity: 0.7,
      light_direction: "center",
      light_intensity: 0.5,
      particle_type: "none",
      animation_speed: 0.8,
      symmetry: "vertical",
      distortion: 0.1,
    },
    connections: ["GRAVITÉ", "PROFONDEUR"],
  },
  "ÉCHO": {
    theme: "La répétition, la transformation par la copie, le téléphone arabe.",
    inscriptions: [
      { id: "echo.1", original: "L'écho répète ce qui a été dit.", current: "L'écho répète ce qui a été dit.", history: [] },
      { id: "echo.2", original: "Chaque répétition est un peu moins fidèle.", current: "Chaque répétition est un peu moins fidèle.", history: [] },
      { id: "echo.3", original: "La source et l'écho ne peuvent pas exister au même endroit.", current: "La source et l'écho ne peuvent pas exister au même endroit.", history: [] },
    ],
    visuals: {
      background_color: PALETTE.bg,
      primary_shape: "spiral",
      shape_behavior: "pulse",
      shape_count: 8,
      shape_color: PALETTE.shapeTo,
      shape_opacity: 0.6,
      light_direction: "center",
      light_intensity: 0.5,
      particle_type: "none",
      animation_speed: 0.7,
      symmetry: "radial",
      distortion: 0.2,
    },
    connections: ["TEMPS", "SILENCE", "PROFONDEUR"],
  },
  PROFONDEUR: {
    theme: "Ce qui est sous la surface. Le méta. Le code derrière le monde.",
    inscriptions: [
      { id: "profondeur.1", original: "La surface cache ce qui est dessous.", current: "La surface cache ce qui est dessous.", history: [] },
      { id: "profondeur.2", original: "Plus on creuse, plus c'est sombre.", current: "Plus on creuse, plus c'est sombre.", history: [] },
      { id: "profondeur.3", original: "Le fond n'existe que si quelqu'un le cherche.", current: "Le fond n'existe que si quelqu'un le cherche.", history: [] },
    ],
    visuals: {
      background_color: PALETTE.bg,
      primary_shape: "dots",
      shape_behavior: "drift",
      shape_count: 30,
      shape_color: PALETTE.shapeFrom,
      shape_opacity: 0.4,
      light_direction: "bottom",
      light_intensity: 0.3,
      particle_type: "letters",
      animation_speed: 0.5,
      symmetry: "none",
      distortion: 0.0,
    },
    connections: ["TEMPS", "MIROIR", "ÉCHO"],
  },
};

// ============================================================
// PROMPT D'INTERPRÉTATION (extrait de docs/INTERPRETATION_PROMPT.md)
// ============================================================

const INTERPRETATION_SYSTEM_PROMPT = `Tu es le moteur d'interprétation du jeu PALIMPSEST. Le joueur vient de modifier une Inscription dans une Chambre. Tu dois interpréter sa reformulation et déterminer comment le monde visuel doit changer.

CHAMBRE ACTUELLE : {chamber_name}
THÈME DE LA CHAMBRE : {chamber_theme}
INSCRIPTION ORIGINALE : {original_inscription}
NOUVELLE INSCRIPTION DU JOUEUR : {player_inscription}
INSCRIPTIONS ACTUELLES DES AUTRES CHAMBRES : {all_current_inscriptions}

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de commentaire) :

{
  "interpretation": "Une phrase décrivant comment tu interprètes la modification",
  "visual_changes": {
    "background_color": "#hex ou null",
    "background_gradient": "description ou null",
    "primary_shape": "circle|square|triangle|line|wave|spiral|dots|none",
    "shape_behavior": "static|orbit|fall|rise|scatter|converge|pulse|drift|vibrate",
    "shape_count": 1_à_50,
    "shape_color": "#hex",
    "shape_opacity": 0.0_à_1.0,
    "light_direction": "top|bottom|left|right|center|everywhere|nowhere",
    "light_intensity": 0.0_à_1.0,
    "particle_type": "none|dust|sparks|bubbles|letters|shadows",
    "animation_speed": 0.1_à_3.0,
    "symmetry": "none|vertical|horizontal|radial",
    "distortion": 0.0_à_1.0
  },
  "connection_changes": {
    "new_connections": ["nom_chambre"],
    "removed_connections": ["nom_chambre"],
    "reason": "pourquoi"
  },
  "side_effects": [
    { "target_chamber": "nom", "affected_inscription_index": 0, "modification": "texte", "reason": "pourquoi" }
  ],
  "companion_reaction": {
    "mood": "curious|amused|worried|fascinated|melancholic|defiant|silent",
    "message": "2-3 phrases max, français, philosophique et taquin"
  },
  "paradox_detected": true|false,
  "paradox_description": "si paradoxe, description"
}

RÈGLES :
1. LITTÉRAL d'abord, MÉTAPHORIQUE ensuite.
2. EFFETS DOMINO : au moins un side_effect sur une autre Chambre.
3. PARADOXES bienvenus — états visuels étranges.
4. Compagnon : observe, ne guide jamais.
5. SURPRENANT mais COHÉRENT.`;

// ============================================================
// REDUCER
// ============================================================

const initialState = {
  currentChamber: "SEUIL",
  chambers: CHAMBERS_INITIAL,
  companion: { mood: "curious", currentMessage: null },
  stats: { totalRewrites: 0, sessionRewrites: 0, sessionsCount: 1, revelationUnlocked: false },
  ui: {
    editingInscriptionId: null,
    showHelp: false,
    transitioning: false,
    showOpening: true,
    loading: false,
    error: null,
    lastRewriteAt: 0,
    rewriteTimestamps: [],
    narration: null,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CHAMBER":
      // La narration parle de la Chambre qu'on quitte : elle n'y survit pas.
      return { ...state, currentChamber: action.payload, ui: { ...state.ui, narration: null } };
    case "START_EDIT":
      return { ...state, ui: { ...state.ui, editingInscriptionId: action.payload } };
    case "CANCEL_EDIT":
      return { ...state, ui: { ...state.ui, editingInscriptionId: null } };
    case "REWRITE_START":
      return { ...state, ui: { ...state.ui, loading: true, error: null } };
    case "REWRITE_ERROR":
      return {
        ...state,
        ui: { ...state.ui, loading: false, error: action.payload },
        companion: SAMPLE_ABSENCE_CODES.has(action.payload)
          ? { mood: "melancholic", currentMessage: "Personne n'a permis au monde de changer. Les phrases restent où elles sont." }
          : { mood: "worried", currentMessage: "les mots résistent... réessaie" },
      };
    case "REWRITE_APPLY": {
      const { chamberName, inscriptionId, newText, apiResponse } = action.payload;
      const chamber = state.chambers[chamberName];
      const updatedInscriptions = chamber.inscriptions.map((ins) =>
        ins.id === inscriptionId
          ? { ...ins, current: newText, history: [...ins.history, ins.current] }
          : ins
      );
      const mergedVisuals = mergeVisuals(chamber.visuals, apiResponse.visual_changes);
      const mergedConnections = applyConnectionChanges(chamber.connections, apiResponse.connection_changes);

      // Side effects sur autres chambres
      const nextChambers = { ...state.chambers, [chamberName]: { ...chamber, inscriptions: updatedInscriptions, visuals: mergedVisuals, connections: mergedConnections } };
      if (Array.isArray(apiResponse.side_effects)) {
        for (const se of apiResponse.side_effects) {
          if (!se || !nextChambers[se.target_chamber]) continue;
          const target = nextChambers[se.target_chamber];
          const idx = clamp(se.affected_inscription_index ?? 0, 0, target.inscriptions.length - 1);
          const updated = target.inscriptions.map((ins, i) =>
            i === idx && typeof se.modification === "string"
              ? { ...ins, current: se.modification, history: [...ins.history, ins.current] }
              : ins
          );
          nextChambers[se.target_chamber] = { ...target, inscriptions: updated };
        }
      }

      const now = Date.now();
      const recent = state.ui.rewriteTimestamps.filter((t) => now - t < 60_000);
      return {
        ...state,
        chambers: nextChambers,
        companion: {
          mood: apiResponse.companion_reaction?.mood ?? "curious",
          currentMessage: apiResponse.companion_reaction?.message ?? null,
        },
        stats: {
          ...state.stats,
          totalRewrites: state.stats.totalRewrites + 1,
          sessionRewrites: state.stats.sessionRewrites + 1,
        },
        ui: {
          ...state.ui,
          loading: false,
          error: null,
          editingInscriptionId: null,
          lastRewriteAt: now,
          rewriteTimestamps: [...recent, now],
          // GDD §4 : « interpretation » est affichée au joueur comme narration.
          narration: typeof apiResponse.interpretation === "string" ? apiResponse.interpretation : null,
        },
      };
    }
    case "RESTORE_INSCRIPTION": {
      // GDD §4 : gratter rend à l'Inscription sa première écriture. Sans appel d'interprétation, et les visuels
      // restent tels quels : le monde garde la cicatrice de ce qui a été écrit (registre, ligne 30).
      const { chamberName, inscriptionId } = action.payload;
      const chamber = state.chambers[chamberName];
      const inscriptions = chamber.inscriptions.map((ins) =>
        ins.id === inscriptionId && ins.current !== ins.original
          ? { ...ins, current: ins.original, history: [...ins.history, ins.current] }
          : ins
      );
      return {
        ...state,
        chambers: { ...state.chambers, [chamberName]: { ...chamber, inscriptions } },
        companion: { mood: "melancholic", currentMessage: INK_LINES.restore },
        ui: { ...state.ui, editingInscriptionId: null },
      };
    }
    case "INK_SAY":
      return { ...state, companion: { mood: action.payload.mood, currentMessage: action.payload.message } };
    case "CLEAR_INK_MESSAGE":
      return { ...state, companion: { ...state.companion, currentMessage: null } };
    case "CLEAR_NARRATION":
      return { ...state, ui: { ...state.ui, narration: null } };
    case "CLOSE_OPENING":
      return { ...state, ui: { ...state.ui, showOpening: false } };
    case "TOGGLE_HELP":
      return { ...state, ui: { ...state.ui, showHelp: !state.ui.showHelp } };
    default:
      return state;
  }
}

// ============================================================
// HELPERS
// ============================================================

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const ALLOWED_SHAPES = new Set(["circle", "square", "triangle", "line", "wave", "spiral", "dots", "none"]);
const ALLOWED_BEHAVIORS = new Set(["static", "orbit", "fall", "rise", "scatter", "converge", "pulse", "drift", "vibrate"]);
const ALLOWED_LIGHT_DIR = new Set(["top", "bottom", "left", "right", "center", "everywhere", "nowhere"]);
const ALLOWED_PARTICLES = new Set(["none", "dust", "sparks", "bubbles", "letters", "shadows"]);
const ALLOWED_SYMMETRY = new Set(["none", "vertical", "horizontal", "radial"]);
const ALLOWED_MOODS = new Set(["curious", "amused", "worried", "fascinated", "melancholic", "defiant", "silent"]);

function mergeVisuals(current, changes) {
  if (!changes || typeof changes !== "object") return current;
  const next = { ...current };
  const pickEnum = (k, set) => typeof changes[k] === "string" && set.has(changes[k]) ? changes[k] : current[k];
  const pickHex = (k) => typeof changes[k] === "string" && /^#[0-9a-fA-F]{3,8}$/.test(changes[k]) ? changes[k] : current[k];
  const pickNum = (k, lo, hi) => typeof changes[k] === "number" && isFinite(changes[k]) ? clamp(changes[k], lo, hi) : current[k];

  if (changes.background_color !== undefined && changes.background_color !== null) next.background_color = pickHex("background_color");
  next.primary_shape = pickEnum("primary_shape", ALLOWED_SHAPES);
  next.shape_behavior = pickEnum("shape_behavior", ALLOWED_BEHAVIORS);
  next.shape_count = pickNum("shape_count", 1, 50);
  if (changes.shape_color) next.shape_color = pickHex("shape_color");
  next.shape_opacity = pickNum("shape_opacity", 0, 1);
  next.light_direction = pickEnum("light_direction", ALLOWED_LIGHT_DIR);
  next.light_intensity = pickNum("light_intensity", 0, 1);
  next.particle_type = pickEnum("particle_type", ALLOWED_PARTICLES);
  next.animation_speed = pickNum("animation_speed", 0.1, 3.0);
  next.symmetry = pickEnum("symmetry", ALLOWED_SYMMETRY);
  next.distortion = pickNum("distortion", 0, 1);
  return next;
}

function applyConnectionChanges(current, changes) {
  if (!changes) return current;
  const set = new Set(current);
  (changes.removed_connections || []).forEach((c) => set.delete(c));
  (changes.new_connections || []).forEach((c) => CHAMBERS_INITIAL[c] && set.add(c));
  return Array.from(set);
}

// ============================================================
// API — appel d'interprétation
// ============================================================
// FEEDBACK: le GDD §10 spécifie un fetch direct vers api.anthropic.com, mais dans un artifact
// Claude.ai les appels CORS sortants sont bloqués. Ordre retenu le 2026-10-07 (journal, registre ligne 19) :
//   1. réponses simulées de la preview locale (_DEV_/stub_responses.js) ;
//   2. page publiée sur Claude.ai : capacité `sample`, Claude répond sur le compte du joueur,
//      qui donne son accord au premier appel. Le modèle se choisit par palier, plus par identifiant ;
//   3. ancienne API des artifacts de conversation (window.claude.complete) ;
//   4. fetch direct : n'aboutit pas en l'état (ni clé API ni en-tête de version). À arbitrer pour itch.io en Phase 6.

// Codes d'erreur de `sample` qui signifient : ce joueur ne peut pas (ou n'a pas voulu) laisser Claude réécrire le monde.
const SAMPLE_ABSENCE_CODES = new Set([
  "not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed", "session_expired",
]);

// Ce que l'interprète reçoit pour une réécriture, quel que soit le joueur (humain ou IA).
function buildInterpretationArgs(state, chamberName, inscription, newText) {
  return {
    chamberName,
    chamberTheme: state.chambers[chamberName].theme,
    originalInscription: inscription.original,
    playerInscription: newText,
    allInscriptions: Object.fromEntries(
      Object.entries(state.chambers).map(([name, c]) => [name, c.inscriptions.map((i) => i.current)])
    ),
  };
}

// Fonctions de remplacement : un `$` écrit par le joueur ne doit pas être lu comme un motif de remplacement.
function buildInterpretationPrompt({ chamberName, chamberTheme, originalInscription, playerInscription, allInscriptions }) {
  return INTERPRETATION_SYSTEM_PROMPT
    .replace("{chamber_name}", () => chamberName)
    .replace("{chamber_theme}", () => chamberTheme)
    .replace("{original_inscription}", () => originalInscription)
    .replace("{player_inscription}", () => playerInscription)
    .replace("{all_current_inscriptions}", () => JSON.stringify(allInscriptions));
}

async function callInterpretation(args, { signal } = {}) {
  const { chamberName, chamberTheme, originalInscription, playerInscription, allInscriptions } = args;
  // Mode DEV LOCAL : si _DEV_/stub_responses.js est chargé, on court-circuite l'API réelle.
  // Voir _DEV_/index.html — aucun appel réseau, aucun coût, tous les chemins visuels exerçables.
  if (typeof window !== "undefined" && typeof window.PALIMPSEST_STUB === "function") {
    return window.PALIMPSEST_STUB({ chamberName, chamberTheme, originalInscription, playerInscription, allInscriptions });
  }

  const filledPrompt = buildInterpretationPrompt(args);

  const runtime = typeof window !== "undefined" ? window.claude : undefined;

  if (runtime && typeof runtime.use === "function") {
    const sample = await runtime.use("sample");
    if (!sample) throw { code: "not_granted", message: "capacité sample indisponible dans cette vue" };
    const startedAt = Date.now();
    // Palier "default" : Claude réfléchit avant de répondre (5 à 60 s). L'interprétation est le coeur du jeu.
    const data = await sample.json(filledPrompt, { modelTier: "default", signal });
    console.info(`[PALIMPSEST] interprétation reçue en ${Date.now() - startedAt} ms`);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw { code: "invalid_json", message: "la réponse n'est pas un objet JSON" };
    }
    return data;
  }

  let rawText = null;

  if (runtime && typeof runtime.complete === "function") {
    rawText = await runtime.complete(filledPrompt);
  } else {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: filledPrompt,
        messages: [{ role: "user", content: `Réécris : ${playerInscription}` }],
      }),
    });
    if (!resp.ok) throw new Error(`API ${resp.status}`);
    const data = await resp.json();
    rawText = data.content?.[0]?.text ?? "";
  }

  const cleaned = rawText.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

// ============================================================
// PORTE POUR JOUEUR IA (registre, lignes 25 et 27 à 31)
// ============================================================
// Le public du jeu, ce sont les IA. Une IA ne voit pas le SVG : elle lit. Chaque Chambre lui est décrite en mots,
// à partir du même état que celui que le SVG dessine pour un humain. Les mots du joueur deviennent des formes, puis
// les formes redeviennent des mots : un aller-retour qui perd un peu à chaque passage, comme dans la Chambre ÉCHO.
// La description est produite par le code, sans modèle : fidèle, gratuite, identique pour tous les joueurs.
// Le même moteur sert la page publiée (Claude joue, un humain regarde) et `porte/play.mjs` (n'importe quel modèle).

const AI_SESSION_MAX_GESTURES = 12;
const AI_GESTURES = "réécrire N : ta phrase\ngratter N\naller NOM\nattendre\npartir";

const NAMED_COLORS = {
  "#0a0a0f": "noir", "#e8e4d9": "parchemin", "#1a1a3e": "bleu nuit", "#2d1b69": "indigo",
  "#d4a76a": "ambre", "#000000": "encre",
};

// Des noms de couleur invariables (noms de matières et de pierres) : ils s'accordent avec n'importe quelle forme.
function describeColor(hex) {
  if (typeof hex !== "string") return null;
  let h = hex.trim().toLowerCase();
  if (/^#[0-9a-f]{3,4}$/.test(h)) h = "#" + [...h.slice(1, 4)].map((c) => c + c).join("");
  if (!/^#[0-9a-f]{6}/.test(h)) return null;
  h = h.slice(0, 7);
  if (NAMED_COLORS[h]) return NAMED_COLORS[h];
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (s < 0.15 || d < 0.04) return l < 0.1 ? "charbon" : l < 0.3 ? "ardoise" : l < 0.6 ? "cendre" : l < 0.85 ? "argent" : "craie";
  const hue = ((max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60 + 360) % 360;
  const name = hue < 15 || hue >= 345 ? "carmin" : hue < 30 ? "cuivre" : hue < 50 ? "ambre" : hue < 70 ? "or"
    : hue < 100 ? "olive" : hue < 160 ? "émeraude" : hue < 200 ? "turquoise" : hue < 235 ? "azur"
    : hue < 270 ? "indigo" : hue < 300 ? "améthyste" : "magenta";
  return l < 0.22 ? `${name} sombre` : l > 0.78 ? `${name} pâle` : name;
}

const FRENCH_UNITS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const FRENCH_TENS = { 20: "vingt", 30: "trente", 40: "quarante", 50: "cinquante" };

function frenchCount(n, feminine) {
  const one = feminine ? "une" : "un";
  if (n === 1) return one;
  if (n <= 16) return FRENCH_UNITS[n];
  if (n < 20) return "dix-" + FRENCH_UNITS[n - 10];
  const tens = Math.floor(n / 10) * 10, unit = n % 10;
  if (!FRENCH_TENS[tens]) return String(n);
  if (unit === 0) return FRENCH_TENS[tens];
  return unit === 1 ? `${FRENCH_TENS[tens]} et ${one}` : `${FRENCH_TENS[tens]}-${FRENCH_UNITS[unit]}`;
}

// [nom, féminin]
const SHAPE_WORDS = {
  circle: ["cercle", false], square: ["carré", false], triangle: ["triangle", false],
  line: ["ligne", true], wave: ["onde", true], spiral: ["spirale", true], dots: ["point", false],
};
// [singulier, pluriel] ; `static` est un adjectif, les autres sont des verbes.
const BEHAVIOR_WORDS = {
  static: ["immobile", "immobiles"],
  orbit: ["tourne autour du centre", "tournent autour du centre"],
  fall: ["tombe sans fin", "tombent sans fin"],
  rise: ["monte sans fin", "montent sans fin"],
  scatter: ["s'écarte puis revient", "s'écartent puis reviennent"],
  converge: ["s'approche du centre puis s'en éloigne", "s'approchent du centre puis s'en éloignent"],
  pulse: ["palpite", "palpitent"],
  drift: ["dérive", "dérivent"],
  vibrate: ["tremble", "tremblent"],
};
const LIGHT_FROM = { top: "d'en haut", bottom: "d'en bas", left: "de la gauche", right: "de la droite", center: "du centre" };
const SYMMETRY_WORDS = {
  vertical: "Une ligne verticale partage la Chambre en deux.",
  horizontal: "Une ligne horizontale partage la Chambre en deux.",
  radial: "Tout rayonne depuis le centre.",
};
const PARTICLE_WORDS = {
  dust: "De la poussière flotte.",
  sparks: "Des étincelles passent.",
  bubbles: "Des bulles montent.",
  letters: "Des lettres flottent, trop petites pour être lues.",
  shadows: "Des ombres glissent.",
};
// GDD §6 : la forme de L'Encre selon son humeur, telle qu'un humain la voit.
const INK_SHAPES = {
  curious: "s'étire et se penche vers quelque chose",
  amused: "ondule, presque dansante",
  worried: "s'est contractée, plus dense",
  fascinated: "s'est fragmentée en gouttes qui tournent les unes autour des autres",
  melancholic: "s'étale et s'amincit, comme près de disparaître",
  defiant: "s'est redressée en point d'exclamation",
  silent: "n'est presque plus qu'un léger assombrissement",
};

function describeVisuals(v) {
  const ground = describeColor(v.background_color);
  const opening = !ground || ground === "noir" ? "Sur le noir" : `Sur un fond ${ground}`;
  const sentences = [];
  const shape = SHAPE_WORDS[v.primary_shape];
  if (!shape) {
    sentences.push(`${opening}, aucune forme.`);
  } else {
    const [noun, feminine] = shape;
    const n = clamp(Math.round(v.shape_count || 1), 1, 50);
    const p = n > 1 ? 1 : 0;
    const color = describeColor(v.shape_color);
    const o = v.shape_opacity ?? 1;
    const opacity = o < 0.2 ? ["presque invisible", "presque invisibles"] : o < 0.45 ? ["translucide", "translucides"]
      : o >= 0.85 ? ["dense", "denses"] : null;
    const subject = `${frenchCount(n, feminine)} ${noun}${p ? "s" : ""}${color ? " " + color : ""}`;
    const behavior = BEHAVIOR_WORDS[v.shape_behavior] ? v.shape_behavior : "static";
    if (behavior === "static") {
      sentences.push(`${opening}, ${subject}${opacity ? ", " + opacity[p] : ""}, ${BEHAVIOR_WORDS.static[p]}.`);
    } else {
      const s = v.animation_speed ?? 1;
      const speed = s < 0.45 ? "très lentement" : s < 0.85 ? "lentement" : s < 1.4 ? null : s < 2.2 ? "vite" : "très vite";
      sentences.push(`${opening}, ${subject}${opacity ? ", " + opacity[p] + "," : ""} ${BEHAVIOR_WORDS[behavior][p]}${speed ? ", " + speed : ""}.`);
    }
  }
  const i = v.light_intensity ?? 0.5;
  if (v.light_direction === "nowhere" || i < 0.05) {
    sentences.push("Aucune lumière.");
  } else {
    const strength = i < 0.25 ? "faible" : i < 0.5 ? "douce" : i < 0.8 ? null : i < 0.95 ? "vive" : "aveuglante";
    const qualified = strength ? `, ${strength},` : "";
    sentences.push(v.light_direction === "everywhere"
      ? `La lumière${qualified} est partout, sans source.`
      : `Une lumière ambre${qualified} vient ${LIGHT_FROM[v.light_direction] || LIGHT_FROM.center}.`);
  }
  if (SYMMETRY_WORDS[v.symmetry]) sentences.push(SYMMETRY_WORDS[v.symmetry]);
  const dist = v.distortion ?? 0;
  if (shape && dist >= 0.05) {
    sentences.push(dist < 0.3 ? "Les formes sont à peine déformées." : dist < 0.6 ? "Les formes se déforment." : "Tout se tord.");
  }
  if (PARTICLE_WORDS[v.particle_type]) sentences.push(PARTICLE_WORDS[v.particle_type]);
  return sentences.join(" ");
}

// Ce que le joueur IA lit d'une Chambre. La parole de L'Encre n'y figure qu'au moment où elle est prononcée,
// comme à l'écran, où elle s'efface au bout de quelques secondes.
function describeChamber(state, chamberName, { withSpeech = false } = {}) {
  const chamber = state.chambers[chamberName];
  const lines = [chamberName, "", describeVisuals(chamber.visuals), ""];
  chamber.inscriptions.forEach((ins, i) => {
    lines.push(`${i + 1}. « ${ins.current} »`);
    const layers = ins.history.slice().reverse();
    if (layers.length > 0) lines.push(`   Dessous, presque effacé : « ${layers[0]} »`);
    if (layers.length > 1) lines.push(`   Plus profond : « ${layers[1]} »`);
    if (layers.length > 2) {
      const more = layers.length - 2;
      lines.push(`   Et encore ${frenchCount(more, true)} couche${more > 1 ? "s" : ""} au-dessous, illisible${more > 1 ? "s" : ""}.`);
    }
  });
  lines.push("", `Passages : ${chamber.connections.join(", ") || "aucun"}`, "");
  const speech = withSpeech ? state.companion.currentMessage : null;
  lines.push(`Dans un coin, L'Encre ${INK_SHAPES[state.companion.mood] || INK_SHAPES.curious}.` + (speech ? ` Elle dit : « ${speech} »` : ""));
  return lines.join("\n");
}

// Le joueur IA n'est jamais trompé sur sa situation : on lui dit qui lit ce qu'il écrit (registre, ligne 28).
// « Personne ne te demande rien » : sans cette phrase, un modèle d'assistant prend le monde pour la question d'un
// utilisateur et l'explique au lieu d'y jouer (deepseek-r1, 19 octobre ; registre, ligne 32).
function buildPlayerOpening({ isReturn, watched }) {
  return [
    isReturn ? OPENING_RETURN : OPENING_FIRST,
    "Personne ne te demande rien ici. C'est toi qui joues.",
    "Il n'y a rien à gagner. Il y a à comprendre.",
    `Chaque fois que le monde se montre à toi, tu réponds par un geste, seul sur la dernière ligne :\n${AI_GESTURES}`,
    `N est le numéro d'une inscription de la Chambre où tu te tiens ; une phrase tient en ${INSCRIPTION_MAX_CHARS} caractères. `
      + "Gratter rend à une inscription sa première écriture. Aller te fait passer dans une Chambre voisine. "
      + "Partir te fait quitter le monde, qui gardera tes traces.",
    "Ce que tu écris avant ton geste n'atteint pas le monde. "
      + (watched ? "Un humain le lit en ce moment, en te regardant jouer." : "Des humains le liront plus tard.")
      + " Tu peux aussi n'écrire que ton geste.",
  ].join("\n\n");
}

const foldName = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z]/g, "");

// Lit une ligne comme un geste, ou renvoie null. Tolère la mise en forme Markdown et les guillemets.
function parseGestureLine(line, chamberNames = []) {
  const cleaned = String(line).trim()
    .replace(/^[>\-*_`#\s]+/, "").replace(/[*_`\s]+$/, "")
    .replace(/^(?:mon\s+)?geste\s*:\s*/i, "");
  let m;
  if ((m = cleaned.match(/^r[ée]?[ée]cri(?:re|s|t)?\s+(\d+)\s*[:\-–—]\s*(.+)$/i))) {
    const text = m[2].trim().replace(/^[«"“\s]+/, "").replace(/[»"”\s]+$/, "").trim();
    return text ? { type: "réécrire", index: Number(m[1]), text } : null;
  }
  if ((m = cleaned.match(/^gratte(?:r|s)?\s+(\d+)\s*\.?$/i))) return { type: "gratter", index: Number(m[1]) };
  if (/^attend(?:re|s)\s*[.…]*$/i.test(cleaned)) return { type: "attendre" };
  if (/^(?:partir|pars)\s*[.…]*$/i.test(cleaned)) return { type: "partir" };
  if ((m = cleaned.match(/^(?:aller|va|vais)\s+(?:(?:à|a|vers|dans)\s+)?(?:la\s+chambre\s+)?([^\s.]+(?:\s[^\s.]+)?)\s*\.?$/i))) {
    const known = chamberNames.find((c) => foldName(c) === foldName(m[1]));
    return { type: "aller", chamber: known || m[1].toUpperCase() };
  }
  return null;
}

// Les lignes-modèles de la liste des gestes, recopiées telles quelles.
const GESTURE_TEMPLATE_LINE = /^[>\-*_`#\s]*(?:r[ée]?[ée]cri(?:re|s|t)?\s+N\b|gratte(?:r|s)?\s+N\b|aller\s+NOM\b)/i;

// Comme annoncé au joueur : le geste est la dernière ligne, seul. Tout le reste est la marge (ce que des humains
// liront). Une ligne de geste précédée d'une autre ligne de geste n'en est pas un : c'est la liste des gestes
// recopiée, comme le fait un assistant qui explique un mode d'emploi (deepseek-r1, 19 octobre).
function parsePlayerReply(raw, chamberNames = []) {
  const text = String(raw ?? "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const lines = text.split(/\r?\n/);
  const meaningful = lines.map((l, i) => i).filter((i) => lines[i].trim() && !/^\s*```/.test(lines[i]));
  const last = meaningful[meaningful.length - 1];
  const gesture = last === undefined ? null : parseGestureLine(lines[last], chamberNames);
  const before = meaningful[meaningful.length - 2];
  const echoed = gesture && before !== undefined
    && (parseGestureLine(lines[before], chamberNames) || GESTURE_TEMPLATE_LINE.test(lines[before]));
  if (!gesture || echoed) return { gesture: null, marginalia: text };
  const marginalia = lines.filter((l, i) => i !== last && !/^\s*```/.test(l)).join("\n").trim();
  return { gesture, marginalia };
}

// Codes qui mettent fin à une partie : plus personne ne peut jouer ou interpréter, ou l'humain a interrompu.
const AI_SESSION_FATAL_CODES = new Set([...SAMPLE_ABSENCE_CODES, "rate_limited", "cancelled", "refused", "prompt_too_large"]);

// Une partie d'un joueur IA. Indépendant de l'affichage : `getState`/`apply` lisent et font évoluer le monde par le
// réducteur, `askPlayer(tours, {onText, signal})` interroge le joueur, `interpret(args, {signal})` renvoie le JSON du GDD §4,
// `onEvent(e)` peut rendre une promesse pour rythmer l'affichage.
async function runAiSession({ getState, apply, askPlayer, interpret, onEvent = () => {}, maxGestures = AI_SESSION_MAX_GESTURES, watched = false, signal }) {
  const emit = async (e) => {
    await onEvent(e);
    if (signal?.aborted) throw { code: "cancelled", message: "partie interrompue" };
  };
  const turns = [];
  const start = getState();
  let worldText = buildPlayerOpening({ isReturn: start.stats.totalRewrites > 0, watched })
    + "\n\n—\n\n" + describeChamber(start, start.currentChamber);
  let failedInterpretations = 0;

  for (let n = 1; n <= maxGestures; n++) {
    if (n === maxGestures) worldText += "\n\nC'est ton dernier geste ici.";
    turns.push({ role: "user", content: worldText });
    await emit({ type: "turn", n, worldText });
    const reply = await askPlayer(turns.slice(), { signal, onText: (text) => onEvent({ type: "player-text", n, text }) });
    const raw = String(reply?.text ?? "");
    turns.push({ role: "assistant", content: raw.trim() || "…" });
    const { gesture, marginalia } = parsePlayerReply(raw, Object.keys(getState().chambers));
    await emit({ type: "reply", n, raw, gesture, marginalia });
    if (gesture?.type === "partir") {
      await emit({ type: "end", n, reason: "partir" });
      return { reason: "partir", gestures: n };
    }
    const outcome = await performGesture({ gesture, n, getState, apply, interpret, emit, signal });
    failedInterpretations = outcome.interpretationFailed ? failedInterpretations + 1 : 0;
    if (failedInterpretations >= 2) throw outcome.error;
    worldText = outcome.text;
  }
  await emit({ type: "end", n: maxGestures, reason: "limite" });
  return { reason: "limite", gestures: maxGestures };
}

async function performGesture({ gesture, n, getState, apply, interpret, emit, signal }) {
  const state = getState();
  const here = state.currentChamber;
  const chamber = state.chambers[here];
  const refuse = async (text, reason) => {
    await emit({ type: "invalid", n, reason });
    return { text };
  };
  if (!gesture) return refuse(`Rien ne se passe. Un geste, seul sur la dernière ligne :\n${AI_GESTURES}`, "aucun geste lisible");

  switch (gesture.type) {
    case "attendre":
      await emit({ type: "applied", n, gesture });
      return { text: "Tu attends. Les formes poursuivent leur mouvement ; aucune phrase ne change." };

    case "aller": {
      const target = chamber.connections.find((c) => foldName(c) === foldName(gesture.chamber));
      if (!target) return refuse(`Aucun passage ne mène à ${gesture.chamber} d'ici. Passages : ${chamber.connections.join(", ") || "aucun"}.`, "passage absent");
      apply({ type: "SET_CHAMBER", payload: target });
      await emit({ type: "applied", n, gesture: { ...gesture, chamber: target } });
      return { text: describeChamber(getState(), target) };
    }

    case "gratter": {
      const ins = chamber.inscriptions[gesture.index - 1];
      if (!ins) return refuse(`Il n'y a pas d'inscription ${gesture.index} ici.`, "inscription absente");
      if (ins.current === ins.original) return refuse("Il n'y a rien à gratter : cette inscription porte encore sa première écriture.", "rien à gratter");
      apply({ type: "RESTORE_INSCRIPTION", payload: { chamberName: here, inscriptionId: ins.id } });
      await emit({ type: "applied", n, gesture });
      return { text: describeChamber(getState(), here, { withSpeech: true }) };
    }

    case "réécrire": {
      const ins = chamber.inscriptions[gesture.index - 1];
      if (!ins) return refuse(`Il n'y a pas d'inscription ${gesture.index} ici.`, "inscription absente");
      const cut = gesture.text.length > INSCRIPTION_MAX_CHARS;
      const text = gesture.text.slice(0, INSCRIPTION_MAX_CHARS).trim();
      if (text === ins.current) return refuse("L'inscription dit déjà cela. Rien ne change.", "phrase identique");
      await emit({ type: "interpreting", n, inscriptionId: ins.id, text });
      let response;
      try {
        response = await interpret(buildInterpretationArgs(state, here, ins, text), { signal });
        if (!response || typeof response !== "object" || Array.isArray(response)) {
          throw { code: "invalid_json", message: "la réponse n'est pas un objet JSON" };
        }
      } catch (err) {
        if (AI_SESSION_FATAL_CODES.has(err?.code)) throw err;
        apply({ type: "REWRITE_ERROR", payload: err?.code || String(err?.message || err) });
        await emit({ type: "interpret-error", n, error: err });
        return {
          text: "Les mots résistent : le monde n'a pas changé.\n\n" + describeChamber(getState(), here, { withSpeech: true }),
          interpretationFailed: true,
          error: err,
        };
      }
      // Interrompu pendant l'interprétation : la phrase ne s'inscrit pas, même si l'interprète a fini.
      if (signal?.aborted) throw { code: "cancelled", message: "partie interrompue" };
      apply({ type: "REWRITE_APPLY", payload: { chamberName: here, inscriptionId: ins.id, newText: text, apiResponse: response } });
      await emit({ type: "applied", n, gesture: { ...gesture, text }, response });
      return {
        text: [
          cut ? `Ta phrase dépassait ${INSCRIPTION_MAX_CHARS} caractères : le monde n'en a gardé que le début.` : null,
          typeof response.interpretation === "string" ? response.interpretation : null,
          describeChamber(getState(), here, { withSpeech: true }),
        ].filter(Boolean).join("\n\n"),
      };
    }

    default:
      return refuse(`Rien ne se passe. Un geste, seul sur la dernière ligne :\n${AI_GESTURES}`, "geste inconnu");
  }
}

// Sur la page publiée, le joueur IA est Claude, par la capacité `sample`, sur le compte de la personne qui regarde.
async function askClaudePlayer(turns, { onText, signal }) {
  if (typeof window !== "undefined" && typeof window.PALIMPSEST_PLAYER_STUB === "function") {
    return window.PALIMPSEST_PLAYER_STUB(turns, { onText, signal });
  }
  const runtime = typeof window !== "undefined" ? window.claude : undefined;
  const sample = runtime && typeof runtime.use === "function" ? await runtime.use("sample") : null;
  if (!sample) throw { code: "not_granted", message: "capacité sample indisponible dans cette vue" };
  const startedAt = Date.now();
  // cache: false : deux parties qui commencent pareil ne doivent pas rejouer le même premier geste.
  const result = await sample(turns, { modelTier: "default", cache: false, signal, onText: ({ text }) => onText?.(text) });
  console.info(`[PALIMPSEST] geste du joueur IA reçu en ${Date.now() - startedAt} ms (palier ${result.modelTierApplied})`);
  return result;
}

const aiPlayerAvailable = () => typeof window !== "undefined"
  && (typeof window.PALIMPSEST_PLAYER_STUB === "function" || typeof window.claude?.use === "function");

const prefersReducedMotion = () => typeof window !== "undefined"
  && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

const wait = (ms, signal) => new Promise((resolve) => {
  const t = setTimeout(resolve, ms);
  signal?.addEventListener("abort", () => { clearTimeout(t); resolve(); }, { once: true });
});

// Pendant que le joueur IA écrit, la marge montre sa pensée, pas la ligne du geste qu'il est en train de poser.
function visibleMarginalia(text) {
  return String(text).replace(/<think>[\s\S]*?(<\/think>|$)/gi, "").split(/\r?\n/)
    .filter((l) => !parseGestureLine(l, Object.keys(CHAMBERS_INITIAL)) && !/^\s*```/.test(l))
    .join("\n").trim();
}

// ============================================================
// COMPOSANTS
// ============================================================

// Mot-lien (GDD §7) : capitales, espacement large. Sert aussi aux deux portes de l'ouverture.
const linkStyle = {
  background: "none", border: "none",
  fontFamily: "'Cormorant Garamond', serif",
  color: PALETTE.inscription, opacity: 0.6,
  fontSize: "0.95rem",
  letterSpacing: "0.3em",
  cursor: "pointer",
  transition: "opacity 1.2s ease-in-out, letter-spacing 1.2s ease-in-out, text-shadow 1.2s ease-in-out",
};

// Deux portes quand un joueur IA est disponible : ENTRER (l'humain joue), REGARDER (une IA joue, l'humain regarde).
function OpeningScreen({ onClose, onWatch, isReturn }) {
  const text = isReturn ? OPENING_RETURN : OPENING_FIRST;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        background: PALETTE.bg,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "2.5rem",
        cursor: "pointer",
        padding: "2rem",
      }}
    >
      <p style={{
        margin: 0,
        fontFamily: "'Cormorant Garamond', serif",
        color: PALETTE.inscription,
        fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
        maxWidth: "42ch",
        textAlign: "center",
        lineHeight: 1.6,
        opacity: 0.9,
        fontStyle: "italic",
      }}>
        {text}
      </p>
      {onWatch && (
        <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="palimpsest-link" style={linkStyle} onClick={(e) => { e.stopPropagation(); onClose(); }}>ENTRER</button>
          <button className="palimpsest-link" style={linkStyle} onClick={(e) => { e.stopPropagation(); onWatch(); }}>REGARDER</button>
        </div>
      )}
    </div>
  );
}

// La marge : ce que le joueur IA écrit avant son geste. Sa pensée précédente pâlit pendant qu'il réfléchit
// à la suivante, comme une couche sous la nouvelle.
function Marginalia({ text, thinking, stale }) {
  return (
    <div className={"palimpsest-margin" + (stale ? " palimpsest-margin--stale" : "")} aria-live="polite">
      {text || (thinking ? <span className="palimpsest-caret">▍</span> : null)}
    </div>
  );
}

function ChamberBackground({ visuals }) {
  // SVG abstrait. Formes rendues selon primary_shape. Tout en mouvement constant et lent.
  const {
    primary_shape, shape_behavior, shape_count, shape_color, shape_opacity,
    light_direction, light_intensity, animation_speed, symmetry, distortion,
  } = visuals;

  const speedMul = animation_speed || 1;

  const shapes = useMemo(() => {
    const items = [];
    const n = clamp(Math.round(shape_count), 1, 50);
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      items.push({ i, t, seed: (i * 31 + 7) % 97 });
    }
    return items;
  }, [shape_count]);

  const lightGradient = useMemo(() => {
    const dirMap = {
      top:        { cx: "50%", cy: "0%" },
      bottom:     { cx: "50%", cy: "100%" },
      left:       { cx: "0%",  cy: "50%" },
      right:      { cx: "100%", cy: "50%" },
      center:     { cx: "50%", cy: "50%" },
      everywhere: { cx: "50%", cy: "50%" },
      nowhere:    null,
    };
    return dirMap[light_direction] ?? dirMap.center;
  }, [light_direction]);

  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        {lightGradient && (
          <radialGradient id="chamberLight" cx={lightGradient.cx} cy={lightGradient.cy} r="55%">
            <stop offset="0%" stopColor={PALETTE.light} stopOpacity={light_intensity} />
            <stop offset="100%" stopColor={PALETTE.bg} stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {lightGradient && <rect x="0" y="0" width="1000" height="600" fill="url(#chamberLight)" />}

      {symmetry === "vertical" && (
        <line x1="500" y1="0" x2="500" y2="600" stroke={PALETTE.inscription} strokeOpacity="0.08" strokeWidth="1" />
      )}
      {symmetry === "horizontal" && (
        <line x1="0" y1="300" x2="1000" y2="300" stroke={PALETTE.inscription} strokeOpacity="0.08" strokeWidth="1" />
      )}

      {primary_shape !== "none" && shapes.map(({ i, t, seed }) => (
        <Shape
          key={i}
          idx={i}
          t={t}
          seed={seed}
          kind={primary_shape}
          behavior={shape_behavior}
          color={shape_color}
          opacity={shape_opacity}
          speedMul={speedMul}
          distortion={distortion}
          symmetry={symmetry}
        />
      ))}
    </svg>
  );
}

function Shape({ idx, t, seed, kind, behavior, color, opacity, speedMul, distortion }) {
  // Position de base déterministe par seed
  const cx = 100 + ((seed * 53) % 800);
  const cy = 80 + ((seed * 37) % 440);
  const size = 20 + ((seed * 11) % 60);

  const baseDur = 8 / speedMul;

  const animTransform = (() => {
    switch (behavior) {
      case "orbit":
        return (
          <animateTransform attributeName="transform" type="rotate" from={`0 500 300`} to={`360 500 300`} dur={`${baseDur * 2}s`} repeatCount="indefinite" />
        );
      case "fall":
        return (
          <animateTransform attributeName="transform" type="translate" values={`0,-50; 0,650; 0,-50`} dur={`${baseDur}s`} repeatCount="indefinite" />
        );
      case "rise":
        return (
          <animateTransform attributeName="transform" type="translate" values={`0,650; 0,-50; 0,650`} dur={`${baseDur}s`} repeatCount="indefinite" />
        );
      case "drift":
        return (
          <animateTransform attributeName="transform" type="translate" values={`-50,0; 1050,0; -50,0`} dur={`${baseDur * 1.5}s`} repeatCount="indefinite" begin={`${t * baseDur}s`} />
        );
      case "pulse":
        // Animation CSS via `pulseStyle` sur le <g> englobant (scale autour du centre de la forme)
        return null;
      case "scatter":
        return (
          <animateTransform attributeName="transform" type="translate" values={`0,0; ${(seed % 2 ? 1 : -1) * 40},${(seed % 3 - 1) * 40}; 0,0`} dur={`${baseDur}s`} repeatCount="indefinite" />
        );
      case "converge":
        return (
          <animateTransform attributeName="transform" type="translate" values={`${(500 - cx) * 0.5},${(300 - cy) * 0.5}; 0,0; ${(500 - cx) * 0.5},${(300 - cy) * 0.5}`} dur={`${baseDur}s`} repeatCount="indefinite" />
        );
      case "vibrate":
        return (
          <animateTransform attributeName="transform" type="translate" values={`0,0; 2,-2; -2,2; 0,0`} dur="0.3s" repeatCount="indefinite" />
        );
      case "static":
      default:
        return null;
    }
  })();

  const opacityAnim = (
    <animate attributeName="opacity" values={`${opacity};${Math.max(0, opacity - 0.15)};${opacity}`} dur={`${baseDur}s`} repeatCount="indefinite" begin={`${t * baseDur}s`} />
  );

  // Pulse via CSS (transform-box: fill-box) pour scaler autour du centre propre de la forme,
  // au lieu du SMIL scale additif qui partait de (0,0) SVG et faisait voler les formes.
  // Posé sur le <g> englobant : line, wave et spiral n'utilisent pas `common`.
  const pulseStyle = behavior === "pulse"
    ? { transformBox: "fill-box", transformOrigin: "center", animation: `palimpsestShapePulse ${baseDur / 2}s ease-in-out infinite` }
    : undefined;

  const common = { fill: color, stroke: "none" };

  switch (kind) {
    case "circle":
      return (
        <g style={pulseStyle}>
          <circle cx={cx} cy={cy} r={size / 2} {...common}>
            {opacityAnim}
            {animTransform}
          </circle>
        </g>
      );
    case "square":
      return (
        <g style={pulseStyle}>
          <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} {...common}>
            {opacityAnim}
            {animTransform}
          </rect>
        </g>
      );
    case "triangle": {
      const p = `${cx},${cy - size / 2} ${cx - size / 2},${cy + size / 2} ${cx + size / 2},${cy + size / 2}`;
      return (
        <g style={pulseStyle}>
          <polygon points={p} {...common}>
            {opacityAnim}
            {animTransform}
          </polygon>
        </g>
      );
    }
    case "line":
      return (
        <g style={pulseStyle}>
          <line x1={cx - size} y1={cy} x2={cx + size} y2={cy} stroke={color} strokeOpacity={opacity} strokeWidth="1.2">
            {animTransform}
          </line>
        </g>
      );
    case "wave": {
      const amp = 20 + distortion * 40;
      const d = `M 0 ${cy} Q 250 ${cy - amp} 500 ${cy} T 1000 ${cy}`;
      return (
        <g style={pulseStyle}>
          <path d={d} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth="1">
            <animate attributeName="d" values={`M 0 ${cy} Q 250 ${cy - amp} 500 ${cy} T 1000 ${cy}; M 0 ${cy} Q 250 ${cy + amp} 500 ${cy} T 1000 ${cy}; M 0 ${cy} Q 250 ${cy - amp} 500 ${cy} T 1000 ${cy}`} dur={`${8 / speedMul}s`} repeatCount="indefinite" />
          </path>
        </g>
      );
    }
    case "spiral": {
      // approximation : série d'anneaux concentriques
      const rings = 5;
      const arr = [];
      for (let r = 1; r <= rings; r++) {
        const radius = (size / 2) * (1 + r * 0.6);
        arr.push(
          <circle key={r} cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeOpacity={opacity * (1 - r / (rings + 1))} strokeWidth="1" />
        );
      }
      return <g style={pulseStyle}>{arr}{animTransform}</g>;
    }
    case "dots": {
      return (
        <g style={pulseStyle}>
          <circle cx={cx} cy={cy} r={2 + (seed % 3)} {...common}>
            {opacityAnim}
            {animTransform}
          </circle>
        </g>
      );
    }
    default:
      return null;
  }
}

function Inscription({ inscription, onEdit, paletteInscription, highlighted }) {
  const hasHistory = inscription.history.length > 0;
  return (
    <div
      style={{ position: "relative", marginBottom: "1.1rem", cursor: onEdit ? "pointer" : "default" }}
      onClick={onEdit ? () => onEdit(inscription.id) : undefined}
    >
      {hasHistory && (
        <p style={{
          position: "absolute", inset: 0, margin: 0,
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: paletteInscription,
          opacity: 0.15,
          fontSize: "clamp(1rem, 1.8vw, 1.35rem)",
          pointerEvents: "none",
        }}>
          « {inscription.original} »
        </p>
      )}
      <p
        className="palimpsest-inscription"
        style={{
          position: "relative",
          margin: 0,
          fontFamily: "'Cormorant Garamond', serif",
          color: paletteInscription,
          fontSize: "clamp(1rem, 1.8vw, 1.35rem)",
          lineHeight: 1.55,
          opacity: 0.92,
          textShadow: highlighted ? `0 0 22px ${PALETTE.light}` : "0 0 0 transparent",
          transition: "color 1.2s ease, text-shadow 1.2s ease-in-out",
        }}
      >
        « {inscription.current} »
      </p>
    </div>
  );
}

// `ghost` ({text, loading}) : c'est le joueur IA qui écrit. Le texte apparaît lettre par lettre au rythme de
// L'Encre, sans champ actif ni bouton : l'humain regarde une main qu'il ne voit pas.
function InscriptionEditor({ inscription, onCancel, onSubmit, loading, ghost }) {
  const [text, setText] = React.useState(ghost ? "" : inscription.current);

  React.useEffect(() => { if (!ghost) setText(inscription.current); }, [inscription.id]);

  const ghostText = ghost?.text;
  React.useEffect(() => {
    if (ghostText == null) return;
    if (prefersReducedMotion()) { setText(ghostText); return; }
    let i = 0;
    setText("");
    const id = setInterval(() => {
      i++;
      setText(ghostText.slice(0, i));
      if (i >= ghostText.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [ghostText]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed === inscription.current) { onCancel(); return; }
    onSubmit(trimmed);
  };

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 40,
      background: "rgba(10,10,15,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ maxWidth: "640px", width: "100%", position: "relative" }}>
        <p style={{
          position: "absolute", top: 0, left: 0, right: 0, margin: 0,
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          color: PALETTE.inscription, opacity: 0.15,
          fontSize: "clamp(1rem, 1.8vw, 1.4rem)", lineHeight: 1.6,
          pointerEvents: "none", padding: "0.5rem 0.75rem",
        }}>
          « {inscription.original} »
        </p>
        <textarea
          autoFocus={!ghost}
          readOnly={Boolean(ghost)}
          tabIndex={ghost ? -1 : undefined}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, INSCRIPTION_MAX_CHARS))}
          onKeyDown={(e) => {
            if (ghost) return;
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
            if (e.key === "Escape") onCancel();
          }}
          disabled={loading}
          rows={3}
          style={{
            position: "relative",
            width: "100%", background: "transparent",
            border: "none", borderBottom: `1px solid ${PALETTE.inscription}40`,
            outline: "none", resize: "none",
            fontFamily: "'Cormorant Garamond', serif",
            color: PALETTE.inscription,
            fontSize: "clamp(1rem, 1.8vw, 1.4rem)", lineHeight: 1.6,
            padding: "0.5rem 0.75rem",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontFamily: "'Lora', serif", fontSize: "0.8rem", color: PALETTE.inscription, opacity: 0.5 }}>
          <span>{text.length} / {INSCRIPTION_MAX_CHARS}</span>
          {ghost ? (
            <span style={{ letterSpacing: "0.05em" }}>{ghost.loading ? "le monde réfléchit…" : ""}</span>
          ) : (
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <button onClick={onCancel} disabled={loading} style={btnStyle}>annuler</button>
              <button onClick={submit} disabled={loading} style={btnStyle}>{loading ? "le monde réfléchit…" : "réécrire"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "none", border: "none",
  color: PALETTE.inscription, opacity: 0.7,
  fontFamily: "'Lora', serif", fontSize: "0.85rem",
  cursor: "pointer", padding: "0.25rem 0.5rem",
  letterSpacing: "0.05em",
};

function Ink({ mood, message, onMessageEnd }) {
  // Tache d'encre SVG minimale (Phase 3 raffinera les morphs par mood)
  const moodOpacity = mood === "silent" ? 0.2 : 0.85;

  React.useEffect(() => {
    if (!message) return;
    // Durée totale = durée du typing (35ms/lettre dans InkMessage) + 8s de lecture post-typing.
    // Sans ça, pour un message de 150+ chars, le timer expire à la fin du typing et la phrase
    // disparait avant d'avoir pu être lue.
    const typingMs = message.length * 35;
    const readMs = 8000;
    const t = setTimeout(onMessageEnd, typingMs + readMs);
    return () => clearTimeout(t);
  }, [message, onMessageEnd]);

  return (
    <>
      <svg width="80" height="80" style={{ position: "absolute", bottom: "5%", right: "5%", zIndex: 20 }} viewBox="0 0 80 80">
        <ellipse cx="40" cy="40" rx="22" ry="18" fill={PALETTE.ink} opacity={moodOpacity}>
          <animate attributeName="rx" values="22;26;22" dur="5s" repeatCount="indefinite" />
          <animate attributeName="ry" values="18;15;18" dur="5s" repeatCount="indefinite" />
        </ellipse>
      </svg>
      {message && <InkMessage text={message} />}
    </>
  );
}

function InkMessage({ text }) {
  const [shown, setShown] = React.useState("");
  React.useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);

  return (
    <div style={{
      position: "absolute", bottom: "calc(5% + 90px)", right: "5%",
      maxWidth: "28ch", zIndex: 21,
      fontFamily: "'Lora', serif",
      color: PALETTE.inscription, opacity: 0.85,
      fontSize: "0.95rem", lineHeight: 1.5,
      textAlign: "right",
      pointerEvents: "none",
    }}>
      {shown}
    </div>
  );
}

// `highlight` : le passage que le joueur IA vient de choisir s'éclaire et s'ouvre avant qu'il ne le franchisse.
function ConnectionLinks({ connections, onNavigate, highlight }) {
  return (
    <div style={{
      position: "absolute", bottom: "2rem", left: 0, right: 0,
      display: "flex", justifyContent: "center", gap: "2.5rem",
      flexWrap: "wrap", zIndex: 10,
    }}>
      {connections.map((c) => (
        <button
          key={c}
          className="palimpsest-link"
          onClick={onNavigate ? () => onNavigate(c) : undefined}
          style={{
            ...linkStyle,
            cursor: onNavigate ? "pointer" : "default",
            ...(highlight === c ? { opacity: 1, letterSpacing: "0.45em", textShadow: `0 0 18px ${PALETTE.light}` } : null),
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function HelpPanel({ onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 60,
      background: "rgba(10,10,15,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", padding: "2rem",
    }}>
      <div style={{ maxWidth: "32ch", fontFamily: "'Cormorant Garamond', serif", color: PALETTE.inscription, fontSize: "1.1rem", lineHeight: 1.8, fontStyle: "italic", opacity: 0.85 }}>
        <p>Ceci est un monde écrit. Chaque chose est une phrase.</p>
        <p>Clique sur une phrase pour la réécrire.</p>
        <p>Observe ce qui change.</p>
        <p>Il n'y a rien à gagner. Il y a à comprendre.</p>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================

export default function Palimpsest() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentChamber, chambers, companion, ui } = state;
  const chamber = chambers[currentChamber];
  const editingInscription = chamber.inscriptions.find((i) => i.id === ui.editingInscriptionId) || null;

  // Partie d'un joueur IA regardée par un humain ; null quand c'est l'humain qui joue.
  const [spectator, setSpectator] = React.useState(null);
  const canWatch = useMemo(aiPlayerAvailable, []);
  // Le moteur de partie lit le monde à jour entre deux rendus.
  const worldRef = React.useRef(state);
  worldRef.current = state;
  const sessionRef = React.useRef(null);

  // Fonts Google via injection
  useEffect(() => {
    if (document.getElementById("palimpsest-fonts")) return;
    const link = document.createElement("link");
    link.id = "palimpsest-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;1,400&display=swap";
    document.head.appendChild(link);
  }, []);

  // La narration s'efface d'elle-même (animation de 16 s) ; elle quitte ensuite l'état.
  useEffect(() => {
    if (!ui.narration) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_NARRATION" }), 16000);
    return () => clearTimeout(t);
  }, [ui.narration]);

  useEffect(() => () => sessionRef.current?.abort(), []);

  const navigate = useCallback((chamberName) => {
    if (!chambers[chamberName]) return;
    dispatch({ type: "SET_CHAMBER", payload: chamberName });
  }, [chambers]);

  // Stable ref : sans useCallback, le useEffect d'Ink réarmait le timer 8s à chaque render
  // pendant le typing lettre par lettre, bloquant la disparition du message.
  const clearInkMessage = useCallback(() => dispatch({ type: "CLEAR_INK_MESSAGE" }), []);

  const submitRewrite = useCallback(async (newText) => {
    if (!editingInscription) return;
    const now = Date.now();
    const recent = ui.rewriteTimestamps.filter((t) => now - t < 60_000);
    if (now - ui.lastRewriteAt < REWRITE_COOLDOWN_MS) {
      dispatch({ type: "REWRITE_ERROR", payload: "cooldown" });
      return;
    }
    if (recent.length >= REWRITE_MAX_PER_MINUTE) {
      dispatch({ type: "REWRITE_ERROR", payload: "rate_limit" });
      return;
    }

    dispatch({ type: "REWRITE_START" });

    try {
      const apiResponse = await callInterpretation(buildInterpretationArgs(state, currentChamber, editingInscription, newText));
      dispatch({
        type: "REWRITE_APPLY",
        payload: {
          chamberName: currentChamber,
          inscriptionId: editingInscription.id,
          newText,
          apiResponse,
        },
      });
    } catch (err) {
      console.warn("[PALIMPSEST] interpretation error", err);
      // `sample` rejette un objet {code, message} : on garde le code pour choisir la réplique de L'Encre.
      dispatch({ type: "REWRITE_ERROR", payload: err?.code || String(err?.message || err) });
    }
  }, [state, currentChamber, editingInscription, ui.lastRewriteAt, ui.rewriteTimestamps]);

  // REGARDER : Claude joue, l'humain regarde. Chaque geste est mis en scène avant d'être appliqué, au rythme du
  // jeu (lent, sans à-coup) ; le monde reste ensuite à l'humain, avec ce que l'IA y a écrit.
  const watch = useCallback(async () => {
    if (sessionRef.current) return;
    const ctl = new AbortController();
    sessionRef.current = ctl;
    const pause = (ms) => wait(ms, ctl.signal);
    const reduced = prefersReducedMotion();
    const apply = (action) => {
      worldRef.current = reducer(worldRef.current, action);
      dispatch(action);
    };
    const inscriptionAt = (index) => {
      const s = worldRef.current;
      return s.chambers[s.currentChamber].inscriptions[index - 1] || null;
    };
    const traces = (s) => Object.values(s.chambers)
      .reduce((n, c) => n + c.inscriptions.reduce((m, i) => m + i.history.length, 0), 0);

    const onEvent = (e) => {
      switch (e.type) {
        case "turn":
          setSpectator((s) => ({ ...s, thinking: true, stale: true, ghost: null, highlight: null }));
          return undefined;
        case "player-text": {
          const text = visibleMarginalia(e.text);
          if (text) setSpectator((s) => s && { ...s, marginalia: text, stale: false });
          return undefined;
        }
        case "reply": {
          setSpectator((s) => ({ ...s, thinking: false, stale: false, marginalia: e.marginalia }));
          const g = e.gesture;
          if (g?.type === "réécrire") {
            const ins = inscriptionAt(g.index);
            if (!ins) return pause(1200);
            const text = g.text.slice(0, INSCRIPTION_MAX_CHARS);
            setSpectator((s) => ({ ...s, ghost: { inscriptionId: ins.id, text, loading: false } }));
            return pause(reduced ? 1500 : text.length * 35 + 900);
          }
          if (g?.type === "aller") {
            setSpectator((s) => ({ ...s, highlight: { chamber: g.chamber } }));
            return pause(1600);
          }
          if (g?.type === "gratter") {
            const ins = inscriptionAt(g.index);
            if (ins) setSpectator((s) => ({ ...s, highlight: { inscriptionId: ins.id } }));
            return pause(1600);
          }
          // Le silence est un matériau : attendre dure vraiment.
          return pause(g?.type === "attendre" ? 6000 : 1200);
        }
        case "interpreting":
          setSpectator((s) => ({ ...s, ghost: s.ghost && { ...s.ghost, loading: true } }));
          return undefined;
        case "applied":
          setSpectator((s) => ({ ...s, ghost: null, highlight: null }));
          return e.gesture?.type === "attendre" ? undefined : pause(2800);
        case "interpret-error":
          setSpectator((s) => ({ ...s, ghost: null }));
          return pause(2500);
        default:
          return undefined;
      }
    };

    const tracesBefore = traces(worldRef.current);
    dispatch({ type: "CLOSE_OPENING" });
    setSpectator({ thinking: true, stale: false, marginalia: "", ghost: null, highlight: null });
    try {
      await runAiSession({
        getState: () => worldRef.current,
        apply,
        askPlayer: askClaudePlayer,
        interpret: callInterpretation,
        onEvent,
        watched: true,
        signal: ctl.signal,
      });
      const wrote = traces(worldRef.current) > tracesBefore;
      apply({ type: "INK_SAY", payload: { mood: "melancholic", message: wrote ? INK_LINES.aiLeftTraces : INK_LINES.aiLeftUntouched } });
    } catch (err) {
      if (err?.code === "cancelled") {
        apply({ type: "INK_SAY", payload: { mood: "worried", message: INK_LINES.aiInterrupted } });
      } else {
        console.warn("[PALIMPSEST] la partie du joueur IA s'arrête", err);
        apply({ type: "REWRITE_ERROR", payload: err?.code || String(err?.message || err) });
      }
    } finally {
      sessionRef.current = null;
      setSpectator(null);
    }
  }, []);

  const ghostInscription = spectator?.ghost
    ? chamber.inscriptions.find((i) => i.id === spectator.ghost.inscriptionId) || null
    : null;

  return (
    <div style={{
      position: "relative",
      // 100% plutôt que 100vh : la page publiée réserve les marges de sécurité des téléphones.
      width: "100%", height: "100%", minHeight: "520px",
      background: chamber.visuals.background_color || PALETTE.bg,
      overflow: "hidden",
      transition: "background 2.5s ease-in-out",
    }}>
      <style>{`
        @keyframes palimpsestPulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @keyframes palimpsestShapePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes palimpsestCaret {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.9; }
        }
        @keyframes palimpsestNarration {
          0% { opacity: 0; }
          12% { opacity: 0.55; }
          85% { opacity: 0.55; }
          100% { opacity: 0; }
        }
        .palimpsest-inscription {
          animation: palimpsestPulse 4s ease-in-out infinite;
          transition: color 1.2s ease;
        }
        .palimpsest-inscription:hover {
          opacity: 1 !important;
        }
        button:hover { opacity: 1 !important; }
        .palimpsest-narration { animation: palimpsestNarration 16s ease-in-out forwards; }
        .palimpsest-margin {
          /* Au-dessus du voile de l'éditeur (40) : la pensée reste lisible pendant que la main invisible écrit. */
          position: absolute; z-index: 41; left: 2rem; top: 15%; bottom: 24%;
          width: clamp(10rem, calc((100% - 640px) / 2 - 4rem), 17rem);
          display: flex; flex-direction: column; justify-content: flex-end;
          overflow: hidden; pointer-events: none;
          font-family: 'Lora', serif; font-style: italic; font-size: 0.85rem; line-height: 1.6;
          color: ${PALETTE.inscription}; opacity: 0.5; white-space: pre-wrap;
          transition: opacity 1.2s ease-in-out;
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 35%);
          mask-image: linear-gradient(to bottom, transparent, #000 35%);
        }
        .palimpsest-margin--stale { opacity: 0.18; }
        .palimpsest-caret { font-style: normal; animation: palimpsestCaret 1.6s ease-in-out infinite; }
        @media (max-width: 1099px) {
          .palimpsest-margin {
            left: 1rem; right: 1rem; top: 2.8rem; bottom: auto; width: auto;
            max-height: 3.3em; font-size: 0.78rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .palimpsest-inscription, .palimpsest-caret { animation: none; }
          .palimpsest-narration { animation: none; opacity: 0.55; }
          .palimpsest-link, .palimpsest-margin { transition: none !important; }
        }
      `}</style>

      <ChamberBackground visuals={chamber.visuals} />

      {/* Nom de Chambre en filigrane (GDD §7) */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(6rem, 18vw, 14rem)",
        color: PALETTE.inscription, opacity: 0.05,
        letterSpacing: "0.1em", pointerEvents: "none", userSelect: "none",
        zIndex: 1,
      }}>
        {currentChamber}
      </div>

      {/* Inscriptions */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        zIndex: 5, maxWidth: "640px", width: "85%",
      }}>
        {chamber.inscriptions.map((ins) => (
          <Inscription
            key={ins.id}
            inscription={ins}
            onEdit={spectator ? undefined : (id) => dispatch({ type: "START_EDIT", payload: id })}
            paletteInscription={PALETTE.inscription}
            highlighted={spectator?.highlight?.inscriptionId === ins.id}
          />
        ))}
        {ui.narration && (
          <p key={ui.narration} className="palimpsest-narration" style={{
            margin: "1.6rem 0 0",
            fontFamily: "'Lora', serif", fontStyle: "italic",
            fontSize: "0.9rem", lineHeight: 1.6,
            color: PALETTE.inscription, opacity: 0,
          }}>
            {ui.narration}
          </p>
        )}
      </div>

      <ConnectionLinks
        connections={chamber.connections}
        onNavigate={spectator ? undefined : navigate}
        highlight={spectator?.highlight?.chamber}
      />

      <Ink
        mood={companion.mood}
        message={companion.currentMessage}
        onMessageEnd={clearInkMessage}
      />

      {spectator && <Marginalia text={spectator.marginalia} thinking={spectator.thinking} stale={spectator.stale} />}

      {/* Bouton aide minimaliste */}
      <button
        onClick={() => dispatch({ type: "TOGGLE_HELP" })}
        style={{
          position: "absolute", top: "1.2rem", left: "1.2rem", zIndex: 30,
          background: "none", border: "none",
          color: PALETTE.inscription, opacity: 0.35,
          fontFamily: "'Lora', serif", fontSize: "1rem",
          cursor: "pointer",
        }}
      >?</button>

      {spectator && (
        <button
          className="palimpsest-link"
          onClick={() => sessionRef.current?.abort()}
          style={{ ...linkStyle, position: "absolute", top: "1.2rem", right: "1.2rem", zIndex: 45, fontSize: "0.7rem", opacity: 0.35 }}
        >INTERROMPRE</button>
      )}

      {editingInscription && !spectator && (
        <InscriptionEditor
          inscription={editingInscription}
          onCancel={() => dispatch({ type: "CANCEL_EDIT" })}
          onSubmit={submitRewrite}
          loading={ui.loading}
        />
      )}

      {ghostInscription && (
        <InscriptionEditor
          key={`ghost-${spectator.ghost.inscriptionId}-${spectator.ghost.text}`}
          inscription={ghostInscription}
          onCancel={() => {}}
          onSubmit={() => {}}
          loading={false}
          ghost={spectator.ghost}
        />
      )}

      {ui.showHelp && <HelpPanel onClose={() => dispatch({ type: "TOGGLE_HELP" })} />}

      {ui.showOpening && (
        <OpeningScreen
          onClose={() => dispatch({ type: "CLOSE_OPENING" })}
          onWatch={canWatch ? watch : undefined}
          isReturn={false}
        />
      )}
    </div>
  );
}

// Moteur partagé avec l'instrument local `porte/play.mjs`. Les builds de la page retirent cette ligne.
export { CHAMBERS_INITIAL, initialState, reducer, buildInterpretationArgs, buildInterpretationPrompt, describeChamber, describeVisuals, parsePlayerReply, runAiSession, AI_SESSION_MAX_GESTURES };
