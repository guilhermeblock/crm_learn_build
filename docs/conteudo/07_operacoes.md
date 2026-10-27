# 07 · Operações: Entrega e Implantação

**Projeto:** CRM como Sistema · **Data:** 20/10/2026 · **id:** `operacoes-entrega`
**Dupla:** gerente de implantação de serviços B2B (com um coordenador de logística de e-commerce para a face B2C) + arquiteto de CRM/RevOps.
**Base:** `00_arquitetura_areas.md` (§2, §5.3, §6, §7 e §8). Nenhum código foi alterado.

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - A decisão do `feedback` ganhou ponto final.
> - O `breaks` da nº 3 é o de `02`, que traz o exemplo concreto dos 15 e 40 dias.
> - **Contrato no lugar de Oportunidade** (decisão 4): no 5º objeto, no indicador "Tempo da assinatura ao go-live" e na origem da Implantação. Escopo e prazo prometido moram no Contrato.
>
> **Decidido no `09`:**
> - **Treinamento** (decisão 3): o previsto no escopo é entrega da Implantação, como este arquivo já dizia. Novos usuários e adoção ficam com o CS.
> - **Operações → CS** (decisão 2): não vira a 19ª relação. O handoff da Implantação continua apontando para CS, e o 3D mostra uma ligação temporária com a estação aberta.
> - **Visita técnica** (decisão 14): fica como 4ª subárea.
> - **Pedido** (decisão 4): o dono é Operações. Quem cria é Vendas ou o e-commerce.

---

## 1. O que mudou e por quê

1. **As duas faces viraram subáreas separadas.** "Fulfillment / Entrega" misturava logística e implantação num processo só. Agora há Implantação (`b2b`), Expedição e entrega (`b2c`) e Trocas e devoluções (`b2c`). A Visita técnica fica sem `context`, porque existe nos dois modelos: manutenção de máquina na fábrica e instalação de internet em casa.
2. **Cada face tem seu objeto no CRM.** Projeto de implantação, Ordem de serviço (OS), Pedido e Devolução entram no Backbone. O Contrato de Vendas aparece como origem do escopo e do prazo vendido (na consolidação, trocou a Oportunidade, porque escopo e prazo prometido ficam no Contrato, em `02`).
3. **"Prazo prometido × real" virou o campo crítico.** O prometido fica guardado à parte e não é trocado quando a entrega é replanejada. O especialista lembrou que, se ele é sobrescrito a cada atraso, o relatório mostra tudo no prazo. O campo aparece no pedido, no projeto, num indicador e na decisão "que prazo prometer".
4. **O aceite virou o marco que destrava as outras áreas.** Ele libera a fatura (Financeiro) e passa a conta ao CS, pela automação e pelo handoff da Implantação. Antes, não havia aceite nem go-live.
5. **Rastreio e ocorrência ficam no pedido, à vista do SAC.** O aviso de atraso sai antes de o cliente perguntar. Isso aparece no par Sem/Com CRM, num objetivo, numa automação e no handoff de Expedição.
6. **A fronteira com CS está no painel:** em `variants.b2b`, na saída da Implantação e na 1ª armadilha. Operações entrega o que foi contratado, com aceite; uso e resultado depois disso são do CS. Ajuste do especialista: o treinamento dos usuários-chave previsto no escopo é entrega da Implantação; adoção e novas turmas são do CS.
7. **Saiu o que era genérico ou não era CRM:** "Transforma a promessa comercial em entrega concreta e previsível", "Dados de operação evitam mensagens desconectadas…", "Resolver com o menor esforço…", "Capacidade × demanda" sem fonte, "custo de servir" (assunto de controladoria) e a lista `processes`. Entraram cargos reais, um dia na área, armadilhas e o ritual mensal com Vendas.
8. **Todo indicador diz de onde vem o número, e dois cruzam áreas:** "Tempo da assinatura ao go-live" usa a data de assinatura do contrato (Vendas); "Tickets 'onde está meu pedido'" usa o motivo do ticket (Atendimento).

---

## 2. Conteúdo final

Números, horários e valores são ilustrativos (o painel marca isso no `scenario`).

