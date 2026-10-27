"use client";

import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { VIEWS, type ViewId } from "./config/constants";

interface CameraRigProps {
  view: ViewId;
  fov: number;
  /** órbita livre com o mouse (inspeção) */
  orbit: boolean;
  /** pula a transição (usado nas capturas automáticas) */
  instant: boolean;
  /** câmera livre (px, py, pz, tx, ty, tz): vence a vista */
  cam?: [number, number, number, number, number, number] | null;
}

/**
 * Abaixo desta proporção (retrato, celular) o FOV abre para o prédio caber na largura.
 * Desktop (16:10, 16:9) fica intacto.
 */
const REFERENCE_ASPECT = 1.15;
const MAX_FOV = 80;

/**
 * FOV vertical que preserva a largura visível da proporção de referência:
 * em telas mais estreitas (retrato/celular) o campo abre em vez de cortar o prédio.
 */
export function fitFov(fov: number, aspect: number) {
  if (aspect >= REFERENCE_ASPECT) return fov;
  const half = THREE.MathUtils.degToRad(fov / 2);
  const fitted = 2 * Math.atan(Math.tan(half) * (REFERENCE_ASPECT / aspect));
  return Math.min(MAX_FOV, THREE.MathUtils.radToDeg(fitted));
}

/** Três vistas fixas do laboratório, trocadas sem recarregar a página. */
export function CameraRig({ view, fov, orbit, instant, cam = null }: CameraRigProps) {
  const controls = useRef<CameraControls>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const firstRun = useRef(true);

  useEffect(() => {
    camera.fov = fitFov(fov, aspect);
    camera.updateProjectionMatrix();
  }, [camera, fov, aspect]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const { position: p, target: t } = cam
      ? { position: cam.slice(0, 3), target: cam.slice(3) }
      : VIEWS[view];
    void c.setLookAt(p[0], p[1], p[2], t[0], t[1], t[2], !instant && !firstRun.current);
    firstRun.current = false;
  }, [view, instant, cam]);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      enabled={orbit}
      smoothTime={0.55}
      minDistance={8}
      maxDistance={70}
      // órbita presa ao quadrante frontal (+X/+Z): as fachadas fechadas nunca viram a frente
      minAzimuthAngle={THREE.MathUtils.degToRad(12)}
      maxAzimuthAngle={THREE.MathUtils.degToRad(78)}
      minPolarAngle={THREE.MathUtils.degToRad(38)}
      maxPolarAngle={THREE.MathUtils.degToRad(86)}
    />
  );
}
