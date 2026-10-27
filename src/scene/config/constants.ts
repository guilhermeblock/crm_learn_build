/**
 * Sistema de coordenadas da cena (unidades ≈ metros de maquete):
 *  - Y: vertical (0 = chão da praça)
 *  - X: distribuição horizontal dos departamentos (ordem 01 → 08)
 *  - Z: profundidade do prédio
 *
 * O prédio é alinhado aos eixos. A câmera 3/4 olha da quina +X/+Z (azimute 45°),
 * como no concept. Por isso os departamentos avançam em X e recuam em Z ao mesmo
 * tempo: a fileira fica paralela à tela e os cubos não se sobrepõem.
 */

export const BUILDING = {
  /** largura (X) e profundidade (Z) da torre */
  width: 14,
  depth: 14,
  /** pé-direito de cada pavimento (laje a laje) */
  floorHeight: 5.4,
  slabThickness: 0.42,
  /** faixa de borda da laje (fascia), um pouco mais alta que a laje */
  fasciaHeight: 0.56,
  fasciaOverhang: 0.06,
  /** espessura das paredes de fundo (-X e -Z) */
  wallThickness: 0.35,
  /** empena sólida na ponta esquerda da fachada +Z (recebe os textos dos pavimentos) */
  finWidth: 4.2,
} as const;

/** altura do pódio/lobby sob o Backbone */
const PODIUM = 2.4;

/** Topo de cada laje (o piso onde as coisas ficam apoiadas). */
export const LEVELS = {
  ground: 0,
  backbone: PODIUM,
  heart: PODIUM + BUILDING.floorHeight,
  brain: PODIUM + BUILDING.floorHeight * 2,
  rooftop: PODIUM + BUILDING.floorHeight * 3,
  /** centro dos cubos (antes do arco) */
  cubes: PODIUM + BUILDING.floorHeight * 3 + 2.5,
} as const;

export type FloorId = "brain" | "heart" | "backbone";

export const FLOORS: { id: FloorId; base: number }[] = [
  { id: "brain", base: LEVELS.brain },
  { id: "heart", base: LEVELS.heart },
  { id: "backbone", base: LEVELS.backbone },
];

/** a laje de cobertura é mais grossa e tem fascia mais alta */
export const ROOF_SLAB_FACTOR = 1.5;
export const ROOF_FASCIA_FACTOR = 1.6;

/** face inferior da laje que cobre o pavimento */
export function ceilingOf(id: FloorId): number {
  const base = FLOORS.find((f) => f.id === id)!.base;
  const roof = id === "brain";
  return base + BUILDING.floorHeight - BUILDING.slabThickness * (roof ? ROOF_SLAB_FACTOR : 1);
}

/** base da fascia da laje que cobre o pavimento */
export function fasciaBottomAbove(id: FloorId): number {
  const base = FLOORS.find((f) => f.id === id)!.base;
  const roof = id === "brain";
  return base + BUILDING.floorHeight + 0.05 - BUILDING.fasciaHeight * (roof ? ROOF_FASCIA_FACTOR : 1);
}

export const HALF_W = BUILDING.width / 2;
export const HALF_D = BUILDING.depth / 2;

/** Empena sólida (à esquerda da fachada +Z): recebe título e subtítulo de cada pavimento. */
export const FIN = {
  depth: 0.9,
  /** centro em Z (encostada na fachada, avançando um pouco além dela) */
  z: BUILDING.depth / 2 - 0.35,
  /** face frontal, onde ficam as placas */
  front: BUILDING.depth / 2 + 0.1,
} as const;
/** Base/pódio onde a torre se apoia (o "lobby" abaixo do Backbone). */
export const PLINTH = {
  width: BUILDING.width + 1.2,
  depth: BUILDING.depth + 1.2,
  /** praça/terraço em volta, com degraus */
  terraceWidth: BUILDING.width + 7,
  terraceDepth: BUILDING.depth + 7,
  terraceHeight: 0.35,
} as const;

export type DepartmentId =
  | "marketing-growth"
  | "vendas"
  | "produto"
  | "atendimento"
  | "customer-success"
  | "financeiro"
  | "operacoes-entrega"
  | "revops";

export type IconId =
  | "broadcast"
  | "growth"
  | "product"
  | "support"
  | "success"
  | "finance"
  | "operations"
  | "rules";

export interface Department {
  id: DepartmentId;
  index: number;
  /** nome curto exibido na experiência */
  label: string;
  /** nome completo (acessibilidade, painéis futuros) */
  fullName: string;
  icon: IconId;
  /** âncora da coluna: o cabo atravessa todos os andares neste (x, z) */
  anchor: { x: number; z: number };
  /**
   * Zona da área em cada pavimento: logo atrás da coluna, com +Z local voltado
   * para a fachada. Recebe o quadro de indicadores (Brain) e o posto da equipe (Heart).
   */
  zone: { x: number; z: number; rot: number };
  /** centro do cubo flutuante no rooftop (rotY em radianos, além dos 45° de frente) */
  cube: { x: number; y: number; z: number; rotY: number };
}

