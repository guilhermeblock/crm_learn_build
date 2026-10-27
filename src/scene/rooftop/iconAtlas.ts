import * as THREE from "three";
import type { IconId } from "../config/constants";

/**
 * Ícones das áreas, desenhados em código num atlas único (sem asset externo).
 * Linguagem Gui Block: geometria simples, traço reto de espessura única,
 * pontas quadradas, baixa complexidade. Branco no atlas; a cor vem do shader.
 */
export const ICON_ORDER: IconId[] = [
  "broadcast",
  "growth",
  "product",
  "support",
  "success",
  "finance",
  "operations",
  "rules",
];

/** 128 px por ícone: ~2× o tamanho máximo em tela no rooftop (nítido com mipmaps). */
const CELL = 128;
const STROKE = 9;

type Draw = (c: CanvasRenderingContext2D) => void;

const ICONS: Record<IconId, Draw> = {
  // Marketing: fonte + ondas de alcance
  broadcast: (c) => {
    c.strokeRect(30, 52, 16, 24);
    for (const r of [22, 40]) {
      c.beginPath();
      c.arc(46, 64, r, -Math.PI / 3.2, Math.PI / 3.2);
      c.stroke();
    }
  },
  // Vendas: barras crescentes sobre a base
  growth: (c) => {
    c.beginPath();
    c.moveTo(28, 100);
    c.lineTo(100, 100);
    c.stroke();
    c.fillRect(34, 72, 12, 20);
    c.fillRect(58, 56, 12, 36);
    c.fillRect(82, 36, 12, 56);
  },
  // Produto: cubo isométrico em contorno
  product: (c) => {
    const cx = 64;
    c.beginPath();
    c.moveTo(cx, 26);
    c.lineTo(cx + 34, 45);
    c.lineTo(cx + 34, 84);
    c.lineTo(cx, 103);
    c.lineTo(cx - 34, 84);
    c.lineTo(cx - 34, 45);
    c.closePath();
    c.moveTo(cx - 34, 45);
    c.lineTo(cx, 64);
    c.lineTo(cx + 34, 45);
    c.moveTo(cx, 64);
    c.lineTo(cx, 103);
    c.stroke();
  },
  // Atendimento: balão de conversa com duas linhas
  support: (c) => {
    c.beginPath();
    c.moveTo(28, 32);
    c.lineTo(100, 32);
    c.lineTo(100, 80);
    c.lineTo(56, 80);
    c.lineTo(38, 98);
    c.lineTo(38, 80);
    c.lineTo(28, 80);
    c.closePath();
    c.moveTo(44, 50);
    c.lineTo(84, 50);
    c.moveTo(44, 64);
    c.lineTo(72, 64);
    c.stroke();
  },
  // CS: ciclo fechado com marca de sucesso
  success: (c) => {
    c.beginPath();
    c.arc(64, 64, 36, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(46, 65);
    c.lineTo(59, 78);
    c.lineTo(84, 52);
    c.stroke();
  },
  // Financeiro: pilha de três discos
  finance: (c) => {
    for (const y of [42, 64, 86]) {
      c.beginPath();
      c.ellipse(64, y, 34, 11, 0, 0, Math.PI * 2);
      c.stroke();
    }
  },
  // Operações: engrenagem simplificada (aro + 8 dentes + eixo)
  operations: (c) => {
    c.beginPath();
    c.arc(64, 64, 26, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(64, 64, 9, 0, Math.PI * 2);
    c.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      c.save();
      c.translate(64, 64);
      c.rotate(a);
      c.fillRect(-6, -42, 12, 14);
      c.restore();
    }
  },
  // RevOps: três trilhos com cursores em posições diferentes (regras ajustáveis, não um centro)
  rules: (c) => {
    for (const [y, x] of [
      [40, 50],
      [64, 84],
      [88, 62],
    ]) {
      c.beginPath();
      c.moveTo(26, y);
      c.lineTo(102, y);
      c.stroke();
      c.fillRect(x - 10, y - 10, 20, 20);
    }
  },
};

/** Desenha um ícone numa caixa de `size` px com canto em (x, y), na cor dada. */
export function drawIcon(c: CanvasRenderingContext2D, id: IconId, x: number, y: number, size: number, color = "#fff") {
  c.save();
  c.translate(x, y);
  c.scale(size / CELL, size / CELL);
  c.strokeStyle = color;
  c.fillStyle = color;
  c.lineWidth = STROKE;
  c.lineCap = "square";
  c.lineJoin = "miter";
  ICONS[id](c);
  c.restore();
}

export function createIconAtlas(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CELL * ICON_ORDER.length;
  canvas.height = CELL;
  const c = canvas.getContext("2d")!;
  ICON_ORDER.forEach((id, i) => drawIcon(c, id, i * CELL, 0, CELL));
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

export const ICON_COUNT = ICON_ORDER.length;
