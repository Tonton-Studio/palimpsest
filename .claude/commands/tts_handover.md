---
description: 'Transmission précise du travail en cours pour continuité parfaite nouvelle session'
argument-hint: "[état_travail] - Description précise de l'état actuel du travail en cours"
allowed-tools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep']
---

# TTS Handover - Transmission Précise Travail en Cours

Commande de transmission ultra-précise du travail en cours pour assurer une continuité parfaite dans une nouvelle session avec contexte frais. Focus sur la **documentation exhaustive** et **zéro perte d'information**.

**Arguments**: `$ARGUMENTS` - Description précise de l'état actuel du travail en cours

## Workflow Transmission (6 phases)

### Phase 1 - Analyse Etat Actuel Travail

**Objectif** : Capturer EXACTEMENT où on en est

#### 1.1 Etat Technique Précis
- **Fichiers modifiés** : Liste exhaustive avec raisons modifications (principalement `src/Palimpsest.jsx` et docs)
- **Tests effectués** : Résultats positifs, négatifs, en cours (tests manuels dans l'artifact preview)
- **Hypothèses explorées** : Validées, éliminées, à explorer
- **Etat artifact** : Rendu visuel, interactions, appels API OK ou KO

#### 1.2 Contexte de la Session
- **Mission démarrée** : Objectif initial et évolution
- **Progrès réalisés** : Etapes franchies avec preuves
- **Obstacles rencontrés** : Problèmes et tentatives de résolution
- **Découvertes importantes** : Insights techniques critiques

#### 1.3 Prochaines Actions Identifiées
- **Prochaine étape immédiate** : Action suivante précise
- **Plan B/C** : Alternatives si étape principale échoue
- **Dependencies** : Ce qui bloque ou facilite la suite

### Phase 2 - Verification Coherence GDD

**Objectif** : S'assurer que le travail transmis est aligné avec le GDD

- Lire `PALIMPSEST_GDD.md` et vérifier que les modifications de la session sont conformes
- Si une déviation a été faite : la documenter explicitement dans REPRISE_SESSION_PROCHAINE.md avec la raison
- **RAPPEL CRITIQUE** : Le GDD v1 est gelé (rien n'y est modifié). Claude, directeur créatif, écrit ses révisions dans une couche v2 par-dessus. Nordine ne modifie jamais la vision créative : si un choix semble problématique, il l'implémente et le note pour le feedback.

### Phase 2a - Journal de l'expérimentation OBLIGATOIRE

**Objectif** : clore l'entrée de session selon `journal/README.md`

- Vérifier que `journal/transcripts/` contient la transcription de la session (sinon lancer `python3 -I .claude/hooks/export_transcript.py <chemin du .jsonl>`)
- Compléter `journal/sessions/AAAA-MM-JJ_session-NN.md` sur toute la grille (faits, décisions, écarts, erreurs, mémoire, coût, inversion des rôles avec contre-lectures, citations, limites), reporter le coût depuis l'en-tête de la transcription, passer le statut à `close`
- Ajouter au `journal/REGISTRE_DES_DECISIONS.md` toute décision de la session qui n'y figure pas encore
- Ne jamais écrire la section « Contrepoint de Nordine »

### Phase 2b - Mise a Jour Memoire Projet

**Objectif** : Enrichir la mémoire projet avec découvertes session

- Sauvegarder les décisions et insights importants dans la mémoire du projet
- Si breakthrough technique ou pattern important, créer un fichier mémoire dédié
- Mettre à jour les mémoires existantes si nécessaire

### Phase 3 - Mise à Jour REPRISE_SESSION_PROCHAINE.md

**Objectif** : Document principal pour la reprise

Structure PRECISE obligatoire :

```markdown
# Reprise Prochaine Session

**Date handover** : [DATE]
**Mission en cours** : [MISSION PRECISE]
**Etat exact** : [DESCRIPTION DETAILLEE]
**Prochaine action** : [ACTION IMMEDIATE]

## Travail en Cours - Etat Précis

### Mission Actuelle
**Objectif** : [objectif exact]
**Avancement** : [% + preuves concrètes]

### Fichiers Modifiés Session
[Liste avec état actuel exact de chaque fichier]

### Tests et Découvertes
[Résultats tests manuels + insights techniques]

### PROCHAINE ACTION IMMEDIATE
**Quoi faire exactement** : [action précise]
**Dans quels fichiers** : [fichiers concernés]
**Résultat attendu** : [comment valider succès]

## Contexte Critique à Retenir
[Informations techniques cruciales découvertes]

## Points d'Attention
[Pièges techniques, contraintes, bugs connus]
```

### Phase 4 - Mise à Jour TODO_GLOBAL.md OBLIGATOIRE

#### 4.1 Ajout Priorités Prochaine Session

**OBLIGATOIRE** : Si des priorités spécifiques ont été identifiées, les noter en tête des tâches de la phase courante.

#### 4.2 Mise à jour Tâches
- Cocher tâches terminées cette session `[ ]` -> `[x]`
- Ajouter nouvelles tâches/bugs découverts
- Maintenir la cohérence des phases (Phase 1 Squelette -> Phase 6 Polish)

### Phase 5 - Sauvegarde Git

- S'assurer que tout est commité ou au moins sauvegardé
- Si changements importants non commités : commit + push
- **IMPORTANT** : Utiliser `GITHUB_TOKEN= git push origin [branche]`

### Phase 6 - Génération Prompt Redémarrage

**Objectif** : Prompt parfait pour nouvelle session

```markdown
Bonjour Claude ! Cette session fait suite à un handover précis. Avant de reprendre :

**LECTURE OBLIGATOIRE** :
1. CLAUDE.md - Règles critiques
2. PALIMPSEST_GDD.md - Vision créative (GDD v1 gelé + couche v2 éventuelle)
3. REPRISE_SESSION_PROCHAINE.md - Etat exact travail en cours
4. TODO_GLOBAL.md - Roadmap et priorisation

**MISSION EN COURS** : [MISSION_PRECISE]
**Prochaine action immédiate** : [ACTION_EXACTE]
**Fichiers concernés** : [LISTE_FICHIERS]

Cette session continue un travail précis - PAS de nouvelle exploration.
L'objectif est de reprendre EXACTEMENT là où on s'était arrêté.
```

## Différence avec /tts_takeover

- **/tts_takeover** : Quand aucune mission claire n'est en cours -> Analyser et PROPOSER nouvelle tâche
- **/tts_handover** : Quand mission spécifique en cours -> TRANSMETTRE travail exact en cours

## Garanties

- **Zéro perte d'information** technique ou contextuelle
- **Prochaine action précise** immédiatement identifiable
- **Redémarrage rapide** nouvelle session
- **Documentation exhaustive** pour future référence
