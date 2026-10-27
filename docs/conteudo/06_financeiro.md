# 06 · Financeiro: Crédito, Faturamento e Cobrança

**Projeto:** CRM como Sistema · **Data:** 20/10/2026 · **id:** `financeiro`
**Dupla:** gerente de contas a receber e faturamento de empresa B2B com receita recorrente, com prática em NF e régua de cobrança (perfil do §7) + arquiteto de CRM/RevOps, autor do `00_arquitetura_areas.md`.
**Base:** `00_arquitetura_areas.md` (§2, §5.3, §6, §7 e §8). Ponto de partida: `src/content/areas.ts`. Nenhum código foi alterado.

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - As aspas internas passaram a ser curvas (“ ”).
> - "3 pedidos de desconto" virou "3 descontos fora da política", porque "pedido" é o objeto de Operações.
> - **Nº 4:** o `object` daqui foi aceito, e o `breaks` junta textos daqui e de `02`.
> - **Nº 9:** o `object` virou "Solicitação de estorno ou contestação", e o `why` foi reescrito.
> - **Nº 10:** confirmada como está.
> - **Nº 13:** usa o texto de `05`.
> - **Nº 18:** usa o texto de `08`.

---

## 1. O que mudou e por quê

1. **A frase da área fala a língua do Financeiro (briefing 6).** Saiu "Torna claras, corretas e sustentáveis as condições econômicas da relação", que ninguém da área usa. Entrou o trabalho real em três verbos: aprova crédito e desconto, emite a NF e cobra.
2. **Controladoria saiu e Crédito e aprovação entrou (briefing 1).** Controladoria lê relatório, mas não mexe em registro do CRM. O crédito aprova desconto e prazo fora da política **na oportunidade, antes da assinatura**. CAC × LTV, margem e custo de servir saíram do Brain. O número que interessa ao CRM ficou em "Vendido × faturado", meta compartilhada com RevOps (nº 18).
3. **Estornos e contestações virou subárea (briefing 5).** O ticket de estorno do Atendimento e a devolução conferida por Operações não tinham dono no Financeiro. Ajuste do especialista: a 2ª via simples fica com o Atendimento, que vê a fatura no CRM. Para o Financeiro sobe só o que muda valor ou data.
4. **O cadastro fiscal ganhou a lista completa (briefing 2).** Quatro campos travam a NF: CNPJ/CPF, razão social, inscrição estadual ou municipal e endereço. O e-mail de cobrança não trava a NF, mas, sem ele, a fatura não chega a quem paga. O CNPJ virou o campo crítico, com trava no ganho. O e-mail de cobrança entra na trava por decisão do `feedback`.
5. **A fonte da verdade foi decidida (briefings 3 e 4).** O ERP é a fonte da fatura (NF, boleto/Pix e pagamento), e o CRM é a fonte do contrato e do cadastro. O status chega ao CRM pela integração, e ninguém digita pagamento à mão. Do pagamento, o CRM mostra status, vencimento e 2ª via, sem dado bancário. O vendedor vê a decisão de crédito, não a análise.
6. **A relação-chave com CS aparece em cinco pontos:** o par sem/com CRM, o caso, a subárea Cobrança (que passa para CS), o alerta automático ao CSM e a reunião semanal com CS. Em B2C, o mesmo status pausa as ofertas de Marketing, como a dupla de Marketing pediu. O Financeiro marca o atraso e Marketing pausa a oferta. A régua de cobrança continua.
7. **A realidade que faltava:** em B2B, muito atraso não vem de falta de dinheiro. Vem de NF enviada a quem usa o serviço, e não a quem paga, ou de CNPJ errado. Por isso a fatura ganhou o campo "motivo do atraso". O caso e o `feedback` mostram esse dado voltando para uma decisão.
8. **Ajustes menores.** Cada indicador diz de onde sai o número. A rotina do posto 3D trocou "Fechamento e aprovações" (assunto de controladoria) por "Aprovar, faturar e cobrar", com os mesmos móveis da maquete. O texto usa os marcos de Operações ("aceite registrado" e "devolução conferida"). O contrato ganhou o campo "início da cobrança", que diz se a mensalidade começa na assinatura ou no aceite.

