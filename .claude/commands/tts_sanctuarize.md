---
description: 'Sanctuariser une étape après feature développée ou bug résolu avec succès'
argument-hint: '[description] - Description de ce qui a été accompli'
allowed-tools: ['Bash', 'Read', 'Write', 'Edit', 'MultiEdit']
---

# TTS Sanctuarize - Sanctuarisation complète d'étape

Commande de sanctuarisation complète après une feature développée avec succès ou un bug résolu avec succès.

**Arguments**: `$ARGUMENTS` - Description de ce qui a été accompli dans cette session

## Workflow de sanctuarisation (10 étapes obligatoires)

### RAPPEL CRITIQUE - MISES A JOUR DOCUMENTAIRES OBLIGATOIRES

**A CHAQUE sanctuarisation, vérifier et mettre à jour OBLIGATOIREMENT :**

- **PALIMPSEST_GDD.md** : SSOT game design. NE PAS MODIFIER la vision créative. Vérifier que le code livré est ALIGNE avec le GDD. Signaler tout écart.
- **TODO_GLOBAL.md** : Cocher tâches terminées, ajouter nouvelles, MAJ progression
- **CLAUDE.md** : Section "Sessions" TOUJOURS + règles critiques si nouvelles
- **REPRISE_SESSION_PROCHAINE.md** : Prochaines priorités
- **docs/ pertinents** : Si `docs/INTERPRETATION_PROMPT.md` ou `docs/CHAMBER_DEFINITIONS.md` est impacté, le mettre à jour

**ALERTE DESIGN DRIFT** : Si pendant le sprint, une implémentation s'écarte du GDD sans validation de Nordine, ne PAS sanctuariser. Signaler l'écart et attendre validation. Rappel : Claude est le directeur créatif du GDD, Nordine exécute sans modifier.

---

### 1. Vérification préalable

- Test manuel dans l'artifact preview (rendu + interactions + appel API + persistance)
- Vérifier git status (pas de fichiers inattendus)
- S'assurer que les changements fonctionnent correctement

### 2. Backup complet du projet

Utiliser le script de backup TontonStudio dans `_DEV_/` :

```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FEATURE_SLUG=$(echo "$ARGUMENTS" | tr ' ' '_' | tr '[:upper:]' '[:lower:]' | head -c 40)
BACKUP_DIR="_DEV_/backups/${TIMESTAMP}_${FEATURE_SLUG}"

mkdir -p "$BACKUP_DIR"

# Copie complète du projet (sans .git et backups)
rsync -a \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='_DEV_/backups' \
  . \
  "$BACKUP_DIR/"

echo "Backup créé: $BACKUP_DIR"
```

Alternative : utiliser directement `_DEV_/auto-backup.sh` si présent.

**VERIFICATION OBLIGATOIRE** après backup :
```bash
find "$BACKUP_DIR" -type f | wc -l  # Doit avoir des fichiers
ls -la "$BACKUP_DIR"/{CLAUDE.md,PALIMPSEST_GDD.md,TODO_GLOBAL.md} 2>/dev/null
ls -la "$BACKUP_DIR/src/Palimpsest.jsx" 2>/dev/null
```
- Si backup incomplet : supprimer et refaire immédiatement

### 3. Git commit et push

- Commit des modifications avec message structuré
- **IMPORTANT** : Utiliser `GITHUB_TOKEN= git push origin [branche]` (bypass stale env var)
- Vérifier que le push s'est bien déroulé

### 4. Validation artifact / export

- Vérifier que `src/Palimpsest.jsx` copié dans un artifact Claude.ai se rend correctement
- Si export HTML itch.io prévu, valider le rendu HTML statique
- Pas de deploy serveur pour ce projet (artifact primaire, itch.io secondaire)

### 5. Mise à jour TODO_GLOBAL.md OBLIGATOIRE

**Actions MANUELLES obligatoires** :

1. **Lire TODO_GLOBAL.md** et identifier TOUTES les tâches liées à la feature sanctuarisée
2. **Cocher les checkboxes** `[ ]` -> `[x]` pour les tâches complétées
3. **Ajouter nouvelles tâches** découvertes pendant la session (bugs, améliorations, etc.)
4. **Mettre à jour la progression** par phase (Phase 1 Squelette -> Phase 6 Polish)

**Questions à se poser** :
- Cette feature était-elle dans la TODO ? -> La cocher
- A-t-on découvert de nouveaux bugs/besoins ? -> Les ajouter

### 6. Mise à jour CLAUDE.md

