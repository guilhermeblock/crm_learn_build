"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  DEPARTMENTS,
  LEVELS,
  type Department,
  type IconId,
} from "../config/constants";
import { useKit } from "../config/materials";
import { shift } from "../props/furniture";
import { applyGesture, type Gesture } from "./gestures";
import { buildRig, createRigGeometries, sit, type Look, type Rig } from "./rig";

/*
 * As pessoas do prédio: cada uma no seu posto, fazendo o gesto do trabalho da área.
 * Heart: uma por área (8, limite do briefing). Brain: quem apresenta/lê nos quadros e
 * duas pessoas na mesa de estratégia. Ninguém se desloca: só gestos.
 */

type Prop = "tablet" | "card" | "headset" | "calculator" | "box";

interface PersonSpec {
  x: number;
  z: number;
  y: number;
  yaw: number;
  pose: "sit" | "stand";
  gesture: Gesture;
  props?: Prop[];
}

/** posto do Heart: posição no referencial da zona, de que lado olha e o gesto */
const POD_PEOPLE: Record<
  IconId,
  {
    x: number;
    z: number;
    face: number;
    pose: "sit" | "stand";
    gesture: Gesture;
    props?: Prop[];
  }
> = {
  // sentados olham para a mesa (-Z local = face π); em pé, de frente (+Z) ou para o quadro
  broadcast: {
    x: -0.3,
    z: 0.55,
    face: Math.PI,
    pose: "sit",
    gesture: "typing",
  },
  growth: {
    x: 0.86,
    z: -0.42,
    face: -0.45,
    pose: "stand",
    gesture: "presenting",
  },
  product: {
    x: 0.0,
    z: 0.42,
    face: Math.PI,
    pose: "stand",
    gesture: "sorting",
    props: ["card"],
  },
  support: {
    x: -0.33,
    z: 0.5,
    face: Math.PI,
    pose: "sit",
    gesture: "headset",
    props: ["headset"],
  },
  success: { x: 0, z: 0.52, face: Math.PI, pose: "sit", gesture: "talking" },
  finance: {
    x: 0,
    z: 0.6,
    face: Math.PI,
    pose: "sit",
    gesture: "calculating",
    props: ["calculator"],
  },
  operations: {
    x: -0.15,
    z: 0.74,
    face: Math.PI,
    pose: "stand",
    gesture: "packing",
    props: ["box"],
  },
  rules: { x: 0, z: 0.62, face: Math.PI, pose: "sit", gesture: "monitors" },
};

function place(d: Department, lx: number, lz: number) {
  return shift(d.zone, lx, lz);
}

function buildSpecs(): PersonSpec[] {
  const specs: PersonSpec[] = [];
  // HEART
  for (const d of DEPARTMENTS) {
    const s = POD_PEOPLE[d.icon];
    const p = place(d, s.x, s.z);
    specs.push({
      x: p.x,
      z: p.z,
      y: LEVELS.heart,
      yaw: d.zone.rot + s.face,
      pose: s.pose,
      gesture: s.gesture,
      props: s.props,
    });
  }
  // BRAIN: nos quadros de 3 áreas (alternando apresentar e ler)
  DEPARTMENTS.forEach((d, i) => {
    if (i % 3 !== 0) return;
    const reading = i === 3;
    const p = reading ? place(d, 0.32, 0.5) : place(d, 0.84, 0.02);
    specs.push({
      x: p.x,
      z: p.z,
      y: LEVELS.brain,
      yaw: d.zone.rot + (reading ? Math.PI + 0.25 : -0.45),
      pose: "stand",
      gesture: reading ? "reading" : "presenting",
      props: reading ? ["tablet"] : undefined,
    });
  });
  // BRAIN: mesa de estratégia (mesmas cadeiras de antes: lugares 1 e 4)
  const table = { x: 0.2, z: 0.2 };
  for (const [i, gesture] of [
    [1, "talking"],
    [4, "reading"],
  ] as const) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    specs.push({
      x: table.x + Math.sin(a) * 1.55,
      z: table.z + Math.cos(a) * 1.55,
      y: LEVELS.brain,
      yaw: a + Math.PI,
      pose: "sit",
      gesture,
      props: gesture === "reading" ? ["tablet"] : undefined,
    });
  }
  return specs;
}

/* aparência: tons de pele, cabelos e roupas variados; paleta discreta, sem competir com o azul */
const SKIN = ["#e3bc9a", "#c08a65", "#8d5a3b", "#f0cfb2", "#6b4430", "#d8a47e"];
const HAIR = ["#1c1917", "#3b2a1e", "#6e4b2f", "#a08a6c", "#2a2420", "#8c8c8c"];
const SHIRT = [
  "#e9e8e2",
  "#2f3b5c",
  "#5a6472",
  "#b8ad97",
  "#1f2a44",
  "#d6d3c8",
  "#3d4a3f",
  "#7b8796",
];
const PANTS = ["#23252b", "#2f3542", "#3a352f", "#1c1f26"];

