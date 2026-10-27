"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CUBE_SIZE, DEPARTMENTS, type DepartmentId } from "../config/constants";
import type { FloorKey } from "@/content/types";
import { labelAnchor } from "../labelAnchors";
import type { LabelRefs } from "./CubeLabels";
import { createIconAtlas, ICON_ORDER } from "./iconAtlas";
import { createHaloMaterial, createIconMaterial, createLedCubeMaterial } from "./ledCubeMaterial";

const COUNT = DEPARTMENTS.length;
const HALO_SCALE = CUBE_SIZE * 2.6;
const ICON_SCALE = CUBE_SIZE * 0.74;
/** clique só conta se o ponteiro andou menos que isso (senão foi arraste de câmera) */
const CLICK_TOLERANCE_PX = 6;
/** altura de um rótulo DOM (px): dois rótulos a menos que isso se sobrepõem */
const LABEL_H = 22;

/** Alvos de estado: luz (energy) e realce de borda (focus). */
const STATE = {
  idle: { energy: 1, focus: 0 },
  active: { energy: 1.28, focus: 0.75 }, // hover ou foco de teclado
  selected: { energy: 1.5, focus: 1 },
  dimmed: { energy: 0.55, focus: 0 }, // outro cubo está selecionado
};
/** rapidez das transições (amortecimento exponencial: sem overshoot nem bounce) */
const RESPONSE = 14;
const PULSE_AMPLITUDE = 0.05;

interface CubeFieldProps {
  selectedId: DepartmentId | null;
  activeId: DepartmentId | null;
  onSelect: (id: DepartmentId | null) => void;
  onHover: (id: DepartmentId | null) => void;
  labelRefs: LabelRefs;
  reducedMotion: boolean;
  /** clique habilitado (no rooftop anônimo só o hover reage, sem revelar a área) */
  interactive?: boolean;
  /** andar onde os rótulos ancoram (null = sobre os cubos) */
  labelFloor?: FloorKey | null;
}

const tmp = new THREE.Object3D();
const iconOffset = new THREE.Vector3();
const labelPos = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/**
 * Os oito BLOCKS do rooftop: cubo de LED + ícone + halo, instanciados (3 draw calls).
 * Cubos parados (a marca não "flutua"); o idle é só uma pulsação suave da luz.
 * Toda a animação roda num único useFrame (sem timelines por cubo), que também
 * projeta a posição dos rótulos DOM.
 */
