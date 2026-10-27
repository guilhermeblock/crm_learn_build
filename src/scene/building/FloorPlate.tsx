"use client";

import { BUILDING, HALF_D, HALF_W, ROOF_FASCIA_FACTOR, ROOF_SLAB_FACTOR } from "../config/constants";
import type { MaterialName } from "../config/materials";
import { Block } from "../props/Block";

interface FloorPlateProps {
  /** topo da laje (nível do piso) */
  y: number;
  finish: MaterialName;
  /** laje de cobertura: borda mais alta e mais pesada */
  roof?: boolean;
}

/** Laje + faixa de borda (fascia) bem legível + acabamento de piso. */
export function FloorPlate({ y, finish, roof = false }: FloorPlateProps) {
  const t = BUILDING.slabThickness * (roof ? ROOF_SLAB_FACTOR : 1);
  const fh = BUILDING.fasciaHeight * (roof ? ROOF_FASCIA_FACTOR : 1);
  const o = BUILDING.fasciaOverhang;
  const W = BUILDING.width + o * 2;
  const D = BUILDING.depth + o * 2;
  const band = 0.12;
  // a fascia sobe um pouco acima do piso (lábio) e desce abaixo da laje
  const fy = y + 0.05 - fh / 2;

  return (
    <group name={roof ? "roof-plate" : `floor-plate-${y}`}>
      <Block size={[BUILDING.width, t, BUILDING.depth]} position={[0, y - t / 2, 0]} />
      <Block
        size={[BUILDING.width - 0.5, 0.02, BUILDING.depth - 0.5]}
        position={[0, y + 0.01, 0]}
        material={finish}
        castShadow={false}
      />
      {/* fascia nas quatro bordas */}
      <Block size={[W, fh, band]} position={[0, fy, HALF_D + o - band / 2]} material="fascia" />
      <Block size={[W, fh, band]} position={[0, fy, -HALF_D - o + band / 2]} material="fascia" />
      <Block size={[band, fh, D]} position={[HALF_W + o - band / 2, fy, 0]} material="fascia" />
      <Block size={[band, fh, D]} position={[-HALF_W - o + band / 2, fy, 0]} material="fascia" />
    </group>
  );
}
