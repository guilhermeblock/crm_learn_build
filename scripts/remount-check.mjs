// Teste de vazamento: desmonta e remonta a cena N vezes e compara listeners,
// canvases, heap JS e avisos de contexto WebGL antes/depois.
// Uso (com o app rodando): node scripts/remount-check.mjs [--times=20] [--base=http://localhost:3000]
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;
const base = flag("base", "http://localhost:3000");
const times = Number(flag("times", "20"));

const browser = await chromium.launch({
  headless: true,
  args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const messages = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") messages.push(`${m.type()}: ${m.text()}`);
});
page.on("pageerror", (e) => messages.push(`pageerror: ${e}`));

const cdp = await page.context().newCDPSession(page);
await cdp.send("HeapProfiler.enable");

async function waitFrames() {
  await page.evaluate(() => (window.__labFrames = 0));
  await page.waitForFunction(() => (window.__labFrames ?? 0) > 20, null, { timeout: 60000 });
}

async function snapshot() {
  await cdp.send("HeapProfiler.collectGarbage");
  await cdp.send("HeapProfiler.collectGarbage");
  const { usedSize } = await cdp.send("Runtime.getHeapUsage");
  const count = async (expr) => {
    const { result } = await cdp.send("Runtime.evaluate", { expression: expr });
    const { listeners } = await cdp.send("DOMDebugger.getEventListeners", { objectId: result.objectId });
    return listeners.length;
  };
  return {
    heapMB: Math.round((usedSize / 1048576) * 10) / 10,
    windowListeners: await count("window"),
    documentListeners: await count("document"),
    canvases: await page.evaluate(() => document.querySelectorAll("canvas").length),
  };
}

await page.goto(`${base}/lab/building?instant=1`, { waitUntil: "networkidle" });
await waitFrames();
// uma remontagem de aquecimento (caches de shader/módulos entram no "antes")
await page.click('button[data-action="remount"]');
await waitFrames();
const before = await snapshot();

for (let i = 0; i < times; i++) {
  await page.click('button[data-action="remount"]');
  await waitFrames();
}
const after = await snapshot();
await browser.close();

const contextWarnings = messages.filter((m) => /webgl context|too many active/i.test(m));
const errors = messages.filter((m) => m.startsWith("error") || m.startsWith("pageerror"));
const ok =
  after.windowListeners === before.windowListeners &&
  after.documentListeners === before.documentListeners &&
  after.canvases === 1 &&
  after.heapMB - before.heapMB < 8 &&
  contextWarnings.length === 0 &&
  errors.length === 0;

console.log(JSON.stringify({ remounts: times, before, after, contextWarnings, errors }, null, 2));
console.log(ok ? "✓ sem vazamento detectado" : "✗ possível vazamento");
process.exitCode = ok ? 0 : 1;
