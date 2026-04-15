---
description: "Génère un prompt expert pour IA externe avec contexte complet du projet"
argument-hint: "[problème/question] - Description du problème à résoudre ou question à poser"
allowed-tools: ["Read", "Write", "Bash", "Glob", "Grep"]
---

# TTS AI Help - Prompt Expert pour IA Externe

Génère un prompt expert complet pour consulter des IA externes avec maximum de contexte sur le projet, l'architecture, les contraintes et les solutions déjà testées.

**Arguments**: `$ARGUMENTS` - Description du problème à résoudre ou question spécifique

## Workflow de génération prompt expert

### 1. Collecte du contexte projet
- Lire et analyser la documentation principale :
  - CLAUDE.md (règles et contraintes)
  - PALIMPSEST_GDD.md (SSOT game design)
  - TODO_GLOBAL.md (roadmap et priorités)
  - REPRISE_SESSION_PROCHAINE.md (contexte actuel)

### 2. Analyse de l'architecture technique
- Examiner la stack technique :
  - `src/Palimpsest.jsx` (fichier source unique)
  - `docs/INTERPRETATION_PROMPT.md` (prompt système API)
  - `docs/CHAMBER_DEFINITIONS.md` (données des 7 Chambres)
- Identifier les sections de code critiques liées au problème

### 3. Historique et contexte
- Consulter la mémoire projet pour les décisions importantes
- Analyser les derniers commits pour les tentatives récentes
- Identifier les patterns de solutions déjà testées
- Noter les contraintes spécifiques découvertes

### 4. Génération du prompt expert
Créer un fichier `PROMPT_AI_EXPERT_[TIMESTAMP].md` contenant :

```markdown
# CONSULTATION IA EXTERNE - PALIMPSEST

## PROBLEME A RESOUDRE
[Description détaillée du problème spécifique]

## CONTEXTE TECHNIQUE COMPLET

### Architecture Globale
- **Projet** : PALIMPSEST - Jeu d'exploration contemplative où le monde est écrit en langage naturel
- **Stack** : React (JSX) single-file artifact + SVG + CSS Animations + API Anthropic (claude-sonnet-4-20250514) + window.storage
- **Cible** : Web (artifact React Claude.ai en primaire, itch.io export HTML en secondaire)
- **Pas de** : build system, npm, package.json, Vite, Vue, TypeScript, Capacitor, mobile native

### Structure Projet
- `src/Palimpsest.jsx` - Fichier source unique (tout le code vit ici)
- `PALIMPSEST_GDD.md` - SSOT game design
- `docs/` - Docs annexes (prompt API, définitions Chambres)

### Contraintes Absolues
- Single file JSX, aucun build system
- SVG pour tout le rendu visuel
- Persistance via `window.storage` uniquement (clé `palimpsest-world`) - JAMAIS localStorage/sessionStorage
- API Anthropic : model `claude-sonnet-4-20250514`, max_tokens 1000, réponse JSON
- UI 100% en français avec accents
- Animations lentes et contemplatives (2-3s ease-in-out, aucun mouvement brusque)

## FICHIERS CONCERNES

### Code Principal
[Extraits pertinents de `src/Palimpsest.jsx`]

## SOLUTIONS DEJA TESTEES
[Historique des tentatives avec résultats]

## OBJECTIF RECHERCHE
[Résultat attendu précis]

## CONTRAINTES CRITIQUES
- Préserver l'architecture single-file JSX
- Respecter la vision créative du GDD (ne pas la modifier)
- Solutions compatibles artifact Claude.ai et export HTML itch.io
- Code maintenable et lisible

## DEMANDE SPECIFIQUE
[Question précise pour l'IA externe]
```

### 5. Génération du package source (si pertinent)
- Créer un fichier `SOURCES_AI_EXPERT_[TIMESTAMP].zip` contenant :
  - `src/Palimpsest.jsx`
  - Docs pertinents (`PALIMPSEST_GDD.md`, `docs/INTERPRETATION_PROMPT.md`, etc.)
  - Exclure : `_DEV_/backups/`, `.git/`

### 6. Instructions d'utilisation
- Afficher le chemin vers le prompt généré
- Rappeler que ces fichiers sont temporaires et seront nettoyés par `/tts_sanctuarize`

## Notes importantes
- Fichiers générés sont TEMPORAIRES (nettoyés par `/tts_sanctuarize`)
- Toujours anonymiser les données sensibles si présentes
- Inclure maximum de contexte pour éviter les allers-retours
