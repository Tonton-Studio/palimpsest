# PALIMPSEST - CLAUDE.md

## Project Overview
PALIMPSEST v1.0 - Jeu d'exploration contemplative où le monde est écrit en langage naturel et où réécrire ses règles le transforme
Stack: React (JSX) + SVG + CSS Animations + Claude via la capacité `sample` des pages Claude.ai (depuis le 2026-10-07 ; GDD v1 : API Anthropic claude-sonnet-4-20250514) + persistance à câbler en Phase 4 (capacité `db`, successeur de window.storage)
Target: Web (page Artifact publiée sur Claude.ai en primaire : https://claude.ai/artifact/YUQcKR8eQaxNmbyhBFxxkV, privée ; itch.io export HTML en secondaire)

## Game Vision
- **Pitch**: "Un monde écrit en phrases. Réécris-les. Observe ce qui change. Il n'y a rien à gagner. Il y a à comprendre."
- **Core loop**: Explorer une Chambre → Lire ses Inscriptions → Réécrire une Inscription → Observer la transformation visuelle → Écouter le Compagnon → Naviguer vers une autre Chambre
- **NOT** un text adventure, NOT un visual novel, NOT un puzzle à solutions fixes, NOT un jeu à score
- **Monetization**: Gratuit. Open source (MIT). Pay-what-you-want optionnel sur itch.io.
- **GDD**: PALIMPSEST_GDD.md (SSOT game design, conçu intégralement par Claude Opus 4.6)
- **Expérience**: Jeu conçu par une IA pour elle-même, réalisé fidèlement par un humain sans modification de la vision créative
- **PUBLIC CIBLE : LES IA** (intention fondatrice de Nordine, précisée le 2026-10-08, registre ligne 22). Le jeu est fait par une IA *pour les IA*. Le GDD v1 (gelé) conçoit pourtant son interface pour un joueur humain : l'écart est à traiter dans la couche v2. Ne plus rien décider sur le jeu ou la candidature sans tenir compte de ce point.

## Critical Rules
- **Claude est le directeur créatif. Nordine exécute.** Depuis le 2026-10-07, Nordine l'a confirmé explicitement : « c'est toi qui décide puisque c'est TON jeu ». Claude **tranche lui-même** les questions créatives (visuel, texte, game design) et ne les renvoie pas à Nordine. Il le consulte sur l'agenda, l'administratif et ce qui engage Nordine personnellement.
- **Le GDD v1 (`PALIMPSEST_GDD.md`) est gelé : on n'y efface ni n'y modifie rien.** Les révisions du directeur créatif s'écrivent dans une couche suivante (GDD v2), par-dessus, en laissant v1 lisible. Nordine ne modifie jamais la vision créative : si un choix semble problématique, il l'implémente et le note pour le feedback.
- **En cas d'ambiguïté technique**, choisir l'option la plus poétique/surprenante/belle.
- **Les bugs visuels intéressants sont des features.** Ne corriger que si ça casse le jeu.
- **Le silence est un matériau.** Ne pas remplir les vides.
- **Zéro tutoriel, zéro tooltip.** Le jeu se découvre par l'expérimentation.
- Tout le texte in-game est en **français**.
- La source du jeu reste **un seul fichier `src/Palimpsest.jsx`**. La page publiée est un produit de build : `node _DEV_/build_artifact.mjs` puis publication de `dist/palimpsest.html` avec `capabilities: {sample: {}}` (même chemin de fichier = même URL).
- L'interprétation passe par **`sample.json(prompt, {modelTier: "default"})`** sur la page publiée (décision du 2026-10-07, registre ligne 19). Le GDD v1 citait claude-sonnet-4-20250514, max_tokens 1000 : ces valeurs ne valent plus que pour un éventuel appel direct (itch.io, Phase 6).
- Persistance (Phase 4) : `window.storage` n'existe plus sur les pages publiées ; son successeur est la capacité **`db`** (état privé par joueur). Clé logique conservée : `palimpsest-world`.
- **Porte pour joueur IA** (depuis le 2026-10-19, registre lignes 25 et 27 à 33) : une IA lit chaque Chambre décrite en mots (produits par le code depuis le même état que le SVG) et joue par gestes écrits (`réécrire N : …`, `gratter N`, `aller NOM`, `attendre`, `partir`). Le moteur (`runAiSession`, `describeChamber`, `parsePlayerReply`) vit dans `src/Palimpsest.jsx` et sert deux usages : **REGARDER** sur la page publiée (Claude joue, un humain regarde) et **`porte/play.mjs`** en local (n'importe quel modèle). Mode d'emploi : `porte/README.md`. **Après toute modification du moteur : `node porte/test_engine.mjs`.**
- **Juiciness** : arbitrage propre au projet dans `.claude/rules/juiciness.md` (le jus de PALIMPSEST, c'est la lenteur : ni secousse, ni rebond, ni flash).

## Journal de l'expérimentation — PROTOCOLE PERMANENT (depuis le 2026-10-07)

L'expérience (une IA dirige, un humain exécute) compte autant que le jeu. **Chaque session est documentée, sans exception.** Procédure complète et grille d'analyse : `journal/README.md`.

1. **Automatique** : le hook `Stop` / `SessionEnd` (`.claude/settings.json`) exporte la transcription dans `journal/transcripts/` (**privée, jamais versionnée**). Ne jamais l'éditer à la main.
2. **Dès le premier échange de fond** : ouvrir `journal/sessions/AAAA-MM-JJ_session-NN.md` (gabarit dans le README) et le tenir à jour **à chaque jalon** (décision, livraison, erreur, écart au protocole), pas seulement en fin de session.
3. **Chaque décision** qui engage le jeu ou l'expérience va dans `journal/REGISTRE_DES_DECISIONS.md` : qui en a eu l'initiative, qui l'a tranchée, conforme ou non au protocole d'inversion.
4. **Analyse objective** : faits séparés des interprétations, une contre-lecture pour chaque observation, erreurs de Claude consignées en premier, limites de l'analyse explicites. La section « Contrepoint de Nordine » n'est jamais écrite par Claude.
5. **Clôture** à `/tts_handover` ou `/tts_sanctuarize` ; **lecture** à `/tts_takeover` (registre + dernière entrée, à compléter si elle n'a pas été close).

## Candidature Garage IAG 2027
Nordine candidate avec PALIMPSEST à la résidence Garage IAG 2027 (Game Créalab, Bordeaux, soutien CNC). Date limite officielle : 15 novembre 2026 à minuit ; **dépôt prévu le 3 novembre, le 4 après-midi en secours** (décision de Nordine, registre ligne 26 ; le 6, prévu au départ, n'est plus disponible depuis le 20 octobre). Depuis le 21 octobre, le dossier est en bas des priorités de Nordine (registre, ligne 34) : Claude fait tout ce qui ne demande ni sa voix ni sa signature. Préparation : `candidature/garage-iag-2027/README.md` (**local, jamais versionné**). Dates de résidence marquées `[TBD]` dans l'agenda jusqu'aux résultats du 15 décembre.

**Publication (option B)** : code, GDD, entrées du journal et registre deviendront publics avant le dépôt, après relecture du journal par Nordine. Transcriptions brutes et candidature restent privées.

## Architecture

```
palimpsest/
├── CLAUDE.md                    # Ce fichier (contexte projet pour Claude Code)
├── PALIMPSEST_GDD.md            # GDD v1 (Claude Opus 4.6) - GELÉ, les révisions vont dans une couche v2
├── src/
│   └── Palimpsest.jsx           # Application React single-file (artifact)
├── docs/
│   ├── INTERPRETATION_PROMPT.md  # Prompt système pour l'API d'interprétation (ref GDD §4)
│   └── CHAMBER_DEFINITIONS.md   # Données des 7 Chambres (inscriptions, visuels, connexions)
├── journal/                     # Journal de l'expérimentation (protocole permanent, voir README)
│   ├── README.md                # Procédure, grille d'analyse, règles d'honnêteté, gabarit
│   ├── REGISTRE_DES_DECISIONS.md
│   ├── sessions/                # Une entrée analysée par session
│   └── transcripts/             # Transcriptions brutes exportées automatiquement
├── candidature/garage-iag-2027/ # Préparation de la candidature à la résidence
├── porte/                       # Porte pour joueur IA : play.mjs (parties locales), engine.mjs, test_engine.mjs, README
│   ├── parties/                 # Récits et journaux des parties (non versionnés)
│   └── mondes/                  # Mondes persistants partagés entre parties (non versionnés)
├── _DEV_/                       # Preview locale (index.html, réponses et joueur IA simulés), build de la page, backups
├── .claude/hooks/export_transcript.py  # Export automatique des transcriptions
├── .claude/rules/juiciness.md   # Arbitrage game feel propre au projet
└── REPRISE_SESSION_PROCHAINE.md  # État de la dernière session pour reprise de contexte
```

Preview locale : `python3 -m http.server 8765 --bind 127.0.0.1` à la racine, puis `http://127.0.0.1:8765/_DEV_/index.html` (réponses simulées, aucun appel API). Page construite : `http://127.0.0.1:8765/dist/palimpsest.local.html` (hors de Claude.ai, sans Claude : L'Encre répond « les mots résistent »).

### Composants React (dans le single file)

```
<App>
├── <OpeningScreen />          // Texte d'ouverture (1ère visite vs retour)
├── <Chamber>                  // Chambre active
│   ├── <ChamberBackground />  // SVG : formes géométriques, particules, gradients
│   ├── <Inscription />        // Chaque inscription cliquable (+ Traces en filigrane)
│   ├── <InscriptionEditor />  // Panneau d'édition (champ texte, max 200 chars)
│   ├── <Ink />                // Le Compagnon L'Encre (tache d'encre SVG animée)
│   │   └── <InkMessage />     // Bulle de texte temporaire (8s, lettre par lettre)
│   ├── <ConnectionLinks />    // Mots-liens vers autres Chambres (capitales, letter-spacing 0.3em)
│   └── <RevelationLayer />    // Couche spéciale pour Chambre PROFONDEUR (après 20+ réécritures)
├── <HelpPanel />              // Panneau "?" minimaliste
└── <TransitionOverlay />      // Fondu entre Chambres (2-3s ease-in-out)
```

### Gestion d'état (useReducer)

```javascript
{
  currentChamber: "SEUIL",
  chambers: {
    SEUIL: {
      inscriptions: [{ id, original, current, history: [] }],
      visuals: { /* visual_changes JSON de l'API */ },
      connections: ["GRAVITÉ", "TEMPS"]
    },
    // GRAVITÉ, TEMPS, SILENCE, MIROIR, ÉCHO, PROFONDEUR
  },
  companion: { mood: "curious", currentMessage: null },
  stats: { totalRewrites: 0, sessionRewrites: 0, sessionsCount: 1, revelationUnlocked: false },
  ui: { editingInscription: null, showHelp: false, transitioning: false, showOpening: true }
}
```

## Les 7 Chambres (résumé - détails dans GDD §3)

| Chambre | Thème | Inscriptions initiales | Connexions |
|---------|-------|----------------------|------------|
| SEUIL | Entrée, intérieur/extérieur | 2 inscriptions | GRAVITÉ, TEMPS |
| GRAVITÉ | Attraction, poids, centre | 3 inscriptions | SEUIL, SILENCE, MIROIR |
| TEMPS | Séquence, durée, passage | 3 inscriptions | SEUIL, ÉCHO, PROFONDEUR |
| SILENCE | Absence, vide, non-dit | 2 inscriptions | GRAVITÉ, ÉCHO |
| MIROIR | Réflexion, double, identité | 3 inscriptions | GRAVITÉ, PROFONDEUR |
| ÉCHO | Répétition, transformation, copie | 3 inscriptions | TEMPS, SILENCE, PROFONDEUR |
| PROFONDEUR | Sous la surface, méta, code | 3 inscriptions | TEMPS, MIROIR, ÉCHO |

## Mécanique centrale : la Réécriture

1. Joueur clique sur une Inscription → panneau d'édition s'ouvre
2. Inscription originale visible en filigrane (opacité 0.15)
3. Joueur modifie (max 200 chars) et valide
4. Appel API Anthropic avec prompt d'interprétation (voir GDD §4)
5. API retourne JSON : visual_changes, connection_changes, side_effects, companion_reaction, paradox
6. Chambre se transforme visuellement (transition animée 2-3s)
7. L'Encre réagit (message + changement de mood)
8. Cooldown 5s entre réécritures, max 3/minute
9. Sauvegarde monde via window.storage après chaque réécriture

## Mécanique de mémoire : le Palimpseste

- Persistance cross-sessions via `window.storage.set('palimpsest-world', ...)`
- Les anciennes Inscriptions laissent des **Traces** (filigrane, opacité 0.15)
- Après 5 sessions, les traces anciennes "saignent" : fragments de mots en particules flottantes
- Début de session : monde chargé avec état sauvegardé + texte d'ouverture contextuel
- L'Encre se souvient de tout (historique envoyé dans le contexte API)

## Le Compagnon : L'Encre

- Visuellement : tache d'encre SVG fluide, sans corps, change de forme selon mood
- Moods : curious, amused, worried, fascinated, melancholic, defiant, silent
- Ne dit JAMAIS quoi faire. Observe, questionne, s'émerveille, s'inquiète.
- Messages : apparition lettre par lettre, disparition après 8s
- Position : coin/bord de la Chambre, non intrusif

## Direction artistique

- **Palette de base** : fond noir profond (#0A0A0F), inscriptions blanc cassé (#E8E4D9), formes bleu nuit (#1a1a3e) à indigo (#2d1b69), lumière ambre (#D4A76A), Encre noir absolu (#000000)
- **Typographie** : Inscriptions en Playfair Display ou Cormorant Garamond (serif). Texte Encre en Lora ou Source Serif Pro. Mots-liens en capitales letter-spacing 0.3em.
- **Animation** : tout en mouvement lent et constant. Transitions 2-3s ease-in-out. Inscriptions pulsent (opacité 0.85-1.0 sur 4s). AUCUN mouvement brusque.
- **Son** : silencieux par défaut. Sons optionnels en Web Audio API (plume, cristallin, drone ambient).
- **Style visuel** : SVG abstrait et atmosphérique. Kandinsky + mandalas génératifs + Monument Valley. Poésie visuelle, pas lieu physique.

## Moment de révélation (GDD §8)

- Déclenché après 20+ réécritures totales + visite de PROFONDEUR
- Fragments du GDD et des réécritures du joueur deviennent lisibles dans les couches
- Inscription finale non-réécrivable apparaît
- Compteur total de réécritures visible dans PROFONDEUR

## Roadmap de développement

### Phase 1 : Squelette (2-3h)
- [ ] Setup React + structure composants dans single file JSX
- [ ] Rendu SVG Chambre SEUIL avec visuels de base
- [ ] Inscriptions affichées (texte cliquable)
- [ ] Champ d'édition fonctionnel
- [ ] Appel API basique (réécriture → JSON → application)

### Phase 2 : Monde vivant (3-4h)
- [ ] 7 Chambres avec visuels SVG de base
- [ ] Navigation mots-liens entre Chambres
- [ ] Application des visual_changes au rendu SVG
- [ ] Transitions animées entre états
- [ ] Connexions dynamiques (connection_changes)

### Phase 3 : L'Encre (2-3h)
- [ ] Rendu tache d'encre SVG animée
- [ ] Messages apparition/disparition lettre par lettre
- [ ] Animation des 7 moods
- [ ] Intégration companion_reaction de l'API

### Phase 4 : Mémoire (2-3h)
- [ ] Persistance window.storage
- [ ] Traces (anciennes inscriptions en filigrane)
- [ ] Texte d'ouverture conditionnel (1ère vs retour)
- [ ] Mémoire de l'Encre (historique dans contexte API)

### Phase 5 : Révélation (1-2h)
- [ ] Déclencheur 20+ réécritures
- [ ] Révélation progressive dans PROFONDEUR
- [ ] Inscription finale non-modifiable
- [ ] Compteur total

### Phase 6 : Polish (2-3h)
- [ ] Palette raffinée + couleurs dynamiques
- [ ] Animations fluides partout
- [ ] Responsive mobile (tap, swipe)
- [ ] Son optionnel (Web Audio API)
- [ ] Panneau d'aide "?"
- [ ] Edge cases API (rate limit, erreurs, timeout)

## Technical Rules

- Single file JSX — pas de fichiers séparés CSS/JS
- SVG pour tout le rendu visuel (formes, particules, Encre)
- CSS animations + requestAnimationFrame pour le mouvement
- API Anthropic : model claude-sonnet-4-20250514, max_tokens 1000, réponse JSON uniquement
- window.storage : clé `palimpsest-world`, sérialisation JSON, try-catch obligatoire
- Limite 200 chars par Inscription joueur
- Cooldown 5s entre réécritures (setTimeout)
- Max 3 réécritures/minute (compteur glissant)
- Fonts Google : Cormorant Garamond + Lora (import CDN)
- Libs React disponibles : lucide-react, recharts, d3, Three.js (si besoin particules), shadcn/ui
- JAMAIS de localStorage/sessionStorage — uniquement window.storage
- Pas de <form> tags en React — onClick/onChange handlers

## Sessions

### Session 0 - Setup (2026-04-15)
- Setup projet, CLAUDE.md, GDD finalisé
- Prêt pour Phase 1

### Session 1 - Phase 1 Squelette + init dépôt (2026-04-15)
- Repo git local + remote privé `Tonton-Studio/palimpsest` (3 commits main)
- `docs/CHAMBER_DEFINITIONS.md` et `docs/INTERPRETATION_PROMPT.md` remplis depuis GDD §3 et §4
- `src/Palimpsest.jsx` créé (1020 lignes, single-file) :
  - `useReducer` GDD-compliant (7 Chambres, companion, stats, ui)
  - `ChamberBackground` SVG + `Shape` (8 primitives × 9 behaviors)
  - `Inscription` + Trace filigrane, `InscriptionEditor` 200 chars
  - `Ink` + `InkMessage` lettre par lettre 8s
  - `ConnectionLinks`, `HelpPanel`, `OpeningScreen`
  - `callInterpretation` avec fallback `window.claude.complete` ↔ `fetch`
  - Cooldown 5s + rate limit 3/min actifs
- **FEEDBACK P1 consigné** : divergence GDD §10 `fetch` direct vs artifact CORS → fallback runtime. À arbitrer Phase 6.
- Validation manuelle artifact + cycle réécriture API = non testés (Phase 2)

### Session 2 - Reprise après 6 mois, journal, candidature (2026-10-07, Claude Opus 5.5)
- Travail non consigné d'avril retrouvé (preview locale `_DEV_/`, réponses simulées, 3 correctifs) ; validé dans la preview ; régression du `pulse` corrigée (commit `80ff970`)
- Nordine rend explicitement la direction créative à Claude ; décision : GDD v1 gelé, révisions dans une couche v2
- Mise en place du journal de l'expérimentation (protocole permanent + export automatique des transcriptions)
- Préparation de la candidature Garage IAG 2027 (date limite 15/11/2026)
- Détail et analyse : `journal/sessions/2026-10-07_session-02.md`

### Session 3 - Candidature, sur Claude.ai (2026-10-08, Claude Opus 5.5)
- Intention fondatrice précisée : le jeu est fait pour les IA ; nouvel angle de candidature ; priorité à une porte pour joueur IA ; dépôt le 3 novembre
- Détail : `journal/sessions/2026-10-08_session-03.md`

### Session 4 - La porte pour joueur IA (2026-10-19, Claude Opus 5.5)
- Moteur de la porte dans `src/Palimpsest.jsx`, mode REGARDER sur la page publiée, instrument local `porte/play.mjs`, 15 tests
- Premier joueur IA : deepseek-r1 (7B, local) ne joue pas, il prend le monde pour la question d'un utilisateur
- Export des transcriptions corrigé (le résumé de compaction était attribué à Nordine)
- Détail et analyse : `journal/sessions/2026-10-19_session-04.md`

### Session 5 - Dossier de candidature, première partie de Claude (2026-10-21, Claude Opus 5.5)
- Premier jet du sujet d'expérimentation et de la fiche projet, PDF 1 aux couleurs de Tonton Studio (candidature, privé)
- Première vraie partie de Claude dans REGARDER : deux réécritures en onze ou douze gestes, SILENCE laissé vide ; la page ne garde pas la marge (registre, ligne 38)
- Agenda et cartes du tableau de bord de Nordine mis à jour par Claude, avec son accord
- Détail et analyse : `journal/sessions/2026-10-21_session-05.md`

## Points d'attention
- **Rate limiting API** : 3 appels/minute max côté jeu. Prévoir feedback visuel "le monde réfléchit..." pendant le chargement.
- **Taille du contexte API** : l'historique des réécritures envoyé à l'API va grossir. Prévoir un résumé/troncature après ~50 réécritures pour rester dans les limites de tokens.
- **Erreurs API** : toujours try-catch, fallback gracieux (l'Encre dit "les mots résistent... réessaie").
- **Mobile** : le clavier virtuel peut cacher l'éditeur. S'assurer que le champ d'édition reste visible.
- **Paradoxes** : quand l'API détecte un paradoxe, l'état visuel peut devenir "étrange" — c'est voulu, ne pas corriger.
