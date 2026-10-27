// Captura as três vistas do laboratório e registra FPS + erros de console.
// Uso: com o app rodando (npm run dev ou npm start), em outro terminal:
//   node scripts/capture.mjs [prefixo] [--size=1440x900] [--base=http://localhost:3000]
//                            [--views=overview,heart] [--frames=N]  (N quadros a cada 350 ms)
//                            [--select=produto] [--focus=vendas]  (estados de seleção / foco de teclado)
//                            [--uncapped]  (desliga o vsync para medir a folga real de FPS)
// Saída: docs/screenshots/<prefixo>-<vista>.png e docs/screenshots/<prefixo>-report.json
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name, fallback) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const prefix = args.find((a) => !a.startsWith("--")) ?? "capture";
const [width, height] = flag("size", "1440x900").split("x").map(Number);
const base = flag("base", "http://localhost:3000");
const views = flag("views", "overview,rooftop,heart").split(",");
const frames = Number(flag("frames", "1"));
const select = flag("select", "");
const focus = flag("focus", "");
const uncapped = args.includes("--uncapped");
const outDir = path.join(root, "docs", "screenshots");

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    "--ignore-gpu-blocklist",
    "--enable-gpu",
    "--use-angle=d3d11",
    "--enable-unsafe-swiftshader",
    ...(uncapped ? ["--disable-gpu-vsync", "--disable-frame-rate-limit"] : []),
  ],
});

const report = { size: `${width}x${height}`, uncapped, renderer: null, views: {}, errors: [] };

for (const view of views) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      report.errors.push({ view, type: msg.type(), text: msg.text() });
    }
  });
  page.on("pageerror", (err) => report.errors.push({ view, type: "pageerror", text: String(err) }));

  const query = `view=${view}&ui=0&instant=1${select ? `&select=${select}` : ""}`;
  await page.goto(`${base}/lab/building?${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });
  if (focus) {
    await page.focus(`button[data-dept="${focus}"]`);
    await page.waitForTimeout(400);
  }

  if (!report.renderer) {
    report.renderer = await page.evaluate(() => {
      const gl = document.querySelector("canvas")?.getContext("webgl2");
      const ext = gl?.getExtension("WEBGL_debug_renderer_info");
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "desconhecido";
    });
  }

  // amostra FPS por ~3 s
  const samples = [];
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(500);
    samples.push(await page.evaluate(() => window.__labFps ?? 0));
  }
  const fps = samples.reduce((a, b) => a + b, 0) / samples.length;
  report.views[view] = { fps: Math.round(fps * 10) / 10 };

  for (let f = 0; f < frames; f++) {
    if (f > 0) await page.waitForTimeout(350);
    const suffix = frames > 1 ? `-f${f + 1}` : "";
    const file = path.join(outDir, `${prefix}-${view}${suffix}.png`);
    await page.screenshot({ path: file });
    console.log(`✓ ${view}${suffix}: ${file} (${report.views[view].fps} fps)`);
  }
  await page.close();
}

await browser.close();
await writeFile(path.join(outDir, `${prefix}-report.json`), JSON.stringify(report, null, 2));
console.log(`renderer: ${report.renderer}`);
if (report.errors.length) {
  console.log(`⚠ ${report.errors.length} mensagens de console:`);
  for (const e of report.errors) console.log(`  [${e.view}] ${e.type}: ${e.text}`);
  process.exitCode = 1;
}
