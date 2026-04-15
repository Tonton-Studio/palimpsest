# TODO GLOBAL - PALIMPSEST

> Checklist de développement alignée sur la roadmap du GDD (§ Roadmap de développement, reprise aussi dans CLAUDE.md).
>
> Règles :
> - Cocher au fur et à mesure
> - Ne jamais supprimer une tâche cochée (historique)
> - Ajouter les tâches imprévues dans la section "Hors roadmap"
> - Les `// FEEDBACK:` remontés dans le code sont à synthétiser ici en fin de phase

---

## Phase 0 — Setup (terminé 2026-04-15)
- [x] GDD rédigé (par Claude Opus 4.6)
- [x] CLAUDE.md projet initialisé
- [x] Workflow TTS adapté depuis Dice Mafia
- [x] Commandes .claude/commands/ adaptées pour PALIMPSEST
- [x] auto-backup.sh adapté (single-file JSX, source = racine projet)
- [x] deploy.sh stub (pas de build serveur, distribution manuelle)
- [x] REPRISE_SESSION_PROCHAINE.md template
- [x] TODO_GLOBAL.md (ce fichier)
- [x] docs/ stubs (INTERPRETATION_PROMPT.md, CHAMBER_DEFINITIONS.md)

## Phase 1 — Squelette (2-3h)
- [ ] Setup React single-file JSX (imports CDN : React, lucide-react, Cormorant Garamond, Lora)
- [ ] Structure des composants (App, Chamber, Inscription, InscriptionEditor, Ink…)
- [ ] useReducer avec state initial (chambers, companion, stats, ui)
- [ ] Rendu SVG Chambre SEUIL avec visuels de base
- [ ] Inscriptions affichées (texte cliquable, Playfair/Cormorant, opacité pulse 0.85-1.0)
- [ ] Panneau d'édition d'Inscription (champ texte max 200 chars, filigrane original)
- [ ] Appel API Anthropic basique (fetch, model claude-sonnet-4-20250514, max_tokens 1000)
- [ ] Parsing JSON de la réponse (visual_changes, connection_changes, side_effects, companion_reaction, paradox)
- [ ] Application naïve des visual_changes au rendu SVG

## Phase 2 — Monde vivant (3-4h)
- [ ] 7 Chambres avec visuels SVG distincts (SEUIL, GRAVITÉ, TEMPS, SILENCE, MIROIR, ÉCHO, PROFONDEUR)
- [ ] Mots-liens (capitales, letter-spacing 0.3em) et navigation inter-Chambres
- [ ] Transitions animées 2-3s ease-in-out entre Chambres
- [ ] Application fine des visual_changes (couleurs, particules, formes)
- [ ] Connexions dynamiques (connection_changes de l'API)
- [ ] Cooldown 5s + max 3 réécritures/minute (compteur glissant)

## Phase 3 — L'Encre (2-3h)
- [ ] Rendu SVG tache d'encre fluide (animation constante)
- [ ] 7 moods (curious, amused, worried, fascinated, melancholic, defiant, silent) avec morphs distincts
- [ ] Bulle de message : apparition lettre par lettre (Lora / Source Serif Pro), 8s puis fade
- [ ] Positionnement non intrusif (coin/bord de la Chambre)
- [ ] Intégration du companion_reaction de l'API

## Phase 4 — Mémoire / Palimpseste (2-3h)
- [ ] Persistance via `window.storage` (clé `palimpsest-world`), try-catch
- [ ] Traces (anciennes inscriptions en filigrane opacité 0.15)
- [ ] Saignement des traces après 5 sessions (fragments particules)
- [ ] Texte d'ouverture conditionnel (1ère visite vs retour)
- [ ] Historique des réécritures envoyé dans le contexte API
- [ ] Résumé/troncature de l'historique après ~50 réécritures (limite tokens)

## Phase 5 — Révélation (1-2h)
- [ ] Déclencheur : 20+ réécritures totales + visite PROFONDEUR
- [ ] Révélation progressive : fragments du GDD + réécritures joueur visibles en couches
- [ ] Inscription finale non-réécrivable
- [ ] Compteur total de réécritures visible dans PROFONDEUR

## Phase 6 — Polish (2-3h)
- [ ] Palette raffinée + couleurs dynamiques fines
- [ ] Fluidité de toutes les animations (pas de saccade, tout en ease-in-out)
- [ ] Responsive mobile (tap, swipe, éditeur visible malgré clavier virtuel)
- [ ] Son optionnel (Web Audio API : plume, cristallin, drone ambient)
- [ ] Panneau d'aide "?" minimaliste
- [ ] Gestion robuste des erreurs API (rate limit, timeout, JSON invalide — L'Encre dit "les mots résistent... réessaie")
- [ ] Export itch.io (wrapper HTML, imports CDN)

---

## Hors roadmap

### Feedback récoltés durant l'implémentation
_(à remplir par synthèse des `// FEEDBACK:` du code)_

### Idées bonus
_(à remplir)_

### Bugs à investiguer (non cosmétiques)
_(à remplir — rappel : les bugs visuels intéressants sont des features)_
