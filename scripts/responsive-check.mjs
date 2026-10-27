// Auditoria de responsividade: prints por dispositivo + medidas automáticas.
// Uso (app rodando): node scripts/responsive-check.mjs [--base=http://localhost:3000] [--only=phone,tablet]
// Saída: docs/screenshots/resp-<dispositivo>-<momento>.png e docs/responsividade.json
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const base = arg("base", "http://localhost:3000");
const only = arg("only", "").split(",").filter(Boolean);
const root = path.join(import.meta.dirname, "..");
const shot = (name) => path.join(root, "docs", "screenshots", name);

const DEVICES = [
  { id: "phone-small", width: 360, height: 740, touch: true },
  { id: "phone", width: 390, height: 844, touch: true },
  { id: "phone-land", width: 844, height: 390, touch: true },
  { id: "tablet", width: 820, height: 1180, touch: true },
  { id: "tablet-land", width: 1180, height: 820, touch: true },
  { id: "laptop", width: 1280, height: 720, touch: false },
  { id: "desktop", width: 1920, height: 1080, touch: false },
];

/** medidas feitas dentro da página */
function audit() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || r.width === 0) return null;
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const overlap = (a, b) =>
    a && b ? Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)) : 0;
  const ui = {
    top: rect(".xp__top"),
    card: rect(".chapter"),
    panel: rect(".panel"),
    reopen: rect(".xp__reopen"),
    hint: rect(".xp__hint"),
  };
  // alvos de toque visíveis menores que 40 px (rótulos 3D contam)
  const small = [];
  for (const b of document.querySelectorAll(".xp button, .xp a")) {
    const r = b.getBoundingClientRect();
    const st = getComputedStyle(b);
    if (r.width === 0 || st.visibility === "hidden" || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
    if (b.closest("[data-hidden]")) continue;
    if (Math.min(r.width, r.height) < 40) small.push(`${(b.textContent || b.getAttribute("aria-label") || "?").trim().slice(0, 18)} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }
  // texto visível com corpo < 12 px
  let tiny = 0;
  for (const el of document.querySelectorAll(".xp *")) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.bottom < 0 || r.top > vh) continue;
    if (parseFloat(getComputedStyle(el).fontSize) < 12) tiny++;
  }
  // rótulos de área (no andar do capítulo) escondidos atrás do cartão ou do painel
  const inside = (p, b) => b && p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h;
  let labelsHidden = 0;
  for (const l of document.querySelectorAll(".cube-labels:not([data-hidden]) .cube-label")) {
    if (l.style.visibility === "hidden") continue;
    const r = l.getBoundingClientRect();
    const p = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    if (inside(p, ui.card) || inside(p, ui.panel)) labelsHidden++;
  }
  // quanto do prédio (canvas) fica livre de cartão/painel
  const covered = (overlap(ui.card, { x: 0, y: 0, w: vw, h: vh }) + overlap(ui.panel, { x: 0, y: 0, w: vw, h: vh })) / (vw * vh);
  return {
    overflowX: document.documentElement.scrollWidth > vw + 1,
    ui,
    overlaps: {
      cardPanel: overlap(ui.card, ui.panel),
      topCard: overlap(ui.top, ui.card),
      topPanel: overlap(ui.top, ui.panel),
      reopenCard: overlap(ui.reopen, ui.card),
    },
    sceneCovered: Math.round(covered * 100),
    labelsHidden,
    smallTargets: small.length,
    smallExamples: small.slice(0, 6),
    tinyText: tiny,
    fps: Math.round(window.__labFps ?? 0),
  };
}

const report = {};
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
for (const d of DEVICES) {
  if (only.length && !only.includes(d.id)) continue;
  const ctx = await browser.newContext({
    viewport: { width: d.width, height: d.height },
    hasTouch: d.touch,
    isMobile: d.touch && d.width < 900,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  // audita o 3D em todos os formatos (no celular ele é opcional; a leitura guiada tem teste próprio)
  await page.goto(`${base}/crm-como-sistema?modo=3d`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 90000 });
  const r = (report[d.id] = { size: `${d.width}×${d.height}`, moments: {} });

  const moment = async (name) => {
    await page.waitForTimeout(1600);
    await page.screenshot({ path: shot(`resp-${d.id}-${name}.png`) });
    r.moments[name] = await page.evaluate(audit);
  };
  const go = async (label) => {
    await page.locator(".chapter-nav").getByRole("button", { name: label }).click();
    await page.waitForTimeout(600);
  };

  await moment("rooftop");
  await go("Brain");
  await moment("brain");
  await go("Heart");
  await moment("heart");
  // Backbone com o painel fechado: no retrato, o cartão não pode cobrir o andar
  await go("Backbone");
  await moment("backbone");
  await go("Heart");
  // painel aberto no Heart (área guiada: Produto)
  const reopen = page.locator(".xp__reopen");
  if (await reopen.count()) await reopen.click();
  await moment("heart-panel");
  // glossário
  await page.locator(".chapter-nav").getByRole("button", { name: "Glossário" }).click();
  await moment("glossary");
  await page.keyboard.press("Escape");
  await go("Síntese");
  await moment("synthesis");
  r.errors = errors;
  await ctx.close();
  console.log(`✓ ${d.id}`);
}
await browser.close();
await writeFile(path.join(root, "docs", "responsividade.json"), JSON.stringify(report, null, 2));
console.log("relatório: docs/responsividade.json");
