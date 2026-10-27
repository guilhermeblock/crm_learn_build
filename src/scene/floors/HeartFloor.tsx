"use client";

import { useMemo } from "react";
import { DEPARTMENTS, LEVELS, type DepartmentId } from "../config/constants";
import { BucketMeshes } from "../props/BucketMeshes";
import {
  block,
  chair,
  createBuckets,
  deskIsland,
  floorOutline,
  plant,
  shift,
} from "../props/furniture";
import { departmentPod } from "./departmentPods";

/**
 * HEART · pessoas e processos. Na faixa da frente, o posto de cada área (onde o
 * fio da área chega), com mobiliário do contexto dela. No interior, os espaços
 * compartilhados: reunião, lounge e uma ilha aberta. 8 figuras: uma por área (limite do briefing).
 * Lime só como SIGNAL: contorno no piso do posto da área selecionada.
 */
export function HeartFloor({
  selectedId,
}: {
  selectedId: DepartmentId | null;
}) {
  const buckets = useMemo(() => {
    const b = createBuckets();
    const y = LEVELS.heart;

    for (const d of DEPARTMENTS) departmentPod(b, d, y);

    // reunião compartilhada no centro, voltada para a quina
    const meet = { x: 0.2, z: 0.2, rot: Math.PI / 4 };
    block(b, meet, y, "deskLight", [0, 0.58, 0], [2.0, 0.05, 0.95]);
    block(b, meet, y, "metal", [0, 0.28, 0], [0.12, 0.56, 0.6]);
    for (const dx of [-0.65, 0.65]) {
      chair(b, { ...shift(meet, dx, 0.75), rot: meet.rot }, y);
      chair(b, { ...shift(meet, dx, -0.75), rot: meet.rot + Math.PI }, y);
    }

    // ilha aberta ao fundo (profundidade) e lounge
    deskIsland(b, { x: -3.6, z: -3.6 }, y, { n: 2 });
    const sofa = { x: -5.6, z: -0.2, rot: Math.PI / 2 };
    block(b, sofa, y, "sofa", [0, 0.2, 0], [2.0, 0.4, 0.8]);
    block(b, sofa, y, "sofa", [0, 0.55, -0.32], [2.0, 0.5, 0.16]);
    block(
      b,
      { x: -4.7, z: -0.2, rot: Math.PI / 2 },
      y,
      "deskDark",
      [0, 0.22, 0],
      [1.0, 0.04, 0.5],
    );

    plant(b, { x: -6.0, z: -6.0 }, y, 1.0);
    plant(b, { x: -1.0, z: -6.0 }, y, 0.9);
    plant(b, { x: -6.0, z: 2.2 }, y, 0.8);
    return b;
  }, []);

  // SIGNAL de seleção: separado, para não remontar o andar inteiro
  const signal = useMemo(() => {
    const b = createBuckets();
    const d = DEPARTMENTS.find((x) => x.id === selectedId);
    if (d) floorOutline(b, shift(d.zone, 0, -0.35), LEVELS.heart, 1.55, 2.0);
    return b;
  }, [selectedId]);

  return (
    <>
      <BucketMeshes buckets={buckets} />
      <BucketMeshes buckets={signal} />
    </>
  );
}
