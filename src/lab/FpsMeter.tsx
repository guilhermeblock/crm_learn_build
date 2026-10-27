"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

declare global {
  interface Window {
    __labFps?: number;
    __labFrames?: number;
  }
}

/** Mede FPS dentro do loop do R3F e reporta 2× por segundo. */
export function FpsMeter({ onSample }: { onSample: (fps: number) => void }) {
  const acc = useRef({ frames: 0, time: 0, total: 0 });

  useFrame((_, delta) => {
    const a = acc.current;
    a.frames += 1;
    a.total += 1;
    a.time += delta;
    window.__labFrames = a.total;
    if (a.time >= 0.5) {
      const fps = a.frames / a.time;
      window.__labFps = fps;
      onSample(fps);
      a.frames = 0;
      a.time = 0;
    }
  });

  return null;
}
