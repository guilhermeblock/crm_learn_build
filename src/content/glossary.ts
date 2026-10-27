import type { GlossaryTerm } from "./types";

/** Glossário final (docs/conteudo/09 §3): termos que aparecem no painel e no mapa. */
export const GLOSSARY: GlossaryTerm[] = [
  { term: "2ª via", definition: "Nova cópia do boleto ou da nota fiscal, enviada a pedido do cliente." },
  { term: "Aditivo", definition: "Documento que altera um contrato em vigor, como mais usuários ou um plano maior; ajusta a fatura." },
  { term: "Alçada", definition: "Limite de desconto ou prazo que cada cargo pode aprovar sozinho." },
  { term: "Ativação (“ativou”)", definition: "Evento registrado quando a conta conclui a configuração mínima e começa a usar o produto." },
  { term: "Autoatendimento", definition: "O cliente resolve sozinho (2ª via, rastreio) por menu, robô ou portal, sem entrar na fila." },
  { term: "Automação (regra quando → então)", definition: "Regra que o CRM executa sozinho: quando algo acontece, então faz uma ação, como avisar ou travar." },
  { term: "B2B / B2C", definition: "B2B: empresa que vende para outras empresas. B2C: empresa que vende direto para pessoas." },
  { term: "Base legal", definition: "O que a LGPD aceita para usar um dado pessoal: consentimento, contrato, legítimo interesse ou outra hipótese prevista." },
  { term: "BI", definition: "Business Intelligence: painéis de indicadores montados com dados do CRM, do ERP e dos canais." },
  { term: "Cadastro duplicado", definition: "Dois cadastros para o mesmo cliente; nasce quando a busca é por nome, e não por CNPJ ou CPF." },
  { term: "Cadastro fiscal", definition: "Dados da nota fiscal: CNPJ ou CPF, razão social, endereço; em serviço, município e e-mail de cobrança, sem inscrição estadual." },
  { term: "Canal de origem", definition: "Por onde o contato chegou (WhatsApp, telefone, consumidor.gov.br, Procon); não é o motivo." },
  { term: "Carteira", definition: "Grupo de contas sob responsabilidade de um CSM ou vendedor; a pessoa sai, a carteira fica com a empresa." },
  { term: "Caso público", definition: "Reclamação feita em canal aberto (rede social, site de reclamações), respondida com texto aprovado." },
  { term: "Categoria (varejo)", definition: "No varejo, a área que decide o que a loja vende, numeração e preço; faz o papel de Produto." },
  { term: "CDC", definition: "Código de Defesa do Consumidor: lei que rege compra, cobrança, troca e arrependimento de quem compra para si." },
  { term: "Churn (cancelamento)", definition: "Nome em inglês para o cliente que cancelou ou não renovou; no painel, aparece como “cancelamento”." },
  { term: "Comissão sobre o recebido (clawback)", definition: "Comissão paga quando o cliente paga, e não no ganho; se ele cancela cedo, é devolvida (clawback)." },
  { term: "Consentimento", definition: "Registro de que a pessoa aceitou receber mensagens, por canal e finalidade." },
  { term: "consumidor.gov.br", definition: "Plataforma pública do governo federal onde o consumidor reclama; a empresa tem 10 dias para responder." },
  { term: "Contestação", definition: "O cliente discorda de um valor cobrado e pede revisão." },
  { term: "Contorno", definition: "Solução provisória que deixa o cliente trabalhar enquanto o erro é corrigido de vez." },
  { term: "Critério de saída", definition: "O que precisa ser verdade para a oportunidade mudar de etapa." },
  { term: "CRM (como usamos aqui)", definition: "Coordenação entre áreas: regras combinadas, registro na conta e dados que voltam à decisão; o software é só uma parte." },
  { term: "CS (Customer Success)", definition: "Sucesso do Cliente: acompanha cada conta depois da venda, para que use, tenha resultado e renove; Atendimento reage por ticket." },
  { term: "CSAT", definition: "Nota de satisfação dada logo depois de um atendimento." },
  { term: "CSM", definition: "Pessoa de CS responsável por uma carteira de contas." },
  { term: "Devolução", definition: "Registro de um produto que volta: motivo, coleta, conferência (uso, etiqueta) e troca ou estorno liberados." },
  { term: "Direito de arrependimento (CDC, art. 49)", definition: "Em compra fora da loja física, o cliente pode desistir em 7 dias após receber, sem motivo, com estorno total." },
  { term: "Disparo / campanha", definition: "Campanha: ação de marketing com público, oferta e verba. Disparo: o envio de uma mensagem da campanha ou da régua." },
  { term: "Duplicidade", definition: "A mesma compra cobrada duas vezes (duas capturas no cartão); o valor a mais volta por estorno." },
  { term: "Encarregado (DPO)", definition: "Pessoa que responde pela empresa sobre dados pessoais, exigida pela LGPD; atende pedidos de acesso e exclusão." },
  { term: "ERP", definition: "Sistema de gestão onde ficam nota fiscal, estoque e financeiro." },
  { term: "Estorno", definition: "Devolução ao cliente de um valor já cobrado." },
  { term: "Evento de uso", definition: "Registro automático de uma ação do cliente no produto, como “ativou” ou “parou de usar”." },
  { term: "Expansão (upsell)", definition: "Venda a mais para quem já é cliente: mais usuários, um plano maior ou outro produto." },
  { term: "Farol", definition: "Cor de saúde da conta (verde, amarelo, vermelho), marcada à mão ou calculada." },
  { term: "Forecast", definition: "Previsão de vendas do período, feita a partir do funil." },
  { term: "Funil (pipeline)", definition: "Etapas pelas quais as oportunidades passam até ganho ou perda; cada etapa tem critério de saída." },
  { term: "Go-live / aceite", definition: "Go-live: o sistema entra no ar. Aceite: o cliente confirma, por escrito, que a implantação está pronta, com pendências listadas." },
  { term: "Health score (saúde da conta)", definition: "Nota de saúde da conta, quando a empresa define a regra: uso, tickets, pagamento." },
  { term: "Implantação", definition: "Projeto que entrega o escopo contratado (integração, configuração) até o aceite; diferente do onboarding, que leva ao primeiro valor." },
  { term: "Inadimplência", definition: "Fatura vencida e não paga." },
  { term: "Integração (entre sistemas)", definition: "Ligação automática entre dois sistemas, que leva um registro de um para o outro, como do CRM ao ERP." },
  { term: "ISS", definition: "Imposto sobre serviços, recolhido ao município; incide na NFS-e, e não na venda de produto." },
  { term: "Item do catálogo", definition: "Plano, produto ou pacote cadastrado por Produto, com preço de tabela, vigência e status; a proposta só usa esses itens." },
  { term: "Lead", definition: "Pessoa ou empresa que demonstrou interesse e ainda não comprou." },
  { term: "Legítimo interesse", definition: "Base da LGPD que permite contato sem consentimento com quem já tem relação com a empresa, sempre com saída fácil." },
  { term: "LGPD", definition: "Lei Geral de Proteção de Dados: dado pessoal só para quem precisa dele na tarefa, com base legal." },
  { term: "Lifecycle (time de CRM)", definition: "Estação de Marketing que manda mensagens a leads e clientes conforme a etapa; no varejo, chama-se time de CRM." },
  { term: "Lista fechada", definition: "Campo em que se escolhe uma opção pré-definida, em vez de escrever texto livre; é o que permite somar." },
  { term: "Logística reversa", definition: "O caminho de volta do produto, numa troca ou devolução; a loja paga a postagem." },
  { term: "Mesclar", definition: "Juntar dois cadastros do mesmo cliente em um só, sem perder o histórico de nenhum." },
  { term: "Motivo em 2 níveis", definition: "Classificação do ticket em grupo e detalhe (“Cobrança > Duplicidade”), escolhida de uma lista fechada." },
  { term: "MQL / SQL", definition: "MQL: lead aprovado por Marketing para abordagem. SQL: lead aceito por Vendas como oportunidade real." },
  { term: "N1 / N2", definition: "N1: linha de frente, que resolve o simples na hora. N2 (backoffice): especialistas que recebem o que o N1 escala." },
  { term: "Negativação / protesto", definition: "Últimos degraus da cobrança, após aviso e prazo: registro do devedor em cadastro de inadimplentes / da dívida em cartório." },
  { term: "NF", definition: "Nota fiscal: documento fiscal da venda, emitido pelo Financeiro no ERP." },
  { term: "NFS-e", definition: "Nota fiscal de serviço eletrônica: a NF de quem vende serviço, como software por assinatura; recolhe ISS." },
  { term: "Notas de passagem", definition: "O que Vendas registra no ganho para quem vai cuidar do cliente." },
  { term: "NPS", definition: "Net Promoter Score: pergunta “recomendaria a empresa?”, respondida de 0 a 10." },
  { term: "Ocorrência", definition: "Atraso, extravio, avaria ou cliente ausente, registrado no pedido em lista fechada." },
  { term: "Onboarding", definition: "Primeiros passos do cliente depois da compra, até o primeiro valor." },
  { term: "Oportunidade", definition: "Negociação aberta, com valor, etapa e data prevista de fechamento." },
  { term: "Opt-in / opt-out", definition: "Opt-in: aceite prévio para receber mensagens num canal. Opt-out: pedido para não receber mais; vale em toda ferramenta." },
  { term: "Origem do lead", definition: "Canal ou campanha que trouxe o lead, gravado em lista fechada no primeiro contato." },
  { term: "OS", definition: "Ordem de serviço: o registro de uma visita técnica." },
  { term: "Pausa de ofertas", definition: "Regra que suspende ofertas de expansão ou promoção enquanto há fatura vencida ou ticket crítico; avisos continuam." },
  { term: "Pedido de melhoria", definition: "Pedido do cliente por uma mudança no produto, registrado na conta com tema." },
  { term: "Plano de sucesso", definition: "Meta do cliente, marcos e primeiro valor combinados no onboarding." },
  { term: "PQL", definition: "Product Qualified Lead: lead que nasce do uso do produto, em autoatendimento." },
  { term: "Prazo de pagamento", definition: "Dias entre a emissão da fatura e o vencimento; aprovado pelo Financeiro quando foge da política." },
  { term: "Prazo prometido", definition: "Data combinada com o cliente na venda ou na compra; fica gravada à parte do prazo real." },
  { term: "Preço de tabela", definition: "Preço oficial de um item do catálogo, antes de qualquer desconto." },
  { term: "Primeiro valor", definition: "Primeiro resultado concreto que o cliente tem com o que comprou." },
  { term: "Procon", definition: "Órgão público de defesa do consumidor; recebe reclamações, intermedia e pode multar a empresa." },
  { term: "QBR", definition: "Quarterly Business Review: revisão trimestral de resultados com o cliente." },
  { term: "Raiz do CNPJ", definition: "Os 8 primeiros dígitos do CNPJ, iguais para a matriz e as filiais da mesma empresa." },
  { term: "Reabertura", definition: "Ticket fechado que o cliente abre de novo pelo mesmo problema; sinal de que não foi resolvido." },
  { term: "Receita por origem", definition: "Soma das vendas fechadas, agrupadas pelo canal que trouxe cada lead." },
  { term: "Reconquista", definition: "Contato com quem cancelou ou parou de comprar, para trazê-la de volta; a régua segue o motivo da saída." },
  { term: "Regra de distribuição", definition: "Regra que define quem recebe cada lead, por qual critério e em quanto tempo deve responder." },
  { term: "Régua", definition: "Sequência automática de mensagens com regras de envio (ativação, cobrança, reconquista); checa exclusões antes de cada disparo." },
  { term: "Régua de cobrança", definition: "Degraus do Financeiro a partir do vencimento: aviso (1º, 5º, 15º dia), negociação, suspensão avisada, negativação e protesto." },
  { term: "Renovação", definition: "Novo período do contrato, negociado antes de o atual vencer; em assinatura anual, abre 90 dias antes." },
  { term: "Retenção", definition: "Equipe que atende quem pede para cancelar; em B2C, faz o papel do CS." },
  { term: "Retenções na fonte", definition: "Impostos que o cliente desconta do boleto e recolhe por conta própria; mudam o valor a pagar." },
  { term: "RevOps", definition: "Revenue Operations: time que define as regras do CRM e cuida do dado, sem atender clientes." },
  { term: "Roadmap", definition: "O que o produto vai construir, e em que ordem." },
  { term: "SaaS", definition: "Software as a Service: software vendido por assinatura e usado pela internet; a empresa B2B do fio condutor é uma." },
  { term: "SDR", definition: "Sales Development Representative: pré-vendedor que faz a primeira abordagem do lead." },
  { term: "Segmento", definition: "Grupo de contatos escolhido por um critério, com exclusões conferidas antes do envio." },
  { term: "SLA", definition: "Service Level Agreement: prazo combinado para responder ou resolver." },
  { term: "Sortimento", definition: "O conjunto de modelos, cores e numerações que a loja decide ter à venda." },
  { term: "Tabela de numeração", definition: "Grade de tamanhos de um item e como cada um veste; corrigida quando as trocas mostram diferença." },
  { term: "Tema (do pedido de melhoria)", definition: "Categoria de lista fechada que agrupa pedidos iguais escritos com palavras diferentes." },
  { term: "Ticket", definition: "Registro de um contato do cliente que precisa de resposta; sinônimos: chamado, protocolo." },
  { term: "Ticket crítico", definition: "Ticket de prioridade máxima: canal público, cobrança indevida, 2ª reabertura ou cancelamento; pausa ofertas até 7 dias após a solução." },
  { term: "Usuário-chave", definition: "Pessoa do cliente treinada na implantação para ensinar os colegas." },
  { term: "UTM", definition: "Urchin Tracking Module: etiqueta no link que diz de qual campanha veio o clique." },
  { term: "Venda assistida", definition: "Compra feita no site ou no app, mas destravada por uma pessoa na conversa; o pedido fica ligado à conversa." },
  { term: "WhatsApp da empresa", definition: "Número da empresa ligado ao CRM: a conversa fica registrada na conta, e não no celular de quem atendeu." },
];

