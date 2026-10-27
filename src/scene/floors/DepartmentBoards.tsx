"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { DEPARTMENTS, LEVELS, type DepartmentId } from "../config/constants";
import { BucketMeshes } from "../props/BucketMeshes";
import { block, createBuckets, shift } from "../props/furniture";
import { COLS, drawBoards } from "./boardCharts";

/** quadro na zona da área: um pouco para dentro, voltado para a fachada (+Z local) */
export const BOARD = {
  z: -0.35,
  width: 1.25,
  height: 0.78,
  bottom: 0.95,
} as const;

/** Atlas com os quadros das oito áreas (desenho em boardCharts.ts). */
function createBoardAtlas(): {
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
} {
  const canvas = document.createElement("canvas");
  drawBoards(canvas, "Barlow, Arial, sans-serif");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return { texture, canvas };
}

const LEVEL = { default: 0.95, selected: 1.35, dimmed: 0.55 };

interface DepartmentBoardsProps {
  selectedId: DepartmentId | null;
}

/** BRAIN: o quadro de indicadores de cada área, onde o cabo da área chega. */
export function DepartmentBoards({ selectedId }: DepartmentBoardsProps) {
  const res = useMemo(() => {
    const { texture: atlas, canvas } = createBoardAtlas();
    const plane = new THREE.PlaneGeometry(1, 1);
    const rows = Math.ceil(DEPARTMENTS.length / COLS);
    // um material por quadro, todos compartilhando a mesma imagem (uma só textura na GPU)
    const materials = DEPARTMENTS.map((_, i) => {
      const map = atlas.clone();
      map.repeat.set(1 / COLS, 1 / rows);
      map.offset.set((i % COLS) / COLS, 1 - (Math.floor(i / COLS) + 1) / rows);
      return new THREE.MeshBasicMaterial({ map, toneMapped: false });
    });
    return {
      atlas,
      canvas,
      plane,
      materials,
      level: DEPARTMENTS.map(() => LEVEL.default),
    };
  }, []);

  useEffect(
    () => () => {
      res.materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      res.atlas.dispose();
      res.plane.dispose();
    },
    [res],
  );

  // redesenha com a Barlow da marca assim que ela carregar (antes: fonte de reserva)
  useEffect(() => {
    let alive = true;
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-barlow")
      .trim();
    const family = v || "Barlow, Arial, sans-serif";
    Promise.all([
      document.fonts.load(`700 30px ${family}`),
      document.fonts.load(`600 15px ${family}`),
    ])
      .catch(() => undefined)
      .then(() => {
        if (!alive) return;
        drawBoards(res.canvas, family);
        res.materials.forEach((m) => {
          if (m.map) m.map.needsUpdate = true;
        });
      });
    return () => {
      alive = false;
    };
  }, [res]);

  // estrutura (moldura, pés) e pessoas: estáticas, em baldes
  const buckets = useMemo(() => {
    const b = createBuckets();
    const y = LEVELS.brain;
    DEPARTMENTS.forEach((d, i) => {
      const p = shift(d.zone, 0, BOARD.z);
      block(
        b,
        p,
        y,
        "fascia",
        [0, BOARD.bottom + BOARD.height / 2, -0.03],
        [BOARD.width + 0.08, BOARD.height + 0.08, 0.04],
      );
      block(
        b,
        p,
        y,
        "metal",
        [-BOARD.width / 2 + 0.08, BOARD.bottom / 2, -0.03],
        [0.04, BOARD.bottom, 0.04],
      );
      block(
        b,
        p,
        y,
        "metal",
        [BOARD.width / 2 - 0.08, BOARD.bottom / 2, -0.03],
        [0.04, BOARD.bottom, 0.04],
      );
      block(b, p, y, "metal", [0, 0.02, -0.03], [BOARD.width * 0.7, 0.04, 0.3]);
    });
    return b;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    DEPARTMENTS.forEach((d, i) => {
      const target = !selectedId
        ? LEVEL.default
        : d.id === selectedId
          ? LEVEL.selected
          : LEVEL.dimmed;
      res.level[i] = THREE.MathUtils.damp(res.level[i], target, 12, dt);
      res.materials[i].color.setScalar(res.level[i]);
    });
  });

  return (
    <group name="department-boards">
      <BucketMeshes buckets={buckets} />
      {DEPARTMENTS.map((d, i) => {
        const p = shift(d.zone, 0, BOARD.z);
        return (
          <mesh
            key={d.id}
            geometry={res.plane}
            material={res.materials[i]}
            position={[
              p.x,
              LEVELS.brain + BOARD.bottom + BOARD.height / 2,
              p.z,
            ]}
            rotation={[0, d.zone.rot, 0]}
            scale={[BOARD.width, BOARD.height, 1]}
            dispose={null}
          />
        );
      })}
    </group>
  );
}