---

## 2. Conteúdo final

Números, dias e valores são ilustrativos (o painel marca isso no `scenario`). O caso usa "Dia 10" em vez de horário, porque a cobrança anda em dias.

```ts
{
  id: "financeiro",
  oneLiner: "Aprova crédito e desconto, emite a NF e cobra o pagamento.",
  keyQuestion: "O que foi vendido, com qual desconto e prazo, e já foi pago?",
  withoutCrm: "O CS oferece upgrade a quem tem duas faturas atrasadas: o pagamento só aparece no ERP.",
  withCrm: "O status da fatura aparece na conta: quem fala com o cliente vê o atraso antes.",
  scenario: {
    steps: [
      "Dia 10: vence a fatura de R$ 4.000, e o pagamento não entra.",
      "Dia 11: a conta mostra a fatura vencida; o CSM adia o upgrade.",
      "Dia 15: a cobrança liga; a NF foi para quem usa, não para quem paga.",
      "Dia 16: a cobrança corrige o e-mail na conta, e o cliente paga.",
    ],
    outcome: "O motivo “NF não recebida” fica na fatura e entra no relatório do mês.",
  },
  variants: {
    b2b: "Crédito e prazo por conta; a cobrança fala com o financeiro do cliente.",
    b2c: "Régua automática em alto volume; estorno via SAC; fatura vencida pausa as ofertas de Marketing.",
    small: "Uma pessoa e o contador; quem pagou só aparece no app do banco.",
  },
  brain: {
    objectives: [
      "Aprovar condições antes da assinatura",
      "Faturar certo de primeira",
      "Reduzir inadimplência sem perder clientes",
    ],
    decisions: [
      "Que desconto e prazo o vendedor dá sem aprovação?",
      "Quando bloquear pedidos ou suspender quem atrasou?",
      "Qual causa de atraso corrigir na origem, e com quem?",
    ],
    indicators: [
      { name: "Inadimplência por faixa de atraso", source: "Faturas vencidas, por dias de atraso" },
      { name: "NF refeitas por erro", source: "NF canceladas por cadastro ou valor" },
      { name: "Vendido × faturado", source: "Ganhos no CRM × faturas no ERP" },
    ],
    ritual: "Quinta, com CS: contas com atraso acima de 15 dias.",
    customerImpact: "O cliente paga o combinado, sem cobrança do que já pagou.",
  },
  heart: {
    routine: "Aprovar, faturar e cobrar: monitor largo, bandejas e arquivo.",
    roles: ["Analista de crédito", "Analista de faturamento", "Analista de cobrança", "Coordenador financeiro"],
    dayInLife: [
      { time: "09h", action: "O crédito aprova ou recusa, no CRM, 3 descontos fora da política." },
      { time: "14h", action: "O faturamento emite as NF e devolve 2 vendas com CNPJ errado." },
      { time: "16h", action: "A cobrança liga para quem atrasou e registra a data prometida." },
    ],
    subAreas: [
      {
        id: "credito-aprovacao",
        name: "Crédito e aprovação",
        process: {
          origin: "Oportunidade com desconto ou prazo fora da política",
          decision: "Consultar crédito e histórico; aprovar, ajustar ou recusar",
          output: "Decisão registrada na oportunidade, antes da assinatura",
        },
        handoff: { to: "vendas", object: "Condição aprovada na oportunidade" },
        record: "Oportunidade: desconto, prazo, decisão e aprovador",
        customerImpact: "A condição assinada é a mesma que vem na NF.",
      },
      {
        id: "faturamento",
        name: "Faturamento",
        process: {
          origin: "Oportunidade ganha ou aceite registrado por Operações",
          decision: "Conferir cadastro fiscal e valor contra o contrato",
          output: "NF e boleto ou Pix enviados ao e-mail de cobrança",
        },
        record: "Fatura: nº da NF, valor e vencimento",
        customerImpact: "A NF chega certa, no e-mail de quem paga.",
      },
      {
        id: "cobranca",
        name: "Cobrança",
        process: {
          origin: "Fatura vencida e não paga",
          decision: "Conferir tickets e notas do CSM; negociar data ou acordo",
          output: "Data prometida registrada; status atualizado na conta",
        },
        handoff: { to: "customer-success", object: "Status de pagamento e acordo" },
        record: "Fatura: dias de atraso e motivo",
        customerImpact: "Cobrança e oferta de upgrade não chegam no mesmo dia.",
      },
      {
        id: "estornos",
        name: "Estornos e contestações",
        process: {
          origin: "Ticket de estorno, ou devolução conferida por Operações",
          decision: "Conferir o pagamento; estornar ou descontar na próxima fatura",
          output: "Estorno feito e prazo informado",
        },
        handoff: { to: "atendimento", object: "Desfecho e prazo no ticket" },
        record: "Ticket vinculado à fatura estornada",
        customerImpact: "O cliente pede o estorno uma vez e sabe o prazo.",
      },
    ],
    pitfalls: [
      "Desconto combinado no WhatsApp: a NF sai com o valor cheio.",
      "Pix sem identificação da fatura: a régua segue cobrando quem já pagou.",
      "Cobrar quem contestou a fatura num ticket: o cliente repete tudo.",
    ],
  },
  backbone: {
    crmObjects: [
      {
        object: "Fatura",
        actions: ["cria", "edita"],
        fields: ["status de pagamento", "vencimento", "motivo do atraso", "2ª via"],
      },
      {
        object: "Conta",
        actions: ["vê", "edita"],
        fields: ["CNPJ/CPF", "inscrição estadual/municipal", "endereço", "e-mail de cobrança"],
        owner: "vendas",
      },
      {
        object: "Oportunidade",
        actions: ["vê", "edita"],
        fields: ["desconto", "prazo de pagamento", "aprovação"],
        owner: "vendas",
      },
      {
        object: "Contrato",
        actions: ["vê"],
        fields: ["valor mensal", "início da cobrança", "reajuste"],
        owner: "vendas",
      },
      {
        object: "Ticket",
        actions: ["vê", "edita"],
        fields: ["motivo", "fatura vinculada", "desfecho"],
        owner: "atendimento",
      },
    ],
    criticalField: "CNPJ/CPF da conta: se vier errado, a NF sai para outra empresa e precisa ser refeita.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "falta CNPJ ou inscrição", then: "a oportunidade não fecha como ganha" },
      { when: "a fatura vence sem pagamento", then: "aviso ao cliente e alerta ao CSM" },
      { when: "o ERP registra o pagamento", then: "o CRM mostra “pago” e encerra a régua" },
    ],
    neighborSystems: ["ERP", "Emissor de NF", "Integração bancária", "Gateway de pagamento"],
    feedback: {
      data: "“NF não recebida” lidera os atrasos há 2 meses",
      decision: "Financeiro e RevOps tornam obrigatório o e-mail de quem paga.",
    },
    governance:
      "O ERP é a fonte da fatura; o CRM mostra status, vencimento e 2ª via, sem dado bancário.",
  },
}
```

