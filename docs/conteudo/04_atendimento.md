# 04 · Atendimento / SAC / Suporte

**Projeto:** CRM como Sistema · **Data:** 20/10/2026 · **Área:** `atendimento` (coluna 4)
**Dupla:** coordenação de SAC omnichannel (WhatsApp, chat, telefone) de e-commerce e serviços B2C, com a variação B2B conferida por uma liderança de suporte SaaS, + arquiteto de CRM/RevOps (autor do doc 00).
**Base:** `00_arquitetura_areas.md` §5.3, §6, §7 e §8, usando o exemplo do §6.5 como rascunho. Nenhum código foi alterado. Os números são ilustrativos.

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - Os dois blocos `ts` deixaram de ser `const … =` e ficaram no mesmo formato dos outros arquivos: objeto e lista puros.
> - O campo da Fatura se chama "status de pagamento", como nos outros arquivos.
> - A nº 9 mudou: o `object` ficou "Solicitação de estorno ou contestação", porque a 2ª via simples não sai do Atendimento. O `why` foi reescrito.
>
> **Decidido no `09`:**
> - a nº 8 tem os dois sentidos (decisão 5);
> - a nº 6 fica com o texto daqui (decisão 8);
> - o campo `boundary` não entra no modelo (decisão 11);
> - "solicitação de estorno" e "solicitação de cancelamento" são tipos de ticket, e não objetos próprios (decisão 4).

---

## 1. O que mudou e por quê

1. **A fronteira com CS entrou no painel.** O hover diz "atende quem procura a empresa": Atendimento reage e trabalha por ticket, enquanto CS antecipa e cuida da conta. A regra também aparece na variação B2B, na de empresa pequena e na passagem do N1 (cancelamento de plano vai ao CS). *Especialista.*
2. **Nomes de subárea com cara de crachá e dentro do limite.** "N1 / Linha de frente" e "Qualidade e voz do cliente" passavam de 3 palavras. Entrou "N2 e backoffice", que é como o SAC chama quem resolve o caso com Financeiro, Operações e transportadora. *Especialista e arquiteto.*
3. **Motivo em 2 níveis, confirmado ao fechar.** A lista é fechada (Cobrança > Duplicidade), e o canal de origem fica em outro campo: Procon é canal, não motivo. O erro de dado saiu das armadilhas e ficou só no campo crítico, como pede o §6.2. As armadilhas agora são erros de processo. *Especialista.*
4. **SLA por canal.** WhatsApp em 15 min, chat em 2 min, telefone em 1 min, e-mail em 24 h úteis (ilustrativo). O SLA aparece na automação e no indicador, e a tabela completa está em 2.3. *Especialista.*
5. **Cada motivo que liga áreas tem um lugar.** O estorno vai ao Financeiro (N2). "Onde está meu pedido" depende de Operações. A 2ª via sai no autoatendimento, com dado do Financeiro. O cancelamento de plano vai ao CS (Retenção, em B2C). O caso público sensível vai a Marketing, que devolve a resposta aprovada, como já está no `01_marketing.md`. *Arquiteto.*
6. **A pausa de promoção foi validada, com limite.** Só a promoção para; os avisos de pedido continuam. Como esse dado vai de Atendimento para Marketing, a relação 8 ganhou o sentido de volta (ver §3). *Especialista e arquiteto.*
7. **O caso fecha o ciclo.** No §6.5, o caso parava no envio ao Financeiro, e o desfecho tinha 18 palavras (o limite é 15). Agora o Financeiro confirma o estorno no próprio ticket, a cliente é avisada e o motivo entra no relatório do mês. *Especialista.*
8. **Um nome por objeto e um Backbone mais curto.** "Chamado" virou "ticket", e "pedido de estorno" virou "solicitação de estorno", porque Pedido é o objeto de Operações. A Avaliação (CSAT) saiu da lista de objetos e ficou na subárea Qualidade. Assim o Backbone mostra que Atendimento cria um objeto e consulta três de outras áreas. *Arquiteto.*

