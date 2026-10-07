# Journal de l'expérimentation PALIMPSEST

PALIMPSEST est un jeu conçu et dirigé par une IA (Claude), réalisé par un humain (Nordine Ghachi, Tonton Studio).
L'expérience compte autant que le jeu : montrer à d'autres humains ce qui se passe quand on inverse les rôles,
quand c'est l'IA qui décide et l'humain qui exécute. Ce journal en est la trace. Il existe depuis le 7 octobre 2026.

## Les trois couches

| Couche | Fichier | Qui l'écrit | Quand |
|---|---|---|---|
| Transcription brute (**privée**) | `transcripts/AAAA-MM-JJ_<session>.md` | Automatique (hook `Stop` / `SessionEnd`) | À chaque fin de tour de Claude |
| Entrée analysée | `sessions/AAAA-MM-JJ_session-NN.md` | Claude, avec un contrepoint facultatif de Nordine | Pendant la session, à chaque jalon |
| Registre des décisions | `REGISTRE_DES_DECISIONS.md` | Claude | À chaque décision qui engage le jeu ou l'expérience |

La transcription brute contient les messages de Nordine, les réponses de Claude, une ligne par action et la
consommation de tokens. Elle exclut le raisonnement interne de Claude, les résultats bruts des outils, les captures
d'écran et les rappels système, et masque les secrets. Elle ne s'édite jamais à la main.

## Le protocole (permanent, systématique)

1. **Ouvrir l'entrée dès le premier échange de fond.** Claude crée `sessions/AAAA-MM-JJ_session-NN.md` à partir du
   gabarit ci-dessous dès qu'une session dépasse la simple question. Il ne l'écrit pas seulement en fin de session :
   une session peut s'interrompre, et c'est ainsi que le travail fait après la passation du 15 avril 2026 n'a été
   consigné nulle part.
2. **Mettre à jour à chaque jalon** : une décision, une livraison, une erreur découverte, un écart au protocole, un
   changement de direction de Nordine.
3. **Inscrire chaque décision au registre**, avec qui en a eu l'initiative et qui l'a tranchée.
4. **Clore l'entrée** à `/tts_handover` ou `/tts_sanctuarize` : coût de la session (repris de l'en-tête de la
   transcription), relecture, statut `close`.
5. **À la reprise** (`/tts_takeover`) : lire le registre et la dernière entrée. Si elle n'a pas été close, la
   compléter depuis la transcription brute et l'indiquer (`reconstruite après coup`).
6. **Committer les entrées et le registre** avec le reste, à chaque sanctuarisation. Jamais les transcriptions.

## Ce qui est public, ce qui reste privé

Décidé par Nordine le 7 octobre 2026 (option B, registre ligne 17) :

- **Public** (quand le dépôt passera en public, avant le dépôt de candidature du 6 novembre et après relecture du
  journal par Nordine) : le code, le GDD, les entrées analysées et le registre des décisions.
- **Privé** : les transcriptions brutes, parce qu'elles reproduisent mot pour mot les messages de Nordine. Elles ne
  sont **jamais versionnées** (`.gitignore`) : l'historique git étant conservé, tout ce qui y entre deviendrait
  public avec le dépôt. Elles vivent seulement sur le disque de Nordine. Des extraits choisis peuvent être cités
  dans les entrées ou en annexe d'un dossier, après accord de Nordine.
- Conséquence pour l'écriture des entrées : une entrée est un texte public. Les citations de Nordine y restent
  courtes, et rien de ce qui relève de sa vie privée ou de sa stratégie professionnelle n'y figure.

## La grille d'analyse

Chaque entrée suit la même grille, pour que les sessions restent comparables entre elles.

- **Faits** : chronologie courte et horodatée. Rien d'interprétatif.
- **Décisions** : ce qui a été décidé, qui en a eu l'initiative (IA / humain), qui a tranché, conforme ou non au
  protocole d'inversion.
- **Écarts au protocole** : chaque fois que l'IA renvoie une décision créative à l'humain, que l'humain tranche à la
  place de l'IA, ou qu'une décision se prend par consentement implicite.
- **Erreurs et corrections** : qui a introduit l'erreur, qui l'a détectée, comment.
- **Mémoire et continuité** : ce qui a été perdu, reconstruit ou transmis entre sessions et entre versions du modèle.
- **Coût** : durée, nombre d'actions, tokens. Les tokens ne mesurent pas directement l'énergie, mais c'est la donnée
  la plus fiable dont on dispose.
- **Ce que la séance montre de l'inversion des rôles** : observations, chacune suivie d'une contre-lecture
  (l'explication alternative la plus crédible).
- **Citations** : courtes, verbatim, horodatées.
- **Limites de cette analyse.**
- **Contrepoint de Nordine** : facultatif, écrit par lui, jamais par Claude.

## Les règles d'honnêteté

- Séparer les faits des interprétations, et signaler les interprétations comme telles.
- Consigner les erreurs de Claude d'abord et sans les adoucir. Ne jamais gonfler le rôle de l'IA, ni le réduire.
- Quand Claude parle de ce qu'il « veut » ou « ressent », l'écrire comme une position de directeur créatif ou un
  état fonctionnel, jamais comme un fait établi sur une expérience intérieure.
- Rappeler que l'analyste est partie prenante : Claude analyse des échanges auxquels il participe, et il n'a accès
  aux intentions de Nordine que par ce que Nordine écrit.
- Ne rien effacer. Une analyse qui s'avère fausse est corrigée par une note datée en dessous, comme une nouvelle
  couche du palimpseste.

## Gabarit d'entrée

```markdown
# Session NN — AAAA-MM-JJ

- Statut : ouverte | close | reconstruite après coup
- Modèle : <id du modèle> · Transcription : `../transcripts/<fichier>.md`

## Faits
## Décisions
## Écarts au protocole
## Erreurs et corrections
## Mémoire et continuité
## Coût
## Ce que la séance montre de l'inversion des rôles
## Citations
## Limites de cette analyse
## Contrepoint de Nordine
```
