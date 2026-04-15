---
description: 'Rapport des tâches TODO restantes avec liste numérotée simple'
argument-hint: 'Aucun argument - Génère le rapport complet'
allowed-tools: ['Read', 'Glob']
---

# TTS Todo - Rapport Tâches Restantes (SSOT)

Commande pour générer un rapport clair et concis des tâches TODO restantes depuis la source unique de vérité.

**Arguments** : Aucun - Génère automatiquement le rapport

## Workflow (3 phases)

### Phase 1 - Lecture TODO_GLOBAL.md (SSOT Unique)

Lire le fichier `TODO_GLOBAL.md` à la racine du projet :

- C'est la **SOURCE UNIQUE DE VERITE** pour les tâches
- Extraire toutes les tâches non cochées `[ ]`
- Identifier les phases et leur avancement

### Phase 2 - Génération Rapport Structuré

```markdown
# TODO REPORT - [DATE]

## Résumé
- **Total tâches restantes** : [N]
- **Phase courante** : [nom phase]
- Par phase : [décompte]

## Liste Numérotée des Tâches

### Phase 1 - [Nom]
1. [Tâche] - [Description]
...

### Phase 2 - [Nom]
N. [Tâche] - [Description]
...

[etc. pour chaque phase]
```

### Phase 3 - Affichage et Interaction

- Afficher le rapport complet
- Indiquer que l'utilisateur peut valider les tâches avec `/tts_todoupdate [numéros]`
- Rappeler que TODO_GLOBAL.md est la source unique (SSOT)

## Règles SSOT

1. **TODO_GLOBAL.md est la SOURCE UNIQUE** - Pas d'autre fichier TODO
2. **Numérotation continue** - Pour utilisation avec `/tts_todoupdate`
3. **Mise à jour après sanctuarisation** - `/tts_sanctuarize` met à jour ce fichier
4. **Priorités handover** - `/tts_handover` ajoute les priorités prochaine session