**Passagens das subáreas:**

| Subárea | Passa para | Objeto |
|---|---|---|
| Crédito e aprovação | **Vendas** | Condição aprovada na oportunidade |
| Faturamento | — (a NF e o boleto/Pix saem para o cliente) | — |
| Cobrança | **CS** (relação-chave) | Status de pagamento e acordo |
| Estornos e contestações | **Atendimento** | Desfecho e prazo no ticket |

**Conferência feita por script.** Usamos o mesmo critério das outras duplas: palavra é o termo com letra ou número, e "×", "→" e "/" não contam.
- Todos os campos estão dentro do máximo do §6.4.
- O objeto e as relações passam no `tsc --strict` com a interface do §6.3 (com `revops` no `DepartmentId`).
- Nas automações, o `when` vem sem "Quando", que o painel exibe antes. A contagem inclui essa palavra. No handoff, a contagem inclui o rótulo da área de destino.
- O texto não usa nenhuma palavra proibida ou condicionada do §8.4 nem nome de software.

| Aba | Financeiro | Exemplo do §6.5 (mesmo critério) | Limite do §6.1 |
|---|---|---|---|
| Visão | 165 (137 a 139 com uma variação visível por vez) | 157 | 110 |
| Brain | 90 | 83 | 90 |
| Heart | 99, + 41 a 44 por subárea aberta | 103 | 100, + 45 por subárea |
| Backbone | 140 (com a coluna Dono) | 123 | 110 |

