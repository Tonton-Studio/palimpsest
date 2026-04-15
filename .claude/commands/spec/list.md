---
description: 'Liste toutes les features disponibles'
argument-hint: 'Aucun argument requis'
allowed-tools: ['Glob', 'Read']
---

# Spec List - List All Features

List all available features in the project.

## Process

1. Use Glob to find all directories under `features/`
2. List them with their number and name
3. Show which spec files exist for each

## Example Output

```
# Available Features

1. 01-chamber-seuil - [requirements.md, design.md, tasks.md]
2. 02-rewrite-loop - [requirements.md]
3. 03-ink-companion - [plan only]
```
