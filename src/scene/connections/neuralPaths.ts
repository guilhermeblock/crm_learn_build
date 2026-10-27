import * as THREE from "three";
import {
  CUBE_SIZE,
  DEPARTMENTS,
  LEVELS,
  TERMINAL_HEIGHT,
  ZONE_OFFSET,
  type Department,
  type DepartmentId,
} from "../config/constants";
import type { Relation, RelationLevel } from "@/content/types";
import { BOARD } from "../floors/DepartmentBoards";
import { podTarget } from "../floors/departmentPods";
import { shift } from "../props/furniture";

/*
 * Conexões como sinapses, não como cabos: cada área é um "neurônio".
 *  - corpo: o cubo no rooftop, com prolongamentos curtos em volta;
 *  - axônio: desce pelo espaço do prédio (atravessa lajes livremente);
 *  - dendritos: em cada pavimento, tocam o que é da área
 *      Brain → quadro de indicadores · Heart → mesa, monitor e pessoa · Backbone → terminal;
 *  - relações: filamentos finos entre áreas que trabalham juntas (a trama).
 * Caminhos orgânicos com variação aleatória FIXA por área (não muda a cada carga).
 */

export interface Filament {
  curve: THREE.CatmullRomCurve3;
  r0: number;
  r1: number;
  /** distância desde o corpo (cubo) até a raiz deste filamento */
  startDist: number;
}

export interface Neuron {
  id: DepartmentId;
  filaments: Filament[];
  /** pontos de ramificação (NODE) */
  nodes: THREE.Vector3[];
  /** pontas que tocam os destinos (sinapses), por pavimento */
  synapses: { floor: "brain" | "heart" | "backbone"; p: THREE.Vector3 }[];
  /** maior distância da árvore (para o ciclo do impulso) */
  reach: number;
}

/** gerador pseudoaleatório determinístico */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Curva orgânica de a até b: pontos intermediários com desvio lateral em
 * "passeio aleatório" (dobras de dendrito) e um leve caimento.
 */
export function organic(a: THREE.Vector3, b: THREE.Vector3, rand: () => number, { wobble = 0.12, sag = 0.1, steps = 0 } = {}) {
  const len = a.distanceTo(b);
  const n = steps || Math.max(2, Math.round(len / 0.7));
  const dir = b.clone().sub(a).normalize();
  const helper = Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const u = new THREE.Vector3().crossVectors(dir, helper).normalize();
  const v = new THREE.Vector3().crossVectors(dir, u).normalize();
  const pts = [a.clone()];
  let du = 0;
  let dv = 0;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    du += (rand() - 0.5) * 2 * wobble * len * 0.35;
    dv += (rand() - 0.5) * 2 * wobble * len * 0.35;
    const fade = Math.sin(Math.PI * t); // desvio some nas pontas
    const p = a.clone().lerp(b, t);
    p.addScaledVector(u, du * fade).addScaledVector(v, dv * fade);
    p.y -= sag * len * fade * 0.25;
    pts.push(p);
  }
  pts.push(b.clone());
  return new THREE.CatmullRomCurve3(pts, false, "centripetal");
}

function at(d: Department, lx: number, lz: number, y: number) {
  const p = shift(d.zone, lx, lz);
  return new THREE.Vector3(p.x, y, p.z);
}

/** pontos de ramificação do axônio, por pavimento */
function branchPoints(d: Department, rand: () => number) {
  const j = (s: number) => (rand() - 0.5) * 2 * s;
  return {
    brain: at(d, j(0.85), 0.75 + j(0.5), LEVELS.brain + 2.5 + j(0.5)),
    heart: at(d, j(0.85), 0.8 + j(0.5), LEVELS.heart + 2.3 + j(0.5)),
    backbone: at(d, j(0.6), 1.1 + j(0.3), LEVELS.backbone + 2.3 + j(0.4)),
  };
}

