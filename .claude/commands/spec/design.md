---
description: 'Génération du design technique à partir des requirements'
argument-hint: '[feature_name] - Nom de la feature à designer'
allowed-tools: ['Read', 'Write', 'Bash', 'Glob', 'Grep']
---

# Spec Design - Technical Design Generation

Generate a technical design document from EARS requirements for the specified feature.

**Feature**: $ARGUMENTS

## Process

### Step 1: Load Requirements
- Read `features/[feature]/requirements.md`
- Understand all requirements and constraints
- Identify technical challenges

### Step 2: Design Document Structure

Generate a design covering:

1. **Technical Overview** - High-level approach
2. **System Architecture** - Components and their relationships
3. **Data Design** - State management (useReducer), data structures, persistence via window.storage
4. **Component Design** - React functional components (within single-file `src/Palimpsest.jsx`)
5. **API Design** - Interfaces between modules + Anthropic API interpretation contract (JSON in/out)
6. **Visual Design** - SVG rendering, CSS animations, transitions
7. **Performance** - Artifact rendering, animation smoothness, API rate limiting (3/min)
8. **Implementation Approach** - Step-by-step plan

### Step 3: Tech Stack Alignment
Ensure design aligns with PALIMPSEST stack:
- **Frontend**: React (JSX), single-file artifact
- **State**: useReducer (centralized game state)
- **Rendering**: SVG + CSS animations
- **Persistence**: `window.storage` only (key `palimpsest-world`)
- **API**: Anthropic `claude-sonnet-4-20250514`, max_tokens 1000, JSON response
- **Typography**: Cormorant Garamond + Lora (Google Fonts CDN)
- **No build system**: no npm, no Vite, no TypeScript, no bundler

### Step 4: Design Quality Gates
- [ ] All requirements addressed
- [ ] Components clearly defined
- [ ] Data flow documented
- [ ] Edge cases handled (API errors, rate limit, paradoxes)
- [ ] Animation timing respected (2-3s ease-in-out, no sudden motion)
- [ ] Aligned with `PALIMPSEST_GDD.md`

### Step 5: Approval Gate
Present design for user review. **WAIT FOR APPROVAL** before proceeding to task breakdown.

Save to `features/[feature]/design.md`
