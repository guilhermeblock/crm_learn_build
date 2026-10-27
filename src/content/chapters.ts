import type { AreaContent, Chapter, ChapterId, FloorKey } from "./types";

/**
 * Copy dos atos (doc 02 · roteiro). Provisória, sujeita a revisão editorial.
 * Exemplos guiados: docs/conteudo/09 §5 (Produto nos três andares + as 3 relações-chave).
 */
export const CHAPTERS: Chapter[] = [
  {
    id: "rooftop",
    nav: "Rooftop",
    index: "00",
    title: "CRM é maior do que parece.",
    lines: [
      "Um prédio em corte, com 8 áreas e 3 andares. Role para descer: a visita leva uns 7 minutos, e dá para parar em qualquer área.",
    ],
    learning: "Existe algo conectado abaixo da superfície.",
  },
  {
    id: "reveal",
    index: "01",
    title: "O cliente não se relaciona com uma única área.",
    lines: ["Cada uma tem uma parte da história.", "Passe o mouse ou o foco nos blocos; clique para acompanhar uma área."],
    learning: "Cada bloco é uma área, e sua coluna permanece identificável até a base.",
  },
  {
    id: "brain",
    nav: "Brain",
    index: "02",
    title: "BRAIN",
    subtitle: "Objetivos e Estratégias",
    lines: [],
    question: "O que esta área quer construir na relação com o cliente?",
    guided: [
      { area: "produto", text: "Produto: prioriza o tema que mais contas pediram, pesando a receita em renovação." },
      { area: "financeiro", text: "Financeiro: define quantos dias de atraso pausam ofertas e acionam o CSM." },
      { area: "revops", text: "RevOps: combina com Vendas o critério de saída de cada etapa do funil." },
    ],
    exit: "Estratégia define a intenção. Mas alguém precisa transformá-la em rotina.",
    learning: "Cada área tem objetivos próprios na relação com o cliente.",
  },
  {
    id: "heart",
    nav: "Heart",
    index: "03",
    title: "HEART",
    subtitle: "Pessoas e Processos",
    lines: [],
    question: "Quem participa e como a relação com o cliente acontece?",
    guided: [
      { area: "vendas", text: "Vendas: marca o ganho e preenche as notas de passagem para o CSM." },
      { area: "atendimento", text: "Atendimento: fecha o ticket com motivo de lista fechada; o volume vai a Produto." },
      { area: "produto", text: "Produto: muda o status do pedido de melhoria, e o CS avisa quem pediu." },
    ],
    exit: "Processos criam consistência. Mas dependem de informações utilizáveis.",
    learning: "Objetivos viram rotinas, passagens de trabalho e responsabilidades.",
  },
  {
    id: "backbone",
    nav: "Backbone",
    index: "04",
    title: "BACKBONE",
    subtitle: "Dados e Tecnologia",
    lines: ["O impulso agora sobe: o dado volta para a decisão."],
    question: "O que cada área registra no CRM, e como esse dado volta para a decisão?",
    guided: [
      { area: "produto", text: "Produto: envia os eventos “ativou” e “parou de usar”, que Marketing e CS usam." },
      { area: "customer-success", text: "CS: vê uso, tickets e faturas na conta antes de falar em renovação." },
      { area: "operacoes-entrega", text: "Operações: guarda o prazo prometido separado do real; o atraso aparece ao SAC." },
    ],
    exit: "Ter informação não basta. É preciso que ela chegue à decisão certa.",
    learning: "Dados e tecnologia são distribuídos, e o retorno volta para as decisões.",
  },
  {
    id: "synthesis",
    nav: "Síntese",
    index: "05",
    title: "Tecnologia não corrige operação.",
    lines: [
      "O software só devolve o que alguém registrou. Alguém só registra o que uma regra exige e uma rotina confere. A regra só existe se duas áreas a combinaram.",
      "Por isso CRM é a forma como a empresa organiza o que sabe de cada cliente, e como cada área usa isso para decidir e agir de forma coerente. A ferramenta é onde a regra vira trava.",
      "Um teste: pergunte a dois vendedores o que significa “proposta enviada”. Se as respostas diferem, o CRM já está errado, seja qual for a ferramenta.",
    ],
    learning: "CRM não é o software, a campanha nem um time: é a coordenação entre áreas, com regras combinadas e dados que voltam para a decisão.",
  },
];

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

export function chapterIndex(id: ChapterId) {
  return CHAPTER_IDS.indexOf(id);
}

/** andar mostrado no painel para cada capítulo (rooftop/reveal/síntese: visão da área) */
export function floorOfChapter(id: ChapterId): FloorKey | null {
  return id === "brain" || id === "heart" || id === "backbone" ? id : null;
}

export const FLOOR_META: Record<FloorKey, { title: string; subtitle: string; question: string; index: string }> = {
  brain: { title: "BRAIN", subtitle: "Objetivos e Estratégias", question: "O que esta área quer construir na relação com o cliente?", index: "02" },
  heart: { title: "HEART", subtitle: "Pessoas e Processos", question: "Quem participa e como a relação com o cliente acontece?", index: "03" },
  backbone: { title: "BACKBONE", subtitle: "Dados e Tecnologia", question: "O que cada área registra no CRM, e como esse dado volta para a decisão?", index: "04" },
};

/** ciclo final da síntese (storyboard §3, cena 05) */
export const CYCLE = [
  { name: "Decisão", line: "Vendas prevê o mês pelo funil e promete 45 dias de implantação." },
  { name: "Execução", line: "O pré-vendedor liga em 40 minutos; o executivo registra cada passo." },
  { name: "Sinal", line: "“Prazo de implantação” lidera os motivos de perda do trimestre." },
  { name: "Ajuste da decisão", line: "Vendas passa a propor implantação em fases; Operações revê a capacidade." },
];

/** áreas transversais: existem na empresa real e não ganham coluna no prédio (PRD §5) */
export const TRANSVERSALS = [
  { name: "Jurídico", text: "Minuta do contrato e LGPD: o maior atraso real de um fechamento B2B." },
  { name: "TI e Segurança", text: "Acessos, integrações e o que pode sair do CRM." },
  { name: "Dados e BI", text: "Vive dentro de RevOps: um número só de receita." },
  { name: "Diretoria", text: "Consome o Brain: a previsão do mês e o caixa dependem do que foi registrado." },
];

export const RULES = [
  "Nem toda atividade da empresa é CRM: entram só decisões, contatos e informações com relevância para a relação com o cliente.",
  "Dados pessoais exigem finalidade, base legal, minimização e acesso por responsabilidade — não circulam livremente.",
  "Os exemplos são configurações possíveis, não um organograma universal nem uma arquitetura obrigatória.",
];

/**
 * Frase curta de cada área no menu do capítulo: o exemplo guiado do roteiro
 * quando existir, senão um recorte do conteúdo daquele andar.
 */
export function menuLine(chapter: Chapter, area: AreaContent): { text: string; guided: boolean } {
  const guided = chapter.guided?.find((g) => g.area === area.id);
  if (guided) {
    const text = guided.text.replace(/^[^:]+:\s*/, "");
    return { text: text.charAt(0).toUpperCase() + text.slice(1), guided: true };
  }
  if (chapter.id === "brain") return { text: area.brain.customerImpact, guided: false };
  if (chapter.id === "heart") return { text: area.heart.routine.split(":")[0], guided: false };
  if (chapter.id === "backbone")
    return { text: area.backbone.crmObjects.slice(0, 3).map((o) => o.object).join(" · "), guided: false };
  return { text: area.oneLiner, guided: false };
}
