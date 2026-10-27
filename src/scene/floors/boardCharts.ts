import { AREA_CONTENT } from "@/content/areas";
import { DEPARTMENTS, type DepartmentId } from "../config/constants";
import { BRAND } from "../config/palette";
import { drawIcon } from "../rooftop/iconAtlas";

/*
 * Quadros do Brain (refinamento do especialista, RECOMENDACOES_AREAS §2): cada área
 * mostra os SEUS três indicadores (src/content, brain.indicators) e cada indicador tem
 * a forma de gráfico que combina com ele — sem números, só a forma:
 *   funil = conversão · pareadas = A × B · linha = prazo e tendência ·
 *   grade = carteira, risco, qualidade do dado · ordenadas = "por motivo/origem" ·
 *   colunas = volume ao longo do tempo.
 */

type Chart =
  "funnel" | "paired" | "line" | "line2" | "grid" | "ranked" | "columns";

/** forma de cada indicador, na ordem de brain.indicators */
const CHARTS: Record<DepartmentId, [Chart, Chart, Chart]> = {
  // receita por origem · MQL aceitos · conversão e opt-out por régua
  "marketing-growth": ["ranked", "funnel", "paired"],
  // precisão do forecast · cobertura do funil · motivos de perda
  vendas: ["line2", "funnel", "ranked"],
  // receita por tema · tempo até ativar · tickets causados pelo produto
  produto: ["ranked", "line", "columns"],
  // resolução no 1º contato · tickets no prazo · contatos por motivo
  atendimento: ["line", "paired", "ranked"],
  // receita retida · contas em risco · tempo até o primeiro valor
  "customer-success": ["columns", "grid", "line"],
  // inadimplência por faixa · NF refeitas · vendido × faturado
  financeiro: ["columns", "line", "paired"],
  // entregas no prazo (prometido × real) · tempo até go-live · "onde está meu pedido"
  "operacoes-entrega": ["line2", "columns", "ranked"],
  // campos-chave vazios · cadastros duplicados · receita CRM × ERP
  revops: ["grid", "columns", "paired"],
};

export const CELL_W = 512;
export const CELL_H = 320;
export const COLS = 4;

const C = {
  bg: "#0b1847",
  panel: "#122463",
  ink: "rgba(233,232,226,0.92)",
  soft: "rgba(233,232,226,0.62)",
  dim: "rgba(233,232,226,0.28)",
  grid: "rgba(233,232,226,0.12)",
  blue: "#4f7bff",
};

type Ctx = CanvasRenderingContext2D;
type Box = { x: number; y: number; w: number; h: number };

/** pseudoaleatório fixo por área e gráfico: o desenho não muda entre cargas */
function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function funnel(c: Ctx, b: Box) {
  const n = 4;
  const gap = 5;
  const h = (b.h - gap * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const w0 = b.w * (1 - i * 0.2);
    const w1 = b.w * (1 - (i + 1) * 0.2);
    const y = b.y + i * (h + gap);
    const cx = b.x + b.w / 2;
    c.fillStyle = i === n - 1 ? C.blue : i === 0 ? C.ink : C.soft;
    c.beginPath();
    c.moveTo(cx - w0 / 2, y);
    c.lineTo(cx + w0 / 2, y);
    c.lineTo(cx + w1 / 2, y + h);
    c.lineTo(cx - w1 / 2, y + h);
    c.closePath();
    c.fill();
  }
}

function paired(c: Ctx, b: Box, r: () => number) {
  const n = 5;
  const slot = b.w / n;
  const bw = slot * 0.3;
  for (let i = 0; i < n; i++) {
    const a = 0.45 + r() * 0.5;
    const d = Math.min(1, a + (r() - 0.55) * 0.35);
    const x = b.x + i * slot + slot * 0.15;
    c.fillStyle = C.soft;
    c.fillRect(x, b.y + b.h * (1 - a), bw, b.h * a);
    c.fillStyle = C.blue;
    c.fillRect(x + bw + 3, b.y + b.h * (1 - d), bw, b.h * d);
  }
}

function axis(c: Ctx, b: Box) {
  c.strokeStyle = C.grid;
  c.lineWidth = 1;
  for (let k = 1; k <= 3; k++) {
    const y = b.y + (b.h * k) / 4;
    c.beginPath();
    c.moveTo(b.x, y);
    c.lineTo(b.x + b.w, y);
    c.stroke();
  }
}

function path(c: Ctx, b: Box, pts: number[]) {
  c.beginPath();
  pts.forEach((v, i) => {
    const x = b.x + (b.w * i) / (pts.length - 1);
    const y = b.y + b.h * (1 - v);
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  });
  c.stroke();
}

function series(r: () => number, n: number, start: number, drift: number) {
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v = Math.min(0.92, Math.max(0.08, v + drift + (r() - 0.5) * 0.22));
    out.push(v);
  }
  return out;
}

