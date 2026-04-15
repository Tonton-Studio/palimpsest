#!/bin/bash
# PALIMPSEST - Deploy (placeholder)
#
# PALIMPSEST est un artifact React single-file JSX, distribué en primaire
# via Claude.ai (copier-coller le contenu de src/Palimpsest.jsx dans un
# nouvel artifact), et en secondaire via itch.io (export HTML).
#
# Il n'y a donc PAS de build/bundle/upload serveur au stade actuel.
#
# Ce script est un placeholder. Il sera rempli quand on mettra en place
# l'export HTML standalone pour itch.io (Phase 6 - Polish du GDD).
#
# Workflows de distribution actuels :
#   - Claude.ai artifact : ouvrir src/Palimpsest.jsx, copier son contenu,
#     coller dans un nouvel artifact React sur claude.ai
#   - itch.io : à implémenter (wrapper HTML autour du JSX + import CDN
#     React / Anthropic SDK / Google Fonts)

set -e

echo "==============================="
echo "  PALIMPSEST - Deploy"
echo "==============================="
echo ""
echo "Aucune procédure de déploiement configurée pour l'instant."
echo ""
echo "Distribution manuelle :"
echo "  1. Ouvrir src/Palimpsest.jsx"
echo "  2. Copier le contenu"
echo "  3. Coller dans un nouvel artifact React sur claude.ai"
echo ""
echo "Export itch.io : à implémenter (Phase 6 - Polish)."
echo "==============================="
exit 0
