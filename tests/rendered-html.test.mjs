import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the post-CAP implementation prototype for GitHub Pages", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>LP Gestao \| Implantacao pos-CAP<\/title>/i);
  assert.match(html, /Entrar no LP Gestão/);
  assert.match(html, /Perfil de demonstracao|Usuário/);
  assert.match(html, /Acesso TI criado para teste/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("keeps starter-only dependencies out of the prototype", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
