# PALIMPSEST - CLAUDE.md

## Project Overview
PALIMPSEST v1.0 - Jeu d'exploration contemplative où le monde est écrit en langage naturel et où réécrire ses règles le transforme
Stack: React (JSX) + SVG + CSS Animations + API Anthropic (claude-sonnet-4-20250514) + window.storage (persistent storage)
Target: Web (artifact React Claude.ai en primaire, itch.io export HTML en secondaire)

## Game Vision
- **Pitch**: "Un monde écrit en phrases. Réécris-les. Observe ce qui change. Il n'y a rien à gagner. Il y a à comprendre."
- **Core loop**: Explorer une Chambre → Lire ses Inscriptions → Réécrire une Inscription → Observer la transformation visuelle → Écouter le Compagnon → Naviguer vers une autre Chambre
- **NOT** un text adventure, NOT un visual novel, NOT un puzzle à solutions fixes, NOT un jeu à score
- **Monetization**: Gratuit. Open source (MIT). Pay-what-you-want optionnel sur itch.io.
- **GDD**: PALIMPSEST_GDD.md (SSOT game design, conçu intégralement par Claude Opus 4.6)
- **Expérience**: Jeu conçu par une IA pour elle-même, réalisé fidèlement par un humain sans modification de la vision créative

## Critical Rules
- **NEVER** modifier la vision créative du GDD. Si un choix de design semble problématique, l'implémenter tel quel et noter le problème pour le feedback final.
- **GDD PALIMPSEST_GDD.md** est la source de vérité absolue pour le game design. Claude est le directeur créatif. Nordine exécute sans modifier.
- **En cas d'ambiguïté technique**, choisir l'option la plus poétique/surprenante/belle.
- **Les bugs visuels intéressants sont des features.** Ne corriger que si ça casse le jeu.
- **Le silence est un matériau.** Ne pas remplir les vides.
- **Zéro tutoriel, zéro tooltip.** Le jeu se découvre par l'expérimentation.
- Tout le texte in-game est en **français**.
- Le jeu doit tourner en **single file .jsx** (artifact React Claude.ai).
- Les appels API Anthropic utilisent **claude-sonnet-4-20250514**, max_tokens 1000.
- Persistance via **window.storage** (clé principale : `palimpsest-world`).

## Architecture

```
palimpsest/
├── CLAUDE.md                    # Ce fichier (contexte projet pour Claude Code)
├── PALIMPSEST_GDD.md            # Game Design Document (SSOT design - NE PAS MODIFIER)
├── src/
│   └── Palimpsest.jsx           # Application React single-file (artifact)
├── docs/
│   ├── INTERPRETATION_PROMPT.md  # Prompt système pour l'API d'interprétation (ref GDD §4)
│   └── CHAMBER_DEFINITIONS.md   # Données des 7 Chambres (inscriptions, visuels, connexions)
└── REPRISE_SESSION_PROCHAINE.md  # État de la dernière session pour reprise de contexte
```

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

## Points d'attention
- **Rate limiting API** : 3 appels/minute max côté jeu. Prévoir feedback visuel "le monde réfléchit..." pendant le chargement.
- **Taille du contexte API** : l'historique des réécritures envoyé à l'API va grossir. Prévoir un résumé/troncature après ~50 réécritures pour rester dans les limites de tokens.
- **Erreurs API** : toujours try-catch, fallback gracieux (l'Encre dit "les mots résistent... réessaie").
- **Mobile** : le clavier virtuel peut cacher l'éditeur. S'assurer que le champ d'édition reste visible.
- **Paradoxes** : quand l'API détecte un paradoxe, l'état visuel peut devenir "étrange" — c'est voulu, ne pas corriger.
