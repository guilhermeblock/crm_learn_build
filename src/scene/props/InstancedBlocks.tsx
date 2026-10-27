"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useKit, type MaterialName } from "../config/materials";

type Vec3 = [number, number, number];

export interface BlockInstance {
  position: Vec3;
  size: Vec3;
  /** rotação em Y (radianos) */
  rotationY?: number;
}

interface InstancedBlocksProps {
  items: BlockInstance[];
  material?: MaterialName | THREE.Material;
  geometry?: "box" | "cylinder" | "sphere" | "ring" | "disc";
  castShadow?: boolean;
  receiveShadow?: boolean;
}

const tmp = new THREE.Object3D();

/** Várias caixas (ou cilindros) com o mesmo material numa única draw call. */
export function InstancedBlocks({
  items,
  material = "concrete",
  geometry = "box",
  castShadow = true,
  receiveShadow = true,
}: InstancedBlocksProps) {
  const { geometries, materials } = useKit();
  const ref = useRef<THREE.InstancedMesh>(null);
  const mat = typeof material === "string" ? materials[material] : material;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach((item, i) => {
      tmp.position.set(...item.position);
      tmp.rotation.set(0, item.rotationY ?? 0, 0);
      tmp.scale.set(...item.size);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    });
    mesh.count = items.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);

  // geometria/material são compartilhados: só o buffer de instâncias é deste mesh
  useLayoutEffect(() => {
    const mesh = ref.current;
    return () => mesh?.dispose();
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[geometries[geometry], mat, Math.max(items.length, 1)]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      dispose={null}
    />
  );
}
