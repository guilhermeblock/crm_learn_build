// Prints do lançamento: rooftop, síntese com "Quem fez isto", painel (Visão com os dois casos),
// aviso de aparelho fraco como toast e celular. Uso (app rodando): node scripts/capture-launch.mjs [--base=…]
import { chromium } from "playwright";
import path from "node:path";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const out = (name) => path.join(import.meta.dirname, "..", "docs", "screenshots", `launch-${name}.png`);
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
const ready = (p) => p.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 90000 });

await page.goto(`${base}/crm-como-sistema?modo=3d`, { waitUntil: "networkidle" });
await ready(page);
await page.waitForTimeout(800);
await page.screenshot({ path: out("rooftop") });

await page.locator(".chapter-nav").getByRole("button", { name: "Brain" }).click();
await page.waitForSelector(".chapter--brain");
await page.waitForTimeout(1500);
await page.waitForSelector(".xp__reopen", { timeout: 8000 });
await page.locator(".xp__reopen").click();
await page.waitForSelector(".panel");
await page.waitForTimeout(500);
await page.screenshot({ path: out("panel-visao") });
await page.locator(".case-switch button").nth(1).click();
await page.waitForTimeout(300);
await page.locator(".panel .why").first().evaluate((d) => (d.open = true));
await page.screenshot({ path: out("panel-visao-marina") });

await page.locator(".chapter-nav").getByRole("button", { name: "Síntese" }).click();
try {
  await page.waitForSelector(".chapter--synthesis", { timeout: 15000 });
} catch (e) {
  await page.screenshot({ path: out("erro-sintese") });
  console.log("estado:", await page.evaluate(() => [window.scrollY, document.querySelector(".chapter")?.className, !!document.querySelector(".xp__perf")]));
  throw e;
}
await page.waitForTimeout(1500);
await page.screenshot({ path: out("sintese") });
await page.locator(".chapter").evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
await page.waitForTimeout(300);
await page.screenshot({ path: out("sintese-contato") });

const slow = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await slow.goto(`${base}/crm-como-sistema?lento=1`, { waitUntil: "networkidle" });
await slow.waitForSelector(".xp__perf", { timeout: 15000 });
await slow.screenshot({ path: out("aviso-toast") });
await slow.close();

const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const mob = await phone.newPage();
await mob.goto(`${base}/crm-como-sistema?modo=3d`, { waitUntil: "networkidle" });
await ready(mob);
await mob.locator(".chapter-nav").getByRole("button", { name: "Heart" }).click();
await mob.waitForSelector(".xp__reopen", { timeout: 8000 });
await mob.locator(".xp__reopen").click();
await mob.waitForSelector(".panel[data-snap]");
await mob.waitForTimeout(500);
await mob.screenshot({ path: out("phone-heart-half") });
await mob.getByRole("tab", { name: "Heart" }).click();
await mob.waitForTimeout(600);
await mob.screenshot({ path: out("phone-heart-full") });
// estudando, o cartão sai de cena no celular: fecha o painel antes de ir à síntese
await mob.locator(".panel__close").click();
await mob.locator(".chapter-nav").getByRole("button", { name: "Síntese" }).click();
await mob.waitForSelector(".chapter--synthesis");
await mob.waitForTimeout(1200);
await mob.screenshot({ path: out("phone-sintese") });
await phone.close();

await browser.close();
console.log("ok: launch-{rooftop,panel-visao,panel-visao-marina,sintese,sintese-contato,aviso-toast,phone-heart-half,phone-heart-full,phone-sintese}.png");
