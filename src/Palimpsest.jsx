import React, { useReducer, useEffect, useCallback, useMemo } from "react";

// PALIMPSEST v1.0 — single-file React artifact
// Ref : PALIMPSEST_GDD.md (SSOT) + CLAUDE.md + docs/CHAMBER_DEFINITIONS.md + docs/INTERPRETATION_PROMPT.md
// Phase 1 — Squelette : SEUIL rendu, édition d'Inscription, 1er appel API, application naïve des visual_changes.

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
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CHAMBER":
      return { ...state, currentChamber: action.payload };
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
        companion: { mood: "worried", currentMessage: "les mots résistent... réessaie" },
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
        },
      };
    }
    case "CLEAR_INK_MESSAGE":
      return { ...state, companion: { ...state.companion, currentMessage: null } };
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
// Claude.ai les appels CORS sortants sont bloqués. On utilise window.claude.complete quand disponible,
// avec fallback fetch pour distribution standalone (itch.io). À arbitrer en fin de Phase 6.

async function callInterpretation({ chamberName, chamberTheme, originalInscription, playerInscription, allInscriptions }) {
  // Mode DEV LOCAL : si _DEV_/stub_responses.js est chargé, on court-circuite l'API réelle.
  // Voir _DEV_/index.html — aucun appel réseau, aucun coût, tous les chemins visuels exerçables.
  if (typeof window !== "undefined" && typeof window.PALIMPSEST_STUB === "function") {
    return window.PALIMPSEST_STUB({ chamberName, chamberTheme, originalInscription, playerInscription, allInscriptions });
  }

  const filledPrompt = INTERPRETATION_SYSTEM_PROMPT
    .replace("{chamber_name}", chamberName)
    .replace("{chamber_theme}", chamberTheme)
    .replace("{original_inscription}", originalInscription)
    .replace("{player_inscription}", playerInscription)
    .replace("{all_current_inscriptions}", JSON.stringify(allInscriptions));

  let rawText = null;

  if (typeof window !== "undefined" && window.claude && typeof window.claude.complete === "function") {
    rawText = await window.claude.complete(filledPrompt);
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
// COMPOSANTS
// ============================================================

function OpeningScreen({ onClose, isReturn }) {
  const text = isReturn
    ? "Tu arrives dans un monde qui se souvient de quelqu'un. Peut-être toi."
    : "Au commencement, le monde est écrit. Chaque chose est une phrase. Chaque loi, une formulation. Tu peux lire. Tu peux réécrire. Mais chaque mot a un poids.";

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        background: PALETTE.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        padding: "2rem",
      }}
    >
      <p style={{
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

function Inscription({ inscription, onEdit, paletteInscription }) {
  const hasHistory = inscription.history.length > 0;
  return (
    <div style={{ position: "relative", marginBottom: "1.1rem", cursor: "pointer" }} onClick={() => onEdit(inscription.id)}>
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
        }}
      >
        « {inscription.current} »
      </p>
    </div>
  );
}

function InscriptionEditor({ inscription, onCancel, onSubmit, loading }) {
  const [text, setText] = React.useState(inscription.current);

  React.useEffect(() => { setText(inscription.current); }, [inscription.id]);

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
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, INSCRIPTION_MAX_CHARS))}
          onKeyDown={(e) => {
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
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <button onClick={onCancel} disabled={loading} style={btnStyle}>annuler</button>
            <button onClick={submit} disabled={loading} style={btnStyle}>{loading ? "le monde réfléchit…" : "réécrire"}</button>
          </div>
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

function ConnectionLinks({ connections, onNavigate }) {
  return (
    <div style={{
      position: "absolute", bottom: "2rem", left: 0, right: 0,
      display: "flex", justifyContent: "center", gap: "2.5rem",
      flexWrap: "wrap", zIndex: 10,
    }}>
      {connections.map((c) => (
        <button
          key={c}
          onClick={() => onNavigate(c)}
          style={{
            background: "none", border: "none",
            fontFamily: "'Cormorant Garamond', serif",
            color: PALETTE.inscription, opacity: 0.6,
            fontSize: "0.95rem",
            letterSpacing: "0.3em",
            cursor: "pointer",
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

  // Fonts Google via injection
  useEffect(() => {
    if (document.getElementById("palimpsest-fonts")) return;
    const link = document.createElement("link");
    link.id = "palimpsest-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;1,400&display=swap";
    document.head.appendChild(link);
  }, []);

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
      const allInscriptions = Object.fromEntries(
        Object.entries(chambers).map(([name, c]) => [name, c.inscriptions.map((i) => i.current)])
      );
      const apiResponse = await callInterpretation({
        chamberName: currentChamber,
        chamberTheme: chamber.theme,
        originalInscription: editingInscription.original,
        playerInscription: newText,
        allInscriptions,
      });
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
      dispatch({ type: "REWRITE_ERROR", payload: String(err?.message || err) });
    }
  }, [currentChamber, chamber, editingInscription, chambers, ui.lastRewriteAt, ui.rewriteTimestamps]);

  return (
    <div style={{
      position: "relative",
      width: "100%", height: "100vh", minHeight: "520px",
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
        .palimpsest-inscription {
          animation: palimpsestPulse 4s ease-in-out infinite;
          transition: color 1.2s ease;
        }
        .palimpsest-inscription:hover {
          opacity: 1 !important;
        }
        button:hover { opacity: 1 !important; }
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
            onEdit={(id) => dispatch({ type: "START_EDIT", payload: id })}
            paletteInscription={PALETTE.inscription}
          />
        ))}
      </div>

      <ConnectionLinks connections={chamber.connections} onNavigate={navigate} />

      <Ink
        mood={companion.mood}
        message={companion.currentMessage}
        onMessageEnd={clearInkMessage}
      />

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

      {editingInscription && (
        <InscriptionEditor
          inscription={editingInscription}
          onCancel={() => dispatch({ type: "CANCEL_EDIT" })}
          onSubmit={submitRewrite}
          loading={ui.loading}
        />
      )}

      {ui.showHelp && <HelpPanel onClose={() => dispatch({ type: "TOGGLE_HELP" })} />}

      {ui.showOpening && (
        <OpeningScreen onClose={() => dispatch({ type: "CLOSE_OPENING" })} isReturn={false} />
      )}
    </div>
  );
}
