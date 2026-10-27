"use client";

import type { ThreeElements } from "@react-three/fiber";
import type * as THREE from "three";
import { useKit, type MaterialName } from "../config/materials";

type Vec3 = [number, number, number];

interface BlockProps extends Omit<ThreeElements["mesh"], "args" | "material" | "scale"> {
  /** tamanho [x, y, z] */
  size: Vec3;
  material?: MaterialName | THREE.Material;
  shadows?: boolean;
}

/** Caixa sólida usando a geometria unitária compartilhada. */
export function Block({ size, material = "concrete", shadows = true, ...rest }: BlockProps) {
  const { geometries, materials } = useKit();
  const mat = typeof material === "string" ? materials[material] : material;
  return (
    <mesh
      geometry={geometries.box}
      material={mat}
      scale={size}
      castShadow={shadows}
      receiveShadow={shadows}
      dispose={null}
      {...rest}
    />
  );
}
