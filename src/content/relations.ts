import type { DepartmentId } from "@/scene/config/constants";
import type { Relation } from "./types";

/**
 * As 18 relações entre áreas, fechadas na consolidação (docs/conteudo/09 §2).
 * Andar = natureza da relação:
 *  - brain: meta compartilhada · heart: passagem de trabalho / dependência
 *  - entre andares (floor → floorB): retorno da operação para a estratégia (feedback)
 * Um handoff de subárea pode existir sem relação fixa (09, decisão 2).
 */
export const RELATIONS: Relation[] = [
  // 1 · Marketing → Vendas
  {
    a: "marketing-growth", b: "vendas", floor: "heart", nature: "handoff",
    object: "Lead (MQL) → oportunidade",
    why: "Lead com origem e score, com prazo de resposta; o descarte volta com motivo.",
    breaks: "Lead fica dias sem dono; cada área culpa a outra.",
  },
  // 2 · ★ Vendas → CS
  {
    a: "vendas", b: "customer-success", floor: "heart", key: true, nature: "handoff",
    object: "Conta + contrato + notas de passagem",
    why: "O que foi prometido na venda chega ao CSM antes da primeira reunião.",
    breaks: "O cliente cobra, na primeira reunião, uma integração que ninguém registrou.",
  },
  // 3 · Vendas → Operações
  {
    a: "vendas", b: "operacoes-entrega", floor: "heart", nature: "handoff",
    object: "Pedido / escopo → projeto, OS ou expedição",
    why: "Escopo, prazo e endereço vendidos viram execução.",
    breaks: "Vendedor promete prazo de 15 dias; a operação precisa de 40.",
  },
  // 4 · Vendas → Financeiro
  {
    a: "vendas", b: "financeiro", floor: "heart", nature: "handoff",
    object: "Contrato ou pedido ganho + cadastro fiscal → fatura/NF",
    why: "Condição aprovada vira cobrança correta; desconto fora da política é aprovado antes da assinatura.",
    breaks: "NF refeita por CNPJ errado; desconto aparece depois da assinatura.",
  },
  // 5 · CS – Vendas (Brain: meta e comissão da expansão)
  {
    a: "customer-success", b: "vendas", floor: "brain", nature: "meta compartilhada",
    object: "Oportunidade de expansão + regra de comissão",
    why: "CS identifica, Vendas fecha; meta e comissão da expansão são combinadas antes.",
    breaks: "Disputa de comissão; vendedor oferece upgrade a conta em crise.",
  },
  // 6 · Atendimento ↔ CS
  {
    a: "atendimento", b: "customer-success", floor: "heart", nature: "handoff",
    object: "Tickets por conta / escalonamento / cancelamento",
    why: "Tickets entram na saúde da conta; críticos e cancelamentos chegam ao CS.",
    breaks: "O CSM descobre 9 tickets na reunião de renovação.",
  },
  // 7 · Operações → Atendimento
  {
    a: "operacoes-entrega", b: "atendimento", floor: "heart", nature: "dependência",
    object: "Status do pedido ou da OS / ocorrência",
    why: "Rastreio e atraso visíveis para quem atende, antes do cliente perguntar.",
    breaks: "“Onde está meu pedido” lota a fila.",
  },
  // 8 · Marketing ↔ Atendimento (dois sentidos)
  {
    a: "marketing-growth", b: "atendimento", floor: "heart", nature: "dependência",
    object: "Campanha com regras ↔ ticket crítico e caso público",
    why: "Regras do cupom chegam ao Atendimento antes do disparo; ticket crítico pausa a promoção.",
    breaks: "O Atendimento desconhece o cupom; quem reclamou ontem recebe promoção hoje.",
  },
  // 9 · Atendimento → Financeiro
  {
    a: "atendimento", b: "financeiro", floor: "heart", nature: "handoff",
    object: "Solicitação de estorno ou contestação",
    why: "Estorno e contestação sobem com fatura e motivo; a 2ª via simples fica no Atendimento.",
    breaks: "O cliente pede o estorno 3 vezes, e ninguém sabe o status.",
  },
  // 10 · Operações → Financeiro
  {
    a: "operacoes-entrega", b: "financeiro", floor: "heart", nature: "handoff",
    object: "Entrega concluída / aceite; devolução",
    why: "O aceite libera o faturamento; a devolução conferida libera o estorno.",
    breaks: "Faturar antes do aceite; estorno sem devolução, ou parado depois dela.",
  },
  // 11 · Produto → Marketing
  {
    a: "produto", b: "marketing-growth", floor: "heart", nature: "dependência",
    object: "Evento de uso (ativou / parou de usar)",
    why: "O uso real decide a próxima mensagem da régua de ativação.",
    breaks: "E-mail pede uma ação que o cliente já fez.",
  },
  // 12 · RevOps → Marketing
  {
    a: "revops", b: "marketing-growth", floor: "heart", nature: "dependência",
    object: "Regras do lead e do opt-out: score, distribuição, SLA",
    why: "Score, distribuição e prazo combinados com Vendas; o opt-out vale em toda ferramenta.",
    breaks: "A regra mudou na planilha, não no CRM.",
  },
  // 13 · ★ Financeiro → CS
  {
    a: "financeiro", b: "customer-success", floor: "brain", floorB: "heart", key: true, nature: "dependência",
    object: "Status de pagamento / inadimplência",
    why: "Fatura vencida aparece na conta; o CSM pausa ofertas e ajuda a destravar o pagamento.",
    breaks: "Oferta de upgrade a cliente com 2 faturas atrasadas.",
  },
  // 14 · ★ Atendimento → Produto
  {
    a: "atendimento", b: "produto", floor: "heart", floorB: "brain", key: true, nature: "feedback",
    object: "Motivos de ticket + pedidos de melhoria por conta",
    why: "Volume por motivo e receita das contas afetadas priorizam o roadmap.",
    breaks: "Motivo em texto livre; ninguém consegue somar.",
  },
  // 15 · CS → Marketing
  {
    a: "customer-success", b: "marketing-growth", floor: "heart", floorB: "brain", nature: "feedback",
    object: "Motivo de cancelamento, NPS, indicação",
    why: "Quem fica e quem sai redefine o público e as mensagens.",
    breaks: "Marketing segue atraindo o perfil que mais cancela.",
  },
  // 16 · Produto – CS
  {
    a: "produto", b: "customer-success", floor: "brain", nature: "meta compartilhada",
    object: "Evento “ativou” e marco de primeiro valor da conta",
    why: "O evento “ativou” de Produto é o primeiro passo do primeiro valor que CS acompanha.",
    breaks: "Produto comemora a ativação; CS vê a conta sem resultado.",
  },
  // 17 · RevOps – Vendas
  {
    a: "revops", b: "vendas", floor: "brain", nature: "meta compartilhada",
    object: "Etapas do funil + forecast",
    why: "Critério de saída igual para todos torna o forecast confiável.",
    breaks: "Forecast vira chute; cada vendedor usa um critério.",
  },
  // 18 · RevOps – Financeiro
  {
    a: "revops", b: "financeiro", floor: "brain", nature: "meta compartilhada",
    object: "Receita do CRM comparada com o ERP; custo por origem; comissão",
    why: "O número da reunião comercial bate com o do Financeiro, ou a diferença tem motivo.",
    breaks: "Dois números de receita na diretoria; comissão paga sobre venda não faturada.",
  },
];

export function relationsOf(id: DepartmentId): Relation[] {
  return RELATIONS.filter((r) => r.a === id || r.b === id);
}

export function otherSide(r: Relation, id: DepartmentId): DepartmentId {
  return r.a === id ? r.b : r.a;
}
