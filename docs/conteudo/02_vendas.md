# 02 · Vendas / Comercial (`vendas`)

**Projeto:** CRM como Sistema · **Data:** 20/10/2026
**Dupla:** Gerente comercial B2B de venda consultiva, que conduz o forecast semanal (especialista, perfil do §7) + Arquiteto de CRM/RevOps (autor do `00_arquitetura_areas.md`).
**Base:** `00_arquitetura_areas.md` (§5.3, §6, §7 e §8) e o conteúdo atual de `src/content/areas.ts`.

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - **Objetos (decisão 4 do `09`):**
>   - "Pedido / contrato" virou **Contrato**, e **Notas de passagem** virou objeto próprio, como em `05`;
>   - **Conta** entrou, porque Vendas é dona dela e do cadastro fiscal;
>   - Atividade e Lead saíram da lista, porque o limite é 5. O Lead continua na subárea Pré-vendas e na relação 1.
> - A automação do ganho agora diz "notas de passagem".
> - Os itens do `dayInLife` começam com maiúscula e terminam com ponto.
> - As aspas internas passaram a ser curvas (“ ”).
> - **Relações:**
>   - a 2 usa o texto de `05`;
>   - a 3 junta o `object` de `07` com o `breaks` daqui;
>   - a 4 junta textos daqui e de `06`;
>   - a 5 foi para o Brain (decisão 9 do `09`).
>
> **Confirmado:** a subárea Expansão de contas fica (decisão 14).

---

## 1. O que mudou e por quê

1. **Etapas com critério de saída.** Antes, o funil não dizia o que é uma etapa, e cada vendedor movia o cartão "por sensação". Agora a regra é: só avança quando isto for verdade.
   - **Entrada:** o lead vira oportunidade quando a reunião confirma dor, decisor e prazo.
   - **Qualificada → Proposta:** escopo e valor estimado validados com o cliente.
   - **Proposta → Negociação:** proposta anexada e apresentada ao decisor.
   - **Negociação → Ganha:** condições aprovadas, contrato assinado e passagem preenchida.
   - **Perdida:** em qualquer etapa, com motivo de lista fechada.

   Nomes e critérios são uma proposta para RevOps configurar. No painel, eles aparecem no cenário, na subárea Executivos, numa armadilha e nas automações.
2. **Campos obrigatórios viraram regra.** Valor, data prevista de fechamento, próximo passo e motivo de perda estão no objeto Oportunidade. A data prevista virou o campo crítico, porque é o campo que mais engana o forecast.
3. **Sales Ops saiu, e o vendedor é o dono da passagem.** No ganho, quem preenche escopo, prazo prometido, cadastro fiscal e notas de passagem é o vendedor. RevOps só desenha o formulário e a trava. A armadilha "ver WhatsApp" mostra que a trava sozinha não resolve.
4. **Desconto aprovado antes da assinatura.** Entrou a alçada: acima dela, o gerente aprova; fora da política, o Financeiro. A proposta só sai com a aprovação registrada. Isso aparece no cenário, no dia do gerente, numa automação e na armadilha do desconto prometido no WhatsApp.
5. **Nova subárea: Parceiros e representantes (B2B).** É a venda de indústria e distribuição no Brasil: a conta tem dono, território, tabela de preço e comissão. O pedido segue para Operações com o prazo prometido.
6. **Nova subárea: Expansão de contas (B2B).** Fecha a oportunidade que o CS abre, mas antes confere se há ticket crítico ou fatura atrasada. A comissão segue uma regra combinada antes, e o aditivo vai ao Financeiro para ajustar a fatura.
7. **B2C corrigido.** E-commerce tem carrinho e pedido, não oportunidade. A venda consultiva B2C (imóveis, carros, cursos e seguros) tem funil com vendedor. Na empresa pequena, o dono vende pelo WhatsApp e o funil costuma ser uma planilha.
8. **Brain com o forecast de verdade.** Saíram "Experiência comercial coerente" e os indicadores sem origem. Entraram a meta, a precisão do forecast e "prometer só o que se entrega", cada indicador com o campo de onde sai, e o ritual do forecast de segunda. Termos novos para o glossário: SDR, alçada, critério de saída e compromisso (commit).

---

## 2. Conteúdo final

> Números, horários e valores são ilustrativos. No painel, o selo "ilustrativo" aparece uma vez, no `scenario`.