```ts
{
  id: "operacoes-entrega",
  oneLiner: "Implanta o serviço ou entrega o pedido e atualiza o status.",
  keyQuestion: "O que foi prometido, para quando, e o que vai atrasar?",
  withoutCrm: "O cliente pergunta pelo pedido; o SAC pede à logística e só responde no dia seguinte.",
  withCrm: "A logística registra a ocorrência no pedido; o SAC vê, e o cliente é avisado antes de perguntar.",
  scenario: {
    steps: [
      "Dia 1: contrato assinado; o projeto nasce com go-live prometido em 45 dias.",
      "Dia 20: o acesso ao ERP do cliente atrasa; nova previsão registrada, com motivo.",
      "Dia 52: aceite assinado; fatura de R$ 20 mil liberada; o CS assume a conta.",
    ],
    outcome: "No trimestre, “acesso do cliente” lidera os atrasos; Vendas inclui o pré-requisito na proposta.",
  },
  variants: {
    b2b: "Implantação: projeto com escopo e aceite; depois, uso e resultado são do CS.",
    b2c: "Logística: pedidos em volume, prazo calculado por CEP e trocas voltam pela logística reversa.",
    small: "Uma pessoa embala ou instala; prazo e rastreio ficam na planilha e no WhatsApp.",
  },
  brain: {
    objectives: [
      "Entregar completo e no prazo",
      "Avisar o atraso antes da reclamação",
      "Fechar cada entrega com aceite",
    ],
    decisions: [
      "Que prazo prometer por região, transportadora ou porte de projeto?",
      "Quantos consultores ou turnos para as vendas previstas?",
      "Qual causa de atraso ou devolução atacar primeiro?",
    ],
    indicators: [
      { name: "Entregas no prazo", source: "prometido × real, no pedido ou projeto" },
      { name: "Tempo da assinatura ao go-live", source: "assinatura do contrato × aceite" },
      { name: "Tickets “onde está meu pedido”", source: "motivo do ticket, por transportadora" },
    ],
    ritual: "Reunião mensal com Vendas: forecast × capacidade e prazos estourados.",
    customerImpact: "O que foi prometido chega; se atrasar, o cliente sabe antes.",
  },
  heart: {
    routine: "Expedição e implantação: bancada, caixas e quadro recebido → em execução → entregue.",
    roles: ["Consultor de implantação", "Técnico de campo", "Analista de transportes", "Analista de logística reversa"],
    dayInLife: [
      { time: "08h", action: "O analista de transportes abre ocorrência nos pedidos parados." },
      { time: "11h", action: "O técnico fecha a ordem de serviço (OS) com foto e assinatura." },
      { time: "16h", action: "O consultor registra o go-live e envia o termo de aceite." },
    ],
    subAreas: [
      {
        id: "implantacao",
        name: "Implantação",
        context: "b2b",
        process: {
          origin: "Contrato assinado com escopo e go-live prometido",
          decision: "Configurar, testar e treinar usuários-chave; combinar o go-live",
          output: "Aceite assinado, com pendências listadas",
        },
        handoff: { to: "customer-success", object: "Aceite e pendências do projeto" },
        record: "Projeto de implantação: go-live prometido × real, aceite",
        customerImpact: "O cliente sabe quando entra no ar e o que falta.",
      },
      {
        id: "visita-tecnica",
        name: "Visita técnica",
        process: {
          origin: "Venda ou ticket pede instalação ou reparo",
          decision: "Agendar a visita e separar a peça certa",
          output: "Ordem de serviço fechada, com foto e assinatura",
        },
        handoff: { to: "atendimento", object: "Status e relatório da visita" },
        record: "OS: agenda, técnico, peças, assinatura",
        customerImpact: "O técnico chega na hora marcada, com a peça certa.",
      },
      {
        id: "expedicao-entrega",
        name: "Expedição e entrega",
        context: "b2c",
        process: {
          origin: "Pedido pago, com endereço e prazo prometido",
          decision: "Separar, despachar e tratar ocorrências com a transportadora",
          output: "Pedido entregue, ou ocorrência com novo prazo",
        },
        handoff: { to: "atendimento", object: "Rastreio e ocorrência no pedido" },
        record: "Pedido: status, rastreio, prazo prometido × real",
        customerImpact: "O cliente acompanha o pedido sem precisar ligar.",
      },
      {
        id: "trocas-devolucoes",
        name: "Trocas e devoluções",
        context: "b2c",
        process: {
          origin: "Cliente pede troca ou devolução pelo site ou SAC",
          decision: "Coletar, conferir e decidir: troca, estorno ou recusa",
          output: "Devolução conferida, com motivo e resultado",
        },
        handoff: { to: "financeiro", object: "Devolução conferida para estorno" },
        record: "Devolução: motivo, coleta, conferência, estorno liberado",
        customerImpact: "A troca ou o estorno sai sem o cliente precisar cobrar.",
      },
    ],
    pitfalls: [
      "Sem aceite formal, a implantação não termina e o CS não assume.",
      "OS sem modelo do equipamento: o técnico chega sem peça.",
      "Devolução conferida sem aviso: o estorno atrasa e vira reclamação.",
    ],
  },
  backbone: {
    crmObjects: [
      { object: "Projeto de implantação", actions: ["cria", "edita"], fields: ["go-live prometido × real", "pendências", "aceite"] },
      { object: "Ordem de serviço (OS)", actions: ["cria", "edita"], fields: ["agenda", "técnico", "peças", "assinatura"] },
      { object: "Pedido", actions: ["edita", "vê"], fields: ["status", "rastreio", "ocorrência", "prazo prometido × real"] },
      { object: "Devolução", actions: ["cria", "edita"], fields: ["motivo", "coleta", "conferência", "estorno liberado"] },
      { object: "Contrato", actions: ["vê"], fields: ["escopo", "prazo prometido", "data de assinatura"], owner: "vendas" },
    ],
    criticalField: "O prazo prometido, separado do real. Se ele muda a cada atraso, tudo parece no prazo.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "o aceite é registrado", then: "libera a fatura e avisa o CS" },
      { when: "a previsão passa do prazo prometido", then: "avisa o cliente e o SAC" },
      { when: "a devolução é conferida", then: "libera o estorno ao Financeiro" },
    ],
    neighborSystems: ["Gestão de pedidos", "Sistema de transportes", "Gestão de projetos", "ERP"],
    feedback: {
      data: "Uma transportadora atrasa na mesma região 3 semanas seguidas",
      decision: "Operações aumenta o prazo da região ou troca de transportadora.",
    },
    governance: "Outras áreas veem status e prazo; endereço e telefone, só quem entrega ou atende.",
  },
}
```

