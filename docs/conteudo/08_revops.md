# 08 · RevOps: Operações de Receita e Dados

**Projeto:** CRM como Sistema · **Data:** 20/10/2026 · **id:** `revops` (substitui `marca-comunicacao` na 8ª coluna)
**Dupla:** Gerente de RevOps de empresa média B2B, ex-administrador de CRM com integração CRM–ERP (especialista) + arquiteto de CRM/RevOps (autor do `00_arquitetura_areas.md`).
**Base:** §3, §5.3, §6, §7 (briefing RevOps) e §8 do documento-guia. Nenhum código foi alterado.

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - **Formato dos blocos `ts`:** deixaram de ser `const … =` e ficaram no mesmo formato dos outros arquivos.
> - **Estação Integrações e acesso:** fala em "venda ganha" e em "contrato ou pedido", porque no B2B recorrente a fatura sai do contrato. O handoff da estação para Marketing usa "Regras do lead e opt-out".
> - **Fatura:** o campo "pedido" virou "contrato ou pedido de origem".
> - **Relações:**
>   - a nº 12 junta o prazo daqui com o opt-out de `01`;
>   - a nº 17 usa o texto de `02`, que diz o mesmo;
>   - a nº 18 fica com o texto daqui.

---

## 1. Por que essa área existe

1. **O problema real:** 7 áreas usam o CRM, mas ninguém é dono das regras. Cada uma cria campo, etapa e relatório do seu jeito, e em poucos meses o número oficial volta para a planilha.
2. **O que é RevOps, em uma linha:** o time que define as regras do CRM e cuida do dado. Combina com as áreas etapas, campos obrigatórios, distribuição de leads, prazos e acessos, e vigia duplicados, campos vazios e a integração com o ERP.
3. **O que ela absorve (§3):** Sales Ops, Marketing Ops, CS Ops, a administração do CRM, BI/Dados (a subárea "Dados e relatórios") e a parte de integrações e acesso que toca o CRM. TI e Jurídico/DPO apoiam de fora do prédio.
4. **Não é dona do cliente:** não vende, não atende, não cobra. No caso da Visão, quem liga para os 40 leads é Vendas; RevOps só conserta a regra que os deixou parados.
5. **Também não é dona do dado:** quem registra corrige. RevOps aponta o campo vazio e cobra o dono; só corrige em massa (duplicados, importação). Corrigir no lugar dos outros está nas armadilhas.
6. **Não é o centro do prédio:** a regra nasce de acordo entre as áreas e é aprovada no comitê mensal pelos líderes delas. RevOps mantém só as 3 relações do §5.3, e a estação "Administração do CRM" não aponta para área nenhuma.
7. **Reforça a tese "tecnologia não corrige operação":** diante de um problema, a 1ª pergunta de RevOps é "qual regra ninguém combinou?", e não "qual ferramenta comprar?". No caso, o CRM fez o que estava configurado; o conserto foi de processo (o aviso de desligamento).
8. **Por que ocupa a coluna de Marca:** Marca não cria nem consulta registro. RevOps é quem mais mexe na estrutura do CRM sem falar com o cliente. Em B2C, o "time de CRM" que dispara a régua continua em Marketing; a face B2C de RevOps é o "CRM & BI" da base única por CPF.

---

## 2. Conteúdo final

