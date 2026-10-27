import type { DepartmentId } from "@/scene/config/constants";
import type { AreaContent } from "./types";

/*
 * Conteúdo por área, revisado em dupla (especialista da área + arquiteto de CRM/RevOps)
 * e consolidado em docs/conteudo/09_consolidacao.md. Gerado a partir dos blocos ts
 * de docs/conteudo/01–08: edite lá e regenere, ou edite aqui e atualize o doc.
 * Números dos casos são ilustrativos (o painel marca isso).
 */
export const AREA_CONTENT: Record<DepartmentId, AreaContent> = {
  "marketing-growth": {
    // contrato didático (docs/conteudo/11), F3: dois casos, Aurora (B2B) e Marina (B2C)
    id: "marketing-growth",
    oneLiner: "Atrai interessados (leads), registra de onde cada um veio e decide quem pode receber mensagem hoje.",
    keyQuestion: "Quais origens trazem clientes que ficam, e quem pode receber mensagem hoje?",
    withoutCrm:
      "Marketing comemora o volume de leads do mês, e Vendas diz que são ruins. Ninguém consegue provar nada, porque a origem não foi gravada e o prazo de abordagem não foi medido. Na loja, a promoção chega a quem reclamou ontem.",
    withCrm:
      "Cada lead nasce com origem e etapa, o descarte tem motivo de lista fechada, e o prazo de resposta é medido. Antes de cada disparo, a régua (a sequência automática de mensagens) confere quem aceitou receber e quem está com problema aberto.",
    whyCrm:
      "A diferença está em duas regras, não na ferramenta. A origem entra em lista fechada e viaja com o lead até o contrato; só assim a receita se soma por canal. Aceite, ticket e fatura são lidos antes de cada envio, por regra combinada com Atendimento, Financeiro e RevOps (o time que cuida das regras e integrações do CRM).",
    cases: {
      b2b: {
        steps: [
          "Dia 1: às 9h, logo depois do webinar sobre fechamento do mês, a Aurora Transportes pede uma demonstração no site. O interessado (lead) nasce no CRM com a origem “webinar” e a campanha gravadas.",
          "9h01: pedido de demonstração não espera a pontuação (score), e o lead vira MQL (lead aprovado por Marketing) na hora. O pré-vendedor (SDR) recebe o aviso com prazo de 4 horas úteis e liga às 9h40.",
          "Dia 30: a Aurora assina o contrato: R$ 48 mil por ano, mais a implantação (a configuração do sistema até ele entrar no ar). A origem “webinar” seguiu com a oportunidade (a negociação) até o ganho, sem que ninguém precisasse digitá-la de novo.",
          "Dia 90: no fechamento do trimestre, a analista de mídia soma a receita por origem. O webinar trouxe a Aurora; os anúncios de clique trouxeram o triplo de leads e nenhum contrato. A verba seguinte muda de lugar.",
        ],
        outcome:
          "A origem “webinar” prova a Marketing qual verba virou venda: a receita por origem decide onde a verba entra e de onde sai.",
        why: "A origem só prova algo porque foi gravada no primeiro segundo, em lista fechada, e viajou com o lead até o contrato. Se o pré-vendedor digitasse “indicação” de memória, ou se o webinar virasse “site”, a verba seguiria para o canal errado. E o relógio gravado no lead responde sozinho: a ligação saiu em 4 horas úteis, ou não saiu.",
      },
      b2c: {
        steps: [
          "19h40: Marina deixa um tênis de R$ 300 no carrinho do app e fecha a tela sem comprar.",
          "19h41: a régua confere o aceite: Marina disse sim ao WhatsApp da loja quando se cadastrou. Depois confere se há ticket crítico (uma reclamação grave ainda aberta): não há. O envio fica para a manhã.",
          "10h do dia seguinte: Marina recebe no WhatsApp um cupom de 10% para o tênis, válido por 24 horas. Atendimento recebeu as regras na véspera, e quem atender sabe responder.",
          "10h20: Marina compra o tênis por R$ 270. O pedido nasce ligado à campanha e ao cupom, e a régua para na hora: ninguém manda “esqueceu algo?” para quem já comprou.",
        ],
        outcome:
          "No fim do mês, compras e pedidos de saída (opt-out) por régua decidem se o cupom de carrinho continua, muda de valor ou é desligado.",
        why: "A régua decide pela regra, e não pelo impulso. Checar o aceite protege a loja: sem o sim prévio, a plataforma de WhatsApp bloqueia o número da empresa. Checar o ticket crítico protege a relação: Marina, com uma reclamação aberta, leria o cupom como provocação. E o pedido ligado à campanha mostra se o cupom pagou a si mesmo.",
      },
    },
    variants: {
      b2b: "Ciclo longo: o lead vira MQL, vai a Vendas com prazo, e o descarte volta com motivo.",
      b2c: "O “time de CRM” da loja é a estação Lifecycle (um dos postos de trabalho do andar Heart): régua de e-mail, push e WhatsApp para carrinho, recompra e reconquista. No marketplace (a venda dentro do site de outra empresa), o contato fica com a plataforma: a régua só alcança quem comprou no site ou no app.",
      small: "Uma pessoa, muitas vezes com agência; o lead chega pelo WhatsApp sem origem. Perguntar “como nos conheceu?” e gravar a resposta já é a primeira regra.",
    },
    brain: {
      idea: "No Brain, Marketing decide onde a verba entra e quem recebe mensagem. As duas decisões dependem de dois campos que alguém grava no dia a dia: a origem de cada lead e o aceite de cada contato. Sem eles, a reunião discute impressões.",
      objectives: [
        "Trazer leads que viram venda, e não só cliques",
        "Gerar recompra e indicação pela régua, sem cansar o cliente",
        "Falar só com quem pode receber: quem consentiu ou quem já é cliente (legítimo interesse, a permissão da lei para falar com quem já compra), sempre com saída fácil",
      ],
      decisions: [
        "Qual canal recebe a verba do mês, pela receita que gerou e não pelo volume de leads?",
        "Vendas descarta leads demais: o corte do MQL está errado, ou o público da campanha?",
        "Qual régua manter, ajustar ou desligar, pelas compras e pelos pedidos de saída que ela gera?",
      ],
      why: "A verba segue o número que a reunião enxerga. Se o painel mostra leads, a agência otimiza para leads baratos, e Vendas recebe estudantes e curiosos. Se mostra receita por origem, a verba vai para o webinar que trouxe a Aurora. O mesmo vale para a régua: medida por cliques, ela dispara mais; medida por opt-out, ela aprende a parar.",
      indicators: [
        { name: "Receita por origem", source: "origem do lead gravada na oportunidade ganha, somada por trimestre" },
        { name: "MQL aceitos por Vendas", source: "etapa do lead e motivo de descarte, de lista fechada" },
        { name: "Compra e opt-out por régua", source: "envio, pedido ligado à campanha e pedido de saída, por régua" },
      ],
      ritual: "Segunda-feira, com Vendas: MQLs da semana, descartes por motivo e prazos de abordagem estourados.",
      customerImpact: "Quem pede demonstração tem retorno no dia; quem pede para sair, sai de todos os canais.",
      think: "Na sua empresa, a verba de mídia é decidida pelo número de leads ou pela receita que cada origem trouxe? Quem consegue provar?",
    },
    heart: {
      idea: "No Heart, Marketing é três estações: Demanda passa o lead a Vendas; Lifecycle (o time que o varejo chama de CRM) decide quem recebe mensagem hoje; Marca & Conteúdo aprova o tom dos avisos difíceis. As três quebram no mesmo lugar: na regra não combinada.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Calendário de campanhas e réguas: mesa compartilhada e grade de disparos da semana.",
      roles: ["Gerente de marketing", "Analista de mídia", "Analista de CRM", "Analista de conteúdo"],
      dayInLife: [
        { time: "9h", action: "A analista de mídia pausa o anúncio cujos leads Vendas mais descarta como “sem perfil”." },
        { time: "11h", action: "O analista de CRM confere o segmento e as exclusões (ticket crítico e fatura vencida) antes do disparo das 14h." },
        { time: "16h", action: "A gerente de marketing manda a Atendimento as regras do cupom de amanhã: valor, validade e o que não vale." },
      ],
      subAreas: [
        {
          id: "demanda",
          name: "Demanda / Aquisição",
          process: {
            origin: "Meta do trimestre e verba de mídia, por canal",
            decision: "Pôr verba onde virou venda, e não onde deu clique",
            output: "Lead com origem gravada; o MQL vai a Vendas com prazo",
          },
          handoff: { to: "vendas", object: "MQL com origem, pontuação (score) e prazo de abordagem" },
          record: "Lead: origem, campanha, score, etapa e motivo de descarte",
          customerImpact: "O pré-vendedor liga sabendo o que a pessoa assistiu ou baixou.",
          why: "O prazo vai junto porque a espera precisa ter dono: sem ele, o lead esfria e cada área culpa a outra. O descarte volta com motivo de lista fechada (sem perfil, sem orçamento, sem interesse, concorrente, contato inválido, duplicado): só assim Marketing muda o público da campanha em vez de comprar o mesmo lead outra vez.",
        },
        {
          id: "lifecycle",
          name: "Lifecycle / CRM",
          process: {
            origin: "Compra, carrinho abandonado, queda de uso ou lead descartado por “sem orçamento”",
            decision: "Checar aceite por canal, ticket crítico e fatura vencida antes de enviar",
            output: "Mensagem enviada, ou adiada enquanto houver pendência",
          },
          handoff: { to: "atendimento", object: "Oferta com as regras do cupom, antes do disparo" },
          record: "Contato: envios, respostas, aceite por canal e opt-out",
          customerImpact: "Quem reclamou ontem não recebe “compre de novo” hoje.",
          why: "A oferta errada custa mais do que a venda que traria: o cupom chega a quem tem uma cobrança duplicada, e a cliente leva a conversa a um site público de reclamação. Por isso só a oferta pausa; aviso de entrega e de cobrança continuam, porque o cliente precisa deles. A pausa acaba 7 dias após o ticket fechar.",
        },
        {
          id: "marca-conteudo",
          name: "Marca & Conteúdo",
          process: {
            origin: "Reclamação pública, aviso de atraso ou texto de cobrança",
            decision: "Definir o tom e o que não se pode prometer",
            output: "Resposta pública e modelo de aviso aprovados, com versão",
          },
          handoff: { to: "atendimento", object: "Resposta aprovada para o caso público" },
          record: "Modelo de mensagem: canal, uso, versão e quem aprovou",
          customerImpact: "O aviso de atraso soa como explicação, e não como anúncio.",
          why: "O texto de cobrança é aprovado uma vez pelo Jurídico, porque o Código de Defesa do Consumidor proíbe constranger quem deve; Marca & Conteúdo dá o tom, e o Financeiro dispara. Sem modelo aprovado, cada atendente improvisa, e a resposta pública de hoje contradiz a de ontem. A versão registrada diz qual texto cada cliente recebeu.",
        },
      ],
      pitfalls: [
        "Lista da feira importada semanas depois, sem origem: o lead esfriou, e ninguém sabe se a feira pagou a si mesma.",
        "Meta em volume de leads: o número sobe, a agência comemora, e as oportunidades em Vendas não aumentam.",
        "“Não me mande nada” fica gravado só na ferramenta de WhatsApp: o e-mail segue enviando, e a pessoa reclama em público.",
      ],
      think: "Na sua empresa, quem confere, antes de um disparo, se o cliente está com um problema aberto? Como essa pessoa descobre?",
    },
    backbone: {
      idea: "No Backbone, Marketing é dono de cinco objetos: Lead, Contato, Consentimento, Campanha e Segmento. Dois campos sustentam o Brain inteiro: a origem do lead, que diz qual verba virou venda, e o aceite por canal, que diz quem pode receber mensagem hoje.",
      crmObjects: [
        { object: "Lead", actions: ["cria", "edita"], fields: ["origem (lista fechada)", "score", "etapa", "motivo de descarte"] },
        { object: "Contato", actions: ["cria", "edita"], fields: ["e-mail", "telefone", "segmento", "conta"] },
        { object: "Consentimento", actions: ["cria", "edita"], fields: ["canal", "finalidade", "base legal", "data do aceite ou do opt-out"] },
        { object: "Campanha", actions: ["cria", "edita"], fields: ["UTM (o código no link que marca a campanha)", "verba", "regras da oferta"] },
        { object: "Segmento", actions: ["cria", "edita"], fields: ["critério", "exclusões: ticket crítico e fatura vencida", "régua e horário de envio"] },
      ],
      criticalField:
        "Origem do lead, em lista fechada. Sem ela, ninguém sabe qual verba virou venda, e a verba seguinte vai para o canal que mais grita, e não para o que mais vende.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "o lead vira MQL",
          then: "o pré-vendedor recebe o aviso com prazo de 4 horas úteis, e o relógio fica registrado",
          why: "O prazo medido encerra a briga entre as áreas. Sem registro, Marketing diz que entregou e Vendas diz que o lead chegou frio. Com a hora do aviso e a da primeira tentativa gravadas no lead, a reunião de segunda discute o caso, e não a versão de cada um.",
        },
        {
          when: "há ticket crítico aberto ou fatura vencida na conta",
          then: "o contato sai das ofertas até resolver; avisos de entrega e de cobrança continuam",
          why: "Oferta para quem está brigando com a empresa vira reclamação pública, e a venda que ela traria não paga esse custo. O aviso continua porque é dever da empresa, e não oferta. Atendimento define o que é crítico, Financeiro marca a fatura vencida, Marketing aplica a pausa, e RevOps configura a regra.",
        },
        {
          when: "alguém responde “SAIR” ou pede para não receber",
          then: "o opt-out é gravado no Consentimento e vale para toda ferramenta de envio",
          why: "O pedido chega por um canal, mas a pessoa quer silêncio em todos. Se cada ferramenta guarda o próprio opt-out, o e-mail segue enviando depois do “sair” no WhatsApp, e a pessoa reclama em público ou à autoridade de dados. Gravar no Consentimento é a regra; garantir que toda ferramenta leia esse registro é trabalho de RevOps.",
        },
      ],
      neighborSystems: ["Automação de marketing", "Plataformas de anúncio", "Canais de mensagem", "Loja online e app"],
      feedback: {
        data: "Entre as contas que cancelaram no ano, o motivo “não usou” lidera, e a maioria veio dos anúncios de clique",
        decision: "Marketing muda o público dos anúncios e cria uma régua de ativação para quem acabou de assinar.",
        why: "Um campo que o CS (o pós-venda) preenche no cancelamento, em lista fechada, vira a pauta da verba do trimestre. Mas só se a origem viajou com a conta desde o lead: sem ela, Marketing sabe que clientes saem, não de onde vieram. É o caminho de volta: o dado da operação corrige a estratégia de quem o gerou.",
      },
      governance:
        "A base legal (a permissão da lei para usar o dado) fica registrada por canal no Consentimento: oferta por WhatsApp exige aceite prévio (opt-in), regra da própria plataforma; e-mail a quem já é cliente pode usar legítimo interesse, com saída fácil. A agência não exporta a base; o encarregado de dados (DPO) responde aos pedidos de exclusão.",
      think: "Se um cliente seu pedisse hoje para não receber mais nada, em quantas ferramentas alguém teria que apagar o contato dele?",
    },
  },
  "vendas": {
    // piloto do contrato didático (docs/conteudo/11), revisado por leitor iniciante e especialista (doc 12); F3: dois casos + achados do arquiteto
    id: "vendas",
    oneLiner: "Transforma interessados (leads) em clientes: qualifica, negocia e registra o que foi combinado.",
    keyQuestion: "Quais oportunidades fecham este mês, e quais estão paradas sem próximo passo?",
    withoutCrm:
      "Cada vendedor anota as negociações na própria planilha e no WhatsApp. Para prever o mês, o gerente pergunta a cada um e soma palpites.",
    withCrm:
      "Todos registram cada negociação (oportunidade) do mesmo jeito: valor, data prevista e próximo passo. Por isso a previsão do mês pode ser conferida, e outras áreas veem o que foi combinado.",
    whyCrm:
      "A diferença está na regra, não na ferramenta. Uma planilha também guarda valor e data, mas cada vendedor preenche do seu jeito. Quando a empresa combina campos e critérios de etapa, e o CRM exige isso de todos, os números se somam. A previsão do mês (forecast) soma só o que tem data no mês e etapa avançada.",
    cases: {
      b2b: {
        steps: [
          "Dia 1: às 9h, a Aurora Transportes pede uma demonstração depois de um webinar. Às 9h40, o pré-vendedor (SDR) liga e marca a reunião.",
          "Dia 4: o executivo de vendas confirma o problema da Aurora (o fechamento do mês leva 10 dias), quem decide e o prazo. Ele abre uma oportunidade de R$ 48 mil por ano, mais R$ 20 mil de implantação (a configuração do sistema até ele entrar no ar).",
          "Dia 18: a Aurora pede 12% de desconto na implantação. A alçada do executivo (o limite que ele aprova sozinho) é de 10%, então o gerente aprova no próprio CRM.",
          "Dia 30: contrato assinado, com integração ao ERP (o sistema de gestão) da Aurora. A implantação será faturada em duas parcelas de R$ 8,8 mil, uma na assinatura e outra no aceite (a confirmação de que a implantação foi entregue), e a mensalidade de R$ 4.000 começa quando o sistema entra no ar (go-live). O executivo marca o ganho e registra nas notas de passagem as promessas: a integração e o go-live em 45 dias.",
        ],
        outcome:
          "No mesmo dia, Operações (quem implanta), Financeiro e CS (o pós-venda, que cuida do cliente durante o contrato) recebem o escopo, o desconto aprovado, as parcelas da implantação e o prazo prometido, sem perguntar ao executivo.",
        why: "Cada passo deixou um registro que outra área vai usar. Ligar em 40 minutos importa porque quem pede demonstração costuma falar com concorrentes no mesmo dia. A origem (o webinar) mostra a Marketing qual verba virou venda. O desconto aprovado faz a nota fiscal sair certa. As promessas registradas avisam Operações e CS antes da primeira reunião.",
      },
      b2c: {
        steps: [
          "10h05: Marina responde ao cupom de 10% no WhatsApp da loja e pergunta se o tênis de R$ 300 tem no número 37.",
          "10h08: a vendedora confere o estoque no sistema, confirma que tem e manda o link do produto com o cupom já aplicado. A conversa fica registrada no cadastro da Marina, e não no celular de quem atendeu.",
          "10h20: Marina paga pelo link. O pedido nasce ligado à conversa e ao cupom, marcado como venda assistida (a compra feita no site com a ajuda de uma pessoa).",
        ],
        outcome:
          "O pedido guarda a conversa, o cupom e quem atendeu. Operações entrega, Atendimento responde sem perguntar de novo, e Marketing sabe que essa venda veio do WhatsApp, e não só do site.",
        why: "Na loja não há oportunidade nem negociação: o que faz o papel de Vendas é a conversa que destrava a compra. Se ela fica no celular de quem atendeu, a loja não sabe quantas vendas o WhatsApp gera nem quais perguntas travam a compra. O estoque conferido antes do link evita vender o que não tem.",
      },
    },
    variants: {
      b2b: "Ciclo de semanas a meses, com vários decisores; a oportunidade passa por etapas, proposta e contrato. Em algumas empresas, o Financeiro também aprova o percentual de desconto, e não só o crédito e o prazo de pagamento.",
      b2c: "Na loja online não há oportunidade: o cliente compra direto ou com ajuda no WhatsApp, e a venda vira pedido. Imóveis, carros, cursos e seguros têm funil com vendedor.",
      small: "O dono vende pelo WhatsApp e também cuida do pós-venda. O funil, quando existe, é uma planilha.",
    },
    brain: {
      idea: "No Brain, Vendas decide com a previsão do mês, e Financeiro e Operações planejam caixa e equipe com o mesmo número. Essa previsão só vale se cada executivo mantém valor, data e próximo passo em dia. A estratégia depende da rotina.",
      objectives: ["Bater a meta de vendas", "Acertar a previsão do mês", "Prometer só o que a empresa entrega"],
      decisions: [
        "Quais oportunidades entram na previsão como compromisso (commit)?",
        "O funil (as negociações abertas, por etapa) tem o bastante para bater a meta?",
        "Por que estamos perdendo, e o que muda na proposta?",
      ],
      why: "O forecast quase nunca erra por falta de fórmula. Erra porque a data prevista não foi revisada, ou porque a oportunidade avançou sem cumprir o critério de saída. Também erra quando o vendedor otimista marca tudo como compromisso. O ritual de segunda-feira serve para conferir cada caso contra o registro, e não contra a memória.",
      indicators: [
        { name: "Precisão do forecast", source: "previsão da segunda-feira, comparada com o que fechou no mês" },
        { name: "Cobertura do funil", source: "valor com fechamento previsto no mês, comparado com a meta" },
        { name: "Motivos de perda", source: "campo “motivo de perda” da oportunidade" },
      ],
      ritual: "Forecast de segunda-feira: cada executivo defende, para o gerente, as oportunidades que fecham no mês.",
      customerImpact: "O que foi combinado na proposta continua valendo depois da assinatura.",
      think: "Na sua empresa, quem revisa a data prevista das oportunidades? O que acontece com a previsão quando ninguém revisa?",
    },
    heart: {
      idea: "No Heart, uma venda é uma corrida de revezamento: Marketing passa o lead, o pré-vendedor passa a reunião, o executivo passa o contrato. Cada passagem é um ponto em que a informação pode cair, e a regra de passagem, registrada no CRM, existe para segurá-la.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Revisão do funil: quadro em que cada cartão é uma negociação avançando de etapa.",
      roles: ["Pré-vendedor (SDR)", "Executivo de vendas", "Gerente de canais", "Gerente comercial"],
      dayInLife: [
        { time: "9h", action: "O pré-vendedor liga e manda WhatsApp para os leads que chegaram de manhã." },
        { time: "14h", action: "O executivo registra a reunião e o próximo passo, com data." },
        { time: "17h", action: "O gerente aprova 2 descontos e cobra as oportunidades paradas há mais de 15 dias." },
      ],
      subAreas: [
        {
          id: "pre-vendas",
          name: "Pré-vendas (SDR)",
          process: {
            origin: "Lead de Marketing, com origem e pontuação (score)",
            decision: "Ligar dentro do prazo combinado e checar perfil, interesse e quem decide",
            output: "Reunião marcada, ou lead devolvido com motivo",
          },
          handoff: { to: "marketing-growth", object: "Lead devolvido com motivo" },
          record: "Lead: 1º contato, tentativas, motivo de descarte",
          customerImpact: "Quem pediu contato recebe retorno rápido e sem pressão.",
          why: "Devolver com motivo é o que fecha o ciclo. Se o pré-vendedor só descarta, Marketing continua comprando o mesmo tipo de lead. Com o motivo (“sem orçamento”, “empresa pequena demais”), Marketing muda o público da campanha.",
        },
        {
          id: "executivos",
          name: "Executivos de vendas",
          process: {
            origin: "Oportunidade qualificada: problema, decisor e prazo",
            decision: "Propor só o que a operação entrega e o que cabe na alçada",
            output: "Ganho com notas de passagem, ou perda com motivo",
          },
          handoff: { to: "customer-success", object: "Contrato e notas de passagem" },
          record: "Oportunidade: etapa, valor, data prevista, próximo passo",
          customerImpact: "Na implantação, ninguém pergunta o que já foi combinado.",
          why: "A meta do executivo conta no ganho, mas quem cumpre a promessa são Operações e CS. Por isso a comissão costuma ser paga sobre o que o cliente pagou, e descontada de volta se ele cancelar cedo. Promessa sem registro vira, meses depois, implantação atrasada ou cancelamento. As notas de passagem tornam a promessa visível para quem vai cumpri-la.",
        },
        {
          id: "expansao",
          name: "Expansão de contas",
          context: "b2b",
          process: {
            origin: "Oportunidade de expansão aberta pelo CS",
            decision: "Conta sem ticket crítico e com faturas em dia? Só então propor",
            output: "Aditivo assinado; comissão dividida pela regra combinada",
          },
          handoff: { to: "financeiro", object: "Aditivo para ajustar a fatura" },
          record: "Oportunidade: origem CS, valor, aditivo",
          customerImpact: "Ninguém oferece upgrade a quem está com problema sem solução.",
          why: "A expansão nasce no CS e fecha em Vendas, e as duas áreas têm meta. Sem a divisão da comissão combinada antes, cada uma disputa o crédito, e a proposta espera. Checar tickets e faturas evita oferecer upgrade a quem está em crise, o que costuma acelerar o cancelamento.",
        },
        {
          id: "parceiros",
          name: "Parceiros e representantes",
          context: "b2b",
          process: {
            origin: "Representante ou revenda registra pedido ou oportunidade",
            decision: "A conta já tem dono? Conferir território, preço e prazo de entrega",
            output: "Pedido conferido, com parceiro e comissão registrados",
          },
          handoff: { to: "operacoes-entrega", object: "Pedido com prazo prometido" },
          record: "Pedido: parceiro, território, comissão, prazo prometido",
          customerImpact: "O cliente não recebe dois representantes com preços diferentes.",
          why: "Sem uma regra de registro, dois representantes disputam o mesmo cliente com preços diferentes. O cliente negocia pelo menor, e a empresa perde margem. Com o registro da oportunidade, quem registrou primeiro tem a vez por um prazo, e a comissão não vira briga.",
        },
      ],
      pitfalls: [
        "Avançar etapa sem critério de saída (a condição para mudar de etapa): o funil parece cheio, e o mês não fecha.",
        "Prometer desconto no WhatsApp antes da aprovação: a nota fiscal sai com o valor cheio, e o cliente contesta.",
        "Escrever “ver WhatsApp” nas notas de passagem: o CS começa do zero e pergunta de novo o que o cliente já contou.",
      ],
      think: "Pense na última venda que virou problema na entrega. O que foi prometido e ninguém registrou?",
    },
    backbone: {
      idea: "No Backbone, o que Vendas registra vira matéria-prima de outras áreas: o desconto e o e-mail de cobrança vão para o Financeiro, o prazo para Operações, as promessas para o CS. E o motivo de perda faz o caminho de volta, até a estratégia.",
      crmObjects: [
        { object: "Oportunidade", actions: ["cria", "edita"], fields: ["valor", "data prevista", "próximo passo", "motivo de perda"] },
        { object: "Proposta", actions: ["cria", "edita"], fields: ["itens do catálogo", "desconto e quem aprovou", "prazo de pagamento e crédito (o Financeiro edita)", "validade"] },
        { object: "Contrato", actions: ["cria"], fields: ["escopo", "valor e condição de faturamento: implantação 50% na assinatura e 50% no aceite, mensalidade a partir do go-live", "prazo prometido", "data de renovação"] },
        { object: "Notas de passagem", actions: ["cria"], fields: ["objetivo do cliente", "promessas", "contatos-chave", "critério de sucesso"] },
        { object: "Conta", actions: ["cria", "edita"], fields: ["CNPJ/CPF", "razão social", "e-mail de cobrança", "dono da conta"] },
      ],
      criticalField:
        "Data prevista de fechamento. Se ninguém revisa, uma oportunidade parada há meses continua contando na previsão do mês.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "o vendedor marca perda",
          then: "exige um motivo de lista fechada",
          why: "Texto livre não se soma; com a lista, dá para ver qual motivo lidera as perdas.",
        },
        {
          when: "o desconto passa da alçada",
          then: "a proposta só sai depois de aprovada",
          why: "A alçada protege a margem: acima do limite, alguém olha o negócio inteiro e pode pedir uma contrapartida, como pagamento à vista. O percentual sobe pela escada do Comercial (executivo até 10%, gerente até 20%, diretor acima); crédito e prazo de pagamento são do Financeiro. Aprovado no CRM, o desconto que o cliente vê é o que o Financeiro fatura.",
        },
        {
          when: "a oportunidade vira ganha",
          then: "exige notas de passagem e avisa CS, Financeiro e Operações",
          why: "O ganho é o que conta para a meta. Sem a trava, o vendedor já está no próximo negócio quando o CS precisa das notas. A trava garante que elas existam; se estão boas, quem confere é o gerente.",
        },
      ],
      neighborSystems: ["ERP", "Assinatura eletrônica", "Canais de mensagem", "Portal de parceiros"],
      feedback: {
        data: "“Prazo de implantação” lidera os motivos de perda do trimestre",
        decision: "Vendas passa a propor implantação em fases, e Operações revê a capacidade.",
        why: "Um campo preenchido em segundos vira, no fim do trimestre, a pauta da estratégia. Mas só se a lista for fechada e a resposta, honesta: se “preço” vira a resposta padrão, a empresa corta preço quando o problema era prazo.",
      },
      governance: "A conversa com o cliente acontece no WhatsApp da empresa (um número ligado ao CRM) e fica registrada na conta: o vendedor sai, a carteira fica. O representante externo vê só a própria carteira, e exportar contatos exige permissão do gestor.",
      think: "Que informação da sua área outra área precisa, mas hoje só existe na cabeça de alguém ou numa conversa?",
    },
  },
  "produto": {
    id: "produto",
    oneLiner: "Soma os pedidos de melhoria por conta, decide o que o produto muda e publica o catálogo.",
    keyQuestion: "Quantas contas pediram esta melhoria, quanto pagam e quando renovam?",
    withoutCrm:
      "Os pedidos de melhoria chegam por e-mail, WhatsApp e reunião, cada um com palavras diferentes. Ganha prioridade quem reclamou mais alto.",
    withCrm:
      "Cada pedido de melhoria fica na conta do cliente, com um tema de lista fechada. Por isso Produto soma quantas contas pediram, quanto pagam e quando renovam, e avisa quem pediu quando a melhoria sai.",
    whyCrm:
      "A ferramenta não é o ponto: um quadro de post-its também junta pedidos. O que muda é a regra combinada entre as áreas. Quem conversa com o cliente (CS, Vendas, Atendimento) registra o pedido na conta e é obrigado a escolher o tema. Só assim Produto soma receita por tema, e o status volta para quem pediu.",
    cases: {
      b2b: {
        steps: [
          "Dia 1, 9h, revisão mensal: o filtro de pedidos de melhoria mostra 12 contas pedindo “relatório para o contador”. A Aurora Transportes, cliente há 9 meses, é uma delas: o contador novo dela pediu o relatório no formato que entende, e o CS (o pós-venda, que cuida da conta durante o contrato) registrou o pedido com esse tema.",
          "Dia 1, 9h10: das 12 contas, 4 renovam no próximo trimestre, e a Aurora, com R$ 48 mil por ano, é uma delas. O tema sobe na prioridade pela receita em renovação, e não só pelo número de pedidos.",
          "Dia 1, 9h30: o tema entra no roadmap (a lista do que o produto vai construir, e em que ordem). Os 12 pedidos mudam para “planejado”, e o CS da Aurora vê isso na conta antes da conversa de renovação.",
          "Dia 43, seis semanas depois: a melhoria sai, e os 12 pedidos mudam para “entregue”. O CS avisa as 12 contas, a Aurora incluída, com a renovação ainda aberta.",
        ],
        outcome:
          "Na conta da Aurora fica o pedido de melhoria com tema, data e status “entregue”, ao lado da data de renovação. O CS leva a entrega à reunião de renovação; Produto mede se o relatório novo é usado.",
        why: "Sem o tema em lista fechada, os 12 pedidos seriam 12 e-mails com palavras diferentes, e ninguém somaria. Sem a data de renovação na conta, Produto escolheria pelo volume e deixaria passar o risco: 4 contas decidem em 90 dias se ficam. Sem o status na conta, o CS chegaria à renovação sem saber que o pedido foi atendido.",
      },
      b2c: {
        steps: [
          "Dia 10: Marina recebe o tênis de R$ 300 no 37, e ele aperta. Pelo app, dentro dos 7 dias de arrependimento (o prazo que a lei dá para desistir de uma compra feita pela internet), ela pede a troca pelo 38. A devolução é registrada com o motivo “Troca > Tamanho: veio pequeno”, e a logística reversa (o envio de volta, pago pela loja) recolhe o par.",
          "Dia 30, 9h, revisão mensal: o gerente de categoria filtra as devoluções por item. Nesse modelo, “veio pequeno” é o motivo de 1 em cada 5 trocas, comparado com 1 em cada 20 nos outros tênis da loja.",
          "Dia 30, 9h30: Categoria conclui que o modelo veste menor que o padrão. No item do catálogo, ajusta a tabela de numeração e publica na página do produto o aviso “este modelo veste pequeno: peça um número acima”.",
          "Dia 60: Compras ajusta o sortimento (a grade de modelos e numerações em estoque) na reposição, com menos pares no 36 e mais no 38 e no 39. As trocas do modelo caem, e Marina, da próxima vez, compra o número certo de primeira.",
        ],
        outcome:
          "No item do catálogo ficam a numeração ajustada e o aviso. Nas devoluções fica o motivo por item que provou que o problema era o modelo, e não a cliente.",
        why: "Cada troca custa dois fretes, um par parado no estoque e uma cliente esperando de novo. O motivo em lista fechada, ligado ao item, é o que permite ver o padrão. Sem ele, o Atendimento trocaria um par por vez, e Compras repetiria a mesma grade errada na reposição seguinte.",
      },
    },
    variants: {
      b2b: "No software por assinatura (SaaS), CS, Vendas e Atendimento registram o pedido de melhoria na conta, e Produto lê. Em serviços, cada pacote vira item do catálogo.",
      b2c: "No varejo, Produto se chama Categoria (ou Compras e Categoria). Não há conta com renovação: o motivo de troca e a receita por item fazem esse papel e orientam sortimento, numeração e a página do produto.",
      small: "O fundador é o Produto, e os pedidos ficam no WhatsApp dele. A regra mínima é anotar na conta quem pediu o quê, para conseguir avisar quando sair.",
    },
    brain: {
      idea: "No Brain, Produto decide o que construir pesando quantas contas pediram, quanto pagam e quando renovam. Esses três números não nascem em Produto: vêm do que CS, Vendas e Atendimento registram em cada conta. A prioridade do roadmap depende da rotina das outras áreas.",
      objectives: [
        "Construir o que mais clientes precisam",
        "Ativar contas novas mais rápido",
        "Reduzir tickets e trocas causados pelo produto",
      ],
      decisions: [
        "Qual tema entra no roadmap, pesando contas, receita e data de renovação?",
        "Em que passo a conta nova trava antes de ativar?",
        "Qual motivo de perda, de ticket ou de troca pede mudar o produto, o plano ou o preço?",
      ],
      why: "Priorizar pelo número de pedidos parece justo, mas protege pouco a receita: 12 contas pequenas podem pesar menos que 4 que renovam no trimestre. Priorizar pelo barulho entrega para quem reclama mais alto. Por isso a decisão cruza três dados da conta: quantos pediram, quanto pagam e quando decidem ficar. Sem a renovação na conta, o risco fica invisível.",
      indicators: [
        { name: "Receita por tema", source: "soma da receita anual das contas que fizeram pedido de melhoria em cada tema" },
        { name: "Tempo até ativar", source: "dias entre o início da conta e o evento “ativou”" },
        { name: "Tickets e trocas causados pelo produto", source: "motivo do ticket no grupo “Produto” e motivo da devolução, por item" },
      ],
      ritual: "Revisão mensal do roadmap: Produto, CS e Atendimento olham os temas mais pedidos e os motivos que mais se repetem.",
      customerImpact: "A melhoria que mais clientes precisam sai primeiro, e quem pediu fica sabendo.",
      think: "Na sua empresa, quem decide o que o produto muda? Essa pessoa sabe quantos clientes pediram, e quanto eles pagam?",
    },
    heart: {
      idea: "No Heart, Produto quase não fala com o cliente: lê o que as outras áreas registram e devolve três coisas. O status do pedido volta ao CS, o evento de uso vai para Marketing, e o catálogo vai para Vendas. Cada passagem pode quebrar.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Priorização do roadmap: mesa alta e quadro agora / próximo / depois.",
      roles: ["Gerente de produto (PM)", "Designer de produto", "Analista de produto", "Gerente de categoria (varejo)"],
      dayInLife: [
        { time: "9h", action: "O gerente de produto agrupa por tema os pedidos de melhoria que entraram na semana." },
        { time: "11h", action: "O designer entrevista 3 contas que fizeram o mesmo pedido, a Aurora entre elas." },
        { time: "16h", action: "O analista confere se o evento “ativou” das contas novas chegou ao CRM." },
      ],
      subAreas: [
        {
          id: "voz-do-cliente",
          name: "Voz do cliente",
          process: {
            origin: "Pedidos de melhoria registrados na conta por CS, Vendas e Atendimento, mais motivos de ticket e de perda",
            decision: "Priorizar o tema pesando contas, receita e data de renovação",
            output: "Tema no roadmap e status atualizado em cada pedido",
          },
          handoff: { to: "customer-success", object: "Status do pedido de melhoria" },
          record: "Pedido de melhoria: conta, tema, status, receita e renovação",
          customerImpact: "Quem pediu sabe em que pé está a melhoria.",
          why: "O status é o que fecha o ciclo. Produto entrega e passa ao próximo tema; quem conversa com a Aurora é o CS. Se o status não muda na conta, o CS descobre a melhoria pelo cliente, ou não descobre, e a renovação acontece sem o argumento mais forte que a empresa tinha.",
        },
        {
          id: "uso-ativacao",
          name: "Uso e ativação",
          process: {
            origin: "Contas novas que param no meio da configuração",
            decision: "Combinar com Marketing e CS o que conta como “ativou” e “parou de usar”",
            output: "Eventos “ativou”, “convidou colega” e “parou de usar” gravados na conta",
          },
          handoff: { to: "marketing-growth", object: "Evento de uso por conta" },
          record: "Evento de uso: conta, tipo, data",
          customerImpact: "Quem já configurou não recebe e-mail pedindo isso.",
          why: "O evento é combinado, não descoberto: Produto, Marketing e CS decidem juntos o que é “ativou”, porque cada um age a partir dele. Marketing para a régua; CS começa a medir o primeiro valor. Se cada área define o seu, a conta está “ativa” para uma e “parada” para outra, e o cliente recebe mensagens contraditórias.",
        },
        {
          id: "catalogo-precos",
          name: "Catálogo e preços",
          process: {
            origin: "Plano novo, mudança de preço ou, no varejo, item com problema de grade",
            decision: "Fechar com Financeiro o preço de tabela e a vigência; no varejo, ajustar a numeração e o aviso do item",
            output: "Catálogo atualizado, com o plano antigo bloqueado para venda",
          },
          handoff: { to: "vendas", object: "Catálogo de planos e preços" },
          record: "Item do catálogo: preço de tabela, vigência, status",
          customerImpact: "A proposta chega com o preço que vale hoje, e a cliente da loja compra o número certo.",
          why: "A proposta de Vendas só pode usar itens do catálogo. Se Produto lança o plano novo e não bloqueia o antigo, dois executivos vendem preços diferentes para o mesmo produto, e o Financeiro fatura um valor que já não existe. A trava do item vencido é de RevOps; quem decide o que vale é Produto, com o Financeiro.",
        },
      ],
      pitfalls: [
        "Entregar a melhoria sem mudar o status na conta: a Aurora só fica sabendo se alguém lembrar de contar.",
        "Mandar todo clique do produto para o CRM: ninguém acha os três eventos que importam.",
        "Lançar plano novo sem bloquear o antigo: duas propostas saem na mesma semana com preços diferentes para o mesmo produto.",
        "No varejo, registrar o motivo da troca em texto livre: “apertado”, “pequeno” e “não serviu” não se somam, e a grade errada volta na reposição.",
      ],
      think: "Quando um cliente pede uma melhoria na sua empresa, onde isso fica anotado? Quem avisa o cliente quando a melhoria sai?",
    },
    backbone: {
      idea: "No Backbone, Produto lê mais do que escreve: vê os motivos de ticket, de perda e de troca, e devolve três registros: pedido de melhoria, evento de uso e item do catálogo. O motivo em lista fechada faz o caminho de volta até o roadmap.",
      crmObjects: [
        { object: "Pedido de melhoria", actions: ["cria", "edita"], fields: ["conta", "tema", "status", "receita e renovação"] },
        { object: "Evento de uso", actions: ["cria"], fields: ["conta", "tipo", "data"] },
        { object: "Item do catálogo", actions: ["cria", "edita"], fields: ["preço de tabela", "vigência", "status", "tabela de numeração (varejo)"] },
        { object: "Ticket", actions: ["vê"], fields: ["motivo", "conta", "status"], owner: "atendimento" },
        { object: "Oportunidade", actions: ["vê"], fields: ["motivo de perda", "valor", "itens do catálogo"], owner: "vendas" },
        { object: "Devolução", actions: ["vê"], fields: ["motivo", "pedido e item", "resultado"], owner: "operacoes-entrega" },
      ],
      criticalField:
        "O tema do pedido de melhoria, escolhido de uma lista fechada. “Relatório para o contador”, “relatório contábil” e “exportar para a contabilidade” são o mesmo pedido; se cada um escreve do seu jeito, 12 contas viram 12 pedidos de uma conta só, e nenhum ganha prioridade.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "a conta conclui a configuração (“ativou”)",
          then: "a régua de ativação de Marketing para de pedir isso",
          why: "A régua é de Marketing, mas o gatilho vem de Produto. Sem o evento, o e-mail pede uma ação que o cliente já fez, e o cliente aprende a ignorar as mensagens da empresa, inclusive as que importam.",
        },
        {
          when: "passam 14 dias sem acesso (“parou de usar”)",
          then: "abre uma tarefa de risco para o CS da conta",
          why: "Quem para de usar no primeiro mês raramente avisa; a empresa descobre na renovação. A tarefa chega ao CS enquanto ainda dá tempo de ligar. Os 14 dias são combinados por empresa: para um software usado só no fechamento do mês, como o da Aurora, o prazo precisa ser maior.",
        },
        {
          when: "uma conta gratuita convida 3 colegas",
          then: "vira um lead vindo do uso (PQL) para Vendas, só em autoatendimento",
          why: "Convidar colegas é sinal de que a conta está virando ferramenta do time, e não teste de uma pessoa. Vale só no modelo em que o cliente entra sozinho pelo site; na venda com executivo, como a da Aurora, a conta já tem dono.",
        },
      ],
      neighborSystems: ["Analytics de produto", "Ferramenta de roadmap e feedback", "ERP", "Plataforma da loja online"],
      feedback: {
        data: "40 tickets no mês com o motivo “Erro técnico > Erro ao importar planilha”, e a Aurora Transportes abriu um deles",
        decision: "A correção da importação passa à frente no roadmap, e o pedido ligado a cada um dos 40 tickets muda para “planejado”.",
        why: "O motivo em lista fechada transforma 40 conversas em um número. Com 40 contas afetadas num mês, o custo de não corrigir fica visível: 40 atendimentos e algumas renovações em risco. Mas só se quem atende escolhe o motivo certo. Se “erro ao importar” vira “outros”, Produto nunca vê o problema.",
      },
      governance:
        "Só os três eventos combinados entram no CRM, com finalidade definida (LGPD). Produto vê o motivo do ticket e o motivo da troca, nunca a conversa inteira com o cliente.",
      think: "Qual erro do seu produto ou serviço mais gera contato de cliente? Alguém consegue dizer o número deste mês, ou só a sensação?",
    },
  },
  "atendimento": {
    // contrato didático (docs/conteudo/11) aplicado em F3; dois casos: Aurora (B2B) e Marina (B2C)
    id: "atendimento",
    oneLiner: "Atende quem procura a empresa, resolve e registra o motivo de cada contato no ticket.",
    keyQuestion: "Quem espera resposta agora, há quanto tempo e por qual motivo?",
    withoutCrm:
      "Marina reclama no WhatsApp, repete tudo ao telefone e, à tarde, recebe um cupom por e-mail. Ninguém sabe quantos clientes tiveram o mesmo problema.",
    withCrm:
      "Quem atende identifica a pessoa pelo CPF ou CNPJ e vê, na mesma tela, contato, pedido e fatura. Cada contato vira um ticket (o registro do atendimento) com motivo de lista fechada; um ticket crítico aberto pausa as promoções.",
    whyCrm:
      "A ferramenta de atendimento (o help desk) guarda a conversa; o CRM liga a conversa ao pedido e à fatura. Isso só acontece porque Operações (quem entrega) e Financeiro registram esses objetos do mesmo jeito e porque alguém decidiu que todo ticket tem motivo de lista fechada. Sem a regra, o mesmo sistema vira uma caixa de mensagens.",
    cases: {
      b2b: {
        steps: [
          "Dia 1, 14h: a analista financeira da Aurora Transportes (cliente do software de gestão, contrato de R$ 48 mil por ano) abre um ticket no portal: “erro ao importar planilha”. O atendente identifica a conta pelo CNPJ; o contrato define o prazo de resposta (SLA): 8 horas úteis para erro com contorno (quando há um jeito provisório de seguir trabalhando).",
          "Dia 1, 14h20: o atendente testa o contorno conhecido, o erro continua, e ele escala ao N2 (o segundo nível, que resolve o que a linha de frente não consegue) com o arquivo e o passo a passo.",
          "Dia 2, 10h: o N2 reproduz o erro e confirma o motivo “Erro técnico > Erro ao importar planilha”: é um dos 40 tickets do mês com esse motivo.",
          "Dia 2, 10h05: o ticket aparece na conta da Aurora, e o CSM (quem cuida da conta no CS, o pós-venda) fica sabendo sem ninguém ligar. O N2 responde à analista com o contorno e a previsão da correção.",
        ],
        outcome:
          "O ticket fica ligado à conta da Aurora, com motivo, prazo e status. Na segunda, esse motivo lidera a lista, e Produto passa a correção à frente no roadmap (a lista do que o produto vai construir).",
        why: "Em B2B, um ticket pesa na renovação: se o CSM só descobre 9 tickets na reunião de renovação, ele negocia no escuro, e o contrato de R$ 48 mil fica em risco. O motivo somado faz o segundo serviço: 40 casos iguais, com a receita das contas afetadas, é o argumento que convence Produto a mudar a ordem do roadmap.",
      },
      b2c: {
        steps: [
          "9h12: Marina escreve no WhatsApp da loja: “fui cobrada duas vezes”. O cartão mostra R$ 600, e o tênis custou R$ 300.",
          "9h14: o atendente (N1, a linha de frente) identifica Marina pelo CPF e vê dois pagamentos no pedido de ontem. Ele abre o ticket, o registro do contato, com o motivo “Cobrança > Duplicidade”.",
          "10h30: o caso sobe ao N2 / backoffice, a equipe que resolve com outras áreas. O analista pede o estorno ao Financeiro pelo próprio ticket, com a fatura ligada.",
          "16h: o Financeiro confirma o estorno no ticket. Marina recebe a confirmação no WhatsApp e o aviso de que, no cartão, o valor volta em até 2 faturas.",
        ],
        outcome:
          "O ticket guarda o motivo “Cobrança > Duplicidade” e o desfecho. No fim do mês, esse motivo chega somado a Financeiro e Produto, junto com os casos iguais.",
        why: "Marina contou o problema uma vez porque pedido e fatura já estavam na tela de quem atende. O motivo de lista fechada permite somar: uma duplicidade é acidente, 30 no mês é erro no pagamento do site, e aí o problema é de Produto. O aviso das 2 faturas evita a ligação de amanhã: “ainda não caiu”.",
      },
    },
    variants: {
      b2b: "Suporte por níveis (N1, N2 e N3), com prazo definido no contrato: sistema parado, 1 hora; erro com contorno, 8 horas úteis.",
      b2c: "Alto volume no WhatsApp e no chat; “onde está meu pedido” e cobrança lideram os motivos. O cliente é identificado pelo CPF.",
      small: "Quem vende também atende, pelo celular, e o histórico fica na conversa. Uma lista de motivos, mesmo em planilha, já mostra o que se repete.",
    },
    brain: {
      idea: "No Brain, Atendimento decide onde atacar a causa dos contatos, quantas pessoas colocar em cada canal e o que o cliente pode resolver sozinho. As três decisões dependem de um campo que o atendente escolhe ao fechar cada ticket: o motivo.",
      objectives: ["Resolver no primeiro contato", "Cumprir o prazo combinado (SLA)", "Reduzir os contatos evitáveis"],
      decisions: [
        "Quais motivos atacar na causa, e com qual área?",
        "Quantos atendentes por canal e horário, inclusive quando há campanha no ar?",
        "Quais motivos o autoatendimento (menu, robô ou portal) pode resolver sem fila?",
      ],
      why: "A meta de “resolver rápido” sozinha cria o incentivo errado: o atendente fecha o ticket para zerar a fila, e o cliente volta no dia seguinte, como um ticket novo. Por isso a resolução conta só sem novo contato no mesmo motivo. E a causa só se ataca com motivo de lista fechada: texto livre não se soma.",
      indicators: [
        { name: "Resolução no 1º contato", source: "tickets fechados sem novo contato pelo mesmo motivo em 7 dias" },
        { name: "Tickets no prazo", source: "hora da 1ª resposta, comparada com o prazo de cada canal" },
        { name: "Contatos por motivo", source: "motivo em 2 níveis do ticket, por semana" },
      ],
      ritual: "Segunda, 9h: Atendimento, Operações, Financeiro e Produto revisam os 5 motivos que mais cresceram na semana.",
      customerImpact: "O cliente procura menos a empresa e, quando procura, resolve de vez.",
      think: "Na sua empresa, quem sabe dizer os 3 motivos pelos quais os clientes mais procuram vocês? Esse número vem de um registro ou da memória?",
    },
    heart: {
      idea: "No Heart, Atendimento é a área que mais depende das outras: o pedido vem de Operações, a fatura do Financeiro, a regra do cupom de Marketing; o motivo volta para todas. Quando um dado não chega, quem atende descobre pelo cliente.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Fila em vários canais: baias e painel da fila.",
      roles: ["Atendente (N1)", "Analista de N2 / backoffice", "Supervisor de atendimento", "Analista de qualidade"],
      dayInLife: [
        { time: "8h", action: "O supervisor abre o painel: 23 WhatsApps chegaram de noite e entram na fila com prazo de 15 minutos." },
        { time: "11h", action: "Campanha no ar: o atendente responde sobre o cupom com a regra que Marketing registrou ontem." },
        { time: "17h", action: "A analista de qualidade revisa 10 atendimentos e corrige 2 motivos escolhidos errado." },
      ],
      subAreas: [
        {
          id: "n1",
          name: "Atendimento N1",
          process: {
            origin: "Contato por WhatsApp, chat, telefone, e-mail ou portal",
            decision: "Identificar pelo CPF ou CNPJ, classificar o motivo, resolver ou escalar",
            output: "Ticket resolvido, escalado ao N2 ou encaminhado ao CS",
          },
          handoff: { to: "customer-success", object: "Solicitação de cancelamento do plano" },
          record: "Ticket: cliente, canal, motivo, prioridade",
          customerImpact: "O simples se resolve na primeira conversa, sem transferência.",
          why: "O N1 identifica primeiro porque, sem isso, o pedido e a fatura não aparecem, e o atendente pergunta o que o sistema já sabe. O cancelamento de plano vai ao CS (em B2C, à Retenção) porque é uma decisão sobre a conta, não um problema a resolver; parado como ticket, o cliente que quer sair espera, e sai mais irritado.",
        },
        {
          id: "backoffice",
          name: "N2 / backoffice",
          process: {
            origin: "Ticket escalado pelo N1, com histórico e arquivos",
            decision: "Resolver aqui ou acionar Financeiro, Operações ou transportadora, pelo ticket",
            output: "Solicitação acompanhada até a resposta voltar ao cliente",
          },
          handoff: { to: "financeiro", object: "Solicitação de estorno com fatura" },
          record: "Ticket ligado à fatura, ao pedido ou à conta",
          customerImpact: "O caso difícil tem dono e retorno, sem o cliente cobrar.",
          why: "O estorno é do Financeiro, mas o cliente é de quem atende. Se o N2 manda a solicitação por e-mail e fecha o ticket, ninguém sabe o status, e Marina volta a perguntar todo dia. Com a solicitação ligada à fatura e ao ticket, o Financeiro responde no mesmo registro, e o aviso ao cliente sai de lá.",
        },
        {
          id: "qualidade",
          name: "Qualidade e causa-raiz",
          process: {
            origin: "Motivos, reaberturas e notas de satisfação (CSAT) da semana",
            decision: "Qual motivo cresce, por quê e qual área corrige a causa",
            output: "Causa levada à área dona; respostas prontas revisadas",
          },
          handoff: { to: "produto", object: "Motivos em alta por conta" },
          record: "Motivo revisado e CSAT por ticket",
          customerImpact: "O cliente para de esbarrar no mesmo problema.",
          why: "A lista de motivos só vale se for conferida: o atendente, com a fila cheia, escolhe o primeiro item que parece caber. A amostra corrige o motivo e, quando o erro se repete, corrige a lista. Produto recebe o motivo com a receita das contas afetadas, porque 40 tickets de contas pequenas e 40 de contas grandes não pesam igual.",
        },
        {
          id: "ouvidoria",
          name: "Ouvidoria / canais públicos",
          context: "b2c",
          process: {
            origin: "Reclamação no consumidor.gov.br, em site público, na ouvidoria ou no Procon",
            decision: "Ligar aos tickets anteriores e responder no prazo do canal: 10 dias no consumidor.gov.br",
            output: "Resposta curta em público e solução no privado",
          },
          handoff: { to: "marketing-growth", object: "Caso público para resposta aprovada" },
          record: "Ticket com canal de origem “consumidor.gov.br”, “site público” ou “Procon”",
          customerImpact: "A reclamação pública é resolvida, não só respondida.",
          why: "No Brasil, quem não foi atendido vai primeiro ao consumidor.gov.br (a empresa tem 10 dias para responder) ou a um site público de reclamação; o Procon costuma vir depois. O canal vai no campo de origem, não no motivo: a reclamação pública ainda é “Cobrança > Duplicidade”. Marketing aprova o tom: a resposta é vista por quem não é cliente.",
        },
      ],
      pitfalls: [
        "Fechar o ticket sem resolver para bater a meta de fila: o cliente volta no dia seguinte, e o indicador de resolução mente.",
        "Passar ao Financeiro por e-mail, fora do ticket: o cliente liga três vezes pelo estorno, e ninguém sabe o status.",
        "3 canais, 3 tickets para o mesmo problema: cada atendente começa do zero, e a soma por motivo triplica.",
      ],
      think: "Quando um cliente reclama no WhatsApp e depois liga, quem atende o telefone sabe o que já foi dito? Onde isso fica registrado?",
    },
    backbone: {
      idea: "No Backbone, Atendimento cria um só objeto, o ticket, e consulta três de outras áreas: o contato, o pedido e a fatura. O motivo do ticket faz o caminho de volta: somado no mês, ele muda prioridades em Produto e no Financeiro.",
      crmObjects: [
        { object: "Ticket", actions: ["cria", "edita"], fields: ["motivo em 2 níveis", "canal de origem", "prioridade e prazo (SLA)", "status e objeto ligado"] },
        { object: "Contato", actions: ["vê", "edita"], fields: ["CPF ou CNPJ", "WhatsApp e e-mail", "opt-out"], owner: "marketing-growth" },
        { object: "Pedido", actions: ["vê"], fields: ["status e rastreio", "prazo prometido", "ocorrência"], owner: "operacoes-entrega" },
        { object: "Fatura", actions: ["vê"], fields: ["status de pagamento (paga, vencida, estornada)", "vencimento", "2ª via"], owner: "financeiro" },
      ],
      criticalField:
        "Motivo em 2 níveis, de lista fechada, escolhido ao abrir e confirmado ao fechar. Sem ele, ninguém consegue dizer qual problema cresce.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "um WhatsApp passa 15 minutos sem resposta",
          then: "alerta o supervisor e põe o ticket na frente da fila",
          why: "A empresa combinou 15 minutos porque, depois disso, o cliente manda a segunda mensagem ou liga, e nasce um segundo ticket para o mesmo problema. O alerta vai ao supervisor, e não ao atendente, porque é ele quem pode mover gente de um canal para outro.",
        },
        {
          when: "um ticket crítico é aberto",
          then: "pausa as promoções até 7 dias após a solução; avisos de pedido e de cobrança seguem",
          why: "Crítico é canal público, cobrança indevida, 2ª reabertura ou pedido de cancelamento. Quem reclamou de manhã e recebe cupom à tarde lê a oferta como deboche, e o caso vai a público. Atendimento define o que é crítico; Marketing aplica a pausa na régua (a sequência automática de mensagens). Os avisos seguem: o cliente ainda quer saber do pedido.",
        },
        {
          when: "o cliente pede a 2ª via no WhatsApp",
          then: "o autoatendimento confere o CPF ou CNPJ e envia boleto ou Pix",
          why: "A 2ª via é um dos contatos mais frequentes e o mais simples: o dado já existe na fatura do Financeiro. Deixar na fila gasta o tempo do atendente que o caso difícil precisa, e o cliente que só quer pagar espera 15 minutos. O Financeiro só entra se houver estorno ou contestação.",
        },
      ],
      neighborSystems: ["Help desk", "Canais de mensagem", "Telefonia", "Base de conhecimento"],
      feedback: {
        data: "“Cobrança > Duplicidade” cresce 3 semanas seguidas; “Erro técnico > Erro ao importar planilha” chega a 40 tickets no mês",
        decision: "Na segunda, Produto passa as duas correções à frente no roadmap: o pagamento do site e a importação.",
        why: "Um campo escolhido em segundos por quem atende vira, no fim do mês, o argumento que muda a ordem do roadmap. Isso só funciona porque o motivo é de lista fechada e porque o ticket está ligado à conta: Produto vê quantos casos e quanta receita estão por trás, e não precisa confiar na memória de quem gritou mais alto.",
      },
      governance: "Outras áreas veem motivo, status e prazo; a conversa, só quem trata o caso. Dado de cartão não entra no ticket: o estorno é pedido pela fatura.",
      think: "Que informação de outra área quem atende na sua empresa precisa, e hoje descobre pelo cliente?",
    },
  },
  "customer-success": {
    // contrato didático (docs/conteudo/11) + achados do arquiteto (docs/lancamento/01: #2, #12, pontos 3 e 7)
    id: "customer-success",
    oneLiner: "Recebe a conta de Vendas, acompanha o uso do cliente e conduz a renovação do contrato.",
    keyQuestion: "Quais contas renovam neste trimestre, quais estão em risco, e por quê?",
    withoutCrm:
      "A empresa descobre que o cliente não vai renovar quando ele avisa. O uso vinha caindo há meses, mas esse número estava com Produto; as faturas vencidas, com o Financeiro; os tickets, com o Atendimento.",
    withCrm:
      "Uso, tickets, faturas e data de renovação aparecem na conta, e cada sinal tem uma regra: uso em queda vira tarefa do CSM (quem cuida de um grupo de contas no CS, o pós-venda que acompanha o cliente durante o contrato), fatura vencida pausa ofertas, e a renovação abre 90 dias antes.",
    whyCrm:
      "A diferença está em combinar o sinal de risco, não em ter a tela. Produto, Financeiro e Atendimento já tinham esses dados. Quando as áreas combinam que uso em queda, ticket repetido e fatura vencida entram na conta com uma ação definida, e o CRM cobra essa ação de alguém, o risco aparece meses antes.",
    cases: {
      b2b: {
        steps: [
          "Dia 1: faltam 90 dias para a renovação da Aurora Transportes, cliente há 9 meses (contrato de R$ 48 mil por ano), e o CRM abre para o CSM a oportunidade de renovação (a negociação, com valor e data). Na conta, dois sinais: a mensalidade de R$ 4.000 vencida há 12 dias e uso no limite do plano.",
          "Dia 2: o CSM liga antes de falar de renovação. O contador novo da Aurora não reconheceu a nota fiscal de serviço (NFS-e) e segurou o pagamento, apesar dos avisos. A conta mostra que a Aurora já atrasou uma vez, no começo do contrato, por outro motivo; desta vez a causa é nova, e fica registrada na fatura.",
          "Dia 3: o CSM abre uma tarefa ao Financeiro, que manda ao contador a NFS-e com a explicação do serviço. Com fatura vencida, a regra pausa toda oferta de expansão (venda a mais para quem já é cliente): o CSM ainda não fala de mais usuários.",
          "Dia 9: fatura paga, pausa encerrada. Só então o CSM abre a oportunidade de expansão: mais 20 usuários, cerca de R$ 12 mil por ano. Pela regra combinada entre as áreas (o CSM fecha expansões pequenas; acima de 20% do contrato, Vendas conduz), a proposta vai a Vendas, junto com a renovação.",
        ],
        outcome:
          "Na conta ficam a fatura com o motivo “NF não reconhecida pelo contador”, a renovação com a expansão ligada a ela, e um pedido de melhoria para Produto: “relatório para o contador”.",
        why: "Oferecer expansão a quem tem fatura vencida põe o CSM no papel de vendedor e o cliente na defensiva, e o desconto novo entra na conversa da dívida. Resolver a cobrança antes mantém o CSM do lado do cliente. O motivo registrado na fatura mostra que a Aurora teve duas causas em 9 meses, e nenhuma foi “não quer pagar”.",
      },
      b2c: {
        steps: [
          "Dia 1, 9h: Marina completa 6 meses sem comprar na loja. O CRM a coloca no segmento de reconquista (o grupo de quem parou de comprar) e mostra o motivo da última troca: o tênis de R$ 300 veio pequeno, e ela trocou a numeração.",
          "Dia 1, 10h: a analista de retenção monta a régua de reconquista (a sequência automática de mensagens para quem parou de comprar) a partir dos motivos. Para quem trocou por numeração, a mensagem não é um cupom genérico: a loja ajustou a tabela de numeração daquele modelo, e é isso que a mensagem conta.",
          "Dia 2, 10h: antes do envio, a régua confere o aceite no WhatsApp (sim), ticket aberto (não) e cobrança em aberto (não). Marina recebe a mensagem com o link do modelo no tamanho certo e frete grátis na primeira compra de volta.",
          "Dia 2, 20h15: Marina compra. O pedido nasce ligado à régua de reconquista e ao motivo “numeração”, e ela sai do segmento.",
        ],
        outcome:
          "Na conta de Marina ficam o motivo pelo qual ela parou de comprar e a prova de que a mensagem certa trouxe a cliente de volta. No fim do mês, Retenção e Marketing comparam quem voltou, por motivo.",
        why: "Quem trocou um tênis por numeração não parou de comprar por preço; parou porque a compra deu trabalho. Um cupom de 10% não responde a isso, e um cupom para quem já ia voltar custa margem à toa. O motivo da troca, registrado por Operações (quem entrega) meses antes, permite escrever a mensagem certa e medir se funciona.",
      },
    },
    variants: {
      b2b: "Cada CSM cuida de uma carteira (seu grupo de contas) e responde pela renovação e pela saúde delas.",
      b2c: "Não há CSM: o papel vira Retenção e fidelidade. A analista de retenção decide quem entra na reconquista e com qual motivo; o time de CRM de Marketing dispara a régua. Com clube de assinatura, o pedido de cancelamento passa pela mesma estação (o posto de trabalho no andar Heart).",
      small: "O próprio vendedor faz o pós-venda pelo WhatsApp, e a data de renovação fica numa planilha. A regra de olhar a fatura antes de oferecer vale do mesmo jeito.",
    },
    brain: {
      idea: "No Brain, CS decide quais contas atacar primeiro e quanto da carteira (as contas que acompanha) vai renovar. A decisão depende de três dados que outras áreas registram: o uso (Produto), a fatura (Financeiro) e o ticket (Atendimento). Sem eles, saúde da conta é opinião.",
      objectives: [
        "Levar o cliente ao primeiro valor (o primeiro resultado concreto com o produto)",
        "Renovar contratos sem surpresa",
        "Expandir só as contas saudáveis",
      ],
      decisions: [
        "Quais contas em risco atacar primeiro, e com que ação?",
        "Qual conta está pronta para expansão, e quem conduz: o CSM ou Vendas?",
        "Onde os primeiros passos do cliente (onboarding) travam antes do primeiro valor?",
      ],
      why: "A nota de saúde da conta só funciona com regra escrita: quanto pesa o uso, quantos tickets em quanto tempo, fatura vencida a partir de que dia. Muita empresa começa com um farol marcado à mão, e isso serve, desde que cada cor tenha critério escrito. Sem critério, a cor é a opinião de quem olhou a conta por último.",
      indicators: [
        { name: "Receita retida da carteira", source: "renovações mais expansões, menos cancelamentos do trimestre, comparado com o que vencia" },
        { name: "Contas em risco", source: "nota de saúde (health score) ou farol (verde, amarelo, vermelho), pela regra escrita: uso, tickets, faturas e NPS (a nota de recomendação que o cliente dá)" },
        { name: "Tempo até o primeiro valor", source: "do aceite (a confirmação de que a implantação foi entregue; ou da assinatura, quando não há implantação) ao marco “primeiro valor” do plano de sucesso (as metas e marcos combinados com o cliente)" },
      ],
      ritual: "Segunda-feira de carteira: cada CSM defende, para o head de CS, as renovações do trimestre e o plano das contas em risco.",
      customerImpact: "O cliente é procurado durante o contrato, com assunto, e não só na semana da renovação.",
      think: "Na sua empresa, quem percebe primeiro que um cliente vai sair: quem atende ou quem fatura? O que cada um faz com isso?",
    },
    heart: {
      idea: "No Heart, o cliente passa de mão em mão: Vendas entrega a conta ao onboarding, o onboarding ao CSM, e o CSM devolve a Vendas quando há expansão. Em cada passagem, o que não foi registrado se perde, e o cliente repete a história.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Gestão da carteira: mesa redonda, cadeira do cliente, quadro de contas por cor de saúde.",
      roles: ["Analista de onboarding", "CSM (gerente de sucesso do cliente)", "Analista de retenção", "Head de CS"],
      dayInLife: [
        { time: "8h30", action: "O CSM confere a carteira: 2 contas com uso em queda viram tarefa com prazo." },
        { time: "11h", action: "Reunião de passagem com o executivo de Vendas: a conta ganha ontem tem notas de passagem, e o CSM leu antes." },
        { time: "16h", action: "Na revisão trimestral com o cliente (QBR), a Aurora pede mais 20 usuários; o CSM checa fatura e ticket antes de abrir a expansão." },
      ],
      subAreas: [
        {
          id: "onboarding",
          name: "Onboarding",
          process: {
            origin: "Notas de passagem de Vendas; aceite da implantação, quando há",
            decision: "Combinar com o cliente a meta e o primeiro valor; treinar os novos usuários",
            output: "Primeiro valor alcançado; a conta segue para o CSM",
          },
          record: "Plano de sucesso: meta do cliente, marcos, data do primeiro valor",
          customerImpact: "O cliente não repete o que já contou ao executivo de Vendas.",
          why: "Quem cancela por “não usou” decidiu isso nos primeiros meses, quando não viu resultado. O onboarding existe para encurtar esse caminho, e começa pelas notas de passagem: se Vendas escreveu “ver proposta”, a analista pergunta tudo de novo, e o cliente conclui que a empresa não conversa entre si.",
        },
        {
          id: "carteira",
          name: "Gestão de carteira",
          process: {
            origin: "Uso em queda, tickets repetidos ou fatura vencida na conta",
            decision: "Entender a causa com o cliente antes de qualquer oferta",
            output: "Plano de ação com dono e prazo; pedido de melhoria, quando a causa é o produto",
          },
          handoff: { to: "produto", object: "Pedido de melhoria da conta" },
          record: "Conta: check-in (a conversa periódica com o cliente), farol e risco com motivo",
          customerImpact: "O problema é tratado meses antes de virar cancelamento.",
          why: "O pedido de melhoria registrado na conta, e não num e-mail ao gerente de produto, é o que deixa Produto somar: a Aurora foi uma das 12 contas que pediram o relatório para o contador, 4 delas com renovação no trimestre. Esse número entra no roadmap (a lista do que o produto vai construir); o e-mail isolado, não.",
        },
        {
          id: "renovacao-expansao",
          name: "Renovação e expansão",
          process: {
            origin: "Oportunidade de renovação aberta 90 dias antes, ou uso no limite do plano",
            decision: "Checar saúde e faturas; corrigir antes, depois renovar ou expandir",
            output: "Renovação negociada; expansão pequena fechada pelo CSM, grande entregue a Vendas",
          },
          handoff: { to: "vendas", object: "Oportunidade de expansão (origem CS)" },
          record: "Contrato: renovado ou cancelado, com motivo. Oportunidade: tipo, valor, origem CS",
          customerImpact: "A renovação chega com três meses de conversa, e não na última semana.",
          why: "CS e Vendas têm meta sobre a mesma expansão. Quando a empresa combina antes quem conduz (o CSM até cerca de 20% do contrato, Vendas acima disso) e como a comissão se divide, a proposta sai na semana. Sem a regra, as duas áreas disputam o crédito, e a proposta espera enquanto o cliente esfria.",
        },
        {
          id: "retencao",
          name: "Retenção e reconquista",
          context: "b2c",
          process: {
            origin: "Cliente há 6 meses sem comprar, ou pedido de cancelamento (clube de assinatura) vindo do Atendimento",
            decision: "Usar o motivo registrado (troca, atraso, cobrança) para escolher a mensagem e a oferta",
            output: "Segmento de reconquista com motivo e oferta, entregue a Marketing",
          },
          handoff: { to: "marketing-growth", object: "Motivo de saída e segmento para a régua de reconquista" },
          record: "Contato: motivo da última troca ou do cancelamento, oferta feita, resultado",
          customerImpact: "Quem parou de comprar recebe uma mensagem sobre o seu problema, e não um cupom qualquer.",
          why: "Um cupom de 10% para todo mundo que sumiu custa margem com quem voltaria de graça e não convence quem saiu por um problema. O motivo registrado separa os grupos: quem trocou por numeração recebe o aviso da tabela corrigida; quem teve atraso, um prazo garantido. A régua é de Marketing; o critério é de Retenção.",
        },
      ],
      pitfalls: [
        "Notas de passagem com “ver proposta” só para liberar o ganho: o CSM começa no escuro, e a primeira reunião recomeça do zero.",
        "Farol sem critério escrito: a conta fica verde até o dia em que cancela.",
        "Cancelamento marcado como “preço” por hábito: a empresa corta preço, e a falta de uso, que era a causa, nunca aparece.",
      ],
      think: "Pense no último cliente que saiu. Em qual passagem entre áreas a informação que teria evitado isso ficou parada?",
    },
    backbone: {
      idea: "No Backbone, CS cria pouco: lê o que Vendas, Financeiro, Produto e Atendimento registraram, e devolve um campo que pesa muito, o motivo de cancelamento. É ele que faz o caminho de volta, até Marketing e até o onboarding.",
      crmObjects: [
        { object: "Plano de sucesso", actions: ["cria", "edita"], fields: ["meta do cliente", "marcos", "data do primeiro valor"] },
        { object: "Oportunidade", actions: ["cria"], fields: ["tipo: renovação ou expansão", "origem CS", "valor", "data prevista"], owner: "vendas" },
        { object: "Conta", actions: ["vê", "edita"], fields: ["CSM responsável", "health score ou farol", "último check-in"], owner: "vendas" },
        { object: "Contrato", actions: ["vê", "edita"], fields: ["data de renovação", "valor", "motivo de cancelamento (lista fechada)"], owner: "vendas" },
        { object: "Notas de passagem", actions: ["vê"], fields: ["objetivo do cliente", "promessas", "contatos-chave", "critério de sucesso"], owner: "vendas" },
        { object: "Fatura", actions: ["vê"], fields: ["status de pagamento", "vencimento", "valor em aberto", "motivo do atraso"], owner: "financeiro" },
      ],
      criticalField:
        "Data de renovação, preenchida por Vendas no ganho. Sem ela, a automação dos 90 dias não dispara, e o cancelamento chega de surpresa.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "faltam 90 dias para a renovação",
          then: "cria a oportunidade de renovação (tipo, valor do contrato, data) e a entrega ao CSM",
          why: "Em contrato anual, o cliente costuma ter de avisar com 30 ou 60 dias se não vai renovar; quando esse prazo chega, a decisão já foi tomada. Três meses dão tempo de resolver fatura, ticket e expectativa antes de falar de preço.",
        },
        {
          when: "a fatura vence sem pagamento",
          then: "pausa as ofertas de expansão e avisa o CSM; o aviso de suspensão sai no 30º dia",
          why: "A pausa vale desde o 1º dia porque o CSM precisa chegar ao cliente como quem resolve, não como quem vende. A régua de cobrança (aviso no 1º e no 5º dia, contato no 15º, aviso de suspensão no 30º) protege os dois lados: a empresa não suspende de surpresa, e o CSM sabe até quando precisa resolver a causa.",
        },
        {
          when: "o cancelamento é registrado, ou a cliente faz 6 meses sem compra",
          then: "exige motivo de lista fechada (ou usa o da última troca) e entrega o segmento a Marketing",
          why: "Texto livre não se soma, e “preço” marcado por hábito esconde a causa real. Com a lista, CS vê que “não usou” lidera, e Marketing para de atrair o perfil que mais sai. No varejo, o motivo da última troca faz o mesmo papel: separa quem saiu por preço de quem saiu por problema.",
        },
      ],
      neighborSystems: ["Plataforma de CS", "Analytics de produto", "Canais de mensagem"],
      feedback: {
        data: "“Não usou” lidera os cancelamentos do semestre: 7 das 10 contas que saíram nunca chegaram ao primeiro valor",
        decision: "O primeiro valor vira a meta do onboarding, com prazo; Marketing revê o perfil que os anúncios atraem.",
        why: "Um campo de lista fechada, preenchido em segundos no cancelamento, vira a pauta do semestre. Mas o caminho de volta só existe se a resposta é honesta e alguém olha a soma: se o CSM marca “preço” para não admitir que o cliente nunca foi ativado, a empresa corta preço e continua perdendo pelo mesmo motivo.",
      },
      governance: "O CSM vê status da fatura e motivo do ticket, não o dado bancário nem a conversa do Atendimento. O e-mail de cobrança é corrigido pelo Financeiro, com histórico; o CSM só abre a tarefa.",
      think: "Que campo do seu CRM é preenchido só para liberar a tela seguinte? O que a empresa decide, meses depois, com base nele?",
    },
  },
  "financeiro": {
    // contrato didático (docs/conteudo/11); achados do arquiteto (docs/lancamento/01) aplicados
    id: "financeiro",
    oneLiner: "Analisa crédito e prazo de pagamento, emite a nota fiscal (NF) e cobra o que venceu.",
    keyQuestion: "O que foi vendido, com que prazo de pagamento, e já foi pago?",
    withoutCrm:
      "O pagamento só aparece no ERP (o sistema de gestão), que o CS (o pós-venda) não abre. O CSM, quem cuida da conta no CS, oferece mais usuários a quem tem duas faturas vencidas.",
    withCrm:
      "O status da fatura aparece na conta, ao lado do contrato e dos tickets. Quem fala com o cliente vê o atraso antes de propor, e a cobrança sabe para quem ligar.",
    whyCrm:
      "A diferença está na regra, não na tela. O ERP já sabe quem pagou; falta esse status na conta que o CSM e o executivo abrem. Quando a empresa combina que o ERP é a fonte do pagamento, e o CRM exige CNPJ e e-mail de cobrança no ganho, a nota sai certa, e o CSM vê o atraso.",
    cases: {
      b2b: {
        steps: [
          "Dia 1: a Aurora Transportes assina o contrato: R$ 48 mil por ano, mais a implantação (a configuração do sistema até ele entrar no ar) de R$ 20 mil com 12% de desconto aprovado em Vendas, R$ 17,6 mil. O faturamento confere o cadastro fiscal e emite a 1ª parcela da implantação: R$ 8,8 mil.",
          "Dia 55: a Aurora assina o aceite (a confirmação de que a implantação foi entregue), três dias depois do go-live (o dia em que o sistema entrou no ar). Operações (quem implanta) libera a 2ª parcela de R$ 8,8 mil, e a mensalidade de R$ 4.000 conta desde o Dia 52.",
          "Dia 92: a mensalidade de R$ 4.000 do 2º mês vence sem pagamento. A conta mostra o atraso, e o CSM adia a conversa sobre mais usuários.",
          "Dia 97: a analista de cobrança liga. A NF foi para o gerente de frota, que usa o sistema, e não para o contador, que paga. Ela corrige o e-mail de cobrança na conta, e a Aurora paga no dia seguinte.",
        ],
        outcome:
          "O motivo “NF não recebida” fica na fatura e entra no relatório do mês. O e-mail corrigido vale para as próximas faturas.",
        why: "Em B2B, boa parte do atraso não é falta de dinheiro: é NF que chegou a quem usa, e não a quem paga, ou CNPJ errado. Se a cobrança só ligasse, a Aurora pagaria uma vez e atrasaria de novo. Corrigir o e-mail na conta e registrar o motivo trata a causa e guarda o dado para a decisão.",
      },
      b2c: {
        steps: [
          "Dia 1, 9h12: Marina escreve no WhatsApp da loja: “fui cobrada duas vezes”. O cartão mostra R$ 600 por um tênis de R$ 300, e o Atendimento abre o ticket (o registro do contato) com o motivo “Cobrança > Duplicidade”.",
          "Dia 1, 10h30: o pedido de estorno chega ao Financeiro com a fatura ligada ao ticket. O Financeiro confere no gateway de pagamento (o serviço que processa o cartão): são duas capturas do mesmo pedido.",
          "Dia 1, 16h: o estorno de R$ 300 é pedido à operadora do cartão. O Financeiro registra no ticket o desfecho e o prazo, e o Atendimento avisa Marina: o valor volta em até 2 faturas do cartão.",
          "Dia 30: “Cobrança > Duplicidade” aparece 30 vezes no relatório de motivos. Financeiro e Produto vão olhar o gateway juntos, porque a causa não é do cliente.",
        ],
        outcome:
          "O ticket guarda o motivo, a fatura e o prazo do estorno. Marina pediu uma vez, e qualquer atendente vê o status.",
        why: "Cobrar duas vezes e demorar a devolver é cobrança indevida pelo Código de Defesa do Consumidor (CDC). Sem resposta, o próximo passo de Marina seria o consumidor.gov.br, onde a loja responde em público em 10 dias, e depois o Procon. O prazo dito no ticket evita a segunda reclamação, e o motivo somado mostra que o problema é do sistema.",
      },
    },
    variants: {
      b2b: "Crédito e prazo são analisados por conta, e a cobrança fala com o financeiro do cliente. Aqui o percentual de desconto é aprovado dentro de Vendas; em algumas empresas, o Financeiro também aprova o percentual.",
      b2c: "Não há análise de crédito: cartão ou Pix aprova na hora. A régua de cobrança (a sequência automática de avisos) roda em alto volume, o estorno nasce no ticket, e a fatura vencida pausa as ofertas de Marketing.",
      small: "Uma pessoa e o contador externo fazem tudo. Quem pagou só aparece no aplicativo do banco, e a conferência é à mão.",
    },
    brain: {
      idea: "No Brain, o Financeiro decide quanto risco aceitar em cada conta (crédito e prazo) e o que fazer com quem atrasou. As duas decisões dependem do dia a dia: do cadastro fiscal que Vendas preenche e do motivo de atraso que a cobrança anota.",
      objectives: [
        "Aprovar crédito e prazo antes da assinatura",
        "Faturar certo de primeira",
        "Reduzir a inadimplência (faturas vencidas e não pagas) sem perder clientes",
      ],
      decisions: [
        "Que prazo e limite de crédito cada conta recebe, e quem aprova acima disso?",
        "Quando suspender o serviço de quem atrasou, e com que aviso?",
        "Qual causa de atraso corrigir na origem, e com qual área?",
      ],
      why: "O desconto sobe pela escada do Comercial (em degraus: gerente até certo percentual, diretor acima) porque mexe na margem. Prazo e crédito ficam com o Financeiro porque mexem no caixa: 60 dias para uma conta nova é dinheiro incerto. Como a comissão de Vendas é paga sobre o recebido, o executivo também perde quando o crédito erra.",
      indicators: [
        { name: "Inadimplência por faixa de atraso", source: "faturas vencidas e não pagas, por dias de atraso" },
        { name: "NF refeitas por erro", source: "notas canceladas e refeitas por cadastro ou valor errado" },
        { name: "Receita CRM × ERP", source: "oportunidades ganhas no CRM comparadas com notas emitidas no ERP; meta compartilhada com RevOps (o time que cuida das regras e integrações do CRM)" },
      ],
      ritual: "Quinta, com CS: contas com atraso acima de 15 dias, uma a uma, com motivo e próximo passo.",
      customerImpact: "O cliente paga o combinado, no e-mail certo, e não é cobrado pelo que já pagou.",
      think: "Na sua empresa, quem decide o prazo de pagamento de um cliente novo? Onde fica registrado o motivo de cada atraso?",
    },
    heart: {
      idea: "No Heart, o Financeiro recebe o que Vendas e Operações entregam e devolve dinheiro. Cada estação (posto de trabalho no prédio) entrega algo: o crédito devolve a decisão a Vendas, o faturamento manda a NF, a cobrança avisa o CS, o estorno responde ao Atendimento.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Aprovar, faturar e cobrar: monitor largo com a fila de faturas, bandejas e arquivo.",
      roles: ["Analista de crédito", "Analista de faturamento", "Analista de cobrança", "Coordenador financeiro"],
      dayInLife: [
        { time: "9h", action: "A analista de crédito recusa 1 pedido de 60 dias de prazo e aprova 2, com garantia, na proposta." },
        { time: "14h", action: "A analista de faturamento emite as notas do dia e devolve 2 vendas com o CNPJ da matriz no lugar da filial." },
        { time: "16h", action: "A analista de cobrança liga para quem venceu há 5 dias e registra na fatura o motivo e a data prometida." },
      ],
      subAreas: [
        {
          id: "credito-aprovacao",
          name: "Crédito e aprovação",
          process: {
            origin: "Proposta com prazo fora da política, ou conta nova sem histórico",
            decision: "Consultar crédito e histórico; aprovar, pedir garantia ou recusar",
            output: "Decisão e aprovador registrados na proposta, antes da assinatura",
          },
          handoff: { to: "vendas", object: "Prazo e crédito aprovados na proposta" },
          record: "Proposta: prazo de pagamento, aprovação de crédito, aprovador",
          customerImpact: "A condição assinada é a mesma que vem na NF e no boleto.",
          why: "O desconto é decisão de margem, e fica com quem vende. O prazo é decisão de caixa: quem aprova 60 dias para uma conta nova aposta que o dinheiro entra. Com a aprovação na proposta, o executivo vê a decisão, e não a análise, e o faturamento emite o boleto com o vencimento certo.",
        },
        {
          id: "faturamento",
          name: "Faturamento",
          process: {
            origin: "Oportunidade ganha, ou aceite registrado por Operações",
            decision: "Conferir cadastro fiscal, impostos retidos pelo cliente e valor contra o contrato",
            output: "NF e boleto ou Pix enviados ao e-mail de cobrança",
          },
          record: "Fatura: nº da NF, valor, vencimento, parcela",
          customerImpact: "A NF chega certa, com o desconto aprovado, a quem paga.",
          why: "A nota de software é nota fiscal de serviço (NFS-e), e o imposto dela depende do município do cadastro: município errado é nota cancelada. Alguns clientes descontam imposto na hora de pagar (as retenções na fonte), e o boleto precisa sair já com esse valor menor. Sem a conferência, a nota é refeita, e a Aurora paga atrasada sem culpa.",
        },
        {
          id: "cobranca",
          name: "Cobrança",
          process: {
            origin: "Fatura vencida e não paga",
            decision: "Conferir tickets e notas do CSM; negociar data ou acordo",
            output: "Motivo e data prometida na fatura; status na conta",
          },
          handoff: { to: "customer-success", object: "Status de pagamento e acordo" },
          record: "Fatura: dias de atraso, motivo, data prometida",
          customerImpact: "Cobrança e oferta de upgrade não chegam no mesmo dia.",
          why: "A régua de inadimplência tem degraus: aviso, negociação, suspensão com aviso prévio, negativação e protesto. Pular degraus custa cliente; demorar custa caixa. Conferir o ticket antes de ligar evita cobrar quem contestou a fatura, e o status na conta faz o CSM pausar a oferta sem precisar perguntar.",
        },
        {
          id: "estornos",
          name: "Estornos e contestações",
          process: {
            origin: "Ticket de estorno ou contestação, ou devolução conferida por Operações",
            decision: "Conferir o pagamento; estornar ou abater na próxima fatura",
            output: "Estorno feito, com desfecho e prazo no ticket",
          },
          handoff: { to: "atendimento", object: "Desfecho e prazo no ticket" },
          record: "Ticket vinculado à fatura estornada",
          customerImpact: "O cliente pede o estorno uma vez e sabe quando o dinheiro volta.",
          why: "A 2ª via simples fica no Atendimento, que vê a fatura no CRM; para o Financeiro sobe só o que muda valor ou data. O desfecho volta pelo mesmo ticket, e não por e-mail, porque é o ticket que o atendente abre quando Marina pergunta de novo. O prazo dito ali (até 2 faturas, no cartão) evita a segunda reclamação.",
        },
      ],
      pitfalls: [
        "Prazo ou desconto combinado no WhatsApp, fora da proposta: a NF sai com o valor cheio, e o cliente contesta.",
        "Pix sem identificação da fatura: ninguém sabe de quem é o dinheiro, e a régua segue cobrando quem já pagou.",
        "Cobrar quem contestou a fatura num ticket aberto: o cliente repete tudo, e a reclamação vira pública.",
      ],
      think: "Pense na última fatura que atrasou na sua empresa. Era falta de dinheiro, ou a nota foi para a pessoa errada?",
    },
    backbone: {
      idea: "No Backbone, o Financeiro é dono de um objeto, a Fatura, e vive dos objetos dos outros: proposta e conta de Vendas, aceite de Operações, ticket do Atendimento. O motivo do atraso, anotado em segundos, volta até a regra de cadastro.",
      crmObjects: [
        { object: "Fatura", actions: ["cria", "edita"], fields: ["nº da NF", "status de pagamento", "vencimento", "motivo do atraso"] },
        { object: "Proposta", actions: ["vê", "edita"], fields: ["prazo de pagamento", "aprovação de crédito", "aprovador"], owner: "vendas" },
        { object: "Oportunidade", actions: ["vê"], fields: ["valor", "etapa", "data prevista"], owner: "vendas" },
        { object: "Conta", actions: ["vê", "edita"], fields: ["CNPJ/CPF", "município", "e-mail de cobrança", "retenções na fonte"], owner: "vendas" },
        { object: "Contrato", actions: ["vê"], fields: ["valor mensal", "início da cobrança", "parcelas da implantação"], owner: "vendas" },
        { object: "Ticket", actions: ["vê", "edita"], fields: ["motivo", "fatura vinculada", "desfecho e prazo"], owner: "atendimento" },
      ],
      criticalField:
        "CNPJ e e-mail de cobrança da conta. Com o CNPJ da matriz no lugar da filial, a NF sai para outra empresa e é refeita; com o e-mail errado, a nota certa chega a quem não paga.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "falta CNPJ, município ou e-mail de cobrança",
          then: "a oportunidade não fecha como ganha",
          why: "A trava fica no ganho porque é o momento em que o executivo ainda está no negócio. Depois, ele já está na próxima venda, e o faturamento descobre o buraco na hora de emitir. O município define a quem o imposto da nota é pago; o e-mail define se a nota chega a quem paga.",
        },
        {
          when: "a fatura vence sem pagamento",
          then: "aviso ao cliente, alerta ao CSM e início da régua",
          why: "A régua anda em degraus (aviso no 1º dia, ligação no 5º, aviso de suspensão no 30º) para que a empresa não corte o serviço de quem só não recebeu a nota. O alerta ao CSM no mesmo dia evita a oferta de upgrade a quem está em atraso.",
        },
        {
          when: "o ERP registra o pagamento",
          then: "o CRM mostra “pago” e encerra a régua",
          why: "Ninguém digita pagamento à mão: o boleto compensa no dia seguinte, o Pix em minutos, o cartão na hora. A régua espera esse registro antes de cobrar, porque cobrar quem já pagou é o erro que mais gera ticket e desgaste com o cliente.",
        },
      ],
      neighborSystems: ["ERP", "Emissor de NF", "Integração bancária", "Gateway de pagamento"],
      feedback: {
        data: "“NF não recebida” lidera os motivos de atraso há 2 meses",
        decision: "Financeiro e RevOps tornam obrigatório o e-mail de quem paga; depois do ganho, só o Financeiro altera o campo, com histórico.",
        why: "O motivo em lista fechada é o que permite somar. Se a cobrança anotasse texto livre, ninguém veria que metade dos atrasos tem a mesma causa. O campo obrigatório no ganho muda o hábito do executivo, e o histórico de alteração protege contra o e-mail trocado por engano.",
      },
      governance:
        "O ERP é a fonte da fatura (NF, boleto ou Pix e pagamento); o CRM é a fonte do contrato e do cadastro, e mostra status, vencimento e 2ª via, sem dado bancário.",
      think: "Hoje, quando um cliente seu paga, quem fica sabendo além do banco? Em quanto tempo?",
    },
  },
  "operacoes-entrega": {
    // contrato didático (docs/conteudo/11), com os casos da Aurora e da Marina
    id: "operacoes-entrega",
    oneLiner: "Implanta o serviço ou entrega o pedido, e registra o prazo prometido, o real e o motivo do atraso.",
    keyQuestion: "O que foi prometido, para quando, e o que vai atrasar?",
    withoutCrm:
      "O cliente pergunta onde está o pedido. Quem atende pergunta à logística, que procura na planilha da transportadora e responde no dia seguinte. Quando a implantação atrasa, a nova data é combinada por telefone, e ninguém registra o motivo.",
    withCrm:
      "A logística registra a ocorrência (atraso, extravio ou avaria) no próprio pedido. Quem atende vê o mesmo registro, e o cliente é avisado antes de perguntar. Na implantação, o prazo prometido fica gravado à parte, e cada atraso entra com nova previsão e motivo.",
    whyCrm:
      "A ferramenta não cria o aviso; a regra cria. Quando Operações combina que toda ocorrência entra no pedido no mesmo dia, e o CRM dispara o aviso a partir dela, quem atende para de perguntar à logística. Sem a regra, o sistema de transportes sabe do atraso, e o cliente continua ligando.",
    cases: {
      b2b: {
        steps: [
          "Dia 1: o contrato da Aurora Transportes chega assinado: R$ 48 mil por ano mais a implantação (configurar e treinar até o sistema entrar no ar), com integração ao ERP (o sistema de gestão) da Aurora e sistema no ar em 45 dias. O consultor de implantação abre o projeto com o prazo prometido gravado: Dia 45.",
          "Dia 20: o acesso ao ERP da Aurora, que a TI dela precisava liberar, não chegou. O consultor registra a nova previsão (Dia 52) com o motivo, “acesso do cliente”, e avisa a Aurora no mesmo dia.",
          "Dia 52: o sistema entra no ar (go-live). Os usuários-chave da Aurora, as pessoas treinadas para ensinar os colegas, fazem o primeiro lançamento.",
          "Dia 55: a Aurora assina o aceite (a confirmação de que a entrega está pronta para uso), com uma pendência: importar o histórico do ano anterior. Isso libera a 2ª parcela da implantação (R$ 8,8 mil) e passa a conta ao CS, a área que acompanha o cliente depois da venda.",
        ],
        outcome:
          "O projeto guarda os dois prazos, Dia 45 prometido e Dia 52 real, com o motivo. No trimestre, “acesso ao ERP do cliente” lidera os atrasos, e Vendas passa a pedir o acesso como pré-requisito na proposta.",
        why: "O prometido ficou gravado à parte: se o consultor tivesse trocado 45 por 52, o relatório mostraria a Aurora no prazo, e ninguém descobriria que o acesso do cliente é o atraso mais comum. O aceite formal dá data ao resto: à parcela, à passagem ao CS e à pendência, que agora tem dono.",
      },
      b2c: {
        steps: [
          "Dia 1, 10h20: Marina paga o tênis de R$ 300, numeração 37. O pedido nasce com o prazo prometido gravado, 5 dias úteis pelo CEP dela, e Marina recebe o código de rastreio, que mostra onde o pedido está.",
          "Dia 4: a transportadora registra atraso na região de Marina. O analista de transportes abre a ocorrência no pedido, com nova previsão de 2 dias, e o aviso sai pelo WhatsApp antes de Marina perguntar.",
          "Dia 10: o tênis chega, 2 dias depois do prometido, e ficou pequeno. Marina pede a troca pelo 38 no app, dentro dos 7 dias de arrependimento do Código de Defesa do Consumidor (CDC, art. 49). A loja gera a etiqueta de postagem paga por ela (a logística reversa).",
          "Dia 16: o par devolvido chega e é conferido: sem uso, com etiqueta. A conferência libera o envio do 38 no mesmo dia; numa devolução, liberaria o estorno ao Financeiro.",
        ],
        outcome:
          "O pedido guarda o prazo prometido e o real, com a ocorrência. A devolução guarda o motivo “veio pequeno”. Marina não abriu ticket, e Produto vai somar esse motivo aos outros do mesmo modelo.",
        why: "O aviso saiu antes da pergunta porque a ocorrência mora no pedido, onde quem atende também vê. A troca em 7 dias não é gentileza: a lei garante a devolução com estorno total nesse prazo, então a loja aceita rápido, porque trocar custa menos que perder a venda. E o motivo registrado vira dado para Produto.",
      },
    },
    variants: {
      b2b: "Implantação por projeto, com escopo, prazo e aceite. Depois do aceite, uso e resultado são do CS.",
      b2c: "Logística em volume: prazo calculado pelo CEP na compra, rastreio da transportadora e trocas pela logística reversa, com os 7 dias de arrependimento do CDC.",
      small: "Uma pessoa embala ou instala. Prazo e rastreio ficam na planilha e no WhatsApp, e o prometido se perde quando o pedido é replanejado.",
    },
    brain: {
      idea: "No Brain, Operações decide que prazo prometer e quanta equipe ter, e só acerta se cada pedido e projeto guardar o prometido e o real. Vendas promete com esse número; Financeiro planeja o caixa pela data do aceite.",
      objectives: ["Entregar completo e no prazo prometido", "Avisar o atraso antes da reclamação", "Fechar cada implantação com aceite assinado"],
      decisions: [
        "Que prazo prometer por região, transportadora ou porte de projeto?",
        "Quantos consultores de implantação, ou turnos na expedição, para as vendas previstas no mês?",
        "Qual motivo de atraso ou de troca atacar primeiro, e com qual área?",
      ],
      why: "O prazo que Vendas promete nasce aqui, da média do que já foi entregue por região ou porte de projeto. Essa média só é honesta se o atraso fica registrado: com o prometido trocado para 52, a Aurora pareceria no prazo. A equipe segue a mesma lógica: sem a previsão de vendas (forecast), Operações contrata depois de atrasar.",
      indicators: [
        { name: "Entregas no prazo", source: "prazo prometido comparado com o real, no pedido ou no projeto" },
        { name: "Tempo da assinatura ao go-live", source: "data de assinatura do contrato (Vendas) até a data do aceite" },
        { name: "Tickets “onde está meu pedido”", source: "motivo do ticket (Atendimento), por transportadora e região" },
      ],
      ritual: "Reunião mensal com Vendas: a previsão do mês seguinte, comparada com a capacidade, e os prazos estourados com motivo.",
      customerImpact: "O que foi prometido chega; se atrasar, o cliente sabe antes, com a nova data.",
      think: "Na sua empresa, onde fica o prazo prometido ao cliente? Alguém consegue ver quantas entregas atrasaram no mês passado, e por quê?",
    },
    heart: {
      idea: "No Heart, Operações recebe a promessa de Vendas e a devolve cumprida: ao CS com o aceite, ao Atendimento com o status, ao Financeiro com a devolução conferida. Cada passagem tem um registro que diz onde a entrega está e o que falta.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Expedição e implantação: bancada com caixas e etiquetas, e um quadro em que cada pedido ou projeto anda de recebido para entregue.",
      roles: ["Consultor de implantação", "Técnico de campo", "Analista de transportes", "Analista de logística reversa"],
      dayInLife: [
        { time: "8h", action: "O analista de transportes abre a ocorrência nos pedidos parados, e o aviso sai aos clientes." },
        { time: "11h", action: "O técnico de campo fecha a ordem de serviço (OS) com foto e assinatura do cliente." },
        { time: "16h", action: "O consultor de implantação registra o go-live da Aurora e envia o termo de aceite." },
      ],
      subAreas: [
        {
          id: "implantacao",
          name: "Implantação",
          context: "b2b",
          process: {
            origin: "Contrato assinado, com escopo, integração e go-live prometido",
            decision: "Configurar, integrar e treinar os usuários-chave; replanejar com motivo se o cliente atrasa",
            output: "Aceite assinado, com pendências listadas e com dono",
          },
          handoff: { to: "customer-success", object: "Aceite e pendências do projeto" },
          record: "Projeto de implantação: go-live prometido e real, motivo do atraso, aceite",
          customerImpact: "A Aurora sabe quando entra no ar e o que ainda falta.",
          why: "O treinamento dos usuários-chave previsto no escopo é entrega da implantação e entra no aceite; novas turmas e adoção são do CS. Sem essa fronteira, a implantação nunca termina: o consultor segue atendendo pedidos novos, e ninguém tem uma data para dizer que o projeto acabou.",
        },
        {
          id: "visita-tecnica",
          name: "Visita técnica",
          process: {
            origin: "Venda ou ticket pede instalação ou reparo no endereço do cliente",
            decision: "Agendar, confirmar o modelo do equipamento e separar a peça certa",
            output: "Ordem de serviço fechada, com foto e assinatura",
          },
          handoff: { to: "atendimento", object: "Status e relatório da visita" },
          record: "OS: agenda, técnico, modelo e peças, assinatura",
          customerImpact: "O técnico chega na hora marcada, com a peça certa.",
          why: "A OS guarda o modelo do equipamento porque o técnico só vai uma vez por agendamento: se chega sem a peça, a visita é perdida, o cliente tira outra manhã, e o ticket volta ao Atendimento. O status “técnico a caminho”, visível para quem atende, poupa a ligação “que horas ele chega?”.",
        },
        {
          id: "expedicao-entrega",
          name: "Expedição e entrega",
          context: "b2c",
          process: {
            origin: "Pedido pago, com endereço e prazo prometido gravado na compra",
            decision: "Separar, despachar e tratar cada ocorrência com a transportadora",
            output: "Pedido entregue, ou ocorrência com novo prazo e cliente avisado",
          },
          handoff: { to: "atendimento", object: "Rastreio e ocorrência no pedido" },
          record: "Pedido: status, rastreio, ocorrência, prazo prometido e real",
          customerImpact: "Marina acompanha o pedido sem precisar perguntar.",
          why: "A ocorrência fica no pedido, e não na planilha da transportadora, porque é o pedido que quem atende abre quando Marina escreve. Com o registro, o aviso sai no dia do atraso. Sem ele, “onde está meu pedido” vira o motivo mais comum da fila do Atendimento, e cada resposta custa uma pergunta à logística.",
        },
        {
          id: "trocas-devolucoes",
          name: "Trocas e devoluções",
          context: "b2c",
          process: {
            origin: "Cliente pede troca ou devolução pelo app, pelo site ou pelo Atendimento",
            decision: "Gerar a postagem, conferir e decidir: troca, estorno ou recusa com motivo",
            output: "Devolução conferida, com motivo e resultado",
          },
          handoff: { to: "financeiro", object: "Devolução conferida para estorno" },
          record: "Devolução: motivo, postagem, conferência, estorno liberado",
          customerImpact: "A troca sai, ou o estorno é pedido, sem Marina precisar cobrar.",
          why: "Em compra fora da loja, a lei dá 7 dias para desistir sem motivo (CDC, art. 49), com estorno total e frete de volta pago pela loja. A conferência existe para a exceção: produto usado ou sem etiqueta. Liberado, o estorno vai ao Financeiro com o motivo, e o cliente ouve o prazo para não ligar antes.",
        },
      ],
      pitfalls: [
        "Sobrescrever o prazo prometido a cada atraso: tudo parece no prazo, e a próxima promessa repete o erro.",
        "Fechar a implantação sem aceite formal: a 2ª parcela não tem gatilho, e o CS não sabe quando assume.",
        "Conferir a devolução e não avisar: o estorno para, e o cliente cobra três vezes até reclamar em público.",
      ],
      think: "Quando uma entrega atrasa na sua empresa, quem avisa o cliente, e quando: antes ou depois de ele perguntar?",
    },
    backbone: {
      idea: "No Backbone, o Pedido, o Projeto e a Devolução são de Operações, e as outras áreas só leem. O que fica gravado aqui, prometido, real e motivo, dispara a fatura, o aviso e o estorno, e volta ao Brain como o prazo da próxima promessa.",
      crmObjects: [
        { object: "Projeto de implantação", actions: ["cria", "edita"], fields: ["go-live prometido e real", "motivo do atraso", "pendências", "aceite"] },
        { object: "Ordem de serviço (OS)", actions: ["cria", "edita"], fields: ["agenda", "técnico", "modelo e peças", "assinatura"] },
        { object: "Pedido", actions: ["edita", "vê"], fields: ["status", "rastreio", "ocorrência", "prazo prometido e real"] },
        { object: "Devolução", actions: ["cria", "edita"], fields: ["motivo", "postagem", "conferência", "estorno liberado"] },
        { object: "Contrato", actions: ["vê"], fields: ["escopo", "prazo prometido", "data de assinatura", "parcelas da implantação"], owner: "vendas" },
      ],
      criticalField:
        "O prazo prometido, gravado à parte do real. Se ele muda a cada replanejamento, tudo parece no prazo, e a média que Vendas usa para prometer fica errada.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "o aceite é registrado no projeto",
          then: "libera a 2ª parcela da implantação e passa a conta ao CS",
          why: "A parcela e a passagem precisam de um gatilho que não dependa de alguém lembrar. O aceite é o único marco que o cliente assina: sem ele, o Financeiro fatura cedo demais, e a Aurora contesta, ou tarde, e o caixa atrasa. O CS começa pelo mesmo registro, já com as pendências.",
        },
        {
          when: "a nova previsão passa do prazo prometido",
          then: "avisa o cliente e o Atendimento, com nova data e motivo",
          why: "Quem recebe a notícia do atraso antes de perguntar reclama menos e não abre ticket. A regra transforma o registro do consultor em aviso, sem depender de alguém lembrar de ligar; e o Atendimento recebe a mesma data, para responder igual se o cliente perguntar.",
        },
        {
          when: "a devolução é conferida",
          then: "libera o estorno ao Financeiro e informa o prazo ao cliente",
          why: "Conferir e não avisar é a quebra mais comum: o produto já voltou, e o estorno fica parado na mesa de alguém. Com o gatilho, o Financeiro recebe fatura e motivo juntos, e o cliente ouve o prazo real: no cartão, até 2 faturas; no Pix, no mesmo dia.",
        },
      ],
      neighborSystems: ["Gestão de pedidos", "Sistema de transportes", "Gestão de projetos", "ERP"],
      feedback: {
        data: "“Atraso” se repete na mesma região, com a mesma transportadora, por 3 semanas",
        decision: "Operações aumenta o prazo prometido na região ou troca a transportadora, antes da próxima campanha.",
        why: "A decisão só existe porque a ocorrência tem tipo de lista fechada, transportadora e região. Em texto livre (“atrasou de novo”), ninguém soma. O mesmo caminho vale para a devolução: “veio pequeno”, somado por modelo, vira em Produto um ajuste na tabela de numeração.",
      },
      governance: "Outras áreas veem status, prazo e ocorrência. Endereço e telefone, só quem entrega ou atende: pela LGPD, o dado pessoal fica com quem precisa dele para a tarefa.",
      think: "Que atraso ou troca se repete na sua operação? Se você somasse os motivos de um mês, daria para ver a causa?",
    },
  },
  "revops": {
    // 8ª coluna (substitui "marca-comunicacao"); reescrita no contrato didático (docs/conteudo/11)
    id: "revops",
    oneLiner: "Define as regras do CRM e cuida do dado: etapas, campos, distribuição e acessos, sem atender clientes.",
    keyQuestion: "Onde o dado está vazio, duplicado ou fora da regra, e qual regra ninguém combinou?",
    withoutCrm:
      "Cada área guarda a própria planilha e cria campos do seu jeito. A reunião de resultados começa discutindo qual número de receita vale, e o mesmo cliente aparece duas vezes na base.",
    withCrm:
      "As áreas combinam as regras: quem recebe cada interessado (lead), o que muda uma negociação de etapa, o que a conta precisa ter. RevOps as mantém no CRM para todos, e a reunião começa pelo mesmo número.",
    whyCrm:
      "A ferramenta não faz isso sozinha: o CRM aceita duplicados e campos vazios se ninguém combinou o contrário. O que muda é existir um time dono das regras, e não do cliente nem do dado. RevOps não vende, não cobra e não corrige o dado dos outros: aponta o erro ao dono e conserta a regra que o deixou nascer.",
    cases: {
      b2b: {
        steps: [
          "Dia 30, 16h: com o contrato da Aurora Transportes assinado (R$ 48 mil por ano, mais implantação), o executivo de vendas marca a negociação (oportunidade) como ganha. A integração com o ERP (o sistema de gestão onde ficam a nota fiscal e o financeiro) devolve erro: a conta não tem CNPJ.",
          "Dia 30, 16h20: o administrador do CRM busca pela raiz do CNPJ (os 8 primeiros dígitos, iguais para matriz e filiais) e acha duas contas: “Aurora Transportes”, criada do lead do webinar, com o CNPJ anotado pelo pré-vendedor (SDR); e “Aurora Transp. Ltda”, criada pelo executivo no Dia 4, sem CNPJ.",
          "Dia 30, 16h40: ele mescla as duas (junta os cadastros em um, sem perder o histórico) e avisa o executivo, dono da conta. A venda é reenviada, o ERP cria o cliente, e o Financeiro fatura no mesmo dia a 1ª parcela da implantação (R$ 8,8 mil, metade do valor com desconto).",
          "Dia 31: o administrador registra a causa para o comitê do mês: a conta podia nascer sem CNPJ, e a busca por nome não acha “Transp.” quando se digita “Transportes”. A regra muda para todos: CNPJ obrigatório ao criar a conta, e aviso quando a raiz já existe.",
        ],
        outcome:
          "A Aurora é uma conta só, com webinar, reunião, contrato e nota fiscal no mesmo histórico; e a causa do duplicado virou regra para as próximas contas.",
        why: "O ERP identifica o cliente pelo CNPJ; as pessoas procuram pelo nome. Enquanto houve duas contas, Marketing veria um lead do webinar que “não virou nada”, e Vendas, uma venda sem origem. Mesclar é a exceção em que RevOps corrige o dado, porque é correção de estrutura, e o dono da conta é avisado.",
      },
      b2c: {
        steps: [
          "Dia 1, 9h: o relatório de reconquista da loja física lista a Marina como cliente sem compra há 8 meses. No painel do site, a mesma Marina é cliente nova, pelo tênis de R$ 300 comprado há 3 semanas com o cupom do WhatsApp.",
          "Dia 1, 9h30: o administrador do CRM confere: são dois cadastros. O caixa da loja registrou a Marina pelo CPF, que o sistema de caixa (PDV) pede para a nota. O site a registrou pelo e-mail do login e guardou o CPF só no pedido.",
          "Dia 1, 10h: ele unifica os dois pelo CPF: uma cliente, dois canais, todos os pedidos. A régua de reconquista para, porque a última compra agora é de 3 semanas atrás. O consentimento fica como foi dado: o WhatsApp vale para oferta; o e-mail da loja, não.",
          "Dia 30: a receita por canal é somada pelo pedido, não pelo cadastro. Loja e site param de contar a mesma cliente duas vezes, e a recompra vira um número só. O site passa a buscar o CPF antes de criar outro cliente.",
        ],
        outcome:
          "A Marina é uma cliente com dois canais; cada pedido conta uma vez, no canal em que nasceu, e a soma dos canais fecha com a receita total.",
        why: "A loja identifica pelo CPF porque a nota exige; o site, pelo e-mail, porque é o login. Sem uma chave comum, cada canal tem “seus” clientes: a diretoria vê clientes novos inflados, e Marketing paga cupom de reconquista a quem acabou de comprar. Juntar dados de dois canais é tratamento de dado pessoal; o encarregado (DPO) valida a regra.",
      },
    },
    variants: {
      b2b: "Costuma nascer de Sales Ops (a mesma função, só para Vendas): funil, previsão do mês, comissão e integração com o ERP. A chave do cadastro é o CNPJ.",
      b2c: "Chama-se “CRM & BI” (BI são os painéis de indicadores): junta clientes de loja, site e app pelo CPF e cuida dos painéis. A régua de mensagens continua no time de CRM, em Marketing.",
      small: "Ninguém tem o cargo: o gerente comercial “cuida do CRM” nas horas vagas, e as regras raramente estão escritas. Mesmo numa empresa média, 1 ou 2 pessoas fazem as quatro estações (os postos de trabalho do andar Heart).",
    },
    brain: {
      idea: "No Brain, RevOps não decide sobre clientes, e sim sobre regras: qual campo é obrigatório, o que muda uma negociação de etapa, quem recebe cada lead. Com elas, Comercial e Financeiro chegam ao mesmo número, e a diretoria discute o que fazer, não qual vale.",
      objectives: ["Ter um só número de receita, conferido com o ERP", "Manter o cadastro completo, sem duplicados", "Fazer o CRM pedir só o que alguém usa"],
      decisions: [
        "Qual campo vazio ou regra ignorada atacar primeiro, e com qual área?",
        "O campo novo que Vendas pede compensa o tempo de quem vai preenchê-lo?",
        "O que precisa ser verdade para uma negociação mudar de etapa (o critério de saída)?",
      ],
      why: "Toda regra tem um custo: quem preenche gasta tempo em cada negociação. Por isso RevOps só aceita campo novo que alimente uma decisão, e recusa os outros com motivo. A regra também não nasce em RevOps: é combinada entre as áreas e aprovada pelos líderes delas, porque uma regra que só o administrador conhece é ignorada na semana seguinte.",
      indicators: [
        { name: "Campos-chave vazios", source: "negociações abertas sem valor, data prevista ou próximo passo" },
        { name: "Duplicados por raiz do CNPJ", source: "contas com os mesmos 8 primeiros dígitos do CNPJ; em B2C, CPF repetido" },
        { name: "Receita CRM × ERP", source: "negociações (oportunidades) ganhas no mês comparadas com notas emitidas no ERP; meta compartilhada com Financeiro" },
      ],
      ritual: "Comitê mensal do CRM: os líderes das áreas veem campos vazios e duplicados, e aprovam ou recusam cada mudança de regra.",
      customerImpact: "O cliente fala com um vendedor só, não responde duas vezes à mesma pergunta e recebe a nota fiscal certa.",
      think: "Na sua empresa, quando a receita do Comercial não bate com a do Financeiro, quem explica a diferença, e em quanto tempo?",
    },
    heart: {
      idea: "No Heart, o dia de RevOps é uma fila de demandas: um campo que Vendas pede, um cadastro duplicado, um acesso a tirar. RevOps não atende cliente nem corrige o dado dos outros: aponta o erro ao dono e conserta a regra.",
      // menuLine() usa o trecho antes dos dois-pontos
      routine: "Demandas e limpeza de base: mesa com dois monitores, fila de pedidos de mudança num e cadastros duplicados no outro.",
      roles: ["Gerente de RevOps", "Analista de RevOps", "Administrador de CRM", "Analista de dados (BI)"],
      dayInLife: [
        { time: "8h30", action: "O administrador mescla 15 contas duplicadas pela raiz do CNPJ e avisa o dono de cada uma." },
        { time: "11h", action: "Vendas pede o campo “concorrente”; o analista de RevOps mostra dois parecidos e propõe usar um só." },
        { time: "16h", action: "O administrador dá acesso ao executivo novo e tira o de quem saiu, cujos leads voltam ao gerente comercial." },
      ],
      subAreas: [
        {
          id: "admin-crm",
          name: "Administração do CRM",
          process: {
            origin: "Demanda de campo, etapa ou relatório novo, de qualquer área",
            decision: "Reaproveitar o que existe, criar algo útil a todos ou recusar com motivo",
            output: "Mudança testada e publicada com aviso, ou recusada com motivo",
          },
          // sem handoff, de propósito: a mudança vale para todos que usam o objeto
          record: "Histórico: o que mudou, quem pediu, quem aprovou e quando",
          customerImpact: "O cliente não responde duas vezes à mesma pergunta.",
          why: "Esta estação não entrega a uma área só, de propósito: um campo novo na conta vale para Vendas, Financeiro e CS (o pós-venda) ao mesmo tempo. Se cada demanda virasse um campo, em meses haveria três campos “concorrente”, ninguém saberia qual preencher, e o relatório somaria só um deles. Recusar com motivo é parte do trabalho.",
        },
        {
          id: "regras-passagens",
          name: "Regras e passagens",
          process: {
            origin: "Leads parados há dias sem contato; cada área culpa a outra",
            decision: "Combinar com Marketing e Vendas critério, destino, prazo combinado (SLA) e campo obrigatório",
            output: "Regra publicada no CRM, com trava ou alerta, e versão registrada",
          },
          handoff: { to: "marketing-growth", object: "Regras do lead e opt-out" },
          record: "Regra de distribuição: critério, destino, prazo e versão",
          customerImpact: "Quem pediu contato recebe resposta no prazo, mesmo quando o vendedor mudou.",
          why: "Quando um executivo sai, ninguém avisa RevOps, e a regra de distribuição continua mandando leads para o nome dele: 40 leads ficam dois dias sem contato enquanto Marketing e Vendas discutem de quem é a culpa. O CRM fez o que estava configurado. O conserto que fica é de processo: o aviso de desligamento, com a automação como reforço.",
        },
        {
          id: "dados-relatorios",
          name: "Dados e relatórios",
          process: {
            origin: "Sexta-feira, antes da reunião de previsão do mês (forecast)",
            decision: "Apontar a cada executivo campos vazios e negociações paradas, sem preencher por ele",
            output: "Painel conferido, com fonte e definição de cada número",
          },
          handoff: { to: "vendas", object: "Painel de funil e forecast" },
          record: "Painel: fonte, definição e data de corte de cada número",
          customerImpact: "Quem já recusou a proposta sai da lista de ligações.",
          why: "Quem registra corrige. Se o analista de dados preenche a data prevista no lugar do executivo, na sexta seguinte o campo está vazio de novo, e a previsão passa a ser de RevOps, não de Vendas. Apontar o vazio ao dono custa mais na semana e menos no trimestre: o executivo aprende que o campo decide a reunião.",
        },
        {
          id: "integracoes-acesso",
          name: "Integrações e acesso",
          process: {
            origin: "Venda ganha não chega ao ERP, ou chega com dado errado",
            decision: "Achar a causa (campo vazio, duplicado, código errado, integração parada); o dono corrige",
            output: "Registro reenviado ao ERP; a causa vira regra para os próximos",
          },
          handoff: { to: "financeiro", object: "Contrato ou pedido para faturar" },
          record: "Erro de integração: registro, campo, causa e status",
          customerImpact: "A nota fiscal sai no prazo, sem o cliente precisar pedir.",
          why: "A integração é só um mensageiro: leva ao ERP o que está na conta. Se o CNPJ está no cadastro duplicado, como na Aurora, a venda para na fila de erro, e a parcela de R$ 8,8 mil não é faturada. A fila de erro é lida todo dia: cada erro aponta um campo que a regra deixou vazio.",
        },
      ],
      pitfalls: [
        "Trocar de CRM sem combinar a regra: a ferramenta nova importa os mesmos duplicados e campos vazios.",
        "Criar um campo a cada pedido: em meses ninguém sabe qual preencher, e o relatório soma só um.",
        "Corrigir o dado no lugar do dono: na semana seguinte o erro volta, e agora é de RevOps.",
      ],
      think: "Na sua empresa, quem avisa o time do CRM quando alguém sai ou muda de função? Em quanto tempo os leads trocam de mão?",
    },
    backbone: {
      idea: "No Backbone, RevOps é dona do que o cliente nunca vê: etapa do funil, regra de distribuição e perfil de acesso, que dizem o que o CRM exige das outras áreas. Conta e fatura, ela só vê e aponta: são de Vendas e do Financeiro.",
      crmObjects: [
        { object: "Etapa do funil", actions: ["cria", "edita"], fields: ["critério de saída", "campos obrigatórios", "prazo máximo na etapa", "versão"] },
        { object: "Regra de distribuição", actions: ["cria", "edita"], fields: ["critério", "destino", "prazo (SLA)", "destino se o usuário sai"] },
        { object: "Perfil de acesso", actions: ["cria", "edita"], fields: ["leitura", "edição", "exportação", "data de desativação"] },
        { object: "Conta", actions: ["vê", "edita"], fields: ["CNPJ/CPF", "raiz do CNPJ", "dono da conta", "canal de origem"], owner: "vendas" },
        { object: "Fatura", actions: ["vê"], fields: ["valor", "data de emissão", "contrato ou pedido de origem"], owner: "financeiro" },
      ],
      criticalField:
        "O CNPJ ou CPF validado na conta. Sem ele, o CRM não reconhece quem já existe, nascem duplicados, e a venda ganha para na porta do ERP, que identifica o cliente por esse número.",
      // o painel monta "Quando {when} → {then}", com o porquê embaixo
      automations: [
        {
          when: "alguém cria uma conta com raiz de CNPJ que já existe",
          then: "avisa, mostra a conta existente e exige justificativa para criar outra (filial)",
          why: "Bloquear seria errado: matriz e filiais têm a mesma raiz e podem ser contas distintas, com nota fiscal e endereço próprios. O aviso impede o duplicado por descuido, como o da Aurora, e a justificativa registrada diz por que a segunda conta existe. O indicador de duplicados mostra se o aviso está sendo ignorado.",
        },
        {
          when: "um usuário é desativado",
          then: "seus leads e negociações abertas voltam ao gerente comercial no mesmo dia",
          why: "A regra de distribuição não sabe que alguém saiu: ela continua entregando leads a um nome. Sem a automação, quem pediu contato espera dias, e a empresa descobre pelo painel de leads parados. Os leads vão ao gerente comercial, e não a outro executivo, porque é ele quem sabe quem tem agenda para atendê-los hoje.",
        },
        {
          when: "falta cadastro fiscal no ganho",
          then: "trava e mostra o que falta: CNPJ, município ou e-mail de cobrança",
          why: "Software por assinatura é serviço: a nota fiscal de serviço (NFS-e) exige CNPJ, município e e-mail de cobrança, e não inscrição estadual. Antes da trava, o erro aparecia só na integração, como na Aurora. No dia do ganho o executivo está falando com o cliente; depois, pedir o dado custa uma ligação do Financeiro e dias de atraso na parcela.",
        },
      ],
      neighborSystems: ["ERP", "BI", "Automação de marketing", "Sistema de caixa (PDV)"],
      feedback: {
        data: "12 negociações marcadas como ganhas no mês ainda não têm nota fiscal no ERP",
        decision: "Vendas e Financeiro combinam: ganho só com contrato assinado e cadastro fiscal completo; comissão sobre o recebido.",
        why: "Vendido e faturado raramente batem no mesmo dia (ganho no fim de um mês, nota no começo do outro); a meta não é zerar a diferença, e sim explicar cada caso. Quando a diferença se repete, o problema é de regra: alguém marca ganho antes da assinatura, porque a meta conta no ganho. Comissão sobre o recebido alinha o incentivo.",
      },
      governance:
        "Acesso por perfil, e exportar a base exige aprovação do gestor. Prazo de guarda e base legal por canal seguem a regra do Jurídico, e o encarregado de dados (DPO) valida cada unificação de cadastros e cada campo novo com dado pessoal.",
      think: "Que número da sua empresa tem duas versões hoje? Quem seria o dono da regra que faz as duas virarem uma?",
    },
  },
};
