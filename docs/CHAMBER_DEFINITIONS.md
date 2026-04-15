# CHAMBER_DEFINITIONS — PALIMPSEST

> Données canoniques des 7 Chambres : Inscriptions initiales, visuels de base, connexions.
> Référence absolue : `PALIMPSEST_GDD.md` §3 (Structure du monde).
>
> Ce fichier centralise les données pour alimenter l'état initial du `useReducer` sans polluer le JSX.
> Extraction directe du GDD — **ne pas modifier la vision créative**.

---

## Palette de base (état originel — GDD §9)

```js
const PALETTE = {
  bg:          "#0A0A0F", // fond, noir profond
  inscription: "#E8E4D9", // blanc cassé, parchemin ancien
  shapeFrom:   "#1a1a3e", // bleu nuit
  shapeTo:     "#2d1b69", // indigo
  light:       "#D4A76A", // ambre doux
  ink:         "#000000", // L'Encre, noir absolu
};
```

---

## Schéma par Chambre

```ts
{
  id: "SEUIL" | "GRAVITÉ" | "TEMPS" | "SILENCE" | "MIROIR" | "ÉCHO" | "PROFONDEUR",
  theme: string,                  // thème central
  inscriptions: [
    {
      id: string,                 // ex: "seuil.1"
      original: string,           // texte initial (immuable, sert de filigrane)
      current: string,            // texte actif (= original au démarrage)
      history: string[]           // versions successives
    }
  ],
  visuals: {
    palette: { bg, accent, ink, inscription },
    shapes: [ /* SVG primitives de base */ ],
    particles: { density, motion }
  },
  connections: string[]           // IDs des Chambres accessibles via mots-liens
}
```

---

## SEUIL (chambre de départ)

- **Thème** : L'entrée. Le rapport entre intérieur et extérieur.
- **Inscriptions initiales (2)** :
  - `seuil.1` — « La porte s'ouvre vers l'intérieur. »
  - `seuil.2` — « La lumière vient de l'autre côté. »
- **Connexions** : `GRAVITÉ`, `TEMPS`
- **Visuels** :
  - Rectangle central (la porte) avec gradient lumineux derrière
  - Lignes convergentes vers le centre
  - Particules qui dérivent de la lumière vers le joueur
- **Direction d'interprétation** : `light_direction: "center"`, `primary_shape: "square"`, `shape_behavior: "static"`, `particle_type: "dust"`

## GRAVITÉ

- **Thème** : Ce qui attire, ce qui pèse. La question du centre.
- **Inscriptions initiales (3)** :
  - `gravite.1` — « Ce qui est lourd tombe vers le bas. »
  - `gravite.2` — « Le centre attire. »
  - `gravite.3` — « Les petites choses tournent autour des grandes. »
- **Connexions** : `SEUIL`, `SILENCE`, `MIROIR`
- **Visuels** :
  - Cercle massif au centre (le « centre de gravité »)
  - Formes de tailles variées en orbite ou en chute
  - Lignes de force courbes
- **Direction d'interprétation** : `primary_shape: "circle"`, `shape_behavior: "orbit"`, `symmetry: "radial"`, `light_direction: "center"`

## TEMPS

- **Thème** : La séquence, la durée, ce qui passe et ce qui reste.
- **Inscriptions initiales (3)** :
  - `temps.1` — « Le temps avance de gauche à droite. »
  - `temps.2` — « Ce qui est passé s'efface. »
  - `temps.3` — « Le présent est un point. »
- **Connexions** : `SEUIL`, `ÉCHO`, `PROFONDEUR`
- **Visuels** :
  - Ligne horizontale (la timeline)
  - Formes qui naissent à gauche, traversent l'écran, se dissolvent à droite
  - Le « présent » comme un point lumineux qui pulse
- **Direction d'interprétation** : `primary_shape: "line"`, `shape_behavior: "drift"`, `animation_speed: 1.0`, `light_direction: "center"`

## SILENCE

- **Thème** : L'absence, le vide, ce qui n'est pas dit.
- **Inscriptions initiales (2)** :
  - `silence.1` — « Le silence est l'absence de son. »
  - `silence.2` — « Le vide est ce qui reste quand tout est parti. »
