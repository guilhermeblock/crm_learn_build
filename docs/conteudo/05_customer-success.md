# 05 · CS: Customer Success / Relacionamento

**Área:** `customer-success` · **Data:** 20/10/2026
**Dupla:** Head de Customer Success de SaaS B2B, com carteira, renovação e health score (perfil do §7), + arquiteto de CRM/RevOps (autor do `00_arquitetura_areas.md`). A parte B2C (Retenção) está no item 5 de "Para validar".
**Base:** `00_arquitetura_areas.md` §5.3, §6, §7 (briefing de CS) e §8. Nenhum código foi alterado.

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - **Objetos:** entrou o **Plano de sucesso**, que CS cria, e saiu a Oportunidade, porque o limite é 5. A renovação e a expansão continuam numa automação e numa subárea.
> - **Treinamento** (decisão 3): o treinamento previsto no escopo é da Implantação. O CS treina os novos usuários e cuida da adoção.
> - **Onboarding com implantação:** começa no aceite.
> - **Automações:** saiu a palavra "Quando" do início (decisão 13). A pausa de expansão acontece no 1º dia da fatura vencida (decisão 16).
> - **Formato:** os itens do `dayInLife` começam com maiúscula, e a decisão do `feedback` termina com ponto.
> - **Relações:** a nº 5 foi para o Brain (decisão 9); a nº 6 usa o texto de `04` (decisão 8); a nº 16 tem texto novo (decisão 15).
>
> **Mantido:** a Operações → CS não vira relação fixa, só ligação temporária da estação (decisão 2).

---

## 1. O que mudou e por quê

1. **Uma frase só, com objeto.** `oneLiner` e `role` repetiam "acompanha adoção, resultados e a continuidade da relação". Ficou uma frase: recebe a conta de Vendas, acompanha o uso e conduz a renovação.
2. **Vendas → CS (★) com campos mínimos.** A "passagem de bastão com expectativas e escopo" virou o objeto **Notas de passagem**, preenchido por Vendas no ganho: objetivo do cliente, promessas, contatos-chave e critério de sucesso. O especialista acrescentou a falha real: com o campo obrigatório, o vendedor escreve "ver proposta" só para conseguir fechar.
3. **Financeiro → CS (★) virou cena.** O caso mostra 2 faturas vencidas na tela da conta, a expansão segurada e uma causa frequente em B2B: o boleto ia para um ex-funcionário do cliente. A regra virou automação. *Na consolidação:* a pausa vale desde o 1º dia da fatura vencida, e o alerta ao CSM sai pelo Financeiro. O marco de 15 dias fica para a reunião de quinta com o Financeiro.
4. **Health score sem promessa.** Antes: "health score quando aplicável", sem dizer o que entra. Agora: uso, tickets, faturas e NPS, com "quando definido". O especialista lembrou que muita empresa começa com um **farol** marcado à mão; o arquiteto exigiu critério escrito, e isso virou armadilha.
5. **Os dois campos que faltavam.** **Data de renovação** virou o campo crítico: nasce no ganho e abre a renovação 90 dias antes. **Motivo de cancelamento** virou lista fechada, com a armadilha do "preço" marcado por hábito.
6. **Regra de expansão explícita.** O CSM identifica e abre a oportunidade com origem CS; Vendas fecha. Só para conta saudável e com faturas em dia. "Quem conduz" ficou como decisão do Brain, porque em conta pequena o próprio CSM fecha.
7. **B2C e empresa pequena de verdade.** Nova subárea **Retenção** (B2C): pedido de cancelamento, uma oferta, motivo registrado e enviado a Marketing para reconquista. Na empresa pequena, o vendedor faz o pós-venda pelo WhatsApp e a renovação fica numa planilha.
8. **Fronteiras e sistemas.** "CRM" saiu da lista de capacidades; os sistemas vizinhos são Plataforma de CS e Analytics de produto. Implantação (escopo, go-live e o treinamento previsto no escopo) fica em Operações. Depois do aceite, ou quando não há implantação, CS treina os novos usuários e cuida da adoção. Atendimento cuida do ticket; CS cuida da conta. As subáreas ganharam nomes curtos: Onboarding, Gestão de carteira, Renovação e expansão, Retenção.

---

## 2. Conteúdo final

Números, prazos e horários são ilustrativos (o painel mostra o selo no `scenario`). Todos os campos estão dentro dos limites do §6.4, conferidos por script.

Totais visíveis por aba: **Visão 159 · Brain 90 · Heart 100** (+42 a 45 por subárea aberta) **· Backbone 131**. Visão e Backbone passam do orçamento de 110 do §6.1, assim como o exemplo de Atendimento do §6.5 (157 e 120 pelo mesmo contador).

