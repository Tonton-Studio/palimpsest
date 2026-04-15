---
description: "Génère un follow-up expert détaillé après application des suggestions d'IA externe"
argument-hint: "[réponse_IA] - Copier/coller de la réponse de l'IA externe consultée"
allowed-tools: ["Read", "Write", "Bash", "Glob", "Grep"]
---

# TTS AI Help Follow-Up - Suivi Expert IA Externe

Génère un prompt de follow-up ultra détaillé après application des suggestions d'une IA externe, documentant les progrès, nouveaux problèmes et demandes de clarification.

**Arguments**: `$ARGUMENTS` - Copier/coller complet de la réponse de l'IA externe consultée

## Workflow de génération follow-up expert

### 1. Analyse de la réponse IA externe
- Parser et analyser la réponse fournie en argument
- Identifier les suggestions concrètes proposées
- Extraire le code/modifications suggérées
- Noter les recommandations architecturales

### 2. Documentation de l'implémentation
- Lister en détail TOUT ce qui a été mis en place suite aux suggestions
- Documenter les modifications de code réalisées avec before/after
- Noter les adaptations nécessaires par rapport aux suggestions originales
- Identifier les contraintes spécifiques du projet qui ont influencé l'implémentation

### 3. Evaluation des progrès (UNIQUEMENT si confirmés par l'utilisateur)
- Documenter les améliorations constatées et validées
- **IMPORTANT** : Ne documenter que les progrès REELS confirmés par l'utilisateur

### 4. Identification des nouveaux problèmes (UNIQUEMENT si présents)
- Lister les effets de bord apparus suite aux modifications
- **IMPORTANT** : Ne documenter que les nouveaux problèmes REELS causés par l'implémentation

### 5. Génération du follow-up expert
Créer un fichier `FOLLOWUP_AI_EXPERT_[ITERATION]_[TIMESTAMP].md` contenant :

```markdown
# FOLLOW-UP IA EXTERNE - PALIMPSEST [ITERATION #X]

## REPONSE IA EXTERNE RECUE
### Suggestion Originale
[Reproduction exacte de la suggestion]

## IMPLEMENTATION REALISEE
### Modifications Appliquées
[Détail exhaustif de tout ce qui a été implémenté]

#### Before/After Code
[code avant et après]

### Adaptations Nécessaires
[Modifications par rapport aux suggestions originales avec raisons]

## PROGRES CONSTATES (si confirmés utilisateur)
[Améliorations validées]

## NOUVEAUX PROBLEMES RENCONTRES (si présents)
[Effets de bord identifiés]

## QUESTIONS DE CLARIFICATION POUR L'IA
[Points nécessitant précision]

## PROCHAINE ETAPE RECOMMANDEE
[Suggestion pour la suite]
```

### 6. Système de tracking itératif
- Maintenir un compteur d'itération pour la session courante
- Créer/mettre à jour `AI_CONSULTATION_TRACKING.md` temporaire

## Notes importantes
- Commande utilisable de manière itérative autant que nécessaire
- Tous les fichiers générés sont TEMPORAIRES (nettoyés par `/tts_sanctuarize`)
- Ne documenter que les faits avérés (progrès confirmés, problèmes réels)