---

## 2. Conteúdo final

```ts
{
  id: "atendimento",
  oneLiner: "Atende quem procura a empresa, resolve e registra o motivo no ticket.",
  keyQuestion: "Quem espera resposta agora, há quanto tempo e por qual motivo?",
  withoutCrm: "O cliente reclama no WhatsApp, repete tudo ao telefone e recebe promoção por e-mail.",
  withCrm: "Quem atende vê contatos, pedido e fatura; ticket crítico aberto pausa as promoções.",
  scenario: {
    steps: [
      "09h12: a cliente escreve no WhatsApp: “fui cobrada duas vezes”.",
      "09h14: ticket aberto; o N1 vê dois pagamentos no pedido de ontem.",
      "10h30: o backoffice envia ao Financeiro a solicitação de estorno, com a fatura.",
      "16h00: o Financeiro confirma o estorno no ticket, e a cliente é avisada.",
    ],
    outcome: "O ticket guarda “Cobrança > Duplicidade”; no mês, esse motivo vai a Financeiro e Produto.",
  },
  variants: {
    b2b: "Suporte por níveis resolve o ticket; conta e renovação ficam com o CS.",
    b2c: "Alto volume no WhatsApp; “onde está meu pedido” e cobrança costumam liderar os motivos.",
    small: "Quem vende também atende e faz pós-venda, pelo celular; o histórico fica na conversa.",
  },
  brain: {
    objectives: [
      "Resolver no primeiro contato",
      "Cumprir o prazo combinado (SLA)",
      "Reduzir contatos evitáveis",
    ],
    decisions: [
      "Quais motivos atacar na causa, e com quem?",
      "Quantos atendentes por canal e horário, inclusive em campanha?",
      "Quais motivos o autoatendimento pode resolver sem fila?",
    ],
    indicators: [
      { name: "Resolução no 1º contato", source: "ticket sem novo contato no mesmo motivo" },
      { name: "Tickets no prazo", source: "prazo × hora da resposta, por canal" },
      { name: "Contatos por motivo", source: "motivo (2 níveis) do ticket" },
    ],
    ritual: "Segunda, 9h: Atendimento, Operações, Financeiro e Produto revisam os 5 motivos em alta.",
    customerImpact: "O cliente procura menos a empresa e, quando procura, resolve de vez.",
  },
  heart: {
    routine: "Fila em vários canais: baias e painel da fila.",
    roles: ["Atendente (N1)", "Analista de backoffice", "Supervisor de atendimento", "Analista de qualidade"],
    dayInLife: [
      { time: "08h", action: "O supervisor vê os WhatsApps da noite e os SLAs vencendo." },
      { time: "11h", action: "Campanha no ar: o N1 já tem as regras do cupom." },
      { time: "17h", action: "A qualidade revisa 10 atendimentos e corrige motivos errados." },
    ],
    subAreas: [
      {
        id: "n1",
        name: "Atendimento N1",
        process: {
          origin: "Contato por WhatsApp, chat, telefone ou e-mail",
          decision: "Identificar pelo CPF, classificar o motivo, resolver ou escalar",
          output: "Ticket resolvido, escalado ao N2 ou encaminhado ao CS",
        },
        handoff: { to: "customer-success", object: "Solicitação de cancelamento do plano" },
        record: "Ticket: cliente, canal, motivo, prioridade",
        customerImpact: "O simples se resolve na primeira conversa, sem transferência.",
      },
      {
        id: "backoffice",
        name: "N2 e backoffice",
        process: {
          origin: "Ticket escalado pelo N1, com histórico",
          decision: "Resolver aqui ou acionar Financeiro, Operações ou transportadora",
          output: "Solicitação acompanhada até o retorno ao cliente",
        },
        handoff: { to: "financeiro", object: "Solicitação de estorno com fatura" },
        record: "Ticket ligado à fatura ou ao pedido",
        customerImpact: "O caso difícil tem dono e retorno, sem o cliente cobrar.",
      },
      {
        id: "qualidade",
        name: "Qualidade e causa-raiz",
        process: {
          origin: "Motivos, reaberturas e CSAT da semana",
          decision: "Qual motivo cresce, por quê e quem resolve",
          output: "Causa levada à área dona e respostas prontas revisadas",
        },
        handoff: { to: "produto", object: "Motivos em alta por conta" },
        record: "Motivo revisado e CSAT por ticket",
        customerImpact: "O cliente para de esbarrar no mesmo problema.",
      },
      {
        id: "ouvidoria",
        name: "Ouvidoria / canais públicos",
        context: "b2c",
        process: {
          origin: "Reclamação em ouvidoria, site público ou Procon",
          decision: "Ligar aos tickets anteriores e responder no prazo",
          output: "Resposta curta em público e solução no privado",
        },
        handoff: { to: "marketing-growth", object: "Caso público para resposta aprovada" },
        record: "Ticket com origem “site público” ou “Procon”",
        customerImpact: "A reclamação pública é resolvida, não só respondida.",
      },
    ],
    pitfalls: [
      "Fechar ticket sem resolver para bater meta: o cliente volta.",
      "Passar ao Financeiro sem acompanhar: o cliente liga três vezes pelo estorno.",
      "3 canais, 3 tickets para o mesmo problema: cada atendente começa do zero.",
    ],
  },
  backbone: {
    crmObjects: [
      { object: "Ticket", actions: ["cria", "edita"], fields: ["motivo (2 níveis)", "canal", "prioridade e SLA", "status"] },
      { object: "Contato", actions: ["vê", "edita"], fields: ["CPF", "WhatsApp e e-mail", "opt-out"], owner: "marketing-growth" },
      { object: "Pedido", actions: ["vê"], fields: ["status e rastreio", "prazo prometido", "ocorrência"], owner: "operacoes-entrega" },
      { object: "Fatura", actions: ["vê"], fields: ["status de pagamento (paga, vencida, estornada)", "vencimento", "2ª via"], owner: "financeiro" },
    ],
    criticalField: "Motivo em 2 níveis, de lista fechada, confirmado ao fechar; sem ele, não há causa-raiz.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "um WhatsApp passa 15 min sem resposta", then: "alerta ao supervisor" },
      { when: "há ticket crítico aberto", then: "pausa as promoções; avisos de pedido seguem" },
      { when: "pedem 2ª via no WhatsApp", then: "o autoatendimento envia boleto ou Pix" },
    ],
    neighborSystems: ["Help desk", "Canais de mensagem", "Telefonia", "Base de conhecimento"],
    feedback: {
      data: "“Cobrança > Duplicidade” cresce 3 semanas seguidas",
      decision: "Na segunda, Produto prioriza a correção do checkout.",
    },
    governance: "Outras áreas veem motivo e status; a conversa, só quem trata o caso.",
  },
}
```