```ts
// Entra em AREA_CONTENT com a chave "revops" (substitui "marca-comunicacao").
// Números e horários são ilustrativos: o selo aparece uma vez, no scenario.
{
  id: "revops",
  oneLiner: "Define as regras do CRM e cuida do dado, sem atender clientes.",
  keyQuestion: "Onde o dado está vazio, duplicado ou fora da regra, e por quê?",
  withoutCrm: "Cada área mantém sua planilha, e a reunião começa discutindo qual número de receita vale.",
  withCrm: "A regra combinada entre as áreas vira campo obrigatório, e a reunião começa pelo mesmo número.",
  scenario: {
    steps: [
      "Segunda, 8h30: o painel mostra 40 leads sem contato há 2 dias.",
      "9h: RevOps vê que a regra ainda manda leads a um vendedor que saiu.",
      "10h: o gerente comercial redistribui os 40; os vendedores ligam no mesmo dia.",
      "11h: RevOps corrige a regra e passa a receber aviso de desligamento.",
    ],
    outcome: "A causa fica no histórico da regra e entra na pauta do comitê mensal.",
  },
  variants: {
    b2b: "Em geral nasce de Sales Ops: funil, forecast, comissão e integração com o ERP.",
    b2c: "Costuma se chamar “CRM & BI”: junta clientes de loja, site e app por CPF.",
    small: "O gerente comercial “cuida do CRM” nas horas vagas; as regras raramente estão escritas.",
  },
  brain: {
    objectives: [
      "Ter um só número de receita",
      "Manter cadastro completo, sem duplicados",
      "Deixar o CRM fácil de preencher",
    ],
    decisions: [
      "Qual campo vazio ou regra ignorada atacar primeiro?",
      "Campo novo compensa o tempo de quem preenche?",
      "Qual o critério de saída de cada etapa?",
    ],
    indicators: [
      { name: "Campos-chave vazios", source: "oportunidades sem valor ou data prevista" },
      { name: "Cadastros duplicados", source: "cadastros com CNPJ ou CPF repetido" },
      { name: "Receita CRM × ERP", source: "oportunidades ganhas × NF emitidas" },
    ],
    ritual: "Comitê mensal: líderes das áreas veem campos vazios e aprovam mudanças.",
    customerImpact: "O cliente fala com um vendedor só e recebe a NF certa.",
  },
  heart: {
    // menuLine() usa o trecho antes dos dois-pontos: "Demandas e limpeza de base"
    routine: "Demandas e limpeza de base: mesa com dois monitores, fila e duplicados.",
    roles: ["Gerente de RevOps", "Analista de RevOps", "Administrador de CRM", "Analista de BI"],
    dayInLife: [
      { time: "08h30", action: "O administrador mescla 15 contas duplicadas pelo CNPJ." },
      { time: "11h", action: "Vendas pede o campo “concorrente”; RevOps mostra dois parecidos." },
      { time: "16h", action: "Dá acesso ao vendedor novo e tira de quem saiu." },
    ],
    subAreas: [
      {
        id: "admin-crm",
        name: "Administração do CRM",
        process: {
          origin: "Demanda de novo campo, etapa ou relatório",
          decision: "Reaproveitar o que existe ou criar algo útil a todos",
          output: "Mudança testada e publicada com aviso, ou recusada com motivo",
        },
        // sem handoff, de propósito: a mudança vale para todos que usam o objeto
        record: "Histórico: o que mudou, quem e quando",
        customerImpact: "O cliente não responde duas vezes à mesma pergunta.",
      },
      {
        id: "regras-passagens",
        name: "Regras e passagens",
        process: {
          origin: "Lead fica dias sem contato; cada área culpa outra",
          decision: "Combinar com as áreas critério, prazo e campo obrigatório",
          output: "Regra no CRM, com trava ou alerta",
        },
        handoff: { to: "marketing-growth", object: "Regras do lead e opt-out" },
        record: "Regra: critério, destino, prazo e versão",
        customerImpact: "Quem pediu contato recebe resposta no prazo combinado.",
      },
      {
        id: "dados-relatorios",
        name: "Dados e relatórios",
        process: {
          origin: "Sexta, antes do forecast de segunda",
          decision: "Apontar a cada vendedor campos vazios e oportunidades paradas",
          output: "Painel conferido para a reunião",
        },
        handoff: { to: "vendas", object: "Painel de funil e forecast" },
        record: "Painel: fonte e definição de cada número",
        customerImpact: "Quem já recusou a proposta deixa de receber ligação.",
      },
      {
        id: "integracoes-acesso",
        name: "Integrações e acesso",
        process: {
          origin: "Venda ganha não chega ao ERP",
          decision: "Achar o erro: campo vazio, código errado, integração parada",
          output: "Registro reenviado; causa corrigida para os próximos",
        },
        handoff: { to: "financeiro", object: "Contrato ou pedido para faturar" },
        record: "Erro de integração: registro, campo e status",
        customerImpact: "A NF sai no prazo, sem o cliente precisar pedir.",
      },
    ],
    pitfalls: [
      "Trocar de CRM sem combinar a regra: o problema vai junto.",
      "Criar campo a cada demanda: logo ninguém sabe qual preencher.",
      "Corrigir o dado no lugar do dono: na semana seguinte, o erro volta.",
    ],
  },
  backbone: {
    crmObjects: [
      { object: "Etapa do funil", actions: ["cria", "edita"], fields: ["critério de saída", "campos obrigatórios", "prazo na etapa"] },
      { object: "Regra de distribuição", actions: ["cria", "edita"], fields: ["critério", "destino", "SLA"] },
      { object: "Perfil de acesso", actions: ["cria", "edita"], fields: ["leitura", "edição", "exportação"] },
      { object: "Conta", actions: ["vê", "edita"], fields: ["CNPJ", "dono", "segmento"], owner: "vendas" },
      { object: "Fatura", actions: ["vê"], fields: ["valor", "emissão", "contrato ou pedido de origem"], owner: "financeiro" },
    ],
    criticalField: "O CNPJ ou CPF validado: sem ele, nascem duplicados e a venda trava no ERP.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "o CNPJ já existe", then: "bloqueia e abre o existente" },
      { when: "um usuário é desativado", then: "seus leads voltam ao gerente" },
      { when: "falta cadastro fiscal no “ganho”", then: "trava e mostra o que falta" },
    ],
    neighborSystems: ["ERP", "BI", "Automação de marketing"],
    feedback: {
      data: "12 oportunidades “ganhas” sem NF no mês",
      decision: "Vendas e Financeiro decidem: “ganho” só com assinatura.",
    },
    governance: "Acesso por perfil; exportar exige aprovação; prazo de guarda e consentimento seguem regra do Jurídico.",
  },
}
```

