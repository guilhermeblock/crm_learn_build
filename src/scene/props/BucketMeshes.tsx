"use client";

import type { MaterialName } from "../config/materials";
import type { Buckets, Shape } from "./furniture";
import { InstancedBlocks } from "./InstancedBlocks";

/** materiais emissivos/finos não precisam projetar sombra */
const NO_SHADOW = new Set<MaterialName>(["screen", "cubePad", "nodeBlue", "signalLine", "cloudGlow", "wallPanel"]);

/** Desenha cada balde (material + geometria) como uma única InstancedMesh. */
export function BucketMeshes({ buckets }: { buckets: Buckets }) {
  return (
    <>
      {[...buckets.entries()].map(([key, items]) => {
        const [material, shape] = key.split("|") as [MaterialName, Shape];
        const shadow = !NO_SHADOW.has(material);
        return (
          <InstancedBlocks
            key={key}
            items={items}
            material={material}
            geometry={shape}
            castShadow={shadow}
            receiveShadow={shadow}
          />
        );
      })}
    </>
  );
}