```ts
{
  id: "customer-success",
  oneLiner: "Recebe a conta de Vendas, acompanha o uso e conduz a renovação.",
  keyQuestion: "Quais contas renovam neste trimestre, quais estão em risco e por quê?",
  withoutCrm: "O cliente avisa que não vai renovar, e ninguém tinha visto o uso cair.",
  withCrm: "Uso, tickets, faturas e renovação aparecem na conta; queda de uso vira tarefa do CSM.",
  scenario: {
    steps: [
      "Dia 1: a 90 dias do fim do contrato, o CRM abre a renovação.",
      "R$ 10 mil vencidos em 2 faturas, mas o uso está no limite do plano.",
      "Dia 3: o CSM liga para o cliente; o boleto ia para um ex-funcionário.",
      "Dia 10: faturas pagas; só então a expansão vai para Vendas.",
    ],
    outcome: "O e-mail de cobrança corrigido vai ao ERP; o próximo boleto chega certo.",
  },
  variants: {
    b2b: "Cada CSM tem uma carteira de contas e responde pela renovação.",
    b2c: "Quase nunca há CSM: o papel vira Retenção, programa de fidelidade ou régua de Marketing.",
    small: "O próprio vendedor faz o pós-venda pelo WhatsApp; a renovação fica numa planilha.",
  },
  brain: {
    objectives: [
      "Levar o cliente ao primeiro valor",
      "Renovar contratos sem surpresa",
      "Expandir as contas saudáveis",
    ],
    decisions: [
      "Quais contas em risco atacar primeiro?",
      "Qual conta está pronta para expansão, e quem conduz?",
      "Onde o onboarding trava antes do primeiro valor?",
    ],
    indicators: [
      { name: "Receita retida da carteira", source: "renovações, expansões e cancelamentos do trimestre" },
      { name: "Contas em risco", source: "health score (uso, tickets, faturas, NPS), quando definido" },
      { name: "Tempo até o primeiro valor", source: "da assinatura ao marco “primeiro valor”" },
    ],
    ritual: "Segunda: CSMs revisam renovações do trimestre e contas em risco.",
    customerImpact: "O cliente é procurado durante o contrato, não só na renovação.",
  },
  heart: {
    routine: "Gestão da carteira: mesa redonda, cadeira do cliente, quadro de contas.",
    roles: ["Analista de onboarding", "Customer Success Manager (CSM)", "Analista de retenção", "Head de CS"],
    dayInLife: [
      { time: "08h30", action: "O CSM confere a carteira: 2 contas com uso caindo." },
      { time: "11h", action: "Reunião de passagem com o vendedor: conta ganha ontem." },
      { time: "16h", action: "No QBR, o cliente pede mais 20 usuários: expansão para Vendas." },
    ],
    subAreas: [
      {
        id: "onboarding",
        name: "Onboarding",
        process: {
          origin: "Notas de passagem; aceite, quando há implantação",
          decision: "Combinar meta e primeiro valor; treinar novos usuários",
          output: "Primeiro valor alcançado; conta segue para o CSM",
        },
        record: "Plano de sucesso: meta, marcos, primeiro valor",
        customerImpact: "O cliente não repete o que já contou ao vendedor.",
      },
      {
        id: "carteira",
        name: "Gestão de carteira",
        process: {
          origin: "Uso em queda ou tickets repetidos na conta",
          decision: "Entender a causa com o cliente antes de qualquer oferta",
          output: "Plano de ação com dono e prazo",
        },
        handoff: { to: "produto", object: "Pedido de melhoria da conta" },
        record: "Check-in e risco registrados na conta",
        customerImpact: "O problema é tratado antes de virar cancelamento.",
      },
      {
        id: "renovacao-expansao",
        name: "Renovação e expansão",
        process: {
          origin: "Renovação em 90 dias ou uso no limite do plano",
          decision: "Checar saúde e faturas; renovar, expandir ou corrigir antes",
          output: "Renovação negociada ou expansão identificada",
        },
        handoff: { to: "vendas", object: "Oportunidade de expansão (origem CS)" },
        record: "Contrato: renovado ou cancelado, com motivo",
        customerImpact: "A renovação chega cedo, não na última semana.",
      },
      {
        id: "retencao",
        name: "Retenção",
        context: "b2c",
        process: {
          origin: "Pedido de cancelamento por WhatsApp, telefone ou app",
          decision: "Entender o motivo e oferecer pausa, desconto ou plano menor",
          output: "Cliente retido ou cancelamento feito, com motivo",
        },
        handoff: { to: "marketing-growth", object: "Motivo de cancelamento para reconquista" },
        record: "Contrato: oferta, resultado, motivo",
        customerImpact: "Quem quer cancelar consegue no primeiro contato, sem insistência.",
      },
    ],
    pitfalls: [
      "Notas de passagem com “ver proposta” para fechar: o CSM começa no escuro.",
      "Farol sem critério escrito: a conta fica verde até cancelar.",
      "Cancelamento marcado como “preço” por hábito: a falta de uso nunca aparece.",
    ],
  },
  backbone: {
    crmObjects: [
      { object: "Plano de sucesso", actions: ["cria", "edita"], fields: ["meta do cliente", "marcos", "primeiro valor"] },
      { object: "Conta", actions: ["vê", "edita"], fields: ["CSM responsável", "health score ou farol", "último contato"], owner: "vendas" },
      { object: "Contrato", actions: ["vê", "edita"], fields: ["data de renovação", "valor", "motivo de cancelamento (lista fechada)"], owner: "vendas" },
      { object: "Notas de passagem", actions: ["vê"], fields: ["objetivo do cliente", "promessas", "contatos-chave", "critério de sucesso"], owner: "vendas" },
      { object: "Fatura", actions: ["vê"], fields: ["status de pagamento", "vencimento", "valor em aberto"], owner: "financeiro" },
    ],
    criticalField: "Data de renovação, preenchida no ganho: sem ela, o cancelamento chega de surpresa.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "faltam 90 dias para a renovação", then: "abre a oportunidade de renovação ao CSM" },
      { when: "a fatura vence sem pagamento", then: "pausa as ofertas de expansão da conta" },
    ],
    neighborSystems: ["Plataforma de CS", "Analytics de produto"],
    feedback: {
      data: "“Não usou” lidera os cancelamentos do semestre",
      decision: "O primeiro valor vira meta do onboarding; Marketing revê o perfil atraído.",
    },
    governance: "O CSM vê status da fatura e motivo do ticket, mas não dado bancário nem conversa.",
  },
}
```

