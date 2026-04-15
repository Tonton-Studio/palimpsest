---
description: 'Analyse avancée enterprise-grade: STRIDE, risques, scalabilité'
argument-hint: '[feature_name] - Feature à analyser en profondeur'
allowed-tools: ['Read', 'Write', 'Bash', 'Glob', 'Grep']
---

# Spec Advanced - Enterprise-Grade Analysis

Perform advanced analysis for a feature including security, risk assessment, scalability, and edge cases.

**Feature**: $ARGUMENTS

## Analysis Frameworks

### 1. STRIDE Threat Modeling
- **S**poofing - Identity threats
- **T**ampering - Data integrity threats
- **R**epudiation - Logging/audit threats
- **I**nformation Disclosure - Privacy threats
- **D**enial of Service - Availability threats
- **E**levation of Privilege - Authorization threats

### 2. Risk Assessment Matrix
For each identified risk:
- **Probability**: Low/Medium/High
- **Impact**: Low/Medium/High
- **Mitigation**: Proposed countermeasure
- **Priority**: Based on probability x impact

### 3. Scalability Analysis
- Current capacity
- Bottleneck identification
- Scaling strategy (for multiplayer/leaderboards if applicable)
- Performance on mobile devices

### 4. Edge Case Analysis
- Boundary conditions
- Error recovery
- State corruption scenarios
- Offline/reconnection handling
- Save data corruption

## Output

Generate analysis report saved to `features/[feature]/advanced-analysis.md`

## Integration with Existing Specs
- Enhance requirements with security requirements
- Update design with resilience patterns
- Add edge case tasks to task breakdown
