import type { MaterialName } from "../config/materials";
import type { BlockInstance } from "./InstancedBlocks";

/*
 * Mobiliário procedural como "receitas": cada função empilha peças em baldes
 * (material + geometria). Um pavimento inteiro vira ~10 InstancedMesh,
 * em vez de centenas de meshes copiados à mão.
 *
 * Escala de maquete: pé-direito 4.8, pessoa ≈ 1.2, tampo de mesa a 0.58.
 */

export type Shape = "box" | "cylinder" | "sphere";
export type BucketKey = `${MaterialName}|${Shape}`;
export type Buckets = Map<BucketKey, BlockInstance[]>;

export interface Placement {
  x: number;
  z: number;
  /** rotação em Y (radianos); a "frente" do objeto é +Z local */
  rot?: number;
}

type Vec3 = [number, number, number];

export function createBuckets(): Buckets {
  return new Map();
}

function push(b: Buckets, material: MaterialName, shape: Shape, item: BlockInstance) {
  const key: BucketKey = `${material}|${shape}`;
  const list = b.get(key);
  if (list) list.push(item);
  else b.set(key, [item]);
}

/** Converte uma posição local do objeto (lx, ly, lz) para o mundo, no piso `base`. */
function at(p: Placement, base: number, lx: number, ly: number, lz: number): Vec3 {
  const r = p.rot ?? 0;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p.x + lx * c + lz * s, base + ly, p.z - lx * s + lz * c];
}

function part(
  b: Buckets,
  p: Placement,
  base: number,
  material: MaterialName,
  local: Vec3,
  size: Vec3,
  shape: Shape = "box",
) {
  push(b, material, shape, { position: at(p, base, ...local), size, rotationY: p.rot ?? 0 });
}

/** Mesa de trabalho: tampo + duas laterais. */
export function desk(
  b: Buckets,
  p: Placement,
  base: number,
  { w = 1.2, d = 0.6, top = "deskLight" as MaterialName } = {},
) {
  part(b, p, base, top, [0, 0.58, 0], [w, 0.05, d]);
  part(b, p, base, "metal", [-w / 2 + 0.04, 0.28, 0], [0.04, 0.56, d - 0.06]);
  part(b, p, base, "metal", [w / 2 - 0.04, 0.28, 0], [0.04, 0.56, d - 0.06]);
}

/** Monitor sobre a mesa, tela voltada para +Z local. */
export function monitor(b: Buckets, p: Placement, base: number, { w = 0.5 } = {}) {
  part(b, p, base, "metal", [0, 0.68, -0.02], [0.04, 0.16, 0.04]);
  part(b, p, base, "monitor", [0, 0.9, 0], [w, 0.3, 0.03]);
  part(b, p, base, "screen", [0, 0.9, 0.017], [w - 0.04, 0.26, 0.004]);
}

/** Cadeira: quem senta olha para -Z local (a mesa); encosto em +Z. */
export function chair(b: Buckets, p: Placement, base: number) {
  part(b, p, base, "chair", [0, 0.38, 0], [0.42, 0.06, 0.42]);
  part(b, p, base, "chair", [0, 0.62, 0.19], [0.42, 0.42, 0.05]);
  part(b, p, base, "chair", [0, 0.18, 0], [0.06, 0.34, 0.06]);
}

/** Figura humana estilizada: corpo cilíndrico + cabeça esférica. Sem animação. */
export function person(b: Buckets, p: Placement, base: number, pose: "stand" | "sit" = "stand") {
  if (pose === "stand") {
    part(b, p, base, "personBody", [0, 0.46, 0], [0.3, 0.92, 0.3], "cylinder");
    part(b, p, base, "personHead", [0, 1.06, 0], [0.24, 0.24, 0.24], "sphere");
  } else {
    part(b, p, base, "personBody", [0, 0.68, 0.04], [0.3, 0.56, 0.3], "cylinder");
    part(b, p, base, "personHead", [0, 1.08, 0.02], [0.24, 0.24, 0.24], "sphere");
  }
}

