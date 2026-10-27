// Prints da leitura: painel em tema claro e escuro, balão de um termo e gaveta do glossário.
// Uso (app rodando): node scripts/capture-reading.mjs [--base=http://localhost:3000]
import { chromium } from "playwright";
import path from "node:path";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const out = (name) => path.join(import.meta.dirname, "..", "docs", "screenshots", name);
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${base}/crm-como-sistema`, { waitUntil: "networkidle" });
await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });
await page.locator(".chapter-nav").getByRole("button", { name: "Heart" }).click();
await page.waitForSelector(".chapter--heart");
await page.waitForTimeout(1800);
await page.locator('button[data-dept="customer-success"]').click();
await page.waitForSelector(".panel");
await page.waitForTimeout(600);
await page.screenshot({ path: out("xp-light-heart.png") });

// balão: um termo do corpo do painel
const term = page.locator(".panel__body .term").nth(1);
await term.scrollIntoViewIfNeeded();
await term.hover();
await page.waitForSelector(".term-tip");
await page.waitForTimeout(200);
await page.screenshot({ path: out("xp-light-tip.png") });

await page.locator(".term-tip").click();
await page.waitForSelector(".glossary[open]");
await page.waitForTimeout(300);
await page.screenshot({ path: out("xp-light-drawer.png") });
await page.locator(".glossary input").fill("");
await page.keyboard.press("Escape");

await page.locator(".chapter-nav__theme").click();
await page.getByRole("tab", { name: "Visão" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: out("xp-dark-overview.png") });
await page.locator(".chapter-nav__theme").click(); // volta ao padrão (claro)

await browser.close();
console.log("ok: xp-light-heart, xp-light-tip, xp-light-drawer, xp-dark-overview");