```ts
{
  id: "vendas",
  oneLiner: "Qualifica o lead, negocia a oportunidade e registra o que foi combinado.",
  keyQuestion: "Quais oportunidades fecham este mês, e quais estão paradas sem próximo passo?",
  withoutCrm: "Cada vendedor guarda o funil na própria planilha e no WhatsApp; o forecast sai de cabeça.",
  withCrm: "Cada oportunidade mostra valor, data prevista e próximo passo; o forecast sai do funil.",
  scenario: {
    steps: [
      "Dia 1: lead chega às 9h; o SDR liga às 9h40 e agenda reunião.",
      "Dia 4: reunião confirma dor, decisor e prazo; abre oportunidade de R$ 48 mil.",
      "Dia 18: cliente pede 12% de desconto, acima da alçada; o gerente aprova no CRM.",
      "Dia 30: contrato assinado; o vendedor marca ganho e preenche a passagem.",
    ],
    outcome: "No mesmo dia, Operações, Financeiro e CS recebem escopo, desconto e prazo prometido.",
  },
  variants: {
    b2b: "Ciclo de semanas a meses, vários decisores; oportunidade com etapas, proposta e contrato.",
    b2c: "E-commerce gera pedido, sem oportunidade; imóveis, carros, cursos e seguros têm funil com vendedor.",
    small: "O dono vende pelo WhatsApp e faz o pós-venda; o funil costuma ser planilha.",
  },
  brain: {
    objectives: ["Bater a meta de vendas", "Acertar o forecast do mês", "Prometer só o que se entrega"],
    decisions: [
      "Quais oportunidades entram no forecast como compromisso?",
      "O funil cobre a meta, ou falta oportunidade?",
      "Por que perdemos, e o que muda na proposta?",
    ],
    indicators: [
      { name: "Precisão do forecast", source: "forecast semanal × ganho do mês" },
      { name: "Cobertura do funil", source: "valor das oportunidades abertas × meta" },
      { name: "Motivos de perda", source: "campo “motivo de perda” da oportunidade" },
    ],
    ritual: "Forecast de segunda: cada vendedor defende ao gerente as oportunidades que fecham no mês.",
    customerImpact: "O combinado na proposta vale depois da assinatura.",
  },
  heart: {
    routine: "Revisão do funil: quadro de etapas com cartões avançando.",
    roles: ["SDR / pré-vendas", "Executivo de vendas", "Gerente de canais", "Gerente comercial"],
    dayInLife: [
      { time: "09h", action: "O SDR liga e manda WhatsApp aos leads novos." },
      { time: "14h", action: "O executivo registra a reunião e o próximo passo, com data." },
      { time: "17h", action: "O gerente aprova 2 descontos e revisa oportunidades paradas." },
    ],
    subAreas: [
      {
        id: "pre-vendas",
        name: "Pré-vendas (SDR)",
        process: {
          origin: "Lead de Marketing com origem e score",
          decision: "Contatar no SLA; checar perfil, interesse e decisor",
          output: "Reunião agendada, ou lead devolvido com motivo",
        },
        handoff: { to: "marketing-growth", object: "Lead devolvido com motivo" },
        record: "Lead: 1º contato, tentativas, motivo de descarte",
        customerImpact: "Quem pediu contato recebe retorno rápido e sem pressão.",
      },
      {
        id: "executivos",
        name: "Executivos de vendas",
        process: {
          origin: "Oportunidade qualificada: dor, decisor e prazo",
          decision: "Propor só o que cabe na operação e na alçada",
          output: "Ganho com passagem, ou perda com motivo",
        },
        handoff: { to: "customer-success", object: "Contrato e notas de passagem" },
        record: "Oportunidade: etapa, valor, data prevista, próximo passo",
        customerImpact: "Na implantação, ninguém pergunta o que já foi combinado.",
      },
      {
        id: "expansao",
        name: "Expansão de contas",
        context: "b2b",
        process: {
          origin: "Oportunidade de expansão aberta pelo CS",
          decision: "Sem ticket crítico e com faturas em dia? Então propor",
          output: "Aditivo assinado; comissão dividida pela regra combinada",
        },
        handoff: { to: "financeiro", object: "Aditivo para ajustar a fatura" },
        record: "Oportunidade: origem CS, valor, aditivo",
        customerImpact: "Ninguém oferece upgrade a quem está com problema sem solução.",
      },
      {
        id: "parceiros",
        name: "Parceiros e representantes",
        context: "b2b",
        process: {
          origin: "Representante ou revenda registra pedido ou oportunidade",
          decision: "Conta tem dono? Conferir território, preço e prazo de entrega",
          output: "Pedido conferido, com parceiro e comissão registrados",
        },
        handoff: { to: "operacoes-entrega", object: "Pedido com prazo prometido" },
        record: "Pedido: parceiro, território, comissão, prazo prometido",
        customerImpact: "O cliente não recebe dois representantes com preços diferentes.",
      },
    ],
    pitfalls: [
      "Avançar etapa sem critério de saída: o funil incha e o mês não fecha.",
      "Prometer desconto no WhatsApp antes da aprovação: o cliente contesta a NF.",
      "Notas de passagem com “ver WhatsApp”: o CS começa do zero.",
    ],
  },
  backbone: {
    crmObjects: [
      { object: "Oportunidade", actions: ["cria", "edita"], fields: ["valor", "data prevista", "próximo passo", "motivo de perda"] },
      { object: "Proposta", actions: ["cria", "edita"], fields: ["itens do catálogo", "desconto", "aprovação", "validade"] },
      { object: "Contrato", actions: ["cria"], fields: ["escopo", "valor e condição", "prazo prometido", "data de renovação"] },
      { object: "Notas de passagem", actions: ["cria"], fields: ["objetivo do cliente", "promessas", "contatos-chave", "critério de sucesso"] },
      { object: "Conta", actions: ["cria", "edita"], fields: ["CNPJ/CPF", "razão social", "e-mail de cobrança", "dono da conta"] },
    ],
    criticalField: "Data prevista de fechamento: sem revisão, oportunidade parada há meses segue no forecast.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "o vendedor marca perda", then: "exige motivo de lista fechada" },
      { when: "o desconto passa da alçada", then: "a proposta só sai aprovada" },
      { when: "a oportunidade vira ganha", then: "exige notas de passagem; avisa CS, Financeiro e Operações" },
    ],
    neighborSystems: ["ERP", "Assinatura eletrônica", "Canais de mensagem", "Portal de parceiros"],
    feedback: {
      data: "“Prazo de implantação” lidera os motivos de perda do trimestre",
      decision: "Vendas propõe implantação em fases; Operações revê a capacidade.",
    },
    governance: "Representante externo vê só a própria carteira; exportar contatos exige permissão do gestor.",
  },
}
```

