# CHAMBER_DEFINITIONS — PALIMPSEST

> Données canoniques des 7 Chambres : Inscriptions initiales, visuels de base, connexions.
> Référence absolue : PALIMPSEST_GDD.md §3 (Les 7 Chambres).
>
> **STUB** : à compléter en Phase 1 à partir du GDD §3. Ce fichier centralise les données pour alimenter l'état initial du `useReducer` sans polluer le JSX.

---

## Schéma par Chambre

```ts
{
  id: "SEUIL" | "GRAVITÉ" | "TEMPS" | "SILENCE" | "MIROIR" | "ÉCHO" | "PROFONDEUR",
  theme: string,                  // thème central de la Chambre
  inscriptions: [
    {
      id: string,                 // ex: "seuil.1"
      original: string,           // texte initial (immuable, sert de filigrane)
      current: string,            // texte actif (= original au démarrage)
      history: string[]           // versions successives
    }
  ],
  visuals: {
    palette: { bg: string, accent: string, ink: string, inscription: string },
    shapes: [ /* SVG primitives de base */ ],
    particles: { density: number, motion: string }
  },
  connections: string[]           // IDs des Chambres accessibles via mots-liens
}
```

---

## SEUIL
- **Thème** : Entrée, intérieur/extérieur
- **Inscriptions initiales (2)** : _(à remplir depuis GDD §3.1)_
- **Connexions** : `GRAVITÉ`, `TEMPS`
- **Visuels** : _(à remplir)_

## GRAVITÉ
- **Thème** : Attraction, poids, centre
- **Inscriptions initiales (3)** : _(à remplir depuis GDD §3.2)_
- **Connexions** : `SEUIL`, `SILENCE`, `MIROIR`
- **Visuels** : _(à remplir)_

## TEMPS
- **Thème** : Séquence, durée, passage
- **Inscriptions initiales (3)** : _(à remplir depuis GDD §3.3)_
- **Connexions** : `SEUIL`, `ÉCHO`, `PROFONDEUR`
- **Visuels** : _(à remplir)_

## SILENCE
- **Thème** : Absence, vide, non-dit
- **Inscriptions initiales (2)** : _(à remplir depuis GDD §3.4)_
- **Connexions** : `GRAVITÉ`, `ÉCHO`
- **Visuels** : _(à remplir)_

## MIROIR
- **Thème** : Réflexion, double, identité
- **Inscriptions initiales (3)** : _(à remplir depuis GDD §3.5)_
- **Connexions** : `GRAVITÉ`, `PROFONDEUR`
- **Visuels** : _(à remplir)_

## ÉCHO
- **Thème** : Répétition, transformation, copie
- **Inscriptions initiales (3)** : _(à remplir depuis GDD §3.6)_
- **Connexions** : `TEMPS`, `SILENCE`, `PROFONDEUR`
- **Visuels** : _(à remplir)_

## PROFONDEUR
- **Thème** : Sous la surface, méta, code
- **Inscriptions initiales (3)** : _(à remplir depuis GDD §3.7)_
- **Connexions** : `TEMPS`, `MIROIR`, `ÉCHO`
- **Visuels** : _(à remplir)_
- **Note** : couche de révélation activée après 20+ réécritures totales (GDD §8)
