"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  DEPARTMENTS,
  LEVELS,
  type Department,
  type DepartmentId,
} from "../config/constants";
import { useKit } from "../config/materials";
import { createNeuralMaterial } from "../connections/neuralMaterial";
import { heartBranchPoint, organic, rng } from "../connections/neuralPaths";
import { taperedTube } from "../connections/taperedTube";
import { shift } from "../props/furniture";
import { podTarget } from "./departmentPods";

/*
 * HEART · estações das subáreas (FR-06). Com uma área selecionada no capítulo Heart,
 * o posto dela se abre em 2–4 estações, uma por subárea, à frente do posto (na faixa
 * livre entre o posto e a coluna, voltada para a câmera). Clique numa estação = escolhe
 * a subárea no painel; escolher no painel acende a estação. A câmera não se move.
 * Lime só como SIGNAL: contorno da estação escolhida.
 */

/** z local das estações (o posto vai até ~0.65; a coluna da área fica em 1.55) */
const STATION_Z = 1.0;
/** zigue-zague: estações alternadas mais à frente, para se separarem na vista 3/4 */
const ZIGZAG = 0.32;
const SPACING = 1.08;
/** escala final da estação (um pouco maior que o mobiliário, para ler de longe) */
const SIZE = 1.15;
const PAD = { w: 0.78, d: 0.6 };
/** altura do rótulo DOM sobre a estação */
const LABEL_Y = 1.45;
/** atraso entre estações, em fração da abertura */
const STAGGER = 0.22;
const RESPONSE = 7;
/** velocidade do impulso nos ramos das estações (mais calma que o axônio) */
const BRANCH_SPEED = 2.4;
/** intervalo entre origem → decisão → saída, depois que o impulso chega (s) */
const STEP_GAP = 0.55;
/**
 * Origem → decisão → saída: três placas na metade da frente da base (o balcão fica
 * atrás). À frente da base o piso some atrás da borda da laje na vista do Heart.
 */
const STEP_X = [-0.25, 0, 0.25];
const STEP_Z = 0.16;
const STEP_TILE: [number, number, number] = [0.2, 0.014, 0.17];
const EMPHASIS = { active: 2.1, other: 0.65 };
/** passagem para outra área: tempo de viagem do impulso e do contorno aceso na chegada (s) */
const HANDOFF_TIME = 1.3;
const HANDOFF_FLASH = 0.9;
/** pausa antes de recomeçar o ciclo (s) */
const CYCLE_REST = 0.7;
const HANDOFF_EMPHASIS = { idle: 0.55, travel: 1.8 };
/** contorno aceso no posto que recebe (mesmo tamanho do SIGNAL de seleção do Heart) */
const RECEIVER = { w: 1.55, d: 2.0, z: -0.35 };

export type StationRefs = RefObject<(HTMLButtonElement | null)[]>;

/** posição local (no referencial da zona) da estação i de n */
export function stationLocal(i: number, n: number): [number, number] {
  return [(i - (n - 1) / 2) * SPACING, STATION_Z + (i % 2) * ZIGZAG];
}

/** posição no mundo (piso do Heart) da estação i de n da área d */
export function stationWorld(
  d: Department,
  i: number,
  n: number,
): THREE.Vector3 {
  const [lx, lz] = stationLocal(i, n);
  const r = d.zone.rot;
  return new THREE.Vector3(
    d.zone.x + lx * Math.cos(r) + lz * Math.sin(r),
    LEVELS.heart,
    d.zone.z - lx * Math.sin(r) + lz * Math.cos(r),
  );
}

interface HeartStationsProps {
  areaId: DepartmentId | null;
  /** quantas estações a área tem (2–4) */
  count: number;
  /** estação escolhida (índice da subárea) */
  activeIndex: number;
  open: boolean;
  onPick: (index: number) => void;
  labelRefs?: StationRefs;
  /** área que recebe a saída da estação escolhida (handoff), se houver */
  handoffTo?: DepartmentId | null;
  /**
   * passo do processo aceso agora: -1 nenhum · 0 origem · 1 decisão · 2 saída ·
   * 3 passagem em viagem · 4 chegou à outra área. O painel acompanha.
   */
  processRef?: RefObject<number>;
  reducedMotion: boolean;
}

