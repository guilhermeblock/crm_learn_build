// Sequência do processo numa estação do Heart: prints em intervalos + passo aceso no painel.
// Uso (app rodando): node scripts/capture-stations.mjs [--base=http://localhost:3000] [--area=Vendas]
//   [--station=2]  escolhe a estação (1–4) · [--full] tela inteira (para ver a passagem a outra área)
import { chromium } from "playwright";
import path from "node:path";

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const base = arg("base", "http://localhost:3000");
const area = arg("area", "Vendas");
const station = Number(arg("station", "1"));
const full = process.argv.includes("--full");
const out = (name) => path.join(import.meta.dirname, "..", "docs", "screenshots", name);
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: full ? 1 : 2 });

await page.goto(`${base}/crm-como-sistema`, { waitUntil: "networkidle" });
await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });
await page.locator(".chapter-nav").getByRole("button", { name: "Heart" }).click();
await page.waitForSelector(".chapter--heart");
await page.waitForTimeout(1800);
await page.locator(`.chapter__menu button:has-text("${area}")`).first().click();
await page.waitForSelector(".panel");
await page.waitForTimeout(1500);
if (station > 1) await page.locator(".station-label").nth(station - 1).click();
await page.waitForTimeout(1200);

const steps = [];
for (let k = 0; k < 8; k++) {
  const step = await page.evaluate(
    () => `${document.querySelector(".stepper")?.dataset.step ?? "?"}/${document.querySelector(".handoff")?.dataset.live ?? "-"}`,
  );
  steps.push(step);
  // recorte ampliado em volta da estação escolhida
  const r = await page.locator(".station-label.is-active").boundingBox();
  const clip = { x: Math.max(0, r.x - 160), y: Math.max(0, r.y - 60), width: 360, height: 200 };
  await page.screenshot({ path: out(`xp-process-${k}.png`), ...(full ? {} : { clip }) });
  await page.waitForTimeout(450);
}
console.log("passos no painel:", steps.join(" "));
await browser.close();
