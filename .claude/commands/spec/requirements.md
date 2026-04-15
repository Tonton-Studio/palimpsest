---
description: 'Détail des requirements EARS pour une feature spécifique'
argument-hint: '[feature_name] - Nom de la feature à détailler'
allowed-tools: ['Read', 'Write', 'Bash', 'Glob', 'Grep']
---

# Spec Requirements - EARS Requirements Detailing

Detail EARS (Easy Approach to Requirements Syntax) requirements for a specific feature through interactive dialogue.

**Feature**: $ARGUMENTS

## Interactive Process

### Step 1: Feature Selection
- Find the feature directory in `features/`
- If multiple matches, ask user to clarify
- If no match, suggest creating via `/spec:plan`

### Step 2: Elicit Functional Requirements
- Ask about core behaviors and interactions
- Identify input/output expectations
- Understand edge cases and error handling

### Step 3: Elicit Non-Functional Requirements
- Performance expectations
- Accessibility needs
- Platform constraints (web-only: Claude.ai artifact primary, itch.io HTML export secondary)

### Step 4: Draft EARS Requirements
Using the EARS format templates:

- **Ubiquitous**: "The [system] shall [action]"
- **Event-Driven**: "When [event], the [system] shall [action]"
- **State-Driven**: "While [state], the [system] shall [action]"
- **Conditional**: "If [condition], then the [system] shall [action]"
- **Optional**: "Where [feature is enabled], the [system] shall [action]"

### Step 5: Iterate and Refine
- Review requirements with user
- Ensure completeness and consistency
- Number all requirements (REQ-XXX)

### Step 6: Final Approval
- Present complete requirements document
- **WAIT FOR EXPLICIT USER APPROVAL**
- Save to `features/[feature]/requirements.md`
