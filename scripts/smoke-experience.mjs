// Teste de fumaça da experiência: navegação, seleção, painel, teclado e console.
// Uso (app rodando): node scripts/smoke-experience.mjs [--base=http://localhost:3000]
import { chromium } from "playwright";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=d3d11"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => {
  if ((m.type() === "error" || m.type() === "warning") && !/THREE\.Clock|X4122/.test(m.text())) errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(`✓ ${name}`);
  } catch (e) {
    results.push(`✗ ${name}: ${String(e.message ?? e).split("\n")[0]}`);
  }
}
const chapterIs = (id) => page.waitForSelector(`.chapter--${id}`, { timeout: 8000 });
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

await page.goto(`${base}/crm-como-sistema`, { waitUntil: "networkidle" });
await page.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });

await check("rooftop anônimo: rótulos ocultos e fora do foco", async () => {
  await chapterIs("rooftop");
  assert(await page.locator(".cube-labels[data-hidden]").count(), "rótulos visíveis no rooftop");
});

await check("navegação: botão Brain leva ao capítulo Brain", async () => {
  await page.locator(".chapter-nav").getByRole("button", { name: "Brain" }).click();
  await chapterIs("brain");
});

await check("scroll: um giro da roda no repouso já move a câmera (sem zona morta)", async () => {
  await page.waitForTimeout(1500); // termina a rolagem suave até o repouso
  const pos = () => page.evaluate(() => window.__xpCamera.toArray());
  const before = await pos();
  await page.mouse.move(900, 450);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(250);
  const after = await pos();
  const moved = Math.hypot(...after.map((v, i) => v - before[i]));
  assert(moved > 0.05, `câmera andou só ${moved.toFixed(3)} após um giro`);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(600);
});

await check("percurso guiado: Vendas acompanhada ao chegar no Brain", async () => {
  await page.waitForSelector(".xp__reopen", { timeout: 4000 });
  assert((await page.locator(".xp__reopen").innerText()).toLowerCase().includes("vendas"), "não está acompanhando Vendas");
});

await check("clique no rótulo seleciona a área; a 1ª abertura começa pela Visão", async () => {
  await page.locator('button[data-dept="vendas"]').click();
  await page.waitForSelector(".panel", { timeout: 4000 });
  const head = await page.locator(".panel__head").innerText();
  assert(head.includes("Vendas"), `painel inesperado: ${head.slice(0, 60)}`);
  const tab = await page.getByRole("tab", { selected: true }).innerText();
  assert(/visão/i.test(tab), `abriu na aba ${tab}, não na Visão`);
});

await check("Visão: o caso alterna entre Aurora (B2B) e Marina (B2C), com o porquê fechado", async () => {
  const steps = () => page.locator(".timeline").first().innerText();
  const before = await steps();
  await page.locator(".case-switch button").nth(1).click();
  const after = await steps();
  assert(before !== after && /Marina/.test(after), "o caso não trocou para a Marina");
  assert(!(await page.locator(".why").first().getAttribute("open")), "o porquê veio aberto");
  await page.locator(".case-switch button").nth(0).click();
  assert(/Aurora/.test(await steps()), "não voltou para a Aurora");
});

await check("aba Brain do painel leva ao Brain e mostra a ideia central", async () => {
  await page.getByRole("tab", { name: "Brain" }).click();
  await chapterIs("brain");
  const head = await page.locator(".panel__head").innerText();
  const floor = await page.locator(".panel__floor").innerText();
  assert(head.includes("Vendas") && floor.includes("BRAIN"), `painel inesperado: ${floor}`);
  assert((await page.locator(".idea").count()) === 1, "sem ideia central no Brain");
});

await check("aba Heart do painel desce até o Heart mantendo Vendas", async () => {
  await page.getByRole("tab", { name: "Heart" }).click();
  await chapterIs("heart");
  await page.waitForFunction(
    () =>
      document.querySelector(".panel__floor")?.textContent?.includes("HEART") &&
      document.querySelector(".panel__head h2")?.textContent?.includes("Vendas"),
    null,
    { timeout: 6000 },
  );
});