const DEPARTMENT_INFO: { id: DepartmentId; label: string; fullName: string; icon: IconId }[] = [
  { id: "marketing-growth", label: "Marketing", fullName: "Marketing: Demanda, Lifecycle e Marca", icon: "broadcast" },
  { id: "vendas", label: "Vendas", fullName: "Vendas / Comercial", icon: "growth" },
  { id: "produto", label: "Produto", fullName: "Produto / Oferta", icon: "product" },
  { id: "atendimento", label: "Atendimento", fullName: "Atendimento / SAC / Suporte", icon: "support" },
  { id: "customer-success", label: "CS", fullName: "Customer Success / Relacionamento", icon: "success" },
  { id: "financeiro", label: "Financeiro", fullName: "Financeiro: Crédito, Faturamento e Cobrança", icon: "finance" },
  { id: "operacoes-entrega", label: "Operações", fullName: "Operações: Entrega e Implantação", icon: "operations" },
  // 8ª coluna: RevOps substitui Marca (Marca virou subárea de Marketing) — docs/conteudo/00 §4
  { id: "revops", label: "RevOps", fullName: "RevOps: Operações de Receita e Dados", icon: "rules" },
];

/**
 * Fileira das colunas: a esta coordenada das fachadas da frente (+Z para os quatro
 * primeiros, +X para os quatro últimos). Perto do vidro, o cabo vertical aparece
 * inteiro dentro de cada pavimento na vista 3/4.
 */
export const ANCHOR_ROW = 5.3;
/** altura do terminal da área no Backbone (rack sob a coluna) */
export const TERMINAL_HEIGHT = 1.25;
/** distância da coluna até o centro da zona da área (para dentro do prédio) */
export const ZONE_OFFSET = 1.55;

/**
 * Layout dos cubos, espalhado de propósito (sem fileira linear).
 *  - line: x − z. Cubo e coluna do departamento ficam na mesma linha de visão da
 *    câmera 3/4, então o cabo corre reto no rooftop (+X+Z) e nunca cruza outro.
 *  - depth: x + z do cubo (quanto mais negativo, mais ao fundo do rooftop).
 *  - lift: altura extra sobre LEVELS.cubes. yaw: giro leve, em graus.
 * As linhas deixam a quina livre: as zonas das áreas da quina não se sobrepõem.
 * Validado para não haver sobreposição nas vistas overview e rooftop.
 */
const CUBE_LAYOUT: { line: number; depth: number; lift: number; yaw: number }[] = [
  { line: -8.6, depth: 0.4, lift: 0.5, yaw: 8 },
  { line: -6.65, depth: -3.4, lift: 1.2, yaw: -10 },
  { line: -4.7, depth: 1.2, lift: 0.0, yaw: 14 },
  { line: -2.8, depth: -4.6, lift: 0.9, yaw: -6 },
  { line: 2.8, depth: -1.0, lift: 0.0, yaw: 10 },
  { line: 4.7, depth: -4.6, lift: 1.5, yaw: -12 },
  { line: 6.65, depth: -0.6, lift: 0.0, yaw: 6 },
  { line: 8.6, depth: -3.0, lift: 1.4, yaw: -4 },
];

export const DEPARTMENTS: Department[] = DEPARTMENT_INFO.map((info, index) => {
  const { line, depth, lift, yaw } = CUBE_LAYOUT[index];
  const anchor =
    index < DEPARTMENT_INFO.length / 2
      ? { x: line + ANCHOR_ROW, z: ANCHOR_ROW }
      : { x: ANCHOR_ROW, z: ANCHOR_ROW - line };
  const zone =
    anchor.z === ANCHOR_ROW
      ? { x: anchor.x, z: anchor.z - ZONE_OFFSET, rot: 0 }
      : { x: anchor.x - ZONE_OFFSET, z: anchor.z, rot: Math.PI / 2 };
  return {
    ...info,
    index: index + 1,
    anchor,
    zone,
    cube: {
      x: (line + depth) / 2,
      y: LEVELS.cubes + lift,
      z: (depth - line) / 2,
      rotY: (yaw * Math.PI) / 180,
    },
  };
});

export const CUBE_SIZE = 1.25;

/** Todos os departamentos têm cabo (Checkpoint 4). */
export const CONNECTED_DEPARTMENTS: DepartmentId[] = DEPARTMENTS.map((d) => d.id);
/**
 * Pulso de demonstração em dois cabos, um em cada fachada.
 * `produto` é o selecionado no roteiro do Sprint 02.
 */
export const PULSING_DEPARTMENTS: DepartmentId[] = ["produto", "financeiro"];

export type ViewId = "overview" | "rooftop" | "heart";

export interface CameraView {
  id: ViewId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

/** Monta uma vista a partir de alvo + azimute/elevação (graus) + distância. */
export function orbitView(
  id: ViewId,
  label: string,
  target: [number, number, number],
  azimuth: number,
  elevation: number,
  distance: number,
): CameraView {
  const az = (azimuth * Math.PI) / 180;
  const el = (elevation * Math.PI) / 180;
  const flat = Math.cos(el) * distance;
  return {
    id,
    label,
    target,
    position: [
      target[0] + Math.sin(az) * flat,
      target[1] + Math.sin(el) * distance,
      target[2] + Math.cos(az) * flat,
    ],
  };
}

const MID = (LEVELS.backbone + LEVELS.cubes) / 2;

export const VIEWS: Record<ViewId, CameraView> = {
  overview: orbitView("overview", "Visão geral", [0, MID - 1.3, 0], 45, 21, 49),
  rooftop: orbitView("rooftop", "Rooftop", [-0.8, LEVELS.rooftop + 1.6, -0.8], 45, 36, 25),
  heart: orbitView("heart", "Heart", [-1.5, LEVELS.heart + 1.0, -1.5], 45, 6, 24),
};
