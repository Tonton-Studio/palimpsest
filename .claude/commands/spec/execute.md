---
description: 'Exécution de l implémentation d une feature depuis ses spécifications'
argument-hint: '[feature_name] - Nom de la feature à implémenter'
allowed-tools: ['Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'Glob', 'Grep']
---

# Spec Execute - Feature Implementation

Execute the implementation of a feature from its specifications (requirements, design, tasks).

**Feature**: $ARGUMENTS

## Process

### Step 1: Feature Selection
- Find matching feature directory in `features/`
- If no match or multiple matches, ask user to clarify

### Step 2: Context Loading
- Read `features/[feature]/requirements.md`
- Read `features/[feature]/design.md`
- Read `features/[feature]/tasks.md`
- Understand the full specification

### Step 3: Execution
For each task in order:

1. **Understand** the task's acceptance criteria
2. **Plan** the implementation approach
3. **Implement** the task:
   - Write the code in `src/Palimpsest.jsx`
   - Keep it minimal and focused
   - Refactor for quality once it works
4. **Verify** manually in the artifact preview (no automated test suite yet)
5. **Mark task complete** in tasks.md

### Step 4: Task Completion
After each task:
- Summary of what was implemented
- Files created/modified
- User confirmation to proceed to next task

### Step 5: Feature Verification
After all tasks complete:
- Verify all requirements are met
- Test manually in the artifact preview (rendering, interactions, API, persistence)
- Present completion summary
- Suggest `/tts_sanctuarize` if feature is complete

## Key Guidelines
- Follow project conventions: React JSX single-file, SVG rendering, CSS animations
- UI text in French with proper accents
- Persist state via `window.storage` only (key `palimpsest-world`)
- Respect PALIMPSEST_GDD.md creative vision (no modification)
- Contemplative palette (deep black #0A0A0F, off-white #E8E4D9, indigo, amber, pure black ink)
- Systematic progress through each task