function line(c: Ctx, b: Box, r: () => number, two: boolean) {
  axis(c, b);
  const real = series(r, 8, 0.35, 0.05);
  if (two) {
    // referência (meta ou prometido) tracejada, real em azul
    c.setLineDash([6, 5]);
    c.strokeStyle = C.soft;
    c.lineWidth = 2.5;
    path(
      c,
      b,
      real.map((v) => Math.min(0.95, v + 0.12)),
    );
    c.setLineDash([]);
  }
  c.strokeStyle = C.blue;
  c.lineWidth = 4;
  path(c, b, real);
  const last = real[real.length - 1];
  c.fillStyle = C.ink;
  c.beginPath();
  c.arc(b.x + b.w, b.y + b.h * (1 - last), 5, 0, Math.PI * 2);
  c.fill();
}

function grid(c: Ctx, b: Box, r: () => number) {
  const cols = 7;
  const rows = 5;
  const gap = 4;
  const s = Math.min(
    (b.w - gap * (cols - 1)) / cols,
    (b.h - gap * (rows - 1)) / rows,
  );
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const v = r();
      const x = b.x + i * (s + gap);
      const y = b.y + j * (s + gap);
      if (v > 0.84) {
        c.fillStyle = C.blue; // pede atenção
        c.fillRect(x, y, s, s);
      } else if (v > 0.68) {
        c.strokeStyle = C.soft; // vazio / incompleto
        c.lineWidth = 2;
        c.strokeRect(x + 1, y + 1, s - 2, s - 2);
      } else {
        c.fillStyle = C.dim;
        c.fillRect(x, y, s, s);
      }
    }
  }
}

function ranked(c: Ctx, b: Box, r: () => number) {
  const n = 5;
  const gap = 7;
  const h = (b.h - gap * (n - 1)) / n;
  let v = 0.95;
  for (let i = 0; i < n; i++) {
    c.fillStyle = i === 0 ? C.blue : C.soft;
    c.fillRect(b.x, b.y + i * (h + gap), b.w * v, h);
    v *= 0.62 + r() * 0.2;
  }
}

function columns(c: Ctx, b: Box, r: () => number) {
  axis(c, b);
  const n = 7;
  const slot = b.w / n;
  const vals = series(r, n, 0.3 + r() * 0.3, (r() - 0.45) * 0.12);
  vals.forEach((v, i) => {
    c.fillStyle = i === n - 1 ? C.blue : C.soft;
    c.fillRect(
      b.x + i * slot + slot * 0.18,
      b.y + b.h * (1 - v),
      slot * 0.64,
      b.h * v,
    );
  });
}

/** quebra o nome do indicador em até duas linhas */
function wrap(c: Ctx, text: string, max: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (c.measureText(next).width <= max || !cur) cur = next;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > 2) {
    lines.length = 2;
    lines[1] = `${lines[1].replace(/\s+\S*$/, "")}…`;
  }
  return lines;
}

/** Desenha (ou redesenha, depois que a fonte carrega) os quadros das oito áreas. */
export function drawBoards(canvas: HTMLCanvasElement, family: string) {
  canvas.width = CELL_W * COLS;
  canvas.height = CELL_H * Math.ceil(DEPARTMENTS.length / COLS);
  const c = canvas.getContext("2d")!;
  DEPARTMENTS.forEach((d, i) => {
    const x0 = (i % COLS) * CELL_W;
    const y0 = Math.floor(i / COLS) * CELL_H;
    c.save();
    c.translate(x0, y0);
    c.fillStyle = C.bg;
    c.fillRect(0, 0, CELL_W, CELL_H);

    // cabeçalho: ícone da área (a mesma forma do cubo) + nome
    c.fillStyle = BRAND.blue;
    c.fillRect(18, 16, 46, 46);
    drawIcon(c, d.icon, 21, 19, 40, BRAND.offWhite);
    c.fillStyle = C.ink;
    c.textBaseline = "alphabetic";
    c.font = `700 30px ${family}`;
    c.fillText(d.label.toUpperCase(), 78, 46);
    c.fillStyle = C.soft;
    c.font = `600 14px ${family}`;
    c.fillText("INDICADORES DA ÁREA", 78, 64);

    // três painéis: nome do indicador + a forma do gráfico
    const indicators = AREA_CONTENT[d.id].brain.indicators;
    const pw = (CELL_W - 18 * 2 - 12 * 2) / 3;
    CHARTS[d.id].forEach((chart, k) => {
      const px = 18 + k * (pw + 12);
      const py = 82;
      const ph = CELL_H - py - 16;
      c.fillStyle = C.panel;
      c.fillRect(px, py, pw, ph);
      c.fillStyle = C.ink;
      c.font = `600 15px ${family}`;
      wrap(c, indicators[k]?.name ?? "", pw - 20).forEach((ln, j) =>
        c.fillText(ln, px + 10, py + 22 + j * 18),
      );
      const box = { x: px + 12, y: py + 64, w: pw - 24, h: ph - 78 };
      const r = rand(1000 + i * 31 + k * 7);
      if (chart === "funnel") funnel(c, box);
      else if (chart === "paired") paired(c, box, r);
      else if (chart === "line") line(c, box, r, false);
      else if (chart === "line2") line(c, box, r, true);
      else if (chart === "grid") grid(c, box, r);
      else if (chart === "ranked") ranked(c, box, r);
      else columns(c, box, r);
    });
    c.restore();
  });
}