/*
 * Como cada termo aparece no texto corrido. Por padrão: o nome dividido em " / " e o
 * que está entre parênteses. As exceções evitam falsos acertos (ex.: "aceite" também
 * significa consentimento em Marketing; "varejo" e "cancelamento" são palavras comuns)
 * ou acrescentam grafias do texto ("backoffice", "régua de inadimplência"). Lista vazia =
 * termo só de busca, sem destaque automático.
 */
const ALIASES: Record<string, string[]> = {
  "Ativação (“ativou”)": ["ativação"],
  "Automação (regra quando → então)": ["automação"],
  "Cadastro duplicado": ["cadastro duplicado", "duplicado"],
  "Categoria (varejo)": ["categoria"],
  "CDC": ["CDC", "Código de Defesa do Consumidor"],
  "Churn (cancelamento)": ["churn"],
  "CRM (como usamos aqui)": [],
  "Direito de arrependimento (CDC, art. 49)": ["direito de arrependimento", "arrependimento"],
  "Go-live / aceite": ["go-live", "termo de aceite"],
  "Health score (saúde da conta)": ["health score", "saúde da conta"],
  "Integração (entre sistemas)": ["integração"],
  "Lifecycle (time de CRM)": ["lifecycle", "time de CRM"],
  "Mesclar": ["mesclar", "mescla"],
  "N1 / N2": ["N1", "N2", "backoffice", "linha de frente"],
  "Raiz do CNPJ": ["raiz do CNPJ"],
  "Régua de cobrança": ["régua de cobrança", "régua de inadimplência"],
  "Tema (do pedido de melhoria)": ["tema"],
  "Usuário-chave": ["usuário-chave", "usuários-chave"],
};