**Termos novos para o glossário (§8.5):**

| Termo | Definição curta |
|---|---|
| Inadimplência | fatura vencida e não paga |
| Faixa de atraso | grupo de faturas pelo tempo de atraso: até 30 dias, de 31 a 60 dias… |
| 2ª via | nova cópia do boleto ou da NF |
| Estorno | devolução ao cliente de um valor já cobrado |
| Contestação | o cliente discorda de um valor cobrado e pede revisão |
| Cadastro fiscal | dados que a NF exige: CNPJ/CPF, razão social, inscrição e endereço |
| CSM | pessoa de CS responsável por uma carteira de contas |

---

## 3. Relações desta área

São as **5 relações do §5.3** que envolvem o Financeiro (nº 4, 9, 10, 13 e 18). No tipo, "passagem" vira `handoff`. Não criamos relação nova.

```ts
[
  // §5.3 nº 4 · Vendas → Financeiro · passagem (final: object do 06, why do 02, breaks 02 + 06)
  {
    a: "vendas",
    b: "financeiro",
    floor: "heart",
    nature: "handoff",
    object: "Contrato ou pedido ganho + cadastro fiscal → fatura/NF",
    why: "Condição aprovada vira cobrança correta; desconto fora da política é aprovado antes da assinatura.",
    breaks: "NF refeita por CNPJ errado; desconto aparece depois da assinatura.",
  },
  // §5.3 nº 9 · Atendimento → Financeiro · passagem (final: consolidação)
  {
    a: "atendimento",
    b: "financeiro",
    floor: "heart",
    nature: "handoff",
    object: "Solicitação de estorno ou contestação",
    why: "Estorno e contestação sobem com fatura e motivo; a 2ª via simples fica no Atendimento.",
    breaks: "O cliente pede o estorno 3 vezes, e ninguém sabe o status.",
  },
  // §5.3 nº 10 · Operações → Financeiro · passagem (ajuste de Operações: why e breaks)
  {
    a: "operacoes-entrega",
    b: "financeiro",
    floor: "heart",
    nature: "handoff",
    object: "Entrega concluída / aceite; devolução",
    why: "O aceite libera o faturamento; a devolução conferida libera o estorno.",
    breaks: "Faturar antes do aceite; estorno sem devolução, ou parado depois dela.",
  },
  // §5.3 nº 13 · Financeiro → CS · relação-chave (final: why do 05)
  {
    a: "financeiro",
    b: "customer-success",
    floor: "brain",
    floorB: "heart",
    key: true,
    nature: "dependência",
    object: "Status de pagamento / inadimplência",
    why: "Fatura vencida aparece na conta; o CSM pausa ofertas e ajuda a destravar o pagamento.",
    breaks: "Oferta de upgrade a cliente com 2 faturas atrasadas.",
  },
  // §5.3 nº 18 · RevOps – Financeiro · meta compartilhada (final: why e breaks do 08)
  {
    a: "revops",
    b: "financeiro",
    floor: "brain",
    nature: "meta compartilhada",
    object: "Receita do CRM × ERP; custo por origem; comissão",
    why: "O número da reunião comercial bate com o do Financeiro, ou a diferença tem motivo.",
    breaks: "Dois números de receita na diretoria; comissão paga sobre venda não faturada.",
  },
]
```

