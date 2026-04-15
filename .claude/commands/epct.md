---
description: 'Approche structurée de développement en 4 phases: Explore, Plan, Code, Test'
argument-hint: '[feature/task] - Description de la feature ou tâche à développer'
allowed-tools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep']
---

Please follow this structured development approach for: $ARGUMENTS

## Phase 1: Explore
- Research the current codebase and relevant patterns
- Identify existing similar implementations
- Understand dependencies and constraints
- Document key findings and considerations

## Phase 2: Plan
- Design the solution
- Outline the implementation steps
- Define manual verification steps (no automated test infra yet)

## Phase 3: Code
- Write the code following the plan
- Adhere to project's coding standards (React JSX single-file artifact, SVG rendering, CSS animations)
- Ensure French UI text with proper accents
- Persist state via `window.storage` only (key `palimpsest-world`)

## Phase 4: Test
- Test manually in the artifact preview (no automated test suite at this stage)
- Verify the implementation works as expected
- Check visuals, transitions and API interpretation loop behaviour