**Notas de leitura do objeto**
- `automations`: `when` e `then` preenchem o molde "Quando… → então…" do §6.4, por isso não repetem essas palavras.
- A ordem de `crmObjects` foi escolhida para o `menuLine()`: o capítulo Backbone mostra "Oportunidade · Proposta · Contrato".
- O **Pedido** (indústria, distribuição e varejo) aparece na subárea Parceiros. O dono do Pedido é Operações, e Vendas o cria (decisão 4 do `09`).
- `heart.routine` mantém o formato "rótulo: descrição", porque o `menuLine()` usa o texto antes do ":" ("Revisão do funil").

---

## 3. Relações desta área

As 6 relações do §5.3 que envolvem Vendas (nº 1, 2, 3, 4, 5 e 17). "Passagem" do §5.3 vira `nature: "handoff"`.

```ts
[
  {
    a: "marketing-growth", b: "vendas", floor: "heart", nature: "handoff",
    object: "Lead (MQL) → oportunidade",
    why: "Lead com origem e score, com prazo de resposta; o descarte volta com motivo.",
    breaks: "Lead fica dias sem dono; cada área culpa a outra.",
  },
  {
    a: "vendas", b: "customer-success", floor: "heart", key: true, nature: "handoff",
    object: "Conta + contrato + notas de passagem",
    why: "O que foi prometido na venda chega ao CSM antes da primeira reunião.", // final (05)
    breaks: "O cliente cobra, na primeira reunião, uma integração que ninguém registrou.", // final (05)
  },
  {
    a: "vendas", b: "operacoes-entrega", floor: "heart", nature: "handoff",
    object: "Pedido / escopo → projeto, OS ou expedição", // final (07)
    why: "Escopo, prazo e endereço vendidos viram execução.",
    breaks: "Vendedor promete prazo de 15 dias; a operação precisa de 40.", // final (02)
  },
  {
    a: "vendas", b: "financeiro", floor: "heart", nature: "handoff",
    object: "Contrato ou pedido ganho + cadastro fiscal → fatura/NF", // final (06)
    why: "Condição aprovada vira cobrança correta; desconto fora da política é aprovado antes da assinatura.", // final (02)
    breaks: "NF refeita por CNPJ errado; desconto aparece depois da assinatura.", // final (02 + 06)
  },
  {
    a: "customer-success", b: "vendas", floor: "brain", nature: "meta compartilhada", // final: foi para o Brain (decisão 9)
    object: "Oportunidade de expansão + regra de comissão",
    why: "CS identifica, Vendas fecha; meta e comissão da expansão são combinadas antes.",
    breaks: "Disputa de comissão; vendedor oferece upgrade a conta em crise.",
  },
  {
    a: "revops", b: "vendas", floor: "brain", nature: "meta compartilhada",
    object: "Etapas do funil + forecast",
    why: "Critério de saída igual para todos torna o forecast confiável.", // final (02)
    breaks: "Forecast vira chute; cada vendedor usa um critério.",
  },
]
```