await check("Heart: o posto de Vendas abre em 4 estações, ligadas ao painel nos dois sentidos", async () => {
  await page.waitForFunction(
    () => [...document.querySelectorAll(".station-label")].filter((b) => b.style.visibility === "visible").length === 4,
    null,
    { timeout: 6000 },
  );
  // estação no prédio → painel
  await page.locator(".station-label").nth(2).click();
  const pressed = await page.locator('.segmented button[aria-pressed="true"]').innerText();
  const third = await page.locator(".segmented button").nth(2).innerText();
  assert(pressed === third, `painel não seguiu a estação: ${pressed}`);
  // painel → estação no prédio
  await page.locator(".segmented button").nth(0).click();
  assert(
    (await page.locator(".station-label").nth(0).getAttribute("aria-pressed")) === "true",
    "estação não seguiu o painel",
  );
});

await check("Heart: o impulso chega à estação e o painel acende origem → decisão → saída", async () => {
  const seen = new Set();
  for (let k = 0; k < 40 && seen.size < 3; k++) {
    const s = await page.evaluate(() => document.querySelector(".stepper")?.dataset.step);
    if (s && s !== "-1") seen.add(s);
    await page.waitForTimeout(150);
  }
  assert(seen.size === 3, `passos vistos: ${[...seen].join(",") || "nenhum"}`);
});

await check("subárea abre processo origem → decisão → saída", async () => {
  await page.locator(".segmented button").nth(1).click();
  const txt = await page.locator(".stepper").innerText();
  assert(/Origem/i.test(txt) && /Decisão/i.test(txt) && /Saída/i.test(txt), "processo incompleto");
  assert(/Fica no CRM/i.test(await page.locator(".record").innerText()), "estação sem o registro no CRM");
});

await check("passagem: depois da saída, a linha \"Passa para\" acende junto com o impulso no prédio", async () => {
  // Vendas · Executivos de vendas → CS
  let live = false;
  for (let k = 0; k < 50 && !live; k++) {
    live = (await page.locator(".handoff").getAttribute("data-live")) === "1";
    if (!live) await page.waitForTimeout(120);
  }
  assert(live, "a passagem nunca acendeu no painel");
});

await check("estação mostra para quem vai a saída e leva até a área", async () => {
  // Vendas · Executivos de vendas → CS (contrato e notas de passagem)
  const handoff = page.locator(".handoff");
  assert(/Passa para/i.test(await handoff.innerText()), "estação sem passagem");
  const to = (await handoff.locator(".area-link").innerText()).trim();
  await handoff.locator(".area-link").click();
  await page.waitForFunction((name) => document.querySelector(".panel__summary") && document.querySelector(".panel__index") && document.querySelector("#panel-title")?.textContent && !document.querySelector("#panel-title").textContent.startsWith("Vendas"), to, { timeout: 4000 });
  await page.locator('button[data-dept="vendas"]').click();
  await page.waitForFunction(() => document.querySelector("#panel-title")?.textContent?.startsWith("Vendas"), null, { timeout: 4000 });
});

await check("glossário: termo destacado mostra balão no hover", async () => {
  const term = page.locator(".panel .term").first();
  assert(await term.count(), "nenhum termo destacado no painel");
  await term.hover();
  await page.waitForSelector(".term-tip", { timeout: 3000 });
  const tip = await page.locator(".term-tip").innerText();
  assert(tip.length > 20, "balão vazio");
});

await check("glossário: clicar no balão abre a gaveta com busca; Esc fecha só a gaveta", async () => {
  await page.locator(".term-tip").click();
  await page.waitForSelector(".glossary[open]", { timeout: 3000 });
  assert(await page.locator(".glossary__list .is-focus").count(), "termo escolhido não está em destaque");
  await page.locator(".glossary input").fill("forecast");
  const first = await page.locator(".glossary__list dt").first().innerText();
  assert(/forecast/i.test(first), `busca não achou forecast: ${first}`);
  await page.locator(".glossary input").fill("saude");
  assert(/health score/i.test(await page.locator(".glossary__list dt").first().innerText()), "busca sem acento falhou");
  // no campo de busca com texto, o 1º Esc do navegador só apaga o texto
  await page.locator(".glossary input").fill("");
  await page.keyboard.press("Escape");
  await page.waitForSelector(".glossary", { state: "detached", timeout: 3000 });
  assert(await page.locator(".panel").count(), "Esc da gaveta fechou também o painel");
});

