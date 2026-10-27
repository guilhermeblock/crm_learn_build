"use client";

import { useMemo } from "react";
import { BUILDING, fasciaBottomAbove, FIN, FLOORS, HALF_D, HALF_W, LEVELS } from "../config/constants";
import type { MaterialName } from "../config/materials";
import { Block } from "../props/Block";
import { InstancedBlocks, type BlockInstance } from "../props/InstancedBlocks";
import { FloorPlate } from "./FloorPlate";

const FINISH: Record<(typeof FLOORS)[number]["id"], MaterialName> = {
  brain: "floorBrain",
  heart: "floorHeart",
  backbone: "floorBackbone",
};

/** ritmo das pilastras nas paredes de fundo */
const PILASTER_SPACING = 1.75;
const COLUMN = 0.26;
const FIN_WIDTH = BUILDING.finWidth;

/**
 * Casca em corte: paredes de fundo (-X, -Z) fechadas, fachadas +X/+Z abertas
 * sem pilares na frente, empena sólida à esquerda (para os textos) e quatro lajes.
 */
export function BuildingShell() {
  const towerBottom = LEVELS.backbone - BUILDING.slabThickness;
  const towerHeight = LEVELS.rooftop - towerBottom;
  const towerMid = towerBottom + towerHeight / 2;
  const wt = BUILDING.wallThickness;

  // único pilar aparente: quina do fundo à direita. A quina da frente fica livre
  // (as lajes balançam), para não cortar a visão dos pavimentos.
  const columns = useMemo<BlockInstance[]>(
    () => [
      {
        position: [HALF_W - COLUMN / 2, towerMid, -HALF_D + COLUMN / 2],
        size: [COLUMN, towerHeight, COLUMN],
      },
    ],
    [towerHeight, towerMid],
  );

  // pilastras internas nas paredes de fundo (ritmo de janelas)
  const pilasters = useMemo<BlockInstance[]>(() => {
    const items: BlockInstance[] = [];
    for (let p = -HALF_W + PILASTER_SPACING; p < HALF_W; p += PILASTER_SPACING) {
      items.push({
        position: [p, towerMid, -HALF_D + wt + 0.06],
        size: [0.16, towerHeight, 0.12],
      });
      items.push({
        position: [-HALF_W + wt + 0.06, towerMid, p],
        size: [0.12, towerHeight, 0.16],
      });
    }
    return items;
  }, [towerHeight, towerMid, wt]);

  const glassInset = 0.36;
  const startX = -HALF_W + FIN_WIDTH;

  return (
    <group name="building-shell">
      {/* paredes de fundo */}
      <Block size={[BUILDING.width, towerHeight, wt]} position={[0, towerMid, -HALF_D + wt / 2]} />
      <Block size={[wt, towerHeight, BUILDING.depth]} position={[-HALF_W + wt / 2, towerMid, 0]} />

      {/* empena sólida (painel de rótulos no concept; aqui sem texto) */}
      <Block
        size={[FIN_WIDTH, towerHeight + 0.3, FIN.depth]}
        position={[-HALF_W + FIN_WIDTH / 2, towerMid + 0.15, FIN.z]}
        material="concreteDark"
      />

      {FLOORS.map((floor) => {
        const bottom = floor.base + 0.03;
        const top = fasciaBottomAbove(floor.id);
        const h = top - bottom;
        return (
          <group key={`facade-${floor.id}`}>
            {/* vidro de fachada (+Z e +X): reflexo leve, interior continua legível */}
            <Block
              size={[HALF_W - glassInset - startX, h, 0.02]}
              position={[(startX + HALF_W - glassInset) / 2, bottom + h / 2, HALF_D - glassInset]}
              material="facadeGlass"
              shadows={false}
            />
            <Block
              size={[0.02, h, BUILDING.depth - glassInset * 2]}
              position={[HALF_W - glassInset, bottom + h / 2, 0]}
              material="facadeGlass"
              shadows={false}
            />
            {/* empena: ranhura na linha da laje (título e subtítulo ficam em FloorSigns) */}
            <Block
              size={[FIN_WIDTH + 0.02, 0.05, 0.02]}
              position={[-HALF_W + FIN_WIDTH / 2, floor.base - 0.25, FIN.front + 0.005]}
              material="ground"
              shadows={false}
            />
          </group>
        );
      })}

      <InstancedBlocks items={columns} material="metal" />
      <InstancedBlocks items={pilasters} material="concreteLight" castShadow={false} />

      {FLOORS.map((floor) => (
        <FloorPlate key={floor.id} y={floor.base} finish={FINISH[floor.id]} />
      ))}
      <FloorPlate y={LEVELS.rooftop} finish="concreteLight" roof />
    </group>
  );
}
