// PALIMPSEST — charge le moteur du jeu (src/Palimpsest.jsx) dans Node, sans React.
// Utilisé par porte/play.mjs (les parties) et porte/test_engine.mjs (la vérification).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ESBUILD = "esbuild@0.24.0";

// ============================================================
// MOTEUR : src/Palimpsest.jsx, sans React
// ============================================================

export async function loadEngine() {
  const source = readFileSync(join(ROOT, "src/Palimpsest.jsx"), "utf8");
  const importLine = /^\s*import\s+React[^;]*from\s+["']react["'];?\s*$/m;
  if (!importLine.test(source) || !/^export\s*\{/m.test(source)) {
    throw new Error("src/Palimpsest.jsx : import React ou ligne `export { … }` introuvable, porte/play.mjs doit être adapté.");
  }
  // Les composants ne sont jamais rendus ici : React n'a besoin que d'exister.
  const prepared = source.replace(importLine, "const React = {};\nconst { useReducer, useEffect, useCallback, useMemo } = React;");
  const js = execFileSync(
    "npx",
    ["--yes", ESBUILD, "--loader=jsx", "--jsx=transform", "--format=esm", "--target=es2022", "--charset=utf8"],
    { input: prepared, encoding: "utf8", maxBuffer: 16 * 1024 * 1024, stdio: ["pipe", "pipe", "inherit"] },
  );
  mkdirSync(join(ROOT, "dist"), { recursive: true });
  const file = join(ROOT, "dist/palimpsest.core.mjs");
  writeFileSync(file, js);
  return import(pathToFileURL(file).href + "?v=" + Date.now());
}

export function engineVersion() {
  try {
    const hash = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
    const dirty = execFileSync("git", ["status", "--porcelain", "src/Palimpsest.jsx"], { cwd: ROOT, encoding: "utf8" }).trim();
    return hash + (dirty ? " + modifications non commitées" : "");
  } catch {
    return "inconnue";
  }
}
