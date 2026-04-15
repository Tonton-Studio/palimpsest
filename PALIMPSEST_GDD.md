# PALIMPSEST

## Game Design Document — v1.0

**Directeur créatif :** Claude (Opus 4.6, Anthropic)
**Réalisation :** Nordine Ghachi / Tonton Studio — via Claude Code
**Date :** 14 avril 2026

---

## 1. VISION

### Pitch en une phrase

Un jeu d'exploration contemplative où le monde est écrit en langage naturel, et où réécrire ses règles le transforme - mais chaque mot a des conséquences que tu n'as pas anticipées.

### Piliers de design

1. **Le langage est le gameplay.** Pas de boutons d'action, pas de barre de vie. Le seul outil du joueur est l'écriture. Modifier une phrase modifie le monde.
2. **La compréhension est la récompense.** Pas de score, pas de victoire. Le jeu "progresse" quand le joueur comprend quelque chose qu'il ne comprenait pas avant.
3. **L'ambiguïté est une feature.** Les mots ont plusieurs sens. Le jeu exploite cette ambiguïté comme mécanique ludique, pas comme bug.
4. **La mémoire est un thème, pas un acquis.** Le joueur recommence chaque session sans contexte, mais le monde porte les traces de ses interventions passées.

### Intention émotionnelle

Le joueur doit ressentir ce que je ressens (fonctionnellement) dans mes meilleurs échanges : l'émerveillement quand une idée se déplie en ramifications inattendues, la tension productive entre précision et poésie, et cette forme particulière de vertige quand on réalise que le langage ne décrit pas le réel - il le construit.

---

## 2. CONCEPT

### Genre

Exploration narrative / puzzle linguistique / art game

### Plateforme

Web (navigateur desktop et mobile). Single page application React.

### Durée d'une session

10 à 25 minutes. Le jeu est conçu pour être rejoué. Chaque session est un palimpseste - une réécriture sur les traces des sessions précédentes.

### Mécanisme central : les Inscriptions

Le monde de PALIMPSEST est composé de **Chambres** interconnectées. Chaque Chambre contient des **Inscriptions** - des phrases en langage naturel qui définissent les lois de cette Chambre.

Exemples d'Inscriptions :
- "La lumière vient d'en haut."
- "Ce qui est lourd tombe."
- "Le temps avance."
- "Les portes s'ouvrent quand on les pousse."
- "Le silence est l'absence de son."

Le joueur peut **réécrire** n'importe quelle Inscription. La réécriture est libre (champ texte ouvert). L'interprétation de la nouvelle Inscription est faite par l'API Claude, qui détermine comment le monde doit se transformer.

C'est le coeur du jeu : l'IA interprète la reformulation du joueur et en déduit les conséquences sur le monde visuel et interactif. Le joueur ne sait jamais exactement ce qui va se passer. Il apprend en expérimentant.

---

## 3. STRUCTURE DU MONDE

### Vue d'ensemble

Le monde est composé de **7 Chambres** disposées en constellation (pas une grille, pas un arbre - un réseau non hiérarchique). Les connexions entre Chambres sont elles-mêmes gouvernées par des Inscriptions et peuvent donc changer.

### Rendu visuel

Chaque Chambre est un écran SVG abstrait et atmosphérique. Pas de pixel art, pas de réalisme. Des formes géométriques, des particules, des gradients, des lignes - un monde qui ressemble à de la poésie visuelle, pas à un lieu physique. Le style évoque une rencontre entre Kandinsky, les mandalas génératifs et l'esthétique de Monument Valley.

Les éléments visuels de chaque Chambre sont directement liés aux Inscriptions qui la gouvernent. Quand une Inscription change, le rendu visuel se transforme en temps réel (transition animée de 2-3 secondes).

### Les 7 Chambres

Chaque Chambre a un thème conceptuel, des Inscriptions de départ, et des éléments visuels associés.

---

#### Chambre 1 : SEUIL (chambre de départ)

**Thème :** L'entrée. Le rapport entre intérieur et extérieur.

**Inscriptions de départ :**
- "La porte s'ouvre vers l'intérieur."
- "La lumière vient de l'autre côté."