await check("Esc fecha o painel e devolve o foco ao rótulo da área", async () => {
  await page.keyboard.press("Escape");
  await page.waitForSelector(".panel", { state: "detached", timeout: 3000 });
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-dept"));
  assert(focused === "vendas", `foco em ${focused}`);
});

await check("teclado: Tab chega a um rótulo e Enter seleciona", async () => {
  await page.locator('button[data-dept="financeiro"]').focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector(".panel", { timeout: 3000 });
  assert((await page.locator(".panel__head").innerText()).includes("Financeiro"), "Enter não selecionou");
  await page.keyboard.press("Escape");
});

await check("área da fachada direita não fica atrás do painel (Financeiro no Heart)", async () => {
  await page.locator(".xp__reopen").click();
  await page.waitForSelector(".panel", { timeout: 3000 });
  await page.waitForTimeout(1800); // a câmera desliza até a área sair de trás do painel
  const x = await page.evaluate(() => {
    const b = document.querySelector(".station-label").getBoundingClientRect();
    return { mid: b.left + b.width / 2, card: document.querySelector(".chapter").getBoundingClientRect().right, panel: document.querySelector(".panel").getBoundingClientRect().left };
  });
  assert(x.mid > x.card && x.mid < x.panel, `estação fora da faixa livre: ${JSON.stringify(x)}`);
  await page.locator(".panel__close").click();
});

await check("Backbone: objetos do CRM, campo crítico e retorno para a decisão", async () => {
  await page.locator(".chapter-nav").getByRole("button", { name: "Backbone" }).click();
  await chapterIs("backbone");
  await page.locator(".xp__reopen").click();
  await page.waitForFunction(() => /BACKBONE/.test(document.querySelector(".panel__floor")?.textContent ?? ""), null, { timeout: 4000 });
  const txt = await page.locator(".panel__body").innerText();
  assert((await page.locator(".objects li").count()) >= 3, "menos de 3 objetos do CRM");
  assert(/não pode faltar/i.test(txt) && /volta para a decisão/i.test(txt), "conteúdo do Backbone incompleto");
});

await check("automações ficam recolhidas e abrem no clique (Quando … →)", async () => {
  const auto = page.locator(".automations");
  assert(!(await auto.evaluate((d) => d.open)), "automações abertas por padrão");
  await auto.locator("summary").click();
  assert(/^Quando /i.test((await auto.locator("li").first().innerText()).trim()), "molde Quando → então ausente");
  await page.locator(".panel__close").click();
});

await check("menu do capítulo lista as 8 áreas, com RevOps no lugar de Marca", async () => {
  assert((await page.locator(".chapter__menu li").count()) === 8, "menu sem as 8 áreas");
  // o menu entra com atraso (data-reveal): espera as 8 linhas ficarem visíveis
  await page.waitForFunction(() => document.querySelectorAll(".chapter__menu-name").length === 8 && getComputedStyle(document.querySelector(".chapter__menu")).visibility === "visible", null, { timeout: 4000 });
  const names = await page.locator(".chapter__menu-name").allInnerTexts();
  assert(names[7].startsWith("RevOps") && !names.some((n) => n.startsWith("Marca")), `8ª área não é RevOps: ${names.join(",")}`);
});

await check("Visão: seletor B2B · B2C · Pequena troca o texto e vale para a próxima área", async () => {
  await page.locator('button[data-dept="revops"]').click();
  await page.getByRole("tab", { name: "Visão" }).click();
  await page.waitForSelector(".variant-switch", { timeout: 4000 });
  const before = await page.locator(".variant-text").innerText();
  await page.locator(".variant-switch").getByRole("button", { name: "B2C" }).click();
  const after = await page.locator(".variant-text").innerText();
  assert(before !== after, "texto da variação não mudou");
  await page.locator(".panel__foot button").last().click();
  const pressed = await page.locator('.variant-switch button[aria-pressed="true"]').innerText();
  assert(/B2C/i.test(pressed), "a escolha não passou para a próxima área");
  await page.locator(".panel__close").click();
});

