// Prints do painel de estudo de uma área, aba por aba, com o "Entenda o porquê" aberto.
// Mostra o painel inteiro (sem rolagem) para revisar o texto de uma vez.
// Uso (app rodando): node scripts/capture-lesson.mjs --area=vendas [--base=http://localhost:3000]
import { chromium } from "playwright";
import path from "node:path";

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const base = arg("base", "http://localhost:3000");
const area = arg("area", "vendas");
const out = (name) => path.join(import.meta.dirname, "..", "docs", "screenshots", name);
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${base}/crm-como-sistema?modo=3d`, { waitUntil: "networkidle" });
await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });
await page.locator(".chapter-nav").getByRole("button", { name: "Brain" }).click();
await page.waitForSelector(".chapter--brain");
await page.waitForTimeout(1800);
await page.locator(`button[data-dept="${area}"]`).click();
await page.waitForSelector(".panel");
await page.waitForTimeout(600);
// primeira vista, como o aluno vê
await page.screenshot({ path: out(`lesson-${area}-brain-tela.png`) });

// painel inteiro: janela alta e painel sem rolagem interna. Continua fixo: se
// crescesse dentro da página, a rolagem mudaria de capítulo
await page.setViewportSize({ width: 1440, height: 3600 });
await page.addStyleTag({
  content: ".panel{height:auto!important;max-height:none!important;bottom:auto!important}.panel__body{overflow:visible!important;max-height:none!important}",
});
await page.waitForTimeout(600);
for (const tab of ["Visão", "Brain", "Heart", "Backbone"]) {
  await page.getByRole("tab", { name: tab }).click();
  if ((await page.getByRole("tab", { selected: true }).innerText()).toLowerCase() !== tab.toLowerCase())
    throw new Error(`aba ${tab} não ficou selecionada`);
  await page.waitForTimeout(500);
  for (const d of await page.locator(".panel details").all()) await d.evaluate((el) => (el.open = true));
  await page.waitForTimeout(200);
  const name = tab === "Visão" ? "visao" : tab.toLowerCase();
  await page.locator(".panel").screenshot({ path: out(`lesson-${area}-${name}.png`) });
}

await browser.close();
console.log(`ok: lesson-${area}-{brain-tela,visao,brain,heart,backbone}.png`);
