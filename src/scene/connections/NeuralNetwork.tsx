"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { CONNECTED_DEPARTMENTS, DEPARTMENTS, PULSING_DEPARTMENTS, type DepartmentId } from "../config/constants";
import { InstancedBlocks, type BlockInstance } from "../props/InstancedBlocks";
import { createNeuralMaterial } from "./neuralMaterial";
import { RELATIONS } from "@/content/relations";
import { buildNeuron, buildRelation, type Filament } from "./neuralPaths";
import { taperedTube } from "./taperedTube";

/** sem seleção: azul baixo; selecionado acende; os outros recuam */
const EMPHASIS = { default: 0.72, hover: 1.35, selected: 1.9, dimmed: 0.28 };
const NODE: [number, number, number] = [0.14, 0.14, 0.14];
const SYNAPSE: [number, number, number] = [0.085, 0.085, 0.085];

const CONNECTED = DEPARTMENTS.filter((d) => CONNECTED_DEPARTMENTS.includes(d.id));

function mergeFilaments(filaments: Filament[]) {
  const parts = filaments.map((f) => taperedTube(f.curve, { r0: f.r0, r1: f.r1, startDist: f.startDist }));
  const merged = mergeGeometries(parts);
  parts.forEach((g) => g.dispose());
  return merged;
}

const vec = (p: THREE.Vector3): [number, number, number] => [p.x, p.y, p.z];

/**
 * CONNECTION como sinapse: um neurônio por área (cubo = corpo) + a trama de
 * relações entre áreas. 8 meshes de neurônio + 2 de relações + pontos instanciados.
 */
interface NeuralNetworkProps {
  selectedId: DepartmentId | null;
  /** hover/foco: o filamento da área se destaca, sem fixar seleção */
  hoverId?: DepartmentId | null;
  /** áreas cujo impulso corre sem seleção (demonstração no laboratório) */
  pulsingIds?: DepartmentId[];
  /** impulso sobe do Backbone para o corpo: o dado volta para a decisão */
  pulseUp?: boolean;
  reducedMotion?: boolean;
}

export function NeuralNetwork({
  selectedId,
  hoverId = null,
  pulsingIds = PULSING_DEPARTMENTS,
  pulseUp = false,
  reducedMotion = false,
}: NeuralNetworkProps) {
  const neurons = useMemo(
    () =>
      CONNECTED.map((d) => {
        const n = buildNeuron(d);
        return { ...n, geometry: mergeFilaments(n.filaments), material: createNeuralMaterial({ reach: n.reach }) };
      }),
    [],
  );
  const relations = useMemo(() => RELATIONS.map((r, i) => ({ ...r, filament: buildRelation(r, i) })), []);
  // repouso (azul baixo) · as 3 relações centrais (um pouco mais fortes) · as da área selecionada
  const relationMaterials = useMemo(
    () => ({
      idle: createNeuralMaterial({ strength: 1.3 }),
      key: createNeuralMaterial({ strength: 2.6 }),
      active: createNeuralMaterial({ strength: 3.2 }),
    }),
    [],
  );

  useEffect(
    () => () => {
      neurons.forEach((n) => {
        n.geometry.dispose();
        n.material.dispose();
      });
      Object.values(relationMaterials).forEach((m) => m.dispose());
    },
    [neurons, relationMaterials],
  );

  // relações da área selecionada acendem junto (remonta só quando a seleção muda)
  const relationGeo = useMemo(() => {
    const isActive = (r: (typeof relations)[number]) => r.a === selectedId || r.b === selectedId;
    const pick = (test: (r: (typeof relations)[number]) => boolean) => {
      const list = relations.filter(test).map((r) => r.filament);
      return list.length ? mergeFilaments(list) : null;
    };
    return {
      idle: pick((r) => !isActive(r) && !r.key),
      key: pick((r) => !isActive(r) && Boolean(r.key)),
      active: pick(isActive),
    };
  }, [relations, selectedId]);
  useEffect(
    () => () => {
      relationGeo.idle?.dispose();
      relationGeo.key?.dispose();
      relationGeo.active?.dispose();
    },
    [relationGeo],
  );

  // pontos de ramificação e sinapses
  const points = useMemo(() => {
    const idle: BlockInstance[] = [];
    const active: BlockInstance[] = [];
    const lime: BlockInstance[] = [];
    for (const n of neurons) {
      const on = n.id === selectedId;
      for (const p of n.nodes) (on ? active : idle).push({ position: vec(p), size: NODE });
      for (const s of n.synapses) {
        const target = on ? (s.floor === "heart" ? lime : active) : idle;
        target.push({ position: vec(s.p), size: SYNAPSE });
      }
    }
    return { idle, active, lime };
  }, [neurons, selectedId]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    for (const n of neurons) {
      const u = n.material.uniforms;
      const selected = n.id === selectedId;
      const active = !reducedMotion && (selected || pulsingIds.includes(n.id));
      u.uActive.value = active ? 1 : 0;
      u.uDirection.value = pulseUp ? -1 : 1;
      if (active) u.uTime.value += dt;
      const target = selected
        ? EMPHASIS.selected
        : n.id === hoverId
          ? EMPHASIS.hover
          : selectedId
            ? EMPHASIS.dimmed
            : EMPHASIS.default;
      u.uEmphasis.value = THREE.MathUtils.damp(u.uEmphasis.value, target, 12, dt);
    }
    for (const m of [relationMaterials.idle, relationMaterials.key]) {
      const e = m.uniforms.uEmphasis;
      e.value = THREE.MathUtils.damp(e.value, selectedId ? EMPHASIS.dimmed : EMPHASIS.default, 12, dt);
    }
    relationMaterials.active.uniforms.uEmphasis.value = 1;
  });

  return (
    <group name="neural-network">
      {neurons.map((n) => (
        <mesh key={n.id} name={`neuron-${n.id}`} geometry={n.geometry} material={n.material} renderOrder={2} dispose={null} />
      ))}
      {relationGeo.idle && <mesh geometry={relationGeo.idle} material={relationMaterials.idle} renderOrder={2} dispose={null} />}
      {relationGeo.key && <mesh geometry={relationGeo.key} material={relationMaterials.key} renderOrder={2} dispose={null} />}
      {relationGeo.active && (
        <mesh geometry={relationGeo.active} material={relationMaterials.active} renderOrder={2} dispose={null} />
      )}
      <InstancedBlocks items={points.idle} geometry="sphere" material="synapseIdle" castShadow={false} receiveShadow={false} />
      <InstancedBlocks items={points.active} geometry="sphere" material="synapseActive" castShadow={false} receiveShadow={false} />
      <InstancedBlocks items={points.lime} geometry="sphere" material="nodeLime" castShadow={false} receiveShadow={false} />
    </group>
  );
}
