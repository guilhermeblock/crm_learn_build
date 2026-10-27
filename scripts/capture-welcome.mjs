// Prints da boas-vindas: computador (formulário e dica), celular e página de privacidade.
// Uso (app rodando): node scripts/capture-welcome.mjs [--base=http://localhost:3000]
import { chromium } from "playwright";
import path from "node:path";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const out = (name) => path.join(import.meta.dirname, "..", "docs", "screenshots", `welcome-${name}.png`);
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });

const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desk.goto(`${base}/crm-como-sistema?boasvindas=1&nome=rafael`, { waitUntil: "networkidle" });
await desk.waitForSelector(".welcome");
await desk.waitForTimeout(800);
await desk.screenshot({ path: out("desktop") });
await desk.locator(".welcome input[name=email]").fill("rafael@empresa.com.br");
await desk.locator(".welcome__level", { hasText: "Uso no dia a dia" }).click();
await desk.screenshot({ path: out("desktop-preenchido") });
await desk.getByRole("button", { name: "Entrar no prédio" }).click();
await desk.waitForSelector(".welcome__tip");
await desk.waitForTimeout(300);
await desk.screenshot({ path: out("desktop-dica") });
await desk.goto(`${base}/privacidade`, { waitUntil: "networkidle" });
await desk.screenshot({ path: out("privacidade"), fullPage: true });

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const mob = await ctx.newPage();
await mob.goto(`${base}/crm-como-sistema?boasvindas=1`, { waitUntil: "networkidle" });
await mob.waitForSelector(".welcome");
await mob.waitForTimeout(600);
await mob.screenshot({ path: out("celular") });
await mob.locator(".welcome").evaluate((el) => el.scrollTo(0, el.scrollHeight));
await mob.waitForTimeout(300);
await mob.screenshot({ path: out("celular-fim") });

await browser.close();
console.log("ok: welcome-{desktop,desktop-preenchido,desktop-dica,privacidade,celular,celular-fim}.png");