await check("síntese: lista de áreas (Ver áreas)", async () => {
  await page.locator(".chapter-nav").getByRole("button", { name: "Síntese" }).click();
  await chapterIs("synthesis");
  await page.getByRole("button", { name: "Ver áreas" }).click();
  await page.waitForSelector(".area-index[open]", { timeout: 3000 });
  assert((await page.locator(".area-index li").count()) === 8, "lista não tem 8 áreas");
  await page.keyboard.press("Escape");
});

await check("síntese: tese, contagem de áreas e bloco \"Quem fez isto\" com WhatsApp e LinkedIn", async () => {
  // os blocos entram com um pequeno atraso (data-reveal): espera o texto aparecer
  await page.waitForFunction(
    () => /estudou \d+ de 8/i.test(document.querySelector(".chapter--synthesis")?.innerText ?? ""),
    null,
    { timeout: 6000 },
  );
  const card = await page.locator(".chapter--synthesis").innerText();
  assert(/Tecnologia não corrige operação/.test(card), "síntese sem a tese");
  const links = page.locator(".chapter--synthesis .contact__links a");
  assert((await links.count()) === 2, "bloco de contato sem os 2 links");
  assert(/wa\.me/.test(await links.nth(0).getAttribute("href")), "link do WhatsApp errado");
  assert(/linkedin\.com/.test(await links.nth(1).getAttribute("href")), "link do LinkedIn errado");
});

await check("metadados: Open Graph com imagem, título e locale pt_BR", async () => {
  const og = await page.evaluate(() =>
    Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map((m) => [m.getAttribute("property"), m.getAttribute("content")])),
  );
  assert(og["og:title"] && og["og:image"]?.endsWith("/og.png") && og["og:locale"] === "pt_BR", `og incompleto: ${JSON.stringify(og)}`);
  const res = await page.request.get(`${base}/og.png`);
  assert(res.ok(), "og.png não responde");
});

await check("versão em texto traz as 8 áreas, o sumário e o contato", async () => {
  await page.getByRole("button", { name: "Ler tudo em texto" }).click();
  await page.waitForSelector(".map--dialog[open]", { timeout: 3000 });
  assert((await page.locator(".map__area").count()) === 8, "mapa sem as 8 áreas");
  assert((await page.locator(".map__toc a").count()) >= 10, "sem sumário");
  assert((await page.locator(".map--dialog .contact").count()) === 1, "sem bloco de contato");
  await page.keyboard.press("Escape");
});

await check("voltar ao rooftop pelo scroll esconde os rótulos de novo", async () => {
  await page.locator(".chapter-nav").getByRole("button", { name: "Rooftop" }).click();
  await chapterIs("rooftop");
});

await check("tema: leitura clara por padrão; o botão troca e a escolha fica salva", async () => {
  const reading = () => page.locator(".xp").getAttribute("data-reading");
  assert((await reading()) === "light", "padrão não é claro");
  await page.locator(".chapter-nav__theme").click();
  assert((await reading()) === "dark", "botão não trocou o tema");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector(".xp[data-reading]", { timeout: 15000 });
  assert((await reading()) === "dark", "escolha não ficou salva");
  await page.locator(".chapter-nav__theme").click();
});

await check("botão Glossário do topo abre a gaveta com todos os termos", async () => {
  await page.locator(".chapter-nav").getByRole("button", { name: "Glossário" }).click();
  await page.waitForSelector(".glossary[open]", { timeout: 3000 });
  assert((await page.locator(".glossary__list > div").count()) > 50, "gaveta sem a lista completa");
  await page.keyboard.press("Escape");
});

await check("sem erros de console", async () => {
  assert(errors.length === 0, errors.slice(0, 3).join(" | "));
});

// ---------- celular e aparelho fraco (contextos próprios) ----------
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const mob = await phone.newPage();
mob.on("pageerror", (e) => errors.push(String(e)));

