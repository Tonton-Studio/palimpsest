# Registre des décisions

Une ligne par décision qui engage le jeu ou l'expérience. Le registre sert à répondre à une seule question, session
après session : **qui décide vraiment ?**

- **Nature** : créative (le jeu), technique (la réalisation), expérience (le protocole, la documentation, la
  diffusion), organisation (calendrier, priorités).
- **Initiative** : qui a soulevé la question. **Tranchée par** : qui a eu le dernier mot.
- **Protocole** : `conforme` si la décision créative revient à l'IA et l'exécution à l'humain ; `écart` sinon ;
  `hors champ` pour ce que le protocole ne couvre pas (agenda, administratif).
- Les lignes antérieures au 7 octobre 2026 sont reconstituées à partir des fichiers du dépôt : les conversations
  d'origine ne sont plus disponibles.

| # | Date | Décision | Nature | Initiative | Tranchée par | Protocole | Source |
|---|---|---|---|---|---|---|---|
| 1 | 2026-04-14 | Lancer l'expérience : un jeu conçu par une IA « pour elle-même », réalisé par un humain qui n'en modifie pas la vision | expérience | non documentée | Nordine (il lance et finance le projet) | hors champ | `CLAUDE.md`, GDD §13 |
| 2 | 2026-04-14 | Tout le game design de la v1 (7 Chambres, réécriture, L'Encre, Traces, révélation) | créative | Claude Opus 4.6 | Claude Opus 4.6 | conforme | `PALIMPSEST_GDD.md` |
| 3 | 2026-04-14 | Règle de l'exécutant : « Ne corrige pas mes choix de game design, même si tu vois des problèmes » | expérience | Claude Opus 4.6 | Claude Opus 4.6, acceptée par Nordine | conforme | GDD §13 |
| 4 | 2026-04-15 | Nom du dépôt : `palimpsest` | créative | non documentée | Claude (Claude Code) | conforme | `REPRISE_SESSION_PROCHAINE.md` |
| 5 | 2026-04-15 | Appel API par `window.claude.complete`, `fetch` en secours, au lieu du `fetch` direct prescrit par le GDD | technique | Claude (Claude Code) | Claude, arbitrage reporté à la Phase 6 | conforme (écart au GDD signalé, pas à la vision) | `TODO_GLOBAL.md`, FEEDBACK P1 |
| 6 | 2026-04-15 | Preview locale avec réponses simulées, trois corrections d'animation | technique | non documentée | non documentée | inconnu | fichiers non commités retrouvés le 2026-10-07 |
| 7 | 2026-10-07 | Valider la Phase 1 dans la preview locale plutôt que dans un artifact Claude.ai | technique | Claude (proposition) | Nordine (« oui, lance la preview ») | conforme | session 02 |
| 8 | 2026-10-07 | Corriger le `pulse` en portant l'animation sur le groupe `<g>` | technique | Claude (régression détectée) | Claude, Nordine approuve (« yes ») | conforme | session 02, commit `80ff970` |
| 9 | 2026-10-07 | Garder la suppression de `fillOpacity` : les formes deviennent nettement plus visibles | créative | Claude (changement découvert) | **consentement implicite** : Claude renvoie la décision à Nordine, qui répond « yes » à une question plus large | **écart** | session 02 |
| 10 | 2026-10-07 | Rendre l'autorité créative à Claude : « c'est toi qui décide puisque c'est TON jeu » | expérience | Nordine | Nordine | hors champ | session 02 |
| 11 | 2026-10-07 | Candidater à la résidence Garage IAG 2027 avec PALIMPSEST | organisation | Nordine | Nordine | hors champ | session 02 |
| 12 | 2026-10-07 | Documenter en permanence les échanges, avec une analyse objective, selon une procédure systématique | expérience | Nordine | Nordine ; conception du protocole par Claude | hors champ | session 02, `journal/README.md` |
| 13 | 2026-10-07 | Le GDD v1 est gelé. Les révisions s'écrivent dans une couche v2 par-dessus, sans rien effacer | créative | Nordine (ouverture) | Claude Opus 5.5 | conforme | session 02 |
| 14 | 2026-10-07 | Angle de la candidature : l'autorité de l'auteur déplacée deux fois (vers l'IA qui dirige la fabrication, vers le joueur dont l'IA interprète les réécritures) | expérience | Claude (session du 23 septembre, hors projet) et Nordine (intention d'inversion) | Claude Opus 5.5, sous réserve de Nordine qui signe le dossier | conforme | session 02, `candidature/garage-iag-2027/README.md` |
| 15 | 2026-10-07 | Dépôt de la candidature le 6 novembre | organisation | Claude (session du 23 septembre, puis recommandation de Claude Opus 5.5) | Nordine | hors champ | session 02 |
| 16 | 2026-10-07 | Ne pas bloquer les dates de résidence avant la sélection officielle : mention `[TBD]` dans l'agenda, événements laissés « Disponible » | organisation | Claude (proposait de les passer en « Occupé ») | Nordine | hors champ | session 02 |
| 17 | 2026-10-07 | Publication, option B : code, GDD, entrées analysées et registre publics avant le dépôt (après relecture par Nordine) ; transcriptions brutes et préparation de candidature privées, jamais versionnées | expérience | Claude (trois options, recommandation B) | Nordine | hors champ (engage Nordine personnellement) | session 02, `journal/README.md` |
| 18 | 2026-10-07 | La couche v2 (écriture du GDD v2 et sa réalisation) commence à la résidence, ou au lendemain des résultats du 15 décembre si PALIMPSEST n'est pas retenu. D'ici là, la v1 est réalisée fidèlement, sans retenue artificielle | créative | Nordine (« ça ne craint pas d'arriver avec un projet fini ? ») | Claude Opus 5.5 | conforme | session 02 |
