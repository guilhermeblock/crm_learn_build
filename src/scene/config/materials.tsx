"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { BRAND, TONES } from "./palette";

/**
 * Materiais e geometrias-base compartilhados pela cena inteira.
 * Criados uma vez por montagem do Canvas e descartados no unmount,
 * para que remontar a rota não vaze recursos de GPU.
 */
function createKit() {
  const std = (color: string, roughness: number, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  /** cor emissiva em HDR (valores > 1 passam do limiar do bloom) */
  const glow = (color: string, strength: number) =>
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(strength),
      toneMapped: false,
    });

  const materials = {
    ground: std(TONES.ground, 0.95),
    concrete: std(TONES.concrete, 0.82, 0.08),
    concreteDark: std(TONES.concreteDark, 0.88, 0.05),
    concreteLight: std(TONES.concreteLight, 0.78, 0.08),
    fascia: std("#1d1e21", 0.32, 0.75),
    metal: std(TONES.metal, 0.3, 0.9),
    metalLight: std(TONES.metalLight, 0.28, 0.9),
    floorBrain: std(TONES.floorBrain, 0.32, 0.25),
    floorHeart: std(TONES.floorHeart, 0.4, 0.15),
    floorBackbone: std(TONES.floorBackbone, 0.62, 0.25),
    glass: new THREE.MeshPhysicalMaterial({
      color: TONES.glass,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    /** vidro de fachada: quase invisível, só reflexo do ambiente */
    facadeGlass: new THREE.MeshPhysicalMaterial({
      color: "#b9c6e4",
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.06,
      envMapIntensity: 2.2,
      specularIntensity: 1,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    /** parede de fundo: painéis escuros levemente acetinados */
    backPanel: std("#17181b", 0.5, 0.35),
    cubePad: glow("#2f62ff", 2.2),
    nodeBlue: glow("#4a78ff", 3.5),
    nodeLime: glow(BRAND.lime, 2.2),
    // ---- mobiliário (Checkpoint 2) ----
    deskLight: std("#8f8c84", 0.78, 0.04),
    deskDark: std("#2a2b30", 0.45, 0.35),
    chair: std("#1a1a1d", 0.7, 0.1),
    monitor: std("#0f1013", 0.4, 0.5),
    /** tela de monitor: luz fria baixa (não passa do limiar do bloom) */
    screen: glow("#c9d5f2", 0.85),
    personBody: std("#2a2b30", 0.82, 0.05),
    personHead: std("#3b3c41", 0.75, 0.05),
    plant: std("#22382a", 0.9, 0),
    sofa: std("#3a3833", 0.85, 0.02),
    /** painel de parede do Brain: textura abstrata (blocos e linhas, sem números) */
    wallPanel: new THREE.MeshBasicMaterial({ map: createPanelTexture(), toneMapped: false }),
    /** linhas de SIGNAL no piso do Heart (área ativa) */
    signalLine: glow(BRAND.lime, 1.2),
    cloudGlow: glow("#dfe8ff", 1.6),
    /** cartões e post-its dos quadros dos postos (pipeline, calendário, fluxo) */
    card: std(BRAND.offWhite, 0.75, 0),
    cardBlue: std(BRAND.blue, 0.55, 0.1),
    // ---- térreo ----
    /** janelas do lobby, LED dos degraus e balizadores: luz quente baixa */
    lobbyWarm: glow("#ffd2a0", 1.15),
    /** vidraça do lobby: luz interna difusa, sem estourar */
    lobbyWindow: glow("#c9a57c", 0.62),
    lobbyEntrance: glow("#ffe6c4", 1.5),
    /** brilho quente no chão sob as árvores (uplight falso, sem luz dinâmica) */
    groundGlow: new THREE.MeshBasicMaterial({
      map: createRadialTexture(),
      color: new THREE.Color("#ffb46b").multiplyScalar(0.55),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    /** sinapses e pontos de ramificação da rede neural: suaves em repouso, acesos na seleção */
    synapseIdle: glow("#5a84ff", 1.5),
    synapseActive: glow("#9db8ff", 4.5),
    /** linhas de luz sob as bordas das lajes e sancas internas */
    ledCool: glow("#dfe6ff", 1.05),
    ledWarm: glow("#ffe2b8", 1.0),
    ledBackbone: glow("#e9eef7", 1.05),
  };

  const geometries = {
    box: new THREE.BoxGeometry(1, 1, 1),
    cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
    /** anel de NODE já deitado no plano do piso (XZ) */
    ring: new THREE.RingGeometry(0.2, 0.3, 48).rotateX(-Math.PI / 2),
    /** disco unitário deitado no piso (XZ), para brilhos com textura radial */
    disc: new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    sphere: new THREE.SphereGeometry(0.5, 16, 12),
  };

  return { materials, geometries };
}

/** degradê radial branco → transparente, 64 px (usado em brilhos de chão) */
function createRadialTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const c = canvas.getContext("2d")!;
  const g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Tela/painel do Brain: composição de BLOCKS (retângulos e uma linha de conexão)
 * em off-white sobre azul profundo. Sem números nem gráficos de KPI.
 * 256×144 px: proporcional ao tamanho real do painel na tela.
 */
function createPanelTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 144;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d")!;
  c.fillStyle = "#0c1a4d";
  c.fillRect(0, 0, w, h);
  c.fillStyle = "rgba(233,232,226,0.85)";
  c.fillRect(16, 16, 70, 44);
  c.fillStyle = "rgba(233,232,226,0.35)";
  c.fillRect(16, 72, 70, 56);
  c.fillRect(100, 16, 140, 20);
  c.fillStyle = "#3d6bff";
  c.fillRect(100, 48, 64, 80);
  c.fillStyle = "rgba(233,232,226,0.5)";
  c.fillRect(176, 48, 64, 36);
  c.strokeStyle = "rgba(233,232,226,0.9)";
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(86, 38);
  c.lineTo(100, 38);
  c.lineTo(100, 88);
  c.moveTo(164, 66);
  c.lineTo(176, 66);
  c.stroke();
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export type SceneKit = ReturnType<typeof createKit>;
export type MaterialName = keyof SceneKit["materials"];

const KitContext = createContext<SceneKit | null>(null);

export function SceneKitProvider({ children }: { children: ReactNode }) {
  const kit = useMemo(createKit, []);

  useEffect(
    () => () => {
      Object.values(kit.materials).forEach((m) => {
        if ("map" in m && m.map) m.map.dispose();
        m.dispose();
      });
      Object.values(kit.geometries).forEach((g) => g.dispose());
    },
    [kit],
  );

  return <KitContext.Provider value={kit}>{children}</KitContext.Provider>;
}

export function useKit(): SceneKit {
  const kit = useContext(KitContext);
  if (!kit) throw new Error("useKit precisa estar dentro de <SceneKitProvider>");
  return kit;
}
