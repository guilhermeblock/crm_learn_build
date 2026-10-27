// Folha de revisão: concept aprovado lado a lado com as três vistas do protótipo.
// Uso: node scripts/review-sheet.mjs [prefixo=final]  → docs/review-sheet.png
// (rode depois de scripts/capture.mjs, que gera docs/screenshots/<prefixo>-*.png)
import { chromium } from "playwright";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const prefix = process.argv[2] ?? "final";
const img = (p) => pathToFileURL(path.join(root, p)).href;

const concept = img("../references/predio_concept_aprovado.png");
const shots = [
  ["Visão geral", img(`docs/screenshots/${prefix}-overview.png`)],
  ["Rooftop", img(`docs/screenshots/${prefix}-rooftop.png`)],
  ["Heart", img(`docs/screenshots/${prefix}-heart.png`)],
];

const cells = [
  ["REF", "concept aprovado (imagem)", concept],
  ...shots.map(([label, src], i) => [`0${i + 1}`, `${label} (3D em tempo real)`, src]),
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; background: #151515; color: #e9e8e2; font: 14px/1.3 Consolas, monospace; }
  .sheet { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 28px; width: 1600px; box-sizing: border-box; }
  h1 { grid-column: 1 / -1; margin: 0; font-size: 16px; letter-spacing: .1em; }
  figure { margin: 0; }
  .frame { position: relative; aspect-ratio: 16 / 10; background: #0d0d0d; overflow: hidden; }
  .frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
  figcaption { padding: 8px 0 0; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; }
  figcaption b { color: #164cff; }
</style></head><body><div class="sheet">
  <h1>GUI BLOCK · CRM COMO SISTEMA · SPRINT 01 — CONCEPT × PROTÓTIPO</h1>
  ${cells
    .map(([tag, label, src]) => `<figure><div class="frame"><img src="${src}"></div><figcaption><b>${tag}</b> · ${label}</figcaption></figure>`)
    .join("")}
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
// página em file:// (uma página em branco não pode carregar imagens locais)
const dir = await mkdtemp(path.join(os.tmpdir(), "review-sheet-"));
const file = path.join(dir, "sheet.html");
await writeFile(file, html);
await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
const out = path.join(root, "docs", "review-sheet.png");
await page.locator(".sheet").screenshot({ path: out });
await browser.close();
await rm(dir, { recursive: true, force: true });
console.log(`✓ ${out}`);
