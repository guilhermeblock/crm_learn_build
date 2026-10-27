// Imagens da leitura guiada do celular: o prédio em cada momento, gerado do próprio 3D.
// Uso (app rodando): node scripts/guide-images.mjs [--base=http://localhost:3000]
// Saída: public/guia/{rooftop,brain,heart,backbone,synthesis}{,-sm}.jpg (1040×680 e 520×340)
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const dir = path.join(import.meta.dirname, "..", "public", "guia");
mkdirSync(dir, { recursive: true });

// janela quase quadrada: a câmera não abre espaço para o cartão (sem deslocamento lateral);
// o recorte do meio vira a imagem 1040×680
const W = 1040;
const H = 680;
// um pouco mais larga que a imagem: as placas da empena (BRAIN, HEART…) entram inteiras
const VIEW_W = 1240;
const VIEW_H = 1156;
const CLIP_X = 0;
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: VIEW_W, height: VIEW_H }, deviceScaleFactor: 1 });
await page.goto(`${base}/crm-como-sistema?modo=3d`, { waitUntil: "networkidle" });
await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 90000 });
// a interface some só durante o print (a navegação precisa dela visível)
await page.addStyleTag({
  // cada rótulo recebe visibility inline por frame: esconder também o rótulo, não só o grupo
  content: `html.shot :is(.xp__top, .chapter-wrap, .xp__hint, .xp__perf, .xp__reopen, .cube-labels,
    .cube-label, .station-labels, .station-label, .xp__progress, .skip-link) { visibility: hidden !important; }
    html.shot .xp__stage::after { display: none !important; }`,
});
const hideUi = (on) => page.evaluate((v) => document.documentElement.classList.toggle("shot", v), on);

/** reduz para a metade num canvas do próprio navegador (JPEG) */
async function half(buf) {
  const url = `data:image/jpeg;base64,${buf.toString("base64")}`;
  const out = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width / 2;
    c.height = img.height / 2;
    const g = c.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.8).split(",")[1];
  }, url);
  return Buffer.from(out, "base64");
}

async function shoot(name) {
  await page.waitForTimeout(2400);
  await hideUi(true);
  await page.waitForTimeout(100);
  const buf = await page.screenshot({
    type: "jpeg",
    quality: 82,
    clip: { x: CLIP_X, y: Math.round((VIEW_H - H) / 2), width: W, height: H },
  });
  await hideUi(false);
  writeFileSync(path.join(dir, `${name}.jpg`), buf);
  writeFileSync(path.join(dir, `${name}-sm.jpg`), await half(buf));
  console.log("✓", name);
}

const go = async (label) => {
  await page.locator(".chapter-nav").getByRole("button", { name: label }).click();
};

await shoot("rooftop");
await go("Brain");
await page.waitForTimeout(1500);
// o percurso guiado escolhe uma área ao chegar no Brain: Esc solta (imagem neutra)
await page.keyboard.press("Escape");
await shoot("brain");
await go("Heart");
await shoot("heart");
await go("Backbone");
await shoot("backbone");
await go("Síntese");
await shoot("synthesis");
await browser.close();
