"use client";

import { useMemo } from "react";
import { HALF_D, HALF_W, LEVELS, type DepartmentId } from "../config/constants";
import { BucketMeshes } from "../props/BucketMeshes";
import { block, chair, createBuckets } from "../props/furniture";
import { DepartmentBoards } from "./DepartmentBoards";

/**
 * BRAIN · objetivos e estratégia. Na faixa da frente, o quadro de indicadores
 * de cada área (onde o cabo da área chega). No interior, a mesa de estratégia
 * compartilhada e a sala de decisão; painéis abstratos nas paredes do fundo.
 */
export function BrainFloor({
  selectedId,
}: {
  selectedId: DepartmentId | null;
}) {
  const buckets = useMemo(() => {
    const b = createBuckets();
    const y = LEVELS.brain;
    const quarter = Math.PI / 2;

    // painéis de parede nas duas paredes de fundo (profundidade)
    const wallZ = -HALF_D + 0.55;
    const wallX = -HALF_W + 0.55;
    for (const x of [-3.9, -0.5, 2.9]) {
      block(
        b,
        { x, z: wallZ },
        y,
        "wallPanel",
        [0, 2.35, 0],
        [2.6, 1.46, 0.03],
      );
    }
    for (const z of [-3.2, 0.4]) {
      block(
        b,
        { x: wallX, z, rot: quarter },
        y,
        "wallPanel",
        [0, 2.35, 0],
        [2.6, 1.46, 0.03],
      );
    }

    // mesa de estratégia compartilhada (redonda), seis lugares
    const table = { x: 0.2, z: 0.2 };
    block(b, table, y, "deskDark", [0, 0.6, 0], [2.3, 0.06, 2.3], "cylinder");
    block(b, table, y, "metal", [0, 0.29, 0], [0.4, 0.58, 0.4], "cylinder");
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const seat = {
        x: table.x + Math.sin(a) * 1.55,
        z: table.z + Math.cos(a) * 1.55,
        rot: a,
      };
      chair(b, seat, y);
    }

    // sala de decisão ao fundo: mesa retangular com quatro lugares
    const back = { x: -4.0, z: -4.0 };
    block(b, back, y, "deskDark", [0, 0.6, 0], [1.8, 0.05, 0.9]);
    block(b, back, y, "metal", [0, 0.29, 0], [0.12, 0.58, 0.5]);
    for (const dx of [-0.5, 0.5]) {
      chair(b, { x: back.x + dx, z: back.z + 0.72, rot: 0 }, y);
      chair(b, { x: back.x + dx, z: back.z - 0.72, rot: Math.PI }, y);
    }
    return b;
  }, []);

  return (
    <>
      <BucketMeshes buckets={buckets} />
      <DepartmentBoards selectedId={selectedId} />
    </>
  );
}
