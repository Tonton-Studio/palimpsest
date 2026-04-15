---
description: 'Prise en main autonome du projet avec analyse complète et proposition de prochaine tâche'
argument-hint: 'Aucun argument requis - Analyse autonome du contexte projet'
allowed-tools: ['Read', 'Bash', 'Glob', 'Grep']
---

# TTS Takeover - Prise en Main Autonome Projet

Commande de prise en main autonome et intelligente du projet en l'absence de brief clair. Analyse complète du contexte, identification de la prochaine tâche prioritaire et validation utilisateur avant démarrage.

**Arguments** : Aucun - Analyse autonome du contexte projet

## Workflow Prise en Main (5 phases)

### Phase 1 - Vérification Préalable

- Vérifier git status et branche courante
- Vérifier que `src/Palimpsest.jsx` existe et ne présente pas d'erreur syntaxique évidente
- Identifier les fichiers modifiés récemment (`git log --oneline -10`)

### Phase 2 - Lecture Systématique Documents Critiques

#### 2.1 Contexte Projet Fondamental

**Ordre de lecture obligatoire** :

1. **PALIMPSEST_GDD.md** - SINGLE SOURCE OF TRUTH game design (7 Chambres, Inscriptions, mécanique de Réécriture, L'Encre, Traces, Révélation, scope v1.0). TOUTE déviation par rapport au GDD doit être signalée en ALERTE. **NE PAS MODIFIER** la vision créative.
2. **CLAUDE.md** - Instructions et règles critiques du projet
3. **TODO_GLOBAL.md** - SOURCE UNIQUE DE VERITE pour les tâches :
   - Lire TOUTES les tâches `[ ]` non cochées
   - Identifier les phases (Phase 1 Squelette -> Phase 6 Polish) et leur avancement
   - Noter les bugs à corriger en priorité
   - Vérifier que les sprints sont alignés avec le GDD
4. **REPRISE_SESSION_PROCHAINE.md** - Contexte dernière session et priorités

#### 2.2 Documents de Conception

5. **docs/INTERPRETATION_PROMPT.md** - Prompt système pour l'API d'interprétation (réf GDD §4)
6. **docs/CHAMBER_DEFINITIONS.md** - Données des 7 Chambres (inscriptions, visuels, connexions)
7. Tout autre doc dans `docs/` pertinent au sprint en cours

#### 2.3 Architecture Technique

8. **src/Palimpsest.jsx** - Fichier source unique (tout le code vit ici : composants React, état useReducer, rendu SVG, appels API, persistance window.storage)
9. **Mémoire projet** - Décisions importantes et breakthroughs

#### 2.4 ALERTE DESIGN DRIFT (OBLIGATOIRE)

Après lecture, vérifier systématiquement :
- Le code actuel est-il aligné avec le GDD ? Si non, signaler les écarts.
- Les 7 Chambres (SEUIL, GRAVITÉ, TEMPS, SILENCE, MIROIR, ÉCHO, PROFONDEUR) sont-elles respectées ?
- La mécanique de Réécriture suit-elle le flow GDD §4 (API interpretation, cooldown 5s, max 3/min) ?
- La persistance utilise-t-elle `window.storage` (clé `palimpsest-world`) et JAMAIS localStorage/sessionStorage ?
- L'UI est-elle 100% en français avec accents ?
- Si écart détecté, proposer la correction AVANT de commencer le sprint.

### Phase 3 - Analyse Déductive Prochaine Tâche

#### 3.1 Critères de priorisation

- **Criticité** : Bugs bloquants vs améliorations
- **Urgence** : Impact expérience joueur vs fonctionnalités avancées
- **Complexité** : Tâches rapides vs développements longs
- **Dépendances** : Bloqueurs pour autres tâches
- **Impact contemplatif** : Préserver la poésie du jeu, ne pas sur-fonctionnaliser

#### 3.2 Algorithme de priorisation

1. **Bugs critiques** identifiés dans REPRISE_SESSION_PROCHAINE.md
2. **Tâches "en cours"** dans TODO_GLOBAL.md
3. **Phase courante** non terminée dans TODO_GLOBAL.md
4. **Pattern d'urgence** dans derniers commits
5. **Architecture bloquante** empêchant autres développements

### Phase 4 - Génération Compte-Rendu Structuré

```markdown
# TAKEOVER REPORT - [TIMESTAMP]

## ETAT PROJET ANALYSE

### Architecture Actuelle
- **Projet** : PALIMPSEST v1.0
- **Branch** : [git branch courante]
- **Stack** : React (JSX) single-file artifact + SVG + CSS Animations + API Anthropic + window.storage
- **Fichier source** : src/Palimpsest.jsx
- **Etat rendu** : [OK / erreurs détectées]

### Dernière Session Complétée
- **Mission** : [objectif accompli]
- **Résultat** : [succès/échec/partiel]

### Fichiers Modifiés Récents
- [Liste des modifications récentes]

## PROCHAINES PRIORITES IDENTIFIEES

### Priorité 1 - [TACHE PROPOSEE]
**Criticité** : [Critique/Haute/Moyenne]
**Pourquoi maintenant** : [justification]
**Fichiers concernés** : [liste fichiers]

### Priorité 2-3 - Backlog
[autres tâches importantes]

## POINTS D'ATTENTION
- [Contraintes techniques]
- [Risques de régression]
- [Rappels GDD critiques]

## PLAN D'ACTION PROPOSE
1. [Etape 1]
2. [Etape 2]
3. [Validation manuelle dans artifact preview]
4. [Sanctuarisation]

## VALIDATION REQUISE
**Question** : Etes-vous d'accord pour démarrer la Priorité 1 ?
```

### Phase 5 - Attente Validation Utilisateur

- **Affichage rapport** complet dans le chat
- **Attente confirmation** explicite de l'utilisateur
- **Aucune action** avant validation positive
- **Propositions alternatives** si refus de la priorité suggérée

## Objectifs

- **Autonomie Totale** : Aucun brief requis
- **Mise à Jour Complète** : Lecture systématique TOUS documents critiques
- **Priorisation Intelligente** : Basée sur données réelles
- **Validation Respectueuse** : Aucune action sans accord utilisateur
- **Respect du GDD** : Vision créative de Claude (directeur créatif) préservée intégralement
