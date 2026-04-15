#!/bin/bash

# Script de backup COMPLET - PALIMPSEST
# Clone intégral du répertoire de travail
# Adapté de la procédure TontonStudio (ReconversApp)

set -euo pipefail

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PROJECT_NAME="Palimpsest"

# Déterminer le type de backup et le répertoire de destination
BACKUP_TYPE="${1:-daily}"
BACKUP_NAME="${2:-backup_${TIMESTAMP}}"

# Créer l'arborescence année/jour-mois
YEAR=$(date +%Y)
DAY_NUM=$(date +%d)
MONTH_NAME=$(LC_TIME=fr_FR.UTF-8 date +%B 2>/dev/null || date +%B | tr '[:upper:]' '[:lower:]')
DAY_MONTH_FOLDER="${DAY_NUM}-${MONTH_NAME}"

case "$BACKUP_TYPE" in
    "daily")
        BACKUP_DIR="backups/daily/${YEAR}/${DAY_MONTH_FOLDER}/${BACKUP_NAME}_${TIMESTAMP}"
        ;;
    "milestone")
        BACKUP_DIR="backups/milestones/${YEAR}/${DAY_MONTH_FOLDER}/${BACKUP_NAME}_${TIMESTAMP}"
        ;;
    "golden")
        BACKUP_DIR="backups/golden/${YEAR}/${DAY_MONTH_FOLDER}/${BACKUP_NAME}_${TIMESTAMP}"
        ;;
    "misc")
        BACKUP_DIR="backups/misc/${BACKUP_NAME}_${TIMESTAMP}"
        ;;
    *)
        echo "Type de backup invalide. Utilisez: daily, milestone, golden, misc"
        exit 1
        ;;
esac

BACKUP_ROOT="$(pwd)"
PROJECT_ROOT="$(cd .. && pwd)"
LOG_FILE="backups/_LOGS_/backup_${TIMESTAMP}.log"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${2:-$NC}[$(date '+%H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

cleanup_on_error() {
    log "Nettoyage suite à l'erreur..." "$YELLOW"
    if [[ -d "$BACKUP_DIR" ]]; then
        rm -rf "$BACKUP_DIR"
        log "Backup partiel supprimé" "$YELLOW"
    fi
}

trap cleanup_on_error ERR

# Vérifications préalables
# PALIMPSEST est un artifact React single-file JSX : pas de package.json.
# On vérifie la présence du GDD à la racine du projet (parent de _DEV_).
if [[ ! -f "../PALIMPSEST_GDD.md" ]]; then
    echo "ERREUR: Pas dans le repertoire _DEV_ du projet PALIMPSEST (GDD introuvable)"
    exit 1
fi

# Vérifier l'espace disque (minimum 100MB)
available_space=$(df . | awk 'NR==2 {print $4}')
if [[ $available_space -lt 102400 ]]; then
    echo "ERREUR: Espace disque insuffisant (<100MB)"
    exit 1
fi

# Créer les dossiers
mkdir -p backups/daily backups/milestones backups/golden backups/misc backups/_LOGS_

log "Création du backup ${BACKUP_TYPE}..." "$BLUE"
log "Source: ${PROJECT_ROOT}" "$BLUE"
log "Destination: ${BACKUP_ROOT}/${BACKUP_DIR}" "$BLUE"

project_size=$(du -sh "$PROJECT_ROOT" --exclude=_DEV_/backups --exclude=.git --exclude=.DS_Store 2>/dev/null | cut -f1 || echo "N/A")
log "Taille du projet: $project_size" "$BLUE"

# Clonage avec rsync : source = racine projet, destination = _DEV_/backups/...
# On exclut _DEV_/backups pour éviter la récursion.
rsync -a \
    --exclude='.git' \
    --exclude='_DEV_/backups' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='*.tmp' \
    "$PROJECT_ROOT/" "$BACKUP_DIR/" 2>>"$LOG_FILE"

log "Clonage réussi" "$GREEN"

# Manifeste
cat > "${BACKUP_DIR}/BACKUP_MANIFEST.md" << EOF
# Backup COMPLET ${PROJECT_NAME}
**Date**: $(date)
**Type**: ${BACKUP_TYPE}
**Nom**: ${BACKUP_NAME}
**Commit**: $(git rev-parse HEAD 2>/dev/null || echo "N/A")
**Branch**: $(git branch --show-current 2>/dev/null || echo "N/A")
**Taille projet**: $project_size

## Contenu sauvegardé
Tout le projet PALIMPSEST - Clone intégral de la racine projet.

### Inclus :
- CLAUDE.md, PALIMPSEST_GDD.md (SSOT design)
- Source (src/Palimpsest.jsx — single-file React artifact)
- Documentation (docs/)
- Commandes Claude (.claude/commands/)
- Script de backup (_DEV_/auto-backup.sh)
- REPRISE_SESSION_PROCHAINE.md, TODO_GLOBAL.md

### Exclus (se régénèrent ou évitent récursion) :
- .git/ (historique git)
- _DEV_/backups/ (évite récursion)
- Fichiers temporaires et logs (.DS_Store, *.log, *.tmp)

## Restauration
\`\`\`bash
# Copier le backup vers le projet (à la racine PALIMPSEST)
rsync -av ${BACKUP_DIR}/ /chemin/vers/PALIMPSEST/ --exclude=BACKUP_MANIFEST.md
\`\`\`
EOF

# Statistiques et vérification
total_files=$(find "$BACKUP_DIR" -type f | wc -l)
backup_size=$(du -sh "$BACKUP_DIR" | tail -1 | cut -f1)
log "Fichiers: $total_files" "$GREEN"
log "Taille: $backup_size" "$GREEN"

# Vérifications critiques
VERIFICATION_OK=true

if [[ ! -f "${BACKUP_DIR}/PALIMPSEST_GDD.md" ]]; then
    log "ERREUR: PALIMPSEST_GDD.md manquant" "$RED"
    VERIFICATION_OK=false
fi

if [[ ! -f "${BACKUP_DIR}/CLAUDE.md" ]]; then
    log "ERREUR: CLAUDE.md manquant" "$RED"
    VERIFICATION_OK=false
fi

if [[ "$VERIFICATION_OK" == "true" ]]; then
    log "Vérification complétude : RÉUSSIE ($total_files fichiers)" "$GREEN"
else
    log "BACKUP INCOMPLET - Suppression" "$RED"
    rm -rf "$BACKUP_DIR"
    exit 1
fi

log "BACKUP ${BACKUP_TYPE} TERMINÉ : ${BACKUP_DIR}" "$GREEN"