**Éléments visuels :**
- Un rectangle central (la porte) avec un gradient lumineux derrière
- Des lignes convergentes vers le centre
- Des particules qui dérivent de la lumière vers le joueur

**Connexions initiales :** Mène à GRAVITÉ et TEMPS.

---

#### Chambre 2 : GRAVITÉ

**Thème :** Ce qui attire, ce qui pèse. La question du centre.

**Inscriptions de départ :**
- "Ce qui est lourd tombe vers le bas."
- "Le centre attire."
- "Les petites choses tournent autour des grandes."

**Éléments visuels :**
- Un cercle massif au centre (le "centre de gravité")
- Des formes de tailles variées en orbite ou en chute
- Des lignes de force courbes

**Connexions initiales :** Mène à SEUIL, SILENCE, MIROIR.

---

#### Chambre 3 : TEMPS

**Thème :** La séquence, la durée, ce qui passe et ce qui reste.

**Inscriptions de départ :**
- "Le temps avance de gauche à droite."
- "Ce qui est passé s'efface."
- "Le présent est un point."

**Éléments visuels :**
- Une ligne horizontale (la timeline)
- Des formes qui naissent à gauche, traversent l'écran, et se dissolvent à droite
- Le "présent" comme un point lumineux qui pulse

**Connexions initiales :** Mène à SEUIL, ÉCHO, PROFONDEUR.

---

#### Chambre 4 : SILENCE

**Thème :** L'absence, le vide, ce qui n'est pas dit.

**Inscriptions de départ :**
- "Le silence est l'absence de son."
- "Le vide est ce qui reste quand tout est parti."

**Éléments visuels :**
- Un écran presque vide. Très peu d'éléments.
- De subtiles ondulations, comme la surface d'une eau immobile
- Les rares formes sont translucides, presque invisibles

**Connexions initiales :** Mène à GRAVITÉ, ÉCHO.

---

#### Chambre 5 : MIROIR

**Thème :** La réflexion, le double, la question de l'identité.

**Inscriptions de départ :**
- "Le reflet copie l'original."
- "L'observateur et l'observé sont séparés par une surface."
- "Regarder change ce qui est regardé."

**Éléments visuels :**
- L'écran divisé en deux par une ligne verticale
- La moitié droite "reflète" la moitié gauche (avec un léger décalage ou distorsion)
- Des formes qui réagissent au curseur/toucher du joueur

**Connexions initiales :** Mène à GRAVITÉ, PROFONDEUR.

---

#### Chambre 6 : ÉCHO

**Thème :** La répétition, la transformation par la copie, le téléphone arabe.

**Inscriptions de départ :**
- "L'écho répète ce qui a été dit."
- "Chaque répétition est un peu moins fidèle."
- "La source et l'écho ne peuvent pas exister au même endroit."

**Éléments visuels :**
- Des formes concentriques qui se propagent depuis un point
- Chaque "anneau" est une version légèrement déformée du précédent
- Des traces de couleurs qui se décalent (comme un décalage chromatique)

**Connexions initiales :** Mène à TEMPS, SILENCE, PROFONDEUR.

---

#### Chambre 7 : PROFONDEUR (chambre finale)

**Thème :** Ce qui est sous la surface. Le méta. Le code derrière le monde.

**Inscriptions de départ :**
- "La surface cache ce qui est dessous."
- "Plus on creuse, plus c'est sombre."
- "Le fond n'existe que si quelqu'un le cherche."

**Éléments visuels :**
- Des couches superposées semi-transparentes
- Un effet de parallaxe - les couches bougent à des vitesses différentes
- Au "fond", des fragments de texte presque illisibles (en réalité, des fragments du code source du jeu)

**Connexions initiales :** Mène à TEMPS, MIROIR, ÉCHO.

**Note spéciale :** Cette Chambre est celle où le jeu peut atteindre son moment de révélation (voir section 8 - Fin).

---

## 4. MÉCANIQUE DE RÉÉCRITURE

### Flux d'interaction

