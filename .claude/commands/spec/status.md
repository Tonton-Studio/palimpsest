---
description: 'Vue d ensemble du statut d implémentation de toutes les features'
argument-hint: 'Aucun argument requis'
allowed-tools: ['Read', 'Glob', 'Grep']
---

# Spec Status - Feature Implementation Status

Show the implementation status of all features in the project.

## Process

### Step 1: Find All Features
- Glob for `features/*/` directories
- List all discovered features

### Step 2: Analyze Each Feature
For each feature directory:
- Check if `requirements.md` exists
- Check if `design.md` exists
- Check if `tasks.md` exists
- Count total tasks vs completed tasks (marked with `[IMPLEMENTED]` or `[x]`)

### Step 3: Display Status

```markdown
# Feature Implementation Status

| Feature | Requirements | Design | Tasks | Progress |
|---------|-------------|--------|-------|----------|
| [name]  | Done/Missing | Done/Missing | X/Y done | XX% |
```

Present the table with overall project progress.