**Na consolidação:**
- **Nº 5:** saiu do Heart e foi para o Brain como meta compartilhada (decisão 9 do `09`). A disputa real da expansão é de meta e de comissão, e isso é assunto de Brain. No Heart, a passagem continua nas estações: Renovação e expansão (CS) → Vendas, e Expansão de contas (Vendas). A estação mostra uma ligação temporária quando está aberta. Com isso, as curvas 2 e 5 deixam de se sobrepor.
- **Nº 2:** usa o texto de `05`.
- **Nº 3:** usa o `object` de `07`.
- **Nº 4:** usa o `object` de `06` e junta os dois `breaks`. "CNPJ errado" é o campo crítico de Financeiro e de RevOps.

**Ajustes propostos (antes → depois).** Nenhuma relação nova; só texto.

| # | Relação · campo | Antes | Depois | Motivo |
|---|---|---|---|---|
| 3 | Vendas → Operações · `breaks` | "Prazo prometido que a operação não tem." | "Vendedor promete prazo de 15 dias; a operação precisa de 40." | O §8.6 pede exemplo concreto em `breaks`. A cena mostra quem promete e quem não consegue cumprir. |
| 4 | Vendas → Financeiro · `why` | "…desconto fora da política pede aprovação antes." | "…desconto fora da política é aprovado antes da assinatura." | "Antes" ficava solto. O momento que importa é a assinatura, que é onde a falha acontece. |
| 4 | Vendas → Financeiro · `breaks` | "NF errada; desconto descoberto depois da assinatura." | "Cadastro incompleto trava a NF; desconto aparece depois da assinatura." | "NF errada" é o efeito. Do lado de Vendas, a causa mais comum é o cadastro fiscal incompleto (§5.2). |
| 17 | RevOps – Vendas · `why` | "Critério igual de etapa torna a previsão confiável." | "Critério de saída igual para todos torna o forecast confiável." | Usa os mesmos termos do painel e do glossário: "critério de saída" e "forecast". |

---

## 4. Para validar

1. **Quem aprova o desconto.** Confirmar a escada real de alçada (vendedor → gerente → diretoria) e o papel do Financeiro. Em muitas empresas, o Financeiro aprova prazo de pagamento e crédito, mas não o percentual de desconto. A relação Vendas → Financeiro depende dessa resposta.
2. **Etapas e critérios de saída.** Validar os nomes e os critérios com quem conduz forecast semanal. Conferir também se servem à venda consultiva B2C, em que o ciclo é de dias (imóveis, cursos).
3. **Expansão dentro de Vendas.** Confirmar com CS e RevOps quem fecha o upsell e como a comissão se divide. Em contas pequenas, o próprio CS costuma fechar. Se essa for a regra da empresa-modelo, a subárea pode sair.
4. **Pedido do representante.** Na indústria, confirmar se o pedido passa antes por uma "administração de vendas" ou vai direto ao crédito do Financeiro. Confirmar também se o objeto principal do parceiro é o pedido ou a oportunidade registrada por ele.
5. **Números do cenário.** Retorno ao lead em 40 minutos, 12% de desconto e 30 dias para fechar R$ 48 mil precisam soar plausíveis para um gerente comercial. O prazo de retorno precisa bater com o SLA que Marketing definir.
