"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

interface LightingRigProps {
  keyIntensity: number;
  exposure: number;
}

/**
 * Luz de maquete arquitetônica: ambiente moderado, key com sombra,
 * fill frio e rim. O Environment é procedural (Lightformers), sem HDR externo,
 * só para dar reflexo aos metais.
 */
export function LightingRig({ keyIntensity, exposure }: LightingRigProps) {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);

  return (
    <>
      <hemisphereLight args={["#c8d2ee", "#0c0c0d", 0.5]} />
      <directionalLight
        position={[20, 34, 12]}
        intensity={keyIntensity}
        color="#f1f0ea"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={26}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={90}
      />
      <directionalLight position={[-18, 12, 22]} intensity={0.45} color="#9fb4ff" />
      <directionalLight position={[-10, 18, -24]} intensity={0.6} color="#c9d6ff" />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.2} position={[0, 12, 10]} scale={[20, 6, 1]} />
        <Lightformer form="rect" intensity={0.6} position={[-14, 6, 0]} rotation-y={Math.PI / 2} scale={[16, 4, 1]} color="#9fb4ff" />
        <Lightformer form="rect" intensity={0.4} position={[14, 4, -6]} rotation-y={-Math.PI / 2} scale={[16, 3, 1]} />
      </Environment>
    </>
  );
}
