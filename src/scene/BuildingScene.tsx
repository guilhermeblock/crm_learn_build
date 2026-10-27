"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { FpsMeter } from "@/lab/FpsMeter";
import type { LabSettings } from "@/lab/settings";
import { BuildingWorld } from "./BuildingWorld";
import { CameraRig } from "./CameraRig";
import { VIEWS, type DepartmentId } from "./config/constants";
import { PostFX } from "./PostFX";
import type { LabelRefs } from "./rooftop/CubeLabels";

interface BuildingSceneProps {
  settings: LabSettings;
  instant: boolean;
  /** câmera livre (px, py, pz, tx, ty, tz), só no laboratório */
  cam?: [number, number, number, number, number, number] | null;
  selectedId: DepartmentId | null;
  activeId: DepartmentId | null;
  onSelect: (id: DepartmentId | null) => void;
  onHover: (id: DepartmentId | null) => void;
  labelRefs: LabelRefs;
  reducedMotion: boolean;
  onFps: (fps: number) => void;
}

/** Cena do laboratório: mundo + vistas fixas + painel de luz/bloom. */
export function BuildingScene({
  settings,
  instant,
  cam = null,
  selectedId,
  activeId,
  onSelect,
  onHover,
  labelRefs,
  reducedMotion,
  onFps,
}: BuildingSceneProps) {
  const initial = VIEWS[settings.view];

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: settings.fov, near: 0.5, far: 220, position: initial.position }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      // clique no vazio limpa a seleção (arraste de câmera não conta)
      onPointerMissed={(e) => {
        if (e.type === "click") onSelect(null);
      }}
    >
      <BuildingWorld
        selectedId={selectedId}
        activeId={activeId}
        onSelect={onSelect}
        onHover={onHover}
        labelRefs={labelRefs}
        reducedMotion={reducedMotion}
        keyLight={settings.keyLight}
        exposure={settings.exposure}
      />
      <CameraRig view={settings.view} fov={settings.fov} orbit={settings.orbit} instant={instant} cam={cam} />
      <PostFX bloom={settings.bloom} />
      <FpsMeter onSample={onFps} />
    </Canvas>
  );
}