function aliasesOf(term: string): string[] {
  if (term in ALIASES) return ALIASES[term];
  const paren = term.match(/\(([^)]+)\)/)?.[1];
  const base = term.replace(/\s*\([^)]*\)/, "");
  return [...base.split(" / "), ...(paren ? [paren] : [])].map((a) => a.replace(/[“”"]/g, "").trim()).filter(Boolean);
}

/** sigla ou nome próprio (MQL, NF, OS, RevOps): só casa com a grafia exata */
const isExact = (a: string) => /[A-Z]/.test(a.slice(1)) || /^[A-Z0-9]{2,5}$/.test(a);

/** plurais simples do português, no singular → plural do primeiro termo */
function forms(a: string): string[] {
  if (isExact(a)) return [a, `${a}s`];
  const [first, ...rest] = a.split(" ");
  const tail = rest.length ? ` ${rest.join(" ")}` : "";
  const plural = /ção$/.test(first)
    ? first.replace(/ção$/, "ções")
    : /ão$/.test(first)
      ? first.replace(/ão$/, "ões")
      : /[rz]$/.test(first)
        ? `${first}es`
        : /[sx]$/i.test(first)
          ? null
          : `${first}s`; // vogal ou termo emprestado do inglês (leads, tickets)
  return plural ? [a, `${plural}${tail}`] : [a];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Matcher {
  exact: Map<string, GlossaryTerm>;
  loose: Map<string, GlossaryTerm>;
  re: { exact: RegExp; loose: RegExp };
}

let matcher: Matcher | null = null;

function build(): Matcher {
  const exact = new Map<string, GlossaryTerm>();
  const loose = new Map<string, GlossaryTerm>();
  for (const t of GLOSSARY) {
    for (const alias of aliasesOf(t.term)) {
      for (const f of forms(alias)) {
        if (isExact(alias)) exact.set(f, t);
        else loose.set(f.toLowerCase(), t);
      }
    }
  }
  // o mais longo primeiro: "ticket crítico" antes de "ticket"
  const alt = (keys: Iterable<string>) => [...keys].sort((a, b) => b.length - a.length).map(escape).join("|");
  const wrap = (body: string, flags: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${body})(?![\\p{L}\\p{N}-])`, flags);
  return { exact, loose, re: { exact: wrap(alt(exact.keys()), "gu"), loose: wrap(alt(loose.keys()), "giu") } };
}

export interface TermMatch {
  start: number;
  end: number;
  term: GlossaryTerm;
}

/** Termos do glossário num texto, sem sobreposição (o que começa antes e é mais longo vence). */
export function findTerms(text: string): TermMatch[] {
  matcher ??= build();
  const found: TermMatch[] = [];
  for (const [re, map, key] of [
    [matcher.re.exact, matcher.exact, (s: string) => s],
    [matcher.re.loose, matcher.loose, (s: string) => s.toLowerCase()],
  ] as const) {
    for (const m of text.matchAll(re)) {
      const term = map.get(key(m[0]));
      if (term) found.push({ start: m.index, end: m.index + m[0].length, term });
    }
  }
  found.sort((a, b) => a.start - b.start || b.end - a.end);
  const out: TermMatch[] = [];
  for (const f of found) if (!out.length || f.start >= out[out.length - 1].end) out.push(f);
  return out;
}

/** busca sem acento e sem caixa: nome primeiro, depois definição */
export function searchGlossary(query: string): GlossaryTerm[] {
  const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const q = norm(query.trim());
  if (!q) return GLOSSARY;
  const byName = GLOSSARY.filter((t) => norm(t.term).includes(q));
  const byDef = GLOSSARY.filter((t) => !byName.includes(t) && norm(t.definition).includes(q));
  return [...byName, ...byDef];
}
