# REPRISE SESSION PROCHAINE - PALIMPSEST

> Fichier de passation rempli en fin de session pour que la session suivante démarre à chaud.
> À lire en premier via `/tts_takeover`.

## Date de la dernière session
**2026-04-15** — Session 1 (Phase 1 Squelette + init dépôt git)

## Où on s'est arrêtés
Phase 1 (Squelette) codée intégralement dans `src/Palimpsest.jsx` (1020 lignes). Le dépôt git local est initialisé et poussé sur le remote privé `Tonton-Studio/palimpsest` (main, 3 commits). Les docs de conception (`CHAMBER_DEFINITIONS.md`, `INTERPRETATION_PROMPT.md`) sont remplies depuis le GDD §3 et §4. Sanctuarisation effectuée avec backup milestone `phase1_squelette_git_init`.

**Non testé** : rendu réel dans un artifact Claude.ai, cycle complet de réécriture avec API vivante. C'est la toute première priorité de la session suivante avant d'attaquer Phase 2.

## État actuel du projet
- **Phase en cours** : **fin de Phase 1 — validation manuelle à faire** / prête à passer en Phase 2 dès que le rendu est vérifié
- **Fichier source principal** : `src/Palimpsest.jsx` (1020 lignes, single-file)
- **Chambres implémentées** : 7 / 7 (données canoniques complètes dans `CHAMBERS_INITIAL`)
- **Chambres rendues avec visuels distincts** : 7 / 7 (rendu naïf SVG, fin-tuning en Phase 2)
- **Stack confirmé** : React JSX single-file + SVG + CSS animations + API Anthropic (claude-sonnet-4-20250514) via `window.claude.complete` (artifact) ou `fetch` (standalone)
- **Repo** : `https://github.com/Tonton-Studio/palimpsest` (privé), branche `main`

## Ce qui fonctionne (Session 1)
- **Architecture** : `useReducer` complet, actions `SET_CHAMBER`, `START_EDIT`, `CANCEL_EDIT`, `REWRITE_START`, `REWRITE_APPLY`, `REWRITE_ERROR`, `CLEAR_INK_MESSAGE`, `CLOSE_OPENING`, `TOGGLE_HELP`
- **Composants** : `App` → `ChamberBackground` + `Shape` (8 formes × 9 behaviors), `Inscription` (avec Trace filigrane opacité 0.15), `InscriptionEditor` (200 chars, Escape/Enter), `Ink` + `InkMessage` (lettre par lettre 35ms, fade 8s), `ConnectionLinks`, `HelpPanel`, `OpeningScreen`
- **API** : `callInterpretation` avec détection runtime `window.claude.complete` → fallback `fetch`. Parsing défensif (enum + clamp + bornes) + rollback gracieux → L'Encre dit "les mots résistent... réessaie"
- **Rate limit** : cooldown 5 s + max 3 réécritures/min (fenêtre glissante 60 s)
- **Visuel** : keyframes `palimpsestPulse` (opacité 0.85 ↔ 1.0, 4 s), transitions `background 2.5s ease-in-out`, nom de Chambre en filigrane géant opacité 0.05
- **Fonts** : Cormorant Garamond + Lora injectées runtime via `document.head.appendChild`

## Ce qui reste à faire (priorités session prochaine)

### Avant d'attaquer Phase 2
1. **Coller `src/Palimpsest.jsx` dans un artifact Claude.ai** (ou preview HTML équivalent) et valider le rendu à l'œil :
   - Chambre SEUIL s'affiche, filigrane "SEUIL" géant en fond, 2 Inscriptions centrées, mots-liens GRAVITÉ/TEMPS en bas
   - Opening screen cliquable → disparaît
   - Clic sur une Inscription → éditeur s'ouvre avec filigrane original
   - Bouton "?" → panneau d'aide
   - Soumettre une réécriture → `window.claude.complete` est appelé → visuals mutent → L'Encre s'exprime
2. **Corriger les bugs éventuels** découverts au rendu (rappel GDD : les bugs visuels *intéressants* sont des features — ne corriger que si ça casse le jeu)

### Phase 2 — Monde vivant (3-4h estimées)
- Affiner les 7 rendus SVG (chaque Chambre doit avoir une identité visuelle forte, pas juste des primitives)
- `TransitionOverlay` : fondu 2-3 s ease-in-out entre Chambres
- Application fine des `visual_changes` (background_gradient, couleurs dynamiques, particules)
- Connexions dynamiques (déjà câblées côté reducer, à visualiser quand elles changent)

### Décisions techniques à trancher
- **`window.claude.complete` vs `fetch`** : aujourd'hui fallback runtime. Arbitrage Phase 6 selon cible primaire (artifact vs itch.io).

## Bugs connus / points d'attention
- **Non validé en artifact** : tout le rendu est théorique tant qu'on n'a pas collé le fichier dans un artifact Claude.ai. Risque principal : erreur de syntaxe JSX silencieuse ou import React mal exposé dans l'environnement cible.
- **Rappel GDD** : bugs visuels intéressants = features. Ne corriger que si ça casse le jeu.
- **Rappel GDD** : ambiguïté technique → option la plus poétique/surprenante/belle.
- **Rate limit API** : 3 réécritures/min côté jeu, indépendant du rate limit Anthropic. Message "le monde réfléchit…" déjà câblé sur le bouton "réécrire" pendant `loading`.
- **NEVER** localStorage/sessionStorage — `window.storage` uniquement (à câbler Phase 4).
- **NO `<form>` tags** — confirmé OK dans le code actuel (textarea + boutons directs).

## Décisions créatives récentes
- **Nom du repo** : `palimpsest` tout court (décision de Claude comme directeur créatif). Cohérent avec l'esthétique minimaliste du jeu.
- Divergence fetch/window.claude.complete non considérée comme design drift (contrainte d'exécution, pas vision créative).

## Fichiers touchés en dernier (Session 1)
- Créés : `src/Palimpsest.jsx`, `.gitignore`, `.git/` (repo + remote origin)
- Remplis : `docs/CHAMBER_DEFINITIONS.md`, `docs/INTERPRETATION_PROMPT.md`
- Modifiés : `TODO_GLOBAL.md` (Phase 1 cochée + feedback), `CLAUDE.md` (section Session 1), `REPRISE_SESSION_PROCHAINE.md` (ce fichier)
- Non modifiés : `PALIMPSEST_GDD.md` (SSOT intouchable)

## Backups & sanctuarisation
- `_DEV_/backups/milestones/2026/15-avril/setup_phase0_complete_20260415_091347/` (début session)
- `_DEV_/backups/milestones/2026/15-avril/phase1_squelette_git_init_20260415_095026/` (fin session)
- Remote GitHub : `https://github.com/Tonton-Studio/palimpsest` privé, branche `main`

---

## Pour la prochaine session — commandes à lancer

```bash
# Dans la nouvelle session Claude Code :
/tts_takeover
```

Puis première action concrète : coller `src/Palimpsest.jsx` dans un artifact Claude.ai pour validation visuelle.