function Station({
  active,
  onPick,
  markerRefs,
}: {
  active: boolean;
  onPick: () => void;
  markerRefs: RefObject<(THREE.Mesh | null)[]>;
}) {
  const { materials: m, geometries: g } = useKit();
  const t = 0.03;
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onPick();
  };
  return (
    <group
      onClick={click}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {/* base no piso */}
      <mesh
        geometry={g.box}
        material={m.deskDark}
        position={[0, 0.008, 0]}
        scale={[PAD.w, 0.016, PAD.d]}
        receiveShadow
      />
      {/* balcão em pé + tela voltada para a fachada (+Z local) */}
      <mesh
        geometry={g.box}
        material={m.metal}
        position={[0, 0.37, -0.12]}
        scale={[0.05, 0.74, 0.05]}
        castShadow
      />
      <mesh
        geometry={g.box}
        material={m.deskLight}
        position={[0, 0.76, -0.06]}
        scale={[0.56, 0.04, 0.3]}
        castShadow
      />
      <mesh
        geometry={g.box}
        material={m.monitor}
        position={[0, 0.98, -0.17]}
        scale={[0.44, 0.27, 0.03]}
        castShadow
      />
      <mesh
        geometry={g.box}
        material={active ? m.cardBlue : m.screen}
        position={[0, 0.98, -0.153]}
        scale={[0.4, 0.23, 0.004]}
      />
      {/* SIGNAL da estação escolhida + as três marcas do processo (origem → decisão → saída) */}
      {active && (
        <>
          {STEP_X.map((x, k) => (
            <mesh
              key={k}
              ref={(el) => {
                markerRefs.current[k] = el;
              }}
              geometry={g.box}
              material={m.card}
              position={[x, 0.02, STEP_Z]}
              scale={STEP_TILE}
            />
          ))}
          <mesh
            geometry={g.box}
            material={m.signalLine}
            position={[0, 0.02, PAD.d / 2]}
            scale={[PAD.w, 0.01, t]}
          />
          <mesh
            geometry={g.box}
            material={m.signalLine}
            position={[0, 0.02, -PAD.d / 2]}
            scale={[PAD.w, 0.01, t]}
          />
          <mesh
            geometry={g.box}
            material={m.signalLine}
            position={[PAD.w / 2, 0.02, 0]}
            scale={[t, 0.01, PAD.d]}
          />
          <mesh
            geometry={g.box}
            material={m.signalLine}
            position={[-PAD.w / 2, 0.02, 0]}
            scale={[t, 0.01, PAD.d]}
          />
        </>
      )}
    </group>
  );
}

/**
 * As estações saem do centro do posto, uma depois da outra, e voltam ao fechar.
 * Uma única variável de abertura (amortecida) dirige posição, escala e rótulos.
 */