**Termos para o glossário (§8.5).** Novos, na ordem em que aparecem no painel:

| Termo | Definição curta |
|---|---|
| CSM | pessoa de CS responsável por uma carteira de contas |
| Carteira | conjunto de contas sob responsabilidade de um CSM |
| Primeiro valor | primeiro resultado concreto que o cliente tem com o que comprou |
| Notas de passagem | o que Vendas registra no ganho para quem vai cuidar do cliente |
| QBR | revisão trimestral de resultados com o cliente |
| Check-in | conversa periódica do CSM com o cliente, registrada na conta |
| Farol | cor de saúde da conta (verde, amarelo, vermelho), marcada à mão ou calculada |
| Receita retida | receita da carteira depois de renovações, expansões e cancelamentos |
| Retenção | equipe que atende quem pede para cancelar |
| Reconquista | contato com quem cancelou, para tentar trazer de volta |
| Analytics de produto | sistema que mede o uso do produto por conta e por usuário |

**Ajuste no glossário atual:** "Health score: nota de saúde da conta, que soma uso, chamados e pagamento" → "nota de saúde da conta, quando a empresa define a regra (ex.: uso, tickets, pagamento e NPS)". Motivo: "chamados" fere o §8.8, e a definição atual dá a entender que toda empresa tem a nota (§8.7).

---

## 3. Relações desta área

CS aparece em 6 das 18 relações do §5.3. A dupla ajustou o texto de 3 delas (tabela abaixo). Na consolidação, a #5 mudou de andar e a #6 e a #16 ganharam o texto final. O bloco `ts` já traz a versão final.

**Ajustes (antes → depois)**

| # | Relação | Campo | Antes (§5.3) | Depois | Motivo |
|---|---|---|---|---|---|
| 2 | Vendas → CS ★ | `why` | O que foi prometido na venda chega a quem cuida do cliente. | O que foi prometido na venda chega ao CSM antes da primeira reunião. | Ganha o "quem" e o "quando" (§8.2). |
| 2 | Vendas → CS ★ | `breaks` | O CS descobre a promessa na primeira reunião com o cliente. | O cliente cobra, na primeira reunião, uma integração que ninguém registrou. | Caso concreto (§8.6). Mostra que a falha está no registro, não na pessoa. |
| 6 | Atendimento ↔ CS | `why` | Chamados entram na saúde da conta; casos críticos chegam ao CSM. | Tickets entram na saúde da conta; críticos e cancelamentos chegam ao CS. *(final, texto de `04`)* | Um nome por objeto (§8.8): "ticket", nem "chamado" nem "caso". A consolidação incluiu o cancelamento que `04` propôs. |
| 6 | Atendimento ↔ CS | `breaks` | O CSM descobre 9 chamados na reunião de renovação. | O CSM descobre 9 tickets na reunião de renovação. | Idem. |
| 13 | Financeiro → CS ★ | `why` | Fatura vencida muda a prioridade e o tom do CS. | Fatura vencida aparece na conta; o CSM pausa ofertas e ajuda a destravar o pagamento. | "Prioridade e tom" era abstrato. Agora diz o que aparece na tela e o que o CSM faz, como no caso da Visão. |