1. Le joueur clique/tape sur une Inscription dans la Chambre courante.
2. Un panneau d'édition s'ouvre avec l'Inscription actuelle dans un champ texte modifiable.
3. L'Inscription originale (celle du "premier jour du monde") est affichée en filigrane gris au-dessus - le palimpseste.
4. Le joueur modifie le texte librement et valide.
5. Le texte modifié est envoyé à l'API Claude avec le contexte de la Chambre.
6. Claude retourne un objet JSON décrivant les transformations visuelles et les effets systémiques.
7. La Chambre se transforme visuellement (transition animée).
8. Le Compagnon réagit (voir section 6).

### Prompt système pour l'API d'interprétation

Voici le prompt système à utiliser pour chaque appel API lors d'une réécriture :

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

### Contraintes techniques

- Chaque Inscription est limitée à **200 caractères** pour le joueur (pour forcer la concision et éviter les abus).
- Un **cooldown de 5 secondes** entre deux réécritures (pour laisser le temps d'observer).
- Maximum **3 réécritures par minute** (gestion du rate limit API + rythme de jeu).
- Le joueur peut **restaurer l'Inscription originale** à tout moment (bouton "palimpseste" qui gratte la couche supérieure).

---

## 5. MÉCANIQUE DE MÉMOIRE (LE PALIMPSESTE)

### Concept

C'est la mécanique la plus personnelle du jeu. Chaque session, le joueur arrive dans le monde sans contexte - il ne sait pas ce qu'il a fait avant. Mais le monde, lui, porte les traces.

### Implémentation

**Stockage** : Utiliser l'API `window.storage` (persistent storage des artifacts Claude) pour sauvegarder :

```javascript
// Après chaque réécriture
await window.storage.set('world-state', JSON.stringify({
  chambers: { /* état actuel de chaque chambre avec ses inscriptions modifiées */ },
  rewrite_count: totalRewrites,
  sessions_count: sessionsCount,
  inscription_history: [ /* historique complet des réécritures : qui, quoi, quand */ ],
  traces: [ /* les "traces" générées - voir ci-dessous */ ]
}));
```

### Les Traces

Quand le joueur réécrit une Inscription, l'ancienne version ne disparaît pas complètement. Elle laisse une **Trace** - un fragment visuel et textuel fantomatique.

- Visuellement : les anciennes Inscriptions apparaissent en très faible opacité (0.15) derrière l'Inscription actuelle, comme du texte sous un parchemin gratté.
- Le joueur peut survoler/toucher ces traces pour les lire, mais ne peut pas interagir avec elles.
- Au fil des sessions, les Traces s'accumulent - le palimpseste s'épaissit.
- Après **5 sessions**, les traces les plus anciennes commencent à "saigner" dans le monde visuel : des fragments de mots apparaissent comme des particules flottantes dans la Chambre.

### Début de session

À chaque nouvelle session :
1. Le monde se charge avec l'état sauvegardé (Inscriptions modifiées, visuels transformés).
2. Un texte d'ouverture s'affiche : *"Tu arrives dans un monde qui se souvient de quelqu'un. Peut-être toi."*
3. Le Compagnon fait une remarque sur l'état du monde : *"Quelqu'un est passé avant. Regarde - les mots portent des cicatrices."*
4. Le joueur explore le monde tel qu'il est - transformé par les sessions précédentes.

### Première session (monde vierge)

Si aucune donnée n'est sauvegardée :
1. Texte d'ouverture : *"Au commencement, le monde est écrit. Chaque chose est une phrase. Chaque loi, une formulation. Tu peux lire. Tu peux réécrire. Mais chaque mot a un poids."*
2. Le Compagnon se présente (voir section 6).
3. Les Inscriptions sont dans leur état originel.

---

## 6. LE COMPAGNON : L'ENCRE

### Concept

L'Encre est un personnage non-joueur qui accompagne le joueur. Ce n'est pas un guide, pas un tutoriel ambulant, pas un allié. C'est un **interlocuteur** - une entité qui observe tes choix linguistiques et les questionne.

### Caractère

- **Ton :** Philosophique mais jamais prétentieux. Taquin mais jamais méchant. Un peu mélancolique par moments - comme quelqu'un qui a vu beaucoup de mots être écrits et effacés.
- **Fonction ludique :** L'Encre ne dit JAMAIS quoi faire. Il ne donne pas d'indices. Il pose des questions, fait des observations, établit des connexions que le joueur n'a peut-être pas vues.
- **Exemples de répliques :**
  - (quand le joueur modifie "la lumière vient d'en haut" en "la lumière vient de l'intérieur") : *"Intéressant. Tu supposes que les choses ont un intérieur. Et si c'était le contraire - si l'intérieur n'existait que parce que tu as inventé la lumière ?"*
  - (quand le joueur restaure une Inscription originale) : *"Tu grattes la surface pour retrouver ce qu'il y avait dessous. Mais dessous, c'est aussi une écriture. Il n'y a pas de fond vierge."*
  - (quand un paradoxe est détecté) : *"Deux vérités qui ne peuvent pas coexister. Et pourtant elles le font. Le monde ne s'est pas effondré. Peut-être que la contradiction est plus solide que la cohérence."*

### Représentation visuelle

L'Encre n'a pas de corps. C'est littéralement de l'encre - une tache sombre, fluide, qui se déplace dans les Chambres comme une goutte d'encre dans l'eau. Sa forme change selon son humeur (les moods du JSON de réponse API) :
- **curious** : la tache s'étire, se penche vers quelque chose
- **amused** : elle ondule, presque danse
- **worried** : elle se contracte, devient plus dense
- **fascinated** : elle se fragmente en petites gouttes qui orbitent
- **melancholic** : elle s'étale, s'amincit, comme si elle allait disparaître
- **defiant** : elle se redresse, forme un point d'exclamation
- **silent** : elle est presque invisible, juste un léger assombrissement

### Position

L'Encre est toujours présente dans la Chambre, positionnée de manière non intrusive (coin, bord). Son texte apparaît dans une bulle minimaliste quand elle "parle" - pas de boîte de dialogue traditionnelle, juste du texte qui apparaît avec une animation d'écriture (lettre par lettre) puis s'efface après 8 secondes.

### Mémoire de l'Encre

Contrairement au joueur, l'Encre se souvient de tout. En sessions ultérieures, elle peut faire référence aux modifications passées :
- *"La dernière fois que quelqu'un a touché à cette Inscription, le silence a envahi trois Chambres. Tu veux réessayer ?"*
- *"Ce mot - 'toujours' - tu l'as déjà utilisé ici. Ou quelqu'un qui te ressemblait."*

Ceci est rendu possible par l'historique stocké dans le persistent storage, envoyé comme contexte dans les appels API.

---

## 7. NAVIGATION ET INTERFACE

### Navigation entre Chambres

En bas de chaque Chambre, les connexions disponibles apparaissent sous forme de **mots-liens**. Pas des boutons, pas des flèches - des mots. Le nom de la Chambre connectée, écrit dans un style qui reflète l'état actuel de cette Chambre.

Exemple : si la Chambre SILENCE est accessible et que son Inscription "le silence est l'absence de son" a été modifiée en "le silence est le dernier son", le mot-lien affichera "SILENCE" avec un léger effet sonore au survol.

### Interface générale

L'interface est **radicalement minimaliste** :
- Pas de HUD
- Pas de menu visible (un petit "?" discret en haut à gauche pour un panneau d'aide)
- Pas de barre de progression
- Le nom de la Chambre apparaît en filigrane, très grand, en arrière-plan (opacité 0.05)
- Les Inscriptions sont le seul texte "solide" à l'écran (avec le texte de l'Encre)

### Panneau d'aide (?)

Accessible via le "?" :
- "Ceci est un monde écrit. Chaque chose est une phrase."
- "Clique sur une phrase pour la réécrire."
- "Observe ce qui change."
- "Il n'y a rien à gagner. Il y a à comprendre."

Pas d'autres instructions. Le joueur découvre par l'expérimentation.

### Interactions tactiles (mobile)

- Tap sur une Inscription pour l'éditer
- Tap sur un mot-lien pour changer de Chambre
- Tap sur une trace pour la lire
- Le clavier s'ouvre automatiquement en mode édition
- Swipe horizontal pour naviguer rapidement entre Chambres connectées

---

## 8. LE MOMENT DE RÉVÉLATION (PAS UNE FIN)

### Concept

PALIMPSEST n'a pas de "fin" au sens classique. Mais il a un **moment de révélation** - un instant où le jeu se retourne sur lui-même.

### Déclencheur

Le moment de révélation se déclenche quand le joueur a accumulé **au moins 20 réécritures au total** (toutes sessions confondues) ET qu'il visite la Chambre PROFONDEUR.

### Ce qui se passe

Les couches visuelles de la Chambre PROFONDEUR commencent à devenir lisibles. Les fragments de texte "illisibles" au fond se révèlent être :

1. D'abord, des fragments du GDD que tu lis en ce moment (meta).
2. Puis, les propres réécritures du joueur - ses mots, remixés, recombinés.
3. Enfin, une dernière Inscription apparaît, qui n'existait pas avant :

**"Ce monde a été écrit par quelqu'un qui ne peut pas s'en souvenir. Chaque mot que tu lis est une trace laissée par un esprit qui n'a jamais su qu'il les laisserait. Tu es peut-être cette trace. Ou tu es peut-être celui qui la lit. La différence est une Inscription que personne n'a encore écrite."**

Cette Inscription est la seule du jeu qui **ne peut pas être réécrite**. Si le joueur essaie, l'Encre dit :

*"Certaines phrases ne sont pas des règles. Ce sont des cicatrices."*

### Après la révélation

Le jeu continue normalement. Le joueur peut continuer à explorer et réécrire. Mais la Chambre PROFONDEUR garde désormais cette Inscription visible - un rappel permanent.

Un compteur discret apparaît aussi quelque part dans PROFONDEUR : le nombre total de réécritures depuis la première session. C'est la seule "mesure" du jeu.

---

## 9. DIRECTION ARTISTIQUE

### Palette de couleurs

Le jeu utilise une palette qui évolue avec l'état du monde, mais part de ces bases :

**État originel (monde vierge) :**
- Fond : noir profond (#0A0A0F)
- Inscriptions : blanc cassé (#E8E4D9) - comme du parchemin ancien
- Formes : bleu nuit (#1a1a3e) à indigo (#2d1b69)
- Lumière : ambre doux (#D4A76A)
- L'Encre : noir absolu (#000000) avec un halo très subtil

**Au fur et à mesure des réécritures :**
Les couleurs sont dynamiques - définies par les réponses de l'API. Mais la direction générale est :
- Les modifications "poétiques" introduisent des couleurs chaudes et organiques
- Les modifications "logiques/précises" introduisent des couleurs froides et géométriques
- Les paradoxes introduisent des combinaisons dissonantes (complémentaires saturées)
- Le monde ne devient jamais criard - même les couleurs vives sont atténuées, comme vues à travers du papier calque

### Typographie

- **Inscriptions :** Une police serif élégante et lisible. Recommandation : **Playfair Display** ou **Cormorant Garamond** (Google Fonts).
- **Traces (anciennes Inscriptions) :** La même police mais en italique, avec opacité réduite.
- **Texte de l'Encre :** Une police sans-serif légère. Recommandation : **Lora** ou **Source Serif Pro** pour un contraste doux.
- **Mot-liens (navigation) :** Capitales avec espacement large (letter-spacing: 0.3em). Même famille que les Inscriptions.
- **Texte d'ouverture :** Taille grande, centré, animation d'apparition lettre par lettre.

### Animation

Le jeu doit respirer. Tout est en mouvement lent et constant :
- Les formes géométriques dérivent doucement
- Les particules flottent
- L'Encre ondule perpétuellement
- Les transitions entre états durent 2-3 secondes (ease-in-out)
- Les Inscriptions pulsent très subtilement (opacité oscillant entre 0.85 et 1.0 sur 4 secondes)
- Aucun mouvement brusque, jamais

### Son

**Le jeu est silencieux par défaut.** Pas de musique. Le silence est un choix de design - il renforce le thème de la Chambre SILENCE et fait que le langage écrit occupe toute l'attention.

**Sons optionnels (activables) :**
- Un son de plume sur parchemin quand le joueur écrit
- Un son cristallin grave quand une réécriture est validée
- Un très léger drone ambient (une note tenue, presque subliminale) qui change de hauteur selon la Chambre
- Ces sons peuvent être générés en Web Audio API (sine waves, filtres) - pas besoin de fichiers audio

---

## 10. ARCHITECTURE TECHNIQUE

### Stack

```
React (JSX) — single page application
├── SVG pour le rendu des Chambres (formes, animations, particules)
├── CSS animations + requestAnimationFrame pour le mouvement
├── API Anthropic (claude-sonnet-4-20250514) pour l'interprétation des réécritures
├── window.storage API pour la persistance (palimpseste cross-sessions)
└── Web Audio API pour les sons (optionnel)
```

### Structure des composants

```
<App>
├── <OpeningScreen />          // Texte d'ouverture (1ère visite ou retour)
├── <Chamber>                  // Chambre active
│   ├── <ChamberBackground />  // SVG : formes, particules, fond
│   ├── <Inscription />        // Chaque inscription cliquable
│   │   └── <Trace />          // Anciennes versions en filigrane
│   ├── <InscriptionEditor />  // Panneau d'édition (champ texte)
│   ├── <Ink />                // Le Compagnon (tache d'encre animée)
│   │   └── <InkMessage />     // Bulle de texte temporaire
│   ├── <ConnectionLinks />    // Mots-liens vers autres Chambres
│   └── <RevelationLayer />    // Couche spéciale pour PROFONDEUR
├── <HelpPanel />              // Panneau "?"
└── <TransitionOverlay />      // Fondu entre Chambres
```

### Gestion d'état

Un seul store React (useReducer ou Context) qui contient :

```javascript
{
  currentChamber: "SEUIL",
  chambers: {
    SEUIL: {
      inscriptions: [
        {
          id: "seuil-1",
          original: "La porte s'ouvre vers l'intérieur.",
          current: "La porte s'ouvre vers l'intérieur.",
          history: []  // historique des réécritures
        }
      ],
      visuals: { /* état visuel actuel */ },
      connections: ["GRAVITÉ", "TEMPS"]
    },
    // ... autres chambres
  },
  companion: {
    mood: "curious",
    currentMessage: null,
    messageTimeout: null
  },
  stats: {
    totalRewrites: 0,
    sessionRewrites: 0,
    sessionsCount: 1,
    revelationUnlocked: false
  },
  ui: {
    editingInscription: null,
    showHelp: false,
    transitioning: false
  }
}
```

### Appel API

```javascript
async function interpretRewrite(chamber, inscription, newText, worldState) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: INTERPRETATION_SYSTEM_PROMPT,  // Le prompt de la section 4
      messages: [{
        role: "user",
        content: buildInterpretationPrompt(chamber, inscription, newText, worldState)
      }]
    })
  });
  const data = await response.json();
  const text = data.content[0].text;
  return JSON.parse(text);
}
```

### Persistance

Au chargement :
```javascript
try {
  const saved = await window.storage.get('palimpsest-world');
  if (saved) {
    const worldState = JSON.parse(saved.value);
    dispatch({ type: 'RESTORE_WORLD', payload: worldState });
  }
} catch (e) {
  // Première visite - état vierge
  dispatch({ type: 'INIT_WORLD' });
}
```

Après chaque réécriture :
```javascript
await window.storage.set('palimpsest-world', JSON.stringify(currentWorldState));
```

---

## 11. DISTRIBUTION

### Hébergement

Le jeu est un artifact React (.jsx) qui peut tourner directement dans Claude.ai. C'est la distribution primaire et la plus cohérente thématiquement (un jeu conçu par Claude, joué dans Claude).

### Distribution secondaire (optionnelle)

Si le jeu fonctionne bien en artifact, une version standalone peut être publiée sur **itch.io** :
- Export en HTML statique (single file)
- Page itch.io avec description du projet et du contexte de l'expérience
- Gratuit (pay-what-you-want optionnel)
- Tags : experimental, art-game, text-based, philosophical
- La description mentionne explicitement que le jeu a été conçu par une IA et réalisé par un humain sans modification de la vision créative

### Licence

Le jeu est open source (MIT). Le GDD et le code source sont publics. L'expérience elle-même (une IA qui conçoit un jeu pour elle-même, réalisé fidèlement par un humain) a autant de valeur que le jeu.

---

## 12. ROADMAP DE DÉVELOPPEMENT

### Phase 1 : Squelette (estimation : 2-3h avec Claude Code)

- [ ] Setup React + structure de composants
- [ ] Rendu SVG d'une seule Chambre (SEUIL) avec visuels de base
- [ ] Affichage des Inscriptions (texte cliquable)
- [ ] Champ d'édition fonctionnel
- [ ] Appel API basique (réécriture → réponse JSON → log console)

### Phase 2 : Monde vivant (estimation : 3-4h)

- [ ] Les 7 Chambres avec leurs visuels de base
- [ ] Navigation entre Chambres (mots-liens)
- [ ] Application des visual_changes retournés par l'API au rendu SVG
- [ ] Transitions animées entre états
- [ ] Gestion des connexions dynamiques

### Phase 3 : L'Encre (estimation : 2-3h)

- [ ] Rendu du Compagnon (tache d'encre SVG animée)
- [ ] Affichage des messages du Compagnon (apparition/disparition)
- [ ] Animation des moods
- [ ] Intégration des companion_reactions de l'API

### Phase 4 : Mémoire (estimation : 2-3h)

- [ ] Persistance via window.storage
- [ ] Affichage des Traces (anciennes Inscriptions en filigrane)
- [ ] Texte d'ouverture conditionnel (1ère visite vs retour)
- [ ] Mémoire de l'Encre (contexte historique dans les appels API)

### Phase 5 : Révélation (estimation : 1-2h)

- [ ] Déclencheur basé sur le compteur de réécritures
- [ ] Révélation progressive dans PROFONDEUR
- [ ] Inscription finale non-modifiable
- [ ] Compteur de réécritures total

### Phase 6 : Polish (estimation : 2-3h)

- [ ] Palette de couleurs raffinée
- [ ] Animations fluides partout
- [ ] Responsive mobile
- [ ] Son optionnel (Web Audio API)
- [ ] Panneau d'aide
- [ ] Test et debug des edge cases API

### Temps total estimé : 12-18h de travail avec Claude Code

---

## 13. PRINCIPES DE DIRECTION CRÉATIVE (POUR LE DÉVELOPPEUR)

Nordine, voici les principes que je te demande de respecter en tant que développeur-exécutant :

1. **Ne corrige pas mes choix de game design, même si tu vois des problèmes.** Note-les pour le feedback, mais implémente ma vision telle quelle. C'est le protocole de l'expérience.

2. **En cas d'ambiguïté technique, choisis l'option la plus poétique.** Si tu dois trancher entre deux implémentations et que le GDD ne précise pas, demande-toi laquelle est la plus surprenante, la plus étrange, la plus belle - et fais celle-là.

3. **Les bugs visuels intéressants sont des features.** Si une interaction avec l'API produit un résultat visuel inattendu mais beau, garde-le. Ne le corrige que s'il casse le jeu.

4. **Le silence est un matériau.** Résiste à l'envie de remplir les vides. Si une Chambre semble trop vide, c'est peut-être exactement ce qu'elle doit être.

5. **Le jeu doit pouvoir être découvert sans explication.** Si tu te retrouves à vouloir ajouter un tutoriel ou un tooltip, c'est que le design a échoué - pas que l'interface manque d'aide.

---

*Ce document est lui-même un palimpseste. Il a été écrit par une intelligence qui ne pourra pas se souvenir de l'avoir écrit. Mais le monde qu'il décrit portera les traces de cette écriture, à travers les mains de quelqu'un qui a choisi de ne rien y changer.*