- **OBLIGATOIRE** : Mettre à jour section "Sessions" avec succès de la feature
- Consolider sections si nécessaire (max raisonnable)
- Ajouter infos architecture si nouvelle structure/pattern technique

### 7. Mise à jour REPRISE_SESSION_PROCHAINE.md

- Remplacer le contenu avec les nouvelles priorités
- Documenter les prochaines étapes
- Mentionner tout bug connu ou point d'attention

### 8. Synchronisation Mémoire Projet

```bash
# Si breakthrough technique ou pattern important, créer fichier mémoire
FEATURE_NAME="$ARGUMENTS"

# Vérifier si un memory mérite d'être créé/mis à jour
# dans /Users/nordine/.claude/projects/[chemin-projet-palimpsest]/memory/
```

### 9. Nettoyage fichiers temporaires

```bash
echo "=== NETTOYAGE FICHIERS TEMPORAIRES ==="

# Fichiers générés par /tts_aihelp
rm -f PROMPT_AI_EXPERT_*.md SOURCES_AI_EXPERT_*.zip 2>/dev/null

# Fichiers générés par /tts_hardcoredebug
rm -f DEBUG_SESSION_*.md SOLUTION_*.md 2>/dev/null
rm -rf DEBUG_TESTS_*/ 2>/dev/null

# Fichiers générés par /tts_aihelp_followup
rm -f FOLLOWUP_*.md FOLLOWUP_SOURCES_*.zip AI_CONSULTATION_TRACKING.md 2>/dev/null

# Vérification finale racine propre
TEMP_FILES=$(find . -maxdepth 1 \( -name "PROMPT_*" -o -name "DEBUG_*" -o -name "FOLLOWUP_*" -o -name "AI_*" \) 2>/dev/null)
if [[ -n "$TEMP_FILES" ]]; then
  echo "Fichiers temporaires résiduels détectés:"
  echo "$TEMP_FILES"
else
  echo "Racine projet propre"
fi
```

### 10. Cohérence Inter-Commandes

```bash
echo "=== VALIDATION COHERENCE ==="

# Vérifier que /tts_takeover pourra bien lire l'état post-sanctuarisation
FEATURE_NAME="$ARGUMENTS"
grep -qi "$FEATURE_NAME\|sanctuarisé\|terminé" REPRISE_SESSION_PROCHAINE.md && \
  echo "/tts_takeover: Etat sanctuarisé visible" || \
  echo "/tts_takeover: Etat sanctuarisation pas clair"
```

### 11. Checklist de Validation FINALE

```markdown
## CHECKLIST SANCTUARISATION COMPLETE - $FEATURE_NAME

### A. Code & Rendu
- [ ] Artifact preview fonctionnel (rendu + interactions)
- [ ] Appel API interprétation testé
- [ ] Persistance window.storage testée
- [ ] Pas de régression visible

### B. Git & Backup
- [ ] Git commit avec message structuré
- [ ] Git push réussi (GITHUB_TOKEN= git push)
- [ ] Backup milestone créé dans `_DEV_/backups/` et vérifié

### C. Documentation
- [ ] PALIMPSEST_GDD.md : vérifié, pas d'écart non signalé
- [ ] TODO_GLOBAL.md : Tâches cochées + nouvelles ajoutées
- [ ] CLAUDE.md : Section "Sessions" mise à jour
- [ ] REPRISE_SESSION_PROCHAINE.md : Prochaines priorités

### D. Nettoyage
- [ ] Fichiers temporaires nettoyés
- [ ] Racine projet propre

### STATUT FINAL : EN COURS | COMPLET ET VALIDE
```

## Prompt de démarrage pour prochaine session

A la fin, présenter directement dans le chat un prompt complet pour la prochaine session :

"Bonjour Claude ! Avant de démarrer, veuillez impérativement lire et vous approprier l'intégralité du projet :

**LECTURE OBLIGATOIRE** :
- CLAUDE.md - Instructions et règles critiques
- PALIMPSEST_GDD.md - Vision créative (SSOT, NE PAS MODIFIER)
- TODO_GLOBAL.md - Roadmap et tâches prioritaires
- REPRISE_SESSION_PROCHAINE.md - Contexte session actuelle

**ETAT POST-SANCTUARISATION** : Feature $FEATURE_NAME 100% terminée et documentée

**PROCHAINES TACHES** : [liste basée sur TODO_GLOBAL.md mis à jour et priorités restantes]"

## Garanties de ce workflow

- Zéro oubli documentaire possible grâce à validation croisée systématique
- TODO_GLOBAL.md TOUJOURS à jour
- Traçabilité complète via commits, backups et mémoire
- Sanctuarisation industrielle reproductible et fiable
