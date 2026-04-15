# REPRISE SESSION PROCHAINE - PALIMPSEST

> Fichier de passation rempli en fin de session pour que la session suivante démarre à chaud.
> À lire en premier via `/tts_takeover`.

## Date de la dernière session
**2026-04-15** — Session 0 (Setup workflow TTS)

## Où on s'est arrêtés
Fin de la Phase 0 (Setup). Tout le workflow TontonStudio a été adapté depuis le clone Dice Mafia, l'arborescence du projet est propre, les stubs docs sont prêts. Aucune ligne de code JSX écrite — prochain step : attaquer la Phase 1 (Squelette) dans une nouvelle session pour repartir avec un contexte frais (le GDD fait 30 Ko et mérite une relecture complète).

## État actuel du projet
- **Phase en cours** : **Phase 1 — Squelette** (2-3h estimées selon GDD)
- **Fichier source principal** : `src/Palimpsest.jsx` — **pas encore créé**, répertoire `src/` vide et prêt
- **Dernière Chambre implémentée** : aucune
- **Nombre de Chambres fonctionnelles** : 0 / 7
- **Stack confirmé** : React JSX single-file artifact, SVG, CSS animations, API Anthropic (claude-sonnet-4-20250514), `window.storage` (clé `palimpsest-world`)

## Ce qui fonctionne (Setup)
- `CLAUDE.md` projet en place (SSOT technique + créatif) — **ne pas modifier la vision**
- `PALIMPSEST_GDD.md` à la racine (SSOT design absolu, conçu par Claude Opus 4.6, intouchable)
- `.claude/commands/` (17 commandes TTS adaptées depuis Dice Mafia : tts_takeover, tts_handover, tts_sanctuarize, tts_hardcoredebug, tts_aihelp, tts_aihelp_followup, tts_todo, tts_todoupdate, epct, INTER_COMMANDS_COHERENCE + 7 dans spec/)
- `_DEV_/auto-backup.sh` adapté : source = racine projet, destination = `_DEV_/backups/{daily|milestones|golden|misc}/`, check GDD+CLAUDE.md au lieu de package.json. Syntaxe bash validée.
- `deploy.sh` stub (pas de build serveur, distribution manuelle via copie artifact)
- `TODO_GLOBAL.md` : roadmap des 6 phases, Phase 0 cochée
- `docs/INTERPRETATION_PROMPT.md` + `docs/CHAMBER_DEFINITIONS.md` : stubs structurés, prêts à remplir depuis GDD §3 et §4

## Ce qui reste à faire (priorités session prochaine)

**Avant de coder** :
1. **Relire GDD §3 (Les 7 Chambres)** et remplir `docs/CHAMBER_DEFINITIONS.md` avec les 2-3 Inscriptions initiales de chaque Chambre + données visuelles
2. **Relire GDD §4 (Interprétation)** et finaliser `docs/INTERPRETATION_PROMPT.md` avec le prompt système exact

**Phase 1 — Squelette** (voir TODO_GLOBAL.md pour la checklist fine) :
- Setup React single-file JSX (imports CDN : React, lucide-react, Google Fonts Cormorant Garamond + Lora)
- Structure des composants selon l'arbo du CLAUDE.md (`App`, `Chamber`, `Inscription`, `InscriptionEditor`, `Ink`, `ChamberBackground`…)
- `useReducer` avec state initial (voir CLAUDE.md "Gestion d'état")
- Rendu SVG Chambre SEUIL de base
- Inscriptions affichées (Playfair/Cormorant, pulse opacité 0.85-1.0 sur 4s)
- Panneau d'édition (max 200 chars, filigrane original opacité 0.15)
- Premier appel API Anthropic avec le prompt d'interprétation (claude-sonnet-4-20250514, max_tokens 1000, JSON strict)
- Application naïve des `visual_changes` au rendu

## Bugs connus / points d'attention
- **Rappel GDD** : les bugs visuels intéressants sont des features. Ne corriger que si ça casse le jeu.
- **Rappel GDD** : en cas d'ambiguïté technique, choisir l'option la plus poétique/surprenante/belle.
- **Rate limit API** : 3 réécritures/minute max côté jeu. Prévoir feedback "le monde réfléchit..." pendant le chargement dès la Phase 1.
- **Erreurs API** : try-catch obligatoire, fallback gracieux (L'Encre : "les mots résistent... réessaie").
- **NEVER** localStorage/sessionStorage — uniquement `window.storage`.
- **NO `<form>` tags** en React artifact — onClick/onChange uniquement.

## Décisions créatives récentes
- Claude = directeur créatif, Nordine = exécutant fidèle. Si un choix du GDD semble sous-optimal, l'implémenter tel quel et noter `// FEEDBACK: ...` dans le code pour synthèse en fin de phase (pas de correction de la vision).

## Fichiers touchés en dernier (session Setup)
- Créés : `REPRISE_SESSION_PROCHAINE.md`, `TODO_GLOBAL.md`, `docs/INTERPRETATION_PROMPT.md`, `docs/CHAMBER_DEFINITIONS.md`, `src/` (dossier vide), `.claude/` (complet depuis DiceMafia puis adapté)
- Modifiés : `_DEV_/auto-backup.sh`, `deploy.sh`, tous les `.claude/commands/**.md`, `.claude/settings.local.json`
- Non modifiés (intentionnel) : `CLAUDE.md`, `PALIMPSEST_GDD.md`

## Notes diverses

- **Point à valider plus tard** : `.claude/settings.local.json` a été élargi en wildcard `git push origin:*` (l'original restreignait à une branche DiceMafia spécifique). À restreindre à `main` ou autre une fois un repo git initialisé pour PALIMPSEST.
- **Pas de repo git pour l'instant** — le projet n'est pas encore versionné. À décider si on init un repo avant ou après Phase 1.
- **Backup milestone recommandé avant Phase 1** : `cd _DEV_ && ./auto-backup.sh milestone setup_phase0_complete` pour figer l'état propre du workspace avant la première ligne de JSX.
- Le dossier `backups/` à la racine a été supprimé par Nordine (snapshots hors-procédure hérités de DiceMafia, sans valeur). Les backups procéduraux vivent dans `_DEV_/backups/`.

---

## Pour la prochaine session — commandes à lancer

```bash
# 1. Backup milestone (à faire MANUELLEMENT avant d'ouvrir la nouvelle session)
cd _DEV_ && ./auto-backup.sh milestone setup_phase0_complete

# 2. Dans la nouvelle session Claude Code :
/tts_takeover
```
