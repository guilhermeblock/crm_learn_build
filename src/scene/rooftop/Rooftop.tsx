"use client";

import { useMemo } from "react";
import { DEPARTMENTS, HALF_D, HALF_W, LEVELS, type DepartmentId } from "../config/constants";
import { Block } from "../props/Block";
import { InstancedBlocks, type BlockInstance } from "../props/InstancedBlocks";
import type { FloorKey } from "@/content/types";
import { CubeField } from "./CubeField";
import type { LabelRefs } from "./CubeLabels";

const RAIL_HEIGHT = 1.0;
const POST_SPACING = 1.4;
const CURB = 0.28;

interface RooftopProps {
  selectedId: DepartmentId | null;
  activeId: DepartmentId | null;
  onSelect: (id: DepartmentId | null) => void;
  onHover: (id: DepartmentId | null) => void;
  labelRefs: LabelRefs;
  reducedMotion: boolean;
  interactive?: boolean;
  labelFloor?: FloorKey | null;
}

/** Guarda-corpo, poucos módulos de serviço e os oito cubos (protagonistas). */
export function Rooftop({
  selectedId,
  activeId,
  onSelect,
  onHover,
  labelRefs,
  reducedMotion,
  interactive,
  labelFloor,
}: RooftopProps) {
  const top = LEVELS.rooftop + 0.05;

  const { posts, rails } = useMemo(() => {
    const posts: BlockInstance[] = [];
    const rails: BlockInstance[] = [];
    const inset = 0.22;
    const hx = HALF_W - inset;
    const hz = HALF_D - inset;
    const postY = top + CURB + RAIL_HEIGHT / 2;

    const countX = Math.round((hx * 2) / POST_SPACING);
    const countZ = Math.round((hz * 2) / POST_SPACING);
    for (let i = 0; i <= countX; i++) {
      const x = -hx + (i * hx * 2) / countX;
      posts.push({ position: [x, postY, hz], size: [0.05, RAIL_HEIGHT, 0.05] });
      posts.push({ position: [x, postY, -hz], size: [0.05, RAIL_HEIGHT, 0.05] });
    }
    for (let i = 1; i < countZ; i++) {
      const z = -hz + (i * hz * 2) / countZ;
      posts.push({ position: [hx, postY, z], size: [0.05, RAIL_HEIGHT, 0.05] });
      posts.push({ position: [-hx, postY, z], size: [0.05, RAIL_HEIGHT, 0.05] });
    }
    for (const yy of [top + CURB + RAIL_HEIGHT, top + CURB + RAIL_HEIGHT * 0.5]) {
      rails.push({ position: [0, yy, hz], size: [hx * 2, 0.05, 0.05] });
      rails.push({ position: [0, yy, -hz], size: [hx * 2, 0.05, 0.05] });
      rails.push({ position: [hx, yy, 0], size: [0.05, 0.05, hz * 2] });
      rails.push({ position: [-hx, yy, 0], size: [0.05, 0.05, hz * 2] });
    }
    return { posts, rails };
  }, [top]);

  const glowLights = useMemo(() => {
    const groups = [DEPARTMENTS.slice(0, 3), DEPARTMENTS.slice(3, 5), DEPARTMENTS.slice(5)];
    return groups.map((g): [number, number, number] => [
      g.reduce((a, d) => a + d.cube.x, 0) / g.length,
      top + 1.4,
      g.reduce((a, d) => a + d.cube.z, 0) / g.length,
    ]);
  }, [top]);

  const curbs = useMemo<BlockInstance[]>(
    () => [
      { position: [0, top + CURB / 2, HALF_D - 0.1], size: [HALF_W * 2, CURB, 0.2] },
      { position: [0, top + CURB / 2, -HALF_D + 0.1], size: [HALF_W * 2, CURB, 0.2] },
      { position: [HALF_W - 0.1, top + CURB / 2, 0], size: [0.2, CURB, HALF_D * 2] },
      { position: [-HALF_W + 0.1, top + CURB / 2, 0], size: [0.2, CURB, HALF_D * 2] },
    ],
    [top],
  );

  return (
    <group name="rooftop">
      <InstancedBlocks items={curbs} material="fascia" />
      <InstancedBlocks items={posts} material="metalLight" castShadow={false} />
      <InstancedBlocks items={rails} material="metalLight" castShadow={false} />

      {/* módulos de serviço: poucos e baixos, no canto do fundo (a frente é dos cabos) */}
      <Block size={[1.6, 0.8, 1.2]} position={[-5.4, top + 0.4, -3.4]} material="concreteLight" />
      <Block size={[1.2, 0.8, 1.6]} position={[-2.4, top + 0.4, -5.8]} material="concreteLight" />
      <Block size={[1.2, 1.3, 1.2]} position={[-5.4, top + 0.65, -5.4]} material="metal" />

      <CubeField
        selectedId={selectedId}
        activeId={activeId}
        onSelect={onSelect}
        onHover={onHover}
        labelRefs={labelRefs}
        reducedMotion={reducedMotion}
        interactive={interactive}
        labelFloor={labelFloor}
      />

      {/* brilho azul que os cubos projetam no piso (3 luzes cobrindo os grupos de cubos) */}
      {glowLights.map((p, i) => (
        <pointLight key={i} position={p} color="#3a6bff" intensity={28} distance={9} decay={2} />
      ))}
    </group>
  );
}