**Ajustes (antes → depois):**

| # | Relação | Campo | Antes (§5.3) | Depois | Motivo |
|---|---|---|---|---|---|
| 4 | Vendas → Financeiro | `object` | Pedido ganho + cadastro fiscal → fatura/NF | Contrato ou pedido ganho + cadastro fiscal → fatura/NF | No B2B recorrente, a NF de cada mês sai do contrato, que fica no CRM. "Pedido" continua valendo para indústria e varejo. |
| 4 | Vendas → Financeiro | `breaks` | NF errada; desconto descoberto depois da assinatura. | NF refeita por CNPJ errado; desconto descoberto após a assinatura. | "NF errada" é vago. A causa mais comum é o CNPJ, por exemplo o da matriz no lugar do da filial. É o campo crítico do painel. |
| 9 | Atendimento → Financeiro | `why` | Solicitação com fatura e motivo vai a quem resolve. | O Atendimento resolve a 2ª via simples; estorno e contestação sobem com fatura e motivo. | Com a fatura e a 2ª via visíveis no CRM, o Atendimento envia o boleto sem acionar o Financeiro. Mandar toda 2ª via para o Financeiro cria fila e faz o cliente esperar. Sobe só o que muda valor ou data. O `object` não muda. |
| 10 | Operações → Financeiro | `why` e `breaks` | …a devolução **confirmada** libera o estorno. / Faturar antes do aceite; estornar sem devolução. | …a devolução **conferida** libera o estorno. / Faturar antes do aceite; estorno sem devolução, ou parado depois dela. | É a proposta da dupla de Operações (`07_operacoes.md`), adotada sem mudança. O especialista confirma: estorno parado depois da devolução conferida é falha do próprio Financeiro e precisa aparecer. |

**Na consolidação (`09`):**
- **Nº 4:** o `object` daqui foi aceito, o `why` é o de `02`, e o `breaks` junta os dois.
- **Nº 9:** a 2ª via saiu do `object`, porque fica no Atendimento.
- **Nº 10:** confirmada.
- **Nº 13:** recebeu o `why` de `05`.
- **Nº 18:** recebeu o `why` e o `breaks` de `08`.

**Avaliada e não criada: Financeiro → Marketing.** No B2C, a fatura vencida pausa as ofertas. Isso usa o mesmo status de pagamento da nº 13 e já está na automação de Marketing ("Quando há fatura vencida → o contato sai das ofertas até pagar"). Por isso, aparece só na variação B2C, sem cabo novo.

---

## 4. Para validar

1. **Campos que travam a NF.** Confirmar com o fiscal ou o contador quais campos travam a emissão na empresa (NF de produto × NF de serviço, inscrição estadual × municipal) e se a trava no ganho precisa aceitar cliente "isento".
2. **Dias e texto da régua.** Os dias do caso são plausíveis? No texto: alerta ao CSM no 1º dia de atraso, ligação no 5º e reunião com CS acima de 15 dias. O alerta vale para qualquer valor? E quem aprova o texto da régua: o Financeiro, com o tom revisado por Marca & Conteúdo? Esse ponto foi deixado em aberto pela dupla de Marketing.
3. **Tempo da integração ERP → CRM.** O "pago" chega ao CRM no mesmo dia ou no seguinte? Se chegar depois, a régua precisa esperar o registro do pagamento para não cobrar quem já pagou.
4. **Limite de aprovação e bloqueio.** Quem aprova desconto e prazo, e acima de qual limite? A aprovação acontece mesmo no CRM, e não por e-mail ou WhatsApp? Quem decide bloquear pedido ou suspender serviço: o Financeiro sozinho ou junto com CS e, quando preciso, com o Jurídico?
5. **Estorno e 2ª via.** No B2B recorrente, a prática é devolver o dinheiro ou descontar na próxima fatura? Qual prazo se promete ao cliente? O Atendimento tem acesso para enviar a 2ª via sozinho?
