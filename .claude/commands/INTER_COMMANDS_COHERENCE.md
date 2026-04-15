# INTER_COMMANDS_COHERENCE - Cohérence Inter-Commandes /tts_*

**Objectif** : Assurer la parfaite cohérence entre toutes les commandes /tts_* du projet PALIMPSEST.

## MATRICE COMPLETE LECTURE/ECRITURE

| Commande | Lit obligatoirement | Modifie | Génère temporaire | Nettoie |
|----------|-------------------|---------|------------------|----------|
| **sanctuarize** | TOUS | TOUS docs | Backups | TOUS temporaires |
| **takeover** | TOUS | AUCUN | Rapport chat uniquement | - |
| **handover** | TOUS | REPRISE_SESSION_PROCHAINE | - | - |
| **aihelp** | TODO, CLAUDE | AUCUN | PROMPT_AI_EXPERT_*, SOURCES_*.zip | - |
| **aihelp_followup** | Memory, AIHELP outputs | AUCUN | FOLLOWUP_*, AI_TRACKING.md | - |
| **hardcoredebug** | Fichiers bug | AUCUN | DEBUG_SESSION_*, SOLUTION_*.md | - |

## WORKFLOW INTERDEPENDANCES

### Séquence Optimale Development -> Sanctuarisation
```
/tts_hardcoredebug -> Feature/Bug Fix -> /tts_aihelp si besoin -> /tts_aihelp_followup si itérations -> Implémentation finale -> /tts_sanctuarize -> /tts_handover si transmission
Nouvelle session -> /tts_takeover -> cycle recommence
```

### Propagation Information
1. **Debug/AIHelp découvre** contrainte/pattern -> Note dans fichier temporaire
2. **Sanctuarize collecte** notes temporaires -> Intègre à la doc + mémoire
3. **Takeover lit** état sanctuarisé -> Propose tâche cohérente
4. **Handover référence** état TODO actualisé -> Transmission complète

## FICHIERS PARTAGES ET RESPONSABILITES

### Documentation Core (Lecture par TOUS)
- **PALIMPSEST_GDD.md** : SSOT game design (7 Chambres, Inscriptions, mécanique de Réécriture, L'Encre, Traces, Révélation, scope v1.0). TOUTE déviation = ALERTE.
- **CLAUDE.md** : Règles critiques, dernière session
- **TODO_GLOBAL.md** : Roadmap, tâches, progression (SSOT tâches)
- **REPRISE_SESSION_PROCHAINE.md** : Contexte session active
- **docs/INTERPRETATION_PROMPT.md** : Prompt système pour l'API d'interprétation (réf GDD §4)
- **docs/CHAMBER_DEFINITIONS.md** : Données des 7 Chambres (inscriptions, visuels, connexions)
- **docs/** : Docs détaillés par feature

### Fichiers Temporaires PAR COMMANDE

#### /tts_aihelp
```
PROMPT_AI_EXPERT_[TIMESTAMP].md      # Prompt structuré pour IA externe
SOURCES_AI_EXPERT_[TIMESTAMP].zip    # Sources pertinentes
# NETTOYE PAR: /tts_sanctuarize
```

#### /tts_hardcoredebug
```
DEBUG_SESSION_[TIMESTAMP].md         # Log investigation Sequential Thinking
SOLUTION_[FEATURE]_[TIMESTAMP].md    # Solution finale documentée
# NETTOYE PAR: /tts_sanctuarize
```

#### /tts_aihelp_followup
```
FOLLOWUP_AI_EXPERT_[TIMESTAMP].md    # Analyse réponse IA + before/after
AI_CONSULTATION_TRACKING.md          # Tracking sessions multiples
# NETTOYE PAR: /tts_sanctuarize
```

## GARANTIES DE COHERENCE

- **Aucune feature non documentée** après sanctuarisation
- **Zero fichier temporaire orphelin** à la racine
- **TODO_GLOBAL.md toujours cohérent** avec état réel
- **Chaque session tracée** via commits et mémoire
- **Workflow fluide** : Chaque commande s'appuie sur état cohérent précédent