**Conferência feita por script.** Palavra é o termo com letra ou número; "×", "→" e "/" não contam.
- Todos os campos estão dentro do máximo do §6.4.
- O objeto passa no `tsc --strict` com a interface do §6.3 (com `revops` no `DepartmentId`).
- Nas automações, o `when` vem sem a palavra "Quando", que o painel exibe antes. A contagem já inclui essa palavra.
- No handoff, a contagem inclui o rótulo da área de destino.

**Orçamento por aba (§6.1):**

| Aba | Esta área | Exemplo do §6.5 (mesmo critério) | Limite |
|---|---|---|---|
| Visão | 153 (126 com uma variação visível por vez) | 157 | 110 |
| Brain | 90 | 83 | 90 |
| Heart | 103, + 42 a 45 por subárea aberta | 103 | 100, + 45 por subárea |
| Backbone | 131 | 123 | 110 |

**Termos novos para o glossário:**

| Termo | Definição curta |
|---|---|
| OS | ordem de serviço: o registro de uma visita técnica |
| Ocorrência | atraso, extravio, avaria ou cliente ausente, registrado no pedido |
| Rastreio | código e eventos que mostram onde o pedido está |
| Logística reversa | o caminho de volta do produto (troca ou devolução) |
| Usuário-chave | pessoa do cliente treinada na implantação para ensinar os colegas |
| Pendência do aceite | item que o cliente aceitou receber depois do go-live |

---

## 3. Relações desta área

Operações continua com as **3 relações do §5.3** (nº 3, 7 e 10). Não criamos relação nova. Os ajustes abaixo são só de texto:

| # | Relação | Campo | Antes | Depois | Motivo |
|---|---|---|---|---|---|
| 3 | Vendas → Operações | `object` | Pedido / escopo → ordem de serviço | Pedido / escopo → projeto, OS ou expedição | O texto antigo só nomeava a forma B2B de serviço. A execução começa de três jeitos: projeto (implantação), OS (visita) e expedição (B2C). |
| 7 | Operações → Atendimento | `object` | Status do pedido / ocorrência | Status do pedido ou da OS / ocorrência | A Visita técnica também passa status ao SAC ("técnico a caminho", "aguardando peça"). |
| 10 | Operações → Financeiro | `why` | …a devolução **confirmada** libera o estorno. | …a devolução **conferida** libera o estorno. | "Conferida" é a etapa da logística reversa que libera o estorno. "Confirmada" pode ser lida como "solicitada". |
| 10 | Operações → Financeiro | `breaks` | Faturar antes do aceite; estornar sem devolução. | Faturar antes do aceite; estorno sem devolução, ou parado depois dela. | O especialista B2C apontou a quebra mais comum para o cliente: o produto já foi conferido e o estorno fica parado, o que gera contato repetido e reclamação pública. A quebra antiga continua no texto. |

