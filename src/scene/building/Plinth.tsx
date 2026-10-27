"use client";

import { useMemo } from "react";
import { BUILDING, HALF_D, HALF_W, LEVELS, PLINTH } from "../config/constants";
import { Block } from "../props/Block";
import { InstancedBlocks, type BlockInstance } from "../props/InstancedBlocks";

const STEPS = 4;
const STAIR_WIDTH = 3.2;
const STAIR_X = -1.6;
const RUN = 0.45;

type Vec3 = [number, number, number];

type TreeBase = "planter" | "terrace" | "ground";

/** árvores do terraço e do entorno (x, z, escala, onde estão apoiadas) */
const TREES: [number, number, number, TreeBase][] = [
  [3.2, 9.6, 0.75, "planter"],
  [6.6, 9.6, 0.65, "planter"],
  [9.6, 6.8, 0.75, "planter"],
  [9.6, 2.2, 0.6, "planter"],
  [9.6, -3.6, 0.7, "planter"],
  [-6.2, 9.4, 0.7, "terrace"],
  [12.8, 11.6, 0.9, "ground"],
  [-9.4, 12.6, 0.85, "ground"],
  [13.2, -1.5, 0.8, "ground"],
];
const PLANTER_TOP = 0.5;

/**
 * Chão, terraço com paisagismo, pódio/lobby aceso sob o Backbone e escada.
 * Como no concept: base habitada e quente, sem competir com o prédio.
 * Só emissivos e peças instanciadas (nenhuma luz dinâmica nova).
 */
export function Plinth() {
  const th = PLINTH.terraceHeight;
  const lobbyBottom = th;
  const lobbyTop = LEVELS.backbone - BUILDING.slabThickness;
  const lobbyH = lobbyTop - lobbyBottom;
  const terraceFront = PLINTH.terraceDepth / 2;
  const terraceSide = PLINTH.terraceWidth / 2;
  const lobbyFace = HALF_D - 0.45;

  const parts = useMemo(() => {
    const steps: BlockInstance[] = [];
    const stepLeds: BlockInstance[] = [];
    for (let i = 0; i < STEPS; i++) {
      const h = th * ((STEPS - i) / STEPS);
      const z = terraceFront + RUN * (i + 0.5);
      steps.push({ position: [STAIR_X, h / 2, z], size: [STAIR_WIDTH, h, RUN] });
      stepLeds.push({ position: [STAIR_X, h - 0.03, z + RUN / 2 - 0.03], size: [STAIR_WIDTH - 0.2, 0.025, 0.025] });
    }

    // balizadores baixos nas bordas do terraço (frente e lateral direita)
    const posts: BlockInstance[] = [];
    const caps: BlockInstance[] = [];
    const post = (x: number, z: number) => {
      posts.push({ position: [x, th + 0.22, z], size: [0.12, 0.44, 0.12] });
      caps.push({ position: [x, th + 0.46, z], size: [0.12, 0.04, 0.12] });
    };
    for (let x = -terraceSide + 1; x <= terraceSide - 1; x += 2.2) {
      if (Math.abs(x - STAIR_X) > STAIR_WIDTH / 2 + 0.3) post(x, terraceFront - 0.18);
    }
    for (let z = -terraceSide + 1; z < terraceFront - 1; z += 2.2) post(terraceSide - 0.18, z);

    // árvores: tronco + copa + brilho quente no chão (uplight falso)
    const trunks: BlockInstance[] = [];
    const crowns: BlockInstance[] = [];
    const glows: BlockInstance[] = [];
    for (const [x, z, s, on] of TREES) {
      const base = on === "planter" ? th + PLANTER_TOP : on === "terrace" ? th : LEVELS.ground;
      trunks.push({ position: [x, base + 0.45 * s, z], size: [0.12 * s, 0.9 * s, 0.12 * s] });
      crowns.push({ position: [x, base + 1.3 * s, z], size: [1.6 * s, 1.15 * s, 1.6 * s] });
      glows.push({ position: [x, base + 0.012, z], size: [2.6 * s, 1, 2.6 * s] });
    }
    return { steps, stepLeds, posts, caps, trunks, crowns, glows };
  }, [th, terraceFront, terraceSide]);

  // janelas do lobby na face +X (faixa quente contínua) e na +Z (entrada)
  const lobbyWindows: { position: Vec3; size: Vec3 }[] = [
    { position: [lobbyFace + 0.01, lobbyBottom + lobbyH * 0.46, 0.4], size: [0.02, lobbyH * 0.5, BUILDING.depth - 3.2] },
    { position: [2.9, lobbyBottom + lobbyH * 0.46, lobbyFace + 0.01], size: [5.0, lobbyH * 0.5, 0.02] },
  ];

  return (
    <group name="plinth">
      {/* piso externo levemente acetinado: segura reflexo do ambiente */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, LEVELS.ground, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#0b0b0c" roughness={0.62} metalness={0.15} envMapIntensity={0.35} />
      </mesh>

      {/* terraço + escada com LED nos degraus */}
      <Block size={[PLINTH.terraceWidth, th, PLINTH.terraceDepth]} position={[0, th / 2, 0]} material="concreteDark" />
      <InstancedBlocks items={parts.steps} material="concreteDark" />
      <InstancedBlocks items={parts.stepLeds} material="lobbyWarm" castShadow={false} receiveShadow={false} />

      {/* pódio/lobby recuado, aceso por dentro */}
      <Block
        size={[BUILDING.width - 0.9, lobbyH, BUILDING.depth - 0.9]}
        position={[0, lobbyBottom + lobbyH / 2, 0]}
        material="concrete"
      />
      {lobbyWindows.map((w, i) => (
        <Block key={i} size={w.size} position={w.position} material="lobbyWindow" shadows={false} />
      ))}
      {/* entrada: portal recuado mais claro + vidro */}
      <Block
        size={[STAIR_WIDTH, lobbyH * 0.82, 0.02]}
        position={[STAIR_X, lobbyBottom + (lobbyH * 0.82) / 2, lobbyFace + 0.01]}
        material="lobbyEntrance"
        shadows={false}
      />
      <Block
        size={[STAIR_WIDTH + 0.3, 0.12, 0.5]}
        position={[STAIR_X, lobbyBottom + lobbyH * 0.82 + 0.06, lobbyFace + 0.2]}
        material="fascia"
      />

      {/* jardineiras com vegetação baixa */}
      <Block size={[5, PLANTER_TOP, 1.1]} position={[HALF_W - 2, th + PLANTER_TOP / 2, terraceFront - 0.9]} />
      <Block size={[1.1, PLANTER_TOP, 5]} position={[terraceSide - 0.9, th + PLANTER_TOP / 2, HALF_D - 2.5]} />
      <Block size={[1.1, PLANTER_TOP, 4]} position={[terraceSide - 0.9, th + PLANTER_TOP / 2, -HALF_D + 3]} />

      <InstancedBlocks items={parts.posts} material="metal" castShadow={false} />
      <InstancedBlocks items={parts.caps} material="lobbyWarm" castShadow={false} receiveShadow={false} />
      <InstancedBlocks items={parts.trunks} geometry="cylinder" material="metal" />
      <InstancedBlocks items={parts.crowns} geometry="sphere" material="plant" />
      <InstancedBlocks items={parts.glows} geometry="disc" material="groundGlow" castShadow={false} receiveShadow={false} />
    </group>
  );
}
