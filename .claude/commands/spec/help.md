---
description: 'Référence rapide des commandes spec-driven development'
argument-hint: 'Aucun argument requis'
allowed-tools: ['Read']
---

# Spec-Driven Development - Quick Reference

## Core Workflow Commands

| Command | Purpose |
|---------|---------|
| `/spec:plan` | Break down project goal into features |
| `/spec:requirements` | Detail EARS requirements for a feature |
| `/spec:design` | Generate technical design from requirements |
| `/spec:tasks` | Create TDD task breakdown from design |
| `/spec:execute` | Implement feature from specifications |
| `/spec:status` | Show implementation status |
| `/spec:list` | List all features |
| `/spec:advanced` | Enterprise-grade analysis (STRIDE, risk) |

## Workflow Overview

```
/spec:plan -> /spec:requirements -> /spec:design -> /spec:tasks -> /spec:execute
```

## Key Principles

1. **EARS Requirements Format** : Ubiquitous, Event-Driven, State-Driven, Conditional, Optional
2. **Test-Driven Development** : Red -> Green -> Refactor cycle
3. **Approval Gates** : User must approve before proceeding to next phase

## File Structure

```
features/
  [number]-[feature-name]/
    requirements.md    # EARS requirements
    design.md          # Technical design
    tasks.md           # TDD task breakdown
```

## Implementation Approaches

- **TDD** : Write tests first, then implement (recommended)
- **Standard** : Implement with tests after
- **Collaborative** : Step-by-step with user review
- **Self** : Autonomous implementation