export function buildNeuron(d: Department): Neuron {
  const rand = rng(1000 + d.index * 97);
  const filaments: Filament[] = [];
  const synapses: Neuron["synapses"] = [];
  const bp = branchPoints(d, rand);
  const soma = new THREE.Vector3(d.cube.x, d.cube.y - CUBE_SIZE / 2 + 0.15, d.cube.z);
  const terminal = at(d, 0, ZONE_OFFSET, LEVELS.backbone + TERMINAL_HEIGHT + 0.02);

  // axônio: corpo → Brain → Heart → Backbone → terminal (afina a cada trecho)
  const axon = [soma, bp.brain, bp.heart, bp.backbone, terminal];
  const radii = [0.075, 0.052, 0.044, 0.036, 0.024];
  const distAt: number[] = [0];
  for (let i = 0; i < axon.length - 1; i++) {
    const curve = organic(axon[i], axon[i + 1], rand, { wobble: 0.22, sag: 0.05 });
    filaments.push({ curve, r0: radii[i], r1: radii[i + 1], startDist: distAt[i] });
    distAt.push(distAt[i] + curve.getLength());
  }
  synapses.push({ floor: "backbone", p: terminal });

  // dendritos de um ponto de ramificação até destinos
  const dendrites = (from: THREE.Vector3, base: number, floor: Neuron["synapses"][number]["floor"], targets: THREE.Vector3[]) => {
    for (const t of targets) {
      const curve = organic(from, t, rand, { wobble: 0.22, sag: 0.15 });
      filaments.push({ curve, r0: 0.034, r1: 0.01, startDist: base });
      synapses.push({ floor, p: t });
      // ramo secundário saindo do meio do dendrito (arborização)
      const mid = curve.getPointAt(0.5);
      const a = rand() * Math.PI * 2;
      const r = 0.45 + rand() * 0.5;
      const twigTip = mid.clone().add(new THREE.Vector3(Math.cos(a) * r, -0.15 - rand() * 0.45, Math.sin(a) * r));
      const twig = organic(mid, twigTip, rand, { wobble: 0.3, sag: 0.2, steps: 3 });
      filaments.push({ curve: twig, r0: 0.018, r1: 0.004, startDist: base + curve.getLength() * 0.5 });
    }
  };

  // Brain: três toques no quadro de indicadores da área
  const top = LEVELS.brain + BOARD.bottom + BOARD.height;
  const face = BOARD.z + 0.04;
  dendrites(bp.brain, distAt[1], "brain", [
    at(d, -0.45, face, top - 0.14),
    at(d, 0.42, face, LEVELS.brain + BOARD.bottom + 0.28),
    at(d, 0.05, face, top + 0.02),
  ]);

  // Heart: mesa, monitor e lugar da pessoa no posto da equipe
  const pod = podTarget(d);
  const h = LEVELS.heart + pod.h;
  dendrites(bp.heart, distAt[2], "heart", [
    at(d, 0.15, pod.z - 0.15, h + 0.03),
    at(d, -0.4, pod.z + 0.05, h + 0.03),
    at(d, 0.3, pod.z + 0.55, LEVELS.heart + 1.12),
  ]);

  // Backbone: um ramo extra até a frente do terminal
  dendrites(bp.backbone, distAt[3], "backbone", [at(d, 0.22, ZONE_OFFSET + 0.37, LEVELS.backbone + 0.72)]);

  // prolongamentos curtos em volta do corpo (o cubo "irradia")
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + rand() * 0.9;
    const r = 0.9 + rand() * 0.9;
    const tip = soma.clone().add(new THREE.Vector3(Math.cos(a) * r, -0.2 - rand() * 0.9, Math.sin(a) * r));
    const curve = organic(soma, tip, rand, { wobble: 0.28, sag: 0.3, steps: 4 });
    filaments.push({ curve, r0: 0.045, r1: 0.005, startDist: 0 });
  }

  const reach = Math.max(...filaments.map((f) => f.startDist + f.curve.getLength()));
  return { id: d.id, filaments, nodes: [bp.brain, bp.heart, bp.backbone], synapses, reach };
}

type Level = RelationLevel;

/** onde o axônio da área se ramifica no Heart (as estações também partem daqui) */
export function heartBranchPoint(d: Department): THREE.Vector3 {
  return branchPoints(d, rng(1000 + d.index * 97)).heart;
}

function levelPoint(d: Department, level: Level) {
  if (level === "rooftop") return new THREE.Vector3(d.cube.x, d.cube.y - 0.2, d.cube.z);
  return branchPoints(d, rng(1000 + d.index * 97))[level];
}

/** Relação: caimento natural, mas menos ondulada que os dendritos (relação ≠ anatomia). */
export function buildRelation(rel: Relation, seed: number): Filament {
  const da = DEPARTMENTS.find((d) => d.id === rel.a)!;
  const db = DEPARTMENTS.find((d) => d.id === rel.b)!;
  const pa = levelPoint(da, rel.floor);
  const pb = levelPoint(db, rel.floorB ?? rel.floor);
  const sag = rel.floor === "rooftop" ? 0.6 : 0.45;
  const curve = organic(pa, pb, rng(5000 + seed * 31), { wobble: 0.07, sag });
  const r = rel.key ? 0.026 : 0.018;
  return { curve, r0: r, r1: r * 0.75, startDist: 0 };
}