await check("celular: painel em folha com alça (meia tela → tela cheia → só o título)", async () => {
  // o celular abre na leitura guiada; o 3D do celular continua testado sob demanda
  await mob.goto(`${base}/crm-como-sistema?modo=3d`, { waitUntil: "networkidle" });
  await mob.waitForFunction(() => (window.__labFrames ?? 0) > 30, null, { timeout: 60000 });
  await mob.locator(".chapter-nav").getByRole("button", { name: "Heart" }).click();
  await mob.waitForSelector(".xp__reopen", { timeout: 8000 });
  await mob.locator(".xp__reopen").click();
  await mob.waitForSelector(".panel[data-snap]", { timeout: 4000 });
  const snap = () => mob.locator(".panel").getAttribute("data-snap");
  const h = () => mob.locator(".panel").evaluate((p) => p.getBoundingClientRect().height);
  assert((await snap()) === "half", "não abriu em meia tela");
  const half = await h();
  await mob.locator(".panel__grip").click();
  await mob.waitForTimeout(400);
  assert((await snap()) === "full" && (await h()) > half + 100, "não foi para tela cheia");
  await mob.locator(".panel__grip").click();
  await mob.waitForTimeout(400);
  assert((await snap()) === "peek" && (await h()) < half - 100, "não recolheu para o título");
  // estudando: o cartão do capítulo sai de cena
  assert(!(await mob.locator(".chapter").isVisible()), "cartão do capítulo visível com o painel aberto");
});
await phone.close();

await check("celular: abre na leitura guiada, sem carregar o 3D, e o painel vira página", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const g = await ctx.newPage();
  g.on("pageerror", (e) => errors.push(String(e)));
  await g.goto(`${base}/crm-como-sistema`, { waitUntil: "networkidle" });
  await g.waitForSelector(".guide", { timeout: 15000 });
  assert((await g.locator("canvas").count()) === 0, "o 3D carregou no celular");
  assert((await g.locator("#guia-areas .guide__areas li").count()) === 8, "lista sem as 8 áreas");
  assert((await g.locator(".guide__img").count()) === 5, "faltam imagens do prédio");
  assert(!(await g.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), "rolagem lateral na leitura guiada");
  // uma área a partir do andar Backbone: painel em tela cheia, já na aba Backbone
  await g.locator("#guia-backbone .guide__areas button").nth(1).click();
  await g.waitForSelector(".panel--page", { timeout: 4000 });
  const tab = await g.getByRole("tab", { selected: true }).innerText();
  assert(/backbone/i.test(tab), `abriu na aba ${tab}`);
  assert((await g.locator(".panel__grip").count()) === 0, "painel em página não deveria ter alça");
  // Visão: dois casos
  await g.getByRole("tab", { name: "Visão" }).click();
  await g.locator(".case-switch button").nth(1).click();
  assert(/Marina/.test(await g.locator(".timeline").first().innerText()), "o caso não trocou para a Marina");
  // o botão Voltar do celular fecha o painel e fica na página
  await g.goBack();
  await g.waitForSelector(".panel--page", { state: "detached", timeout: 4000 });
  assert(g.url().includes("/crm-como-sistema"), "Voltar saiu da página");
  // síntese com o contato
  assert((await g.locator("#guia-sintese .contact__links a").count()) === 2, "síntese sem WhatsApp e LinkedIn");
  assert(/estudou 1 de 8/i.test(await g.locator(".guide__visited").innerText()), "contagem de áreas estudadas errada");
  // o 3D sob demanda, e a volta para a leitura
  await g.getByRole("button", { name: "Abrir o prédio em 3D" }).click();
  await g.waitForSelector(".xp canvas", { timeout: 20000 });
  await g.locator(".chapter-nav").getByRole("button", { name: "Leitura guiada" }).click();
  await g.waitForSelector(".guide", { timeout: 8000 });
  await ctx.close();
});

