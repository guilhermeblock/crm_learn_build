"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { fitFov } from "@/scene/CameraRig";
import type { Pose } from "./cameraPath";

declare global {
  interface Window {
    /** posição da câmera, só leitura: os testes medem a resposta do scroll */
    __xpCamera?: THREE.Vector3;
  }
}

const BASE_FOV = 36;
/** o deslocamento lateral só faz sentido com texto ao lado (desktop); some em telas estreitas */
function panScale(aspect: number) {
  return THREE.MathUtils.smoothstep(aspect, 0.9, 1.5);
}

/** folga (px) entre a área em foco e a borda do cartão/painel (lateral · vertical) */
const FOCUS_MARGIN = 110;
const FOCUS_MARGIN_Y = 28;
/** deslocamento máximo de enquadramento (unidades de cena) */
const FOCUS_MAX = 9;
const FOCUS_RESPONSE = 3.2;
/** abaixo desta proporção (retrato) o enquadramento é vertical: o conteúdo fica embaixo */
const PORTRAIT = 1.15;

interface Strip {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * Faixa livre da tela: entre o cartão (esquerda) e o painel (direita) no computador;
 * entre a barra do topo e a folha de baixo (cartão ou painel) no celular e no tablet em pé.
 * Lida do DOM de tempos em tempos (não a cada frame).
 */
function readFreeStrip(width: number, height: number): Strip {
  const r = (sel: string) => {
    const el = document.querySelector(sel);
    if (!el || getComputedStyle(el).display === "none") return null;
    return el.getBoundingClientRect();
  };
  const card = r(".chapter");
  const panel = r(".panel");
  const top = r(".xp__top");
  // cartão/painel embaixo (folha): estreitam a faixa na vertical, não na lateral
  const low = (b: DOMRect | null) => (b && b.top > 200 ? b.top : height);
  return {
    left: card && card.top < 200 ? card.right : 0,
    right: panel && panel.top < 200 ? panel.left : width,
    top: top ? top.bottom : 0,
    bottom: Math.min(low(card), low(panel)),
  };
}

/** deslocamento (px) que leva o intervalo [min, max] para dentro de [lo, hi] */
function fit(min: number, max: number, lo: number, hi: number) {
  if (hi <= lo) return 0;
  if (max - min > hi - lo) return (lo + hi) / 2 - (min + max) / 2;
  return min < lo ? lo - min : max > hi ? hi - max : 0;
}

interface ExperienceCameraProps {
  poseRef: RefObject<Pose>;
  /** pontos que precisam ficar visíveis (área escolhida e, no Heart, quem recebe a passagem) */
  focusRef: RefObject<THREE.Vector3[] | null>;
  reducedMotion: boolean;
}

/**
 * Aplica a pose que a timeline de scroll (GSAP) escreve em `poseRef`.
 * A cena só lê: quem anima é a timeline — um controlador por propriedade (storyboard §6).
 *
 * Enquadramento da área escolhida: se o ponto em foco cairia atrás do cartão ou do
 * painel, a câmera desliza só o necessário para ele ficar na faixa livre (sem zoom,
 * sem girar): de lado no computador, para cima/baixo no retrato (celular, tablet em pé).
 * Se já está visível, nada se move.
 */
export function ExperienceCamera({
  poseRef,
  focusRef,
  reducedMotion,
}: ExperienceCameraProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);
  const extra = useRef({ side: 0, up: 0 });
  const strip = useRef<Strip & { frame: number }>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    frame: 0,
  });
  const tmp = useMemo(
    () => ({ ndc: new THREE.Vector3(), view: new THREE.Vector3() }),
    [],
  );

  useEffect(() => {
    window.__xpCamera = camera.position;
    return () => {
      delete window.__xpCamera;
    };
  }, [camera]);

  useEffect(() => {
    camera.fov = fitFov(BASE_FOV, aspect);
    camera.updateProjectionMatrix();
  }, [camera, aspect]);

  useFrame((_, delta) => {
    const p = poseRef.current;
    // vetor "esquerda" da câmera no plano XZ: a câmera anda para a esquerda,
    // o prédio vai para o lado direito da tela e a coluna de texto fica livre
    const dx = p.px - p.tx;
    const dz = p.pz - p.tz;
    const len = Math.hypot(dx, dz) || 1;
    const lx = -dz / len;
    const lz = dx / len;
    const s = p.pan * panScale(aspect);
    camera.position.set(p.px + lx * s, p.py, p.pz + lz * s);
    camera.lookAt(p.tx + lx * s, p.ty, p.tz + lz * s);

    // quanto deslocar para a área em foco sair de trás do cartão/painel
    let wantSide = 0;
    let wantUp = 0;
    const focus = focusRef.current;
    if (focus?.length) {
      if (strip.current.frame++ % 20 === 0)
        Object.assign(strip.current, readFreeStrip(size.width, size.height));
      const st = strip.current;
      camera.updateMatrixWorld();
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      let depth = 0;
      let behind = false;
      for (const f of focus) {
        tmp.ndc.copy(f).project(camera);
        behind ||= tmp.ndc.z >= 1;
        const sx = (tmp.ndc.x * 0.5 + 0.5) * size.width;
        const sy = (-tmp.ndc.y * 0.5 + 0.5) * size.height;
        minX = Math.min(minX, sx);
        maxX = Math.max(maxX, sx);
        minY = Math.min(minY, sy);
        maxY = Math.max(maxY, sy);
        depth +=
          -tmp.view.copy(f).applyMatrix4(camera.matrixWorldInverse).z /
          focus.length;
      }
      if (!behind) {
        const focal =
          size.height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        // andar Δ leva o ponto Δ·focal/profundidade px na tela (para a direita / para baixo)
        const toWorld = (px: number) =>
          THREE.MathUtils.clamp((px * depth) / focal, -FOCUS_MAX, FOCUS_MAX);
        if (aspect >= PORTRAIT)
          wantSide = toWorld(
            fit(minX, maxX, st.left + FOCUS_MARGIN, st.right - FOCUS_MARGIN),
          );
        else
          wantUp = toWorld(
            fit(
              minY,
              maxY,
              st.top + FOCUS_MARGIN_Y,
              st.bottom - FOCUS_MARGIN_Y,
            ),
          );
      }
    }
    const k = Math.min(delta, 0.1);
    const ex = extra.current;
    ex.side = reducedMotion
      ? wantSide
      : THREE.MathUtils.damp(ex.side, wantSide, FOCUS_RESPONSE, k);
    ex.up = reducedMotion
      ? wantUp
      : THREE.MathUtils.damp(ex.up, wantUp, FOCUS_RESPONSE, k);
    if (Math.abs(ex.side) > 1e-3 || Math.abs(ex.up) > 1e-3) {
      // lateral: anda para a "esquerda" da câmera; vertical: sobe a câmera e o alvo juntos
      camera.position.set(
        camera.position.x + lx * ex.side,
        camera.position.y + ex.up,
        camera.position.z + lz * ex.side,
      );
      camera.lookAt(
        p.tx + lx * (s + ex.side),
        p.ty + ex.up,
        p.tz + lz * (s + ex.side),
      );
    }
  });

  return null;
}
