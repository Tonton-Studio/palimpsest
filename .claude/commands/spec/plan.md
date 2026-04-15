---
description: 'Planification interactive du projet avec découpage en features'
argument-hint: '[project_goal] - Objectif haut niveau du projet ou de la feature'
allowed-tools: ['Read', 'Write', 'Bash', 'Glob', 'Grep']
---

# Spec Plan - Project Planning and Feature Breakdown

Break down a high-level project goal into well-defined, manageable features through interactive dialogue.

**Goal to plan**: $ARGUMENTS

## Interactive Process

### Step 1: Initiate Dialogue
- Ask clarifying questions about the goal
- Understand scope, constraints, and priorities
- Identify target users and key success criteria

### Step 2: Propose Feature Breakdown
- Break the goal into 3-7 features
- Each feature should be independently valuable
- Order features by dependency and priority
- Present the breakdown for user feedback

### Step 3: Iterate and Refine
- Adjust based on user feedback
- Split or merge features as needed
- Ensure each feature has clear boundaries
- Validate dependency order

### Step 4: Final Approval & File Generation
- Present final feature list for approval
- **WAIT FOR EXPLICIT USER APPROVAL**
- Only then create feature directories

### Naming Convention
```
features/[number]-[feature-name-slug]/
```

### Key Guidelines
- Keep the conversation natural and strategic
- Don't generate files until explicit user approval
- Each feature should deliver user-visible value
- Consider the PALIMPSEST tech stack: React (JSX) single-file artifact, SVG + CSS animations, API Anthropic (claude-sonnet-4-20250514), window.storage persistence
- Respect `PALIMPSEST_GDD.md` as the SSOT creative vision (do not modify)