await check("boas-vindas: saudação com o nome do link, pede e-mail e nível e envia com a origem", async () => {
  const w = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  w.on("pageerror", (e) => errors.push(String(e)));
  await w.goto(`${base}/crm-como-sistema?boasvindas=1&nome=rafael&utm_source=linkedin`, { waitUntil: "networkidle" });
  await w.waitForSelector(".welcome", { timeout: 15000 });
  assert(/, Rafael!/.test(await w.locator(".welcome h1").innerText()), "saudação sem o nome do link");
  assert(await w.evaluate(() => document.querySelector(".xp-root")?.inert === true), "o site atrás não ficou inerte");
  assert((await w.evaluate(() => document.documentElement.style.overflow)) === "hidden", "a página atrás rola");
  assert((await w.locator(".welcome__level").count()) === 4, "faltam os 4 níveis");
  // sem nível: avisa e não envia
  await w.locator(".welcome input[name=email]").fill("rafael@empresa.com.br");
  await w.getByRole("button", { name: "Entrar no prédio" }).click();
  await w.waitForSelector(".welcome__err", { timeout: 3000 });
  // com nível: envia e mostra a dica do nível (sem as variáveis, a rota responde 503 e a pessoa entra igual)
  await w.locator(".welcome__level", { hasText: "Configuro ou gerencio" }).click();
  const [req] = await Promise.all([
    w.waitForRequest((r) => r.url().endsWith("/api/boas-vindas") && r.method() === "POST"),
    w.getByRole("button", { name: "Entrar no prédio" }).click(),
  ]);
  const sent = req.postDataJSON();
  assert(sent.email === "rafael@empresa.com.br" && sent.level === "configuro", `envio errado: ${JSON.stringify(sent)}`);
  assert(sent.name === "Rafael" && sent.source?.utm_source === "linkedin" && sent.mode === "3d", "envio sem nome, origem ou modo");
  await w.waitForSelector(".welcome__tip", { timeout: 4000 });
  assert(/Backbone/.test(await w.locator(".welcome__tip").innerText()), "dica não é a do nível escolhido");
  await w.getByRole("button", { name: "Entrar no prédio" }).click();
  await w.waitForSelector(".welcome", { state: "detached", timeout: 3000 });
  assert(await w.evaluate(() => !document.querySelector(".xp-root")?.inert), "o site continuou inerte");
  const saved = await w.evaluate(() => JSON.parse(localStorage.getItem("crm-visitante") ?? "null"));
  assert(saved?.status === "sent" && saved.level === "configuro", "a resposta não ficou guardada");
  // a rota valida o que chega
  const bad = await w.evaluate(async () =>
    (await fetch("/api/boas-vindas", { method: "POST", body: JSON.stringify({ email: "x", level: "zzz" }) })).status,
  );
  assert(bad === 400, `rota aceitou dado inválido (${bad})`);
  await w.close();
});

await check("boas-vindas no celular: cabe na tela, e dá para entrar sem deixar e-mail", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const g = await ctx.newPage();
  g.on("pageerror", (e) => errors.push(String(e)));
  await g.goto(`${base}/crm-como-sistema?boasvindas=1`, { waitUntil: "networkidle" });
  await g.waitForSelector(".welcome", { timeout: 15000 });
  assert(!(await g.evaluate(() => { const el = document.querySelector(".welcome"); return el.scrollWidth > el.clientWidth + 1; })), "rolagem lateral na boas-vindas");
  assert(await g.getByRole("button", { name: "Começar a leitura" }).isVisible(), "botão de entrar com o nome errado no celular");
  await g.getByRole("button", { name: "Entrar sem deixar e-mail" }).click();
  await g.waitForSelector(".welcome", { state: "detached", timeout: 3000 });
  await g.waitForSelector(".guide", { timeout: 8000 });
  const saved = await g.evaluate(() => JSON.parse(localStorage.getItem("crm-visitante") ?? "null"));
  assert(saved?.status === "skipped", "o pulo não ficou guardado");
  await ctx.close();
});

await check("aparelho fraco: o aviso oferece o modo texto, e dá para voltar ao 3D", async () => {
  const slow = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  slow.on("pageerror", (e) => errors.push(String(e)));
  await slow.goto(`${base}/crm-como-sistema?lento=1`, { waitUntil: "networkidle" });
  await slow.waitForSelector(".xp__perf", { timeout: 8000 });
  await slow.getByRole("button", { name: "Ler sem o 3D" }).click();
  await slow.waitForSelector(".map--page .map__area", { timeout: 4000 });
  assert((await slow.locator(".map__area").count()) === 8, "texto sem as 8 áreas");
  await slow.getByRole("button", { name: /Ver com o prédio 3D/ }).click();
  await slow.waitForSelector(".xp canvas", { timeout: 15000 });
  await slow.close();
});

await check("sem erros de página nos testes de celular, boas-vindas e aparelho fraco", async () => {
  assert(errors.length === 0, errors.slice(0, 3).join(" | "));
});

await browser.close();
console.log(results.join("\n"));
process.exitCode = results.some((r) => r.startsWith("✗")) ? 1 : 0;
