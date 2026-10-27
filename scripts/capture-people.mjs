// Close-ups das pessoas e dos quadros (laboratório com câmera livre ?cam=).
// Uso (app rodando): node scripts/capture-people.mjs [--base=http://localhost:3000] [--only=heart-vendas,...]
import { chromium } from "playwright";
import path from "node:path";

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const base = arg("base", "http://localhost:3000");
const only = arg("only", "")
  .split(",")
  .filter(Boolean);
const out = (name) => path.join(import.meta.dirname, "..", "docs", "screenshots", name);

const HEART = 7.8;
const BRAIN = 13.2;
// zonas das áreas (constants.ts): fileira +Z (z = 3.75) e fileira +X (x = 3.75)
const rowZ = { marketing: -3.3, vendas: -1.35, produto: 0.6, atendimento: 2.5 };
const rowX = { cs: 2.5, financeiro: 0.6, operacoes: -1.35, revops: -3.3 };

const shots = {};
for (const [k, x] of Object.entries(rowZ)) {
  shots[`heart-${k}`] = [x + 1.1, HEART + 1.35, 3.75 + 3.1, x, HEART + 0.7, 3.6];
}
for (const [k, z] of Object.entries(rowX)) {
  shots[`heart-${k}`] = [3.75 + 3.1, HEART + 1.35, z + 1.1, 3.6, HEART + 0.7, z];
}
shots["brain-boards-z"] = [-1.0, BRAIN + 2.2, 3.75 + 6.5, -1.0, BRAIN + 1.0, 3.2];
shots["brain-boards-x"] = [3.75 + 6.5, BRAIN + 2.2, -0.6, 3.2, BRAIN + 1.0, -0.6];
shots["brain-marketing"] = [-3.3 + 1.2, BRAIN + 1.4, 3.75 + 3.0, -3.0, BRAIN + 1.0, 3.4];
shots["brain-table"] = [3.2, BRAIN + 2.4, 4.0, 0.2, BRAIN + 0.6, 0.2];

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
for (const [name, cam] of Object.entries(shots)) {
  if (only.length && !only.includes(name)) continue;
  await page.goto(`${base}/lab/building?ui=0&instant=1&cam=${cam.map((v) => v.toFixed(2)).join(",")}`, {
    waitUntil: "networkidle",
  });
  await page.waitForFunction(() => (window.__labFrames ?? 0) > 40, null, { timeout: 90000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: out(`people-${name}.png`) });
  console.log("✓", name);
}
await browser.close();
