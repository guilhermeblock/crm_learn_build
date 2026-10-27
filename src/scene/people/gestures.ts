import type * as THREE from "three";
import type { Rig } from "./rig";

/*
 * Gestos de trabalho, em laço (estilo "The Sims"): ninguém sai do posto, só o corpo
 * trabalha. Cada gesto escreve TODAS as articulações que usa a cada frame (valores
 * absolutos, sem acumular), então trocar de gesto nunca deixa resíduo.
 */

export type Gesture =
  | "typing"
  | "monitors"
  | "headset"
  | "talking"
  | "calculating"
  | "presenting"
  | "reading"
  | "sorting"
  | "packing";

/** objetos que alguns gestos movem (prancheta, cartão, caixa) */
export interface GestureProps {
  box?: THREE.Object3D;
  boxY?: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ss = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
/** fase 0..1 de um ciclo de `period` segundos */
const cyc = (t: number, period: number) => (((t / period) % 1) + 1) % 1;
/** janela suave dentro do ciclo: sobe em [a, a+e], desce em [b-e, b] */
const win = (ph: number, a: number, b: number, e = 0.08) =>
  ss((ph - a) / e) * (1 - ss((ph - (b - e)) / e));

function set(o: THREE.Object3D, x: number, y = 0, z = 0) {
  o.rotation.set(x, y, z);
}

/** respiração e pequeno balanço: comuns a todos */
function idle(r: Rig, t: number) {
  r.chest.scale.y = 1 + 0.014 * Math.sin(t * 1.7);
}

/** braços na mesa, mãos no teclado; `tap` liga/desliga o digitar */
function keyboard(r: Rig, t: number, tap: number) {
  set(r.shoulderL, -0.62, 0, 0.16);
  set(r.shoulderR, -0.62, 0, -0.16);
  r.elbowL.rotation.set(-0.98 + 0.09 * Math.sin(t * 15) * tap, 0, -0.22);
  r.elbowR.rotation.set(-0.98 + 0.09 * Math.sin(t * 15 + 2.1) * tap, 0, 0.22);
}

const GESTURES: Record<Gesture, (r: Rig, t: number, p: GestureProps) => void> =
  {
    // Marketing: digita e, de vez em quando, levanta os olhos para o calendário
    typing(r, t) {
      const look = win(cyc(t, 7), 0.6, 0.88);
      keyboard(r, t, 1 - look);
      set(r.torso, 0.12);
      set(r.head, 0.28 - 0.42 * look, 0.12 * look);
    },
    // RevOps: digita alternando o olhar entre os dois monitores
    monitors(r, t) {
      keyboard(r, t, 1);
      set(r.torso, 0.1);
      set(r.head, 0.2, 0.34 * Math.tanh(3 * Math.sin(t * 0.9)));
    },
    // Atendimento: fone, digita enquanto fala (acena com a cabeça) e ajusta o fone às vezes
    headset(r, t) {
      const ear = win(cyc(t, 9), 0.08, 0.3);
      keyboard(r, t, 1 - ear);
      set(r.shoulderR, -0.62 + 0.1 * ear, 0, -0.16 - 0.95 * ear);
      r.elbowR.rotation.set(-0.98 - 1.25 * ear, 0, 0.22 * (1 - ear));
      set(r.torso, 0.1);
      set(
        r.head,
        0.15 + 0.06 * Math.sin(t * 3.1),
        0.08 * Math.sin(t * 0.7),
        -0.12 * ear,
      );
    },
    // CS: conversa com o cliente (a cadeira vazia): mãos gesticulam sobre a mesa
    talking(r, t) {
      const ph = cyc(t, 6);
      const a = win(ph, 0.05, 0.35);
      const b = win(ph, 0.45, 0.8);
      set(r.shoulderL, -0.58 - 0.25 * a, 0, 0.18 + 0.2 * a);
      set(r.shoulderR, -0.58 - 0.3 * b, 0, -0.18 - 0.22 * b);
      r.elbowL.rotation.set(
        -0.9 - 0.55 * a + 0.06 * Math.sin(t * 5) * a,
        0,
        -0.2,
      );
      r.elbowR.rotation.set(
        -0.9 - 0.6 * b + 0.06 * Math.sin(t * 5.5) * b,
        0,
        0.2,
      );
      set(r.torso, 0.16);
      set(r.head, 0.05 + 0.05 * Math.sin(t * 2.4), 0.12 * Math.sin(t * 0.8));
    },
    // Financeiro: a mão direita digita na calculadora, a esquerda segura o documento
    calculating(r, t) {
      const look = win(cyc(t, 8), 0.65, 0.9);
      const burst = win(cyc(t, 2.4), 0.05, 0.7, 0.1) * (1 - look);
      set(r.shoulderL, -0.55, 0, 0.2);
      r.elbowL.rotation.set(-1.1, 0, -0.3);
      set(r.shoulderR, -0.6, 0, -0.08);
      r.elbowR.rotation.set(
        -1.0 + 0.07 * Math.abs(Math.sin(t * 9)) * burst,
        0,
        0.05,
      );
      set(r.torso, 0.14);
      set(r.head, 0.4 - 0.35 * look, -0.12 + 0.2 * look);
    },
    // apresenta no quadro (à direita do personagem): aponta, depois fala com as mãos abertas
    presenting(r, t) {
      const ph = cyc(t, 6.5);
      const point = win(ph, 0.02, 0.48, 0.1);
      const open = win(ph, 0.52, 0.96, 0.1);
      // pose de base (entre um gesto e outro): mãos à frente, cotovelos dobrados
      const rest = 1 - point - open;
      set(
        r.shoulderR,
        -0.3 * point - 0.55 * open - 0.3 * rest,
        0,
        -0.1 - 1.15 * point - 0.18 * open,
      );
      r.elbowR.rotation.set(
        -0.15 * point - 0.85 * open - 0.9 * rest,
        0,
        0.2 * rest,
      );
      set(r.shoulderL, -0.25 - 0.4 * open, 0, 0.1 + 0.2 * open);
      r.elbowL.rotation.set(
        -0.8 - 0.25 * open + 0.05 * Math.sin(t * 4) * open,
        0,
        -0.2,
      );
      set(r.torso, 0.03, -0.12 * point);
      set(r.head, 0.02, -0.75 * point + 0.1 * open);
      r.hips.rotation.z = 0.03 * Math.sin(t * 0.8);
    },
    // lê na prancheta (segura com as duas mãos) e vira a página de tempos em tempos
    reading(r, t) {
      const flip = win(cyc(t, 5.5), 0.7, 0.92);
      set(r.shoulderL, -0.45, 0, 0.22);
      r.elbowL.rotation.set(-1.3, 0, -0.45);
      set(r.shoulderR, -0.45 - 0.25 * flip, 0, -0.22 - 0.2 * flip);
      r.elbowR.rotation.set(-1.3 + 0.45 * flip, 0, 0.45);
      set(r.torso, 0.06);
      set(r.head, 0.42, 0.05 * Math.sin(t * 0.6));
    },
    // Produto: organiza cartões na mesa alta (pega um, leva para o lado, solta)
    sorting(r, t) {
      const ph = cyc(t, 4.2);
      const lift = win(ph, 0.1, 0.45);
      const move = ss((ph - 0.25) / 0.3) * (1 - ss((ph - 0.7) / 0.25));
      set(r.shoulderL, -1.1, 0, 0.12);
      r.elbowL.rotation.set(-0.5, 0, -0.2);
      set(r.shoulderR, -1.12 - 0.25 * lift, 0, -0.08 - 0.35 * move);
      r.elbowR.rotation.set(-0.45 - 0.2 * lift, 0, 0.1);
      set(r.torso, 0.18);
      set(r.head, 0.5, -0.2 * move);
    },
    // Operações: levanta a caixa na bancada, apoia e passa a fita
    packing(r, t, p) {
      const ph = cyc(t, 5);
      const lift = win(ph, 0.08, 0.4);
      const tape = win(ph, 0.5, 0.92);
      // mãos nas laterais da caixa, na altura do tampo da bancada
      set(r.shoulderL, -1.22 - 0.2 * lift, 0, 0.06);
      r.elbowL.rotation.set(-0.32 - 0.15 * lift, 0, -0.1);
      set(
        r.shoulderR,
        -1.22 - 0.2 * lift - 0.1 * tape,
        0,
        -0.06 + 0.3 * tape * Math.sin(t * 3),
      );
      r.elbowR.rotation.set(-0.32 - 0.15 * lift, 0, 0.1);
      set(r.torso, 0.12 - 0.06 * lift);
      set(r.head, 0.45);
      if (p.box && p.boxY !== undefined) p.box.position.y = p.boxY + 0.1 * lift;
    },
  };

export function applyGesture(g: Gesture, r: Rig, t: number, p: GestureProps) {
  idle(r, t);
  GESTURES[g](r, t, p);
}
