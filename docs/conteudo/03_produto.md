# 03 · Produto / Oferta (`produto`)

**Projeto:** CRM como Sistema · **Data:** 20/10/2026
**Dupla:** Product Manager de SaaS B2B que prioriza com dado de suporte e de uso (variação de varejo ouvida com um gerente de categoria) + arquiteto de CRM/RevOps.
**Base:** `00_arquitetura_areas.md` (§5.3, §6, §7 e §8). Nenhum código foi alterado.

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - **Indicador** (decisão 15): "Tempo até o primeiro valor" virou "Tempo até ativar". O "primeiro valor" é marco de CS, e "ativou" é evento de Produto: são duas medidas diferentes, uma depois da outra.
> - **Relação 16:** ganhou texto novo, pela mesma razão.
> - **Automações:** duas foram reescritas para ler bem no molde "Quando… → então…".
> - **`dayInLife`:** os itens começam com maiúscula.
>
> **Decidido:**
> - Produto é dono do catálogo e o cadastra (decisão 12).
> - Handoff sem relação fixa é permitido: o 3D mostra uma ligação temporária com a estação aberta (decisão 2).
> - As frases do guiado estão no `09`.

> Produto é a área guiada: quem não escolhe nada acompanha Produto nos 3 andares. Por isso, o texto repete de propósito um mesmo fio, o pedido de melhoria que entra pela conta, vira prioridade e volta para quem pediu.

---

## 1. O que mudou e por quê

1. **Recorte honesto.** Antes: "desenvolve a proposta de valor", sem dizer o que Produto faz no CRM. Agora são três usos reais: lê pedidos de melhoria e motivos (de ticket e de perda), envia 3 eventos de uso e publica o catálogo. *PM: "Eu não vivo no CRM. Eu leio o que CS, Vendas e Atendimento registram."*
2. **Pedido de melhoria virou objeto**, ligado à conta, com tema de lista fechada, status, receita e data de renovação. O caso "12 contas pediram, 4 renovam no trimestre" virou o `scenario`. O nome aparece sempre completo, para não confundir com o "Pedido" de Operações (§8.8).
3. **Três eventos de uso, cada um com quem consome:** "ativou" (configuração concluída) vai para a régua de Marketing; "parou de usar" (14 dias sem acesso) vira tarefa de risco para CS; "convidou colega" vira PQL só em autoatendimento. O PQL ficou como contexto, numa automação, e não como regra nem como relação.
4. **Subáreas pelo que entregam, não por cargo.** PM, UX e Analytics descreviam um organograma. Agora: Voz do cliente → CS · Uso e ativação → Marketing · Catálogo e preços → Vendas. Os cargos foram para `roles`.
5. **Cortes.** Saíram feature flags, "event tracking" e a lista de `processes`. *Arquiteto:* o CRM recebe só os 3 eventos combinados, e não cada clique. Isso virou armadilha e cuidado de governança.
6. **"Oferta" ganhou corpo.** Catálogo com preço de tabela e vigência, definido com Financeiro, e o plano antigo bloqueado para venda. Variações concretas: varejo (Compras e Categoria olham a troca por item) e serviços (cada pacote vira item do catálogo).
7. **O ciclo fecha na conta.** O status do pedido de melhoria volta para a conta, e CS avisa quem pediu. Era o elo que faltava; aparece no `withCrm`, numa subárea, numa armadilha e no desfecho do caso.
8. **Guiado e glossário.** Sugestão para `chapters.ts` (fora deste arquivo): Brain → "Produto: construir o que mais clientes precisam e ativar contas novas mais rápido."; Backbone → "Produto envia os eventos “ativou” e “parou de usar”, que Marketing e CS usam." Termos novos para `glossary.ts`: roadmap (o que o produto vai construir, e em que ordem), pedido de melhoria, evento de uso, primeiro valor, PQL (lead que nasce do uso do produto) e preço de tabela.

---

