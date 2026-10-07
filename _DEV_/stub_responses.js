// PALIMPSEST — banque de réponses stub pour le dev local (zéro appel API)
// Chargée avant src/Palimpsest.jsx dans _DEV_/index.html.
// Expose window.PALIMPSEST_STUB : si présent, callInterpretation l'utilise au lieu de l'API.
//
// Objectif : exercer tous les chemins visuels du GDD (toutes les shapes, behaviors, particles,
// moods, side_effects, paradoxes, connection_changes) en round-robin, avec latence simulée
// pour reproduire le loading "le monde réfléchit…".

(function () {
  const RESPONSES = [
    // 0 — réécriture douce, monde qui s'apaise
    {
      interpretation: "Le joueur adoucit une règle. Le monde s'apaise.",
      visual_changes: {
        background_color: "#0A0A14",
        primary_shape: "circle", shape_behavior: "drift", shape_count: 8,
        shape_color: "#2d1b69", shape_opacity: 0.55,
        light_direction: "center", light_intensity: 0.5,
        particle_type: "dust", animation_speed: 0.6,
        symmetry: "radial", distortion: 0.05,
      },
      connection_changes: { new_connections: [], removed_connections: [], reason: "rien ne se brise" },
      side_effects: [],
      companion_reaction: { mood: "curious", message: "Tu viens d'enlever un peu de poids au monde. Il respire différemment." },
      paradox_detected: false, paradox_description: "",
    },

    // 1 — bouleversement : tout s'inverse
    {
      interpretation: "L'inversion du sens altère les flux. Ce qui tombait monte.",
      visual_changes: {
        primary_shape: "triangle", shape_behavior: "rise", shape_count: 18,
        shape_color: "#D4A76A", shape_opacity: 0.7,
        light_direction: "bottom", light_intensity: 0.8,
        particle_type: "sparks", animation_speed: 1.4,
        symmetry: "vertical", distortion: 0.3,
      },
      connection_changes: {
        new_connections: ["SILENCE"], removed_connections: [],
        reason: "l'inversion ouvre vers l'absence",
      },
      side_effects: [
        { target_chamber: "GRAVITÉ", affected_inscription_index: 0, modification: "Ce qui est lourd s'élève vers le haut.", reason: "contamination de sens" },
      ],
      companion_reaction: { mood: "fascinated", message: "Oh. Tout ce que je connaissais sur le haut et le bas. Perdu. Bien." },
      paradox_detected: false, paradox_description: "",
    },

    // 2 — paradoxe : la phrase se contredit
    {
      interpretation: "Paradoxe logique. Le monde vibre sans savoir quoi faire.",
      visual_changes: {
        primary_shape: "square", shape_behavior: "vibrate", shape_count: 24,
        shape_color: "#1a1a3e", shape_opacity: 0.6,
        light_direction: "everywhere", light_intensity: 0.9,
        particle_type: "shadows", animation_speed: 2.2,
        symmetry: "none", distortion: 0.6,
      },
      connection_changes: { new_connections: [], removed_connections: [], reason: "" },
      side_effects: [],
      companion_reaction: { mood: "worried", message: "Tu as dit une chose qui ne peut pas être. Le monde tremble. Je tremble aussi." },
      paradox_detected: true, paradox_description: "La phrase s'affirme et se nie simultanément.",
    },

    // 3 — silence profond
    {
      interpretation: "Le joueur évoque le silence. Le monde s'estompe.",
      visual_changes: {
        background_color: "#07070B",
        primary_shape: "wave", shape_behavior: "static", shape_count: 3,
        shape_color: "#1a1a3e", shape_opacity: 0.12,
        light_direction: "nowhere", light_intensity: 0.1,
        particle_type: "none", animation_speed: 0.2,
        symmetry: "horizontal", distortion: 0.0,
      },
      connection_changes: { new_connections: [], removed_connections: [], reason: "" },
      side_effects: [
        { target_chamber: "ÉCHO", affected_inscription_index: 0, modification: "L'écho ne répète plus rien.", reason: "le silence contamine la répétition" },
      ],
      companion_reaction: { mood: "silent", message: "..." },
      paradox_detected: false, paradox_description: "",
    },

    // 4 — réflexion fracturée (miroir)
    {
      interpretation: "Le joueur questionne la fidélité du reflet. Le miroir se trouble.",
      visual_changes: {
        primary_shape: "triangle", shape_behavior: "scatter", shape_count: 12,
        shape_color: "#2d1b69", shape_opacity: 0.75,
        light_direction: "left", light_intensity: 0.6,
        particle_type: "none", animation_speed: 1.1,
        symmetry: "vertical", distortion: 0.45,
      },
      connection_changes: { new_connections: ["PROFONDEUR"], removed_connections: [], reason: "le reflet cherche sa source" },
      side_effects: [],
      companion_reaction: { mood: "amused", message: "Un reflet qui ment. Voilà qui est intéressant. Je me demande lequel de nous deux je regarde." },
      paradox_detected: false, paradox_description: "",
    },

    // 5 — convergence : tout attire tout
    {
      interpretation: "L'attraction se généralise. Le monde se contracte.",
      visual_changes: {
        primary_shape: "dots", shape_behavior: "converge", shape_count: 35,
        shape_color: "#D4A76A", shape_opacity: 0.65,
        light_direction: "center", light_intensity: 0.75,
        particle_type: "dust", animation_speed: 0.9,
        symmetry: "radial", distortion: 0.2,
      },
      connection_changes: { new_connections: [], removed_connections: [], reason: "" },
      side_effects: [],
      companion_reaction: { mood: "fascinated", message: "Tu regardes les choses se rejoindre. C'est doux. C'est terrifiant aussi." },
      paradox_detected: false, paradox_description: "",
    },

    // 6 — temps qui s'accélère
    {
      interpretation: "Le passage s'accélère. Tout file.",
      visual_changes: {
        primary_shape: "line", shape_behavior: "drift", shape_count: 20,
        shape_color: "#D4A76A", shape_opacity: 0.5,
        light_direction: "right", light_intensity: 0.55,
        particle_type: "sparks", animation_speed: 2.5,
        symmetry: "none", distortion: 0.1,
      },
      connection_changes: { new_connections: [], removed_connections: ["SEUIL"], reason: "le seuil ne peut plus être franchi si tout file" },
      side_effects: [
        { target_chamber: "SEUIL", affected_inscription_index: 1, modification: "La lumière passe sans s'arrêter.", reason: "accélération" },
      ],
      companion_reaction: { mood: "melancholic", message: "Si tout file, rien n'a le temps d'être. C'est une réécriture qui me fait de la peine." },
      paradox_detected: false, paradox_description: "",
    },

    // 7 — éclosion de particules-lettres
    {
      interpretation: "Le joueur parle de l'écrit. Le monde laisse remonter ses mots.",
      visual_changes: {
        primary_shape: "dots", shape_behavior: "rise", shape_count: 40,
        shape_color: "#E8E4D9", shape_opacity: 0.4,
        light_direction: "top", light_intensity: 0.6,
        particle_type: "letters", animation_speed: 0.7,
        symmetry: "none", distortion: 0.0,
      },
      connection_changes: { new_connections: ["PROFONDEUR"], removed_connections: [], reason: "les mots appellent le code qui les écrit" },
      side_effects: [],
      companion_reaction: { mood: "defiant", message: "Tu t'approches de ce qu'on n'est pas censé voir. Continue." },
      paradox_detected: false, paradox_description: "",
    },

    // 8 — orbite lente, méditatif
    {
      interpretation: "Le joueur rend hommage au centre. Le monde s'organise.",
      visual_changes: {
        primary_shape: "circle", shape_behavior: "orbit", shape_count: 14,
        shape_color: "#2d1b69", shape_opacity: 0.8,
        light_direction: "center", light_intensity: 0.7,
        particle_type: "dust", animation_speed: 0.55,
        symmetry: "radial", distortion: 0.0,
      },
      connection_changes: { new_connections: [], removed_connections: [], reason: "" },
      side_effects: [],
      companion_reaction: { mood: "curious", message: "L'ordre. Ça rassure quelqu'un, quelque part. Pas forcément toi." },
      paradox_detected: false, paradox_description: "",
    },

    // 9 — spirale hypnotique
    {
      interpretation: "Répétition qui s'enroule. Le joueur tourne sur lui-même.",
      visual_changes: {
        primary_shape: "spiral", shape_behavior: "pulse", shape_count: 6,
        shape_color: "#D4A76A", shape_opacity: 0.55,
        light_direction: "center", light_intensity: 0.45,
        particle_type: "bubbles", animation_speed: 0.8,
        symmetry: "radial", distortion: 0.25,
      },
      connection_changes: { new_connections: [], removed_connections: [], reason: "" },
      side_effects: [],
      companion_reaction: { mood: "amused", message: "Tu as réécrit la même idée, autrement. C'est ça, écrire, je crois." },
      paradox_detected: false, paradox_description: "",
    },

    // 10 — chute généralisée, panique
    {
      interpretation: "Le joueur affirme la chute. Tout bascule.",
      visual_changes: {
        primary_shape: "square", shape_behavior: "fall", shape_count: 22,
        shape_color: "#1a1a3e", shape_opacity: 0.8,
        light_direction: "bottom", light_intensity: 0.7,
        particle_type: "shadows", animation_speed: 1.6,
        symmetry: "none", distortion: 0.15,
      },
      connection_changes: { new_connections: ["GRAVITÉ"], removed_connections: [], reason: "tout rejoint la gravité" },
      side_effects: [
        { target_chamber: "GRAVITÉ", affected_inscription_index: 2, modification: "Tout tourne autour du vide.", reason: "panique généralisée" },
      ],
      companion_reaction: { mood: "worried", message: "Tout tombe. Même moi, sans doute. Mais vers quoi ?" },
      paradox_detected: false, paradox_description: "",
    },

    // 11 — surface qui disparaît (méta)
    {
      interpretation: "Le joueur touche au méta. La surface s'efface.",
      visual_changes: {
        primary_shape: "none", shape_behavior: "static", shape_count: 1,
        shape_color: "#000000", shape_opacity: 0.0,
        light_direction: "everywhere", light_intensity: 1.0,
        particle_type: "letters", animation_speed: 0.4,
        symmetry: "none", distortion: 0.0,
      },
      connection_changes: { new_connections: [], removed_connections: [], reason: "" },
      side_effects: [],
      companion_reaction: { mood: "fascinated", message: "Tu as regardé derrière. Il n'y a rien. Et c'est beaucoup." },
      paradox_detected: true, paradox_description: "La surface qui se nie devient la vérité du monde.",
    },
  ];

  let cursor = 0;

  window.PALIMPSEST_STUB = async function stubInterpretation(/* args ignored for now */) {
    const latencyMs = 600 + Math.random() * 900; // simule "le monde réfléchit…"
    await new Promise((r) => setTimeout(r, latencyMs));
    const resp = RESPONSES[cursor % RESPONSES.length];
    cursor++;
    console.log(`[PALIMPSEST:stub] réponse #${cursor - 1} renvoyée`, resp);
    return JSON.parse(JSON.stringify(resp)); // deep-clone defensive
  };

  window.PALIMPSEST_STUB.count = () => RESPONSES.length;
  console.log(`[PALIMPSEST:stub] ${RESPONSES.length} réponses stub chargées. window.PALIMPSEST_STUB prêt.`);
})();