export function CubeField({
  selectedId,
  activeId,
  onSelect,
  onHover,
  labelRefs,
  reducedMotion,
  interactive = true,
  labelFloor = null,
}: CubeFieldProps) {
  const anchors = useMemo(() => DEPARTMENTS.map((d) => labelAnchor(d, labelFloor)), [labelFloor]);
  const cubeRef = useRef<THREE.InstancedMesh>(null);
  const haloRef = useRef<THREE.InstancedMesh>(null);
  const iconRef = useRef<THREE.InstancedMesh>(null);
  const size = useThree((s) => s.size);
  const pointerHover = useRef<number | null>(null);

  const res = useMemo(() => {
    const energy = new THREE.InstancedBufferAttribute(new Float32Array(COUNT).fill(1), 1);
    const focus = new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1);
    const cell = new THREE.InstancedBufferAttribute(
      new Float32Array(DEPARTMENTS.map((d) => ICON_ORDER.indexOf(d.icon))),
      1,
    );
    energy.setUsage(THREE.DynamicDrawUsage);
    focus.setUsage(THREE.DynamicDrawUsage);

    const cubeGeo = new RoundedBoxGeometry(1, 1, 1, 4, 0.07);
    cubeGeo.setAttribute("aEnergy", energy);
    cubeGeo.setAttribute("aFocus", focus);
    const haloGeo = new THREE.PlaneGeometry(1, 1);
    haloGeo.setAttribute("aEnergy", energy);
    const iconGeo = new THREE.PlaneGeometry(1, 1);
    iconGeo.setAttribute("aCell", cell);

    const atlas = createIconAtlas();
    return {
      energy,
      focus,
      cubeGeo,
      haloGeo,
      iconGeo,
      atlas,
      cubeMat: createLedCubeMaterial(),
      haloMat: createHaloMaterial(),
      iconMat: createIconMaterial(atlas),
      // estado amortecido (CPU) e fase própria de cada cubo para o idle não sincronizar
      current: DEPARTMENTS.map(() => ({ energy: 1, focus: 0 })),
      phase: DEPARTMENTS.map((_, i) => i * 1.7),
    };
  }, []);

  useEffect(
    () => () => {
      [res.cubeGeo, res.haloGeo, res.iconGeo, res.cubeMat, res.haloMat, res.iconMat, res.atlas].forEach(
        (r) => r.dispose(),
      );
    },
    [res],
  );

  const selectedIndex = DEPARTMENTS.findIndex((d) => d.id === selectedId);
  const activeIndex = DEPARTMENTS.findIndex((d) => d.id === activeId);

  // cursor de ponteiro só enquanto o mouse está sobre um cubo
  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  const writeMatrices = () => {
    const cube = cubeRef.current;
    const halo = haloRef.current;
    const icon = iconRef.current;
    if (!cube || !halo || !icon) return;
    DEPARTMENTS.forEach((d, i) => {
      const yaw = Math.PI / 4 + d.cube.rotY;
      tmp.position.set(d.cube.x, d.cube.y, d.cube.z);
      tmp.rotation.set(0, yaw, 0);
      tmp.scale.setScalar(CUBE_SIZE);
      tmp.updateMatrix();
      cube.setMatrixAt(i, tmp.matrix);

      tmp.scale.setScalar(HALO_SCALE);
      tmp.updateMatrix();
      halo.setMatrixAt(i, tmp.matrix);

      // ícone colado na face frontal (+Z local), um fio à frente para não brigar com a face
      iconOffset.set(0, 0, CUBE_SIZE / 2 + 0.006).applyAxisAngle(UP, yaw);
      tmp.position.add(iconOffset);
      tmp.scale.setScalar(ICON_SCALE);
      tmp.updateMatrix();
      icon.setMatrixAt(i, tmp.matrix);
    });
    cube.instanceMatrix.needsUpdate = true;
    halo.instanceMatrix.needsUpdate = true;
    icon.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => {
    writeMatrices();
    cubeRef.current?.computeBoundingSphere();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    DEPARTMENTS.forEach((_, i) => {
      const target =
        i === selectedIndex
          ? STATE.selected
          : i === activeIndex
            ? STATE.active
            : selectedIndex >= 0
              ? STATE.dimmed
              : STATE.idle;
      const c = res.current[i];
      c.energy = THREE.MathUtils.damp(c.energy, target.energy, RESPONSE, dt);
      c.focus = THREE.MathUtils.damp(c.focus, target.focus, RESPONSE, dt);
      const pulse = reducedMotion ? 1 : 1 + PULSE_AMPLITUDE * Math.sin(t * 1.25 + res.phase[i]);
      res.energy.setX(i, c.energy * pulse);
      res.focus.setX(i, c.focus);
    });
    res.energy.needsUpdate = true;
    res.focus.needsUpdate = true;
    // projeta os rótulos DOM sobre os cubos (8 transforms por frame, sem re-render)
    const labels = labelRefs.current;
    const placed: { el: HTMLButtonElement; x: number; y: number; w: number; pri: number; visible: boolean }[] = [];
    DEPARTMENTS.forEach((d, i) => {
      const el = labels[i];
      if (!el) return;
      labelPos.set(...anchors[i]).project(state.camera);
      // fora da tela ou atrás da câmera: some (o rótulo não fica focável sem ser visto)
      const visible = labelPos.z < 1 && Math.abs(labelPos.x) < 1.02 && Math.abs(labelPos.y) < 1.02;
      const pri = d.id === selectedId ? 3 : d.id === activeId ? 2 : 1;
      placed.push({
        el,
        x: (labelPos.x * 0.5 + 0.5) * size.width,
        y: (-labelPos.y * 0.5 + 0.5) * size.height,
        w: el.offsetWidth || 80,
        pri,
        visible,
      });
    });
    // colisão na fachada (ex.: FINANCEIRO sobre OPERAÇÕES): o de menor prioridade desce uma linha
    placed.sort((a, b) => a.x - b.x);
    for (let a = 0; a < placed.length; a++) {
      for (let b = a + 1; b < placed.length; b++) {
        const p = placed[a];
        const q = placed[b];
        if (q.x - p.x > (p.w + q.w) / 2 + 6) break;
        const dy = q.y - p.y;
        if (Math.abs(dy) >= LABEL_H) continue;
        const lower = q.pri <= p.pri ? q : p;
        lower.y += LABEL_H - Math.abs(dy);
      }
    }
    for (const p of placed) {
      p.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      p.el.style.visibility = p.visible ? "visible" : "hidden";
    }
  });

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // dispositivos sem hover (toque): só seleção por toque
    if (e.pointerType !== "mouse" || e.instanceId === undefined) return;
    if (pointerHover.current !== e.instanceId) {
      pointerHover.current = e.instanceId;
      document.body.style.cursor = interactive ? "pointer" : "";
      onHover(DEPARTMENTS[e.instanceId].id);
    }
  };

  const onPointerOut = () => {
    if (pointerHover.current === null) return;
    pointerHover.current = null;
    document.body.style.cursor = "";
    onHover(null);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive || e.delta > CLICK_TOLERANCE_PX || e.instanceId === undefined) return;
    const id = DEPARTMENTS[e.instanceId].id;
    onSelect(id);
  };

  const noRaycast = () => null;

  return (
    <group name="cube-field">
      <instancedMesh
        ref={cubeRef}
        args={[res.cubeGeo, res.cubeMat, COUNT]}
        onPointerMove={onPointerMove}
        onPointerOut={onPointerOut}
        onClick={onClick}
        dispose={null}
      />
      <instancedMesh
        ref={iconRef}
        args={[res.iconGeo, res.iconMat, COUNT]}
        raycast={noRaycast}
        renderOrder={1}
        dispose={null}
      />
      <instancedMesh
        ref={haloRef}
        args={[res.haloGeo, res.haloMat, COUNT]}
        raycast={noRaycast}
        frustumCulled={false}
        renderOrder={-1}
        dispose={null}
      />
    </group>
  );
}