### 2.1 Contagem e conferência

Todos os campos estão dentro do máximo do §6.4, e cada lista tem a quantidade de itens pedida. A contagem foi feita por script: conta toda palavra com letra ou número, inclusive horários e o "Quando" das automações.

| Aba | Palavras visíveis | Orçamento (§6.1) | Nota |
|---|---|---|---|
| Visão | 153 | 110 | Acima, como o exemplo do §6.5 (157). Se as variações virarem um seletor B2B · B2C · Pequena, com uma visível por vez, cai para cerca de 126. |
| Brain | 90 | 90 | ok |
| Heart | 100, e de 44 a 45 por subárea aberta | 100 + 45 | ok |
| Backbone | 116 | 110 | Levemente acima, como o exemplo do §6.5 (117). |

**Testes do §8:**
- **Troca:** trocando "Atendimento" por CS, Vendas ou Operações, as frases-chave deixam de valer (ticket, motivo, fila, SLA por canal, conversa).
- **Crachá:** N1, backoffice, "os WhatsApps da noite", CPF, "onde está meu pedido", Procon e "bater meta" são falas reais de SAC.
- **Palavras e regras:** nenhuma palavra proibida, nenhuma marca, nenhum benchmark e nenhum "chamado". Health score não aparece no objeto.

### 2.2 Lista fechada de motivos (ilustrativa)

