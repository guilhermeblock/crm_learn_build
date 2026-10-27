"use client";

import { useMemo } from "react";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import {
  BUILDING,
  ceilingOf,
  fasciaBottomAbove,
  FLOORS,
  HALF_D,
  HALF_W,
  type FloorId,
} from "../config/constants";
import type { MaterialName } from "../config/materials";
import { InstancedBlocks, type BlockInstance } from "../props/InstancedBlocks";

RectAreaLightUniformsLib.init();

interface FloorLight {
  color: string;
  intensity: number;
  led: MaterialName;
}

/** Temperatura de cada pavimento: Brain frio, Heart quente (humano), Backbone técnico. */
export const FLOOR_LIGHT: Record<FloorId, FloorLight> = {
  brain: { color: "#cdd8ff", intensity: 3.2, led: "ledCool" },
  heart: { color: "#ffd9a6", intensity: 3.3, led: "ledWarm" },
  backbone: { color: "#dfe7f5", intensity: 1.3, led: "ledBackbone" },
};

const LED = 0.05;

/** Luz interna: área no teto + sanca nas paredes de fundo + linha sob a borda da laje. */
export function FloorLighting() {
  const strips = useMemo(() => {
    const byMaterial = new Map<MaterialName, BlockInstance[]>();
    for (const floor of FLOORS) {
      const led = FLOOR_LIGHT[floor.id].led;
      const list = byMaterial.get(led) ?? [];
      const ceil = ceilingOf(floor.id);
      const inner = BUILDING.wallThickness + 0.2;
      // sanca contínua nas duas paredes de fundo
      list.push({ position: [0, ceil - 0.18, -HALF_D + inner], size: [BUILDING.width - 1, LED, LED] });
      list.push({ position: [-HALF_W + inner, ceil - 0.18, 0], size: [LED, LED, BUILDING.depth - 1] });
      // linha na base da fascia da laje de cima (separa os andares na vista geral)
      const y = fasciaBottomAbove(floor.id) + LED / 2;
      const out = BUILDING.fasciaOverhang + LED / 2 + 0.005;
      const startX = -HALF_W + BUILDING.finWidth;
      const lenX = HALF_W + out - startX;
      list.push({ position: [startX + lenX / 2, y, HALF_D + out], size: [lenX, LED, LED] });
      list.push({ position: [HALF_W + out, y, 0], size: [LED, LED, BUILDING.depth + out * 2] });
      byMaterial.set(led, list);
    }
    return [...byMaterial.entries()];
  }, []);

  return (
    <group name="floor-lighting">
      {FLOORS.map((floor) => {
        const cfg = FLOOR_LIGHT[floor.id];
        return (
          <rectAreaLight
            key={floor.id}
            args={[cfg.color, cfg.intensity, BUILDING.width - 1.5, BUILDING.depth - 1.5]}
            position={[0, ceilingOf(floor.id) - 0.02, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        );
      })}
      {strips.map(([material, items]) => (
        <InstancedBlocks key={material} items={items} material={material} castShadow={false} receiveShadow={false} />
      ))}
    </group>
  );
}
