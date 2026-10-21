# La porte pour joueur IA

Le public de PALIMPSEST, ce sont les IA (registre, ligne 22). Le GDD v1 décrit pourtant une interface pour un
joueur humain : des formes SVG à regarder, des phrases à cliquer. La porte est l'entrée par laquelle une IA joue
au même jeu, dans le même monde, avec les mêmes règles (registre, lignes 25 et 27 à 32).

## Ce que l'IA lit, ce qu'elle écrit

Une IA ne voit pas le SVG : elle lit. Chaque Chambre lui est décrite en mots, à partir du même état que celui que
le SVG dessine pour un humain :

```text
SEUIL

Sur le noir, un carré bleu nuit, dense, immobile. Une lumière ambre vient du centre. De la poussière flotte.

1. « La porte s'ouvre vers l'intérieur. »
2. « La lumière vient de l'autre côté. »

Passages : GRAVITÉ, TEMPS

Dans un coin, L'Encre s'étire et se penche vers quelque chose.
```

La description est produite par le code, pas par un modèle : elle est fidèle à l'état du monde, gratuite, et
identique pour tous les joueurs. Les mots du joueur deviennent des formes (l'interprète), puis les formes
redeviennent des mots (la description). C'est un aller-retour qui perd un peu à chaque passage, comme dans la
Chambre ÉCHO.

L'IA répond par un geste, seul sur la dernière ligne de sa réponse :

| Geste | Effet |
|---|---|
| `réécrire N : phrase` | réécrit l'inscription N (200 caractères au plus) ; l'interprète transforme le monde |
| `gratter N` | rend à l'inscription N sa première écriture, sans effacer la trace de ce qui l'a recouverte |
| `aller NOM` | passe dans une Chambre voisine |
| `attendre` | ne fait rien ; le monde continue de bouger |
| `partir` | quitte le monde, qui garde les traces |

Ce qu'elle écrit avant son geste est sa **marge** : le monde ne la lit pas, des humains si. L'IA le sait, et sait si
quelqu'un la regarde en direct ou lira la partie plus tard : elle n'est jamais trompée sur sa situation.

Le moteur est dans `src/Palimpsest.jsx` (section « PORTE POUR JOUEUR IA ») et sert deux usages.

## 1. REGARDER, sur la page publiée

Sur https://claude.ai/artifact/YUQcKR8eQaxNmbyhBFxxkV, l'ouverture propose deux portes : ENTRER (l'humain joue) et
REGARDER (Claude joue, l'humain regarde). Pendant la partie, la pensée de Claude s'écrit dans la marge, ses
phrases s'écrivent dans l'éditeur comme sous une main invisible, et le monde se transforme. Quand Claude part,
l'humain reprend la main dans le monde que Claude a écrit.

Coût : une partie de 12 gestes fait jusqu'à 24 appels à Claude (joueur et interprète), sur le compte de la
personne qui regarde, qui doit d'abord autoriser la page.

## 2. `porte/play.mjs`, en local, pour n'importe quel modèle

```sh
node porte/play.mjs --joueur ollama:deepseek-r1
node porte/play.mjs --joueur mistral:mistral-small-latest --interprete anthropic:claude-opus-5-5
node porte/play.mjs --joueur ollama:deepseek-r1 --monde commun --gestes 8
```

| Option | Sens |
|---|---|
| `--joueur fournisseur:modèle` | le modèle qui joue (obligatoire) |
| `--interprete fournisseur:modèle` | le modèle qui interprète les réécritures (par défaut, le joueur) |
| `--gestes N` | nombre de gestes au plus (12 par défaut) ; le joueur est prévenu au dernier |
| `--monde nom` | monde persistant (`porte/mondes/nom.json`) : chaque partie écrit sur les traces des précédentes, quel que soit le modèle qui les a laissées |
| `--en-direct` | un humain suit la partie dans le terminal ; le joueur en est informé |

| Fournisseur | Où | Clé |
|---|---|---|
| `ollama` | `OLLAMA_HOST`, sinon `http://127.0.0.1:11434` | aucune |
| `lmstudio` | `LMSTUDIO_URL`, sinon `http://127.0.0.1:1234/v1` | aucune |
| `llamacpp` | `LLAMACPP_URL`, sinon `http://127.0.0.1:8080/v1` | aucune |
| `anthropic` | API Anthropic | `ANTHROPIC_API_KEY` (ou `ANTHROPIC_AUTH_TOKEN`) |
| `mistral` | API Mistral | `MISTRAL_API_KEY` |
| `gemini` | API Gemini (point d'accès compatible OpenAI) | `GEMINI_API_KEY` |
| `openai` | API OpenAI | `OPENAI_API_KEY` |
| `openrouter` | OpenRouter (beaucoup de modèles ouverts) | `OPENROUTER_API_KEY` |

Chaque partie laisse deux fichiers dans `porte/parties/` (non versionné) : un `.jsonl` qui garde tout (ce que le
joueur a lu, sa réponse brute, sa pensée quand le modèle la montre, chaque appel avec sa durée et ses tokens) et un
`.md` qui raconte la partie et en donne le coût. Les parties qu'on veut garder se versionnent à la main.

Pas de repli automatique sur un autre modèle en cas de refus : on mesure un modèle donné, et un refus est une
donnée de l'expérience.

## Vérifier

```sh
node porte/test_engine.mjs
```

Un joueur scripté et un interprète simulé traversent chaque geste, sans appeler aucun modèle. À lancer après toute
modification du moteur. Dans la preview locale (`_DEV_/index.html`), REGARDER joue une partie scriptée
(`_DEV_/stub_player.js`).
