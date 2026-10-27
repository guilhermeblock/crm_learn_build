"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { BUILDING, fasciaBottomAbove, FIN, FLOORS, HALF_W, type FloorId } from "../config/constants";
import { BRAND } from "../config/palette";

/** Título + subtítulo de cada pavimento, e a cor de INDEX acima do título (como no concept). */
export const FLOOR_SIGNS: Record<FloorId, { title: string; subtitle: [string, string]; index: string }> = {
  brain: { title: "BRAIN", subtitle: ["Objetivos e", "Estratégias"], index: BRAND.blue },
  heart: { title: "HEART", subtitle: ["Pessoas e", "Processos"], index: BRAND.lime },
  backbone: { title: "BACKBONE", subtitle: ["Dados e", "Tecnologia"], index: BRAND.offWhite },
};

/** margem da placa dentro da faixa do pavimento na empena */
const INSET_X = 0.32;
const INSET_TOP = 0.42;
/** a placa ocupa a metade de cima da faixa: o texto fica alto, como no concept */
const HEIGHT_RATIO = 0.62;
/** largura da textura: ~2× o tamanho máximo da placa na tela (vista Heart) */
const TEX_W = 640;

function cssFont(variable: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v || fallback;
}

/** Desenha a placa (fundo transparente) e devolve a textura. */
function drawSign(id: FloorId, aspect: number, family: string): THREE.CanvasTexture {
  const { title, subtitle, index } = FLOOR_SIGNS[id];
  const w = TEX_W;
  const h = Math.round(TEX_W / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d")!;
  const pad = w * 0.06;

  // INDEX: barra curta na cor do pavimento
  c.fillStyle = index;
  c.fillRect(pad, pad, w * 0.16, w * 0.018);

  // título: o maior que couber na largura (BACKBONE é o mais longo)
  let size = w * 0.2;
  c.font = `700 ${size}px ${family}`;
  const maxW = w - pad * 2;
  const measured = c.measureText(title).width;
  if (measured > maxW) {
    size *= maxW / measured;
    c.font = `700 ${size}px ${family}`;
  }
  c.fillStyle = BRAND.offWhite;
  c.textBaseline = "alphabetic";
  const titleY = pad + w * 0.06 + size * 0.82;
  c.fillText(title, pad, titleY);

  // subtítulo em duas linhas, mais leve
  const sub = w * 0.105;
  c.font = `600 ${sub}px ${family}`;
  c.fillStyle = "rgba(233, 232, 226, 0.8)";
  subtitle.forEach((line, i) => c.fillText(line, pad, titleY + sub * 1.35 * (i + 1)));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

interface Sign {
  id: FloorId;
  width: number;
  height: number;
  center: [number, number, number];
}

/**
 * Placas da empena: título e subtítulo de cada pavimento, em Barlow, desenhados
 * em textura de canvas depois que a fonte carrega (texto curto: não é "texto extenso em 3D").
 */
export function FloorSigns() {
  const signs = useMemo<Sign[]>(() => {
    const width = BUILDING.finWidth - INSET_X * 2;
    return FLOORS.map((floor) => {
      const top = fasciaBottomAbove(floor.id) - INSET_TOP;
      const band = top - floor.base;
      const height = band * HEIGHT_RATIO;
      return {
        id: floor.id,
        width,
        height,
        center: [-HALF_W + BUILDING.finWidth / 2, top - height / 2, FIN.front + 0.012],
      };
    });
  }, []);

  const [textures, setTextures] = useState<THREE.CanvasTexture[] | null>(null);

  useEffect(() => {
    let alive = true;
    let made: THREE.CanvasTexture[] = [];
    const family = cssFont("--font-barlow", "Barlow, Arial, sans-serif");
    // espera a Barlow (as duas espessuras); se falhar, desenha com o fallback
    Promise.all([document.fonts.load(`700 64px ${family}`), document.fonts.load(`600 32px ${family}`)])
      .catch(() => undefined)
      .then(() => {
        if (!alive) return;
        made = signs.map((s) => drawSign(s.id, s.width / s.height, family));
        setTextures(made);
      });
    return () => {
      alive = false;
      made.forEach((t) => t.dispose());
    };
  }, [signs]);

  const materials = useMemo(
    () =>
      textures?.map(
        (map) => new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, toneMapped: false }),
      ) ?? null,
    [textures],
  );
  useEffect(() => () => materials?.forEach((m) => m.dispose()), [materials]);

  if (!materials) return null;
  return (
    <group name="floor-signs">
      {signs.map((s, i) => (
        <mesh key={s.id} position={s.center} material={materials[i]}>
          <planeGeometry args={[s.width, s.height]} />
        </mesh>
      ))}
    </group>
  );
}