**As 6 relações no formato `Relation`**

```ts
[
  // #2 · ★ · texto ajustado
  { a: "vendas", b: "customer-success", floor: "heart", key: true, nature: "handoff",
    object: "Conta + contrato + notas de passagem",
    why: "O que foi prometido na venda chega ao CSM antes da primeira reunião.",
    breaks: "O cliente cobra, na primeira reunião, uma integração que ninguém registrou." },

  // #5 · final: foi para o Brain (09, decisão 9)
  { a: "customer-success", b: "vendas", floor: "brain", nature: "meta compartilhada",
    object: "Oportunidade de expansão + regra de comissão",
    why: "CS identifica, Vendas fecha; meta e comissão da expansão são combinadas antes.",
    breaks: "Disputa de comissão; vendedor oferece upgrade a conta em crise." },

  // #6 · final: texto do 04 (09, decisão 8)
  { a: "atendimento", b: "customer-success", floor: "heart", nature: "handoff",
    object: "Tickets por conta / escalonamento / cancelamento",
    why: "Tickets entram na saúde da conta; críticos e cancelamentos chegam ao CS.",
    breaks: "O CSM descobre 9 tickets na reunião de renovação." },

  // #13 · ★ · texto ajustado
  { a: "financeiro", b: "customer-success", floor: "brain", floorB: "heart", key: true, nature: "dependência",
    object: "Status de pagamento / inadimplência",
    why: "Fatura vencida aparece na conta; o CSM pausa ofertas e ajuda a destravar o pagamento.",
    breaks: "Oferta de upgrade a cliente com 2 faturas atrasadas." },

  // #15 · sem mudança (sem ★, como no §5.1)
  { a: "customer-success", b: "marketing-growth", floor: "heart", floorB: "brain", nature: "feedback",
    object: "Motivo de cancelamento, NPS, indicação",
    why: "Quem fica e quem sai redefine o público e as mensagens.",
    breaks: "Marketing segue atraindo o perfil que mais cancela." },

  // #16 · final: texto da consolidação (09, decisão 15)
  { a: "produto", b: "customer-success", floor: "brain", nature: "meta compartilhada",
    object: "Evento “ativou” e marco de primeiro valor da conta",
    why: "O evento “ativou” de Produto é o primeiro passo do primeiro valor que CS acompanha.",
    breaks: "Produto comemora a ativação; CS vê a conta sem resultado." },
]
```

**Notas (atualizadas na consolidação)**
- **Operações → CS: continua sem relação fixa** (decisão 2 do `09`). A passagem fica no handoff da Implantação ("Aceite e pendências do projeto"), que o 3D mostra como ligação temporária com a estação aberta, e na automação de Operações ("o aceite é registrado → libera a fatura e avisa o CS"). CS segue com 6 relações.
- **Subáreas e cabos:** cada `handoff` acende a relação do mesmo par, em qualquer andar: Produto (#16, Brain), Vendas (#5, agora no Brain) e Marketing (#15).
- **#2 e #5 já não se sobrepõem:** a #5 foi para o Brain (decisão 9).

---

## 4. Para validar

1. **Notas de passagem.** Os 4 campos (objetivo do cliente, promessas, contatos-chave, critério de sucesso) bastam para o CSM começar? A trava no ganho funciona sem virar "ver proposta"?
2. **Prazos ilustrativos.** Abrir a renovação 90 dias antes e pausar ofertas com 15 dias de atraso é plausível em contrato anual B2B? O aviso prévio de cancelamento previsto no contrato muda essa janela?
3. **CS na cobrança.** É comum o CSM ajudar a destravar fatura vencida? Quem pode corrigir o e-mail de cobrança no CRM: CS, ou só o Financeiro?
4. **Fronteiras com Operações e Produto.** Quando há implantação, o onboarding de CS começa no ganho ou no go-live? E "tempo até o primeiro valor" é medido do mesmo jeito por CS e Produto (da assinatura ao marco)?
5. **Retenção.** As ofertas (pausa, desconto, plano menor) e o "cancelar no primeiro contato" batem com a prática? Em setores regulados (telecom, planos), confirmar as regras de cancelamento com o Jurídico, sem levar parecer ao painel. A Retenção também existe em SaaS para pequenas empresas: manter `context: "b2c"` ou tirar?