Esta é a base para RevOps configurar o campo. No painel, ela aparece no caso ("Cobrança > Duplicidade"), no campo crítico e nos indicadores.

| Nível 1 | Nível 2 (exemplos) | Quem corrige a causa |
|---|---|---|
| Pedido | Onde está meu pedido · Atraso · Extravio · Avaria · Item errado | Operações |
| Troca | Arrependimento · Defeito · Status da devolução | Operações |
| Cobrança | Duplicidade · 2ª via · Estorno · Valor diferente do combinado | Financeiro |
| Promoção | Cupom não aplicado · Regra da oferta · Preço diferente do anúncio | Marketing |
| Uso e acesso | Dúvida de uso · Erro no site ou app · Senha | Produto |
| Cadastro | Alterar dados · Parar de receber mensagens · Excluir dados | Marketing (opt-out) · RevOps (dados) |
| Cancelamento | Cancelar plano · Cancelar pedido | CS (plano) · Operações (pedido) |

- **Origem não é motivo.** WhatsApp, site público, Procon e ouvidoria vão no campo canal. Uma reclamação no Procon continua com o motivo real, por exemplo "Cobrança > Duplicidade".
- **Quando se preenche:** o N1 escolhe o motivo ao abrir e confirma ao fechar, e a Qualidade corrige por amostra.
- **Regra do "Outros":** ele existe, mas se passar de 1 em cada 10 tickets (ilustrativo), a lista precisa de revisão.
- **Quem muda a lista:** a Qualidade propõe e RevOps configura, com data de início, para o relatório do mês não misturar duas listas.
- **B2B:** os grupos mudam (Erro técnico · Integração · Configuração · Dúvida de uso · Pedido de melhoria · Cobrança), mas a regra de 2 níveis continua a mesma.

### 2.3 SLA por canal (ilustrativo)

| Canal | 1ª resposta | Na prática |
|---|---|---|
| Telefone | até 1 min na fila | o menu de voz pede o CPF antes |
| Chat no site | até 2 min | cada atendente leva 2 a 3 conversas ao mesmo tempo |
| WhatsApp | até 15 min, no horário de atendimento | fora do horário: autoatendimento, e a fila fica para a manhã |
| E-mail e formulário | até 24 h úteis | — |
| Rede social e site público de reclamação | até 24 h | resposta curta em público e solução no privado |
| Procon e ouvidoria | prazo do órgão ou da política interna | quem trata é a Ouvidoria |

- **Prazo de solução:** depende do motivo, não do canal (ex.: confirmar o estorno em até 5 dias úteis).
- **B2B:** o prazo vem do contrato e da prioridade (sistema parado: 1 h; erro com contorno: 8 h úteis; dúvida: 2 dias úteis).

### 2.4 Fronteira com CS: onde aparece no painel

A interface `AreaContent` não tem um campo para a tabela do §2 (reage × antecipa, ticket × conta, qualquer cliente × carteira, tempo × retenção). Por isso, a fronteira foi distribuída em campos que já existem:
- `oneLiner`: "atende **quem procura a empresa**", ou seja, Atendimento reage.
- `variants.b2b`: "Suporte por níveis resolve o ticket; conta e renovação ficam com o CS."
- `variants.small`: na empresa pequena, a mesma pessoa vende, atende e faz o pós-venda.
- Subárea N1: a solicitação de cancelamento do plano vai ao CS (Retenção, em B2C), e não fica parada como ticket.
- Relação 6 (§3).

**Sugestão para a fase de código: decidida no `09` (decisão 11).** O campo `boundary` não entra no modelo. A fronteira fica distribuída nos campos acima, e o glossário ganhou a entrada "Atendimento × CS".

### 2.5 Glossário: termos novos

