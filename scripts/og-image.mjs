// Imagem do link (Open Graph, 1200×630): o prédio no capítulo Heart com a tese por cima.
// Uso (app rodando): node scripts/og-image.mjs [--base=http://localhost:3000]  → public/og.png
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const out = path.join(import.meta.dirname, "..", "public", "og.png");
mkdirSync(path.dirname(out), { recursive: true });

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${base}/crm-como-sistema`, { waitUntil: "networkidle" });
await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });
await page.locator(".chapter-nav").getByRole("button", { name: "Heart" }).click();
await page.waitForSelector(".chapter--heart");
await page.waitForTimeout(2200);

// só a cena: esconde a interface e escreve a tese por cima
await page.addStyleTag({
  content: `
    .xp__top, .chapter-wrap, .xp__hint, .xp__perf, .xp__reopen, .cube-labels, .station-labels, .xp__progress { display: none !important; }
    .og {
      position: fixed; left: 0; bottom: 0; z-index: 50; width: 640px; padding: 48px 72px 56px 56px;
      font-family: var(--font-barlow), sans-serif; color: #E9E8E2;
      background: linear-gradient(90deg, rgba(21,21,21,.96) 0%, rgba(21,21,21,.9) 70%, rgba(21,21,21,0) 100%);
    }
    .og::before { content: ""; position: absolute; left: 0; right: 0; bottom: 100%; height: 160px;
      background: linear-gradient(180deg, rgba(21,21,21,0), rgba(21,21,21,.85)); }
    .og small { display: block; margin-bottom: 10px; font: 400 16px/1 var(--font-space-mono), monospace; letter-spacing: .14em; color: #D4FF42; }
    .og b { display: block; font-size: 52px; line-height: 1.02; font-weight: 700; }
    .og span { display: block; margin-top: 14px; font-size: 22px; line-height: 1.3; opacity: .9; }
  `,
});
await page.evaluate(() => {
  const el = document.createElement("div");
  el.className = "og";
  el.innerHTML =
    "<small>GUI BLOCK · CRM COMO SISTEMA</small><b>Tecnologia não corrige operação.</b><span>Uma experiência 3D para entender o CRM além da tela: 8 áreas, 3 andares, um cliente.</span>";
  document.body.appendChild(el);
});
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
console.log("ok:", out);