```ts
[
  // nº 3 · Vendas → Operações · passagem (final: object do 07, breaks do 02)
  {
    a: "vendas", b: "operacoes-entrega", floor: "heart", nature: "handoff",
    object: "Pedido / escopo → projeto, OS ou expedição",
    why: "Escopo, prazo e endereço vendidos viram execução.",
    breaks: "Vendedor promete prazo de 15 dias; a operação precisa de 40.",
  },
  // nº 7 · Operações → Atendimento · dependência (ajuste: object)
  {
    a: "operacoes-entrega", b: "atendimento", floor: "heart", nature: "dependência",
    object: "Status do pedido ou da OS / ocorrência",
    why: "Rastreio e atraso visíveis para quem atende, antes do cliente perguntar.",
    breaks: "“Onde está meu pedido” lota a fila.",
  },
  // nº 10 · Operações → Financeiro · passagem (ajuste: why e breaks)
  {
    a: "operacoes-entrega", b: "financeiro", floor: "heart", nature: "handoff",
    object: "Entrega concluída / aceite; devolução",
    why: "O aceite libera o faturamento; a devolução conferida libera o estorno.",
    breaks: "Faturar antes do aceite; estorno sem devolução, ou parado depois dela.",
  },
]
```

**Avaliada e não criada: Operações → CS.** O briefing (§7, ponto 3) pede que o aceite libere o onboarding do CS, mas nenhuma das 18 relações liga Operações a CS. Resolvemos dentro do padrão, sem cabo novo:
- o handoff da Implantação aponta para CS ("Aceite e pendências do projeto");
- a automação "Quando o aceite é registrado → libera a fatura e avisa o CS".

**Decidido na consolidação (`09`, decisão 2): fica sem a 19ª relação.**
- Vale a regra nova: um handoff pode existir sem relação fixa, e o 3D mostra uma ligação temporária quando a estação está aberta.
- O handoff da Implantação para CS fica como está.
- O texto abaixo fica guardado, caso o autor queira o cabo fixo no futuro.

O arquiteto preferiu não criar a 19ª relação, porque CS passaria a 7 relações e viraria o ponto mais conectado do prédio. As duas opções avaliadas foram:
- **Se quiser o cabo visível**, o texto pronto (Operações iria a 4 relações e CS a 7) é:

```ts
{
  a: "operacoes-entrega", b: "customer-success", floor: "heart", nature: "handoff",
  object: "Aceite e pendências do projeto",
  why: "O aceite marca a hora de o CS assumir uso e resultado.",
  breaks: "Pendências do aceite ficam sem dono depois do go-live.",
}
```

- **Se preferir que todo handoff tenha relação correspondente**, troque o handoff da Implantação por `{ to: "financeiro", object: "Aceite que libera a fatura" }`. Nesse caso, a passagem ao CS fica só na automação.

---

## 4. Para validar

1. **Faturamento da implantação:** a empresa fatura no aceite final, por marco aceito ou já na assinatura? A mensalidade começa no go-live?
2. **Treinamento:** *decidido no `09` (decisão 3).* O treinamento dos usuários-chave previsto no escopo é da Implantação e entra no aceite. Novos usuários, novas turmas e adoção ficam com o CS.
3. **Estorno na devolução:** em que momento a logística reversa libera o estorno (na coleta, na postagem ou na conferência)? Quantos dias isso leva hoje?
4. **Ocorrências:** chegam da transportadora por integração ou são digitadas? Com que atraso? Qual é a lista fechada de tipos (atraso, extravio, avaria, endereço não encontrado, destinatário ausente)?
5. **Prazo prometido no B2C:** quem mantém a tabela de prazo por CEP (logística ou e-commerce)? O prazo prometido fica gravado no pedido no momento da compra?
