import type { Department, IconId } from "../config/constants";
import type { MaterialName } from "../config/materials";
import {
  block,
  chair,
  desk,
  monitor,
  plant,
  shift,
  type Buckets,
  type Placement,
} from "../props/furniture";

/*
 * HEART: o posto de cada área, no referencial da zona (+Z local = fachada/coluna,
 * que é de onde a câmera olha). Rotinas revisadas com um especialista em CRM/RevOps:
 * cada posto mostra o trabalho cotidiano da área, com UMA pessoa por área
 * (o briefing limita o Heart a até 8 figuras). Quadros ficam ao fundo, voltados para a câmera.
 * Pegada máxima ≈ 1.3 (x) × 1.9 (z), para caber entre as colunas vizinhas.
 */

/** ponto onde o fio da área chega no posto: z local e altura (tampo principal) */
export interface PodTarget {
  z: number;
  h: number;
}

type Pod = (b: Buckets, zone: Placement, base: number) => PodTarget;

const at = (zone: Placement, lx: number, lz: number, turn = 0): Placement => ({
  ...shift(zone, lx, lz),
  rot: (zone.rot ?? 0) + turn,
});

interface BoardSpec {
  /** z local do quadro */
  z: number;
  w: number;
  h: number;
  /** altura da borda inferior */
  bottom: number;
  /** cartões por coluna (de cima para baixo) */
  columns: number[];
  /** colunas cujos cartões ficam em azul (ex.: a etapa "em andamento") */
  blue?: number[];
}

/** Quadro em pé com cartões em colunas: pipeline, calendário, fluxo, priorização. */
function cardBoard(b: Buckets, zone: Placement, base: number, spec: BoardSpec) {
  const p = at(zone, 0, spec.z);
  const midY = spec.bottom + spec.h / 2;
  block(b, p, base, "deskDark", [0, midY, 0], [spec.w, spec.h, 0.04]);
  block(
    b,
    p,
    base,
    "metal",
    [-spec.w / 2 + 0.06, spec.bottom / 2, 0],
    [0.04, spec.bottom, 0.04],
  );
  block(
    b,
    p,
    base,
    "metal",
    [spec.w / 2 - 0.06, spec.bottom / 2, 0],
    [0.04, spec.bottom, 0.04],
  );
  const n = spec.columns.length;
  const colW = (spec.w - 0.1) / n;
  const cardH = Math.min(
    0.11,
    (spec.h - 0.12) / Math.max(...spec.columns) - 0.035,
  );
  spec.columns.forEach((count, i) => {
    const lx = -spec.w / 2 + 0.05 + colW * (i + 0.5);
    const mat: MaterialName = spec.blue?.includes(i) ? "cardBlue" : "card";
    for (let k = 0; k < count; k++) {
      const ly = spec.bottom + spec.h - 0.08 - k * (cardH + 0.035) - cardH / 2;
      block(b, p, base, mat, [lx, ly, 0.026], [colW * 0.78, cardH, 0.012]);
    }
  });
}

/** Painel de barras horizontais (fila por canal, carteira): telas de cor fria, sem números. */
function barPanel(
  b: Buckets,
  zone: Placement,
  base: number,
  z: number,
  bars: number[],
  bottom = 0.95,
) {
  const p = at(zone, 0, z);
  const w = 1.0;
  const h = 0.16 + bars.length * 0.12;
  block(b, p, base, "monitor", [0, bottom + h / 2, 0], [w, h, 0.04]);
  block(b, p, base, "metal", [0, bottom / 2, 0], [0.05, bottom, 0.05]);
  bars.forEach((len, i) => {
    const bw = (w - 0.16) * len;
    const ly = bottom + h - 0.14 - i * 0.12;
    block(
      b,
      p,
      base,
      i === 0 ? "cardBlue" : "screen",
      [-w / 2 + 0.08 + bw / 2, ly, 0.024],
      [bw, 0.06, 0.01],
    );
  });
}

