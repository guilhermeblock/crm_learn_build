"use client";

import { useMemo } from "react";
import {
  ANCHOR_ROW,
  CONNECTED_DEPARTMENTS,
  DEPARTMENTS,
  LEVELS,
  TERMINAL_HEIGHT,
} from "../config/constants";
import { BucketMeshes } from "../props/BucketMeshes";
import { block, createBuckets, rack } from "../props/furniture";

/** barramento externo: liga os 8 terminais junto às fachadas */
const BUS = 4.15;
/** barramento interno (fundo) e eixos que fecham a malha */
const BACK = -4.6;
const SPINE = 1.6;
/** o módulo cloud ocupa uma posição da fileira, do mesmo porte de um rack */
const CLOUD = { x: -2.2, z: 2.5 };

/**
 * BACKBONE · dados e tecnologia. Infraestrutura distribuída: fileiras de racks,
 * um terminal por área (onde o fio da área termina) e bandejas em MALHA
 * (anel externo + anel interno + dois eixos). Nada converge para um centro:
 * o cloud é só mais um nó da fileira. Nenhum servidor faz papel de "CRM";
 * o CRM é o prédio inteiro funcionando.
 */
export function BackboneFloor() {
  const buckets = useMemo(() => {
    const b = createBuckets();
    const y = LEVELS.backbone;
    const quarter = Math.PI / 2;
    const tray = (x: number, z: number, lx: number, lz: number) =>
      block(b, { x, z }, y, "metalLight", [0, 0.04, 0], [lx, 0.08, lz]);

    // fileiras em "L" (frentes voltadas para a câmera) + fileiras ao fundo
    for (let x = -5.4; x <= 0.7; x += 0.8) {
      if (Math.abs(x - CLOUD.x) > 0.3) rack(b, { x, z: 2.5 }, y, { h: 1.6 });
    }
    for (let z = -5.4; z <= 0.7; z += 0.8)
      rack(b, { x: 2.5, z, rot: quarter }, y, { h: 1.6 });
    for (let x = -5.4; x <= 0.3; x += 0.8)
      rack(b, { x, z: -5.5 }, y, { h: 1.4 });
    for (let z = -4.2; z <= 0.4; z += 0.8)
      rack(b, { x: -5.5, z, rot: quarter }, y, { h: 1.4 });

    // terminais das áreas, sob cada coluna, com derivação até o barramento externo
    for (const d of DEPARTMENTS) {
      rack(b, { x: d.anchor.x, z: d.anchor.z, rot: Math.PI / 4 }, y, {
        h: TERMINAL_HEIGHT,
        connected: CONNECTED_DEPARTMENTS.includes(d.id),
      });
      const stub = ANCHOR_ROW - BUS - 0.45;
      if (d.anchor.z === ANCHOR_ROW)
        tray(d.anchor.x, BUS + stub / 2, 0.16, stub);
      else tray(BUS + stub / 2, d.anchor.z, stub, 0.16);
    }

    // malha de bandejas
    tray(-1.0, BUS, 10.4, 0.3);
    tray(BUS, -1.0, 0.3, 10.4);
    tray((-4.9 + SPINE) / 2, BACK, SPINE + 4.9, 0.24);
    tray(BACK, (-4.9 + SPINE) / 2, 0.24, SPINE + 4.9);
    tray(SPINE, (BACK + BUS) / 2, 0.24, BUS - BACK);
    tray((BACK + BUS) / 2, SPINE, BUS - BACK, 0.24);

    // módulo cloud: um nó da fileira, do porte de um rack
    block(b, CLOUD, y, "fascia", [0, 0.6, 0], [0.75, 1.2, 0.75]);
    block(b, CLOUD, y, "backPanel", [0, 0.6, 0.377], [0.64, 1.08, 0.02]);
    block(
      b,
      CLOUD,
      y,
      "cloudGlow",
      [-0.1, 0.78, 0.39],
      [0.26, 0.26, 0.01],
      "cylinder",
    );
    block(
      b,
      CLOUD,
      y,
      "cloudGlow",
      [0.1, 0.84, 0.39],
      [0.3, 0.3, 0.01],
      "cylinder",
    );
    block(b, CLOUD, y, "cloudGlow", [0, 0.7, 0.39], [0.44, 0.1, 0.01]);
    block(b, CLOUD, y, "nodeBlue", [0, 1.22, 0], [0.5, 0.04, 0.5]);
    return b;
  }, []);

  return <BucketMeshes buckets={buckets} />;
}
