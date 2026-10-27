"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { BuildingWorld, type BuildingWorldProps } from "@/scene/BuildingWorld";
import { PostFX } from "@/scene/PostFX";
import { FpsMeter } from "@/lab/FpsMeter";
import { CHAPTER_POSES, type Pose } from "./cameraPath";
import { ExperienceCamera } from "./ExperienceCamera";

interface ExperienceCanvasProps extends BuildingWorldProps {
  poseRef: RefObject<Pose>;
  /** ponto da área escolhida que não pode ficar atrás do cartão/painel */
  focusRef: RefObject<THREE.Vector3[] | null>;
  /** o 3D segue pesado mesmo na resolução mínima (a experiência oferece o modo texto) */
  onStruggle?: () => void;
}

const start = CHAPTER_POSES.rooftop;

/**
 * Resolução de render (dpr) por dispositivo: toque começa mais leve (celular e tablet
 * aquecem e gastam bateria); o monitor de desempenho baixa para 1 se o FPS cair e
 * volta ao teto se sobrar folga.
 */
function dprCeiling() {
  if (typeof window === "undefined") return 1.5;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  return touch ? 1.4 : 1.75;
}

/**
 * GPU integrada (Intel UHD/Iris, Mali, Adreno): começa no modo leve, sem esperar o
 * monitor de desempenho perceber. Medido: Intel UHD a 1440×900 fazia 7–12 fps no modo cheio.
 */
function isIntegratedGpu(gl: THREE.WebGLRenderer) {
  try {
    const ctx = gl.getContext();
    const ext = ctx.getExtension("WEBGL_debug_renderer_info");
    const name = ext ? String(ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    return /(Intel|UHD|Iris|Mali|Adreno|PowerVR|SwiftShader|llvmpipe)/i.test(name);
  } catch {
    return false;
  }
}

/**
 * Aparelho fraco: já no modo leve e na resolução mínima, abaixo de 24 fps numa janela
 * de 4 s (depois de 5 s de aquecimento). Aba escondida não conta (o navegador para o loop).
 */
function StruggleWatch({
  active,
  onStruggle,
}: {
  active: boolean;
  onStruggle?: () => void;
}) {
  const s = useRef({ warm: 0, time: 0, frames: 0, slow: 0, done: false });
  useFrame((_, delta) => {
    const w = s.current;
    if (w.done || !onStruggle) return;
    if (w.warm < 5) {
      w.warm += delta;
      return;
    }
    if (!active) {
      w.time = w.frames = w.slow = 0;
      return;
    }
    w.time += Math.min(delta, 1);
    w.frames += 1;
    if (w.time < 4) return;
    w.slow = w.frames / w.time < 24 ? w.slow + 1 : 0;
    w.time = w.frames = 0;
    if (w.slow >= 1) {
      w.done = true;
      onStruggle();
    }
  });
  return null;
}

/** Canvas fixo atrás da história: o scroll da página move a câmera, o prédio é sempre o mesmo. */
export function ExperienceCanvas({
  poseRef,
  focusRef,
  onStruggle,
  onSelect,
  ...world
}: ExperienceCanvasProps) {
  const [ceiling] = useState(dprCeiling);
  const [dpr, setDpr] = useState(ceiling);
  // qualidade: cheia (bloom, MSAA) ou leve. Degraus: dpr teto → dpr 1 → leve → dpr 0,75
  const [lite, setLite] = useState(false);
  const decline = () => {
    if (dpr > 1) setDpr(1);
    else if (!lite) setLite(true);
    else setDpr(0.75);
  };
  const incline = () => {
    if (dpr < 1) setDpr(1);
    else if (!lite) setDpr(ceiling);
  };
  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{
        fov: 36,
        near: 0.5,
        far: 220,
        position: [start.px, start.py, start.pz],
      }}
      // o toque vertical continua rolando a página por cima do 3D
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        if (isIntegratedGpu(gl)) {
          setLite(true);
          setDpr(1);
        }
      }}
    >
      <PerformanceMonitor onDecline={decline} onIncline={incline} />
      <BuildingWorld {...world} onSelect={onSelect} />
      <ExperienceCamera
        poseRef={poseRef}
        focusRef={focusRef}
        reducedMotion={world.reducedMotion}
      />
      <PostFX bloom={0.8} lite={lite} />
      <FpsMeter onSample={() => undefined} />
      <StruggleWatch active={lite && dpr <= 1} onStruggle={onStruggle} />
    </Canvas>
  );
}
