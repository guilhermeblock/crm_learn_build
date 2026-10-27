// Prints da leitura guiada do celular (390×844): topo, áreas, um andar, painel em página e síntese.
// Uso (app rodando): node scripts/capture-guide.mjs [--base=http://localhost:3000]
import { chromium } from "playwright";
import path from "node:path";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const out = (name) => path.join(import.meta.dirname, "..", "docs", "screenshots", `guide-${name}.png`);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(`${base}/crm-como-sistema`, { waitUntil: "networkidle" });
await page.waitForSelector(".guide");
await page.waitForTimeout(600);
await page.screenshot({ path: out("inicio") });

const at = async (id, name) => {
  await page.locator(id).scrollIntoViewIfNeeded();
  await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: "start" }), id);
  await page.waitForTimeout(500);
  await page.screenshot({ path: out(name) });
};
await at("#guia-areas", "areas");
await at("#guia-backbone", "backbone");
await page.evaluate(() => window.scrollBy(0, 560));
await page.waitForTimeout(300);
await page.screenshot({ path: out("backbone-areas") });

await page.locator("#guia-backbone .guide__areas button").nth(1).click();
await page.waitForSelector(".panel--page");
await page.waitForTimeout(400);
await page.screenshot({ path: out("painel-backbone") });
await page.getByRole("tab", { name: "Visão" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: out("painel-visao") });
await page.goBack();
await page.waitForSelector(".panel--page", { state: "detached" });

await at("#guia-sintese", "sintese");
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(400);
await page.screenshot({ path: out("sintese-fim") });

// tema escuro
await page.locator(".guide__tools button").nth(1).click();
await at("#guia-heart", "heart-escuro");

await browser.close();
console.log("ok: guide-{inicio,areas,backbone,backbone-areas,painel-backbone,painel-visao,sintese,sintese-fim,heart-escuro}.png");
