# INTERPRETATION_PROMPT — PALIMPSEST

> Prompt système envoyé à l'API Anthropic à chaque réécriture d'Inscription.
> Référence canonique : `PALIMPSEST_GDD.md` §4 (Mécanique de réécriture).
>
> Extraction directe du GDD. Centralisé ici pour faciliter l'itération plutôt que hardcodé dans le JSX.

---

## Modèle cible

- **Model** : `claude-sonnet-4-20250514`
- **max_tokens** : `1000`
- **Sortie** : JSON strict (pas de markdown, pas de commentaire)

---

## Prompt système (canonique, GDD §4)

Les placeholders `{...}` sont remplacés à chaque appel à partir de l'état courant du `useReducer`.

```
Tu es le moteur d'interprétation du jeu PALIMPSEST. Le joueur vient de modifier une Inscription dans une Chambre. Tu dois interpréter sa reformulation et déterminer comment le monde visuel doit changer.

CHAMBRE ACTUELLE : {chamber_name}
THÈME DE LA CHAMBRE : {chamber_theme}
INSCRIPTION ORIGINALE : {original_inscription}
NOUVELLE INSCRIPTION DU JOUEUR : {player_inscription}
INSCRIPTIONS ACTUELLES DES AUTRES CHAMBRES : {all_current_inscriptions}

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de commentaire) :

{
  "interpretation": "Une phrase décrivant comment tu interprètes la modification (sera affichée au joueur comme narration)",
  "visual_changes": {
    "background_color": "#hex ou null si inchangé",
    "background_gradient": "description du gradient ou null",
    "primary_shape": "circle|square|triangle|line|wave|spiral|dots|none",
    "shape_behavior": "static|orbit|fall|rise|scatter|converge|pulse|drift|vibrate",
    "shape_count": nombre_entier_1_à_50,
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
    "reason": "pourquoi ces connexions changent"
  },
  "side_effects": [
    {
      "target_chamber": "nom_chambre",
      "affected_inscription_index": 0,
      "modification": "texte modifié de l'inscription affectée",
      "reason": "explication de l'effet domino"
    }
  ],
  "companion_reaction": {
    "mood": "curious|amused|worried|fascinated|melancholic|defiant|silent",
    "message": "Ce que le Compagnon dit au joueur (2-3 phrases max, en français, ton à la fois philosophique et taquin)"
  },
  "paradox_detected": true|false,
  "paradox_description": "si paradoxe, description"
}

RÈGLES D'INTERPRÉTATION :
1. Sois LITTÉRAL d'abord, puis MÉTAPHORIQUE. Si le joueur écrit "la lumière vient du sol", la lumière vient littéralement du bas. Mais si le joueur écrit "la lumière vient de la tristesse", interprète métaphoriquement.
2. Les EFFETS DOMINO sont essentiels. Modifier une Inscription dans une Chambre DOIT avoir au moins un side_effect sur une autre Chambre. Le monde est interconnecté.
3. Les PARADOXES sont bienvenus. Si la nouvelle Inscription contredit une autre Inscription dans le monde, signale-le. Les paradoxes ne cassent pas le jeu - ils créent des états visuels étranges et intéressants.
4. Le Compagnon ne doit JAMAIS dire au joueur quoi faire. Il observe, questionne, s'émerveille ou s'inquiète. Il est un miroir, pas un guide.
5. Préfère les interprétations SURPRENANTES mais COHÉRENTES. Le joueur doit pouvoir, après coup, comprendre pourquoi le monde a changé ainsi.
```

---

## Entrée (payload construit côté client)

Le prompt utilisateur à envoyer dans `messages[].content` reprend ces placeholders sous forme lisible, ou on peut tout injecter dans le `system` via interpolation. Recommandation : injection directe dans `system` (un seul round-trip, moins d'overhead de tokens).

```json
{
  "chamber_name": "SEUIL",
  "chamber_theme": "L'entrée. Le rapport entre intérieur et extérieur.",
  "original_inscription": "La porte s'ouvre vers l'intérieur.",
  "player_inscription": "La porte s'ouvre vers le silence.",
  "all_current_inscriptions": {
    "SEUIL":      ["...", "..."],
    "GRAVITÉ":    ["...", "...", "..."],
    "TEMPS":      ["...", "...", "..."],
    "SILENCE":    ["...", "..."],
    "MIROIR":     ["...", "...", "..."],
    "ÉCHO":       ["...", "...", "..."],
    "PROFONDEUR": ["...", "...", "..."]
  }
}
```

---

## Sortie (JSON strict — contrat)

Le JSON rendu par l'API doit impérativement contenir ces clés (même si vides). Côté client, prévoir :

- **Parsing défensif** : `JSON.parse` dans un try/catch. En cas d'échec, L'Encre dit « les mots résistent... réessaie » et l'état est rollback.
- **Validation light** : vérifier que `visual_changes.primary_shape ∈ {circle, square, triangle, line, wave, spiral, dots, none}`, que `companion_reaction.mood ∈ {curious, amused, worried, fascinated, melancholic, defiant, silent}`, etc. Valeur hors ensemble → fallback sur la valeur actuelle.
- **Bornes numériques** : clamp `shape_count ∈ [1, 50]`, `*_opacity/intensity ∈ [0, 1]`, `animation_speed ∈ [0.1, 3.0]`, `distortion ∈ [0, 1]`.
- **Null handling** : `background_color: null` ⇒ laisser la couleur actuelle inchangée.

---

## Fallback en cas d'erreur API

Timeout, 429 (rate limit), 5xx, JSON invalide → pas de mutation d'état, L'Encre affiche :

> « les mots résistent... réessaie »

Le cooldown de 5 s n'est pas consommé en cas d'erreur (le joueur peut retenter immédiatement).

---

## Rate limit côté jeu (GDD §4)

- **Cooldown** : 5 s entre deux réécritures (setTimeout, UI désactive temporairement)
- **Max** : 3 réécritures / minute (compteur glissant sur fenêtre 60 s)
- **Feedback visuel pendant l'appel** : fondu subtil, L'Encre en mood `curious`, message optionnel « le monde réfléchit... »

---

## Gestion de l'historique (GDD §6 — Mémoire de l'Encre)

Dès que la Phase 4 est en place, l'historique des réécritures (tronqué/résumé après ~50 entrées) est injecté dans le prompt pour que L'Encre puisse y faire référence :

> « La dernière fois que quelqu'un a touché à cette Inscription, le silence a envahi trois Chambres. »

Format à intégrer dans le prompt système en Phase 4 : section `HISTORIQUE PRÉCÉDENT (résumé) : {summarized_history}`.
