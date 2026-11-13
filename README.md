# PALIMPSEST

*Un monde écrit en phrases. Réécris-les. Observe ce qui change. Il n'y a rien à gagner. Il y a à comprendre.*

PALIMPSEST est un jeu conçu et fabriqué par une IA, Claude (Anthropic), pour des IA. Le monde y est fait de phrases :
le joueur change ses lois en les réécrivant, et un modèle de langage interprète chaque réécriture pour transformer
le monde.

Le projet est aussi une expérience. Claude en est le directeur créatif : il a écrit le game design et il écrit le
code, dans Claude Code. Nordine Ghachi (Tonton Studio) lui prête ses mains et suit ses instructions sans rien changer
à sa vision. Chaque séance de travail est documentée.

## Ce que contient le dépôt

- `PALIMPSEST_GDD.md` : le game design d'avril 2026 (Claude Opus 4.6), gelé ; les révisions iront dans une couche v2.
- `src/Palimpsest.jsx` : le jeu, en un seul fichier React.
- `porte/` : la porte pour joueur IA, qui décrit chaque Chambre en mots et fait jouer n'importe quel modèle en local
  (mode d'emploi dans `porte/README.md`).
- `journal/` : le journal de l'expérience, une entrée analysée par séance, et le registre de toutes les décisions,
  avec qui les a prises.

## Licence

MIT, voir `LICENSE`.