## 2. Conteúdo final

> Números, prazos e horários são ilustrativos (o painel marca isso uma vez, no `scenario`).

```ts
{
  id: "produto",
  oneLiner: "Soma pedidos de melhoria, decide o que mudar e publica o catálogo.",
  keyQuestion: "Quantas contas pediram esta melhoria, quanto pagam e quando renovam?",
  withoutCrm:
    "Pedidos de melhoria chegam por e-mail, WhatsApp e reunião; ganha prioridade quem reclamou mais alto.",
  withCrm: "Cada pedido de melhoria fica na conta, com tema: dá para somar e avisar quem pediu.",
  scenario: {
    steps: [
      "9h, revisão mensal: o filtro mostra 12 contas pedindo “relatório para o contador”.",
      "9h10: 4 delas renovam no próximo trimestre; o tema ganha prioridade.",
      "9h30: a melhoria entra no roadmap; os 12 pedidos de melhoria viram “planejado”.",
      "6 semanas depois: a melhoria sai; o CS avisa as 12 contas.",
    ],
    outcome: "Status “entregue” fica nas contas: CS leva à renovação; Produto mede o uso.",
  },
  variants: {
    b2b: "SaaS: CS e Vendas registram pedidos de melhoria. Serviços: cada pacote vira item do catálogo.",
    b2c: "Varejo: Compras e Categoria veem o motivo de troca por item e ajustam o sortimento.",
    small: "O fundador é o Produto; os pedidos de melhoria ficam no WhatsApp dele.",
  },
  brain: {
    objectives: [
      "Construir o que mais clientes precisam",
      "Ativar contas novas mais rápido",
      "Reduzir tickets causados pelo produto",
    ],
    decisions: [
      "Qual tema entra no roadmap, pesando contas e receita?",
      "Em que passo a conta nova trava?",
      "Qual motivo de perda pede mudar plano ou preço?",
    ],
    indicators: [
      { name: "Receita por tema", source: "pedidos de melhoria × receita da conta" },
      { name: "Tempo até ativar", source: "início da conta × evento “ativou”" },
      { name: "Tickets causados pelo produto", source: "motivo do ticket, grupo “produto”" },
    ],
    ritual: "Revisão mensal: Produto, CS e Atendimento olham os temas mais pedidos.",
    customerImpact: "A melhoria que mais clientes precisam sai primeiro.",
  },
  heart: {
    routine: "Priorização do roadmap: mesa alta e quadro agora / próximo / depois.",
    roles: ["Product Manager (PM)", "Product Designer", "Product Analyst", "Gerente de categoria (varejo)"],
    dayInLife: [
      { time: "09h", action: "O PM agrupa por tema os pedidos de melhoria." },
      { time: "11h", action: "O designer entrevista 3 contas que fizeram o mesmo pedido de melhoria." },
      { time: "16h", action: "O analista confere se o evento “ativou” chegou ao CRM." },
    ],
    subAreas: [
      {
        id: "voz-do-cliente",
        name: "Voz do cliente",
        process: {
          origin: "Pedidos de melhoria, motivos de ticket e de perda",
          decision: "Priorizar o tema por contas e receita",
          output: "Tema no roadmap e status atualizado",
        },
        handoff: { to: "customer-success", object: "Status do pedido de melhoria" },
        record: "Pedido de melhoria: conta, tema, status",
        customerImpact: "Quem pediu sabe em que pé está a melhoria.",
      },
      {
        id: "uso-ativacao",
        name: "Uso e ativação",
        process: {
          origin: "Contas novas param no meio da configuração",
          decision: "Definir quando a conta “ativou”",
          output: "Eventos “ativou”, “convidou colega” e “parou de usar” na conta",
        },
        handoff: { to: "marketing-growth", object: "Evento de uso por conta" },
        record: "Evento de uso: conta, tipo, data",
        customerImpact: "Quem já configurou não recebe e-mail pedindo isso.",
      },
      {
        id: "catalogo-precos",
        name: "Catálogo e preços",
        process: {
          origin: "Plano novo ou mudança de preço",
          decision: "Fechar com Financeiro preço de tabela e vigência",
          output: "Catálogo atualizado; plano antigo bloqueado para venda",
        },
        handoff: { to: "vendas", object: "Catálogo de planos e preços" },
        record: "Item do catálogo: preço, vigência, status",
        customerImpact: "A proposta chega com o preço que vale hoje.",
      },
    ],
    pitfalls: [
      "Entregar a melhoria sem mudar o status: quem pediu não fica sabendo.",
      "Mandar todo clique para o CRM: ninguém acha os eventos que importam.",
      "Lançar plano novo sem bloquear o antigo: Vendas segue vendendo o antigo.",
    ],
  },
  backbone: {
    crmObjects: [
      { object: "Pedido de melhoria", actions: ["cria", "edita"], fields: ["conta", "tema", "status", "receita e renovação"] },
      { object: "Evento de uso", actions: ["cria"], fields: ["conta", "tipo", "data"] },
      { object: "Item do catálogo", actions: ["cria", "edita"], fields: ["preço de tabela", "vigência", "status"] },
      { object: "Ticket", actions: ["vê"], fields: ["motivo", "conta", "status"], owner: "atendimento" },
      { object: "Oportunidade", actions: ["vê"], fields: ["motivo de perda", "valor", "itens do catálogo"], owner: "vendas" },
    ],
    criticalField:
      "O tema do pedido de melhoria, de uma lista fechada. Sem ele, ninguém soma contas nem receita.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "a conta conclui a configuração (“ativou”)", then: "a régua para de pedir isso" },
      { when: "passam 14 dias sem acesso (“parou de usar”)", then: "tarefa de risco ao CS" },
      { when: "uma conta gratuita convida 3 colegas", then: "vira PQL para Vendas (só em autoatendimento)" },
    ],
    neighborSystems: ["Analytics de produto", "Roadmap e feedback", "ERP"],
    feedback: {
      data: "40 tickets no mês: “erro ao importar planilha”",
      decision: "A correção da importação passa à frente no roadmap.",
    },
    governance:
      "Eventos de uso entram com finalidade definida; Produto vê o motivo do ticket, não a conversa.",
  },
}
```

