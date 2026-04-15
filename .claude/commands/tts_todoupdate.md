---
description: 'Met à jour les tâches TODO (marquer comme complétées)'
argument-hint: '[numéros] - Ex: 3,7,12 pour marquer les tâches 3, 7 et 12 comme complétées'
allowed-tools: ['Read', 'Edit', 'Glob']
---

# TTS Todo Update - Mise à Jour Tâches (SSOT)

Commande pour marquer des tâches comme complétées dans TODO_GLOBAL.md (source unique de vérité).

**Arguments** : Liste de numéros de tâches séparés par des virgules (ex: `3,7,12`)

## Workflow (4 phases)

### Phase 1 - Parsing Arguments

Extraire les numéros de tâches depuis l'argument `$ARGUMENTS` :
- Format attendu : `3,7,12` ou `3, 7, 12` ou `3 7 12`
- Valider que ce sont des nombres valides
- Si aucun argument : afficher erreur et usage

### Phase 2 - Lecture et Mapping

1. Lire `TODO_GLOBAL.md` (SSOT unique)
2. Exécuter mentalement `/tts_todo` pour avoir la correspondance numéro -> tâche
3. Identifier les lignes exactes à modifier

### Phase 3 - Modification TODO_GLOBAL.md

Pour chaque numéro de tâche fourni :
1. Trouver la ligne correspondante avec `[ ]`
2. Remplacer `[ ]` par `[x]`

### Phase 4 - Confirmation et Rapport

```markdown
# TODO UPDATE - [DATE]

## Tâches Marquées Complétées
| # | Tâche | Phase |
|---|-------|-------|
| N | [description] | [phase] |

## Nouveau Résumé
- **Avant** : [N] tâches restantes
- **Après** : [N-X] tâches restantes
- **Complétées cette session** : [X]
```

## Règles de Sécurité

- Vérifier que les numéros correspondent à des tâches existantes
- Ne JAMAIS modifier autre chose que les checkboxes `[ ]` -> `[x]`
- Préserver tout le reste du fichier intact

## Exemples d'Usage

```bash
/tts_todoupdate 5         # Marquer une seule tâche
/tts_todoupdate 3,7,12    # Marquer plusieurs tâches
```
