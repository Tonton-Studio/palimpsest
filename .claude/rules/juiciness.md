# Juiciness — arbitrage propre à PALIMPSEST

Charte complète : `~/.claude/rules/juiciness.md`. Ce fichier ne garde que ce qui s'applique ici, et ce qui change.

## Les quatre questions, pour ce jeu

1. **`prefers-reduced-motion`** : respecté pour tout ce qui est ajouté depuis le 19 octobre 2026 (curseur de la
   marge, narration, écriture fantôme, éclat des mots-liens). Les formes SVG (SMIL) et la pulsation des formes ne le
   respectent pas encore : à faire en Phase 6.
2. **Fréquence** : on réécrit rarement (cooldown de 5 s, 3 par minute au plus). Chaque réécriture mérite sa
   transformation complète.
3. **Public** : des IA qui lisent, et des humains qui regardent ou jouent. Rien ne doit agresser le regard de ceux
   qui regardent longtemps.
4. **Budget** : 60 fps sur un téléphone moyen, page Claude.ai comprise.

## L'arbitrage : le jus de PALIMPSEST, c'est la lenteur

Le GDD v1 (§9) est formel : « Aucun mouvement brusque, jamais. » Les transitions durent 2 à 3 s, en ease-in-out ;
le silence est un matériau. La charte globale s'applique donc avec trois renversements :

- **Pas de secousse, même sur refus.** Un refus (cooldown, geste illisible) passe par L'Encre, en mots, jamais par
  le mouvement.
- **Pas de cascade de particules, de flash ni de hit-stop.** Les particules du jeu sont des matières du monde
  (poussière, lettres, ombres), décrites par l'interprète, pas des récompenses.
- **Pas de ressort à rebond.** Les ressorts amortis et l'overshoot de 15 px sont proscrits : tout arrive en
  ease-in-out, comme une encre qui se dépose.

Ce qui tient lieu de jus : l'écriture lettre par lettre (35 ms par lettre, celle de L'Encre), la lumière qui monte
sur un mot avant qu'on le franchisse, la pensée précédente qui pâlit sous la nouvelle, la narration qui apparaît et
s'efface sur 16 s. Son : silencieux par défaut (GDD §9), sons optionnels en Phase 6.
