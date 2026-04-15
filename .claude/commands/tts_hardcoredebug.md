---
description: "Debugging hardcore méthodique avec Sequential Thinking et tests visuels"
argument-hint: "[bug_description] - Description détaillée du bug à résoudre"
allowed-tools: ["mcp__clear-thought-mcp-server__sequentialthinking", "Read", "Write", "Edit", "MultiEdit", "Bash", "Glob", "Grep"]
---

# TTS Hardcore Debug - Debugging Méthodique avec Sequential Thinking

Workflow de debugging hardcore systématique utilisant Sequential Thinking pour résolution méthodique de bugs complexes avec tests visuels et analyse structurée.

**Arguments**: `$ARGUMENTS` - Description détaillée du bug à résoudre

## Workflow Sequential Thinking Debug (5 phases)

### Phase 1 - Initialisation Sequential Thinking

**Outil principal** : `mcp__clear-thought-mcp-server__sequentialthinking`

#### Premier thought obligatoire :
- **Description complète du bug** avec symptômes observés
- **Hypothèses initiales** basées sur l'expérience
- **Contexte technique** (sections de `src/Palimpsest.jsx` concernées, conditions de reproduction)
- **Impact expérience joueur** et criticité

**RAPPEL GDD** : Les bugs visuels intéressants sont des features. Ne corriger que si ça casse le jeu. Les paradoxes API peuvent produire des états visuels "étranges" - c'est voulu.

#### Configuration initiale :
- `total_thoughts` : 8-12 (ajustable selon complexité)
- `current_step` : Définir avec outils recommandés
- `recommended_tools` : Prioriser tests visuels et diagnostic

### Phase 2 - Création Tests de Diagnostic

**Principe** : TOUJOURS créer des tests qui donnent des réponses claires

#### Tests console obligatoires :
```javascript
// Test de configuration actuelle
console.log('DEBUG: Configuration actuelle:', objet);

// Test de valeurs
console.log('DEBUG: Valeurs:', {
  variable1: value1,
  variable2: value2,
});

// Test de flow
console.log('DEBUG: Flow checkpoint [N]:', { state, props, context });
```

#### Tests spécifiques PALIMPSEST :
```javascript
// Etat du monde persisté
console.log('DEBUG: world state:', state);
console.log('DEBUG: current chamber:', state.currentChamber);
console.log('DEBUG: inscriptions:', state.chambers[state.currentChamber].inscriptions);

// Appel API interpretation
console.log('DEBUG: API request payload:', payload);
console.log('DEBUG: API response JSON:', response);

// Persistance window.storage
console.log('DEBUG: window.storage palimpsest-world:', await window.storage.get('palimpsest-world'));
```

#### Tests de comparaison :
- **Avant/Après** : Captures état
- **Etats visuels** : Snapshots du rendu SVG
- **Valeurs attendues vs obtenues** : Assertions manuelles

### Phase 3 - Analyse Méthodique (Pattern Scientifique)

#### Pour chaque hypothèse :
1. **Hypothèse** : "Je pense que X cause le problème parce que Y"
2. **Test** : Créer test spécifique pour valider/invalider
3. **Résultat** : Observer réponse claire
4. **Conclusion** :
   - **Test REUSSIT** -> Creuser dans cette direction
   - **Test ECHOUE** -> Eliminer cette hypothèse
   - **Test AMBIGU** -> Créer test plus précis

#### Documentation obligatoire :
```markdown
## Test #X - [Nom hypothèse]
**Hypothèse** : [Description précise]
**Test appliqué** : [Code/action effectuée]
**Résultat** : [Description ce qui est observé]
**Conclusion** : [Validé/Eliminé/A approfondir]
**Next step** : [Prochaine action]
```

### Phase 4 - Progression Structurée

#### Utilisation Sequential Thinking :
- `next_thought_needed: true` -> Continuer investigation
- `is_revision: true` -> Corriger hypothèse précédente
- `revises_thought: N` -> Spécifier quel thought corriger
- `total_thoughts++` -> Ajuster si investigation plus longue
- `needs_more_thoughts: true` -> Si nouvelle piste découverte

### Phase 5 - Solution et Documentation

#### Critères de résolution :
- **Cause identifiée** avec preuve
- **Solution testée manuellement** dans l'artifact preview
- **Régression évitée** avec tests préventifs
- **Documentation** pour future référence

#### Outputs générés :
- `DEBUG_SESSION_[TIMESTAMP].md` - Log complet investigation
- `SOLUTION_[BUG_NAME]_[TIMESTAMP].md` - Solution finale

## Pièges à éviter

1. **Supposer sans voir** -> Toujours console.log / tester
2. **Hypothèses non-testées** -> Créer test spécifique pour chaque
3. **Résultats négatifs ignorés** -> Documenter aussi ce qui NE marche PAS
4. **Mono-piste** -> Utiliser `is_revision` pour pivoter
5. **Abandon prématuré** -> Ajuster `total_thoughts` et continuer
6. **Corriger un bug qui est une feature** -> Relire GDD avant de "fixer"

## Notes importantes

- Tous fichiers générés sont TEMPORAIRES (nettoyés par `/tts_sanctuarize`)
- Utiliser Sequential Thinking pour guidance méthodologique
- Documenter progression en temps réel pour traçabilité complète
- Cette méthode transforme un bug "mystérieux" en investigation scientifique structurée
