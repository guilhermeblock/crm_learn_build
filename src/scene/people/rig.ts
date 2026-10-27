import * as THREE from "three";

/*
 * Personagem procedural articulado (sem GLB), no espírito de "The Sims":
 * formas arredondadas, proporções levemente estilizadas, roupas lisas.
 * Frente = +Z do personagem. Cada articulação é um Group que gira na própria origem;
 * os membros "pendem" para -Y a partir dela.
 */

export const BODY = {
  /** altura da bacia em pé / sentado (assento das cadeiras ≈ 0.41) */
  pelvisStand: 0.6,
  pelvisSit: 0.45,
  thigh: 0.29,
  shin: 0.29,
  torso: 0.36,
  shoulderX: 0.155,
  hipX: 0.068,
  upperArm: 0.22,
  forearm: 0.2,
  headR: 0.095,
} as const;

export interface Rig {
  root: THREE.Group;
  hips: THREE.Group;
  torso: THREE.Group;
  chest: THREE.Mesh;
  head: THREE.Group;
  shoulderL: THREE.Group;
  shoulderR: THREE.Group;
  elbowL: THREE.Group;
  elbowR: THREE.Group;
  handL: THREE.Group;
  handR: THREE.Group;
  thighL: THREE.Group;
  thighR: THREE.Group;
  kneeL: THREE.Group;
  kneeR: THREE.Group;
}

export interface Look {
  skin: THREE.Material;
  hair: THREE.Material;
  shirt: THREE.Material;
  pants: THREE.Material;
  shoes: THREE.Material;
  eyes: THREE.Material;
  /** cabelo curto (calota) ou preso (calota + coque) */
  bun: boolean;
}

export interface RigGeometries {
  torso: THREE.BufferGeometry;
  pelvis: THREE.BufferGeometry;
  upperArm: THREE.BufferGeometry;
  forearm: THREE.BufferGeometry;
  thigh: THREE.BufferGeometry;
  shin: THREE.BufferGeometry;
  hand: THREE.BufferGeometry;
  head: THREE.BufferGeometry;
  hair: THREE.BufferGeometry;
  bun: THREE.BufferGeometry;
  neck: THREE.BufferGeometry;
  eye: THREE.BufferGeometry;
  foot: THREE.BufferGeometry;
}

/** cápsula ao longo de Y com o comprimento TOTAL dado (pontas incluídas) */
function capsule(r: number, total: number) {
  return new THREE.CapsuleGeometry(r, Math.max(0.001, total - 2 * r), 4, 10);
}

export function createRigGeometries(): RigGeometries {
  return {
    torso: capsule(0.11, BODY.torso + 0.06),
    pelvis: capsule(0.085, 0.19).rotateZ(Math.PI / 2),
    upperArm: capsule(0.042, BODY.upperArm + 0.04),
    forearm: capsule(0.036, BODY.forearm + 0.03),
    thigh: capsule(0.058, BODY.thigh + 0.06),
    shin: capsule(0.046, BODY.shin + 0.04),
    hand: new THREE.SphereGeometry(0.04, 10, 8),
    head: new THREE.SphereGeometry(BODY.headR, 16, 12),
    // calota de cabelo: meia esfera um pouco maior que a cabeça, puxada para trás
    hair: new THREE.SphereGeometry(
      BODY.headR * 1.08,
      16,
      10,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.5,
    ),
    bun: new THREE.SphereGeometry(0.045, 10, 8),
    neck: new THREE.CylinderGeometry(0.035, 0.04, 0.07, 8),
    eye: new THREE.SphereGeometry(0.011, 8, 6),
    foot: new THREE.BoxGeometry(0.085, 0.05, 0.16),
  };
}

function mesh(g: THREE.BufferGeometry, m: THREE.Material, shadow = false) {
  const x = new THREE.Mesh(g, m);
  x.castShadow = shadow;
  x.receiveShadow = false;
  return x;
}

function joint(parent: THREE.Object3D, x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
}