### Notas da dupla

- **A rotina real vem primeiro** (especialista): o dia de RevOps é fila de demandas e limpeza de base. Por isso a rotina, o "um dia" e as armadilhas falam de campo novo, duplicado e acesso, e não de estratégia.
- **Nada de centro** (arquiteto): "Administração do CRM" não tem `handoff`, porque a mudança vale para todos que usam o objeto. Apontar para uma área só seria falso, e apontar para todas desenharia um hub. As outras 3 estações apontam só para as áreas das 3 relações.
- **Quem registra corrige** (especialista): em "Dados e relatórios", RevOps aponta o campo vazio ao vendedor, e não preenche por ele. A 3ª armadilha diz o mesmo.
- **A tese no caso** (arquiteto): o CRM obedeceu à regra configurada. O erro foi de processo (ninguém avisou RevOps do desligamento), e o conserto que fica é o aviso, com a automação do usuário desativado de reforço.
- **Um nome por objeto (§8.8):** pedido de mudança virou "demanda", porque "pedido" já é o objeto de venda. O resto segue o glossário: lead, oportunidade, conta, NF.
- **Glossário (§8.5):** acrescentar "RevOps: time que define as regras do CRM e cuida do dado" e "Sales Ops: a mesma função, só para Vendas".

### Conferência de tamanhos (§6.4) e de leitura (§6.1)

Contagem por espaços. Números, `×` e `&` contam como palavra; o horário do `dayInLife` conta 1. Todos os campos estão dentro do limite.