const PODS: Record<IconId, Pod> = {
  // Marketing: planejamento de campanhas — mesa compartilhada + calendário em grade
  broadcast: (b, z, y) => {
    const p = at(z, 0, 0);
    desk(b, p, y, { w: 1.25 });
    monitor(b, { ...shift(p, -0.3, -0.16), rot: p.rot }, y, { w: 0.42 });
    chair(b, at(z, -0.3, 0.55), y);
    chair(b, at(z, 0.3, 0.55), y);
    cardBoard(b, z, y, {
      z: -0.78,
      w: 1.25,
      h: 0.7,
      bottom: 0.85,
      columns: [3, 3, 3, 3, 3, 3],
      blue: [2],
    });
    return { z: 0, h: 0.6 };
  },
  // Vendas: reunião de pipeline — quadro de etapas com cartões avançando (funil)
  growth: (b, z, y) => {
    const p = at(z, 0, 0.1);
    desk(b, p, y, { w: 1.0 });
    monitor(b, { ...shift(p, 0, -0.16), rot: p.rot }, y);
    chair(b, at(z, 0, 0.65), y);
    cardBoard(b, z, y, {
      z: -0.72,
      w: 1.3,
      h: 0.85,
      bottom: 0.75,
      columns: [5, 4, 3, 2],
      blue: [3],
    });
    return { z: 0.1, h: 0.6 };
  },
  // Produto: descoberta e priorização — mesa alta + quadro agora / próximo / depois
  product: (b, z, y) => {
    block(b, at(z, 0, -0.05), y, "deskLight", [0, 0.95, 0], [1.0, 0.05, 0.6]);
    block(b, at(z, 0, -0.05), y, "metal", [0, 0.47, 0], [0.08, 0.94, 0.08]);
    cardBoard(b, z, y, {
      z: -0.72,
      w: 1.2,
      h: 0.8,
      bottom: 0.85,
      columns: [3, 2, 2],
      blue: [0],
    });
    return { z: -0.05, h: 0.97 };
  },
  // Atendimento: fila em vários canais — duas baias lado a lado + painel da fila
  support: (b, z, y) => {
    for (const lx of [-0.33, 0.33]) {
      const p = at(z, lx, 0);
      desk(b, p, y, { w: 0.6, d: 0.55 });
      monitor(b, { ...shift(p, 0, -0.14), rot: p.rot }, y, { w: 0.4 });
      chair(b, at(z, lx, 0.5), y);
    }
    block(b, at(z, 0, 0), y, "deskDark", [0, 0.82, 0], [0.03, 0.5, 0.55]);
    barPanel(b, z, y, -0.72, [0.9, 0.65, 0.45, 0.3]);
    return { z: 0, h: 0.6 };
  },
  // CS: acompanhamento do cliente — mesa redonda (a cadeira vazia é o cliente) + tela da carteira
  success: (b, z, y) => {
    block(
      b,
      at(z, 0, -0.1),
      y,
      "deskLight",
      [0, 0.58, 0],
      [0.9, 0.05, 0.9],
      "cylinder",
    );
    block(
      b,
      at(z, 0, -0.1),
      y,
      "metal",
      [0, 0.28, 0],
      [0.12, 0.56, 0.12],
      "cylinder",
    );
    chair(b, at(z, 0, 0.52), y);
    chair(b, at(z, 0, -0.72, Math.PI), y);
    cardBoard(b, z, y, {
      z: -1.05,
      w: 1.1,
      h: 0.6,
      bottom: 1.0,
      columns: [3, 3, 3, 3],
      blue: [0, 2],
    });
    return { z: -0.1, h: 0.6 };
  },
  // Financeiro: fechamento e aprovações — monitor largo, bandejas de documentos, arquivo
  finance: (b, z, y) => {
    const p = at(z, 0, 0.05);
    desk(b, p, y, { w: 1.25 });
    monitor(b, { ...shift(p, 0.1, -0.16), rot: p.rot }, y, { w: 0.82 });
    // bandejas de entrada e saída com pilhas de documentos
    for (const [lx, n] of [
      [-0.47, 3],
      [-0.27, 2],
    ] as const) {
      block(
        b,
        { ...shift(p, lx, 0.02), rot: p.rot },
        y,
        "metal",
        [0, 0.62, 0],
        [0.17, 0.02, 0.22],
      );
      block(
        b,
        { ...shift(p, lx, 0.02), rot: p.rot },
        y,
        "card",
        [0, 0.64 + n * 0.012, 0],
        [0.15, n * 0.024, 0.2],
      );
    }
    chair(b, at(z, 0, 0.6), y);
    block(b, at(z, 0, -0.7), y, "deskDark", [0, 0.45, 0], [1.1, 0.9, 0.42]);
    for (const ly of [0.25, 0.55, 0.85]) {
      block(b, at(z, 0, -0.48), y, "metal", [0, ly, 0], [0.9, 0.02, 0.01]);
    }
    return { z: 0.05, h: 0.6 };
  },
  // Operações: expedição/implantação — bancada, caixas e quadro de fluxo recebido → execução → entregue
  operations: (b, z, y) => {
    block(b, at(z, 0, 0.15), y, "deskDark", [0, 0.92, 0], [1.1, 0.05, 0.6]);
    block(b, at(z, 0, 0.15), y, "metal", [0, 0.46, 0], [1.0, 0.9, 0.04]);
    block(b, at(z, -0.42, -0.45), y, "sofa", [0, 0.18, 0], [0.36, 0.36, 0.36]);
    block(b, at(z, 0.42, -0.45), y, "sofa", [0, 0.15, 0], [0.3, 0.3, 0.3]);
    block(b, at(z, 0.42, -0.45), y, "sofa", [0, 0.45, 0], [0.28, 0.28, 0.28]);
    cardBoard(b, z, y, {
      z: -0.95,
      w: 1.2,
      h: 0.65,
      bottom: 1.0,
      columns: [2, 3, 4],
      blue: [1],
    });
    return { z: 0.15, h: 0.94 };
  },
  // RevOps: administração do CRM — mesa com dois monitores: fila de demandas (uma em andamento)
  // e pares de cadastros duplicados. Sem quadro de cartões (não é o funil) nem rack (não é o centro).
  rules: (b, z, y) => {
    const p = at(z, 0, 0.05);
    desk(b, p, y, { w: 1.2 });
    for (const lx of [-0.27, 0.27])
      monitor(b, { ...shift(p, lx, -0.16), rot: p.rot }, y, { w: 0.44 });
    // tela da esquerda: fila de demandas, a segunda em andamento
    [0.3, 0.22, 0.26, 0.16].forEach((len, i) => {
      block(
        b,
        { ...shift(p, -0.27 - (0.3 - len) / 2, -0.16), rot: p.rot },
        y,
        i === 1 ? "cardBlue" : "card",
        [0, 0.99 - i * 0.06, 0.021],
        [len, 0.03, 0.004],
      );
    });
    // tela da direita: pares de cadastros duplicados lado a lado
    for (const ly of [0.97, 0.85]) {
      for (const lx of [0.19, 0.35]) {
        block(
          b,
          { ...shift(p, lx, -0.16), rot: p.rot },
          y,
          ly > 0.9 ? "cardBlue" : "card",
          [0, ly, 0.021],
          [0.12, 0.08, 0.004],
        );
      }
    }
    chair(b, at(z, 0, 0.62), y);
    plant(b, at(z, -0.55, -0.7), y, 0.5);
    return { z: 0.05, h: 0.6 };
  },
};

/** Monta o posto da área e devolve o ponto de chegada do fio. */
export function departmentPod(
  b: Buckets,
  d: Department,
  base: number,
): PodTarget {
  return PODS[d.icon](b, d.zone, base);
}

/** ponto de chegada do fio no posto, sem montar móveis (para o traçado) */
export function podTarget(d: Department): PodTarget {
  return PODS[d.icon](new Map(), d.zone, 0);
}