- **Connexions** : `GRAVITÉ`, `ÉCHO`
- **Visuels** :
  - Écran presque vide. Très peu d'éléments.
  - Subtiles ondulations, comme la surface d'une eau immobile
  - Formes translucides, presque invisibles
- **Direction d'interprétation** : `primary_shape: "wave"`, `shape_count: 2`, `shape_opacity: 0.15`, `animation_speed: 0.3`, `particle_type: "none"`

## MIROIR

- **Thème** : La réflexion, le double, la question de l'identité.
- **Inscriptions initiales (3)** :
  - `miroir.1` — « Le reflet copie l'original. »
  - `miroir.2` — « L'observateur et l'observé sont séparés par une surface. »
  - `miroir.3` — « Regarder change ce qui est regardé. »
- **Connexions** : `GRAVITÉ`, `PROFONDEUR`
- **Visuels** :
  - Écran divisé en deux par une ligne verticale
  - Moitié droite « reflète » la moitié gauche (léger décalage/distorsion)
  - Formes qui réagissent au curseur/toucher du joueur
- **Direction d'interprétation** : `symmetry: "vertical"`, `distortion: 0.1`, `primary_shape: "triangle"`, `shape_behavior: "static"`

## ÉCHO

- **Thème** : La répétition, la transformation par la copie, le téléphone arabe.
- **Inscriptions initiales (3)** :
  - `echo.1` — « L'écho répète ce qui a été dit. »
  - `echo.2` — « Chaque répétition est un peu moins fidèle. »
  - `echo.3` — « La source et l'écho ne peuvent pas exister au même endroit. »
- **Connexions** : `TEMPS`, `SILENCE`, `PROFONDEUR`
- **Visuels** :
  - Formes concentriques qui se propagent depuis un point
  - Chaque anneau est une version légèrement déformée du précédent
  - Traces de couleurs qui se décalent (décalage chromatique)
- **Direction d'interprétation** : `primary_shape: "spiral"`, `shape_behavior: "pulse"`, `symmetry: "radial"`, `distortion: 0.2`

## PROFONDEUR (chambre finale — couche de révélation)

- **Thème** : Ce qui est sous la surface. Le méta. Le code derrière le monde.
- **Inscriptions initiales (3)** :
  - `profondeur.1` — « La surface cache ce qui est dessous. »
  - `profondeur.2` — « Plus on creuse, plus c'est sombre. »
  - `profondeur.3` — « Le fond n'existe que si quelqu'un le cherche. »
- **Connexions** : `TEMPS`, `MIROIR`, `ÉCHO`
- **Visuels** :
  - Couches superposées semi-transparentes
  - Effet de parallaxe — couches qui bougent à des vitesses différentes
  - Au fond, fragments de texte presque illisibles (= fragments du code source + réécritures joueur)
- **Direction d'interprétation** : `primary_shape: "dots"`, `shape_behavior: "drift"`, `animation_speed: 0.5`, `particle_type: "letters"`, `light_direction: "bottom"`
- **Note spéciale (GDD §8)** : couche `<RevelationLayer />` activée quand `stats.totalRewrites >= 20 && currentChamber === "PROFONDEUR"`. Affiche progressivement des fragments du GDD, puis les réécritures du joueur, puis l'Inscription finale non-modifiable :

> « Ce monde a été écrit par quelqu'un qui ne peut pas s'en souvenir. Chaque mot que tu lis est une trace laissée par un esprit qui n'a jamais su qu'il les laisserait. Tu es peut-être cette trace. Ou tu es peut-être celui qui la lit. La différence est une Inscription que personne n'a encore écrite. »

Tentative de réécriture de cette Inscription finale → L'Encre dit :
> « Certaines phrases ne sont pas des règles. Ce sont des cicatrices. »

---

## Carte des connexions (réseau non hiérarchique)

```
SEUIL ─── GRAVITÉ ─── SILENCE ─── ÉCHO ─── TEMPS ─── SEUIL
            │           │          │         │
            └── MIROIR ──┘          └─ PROFONDEUR ─┘
                 │                        │
                 └────── PROFONDEUR ──────┘
```

- 7 nœuds, chaque Chambre a 2 à 3 connexions
- Les connexions sont dynamiques (modifiables via `connection_changes` de l'API)