function std(color: string, roughness = 0.75) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

/** Personagens com gestos de trabalho. Um único useFrame anima todos. */
export function People({ reducedMotion }: { reducedMotion: boolean }) {
  const kit = useKit();

  const scene = useMemo(() => {
    const geos = createRigGeometries();
    const mats = {
      skin: SKIN.map((c) => std(c, 0.62)),
      hair: HAIR.map((c) => std(c, 0.85)),
      shirt: SHIRT.map((c) => std(c, 0.8)),
      pants: PANTS.map((c) => std(c, 0.85)),
      shoes: std("#141414", 0.6),
      eyes: std("#1a1a1a", 0.4),
    };
    const propGeo = {
      tablet: new THREE.BoxGeometry(0.17, 0.012, 0.12),
      card: new THREE.BoxGeometry(0.075, 0.006, 0.055),
      band: new THREE.TorusGeometry(0.1, 0.009, 6, 18, Math.PI),
      cup: new THREE.CylinderGeometry(0.03, 0.03, 0.025, 10),
      calc: new THREE.BoxGeometry(0.09, 0.02, 0.12),
      box: new THREE.BoxGeometry(0.3, 0.2, 0.24),
    };
    const group = new THREE.Group();
    group.name = "people";
    const specs = buildSpecs();
    const people = specs.map((s, i) => {
      const look: Look = {
        skin: mats.skin[(i * 5 + 1) % SKIN.length],
        hair: mats.hair[(i * 7 + 2) % HAIR.length],
        // camisas: ordem embaralhada para vizinhos (e a dupla da mesa) não repetirem tons
        shirt: mats.shirt[[0, 2, 5, 1, 3, 6, 4, 7, 2, 0, 5, 3, 6][i % 13] % SHIRT.length],
        pants: mats.pants[(i * 5) % PANTS.length],
        shoes: mats.shoes,
        eyes: mats.eyes,
        bun: i % 3 === 1,
      };
      const rig: Rig = buildRig(geos, look);
      if (s.pose === "sit") sit(rig);
      rig.root.position.set(s.x, s.y, s.z);
      rig.root.rotation.y = s.yaw;
      group.add(rig.root);

      // objetos de cena de cada gesto
      let box: THREE.Object3D | undefined;
      let boxY: number | undefined;
      for (const prop of s.props ?? []) {
        if (prop === "tablet") {
          const tab = new THREE.Mesh(propGeo.tablet, kit.materials.monitor);
          tab.position.set(0, 0.16, 0.24);
          tab.rotation.x = -0.95;
          rig.torso.add(tab);
          const face = new THREE.Mesh(propGeo.tablet, kit.materials.screen);
          face.scale.set(0.86, 0.3, 0.84);
          face.position.y = 0.007;
          tab.add(face);
        } else if (prop === "card") {
          const card = new THREE.Mesh(propGeo.card, kit.materials.card);
          card.position.set(0, -0.03, 0.02);
          rig.handR.add(card);
        } else if (prop === "headset") {
          const band = new THREE.Mesh(propGeo.band, kit.materials.chair);
          band.position.y = 0.1;
          band.rotation.y = Math.PI / 2;
          rig.head.add(band);
          for (const side of [1, -1]) {
            const cup = new THREE.Mesh(propGeo.cup, kit.materials.chair);
            cup.rotation.z = Math.PI / 2;
            cup.position.set(side * 0.1, 0.09, 0);
            rig.head.add(cup);
          }
        } else if (prop === "calculator") {
          const calc = new THREE.Mesh(propGeo.calc, kit.materials.monitor);
          calc.position.set(-0.13, 0.615, 0.33);
          rig.root.add(calc);
        } else if (prop === "box") {
          const b = new THREE.Mesh(propGeo.box, kit.materials.sofa);
          boxY = 0.945 + 0.1;
          b.position.set(0, boxY, 0.36);
          b.castShadow = true;
          rig.root.add(b);
          box = b;
        }
      }
      return { rig, gesture: s.gesture, phase: i * 1.37, props: { box, boxY } };
    });
    return { group, people, geos, mats, propGeo };
  }, [kit]);

  useEffect(
    () => () => {
      Object.values(scene.geos).forEach((g) => g.dispose());
      Object.values(scene.propGeo).forEach((g) => g.dispose());
      const { skin, hair, shirt, pants, shoes, eyes } = scene.mats;
      [...skin, ...hair, ...shirt, ...pants, shoes, eyes].forEach((m) =>
        m.dispose(),
      );
    },
    [scene],
  );

  useFrame((state) => {
    // movimento reduzido: cada pessoa fica numa pose fixa do seu gesto
    const t = reducedMotion ? 1.2 : state.clock.elapsedTime;
    for (const p of scene.people)
      applyGesture(p.gesture, p.rig, t + p.phase, p.props);
  });

  return <primitive object={scene.group} dispose={null} />;
}
