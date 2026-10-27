// Captura a experiência /crm-como-sistema no repouso de cada capítulo.
// Uso (app rodando): node scripts/capture-experience.mjs [prefixo] [--base=http://localhost:3000]
//   [--size=1440x900] [--chapters=rooftop,reveal,brain,heart,backbone,synthesis]
//   [--panel]          abre o painel da área acompanhada em cada andar
//   [--select=vendas]  seleciona uma área antes (pela lista "Ver áreas")
//   [--reduced]        emula prefers-reduced-motion
//   [--nowebgl]        desliga WebGL (testa o fallback em texto)
//   [--uncapped]       desliga o vsync (folga real de FPS)
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const has = (name) => args.includes(`--${name}`);
const prefix = args.find((a) => !a.startsWith("--")) ?? "xp";
const base = flag("base", "http://localhost:3000");
const [width, height] = flag("size", "1440x900").split("x").map(Number);
const ALL = ["rooftop", "reveal", "brain", "heart", "backbone", "synthesis"];
const chapters = flag("chapters", ALL.join(",")).split(",");
const select = flag("select", "");
const outDir = path.join(root, "docs", "screenshots");

// mesmo ritmo de src/experience/cameraPath.ts
const HOLD = 0.35;
const MOVE = 1;
const LENGTH = (ALL.length - 1) * (HOLD + MOVE) + HOLD;
const rest = (k) => Math.min(1, (k * (HOLD + MOVE) + HOLD / 2) / LENGTH);

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: has("nowebgl")
    ? ["--disable-webgl", "--disable-3d-apis"]
    : [
        "--ignore-gpu-blocklist",
        "--enable-gpu",
        "--use-angle=d3d11",
        ...(has("uncapped") ? ["--disable-gpu-vsync", "--disable-frame-rate-limit"] : []),
      ],
});
const context = await browser.newContext({
  viewport: { width, height },
  reducedMotion: has("reduced") ? "reduce" : "no-preference",
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e}`));

await page.goto(`${base}/crm-como-sistema`, { waitUntil: "networkidle" });

if (has("nowebgl")) {
  await page.waitForTimeout(800);
  const file = path.join(outDir, `${prefix}-fallback.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✓ fallback: ${file}`);
} else {
  await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });
  const report = {};
  for (const id of chapters) {
    const k = ALL.indexOf(id);
    await page.evaluate((p) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * p, behavior: "instant" });
    }, rest(k));
    await page.waitForTimeout(1800); // scrub (0.6 s) + entrada do texto
    if (has("uncapped")) await page.waitForTimeout(1500); // janela de medição de FPS
    if (select && id === chapters[0]) {
      await page.getByRole("button", { name: "Ver áreas" }).click();
      await page.locator(".area-index").getByRole("button", { name: new RegExp(select, "i") }).first().click();
      await page.waitForTimeout(900);
    }
    if (has("panel") && ["brain", "heart", "backbone", "synthesis"].includes(id)) {
      const open = page.locator(".xp__reopen");
      if (await open.isVisible()) await open.click();
      if (id === "heart") {
        const chip = page.locator(".segmented button").nth(1);
        if (await chip.isVisible()) await chip.click();
      }
      await page.waitForTimeout(500);
    }
    report[id] = await page.evaluate(() => ({
      fps: Math.round((window.__labFps ?? 0) * 10) / 10,
      chapter: document.querySelector(".chapter")?.className,
    }));
    const file = path.join(outDir, `${prefix}-${id}.png`);
    await page.screenshot({ path: file });
    console.log(`✓ ${id}: ${file} (${report[id].fps} fps)`);
    if (has("panel")) {
      const close = page.locator(".panel__close");
      if (await close.isVisible()) await close.click();
    }
  }
  await writeFile(path.join(outDir, `${prefix}-report.json`), JSON.stringify({ size: `${width}x${height}`, report, errors }, null, 2));
}

await browser.close();
const relevant = errors.filter((e) => !/THREE\.Clock|X4122/.test(e));
if (relevant.length) {
  console.log(`⚠ ${relevant.length} mensagens de console:`);
  for (const e of relevant) console.log(`  ${e.slice(0, 220)}`);
  process.exitCode = 1;
}
