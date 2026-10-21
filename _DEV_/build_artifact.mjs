#!/usr/bin/env node
// PALIMPSEST — construit la page publiée sur Claude.ai à partir de src/Palimpsest.jsx (seule source du jeu).
//
//   node _DEV_/build_artifact.mjs
//
// Produit (dans dist/, non versionné) :
//   - palimpsest.html       : le contenu publié par l'outil Artifact (il ajoute lui-même doctype, head et body) ;
//   - palimpsest.local.html : la même page avec son squelette, pour un test local dans un navigateur.
//
// Le JSX est transformé par esbuild, lancé via npx : rien n'est installé dans le projet.
// React arrive depuis cdnjs, seul hôte de scripts autorisé avec unpkg et jsdelivr sur une page Claude.ai.
// La page doit être publiée avec capabilities: {sample: {}} pour que Claude interprète les réécritures.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REACT_VERSION = "18.3.1";
const ESBUILD = "esbuild@0.24.0";

const source = readFileSync(join(ROOT, "src/Palimpsest.jsx"), "utf8");
const importLine = /^\s*import\s+React[^;]*from\s+["']react["'];?\s*$/m;
const exportLine = /^export default function Palimpsest\(/m;
if (!importLine.test(source) || !exportLine.test(source)) {
  throw new Error("src/Palimpsest.jsx : ligne d'import React ou export default introuvable, le build doit être adapté.");
}

// React devient le global UMD ; le composant racine devient une fonction globale.
// La ligne `export { … }` (moteur partagé avec porte/play.mjs) n'a pas de sens dans un script de page.
const prepared = source
  .replace(importLine, "const { useReducer, useEffect, useCallback, useMemo } = React;")
  .replace(exportLine, "function Palimpsest(")
  .replace(/^export\s*\{[^}]*\};?.*$/m, "");

const js = execFileSync(
  "npx",
  ["--yes", ESBUILD, "--loader=jsx", "--jsx=transform", "--target=es2020", "--charset=utf8"],
  { input: prepared, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
).replace(/<\/script/gi, "<\\/script");

// Un seul monde visuel, sombre, quel que soit le thème du lecteur : couleurs posées explicitement.
const page = `<title>PALIMPSEST</title>
<style>
:root { --bg: #0A0A0F; --fg: #E8E4D9; color-scheme: dark; }
html, body { height: 100%; }
body { background: var(--bg); color: var(--fg); overflow: hidden; }
#root { height: 100%; }
</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/${REACT_VERSION}/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/${REACT_VERSION}/umd/react-dom.production.min.js"></script>
<script>
${js}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Palimpsest));
</script>
`;

const local = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>body { margin: 0 }</style></head><body>
${page}</body></html>
`;

mkdirSync(join(ROOT, "dist"), { recursive: true });
writeFileSync(join(ROOT, "dist/palimpsest.html"), page);
writeFileSync(join(ROOT, "dist/palimpsest.local.html"), local);
console.log(`dist/palimpsest.html : ${(Buffer.byteLength(page) / 1024).toFixed(1)} Ko (React ${REACT_VERSION}, ${ESBUILD})`);