| Aba | Campos (palavras / limite) | Leitura da aba |
|---|---|---|
| Visão | oneLiner 12/12 · keyQuestion 13/14 · sem CRM 15/20 · com CRM 16/20 · passos 12, 14, 13, 12 (/15) · desfecho 14/15 · variações 14, 15, 14 (/15) | 164/110 |
| Brain | objetivos 6, 5, 6 (/6) · decisões 8, 8, 8 (/12) · indicadores: nome até 4/5, fonte até 6/8 · ritual 11/15 · cliente 12/15 | 89/90 |
| Heart | rotina 12/12 · cargos 3 (/4) · um dia 8, 9, 10 (/12) · nomes 3/3 · armadilhas 11, 10, 13 (/14) | 100/100 |
| Heart (subárea aberta) | processo até 10/10 · passagem com a área até 6/6 · registro até 7/8 · cliente até 10/12 | 43, 45, 42 e 45 (/45) |
| Backbone | 5 objetos × 3 campos · campo crítico 15/18 · automações 11, 11, 13 (/14, contando "Quando… então…") · sistemas até 3/3 · retorno 7/10 + 8/12 · cuidado 15/18 | 110/110 |

**Visão acima de 110:** com 4 passos no caso, a soma dos campos passa do orçamento. O exemplo de Atendimento do §6.5, medido do mesmo jeito, dá 157. Se o painel mostrar tudo sem clique, a saída é usar 3 passos no `scenario` (cai para cerca de 150).

---

## 3. Relações desta área

São as 3 relações do §5.3 que envolvem RevOps (nº 12, 17 e 18). Os andares e a natureza não mudam, nenhuma é chave (`key`) e não entra relação nova.

```ts
[
  // nº 12 · final: prazo combinado (08) + opt-out (01)
  {
    a: "revops", b: "marketing-growth", floor: "heart", nature: "dependência",
    object: "Regras do lead e do opt-out: score, distribuição, SLA",
    why: "Score, distribuição e prazo combinados com Vendas; o opt-out vale em toda ferramenta.",
    breaks: "A regra mudou na planilha, não no CRM.",
  },
  // nº 17 · final: texto do 02 (mesmo sentido)
  {
    a: "revops", b: "vendas", floor: "brain", nature: "meta compartilhada",
    object: "Etapas do funil + forecast",
    why: "Critério de saída igual para todos torna o forecast confiável.",
    breaks: "Forecast vira chute; cada vendedor usa um critério.",
  },
  // nº 18 · final: texto do 08
  {
    a: "revops", b: "financeiro", floor: "brain", nature: "meta compartilhada",
    object: "Receita do CRM × ERP; custo por origem; comissão",
    why: "O número da reunião comercial bate com o do Financeiro, ou a diferença tem motivo.",
    breaks: "Dois números de receita na diretoria; comissão paga sobre venda não faturada.",
  },
]
```

**Ajustes da dupla (antes → depois)**

| Relação | Campo | Antes (§5.3) | Depois | Motivo |
|---|---|---|---|---|
| 12 · RevOps → Marketing | `why` | Regras únicas de quando o lead passa e para quem. | Quando o lead passa, para quem e em quanto tempo: regra combinada com Vendas. | Traz o prazo (SLA), que já está no objeto, e mostra que RevOps combina a regra com as áreas em vez de impor. |
| 17 · RevOps – Vendas | `why` | Critério igual de etapa torna a previsão confiável. | Critério de saída igual em cada etapa torna o forecast confiável. | Só redação: usa "critério de saída", termo do briefing de Vendas (§7), e "forecast", o mesmo nome do objeto. |
| 18 · RevOps – Financeiro | `why` | O número da reunião comercial bate com o do Financeiro. | O número da reunião comercial bate com o do Financeiro, ou a diferença tem motivo. | Vendido e faturado raramente batem no mesmo dia (ganho no dia 30, NF no dia 2). A meta real é explicar cada diferença. |
| 18 · RevOps – Financeiro | `breaks` | Dois números de receita na mesma diretoria. | Dois números de receita na diretoria; comissão paga sobre venda não faturada. | A comissão está no objeto, mas não aparecia na falha. É a dor que mais gera atrito entre as duas áreas. |

