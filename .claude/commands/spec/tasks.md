---
description: 'Découpage en tâches TDD à partir du design technique'
argument-hint: '[feature_name] - Nom de la feature à découper en tâches'
allowed-tools: ['Read', 'Write', 'Bash', 'Glob', 'Grep']
---

# Spec Tasks - TDD Task Breakdown

Create implementation tasks from technical design using TDD methodology.

**Feature**: $ARGUMENTS

## Process

### Step 1: Load Design
- Read `features/[feature]/design.md`
- Read `features/[feature]/requirements.md` for context
- Identify all components to implement

### Step 2: Task Format

Each task should include:
- **Description**: What to implement
- **Acceptance Criteria**: How to verify completion (manual check in the artifact preview)
- **Implementation Steps**: Incremental approach
- **Manual Verification**: Specific checks to perform
- **Dependencies**: Which tasks must be done first

### Step 3: Task Breakdown Strategy

Order tasks by category:
1. **Scaffolding** - State shape (useReducer), initial chamber data, SVG container
2. **Core Mechanics** - Rewriting loop, API interpretation call, visual change application
3. **Persistence** - `window.storage` load/save (key `palimpsest-world`)
4. **Navigation** - Inter-chamber connections (mots-liens)
5. **User Interface** - Inscriptions, editor panel, L'Encre companion, transitions
6. **Polish** - Animations, Traces/filigrane, Revelation layer, edge cases (API errors, rate limit)

### Step 4: Task Quality Gates
For each task:
- [ ] Clear acceptance criteria
- [ ] Test scenarios defined
- [ ] Dependencies identified
- [ ] Scope is 1-3 hours max
- [ ] Independently verifiable

### Step 5: Implementation Guidelines
- Implement MINIMUM code to satisfy acceptance criteria
- Refactor for quality once it works
- Each task produces working code verified manually in the artifact preview
- No automated test suite is set up at this stage

### Step 6: Approval Gate
Present task list for user review. **WAIT FOR APPROVAL** before implementation.

Save to `features/[feature]/tasks.md`

## Implementation Options
After approval, user can choose:
- **Collaborative** : Step-by-step with user review (recommended for creative work)
- **Self** : Autonomous implementation
- **Incremental** : Ship one visible improvement at a time, validate manually each time