**Ordem dos objetos:** os 3 primeiros (`Pedido de melhoria · Evento de uso · Item do catálogo`) foram escolhidos para a linha do menu do Backbone, que vai usar `crmObjects.slice(0, 3)` no lugar de `signals`.

**Tamanhos (conferidos por script):** todos os campos estão dentro do §6.4. Por aba: Visão 158 · Brain 88 · Heart 100 (+ 42 a 43 por subárea aberta) · Backbone 131. Visão e Backbone passam do orçamento do §6.1, como o próprio exemplo de Atendimento do §6.5 (157 e 117 pelo mesmo critério). Sugestão para a fase de código: `variants` em abas e `scenario` recolhido.

---

## 3. Relações desta área

Produto continua com **3 relações** do §5.3 (#11, #14 e #16), de propósito: é uma área que mais lê do que passa trabalho adiante.

```ts
[
  {
    a: "produto", b: "marketing-growth", floor: "heart", nature: "dependência",
    object: "Evento de uso (ativou / parou de usar)",
    why: "O uso real decide a próxima mensagem da régua de ativação.",
    breaks: "E-mail pede uma ação que o cliente já fez.",
  },
  {
    a: "atendimento", b: "produto", floor: "heart", floorB: "brain", key: true, nature: "feedback",
    object: "Motivos de ticket + pedidos de melhoria por conta",
    why: "Volume por motivo e receita das contas afetadas priorizam o roadmap.",
    breaks: "Motivo em texto livre; ninguém consegue somar.",
  },
  {
    a: "produto", b: "customer-success", floor: "brain", nature: "meta compartilhada",
    object: "Evento “ativou” e marco de primeiro valor da conta", // final (09, decisão 15)
    why: "O evento “ativou” de Produto é o primeiro passo do primeiro valor que CS acompanha.",
    breaks: "Produto comemora a ativação; CS vê a conta sem resultado.",
  },
]
```

**Nº 16, final (consolidação).** O texto proposto aqui ("medem adoção pelo mesmo evento “ativou”") batia de frente com `05`, que mede o primeiro valor a partir de um marco de CS. Ficaram duas medidas em sequência:
1. Produto mede o **tempo até ativar** (configuração concluída).
2. CS mede o **tempo até o primeiro valor** (primeiro resultado concreto).

A relação mostra que uma depende da outra.

**Ajustes (antes → depois)**

| # | Campo | Antes | Depois | Motivo |
|---|---|---|---|---|
| 11 | `object` | Evento de uso (ativou / parou) | Evento de uso (ativou / parou de usar) | um nome por evento no projeto todo (§8.8) |
| 16 | `why` | Adoção é meta das duas áreas. | Produto e CS medem adoção pelo mesmo evento “ativou” da conta. | a frase antiga não passa no teste da troca (serve para qualquer par de áreas); a nova diz qual dado as duas compartilham |

A #14 (★) fica igual. *PM:* "É exatamente a reunião que eu faço todo mês."

**Consideradas e não criadas**
- **Produto → Vendas** (catálogo e preços; PQL). É real, porque toda proposta usa o catálogo. Mas Vendas iria a 7 relações e voltaria ao centro do prédio. O catálogo fica como `handoff` da subárea Catálogo e preços, e o PQL como automação de contexto (só em autoatendimento).
- **Produto → CS no Heart** (aviso de melhoria entregue). CS também iria a 7. O aviso fica como `handoff` da subárea Voz do cliente, e a meta comum continua na #16.
- **Produto – Financeiro** (preço de tabela). Aparece no processo da subárea ("fechar com Financeiro"), mas não passa um registro novo entre as áreas.
- **Produto – Operações** (a antiga #8) continua cortada.

**Atenção para o 3D: resolvido na consolidação (decisão 2 do `09`).** Um handoff pode existir sem relação fixa.
- Com a estação aberta, o 3D mostra uma ligação temporária até a coluna de destino.
- Quando existe uma relação para o mesmo par, em qualquer andar, a estação acende essa relação.

Para Produto, isso significa:
- Catálogo e preços → Vendas: só a ligação temporária.
- Voz do cliente → CS: acende a nº 16, no Brain.

A Ouvidoria → Marketing usa a nº 8, que agora tem os dois sentidos.

---

## 4. Para validar

1. **Quem cadastra o catálogo no CRM.** *Decidido no `09` (decisão 12):*
   - Produto é dono do item do catálogo e o cadastra.
   - Financeiro aprova o preço de tabela.
   - RevOps só monta a estrutura: campos e a trava que impede vender um item vencido.

   Em empresa pequena, quem cadastra costuma ser o administrador do CRM, a pedido de Produto.
2. **Os gatilhos dos 3 eventos.** "14 dias sem acesso" e "3 colegas convidados" são ilustrativos. Um PM de SaaS e um CSM devem confirmar se são esses os eventos que Marketing, CS e Vendas usam de fato.
3. **Onde fica o pedido de melhoria.** Pode ficar no CRM ou numa ferramenta de feedback integrada que mostra a receita e a renovação da conta. O texto vale nos dois casos, mas vale confirmar quem registra mais: CS, Vendas ou Atendimento.
4. **Varejo.** Um gerente de categoria deve confirmar que usa o motivo de troca por item, que vem do SAC e da logística reversa, e não só a venda por item no ERP.
5. **Avisar quem pediu.** Confirmar quem avisa (CS, automação ou nota de versão) e se isso acontece na prática, sem virar promessa de prazo ao cliente.