**Coerência com as estações do Heart:** "Regras e passagens" entrega a Marketing (relação 12, no mesmo andar). "Dados e relatórios" (Vendas) e "Integrações e acesso" (Financeiro) são o lado do dia a dia das metas 17 e 18 do Brain, e não criam relação nova. As relações de Marca (nº 1, 2 e 15 do §5.1) saem com ela; a 15 vira Marketing → Atendimento, fora de RevOps.

---

## 4. Ícone e rótulo

- **Rótulo curto:** **RevOps** (confirmado). **Nome completo:** "RevOps: Operações de Receita e Dados". **id:** `revops`. Nada de "CRM Ops" ou "CRM" (§4).
- **Ícone sugerido: controles deslizantes.** São 3 trilhos horizontais, cada um com um cursor quadrado em posição diferente. `IconId` sugerido: `rules`, no lugar de `brand`.
- **Por quê:**
  - É o desenho comum de "ajustar configuração". Diz "regula as regras", e não "guarda tudo".
  - Não sugere centro: nó de rede, cilindro de banco de dados e nuvem leriam como servidor central.
  - Usa poucos traços e a linguagem do atlas (`iconAtlas.ts`): 3 linhas retas e 3 quadrados cheios, com pontas quadradas, como as barras de Vendas.
  - Não repete nem confunde. A engrenagem citada no §4 **já é o ícone de Operações** (`operations`). A chave inglesa lê como assistência técnica (Operações). A régua tem marcas finas que somem no tamanho do cubo. E o funil seria Vendas ou Marketing.
- **Referência para a fase de código** (célula de 128 px, traço 9):

```ts
// RevOps: três trilhos com cursores em posições diferentes (regras ajustáveis)
rules: (c) => {
  for (const [y, x] of [[40, 50], [64, 84], [88, 62]]) {
    c.beginPath();
    c.moveTo(26, y);
    c.lineTo(102, y);
    c.stroke();
    c.fillRect(x - 10, y - 10, 20, 20);
  }
},
```

- **Posto 3D (o que o `routine` descreve):** uma pessoa sentada a uma mesa com dois monitores. À esquerda fica a fila de demandas (linhas, uma em azul = em andamento); à direita, pares de cadastros duplicados. Sem quadro de cartões, para não parecer o funil de Vendas, e sem rack ou servidor, para não parecer o centro.

---

## 5. Para validar

1. **Tamanho do time:** numa empresa média, "Administração do CRM" e "Regras e passagens" costumam ser a mesma pessoa? Se forem, mantemos as 4 estações (são trabalhos diferentes) ou juntamos em 3?
2. **Integração CRM–ERP:** quem conserta, no dia a dia, o pedido que não chegou ao ERP: RevOps, TI ou o fornecedor do ERP? E "Pedido liberado para faturar" é mesmo o que o Financeiro recebe?
3. **Comitê mensal:** é comum ter um comitê com os líderes das áreas, ou a mudança é aprovada de forma informal (mensagem ao gerente)? Se for quinzenal ou por demanda, ajustar `ritual` e `scenario.outcome`.
4. **"Ganho só com assinatura" e comissão:** a regra vale para B2B no Brasil em geral, ou há segmentos em que o ganho é marcado no aceite verbal ou por e-mail? E a base da comissão sai do CRM ou do ERP?
5. **B2C e LGPD:** confirmar com alguém de "CRM & BI" de varejo que juntar clientes por CPF é a dor principal e que a régua fica em Marketing. Com o DPO ou o Jurídico, confirmar que a frase de `governance` (acesso por perfil, exportação com aprovação, prazo de guarda, consentimento) não soa como parecer.