/** Estação de trabalho completa: mesa + monitor + cadeira (+ pessoa sentada). */
export function workstation(
  b: Buckets,
  p: Placement,
  base: number,
  { occupied = false, top = "deskLight" as MaterialName } = {},
) {
  desk(b, p, base, { top });
  // o monitor fica no fundo da mesa olhando para quem senta (+Z local)
  monitor(b, { ...p, ...shift(p, 0, -0.16) }, base);
  const seat = { ...p, ...shift(p, 0, 0.55) };
  chair(b, seat, base);
  if (occupied) person(b, seat, base, "sit");
}

/** Ilha de mesas frente a frente: `n` estações de cada lado, ao longo de X local. */
export function deskIsland(
  b: Buckets,
  p: Placement,
  base: number,
  { n = 3, occupied = [] as number[], top = "deskLight" as MaterialName } = {},
) {
  const r = p.rot ?? 0;
  for (let i = 0; i < n * 2; i++) {
    const side = i < n ? 1 : -1;
    const lx = ((i % n) - (n - 1) / 2) * 1.25;
    const lz = side * 0.31;
    const pos = shift(p, lx, lz);
    workstation(b, { ...pos, rot: r + (side === 1 ? 0 : Math.PI) }, base, {
      occupied: occupied.includes(i),
      top,
    });
  }
}

/** Planta em vaso (volume baixo-poli). */
export function plant(b: Buckets, p: Placement, base: number, h = 0.9) {
  part(b, p, base, "concreteLight", [0, 0.2, 0], [0.42, 0.4, 0.42]);
  part(b, p, base, "plant", [0, 0.4 + h / 2, 0], [0.6, h, 0.6], "sphere");
}

/** Rack de infraestrutura (frente em +Z local); `connected` acende a tampa. */
export function rack(
  b: Buckets,
  p: Placement,
  base: number,
  { h = 1.6, w = 0.7, connected = false } = {},
) {
  part(b, p, base, "fascia", [0, h / 2, 0], [w, h, w]);
  part(b, p, base, "backPanel", [0, h / 2, w / 2 + 0.002], [w * 0.86, h - 0.12, 0.02]);
  const rows = Math.floor((h - 0.3) / 0.16);
  for (let i = 0; i < rows; i++) {
    part(b, p, base, "cubePad", [-w * 0.12, 0.2 + i * 0.16, w / 2 + 0.016], [w * 0.55, 0.025, 0.01]);
  }
  if (connected) {
    part(b, p, base, "nodeBlue", [0, h + 0.02, 0], [w * 0.7, 0.04, w * 0.7]);
    part(b, p, base, "nodeBlue", [w * 0.36, h / 2, w / 2 + 0.018], [0.04, h - 0.2, 0.012]);
  }
}

/** Retângulo de linhas finas no piso (SIGNAL de área ativa). */
export function floorOutline(
  b: Buckets,
  p: Placement,
  base: number,
  w: number,
  d: number,
  material: MaterialName = "signalLine",
) {
  const t = 0.035;
  part(b, p, base, material, [0, 0.03, d / 2], [w, 0.01, t]);
  part(b, p, base, material, [0, 0.03, -d / 2], [w, 0.01, t]);
  part(b, p, base, material, [w / 2, 0.03, 0], [t, 0.01, d]);
  part(b, p, base, material, [-w / 2, 0.03, 0], [t, 0.01, d]);
}

/** Bloco genérico (mesas de reunião, painéis, bandejas...). */
export function block(
  b: Buckets,
  p: Placement,
  base: number,
  material: MaterialName,
  local: Vec3,
  size: Vec3,
  shape: Shape = "box",
) {
  part(b, p, base, material, local, size, shape);
}

/** Desloca uma posição em coordenadas locais do objeto. */
export function shift(p: Placement, lx: number, lz: number): Placement {
  const r = p.rot ?? 0;
  return { x: p.x + lx * Math.cos(r) + lz * Math.sin(r), z: p.z - lx * Math.sin(r) + lz * Math.cos(r), rot: r };
}