| Termo | Definição curta |
|---|---|
| Backoffice | equipe que resolve com outras áreas o que o N1 não resolve na hora |
| Autoatendimento | o cliente resolve sozinho (2ª via, rastreio) por menu, bot ou portal, sem fila |
| Contato evitável | contato que deixa de existir quando a causa é corrigida ou o aviso chega antes |
| Causa-raiz | a origem do problema; corrigida, o motivo para de aparecer |
| Ouvidoria | canal para quem não teve solução no atendimento comum |
| Ticket crítico | ticket de prioridade máxima; a regra que define essa prioridade está em §4, item 3 |

Ticket já tem "protocolo" e "chamado" como sinônimos no glossário (§8.8).

---

## 3. Relações desta área

São as 5 relações do §5.3 que envolvem Atendimento: nº 6, 7, 8, 9 e 14. Não há relação nova, e a contagem por área não muda (Atendimento 5, Marketing 5). Quando a dupla da outra área já tinha proposto um ajuste, o texto dela foi aproveitado, para que a fase de código tenha uma versão só.

```ts
[
  // nº 6 · Atendimento ↔ CS · passagem (final: texto do 04)
  {
    a: "atendimento", b: "customer-success", floor: "heart", nature: "handoff",
    object: "Tickets por conta / escalonamento / cancelamento",
    why: "Tickets entram na saúde da conta; críticos e cancelamentos chegam ao CS.",
    breaks: "O CSM descobre 9 tickets na reunião de renovação.",
  },
  // nº 7 · Operações → Atendimento · dependência (objeto do 07)
  {
    a: "operacoes-entrega", b: "atendimento", floor: "heart", nature: "dependência",
    object: "Status do pedido ou da OS / ocorrência",
    why: "Rastreio e atraso visíveis para quem atende, antes do cliente perguntar.",
    breaks: "“Onde está meu pedido” lota a fila.",
  },
  // nº 8 · Marketing ↔ Atendimento · dependência (passa a ter os dois sentidos)
  {
    a: "marketing-growth", b: "atendimento", floor: "heart", nature: "dependência",
    object: "Campanha com regras ↔ ticket crítico e caso público",
    why: "Regras do cupom chegam ao SAC antes do disparo; ticket crítico pausa a promoção.",
    breaks: "O SAC desconhece o cupom; quem reclamou ontem recebe promoção hoje.",
  },
  // nº 9 · Atendimento → Financeiro · passagem (final: object e why da consolidação)
  {
    a: "atendimento", b: "financeiro", floor: "heart", nature: "handoff",
    object: "Solicitação de estorno ou contestação",
    why: "Estorno e contestação sobem com fatura e motivo; a 2ª via simples fica no Atendimento.",
    breaks: "O cliente pede o estorno 3 vezes, e ninguém sabe o status.",
  },
  // nº 14 · ★ Atendimento → Produto · retorno (sem mudança)
  {
    a: "atendimento", b: "produto", floor: "heart", floorB: "brain", key: true, nature: "feedback",
    object: "Motivos de ticket + pedidos de melhoria por conta",
    why: "Volume por motivo e receita das contas afetadas priorizam o roadmap.",
    breaks: "Motivo em texto livre; ninguém consegue somar.",
  },
]
```

**Nº 9, final (consolidação).** Se a 2ª via simples fica no Atendimento, ela não passa para o Financeiro. Por isso saiu do `object` e foi para o fim do `why`.

**Ajustes (antes → depois)**