export function HeartStations({
  areaId,
  count,
  activeIndex,
  open,
  onPick,
  labelRefs,
  handoffTo = null,
  processRef,
  reducedMotion,
}: HeartStationsProps) {
  const d = DEPARTMENTS.find((x) => x.id === areaId) ?? null;
  const groups = useRef<(THREE.Group | null)[]>([]);
  const amount = useRef(0);
  const lastArea = useRef<DepartmentId | null>(null);
  const kit = useKit();
  const markers = useRef<(THREE.Mesh | null)[]>([]);
  const branchMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useRef(0);
  const lastActive = useRef(activeIndex);

  // ramos do neurônio da área até cada estação (saem do mesmo ponto de ramificação do Heart)
  const branches = useMemo(() => {
    if (!d) return [];
    const from = heartBranchPoint(d);
    return Array.from({ length: count }, (_, i) => {
      const to = stationWorld(d, i, count).setY(
        LEVELS.heart + 0.8 * SIZE + 0.02,
      );
      const curve = organic(from, to, rng(7000 + d.index * 13 + i), {
        wobble: 0.2,
        sag: 0.12,
      });
      const length = curve.getLength();
      return {
        length,
        geometry: taperedTube(curve, { r0: 0.03, r1: 0.012 }),
        material: createNeuralMaterial({ reach: length, speed: BRANCH_SPEED }),
      };
    });
  }, [d, count]);
  useEffect(
    () => () =>
      branches.forEach((b) => {
        b.geometry.dispose();
        b.material.dispose();
      }),
    [branches],
  );
  // passagem: linha temporária da placa "saída" da estação escolhida até o posto que recebe
  const handoff = useMemo(() => {
    const to = DEPARTMENTS.find((x) => x.id === handoffTo);
    if (!d || !to || to.id === d.id) return null;
    const [lx, lz] = stationLocal(activeIndex, count);
    const out = shift(d.zone, lx + STEP_X[2] * SIZE, lz + STEP_Z * SIZE);
    const start = new THREE.Vector3(out.x, LEVELS.heart + 0.08, out.z);
    const pod = podTarget(to);
    const p = shift(to.zone, 0.15, pod.z - 0.15);
    const end = new THREE.Vector3(p.x, LEVELS.heart + pod.h + 0.03, p.z);
    const lift = Math.min(2.4, 0.9 + start.distanceTo(end) * 0.18);
    const mid = start.clone().lerp(end, 0.5);
    mid.y = Math.max(start.y, end.y) + lift;
    const curve = new THREE.CatmullRomCurve3(
      [
        start,
        start.clone().setY(start.y + 0.55),
        mid,
        end.clone().setY(end.y + 0.6),
        end,
      ],
      false,
      "centripetal",
    );
    const length = curve.getLength();
    return {
      to,
      length,
      geometry: taperedTube(curve, { r0: 0.022, r1: 0.022 }),
      material: createNeuralMaterial({ reach: length, strength: 2.4 }),
    };
  }, [d, handoffTo, activeIndex, count]);
  useEffect(
    () => () => {
      handoff?.geometry.dispose();
      handoff?.material.dispose();
    },
    [handoff],
  );
  const handoffMesh = useRef<THREE.Mesh>(null);
  const receiverRef = useRef<THREE.Group>(null);

  const size = useThree((s) => s.size);
  const labelPos = useMemo(() => new THREE.Vector3(), []);
  const anchors = useMemo(
    () =>
      d
        ? Array.from({ length: count }, (_, i) =>
            stationWorld(d, i, count).setY(LEVELS.heart + LABEL_Y),
          )
        : [],
    [d, count],
  );

  useFrame((state, delta) => {
    // outra área: as estações novas saem do posto dela, do zero
    if (lastArea.current !== areaId) {
      lastArea.current = areaId;
      amount.current = 0;
    }
    const target = open && d ? 1 : 0;
    amount.current = reducedMotion
      ? target
      : THREE.MathUtils.damp(
          amount.current,
          target,
          RESPONSE,
          Math.min(delta, 0.1),
        );
    if (Math.abs(amount.current - target) < 0.001) amount.current = target;
    const span = 1 + STAGGER * Math.max(0, count - 1);
    const dt = Math.min(delta, 0.1);
    const settled = amount.current > 0.98;

    // ramos: aparecem com as estações abertas; o da estação escolhida leva impulsos
    if (lastActive.current !== activeIndex) {
      lastActive.current = activeIndex;
      clock.current = 0;
    }
    if (settled) clock.current += dt;
    branches.forEach((b, i) => {
      const u = b.material.uniforms;
      const on = i === activeIndex;
      const want = settled ? (on ? EMPHASIS.active : EMPHASIS.other) : 0;
      u.uEmphasis.value = reducedMotion
        ? want
        : THREE.MathUtils.damp(u.uEmphasis.value, want, 6, dt);
      u.uActive.value = on && !reducedMotion ? 1 : 0;
      u.uTime.value = on ? clock.current : 0;
      const mesh = branchMeshes.current[i];
      if (mesh) mesh.visible = u.uEmphasis.value > 0.01;
    });

    // processo: depois que o impulso chega à estação, origem → decisão → saída acendem em sequência
    // ciclo: impulso chega → origem → decisão → saída → (passagem → chegada) → pausa
    let step = -1;
    let travel = 0;
    const branch = branches[activeIndex];
    if (settled && branch) {
      if (reducedMotion) step = 2;
      else {
        const arrive = branch.length / BRANCH_SPEED;
        const outAt = arrive + 2 * STEP_GAP;
        const hoStart = outAt + STEP_GAP * 0.7;
        const hoEnd = hoStart + (handoff ? HANDOFF_TIME : 0);
        const flashEnd = hoEnd + (handoff ? HANDOFF_FLASH : 0);
        const cycle = Math.max(
          flashEnd + CYCLE_REST,
          (branch.length + 6) / BRANCH_SPEED,
        );
        // o impulso do ramo passa a ter o mesmo período do ciclo
        branch.material.uniforms.uReach.value = cycle * BRANCH_SPEED - 6;
        const tc = clock.current % cycle;
        if (tc < arrive) step = -1;
        else if (tc < outAt + STEP_GAP * 0.7 || !handoff)
          step = Math.min(2, Math.floor((tc - arrive) / STEP_GAP));
        else if (tc < hoEnd) {
          step = 3;
          travel = (tc - hoStart) / HANDOFF_TIME;
        } else if (tc < flashEnd) step = 4;
        else step = 2;
      }
    }
    // linha de passagem: fraca enquanto a estação está aberta; acesa com o impulso em viagem
    if (handoff) {
      const u = handoff.material.uniforms;
      const want = settled
        ? step === 3
          ? HANDOFF_EMPHASIS.travel
          : reducedMotion
            ? 1
            : HANDOFF_EMPHASIS.idle
        : 0;
      u.uEmphasis.value = reducedMotion
        ? want
        : THREE.MathUtils.damp(u.uEmphasis.value, want, 8, dt);
      u.uActive.value = step === 3 ? 1 : 0;
      u.uTime.value = (travel * handoff.length) / u.uSpeed.value;
      if (handoffMesh.current)
        handoffMesh.current.visible = u.uEmphasis.value > 0.01;
    }
    // posto que recebe: contorno lime na chegada (fixo no movimento reduzido)
    if (receiverRef.current)
      receiverRef.current.visible =
        Boolean(handoff) && settled && (step === 4 || reducedMotion);
    markers.current.forEach((mk, k) => {
      if (mk)
        mk.material = k <= step ? kit.materials.nodeLime : kit.materials.card;
    });
    if (processRef) processRef.current = reducedMotion ? -1 : step;

    for (let i = 0; i < count; i++) {
      const s = THREE.MathUtils.clamp(
        amount.current * span - i * STAGGER,
        0,
        1,
      );
      const e = 1 - (1 - s) ** 3;
      const grp = groups.current[i];
      if (grp) {
        const [lx, lz] = stationLocal(i, count);
        // sai do centro do posto (0, 0) até o lugar da estação
        grp.position.set(lx * e, 0, lz * e);
        grp.scale.setScalar(SIZE * (0.12 + 0.88 * e));
        grp.visible = s > 0.001;
      }
      const el = labelRefs?.current[i];
      if (el && anchors[i]) {
        labelPos.copy(anchors[i]).project(state.camera);
        const visible =
          s > 0.7 &&
          labelPos.z < 1 &&
          Math.abs(labelPos.x) < 1.02 &&
          Math.abs(labelPos.y) < 1.02;
        const x = (labelPos.x * 0.5 + 0.5) * size.width;
        const y = (-labelPos.y * 0.5 + 0.5) * size.height;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        el.style.visibility = visible ? "visible" : "hidden";
      }
    }
  });

  if (!d) return null;
  return (
    <>
      {handoff && (
        <>
          <mesh
            ref={handoffMesh}
            geometry={handoff.geometry}
            material={handoff.material}
            renderOrder={2}
            visible={false}
            dispose={null}
          />
          <group
            ref={receiverRef}
            position={[handoff.to.zone.x, LEVELS.heart, handoff.to.zone.z]}
            rotation={[0, handoff.to.zone.rot, 0]}
            visible={false}
          >
            {(
              [
                [0, RECEIVER.z + RECEIVER.d / 2, RECEIVER.w, 0.05],
                [0, RECEIVER.z - RECEIVER.d / 2, RECEIVER.w, 0.05],
                [RECEIVER.w / 2, RECEIVER.z, 0.05, RECEIVER.d],
                [-RECEIVER.w / 2, RECEIVER.z, 0.05, RECEIVER.d],
              ] as const
            ).map(([x, z, w, dd], k) => (
              <mesh
                key={k}
                geometry={kit.geometries.box}
                material={kit.materials.nodeLime}
                position={[x, 0.035, z]}
                scale={[w, 0.012, dd]}
              />
            ))}
          </group>
        </>
      )}
      {branches.map((b, i) => (
        <mesh
          key={`${d.id}-branch-${i}`}
          ref={(el) => {
            branchMeshes.current[i] = el;
          }}
          geometry={b.geometry}
          material={b.material}
          renderOrder={2}
          visible={false}
          dispose={null}
        />
      ))}
      <group
        position={[d.zone.x, LEVELS.heart, d.zone.z]}
        rotation={[0, d.zone.rot, 0]}
      >
        {Array.from({ length: count }, (_, i) => (
          <group
            key={`${d.id}-${i}`}
            ref={(el) => {
              groups.current[i] = el;
            }}
            visible={false}
          >
            <Station
              active={i === activeIndex}
              onPick={() => onPick(i)}
              markerRefs={markers}
            />
          </group>
        ))}
      </group>
    </>
  );
}
