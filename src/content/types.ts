import type { DepartmentId } from "@/scene/config/constants";

/*
 * Modelo de conteúdo da experiência (PRD FR-10): textos fora do 3D.
 * Modelo prático definido pelo arquiteto de CRM/RevOps (docs/conteudo/00 §6) e
 * consolidado em docs/conteudo/09. Tamanhos máximos de cada campo: 00 §6.4.
 * Tudo é proposta didática, sujeita a validação — não arquitetura normativa.
 */

export type FloorKey = "brain" | "heart" | "backbone";
export type ChapterId = "rooftop" | "reveal" | "brain" | "heart" | "backbone" | "synthesis";

/** o que ESTA área faz com o objeto do CRM */
export type CrmAction = "cria" | "edita" | "vê";

export interface CrmObject {
  /** nome único no projeto todo ("Ticket") — ver 09 §4 */
  object: string;
  actions: CrmAction[];
  /** 3–4 campos-chave */
  fields: string[];
  /** quando o objeto é de outra área */
  owner?: DepartmentId;
}

/** Processo observável: origem → decisão → saída (FR-06). */
export interface Process {
  origin: string;
  decision: string;
  output: string;
}

/**
 * Camadas de leitura (docs/conteudo/11 §3): campos opcionais enquanto as áreas
 * migram para o contrato didático. idea = ideia central do andar (1ª camada),
 * why = "Entenda o porquê" (2ª camada, abre ao clicar), think = pergunta para o leitor.
 */
export interface Layers {
  idea?: string;
  why?: string;
  think?: string;
}

/** Empresa do caso (11 §5): B2B = software de gestão; B2C = loja online de calçados. */
export type CaseCompany = "b2b" | "b2c";

/** Caso passo a passo, com números ilustrativos; cada passo começa com horário, dia ou valor. */
export interface Scenario {
  steps: string[];
  /** "O dado que fica" */
  outcome: string;
  /** 2ª camada do caso */
  why?: string;
}

/** Subárea do Heart: uma estação, um processo e para quem vai a saída. */
export interface SubArea {
  id: string;
  name: string;
  /** quando a estação só existe em um modelo de negócio */
  context?: "b2b" | "b2c";
  process: Process;
  /** para quem vai a saída, quando sai da área */
  handoff?: { to: DepartmentId; object: string };
  /** o que fica registrado no CRM */
  record: string;
  customerImpact: string;
  /** 2ª camada: por que a estação decide assim */
  why?: string;
}

export interface AreaContent {
  id: DepartmentId;
  /** hover/foco e topo do painel: verbo concreto + objeto do CRM */
  oneLiner: string;
  /** a pergunta que a área faz ao CRM */
  keyQuestion: string;
  withoutCrm: string;
  withCrm: string;
  /** 2ª camada do "sem × com CRM": a regra pesa mais que a ferramenta */
  whyCrm?: string;
  /** um caso por empresa do fio condutor (11 §5): Aurora (B2B) e Marina (B2C) */
  cases: Record<CaseCompany, Scenario>;
  variants: { b2b: string; b2c: string; small: string };
  brain: Layers & {
    objectives: string[];
    decisions: string[];
    /** de onde vem o número (sem benchmark de mercado) */
    indicators: { name: string; source: string }[];
    /** reunião em que o número vira decisão */
    ritual: string;
    customerImpact: string;
  };
  heart: Layers & {
    /** descreve o posto da maquete 3D (antes do ":" vai para o menu) */
    routine: string;
    roles: string[];
    dayInLife: { time: string; action: string }[];
    /** 2–4 estações */
    subAreas: SubArea[];
    pitfalls: string[];
  };
  backbone: Layers & {
    crmObjects: CrmObject[];
    criticalField: string;
    /** o painel monta "Quando {when} → {then}" */
    automations: { when: string; then: string; why?: string }[];
    /** categorias genéricas, nunca marcas */
    neighborSystems: string[];
    /** como o dado volta para uma decisão do Brain (FR-08) */
    feedback: { data: string; decision: string; why?: string };
    governance: string;
  };
}

export type RelationLevel = "rooftop" | "brain" | "heart";

export interface Relation {
  a: DepartmentId;
  b: DepartmentId;
  floor: RelationLevel;
  floorB?: RelationLevel;
  /** as 3 relações centrais do argumento "CRM atravessa a empresa" */
  key?: boolean;
  nature: "handoff" | "meta compartilhada" | "dependência" | "feedback";
  /** o que passa entre as áreas ("Pedido ganho → fatura/NF") */
  object: string;
  why: string;
  /** onde a passagem costuma quebrar */
  breaks?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Chapter {
  id: ChapterId;
  /** rótulo do indicador de progresso; reveal compartilha o marcador do rooftop */
  nav?: string;
  index: string;
  title: string;
  subtitle?: string;
  lines: string[];
  question?: string;
  /** exemplos do modo guiado: área + frase ("Área: frase") */
  guided?: { area: DepartmentId; text: string }[];
  exit?: string;
  /** o que deve estar claro ao sair do capítulo (LearningCheckpoint) */
  learning: string;
}