| Nº | Campo | Antes (§5.3) | Depois | Motivo |
|---|---|---|---|---|
| 6 | `object` | Tickets por conta / escalonamento | … / cancelamento | Na passagem real do N1, quem quer cancelar o plano vai ao CS (Retenção, em B2C). |
| 6 | `why` | Chamados entram na saúde da conta; casos críticos chegam ao CSM. | Tickets entram na saúde da conta; críticos e cancelamentos chegam ao CS. | "Chamado" fere o §8.8. A base é o texto do `05_customer-success.md`, com o cancelamento. "Saúde da conta" vale com a definição do 05: "quando a empresa define a regra". |
| 6 | `breaks` | O CSM descobre 9 chamados na reunião de renovação. | O CSM descobre 9 tickets na reunião de renovação. | Igual ao 05. |
| 7 | `object` | Status do pedido / ocorrência | Status do pedido ou da OS / ocorrência | Ajuste do `07_operacoes.md`, aceito: a visita técnica B2B também gera ticket. |
| 8 | sentido e `object` | Marketing → Atendimento · Campanha / oferta com regras | Marketing ↔ Atendimento · Campanha com regras ↔ ticket crítico e caso público | O dado também volta: o ticket crítico pausa a régua, e o caso público sensível vai a Marca & Conteúdo. O `01_marketing.md` já descreve as duas coisas nas subáreas Lifecycle e Marca & Conteúdo. Continua sendo uma relação só. |
| 8 | `why` | Regras de cupom, prazo e público chegam ao SAC antes do disparo. | Regras do cupom chegam ao SAC antes do disparo; ticket crítico pausa a promoção. | O `why` passa a mostrar os dois sentidos. |
| 8 | `breaks` | Promoção sai e o SAC não sabe responder. | O SAC desconhece o cupom; quem reclamou ontem recebe promoção hoje. | Mostra a falha nos dois sentidos. A segunda é o "sem CRM" da Visão. |
| 9 | `object` | Pedido de estorno, contestação ou 2ª via | Solicitação de estorno ou contestação *(final)* | "Pedido" é o objeto de Operações (§8.8). A 2ª via simples não passa para o Financeiro. |
| 9 | `why` | Solicitação com fatura e motivo vai a quem resolve. | Estorno e contestação sobem com fatura e motivo; a 2ª via simples fica no Atendimento. *(final)* | É a ideia de `06_financeiro.md`, reescrita para combinar com o novo `object`. Também bate com a automação de 2ª via no autoatendimento. |
| 9 | `breaks` | O cliente repete o pedido em 3 contatos. | O cliente pede o estorno 3 vezes, e ninguém sabe o status. | Nomeia a causa: o desfecho não volta ao ticket. O 06 já tem essa volta como handoff ("Desfecho e prazo no ticket"). |
| 14 | — | — | sem mudança | O `03_produto.md` também manteve. |

**Regra da pausa** (responde ao item 4 de "Para validar" do 01): Atendimento define o que é ticket crítico, pela prioridade. Marketing aplica a pausa na régua, e RevOps configura. Só a oferta pausa; os avisos de entrega e de cobrança continuam. A exceção é a fatura em contestação, cuja régua fica com o Financeiro.

---

## 4. Para validar

1. **Lista de motivos (2.2).** Os 7 grupos cobrem a fila real de um SAC de e-commerce e de serviços? O limite de "Outros" (1 em cada 10 tickets) e a regra "Qualidade propõe, RevOps configura" funcionam na prática?
2. **SLA por canal (2.3).** Os prazos ilustrativos parecem plausíveis para quem vai assistir (WhatsApp 15 min, chat 2 min, telefone 1 min, e-mail 24 h úteis, canal público 24 h)? Para Procon e ouvidoria, basta dizer "prazo do órgão", sem citar norma?
3. **Ticket crítico.** É preciso fechar a definição que pausa as promoções. A proposta é: origem em canal público ou Procon, cobrança indevida ou 2ª reabertura. Também falta confirmar se a pausa termina quando o ticket fecha ou alguns dias depois.
4. **Ouvidoria e canais públicos.** Em vários setores, o Procon e os processos ficam com o Jurídico, e a rede social com Marketing. A subárea deve dizer "quando existe"? E qual é o critério de "caso sensível" que sobe para Marketing (volume, imprensa, risco legal)?
5. **Variação B2B (com suporte SaaS).** Falta confirmar três pontos: que o cancelamento passa do N1 ao CS; que o prazo vem do contrato e da prioridade (2.3); e se "backoffice" soa natural em B2B, onde se fala "suporte N2/N3". Se não soar, o nome da subárea pode virar "N2 / Especialistas".