export function buildRig(g: RigGeometries, look: Look): Rig {
  const root = new THREE.Group();
  const hips = joint(root, 0, BODY.pelvisStand, 0);
  hips.add(mesh(g.pelvis, look.pants, true));

  // tronco: gira na bacia (inclinar, respirar)
  const torso = joint(hips, 0, 0.02, 0);
  const chest = mesh(g.torso, look.shirt, true);
  chest.position.y = BODY.torso / 2;
  chest.scale.set(1.22, 1, 0.82);
  torso.add(chest);
  const neck = mesh(g.neck, look.skin);
  neck.position.y = BODY.torso + 0.06;
  torso.add(neck);

  const head = joint(torso, 0, BODY.torso + 0.1, 0);
  const skull = mesh(g.head, look.skin, true);
  skull.position.y = BODY.headR;
  skull.scale.set(0.95, 1.05, 1);
  head.add(skull);
  const hair = mesh(g.hair, look.hair);
  hair.position.set(0, BODY.headR + 0.012, -0.01);
  // a frente sobe (testa e olhos à mostra), a nuca desce
  hair.rotation.x = -0.5;
  head.add(hair);
  for (const side of [1, -1]) {
    const eye = mesh(g.eye, look.eyes);
    eye.position.set(side * 0.034, BODY.headR * 1.02, BODY.headR * 0.93);
    head.add(eye);
  }
  if (look.bun) {
    const bun = mesh(g.bun, look.hair);
    bun.position.set(0, BODY.headR * 1.55, -0.07);
    head.add(bun);
  }

  const arm = (side: 1 | -1) => {
    // esquerda do personagem = +X (frente +Z)
    const shoulder = joint(torso, side * BODY.shoulderX, BODY.torso - 0.02, 0);
    const upper = mesh(g.upperArm, look.shirt);
    upper.position.y = -BODY.upperArm / 2;
    shoulder.add(upper);
    const elbow = joint(shoulder, 0, -BODY.upperArm, 0);
    const fore = mesh(g.forearm, look.skin);
    fore.position.y = -BODY.forearm / 2;
    elbow.add(fore);
    const hand = joint(elbow, 0, -BODY.forearm - 0.02, 0);
    hand.add(mesh(g.hand, look.skin));
    // braços levemente afastados do corpo em repouso
    shoulder.rotation.z = side * 0.08;
    return { shoulder, elbow, hand };
  };
  const L = arm(1);
  const R = arm(-1);

  const leg = (side: 1 | -1) => {
    const thigh = joint(hips, side * BODY.hipX, -0.02, 0);
    const t = mesh(g.thigh, look.pants, true);
    t.position.y = -BODY.thigh / 2;
    thigh.add(t);
    const knee = joint(thigh, 0, -BODY.thigh, 0);
    const s = mesh(g.shin, look.pants, true);
    s.position.y = -BODY.shin / 2;
    knee.add(s);
    const foot = mesh(g.foot, look.shoes);
    foot.position.set(0, -BODY.shin - 0.005, 0.035);
    knee.add(foot);
    return { thigh, knee };
  };
  const LL = leg(1);
  const LR = leg(-1);

  return {
    root,
    hips,
    torso,
    chest,
    head,
    shoulderL: L.shoulder,
    shoulderR: R.shoulder,
    elbowL: L.elbow,
    elbowR: R.elbow,
    handL: L.hand,
    handR: R.hand,
    thighL: LL.thigh,
    thighR: LR.thigh,
    kneeL: LL.knee,
    kneeR: LR.knee,
  };
}

/** sentado: coxas para a frente, canelas para baixo, bacia na altura do assento */
export function sit(r: Rig) {
  r.hips.position.y = BODY.pelvisSit;
  for (const t of [r.thighL, r.thighR]) t.rotation.x = -Math.PI / 2;
  for (const k of [r.kneeL, r.kneeR]) k.rotation.x = Math.PI / 2;
  r.thighL.rotation.z = 0.06;
  r.thighR.rotation.z = -0.06;
}
