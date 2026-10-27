# 09 · Consolidação final do conteúdo

**Projeto:** CRM como Sistema · **Data:** 20/10/2026
**Autor:** arquiteto de CRM/RevOps (autor do `00_arquitetura_areas.md`), consolidando as 8 duplas da fase 2.
**Aprovado pelo autor antes desta etapa:** RevOps na 8ª coluna e o modelo de conteúdo do §6 do `00`.
**Nenhum código foi alterado.** Este documento e os arquivos `01` a `08` são a base para reescrever `src/content/`.

**Como ler este pacote:**
- Em caso de diferença, vale este arquivo. Depois dele, vale o arquivo da área. Por último, o `00`.
- Os arquivos `01` a `08` já foram editados para ficar iguais a este. O bloco `ts` da seção 2 de cada um é a versão final do conteúdo da área.
- A lista de relações abaixo é a versão final de `relations.ts`.

**Conferência feita por script em todos os arquivos.**
- Os 8 blocos são avaliados como objetos JavaScript, e todo campo cabe no limite do §6.4 do `00`.
- Todo `owner` e todo `handoff.to` é um id válido.
- Toda área tem de 2 a 4 subáreas e de 3 a 5 objetos.

---

## 1. Decisões

Cada decisão traz a regra e uma linha de motivo.

### 1. Orçamento de leitura: muda a apresentação, não o conteúdo
A Visão mostra uma variação por vez, e as automações do Backbone ficam recolhidas.

| Aba | Sempre visível | Atrás de um clique | Limite visível | Limite com tudo aberto |
|---|---|---|---|---|
| **Visão** | `oneLiner`, `keyQuestion`, sem/com CRM, `scenario` (passos + desfecho) e **uma** variação | seletor **B2B · B2C · Pequena**. Começa em B2B, e a escolha vale para todas as áreas durante a visita | **140** | 170 |
| **Brain** | tudo | — | **90** | 90 |
| **Heart** | rotina, cargos, um dia, nomes das subáreas e armadilhas | a subárea aberta (processo, passagem, registro, para o cliente) | **100** | +45 por subárea |
| **Backbone** | objetos do CRM, campo crítico, retorno, cuidado e sistemas vizinhos | **automações**, num recolhível com contagem ("Automações · 3") | **115** | 140 |

**Medidas atuais (mesmo contador nas 8 áreas):**

| Medida | Faixa |
|---|---|
| Visão visível | 126 a 140 |
| Brain | 86 a 90 |
| Heart | 99 a 100 (subárea aberta: 40 a 45) |
| Backbone visível | 83 a 102 |
| Backbone com tudo aberto | 117 a 139 |

**Contador oficial:**
- palavra é uma sequência com letra ou número; "×", "→" e "/" não contam;
- o horário do `dayInLife` conta 1;
- a automação conta "Quando" + `when` + `then`;
- o handoff conta o rótulo da área de destino.

**Motivo:** o caso com números é o conteúdo mais prático do painel e não pode ficar escondido. As variações servem para comparar, e um seletor resolve isso melhor. As automações são o detalhe mais técnico.

### 2. Um handoff pode existir sem relação fixa
- Toda subárea com `handoff` desenha uma **ligação temporária** até a coluna de destino, só enquanto a estação está aberta.
- Se o mesmo par tem relação fixa, em qualquer andar, a estação **acende essa relação** e não desenha outra linha.
- Uma automação que só lê um objeto de outra área (ex.: Marketing lê o status da fatura) não precisa de relação nem de handoff.
- **Não entra a 19ª relação (Operações → CS).** O handoff da Implantação para CS e a automação "o aceite é registrado → libera a fatura e avisa o CS" já mostram a passagem.

Casos cobertos pela ligação temporária: Produto → Vendas (catálogo), Produto → CS no Heart, Operações → CS, CS → Vendas no Heart e RevOps → Vendas/Financeiro no Heart. Financeiro → Marketing fica só como automação.

**Motivo:** as relações fixas mostram as passagens recorrentes do prédio. Criar uma relação para cada handoff levaria CS a 7 ou 8 relações e o transformaria no centro do prédio, que é justamente o que a tese evita.

### 3. Treinamento
- Quando há projeto de implantação, o **treinamento dos usuários-chave previsto no escopo é da Implantação (Operações)** e entra no aceite.
- **Depois do aceite, ou quando não há implantação, o CS treina** os novos usuários e cuida da adoção.
- Com implantação, o onboarding de CS começa no aceite.
- Ajustados: `05` (subárea Onboarding, §1) e `07` (§4).

**Motivo:** a linha que separa as duas áreas é o escopo contratado e o aceite. É assim que se decide quem cobra e quem responde pelo resultado.

### 4. Um nome e um dono por objeto
Os nomes e donos estão na tabela da seção 4.
- "Pedido" é sempre o objeto de Operações.
- "Contrato" é o objeto de Vendas no B2B recorrente.
- "Solicitação de estorno", "solicitação de cancelamento" e "contestação" são **tipos de ticket**, e não objetos próprios.
- **Notas de passagem** é um objeto.
- A "demanda" de mudança no CRM é de RevOps.

**Motivo:** o mesmo nome para duas coisas (pedido de compra × pedido de mudança) quebra o §8.8 do `00`, e o visitante não consegue somar o que lê nas 8 áreas.

### 5. Relação 8 (Marketing ↔ Atendimento): dois sentidos
Vale o texto de `04`.
**Motivo:** o dado volta de verdade (ticket crítico pausa a régua; caso público sobe a Marca & Conteúdo), e isso continua sendo uma relação só.

### 6. Relação 12 (RevOps → Marketing): junta opt-out e prazo
Vale o `object` de `01`. O `why` é novo e junta o "combinado com Vendas" de `08` com o opt-out de `01`.
**Motivo:** as duas duplas apontaram falhas reais do mesmo par, e o texto final cabe em 13 palavras.

### 7. Relações 4, 9 e 10: texto único
- **Nº 4:** `object` de `06` (contrato ou pedido), `why` de `02` (aprovado antes da assinatura) e `breaks` com as duas partes (CNPJ errado de `06` + desconto de `02`).
- **Nº 9:** `object` "Solicitação de estorno ou contestação". O `why` diz que a 2ª via simples fica no Atendimento.
- **Nº 10:** confirmada a versão de `07`, que `06` também adotou.

**Motivo:** a nº 9 antiga punha "2ª via" no objeto e, ao mesmo tempo, dizia que ela não passa ao Financeiro.

### 8. Relação 6 e health score
- Vale o texto de `04` (tickets, escalonamento e cancelamento; "chegam ao CS").
- No glossário, "health score" ganha a definição de `05` ("quando a empresa define a regra").
- No texto corrido, "saúde da conta" é a forma em português do mesmo termo.

**Motivo:** no B2C, o cancelamento vai à Retenção e não a um CSM. E a nota de saúde não existe em toda empresa (§8.7 do `00`).

### 9. Relações 2 e 5: a 5 vai para o Brain
A nº 5 (CS → Vendas, expansão) vira **meta compartilhada no Brain**: "Oportunidade de expansão + regra de comissão". No Heart, a passagem continua nas estações Renovação e expansão (CS) e Expansão de contas (Vendas), pela ligação temporária.

**Motivo:** a falha real da expansão é de meta e de comissão, que é assunto de Brain. E as duas curvas deixam de se sobrepor no 3D.

### 10. Estação "Lifecycle / CRM": fica
**Motivo:** é o nome que o mercado usa. Ver o "time de CRM" como uma estação dentro de uma coluna **reforça** a tese de que o CRM é o prédio inteiro. A variação B2C de Marketing e o glossário explicam isso.

### 11. Campo `boundary`: não entra no modelo
As fronteiras continuam distribuídas nos campos que já existem (`oneLiner`, `variants`, subáreas, relações). Entram no glossário duas entradas: "Atendimento × CS" e "Implantação × onboarding".

**Motivo:** um campo novo pressionaria as 8 áreas e estouraria o limite da Visão. Duas entradas de glossário resolvem os dois casos que mais confundem.

### 12. Catálogo: Produto cadastra
- Produto é dono do **Item do catálogo** e o cadastra.
- Financeiro aprova o preço de tabela.
- RevOps só cria a estrutura: campos e a trava que impede vender um item vencido.
- Em empresa pequena, o administrador do CRM cadastra a pedido de Produto.

**Motivo:** quem decide o que se vende responde pelo cadastro. Pôr RevOps como cadastrante faria dela a dona de tudo.

### 13. Formato das automações
- `when` e `then` vêm **sem** "Quando" e "então", começam com minúscula e não têm ponto final.
- A interface monta "Quando {when} → {then}".
- Cada bloco traz o comentário `// o painel monta "Quando {when} → {then}"`.
- O limite é 14 palavras, contando "Quando".
- Ajustado: `05`, que tinha "Quando" no `when`.

**Motivo:** um molde só para as 8 áreas, sem palavra repetida na tela.

### 14. Subáreas a mais: ficam
- **Vendas:** fica com 4 (Expansão de contas). É o "farmer" ou Account Manager do B2B real, e a decisão 9 depende dessa estação.
- **Operações:** fica com 4 (Visita técnica). É a assistência técnica, que existe em B2B e B2C, e faz a ponte com o Atendimento.

**Motivo:** as duas cabem no limite de 2 a 4 subáreas do §6, e nenhuma repete outra estação.

### 15. Ativação × primeiro valor (decisão nova)
- Produto mede o **tempo até ativar** (evento "ativou", configuração concluída).
- CS mede o **tempo até o primeiro valor** (marco no Plano de sucesso).
- A nº 16 passa a dizer que uma vem antes da outra.

**Motivo:** `03` e `05` davam o mesmo nome de indicador a duas medidas diferentes.

### 16. Fatura vencida e pausa de ofertas (decisão nova)

| Quando | O que acontece |
|---|---|
| **Dia 1 de atraso** | O status aparece na conta. O Financeiro avisa o cliente e alerta o CSM. As ofertas de expansão pausam (CS), e no B2C as ofertas de Marketing também. |
| **Mais de 15 dias** | A conta entra na reunião de quinta entre Financeiro e CS. |

Para o ticket crítico:
- Atendimento define o que é crítico, Marketing aplica a pausa, e RevOps configura.
- Só a oferta pausa; os avisos de entrega e de cobrança continuam.

**Motivo:** `01`, `05` e `06` tinham três momentos diferentes para a mesma pausa.

### 17. Objetos de Vendas, CS e Operações (decisão nova)
- **Vendas:** Oportunidade · Proposta · Contrato · Notas de passagem · Conta. Saíram Atividade e Lead, por causa do limite de 5. O Lead aparece na subárea Pré-vendas e na nº 1.
- **CS:** ganhou o **Plano de sucesso**, que é o objeto que ela cria. Saiu a Oportunidade, que continua na automação de renovação e na subárea de expansão.
- **Operações:** passa a consultar o **Contrato**, e não a Oportunidade, porque escopo e prazo prometido ficam no Contrato.

**Motivo:** toda área precisa mostrar pelo menos um objeto que ela cria, e um campo só pode morar num objeto.

### 18. Formato de texto (decisão nova)
- Cada bloco é um objeto puro `{ id: … }`, sem `const`, e vira `AREA_CONTENT[id]`.
- Aspas internas são curvas (“ ”).
- `dayInLife.action`, `feedback.decision`, `customerImpact`, `governance` e `criticalField` começam com maiúscula e terminam com ponto.
- `feedback.data`, processos, registros e objetivos não têm ponto final.

**Motivo:** o texto vai direto para o código sem revisão manual.

---

## 2. Relações finais (`relations.ts`)

São **18 relações**:
- 11 no Heart;
- 4 no Brain;
- 3 entre andares;
- 3 relações-chave (★): nº 2, 13 e 14.

| Área | Marketing | Vendas | Produto | Atendimento | CS | Financeiro | Operações | RevOps |
|---|---|---|---|---|---|---|---|---|
| Relações | 5 | 6 | 3 | 5 | 6 | 5 | 3 | 3 |

```ts
import type { Relation } from "./types";

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
    why: "Regras do cupom chegam ao SAC antes do disparo; ticket crítico pausa a promoção.",
    breaks: "O SAC desconhece o cupom; quem reclamou ontem recebe promoção hoje.",
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
    object: "Receita do CRM × ERP; custo por origem; comissão",
    why: "O número da reunião comercial bate com o do Financeiro, ou a diferença tem motivo.",
    breaks: "Dois números de receita na diretoria; comissão paga sobre venda não faturada.",
  },
];
```

**O que mudou em relação ao §5.3 do `00`:**
- **Nº 5:** foi para o Brain.
- **Texto ajustado pelas duplas e fechado aqui:** nº 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 16, 17 e 18.
- **Sem mudança:** nº 1, 14 e 15.

---

## 3. Glossário final (`glossary.ts`)

Os termos estão em ordem alfabética. Entre parênteses, a dupla que sugeriu o termo, quando ele é novo.

| Termo | Definição (até 15 palavras) |
|---|---|
| 2ª via | Nova cópia do boleto ou da NF, enviada a pedido do cliente. (06) |
| Alçada | Limite de desconto ou prazo que cada cargo pode aprovar sozinho. (02) |
| Analytics de produto | Sistema que mede o uso do produto por conta e por usuário. (05) |
| Atendimento × CS | Atendimento reage, por ticket, a qualquer cliente; CS antecipa, por conta, cuidando da carteira. (09) |
| Ativação (“ativou”) | Evento de quando a conta conclui a configuração mínima para começar a usar. (09) |
| Autoatendimento | O cliente resolve sozinho (2ª via, rastreio) por menu, bot ou portal, sem fila. (04) |
| Backoffice | Equipe que resolve com outras áreas o que o N1 não resolve na hora. (04) |
| Cadastro fiscal | Dados que a NF exige: CNPJ/CPF, razão social, inscrição e endereço. (06) |
| Carteira | Conjunto de contas sob responsabilidade de um CSM. (05) |
| Causa-raiz | A origem do problema; depois de corrigida, o motivo para de aparecer. (04) |
| Check-in | Conversa periódica do CSM com o cliente, registrada na conta. (05) |
| Churn | Cliente que cancelou ou não renovou. No painel, aparece como "cancelamento". |
| Compromisso (commit) | Oportunidade que o vendedor garante, no forecast, que fecha no mês. (02) |
| Consentimento | Registro de que a pessoa aceitou receber mensagens, por canal e finalidade. (09) |
| Contato evitável | Contato que deixa de existir quando a causa é corrigida ou o aviso chega antes. (04) |
| Contestação | O cliente discorda de um valor cobrado e pede revisão. (06) |
| Critério de saída | O que precisa ser verdade para a oportunidade mudar de etapa. (02) |
| CSAT | Nota de satisfação dada logo depois de um atendimento. |
| CSM | Pessoa de CS responsável por uma carteira de contas. (05, 06) |
| ERP | Sistema de gestão onde ficam nota fiscal, estoque e financeiro. |
| Estorno | Devolução ao cliente de um valor já cobrado. (06) |
| Evento de uso | Registro automático de uma ação do cliente no produto, como "ativou" ou "parou de usar". (03) |
| Faixa de atraso | Grupo de faturas pelo tempo de atraso: até 30 dias, de 31 a 60… (06) |
| Farol | Cor de saúde da conta (verde, amarelo, vermelho), marcada à mão ou calculada. (05) |
| Forecast | Previsão de vendas do período, feita a partir do funil. |
| Funil (pipeline) | Etapas pelas quais as oportunidades passam até ganho ou perda. |
| Go-live / aceite | Momento em que o cliente confirma que a entrega está pronta para uso. |
| Health score (saúde da conta) | Nota de saúde da conta, quando a empresa define a regra: uso, tickets, pagamento. (05) |
| Help desk | Sistema onde os tickets são abertos e atendidos. |
| Implantação × onboarding | Implantação entrega o escopo contratado até o aceite; onboarding leva o cliente ao primeiro valor. (09) |
| Inadimplência | Fatura vencida e não paga. (06) |
| Lead | Pessoa ou empresa que demonstrou interesse e ainda não comprou. |
| Lifecycle | Mensagens a leads e clientes conforme a etapa; em B2C, o time se chama "CRM". (01) |
| Logística reversa | O caminho de volta do produto, numa troca ou devolução. (07) |
| MQL / SQL | Lead aprovado por Marketing / aceito por Vendas para abordagem. |
| N1 / N2 | Primeiro nível de atendimento / especialistas que recebem o que o N1 escala. |
| NF | Nota fiscal: documento fiscal da venda, emitido pelo Financeiro no ERP. (09) |
| Notas de passagem | O que Vendas registra no ganho para quem vai cuidar do cliente. (05) |
| NPS | Pergunta "recomendaria a empresa?", respondida de 0 a 10. |
| Ocorrência | Atraso, extravio, avaria ou cliente ausente, registrado no pedido. (07) |
| Onboarding | Primeiros passos do cliente depois da compra, até o primeiro valor. |
| Oportunidade | Negociação aberta, com valor, etapa e data prevista de fechamento. |
| Opt-out | Pedido do cliente para não receber mais mensagens; vale em toda ferramenta. |
| OS | Ordem de serviço: o registro de uma visita técnica. (07) |
| Ouvidoria | Canal para quem não teve solução no atendimento comum. (04) |
| Pedido de melhoria | Pedido do cliente por uma mudança no produto, registrado na conta com tema. (03) |
| Pendência do aceite | Item que o cliente aceitou receber depois do go-live. (07) |
| Plano de sucesso | Meta do cliente, marcos e primeiro valor combinados no onboarding. (09) |
| PQL | Lead que nasce do uso do produto, só em autoatendimento. (03) |
| Preço de tabela | Preço oficial de um item do catálogo, antes de qualquer desconto. (03) |
| Primeiro valor | Primeiro resultado concreto que o cliente tem com o que comprou. (03, 05) |
| QBR | Revisão trimestral de resultados com o cliente. (05) |
| Rastreio | Código e eventos que mostram onde o pedido está. (07) |
| Receita retida | Receita da carteira depois de renovações, expansões e cancelamentos. (05) |
| Reconquista | Contato com quem cancelou, para tentar trazer a pessoa de volta. (05) |
| Régua | Sequência automática de mensagens com regras de envio. |
| Retenção | Equipe que atende quem pede para cancelar. (05) |
| RevOps | Time que define as regras do CRM e cuida do dado, sem atender clientes. (08) |
| Roadmap | O que o produto vai construir, e em que ordem. (03) |
| Sales Ops | A função de RevOps só para Vendas: funil, forecast e comissão. (08) |
| Score | Nota do lead que soma perfil e sinais de interesse. (01) |
| SDR | Pré-vendedor que faz a primeira abordagem do lead. (01, 02) |
| SLA | Prazo combinado para responder ou resolver. |
| Ticket | Registro de um contato do cliente que precisa de resposta; sinônimos: chamado, protocolo. |
| Ticket crítico | Ticket de prioridade máxima; enquanto está aberto, as promoções para o cliente pausam. (04) |
| Time de CRM | Em B2C, o time de Marketing que faz a régua; é uma estação do prédio. (09) |
| Upsell / expansão | Venda adicional para quem já é cliente. |
| Usuário-chave | Pessoa do cliente treinada na implantação para ensinar os colegas. (07) |
| UTM | Etiqueta no link que diz de qual campanha veio o clique. (01) |

**Ajustes nos termos que já existiam no `00`:**
- **Health score:** definição de `05`, sem "chamados".
- **Ticket:** a definição não usa mais a palavra "pedido".
- **Opt-out:** agora diz que vale em toda ferramenta.
- **Onboarding** e **Oportunidade:** ficaram mais precisos.

---

## 4. Um nome por objeto

**Legenda:**
- **Dono:** responde pelo dado e é a referência.
- **Cria / Edita / Vê:** o que cada área faz com o objeto.
- Use **sempre** o nome da 1ª coluna, no singular.

| Objeto | Dono | Cria | Edita | Vê | Não confundir com |
|---|---|---|---|---|---|
| **Lead** | Marketing | Marketing (e Vendas, na prospecção) | Vendas (1º contato, descarte) | RevOps | — |
| **Contato** (a pessoa) | Marketing | Marketing, Vendas, Atendimento | Atendimento, Vendas | todas as áreas | Conta |
| **Consentimento** | Marketing | Marketing | Marketing; Atendimento, quando o cliente pede para sair | quem envia mensagem | o opt-out é um estado do consentimento |
| **Campanha** | Marketing | Marketing | Marketing | Atendimento (regras da oferta) | — |
| **Segmento** | Marketing | Marketing | Marketing | — | — |
| **Modelo de mensagem** | Marketing (Marca & Conteúdo) | Marketing | Marketing | Atendimento, Financeiro | — |
| **Conta** (empresa-cliente ou cliente) | Vendas | Vendas | Financeiro (cadastro fiscal), CS (CSM, health score), RevOps (duplicados) | todas as áreas | Contato |
| **Oportunidade** | Vendas | Vendas; CS (renovação e expansão) | Vendas; Financeiro (aprovação de condição) | Produto, RevOps | Pedido |
| **Proposta** | Vendas | Vendas | Vendas | Financeiro | — |
| **Contrato** | Vendas | Vendas, no ganho | CS (renovação, motivo de cancelamento) | Financeiro, Operações | Pedido |
| **Notas de passagem** | Vendas | Vendas, no ganho | — | CS, Operações | — |
| **Pedido** (compra de itens a entregar) | Operações | Vendas, representante ou e-commerce | Operações (status, rastreio, ocorrência) | Atendimento, Financeiro | Pedido de melhoria; "demanda" de RevOps |
| **Projeto de implantação** | Operações | Operações | Operações | CS, Financeiro | — |
| **Ordem de serviço (OS)** | Operações | Operações | Operações | Atendimento | — |
| **Devolução** | Operações | Operações | Operações | Financeiro, Atendimento | Estorno |
| **Fatura** (NF + boleto/Pix) | Financeiro | Financeiro, no ERP, via integração | Financeiro | CS, Atendimento, RevOps; Marketing (status, B2C) | — |
| **Ticket** | Atendimento | Atendimento | Atendimento; Financeiro (desfecho de estorno) | Produto, CS, Marketing (ticket crítico) | "chamado" e "protocolo" são sinônimos e não entram no painel |
| ↳ Solicitação de estorno / contestação | tipo de **ticket** (Cobrança) | Atendimento | Financeiro | — | Devolução |
| ↳ Solicitação de cancelamento | tipo de **ticket** (Cancelamento) | Atendimento | CS (Retenção) | — | — |
| **Pedido de melhoria** | Produto | CS, Vendas, Atendimento, Produto | Produto (tema, status) | CS | Pedido |
| **Evento de uso** | Produto | Produto (automático) | — | Marketing, CS, Vendas (PQL) | — |
| **Item do catálogo** | Produto | Produto | Produto; Financeiro aprova o preço | Vendas | — |
| **Plano de sucesso** | CS | CS | CS | Produto | — |
| **Atividade** (ligação, reunião, WhatsApp) | quem registra | Vendas, CS | quem registrou | todas as áreas | — |
| **Etapa do funil** | RevOps | RevOps, com aprovação do comitê | RevOps | Vendas | — |
| **Regra de distribuição** | RevOps | RevOps | RevOps | Marketing, Vendas | — |
| **Perfil de acesso** | RevOps | RevOps | RevOps | — | — |
| **Demanda** (de mudança no CRM) | RevOps | qualquer área | RevOps | quem pediu | Pedido |

**Campos que aparecem em vários arquivos, com um nome só:** status de pagamento · data prevista (de fechamento) · data de renovação · prazo prometido × real · motivo (do ticket, em 2 níveis) · motivo de perda · motivo de descarte · motivo de cancelamento · cadastro fiscal · e-mail de cobrança · health score ou farol.

---

## 5. Frases do percurso guiado (`chapters.ts`)

Formato: `{ area, text }`, com o texto no padrão "Área: frase". O `menuLine()` tira tudo até o primeiro ":", por isso o prefixo é obrigatório e a frase não pode ter ":" antes do fim do prefixo. Cada frase tem até 14 palavras sem contar o prefixo. Produto aparece nos três andares, e as 3 relações-chave estão marcadas (★).

```ts
// BRAIN
guided: [
  { area: "produto", text: "Produto: prioriza o tema que mais contas pediram, pesando a receita em renovação." }, // ★14 (destino)
  { area: "financeiro", text: "Financeiro: define quantos dias de atraso pausam ofertas e acionam o CSM." },          // ★13 (origem)
  { area: "revops", text: "RevOps: combina com Vendas o critério de saída de cada etapa do funil." },                 // nº 17
],
// HEART
guided: [
  { area: "vendas", text: "Vendas: marca o ganho e preenche as notas de passagem para o CSM." },                       // ★2
  { area: "atendimento", text: "Atendimento: fecha o ticket com motivo de lista fechada; o volume vai a Produto." },   // ★14 (origem)
  { area: "produto", text: "Produto: muda o status do pedido de melhoria, e o CS avisa quem pediu." },                 // ciclo da ★14
],
// BACKBONE
guided: [
  { area: "produto", text: "Produto: envia os eventos “ativou” e “parou de usar”, que Marketing e CS usam." },          // nº 11 e 16
  { area: "customer-success", text: "CS: vê uso, tickets e faturas na conta antes de falar em renovação." },          // ★13 e ★2 no dado
  { area: "operacoes-entrega", text: "Operações: guarda o prazo prometido separado do real; o atraso aparece ao SAC." }, // nº 7
],
```

**Por que estas áreas:**
- Produto aparece em todos os andares, porque é a área guiada.
- Financeiro, Atendimento e CS levam as relações-chave.
- RevOps aparece no Brain para apresentar a área nova pelo que ela decide, e não como "time do sistema".
- Operações fecha o Backbone com o campo crítico mais fácil de entender.
- Marketing fica de fora de propósito: é a área que o visitante já associa a CRM.

---

## 6. O que ainda precisa de validação humana

Esta é a lista consolidada dos "Para validar" das 8 duplas. Os pontos foram agrupados por tema, e os que foram decididos neste documento saíram da lista. Os números dos arquivos estão entre parênteses.

**Números ilustrativos (precisam soar plausíveis)**
1. **SLA:** 4h úteis do MQL e retorno do SDR em 40 minutos (01, 02); prazos por canal do SAC: WhatsApp 15 min, chat 2 min, telefone 1 min, e-mail 24 h úteis (04).
2. **Caso de Vendas:** 12% de desconto e R$ 48 mil em 30 dias (02).
3. **Prazos de CS e Financeiro:** renovação aberta 90 dias antes (05); dias da régua e da reunião de 15 dias (06).
4. **Gatilhos de Produto:** 14 dias sem acesso e 3 colegas convidados (03).

**Regras que variam por empresa**

5. Escada de alçada do desconto e papel do Financeiro: aprova percentual, ou só prazo e crédito (02, 06)?
6. Etapas e critérios de saída do funil, incluindo a venda consultiva B2C de ciclo curto (02).
7. Expansão: quem fecha e como a comissão se divide; em conta pequena, o CS fecha (02, 05)?
8. Campos que travam a NF (produto × serviço, cliente isento) e quem pode corrigir o e-mail de cobrança (05, 06).
9. Ticket crítico: definição final (canal público ou Procon, cobrança indevida, 2ª reabertura) e quando a pausa termina (04).
10. Quem aprova o texto de cobrança e de atraso: Marca & Conteúdo, Financeiro ou Jurídico (01, 06).
11. Momento de faturar a implantação (aceite final, por marco ou na assinatura) e de liberar o estorno na devolução (06, 07).
12. "Ganho só com assinatura" e a base da comissão: CRM ou ERP (08).

**Listas fechadas para RevOps configurar**

13. Motivos de descarte (01), motivos de perda (02), motivos do ticket em 2 níveis (04), motivos de cancelamento (05) e tipos de ocorrência (07).

**Nomes e estruturas**

14. "Lifecycle / CRM" é o nome usado no mercado B2C (01)? "Backoffice" soa natural em B2B, ou fica "N2 / Especialistas" (04)?
15. Retenção só em B2C, ou também em SaaS para pequenas empresas (05)? RevOps com 3 ou 4 estações numa empresa média (08)?
16. Onde fica o pedido de melhoria (CRM ou ferramenta de feedback integrada), quem mais registra e quem avisa quem pediu (03).

**Fronteiras com o Jurídico (sem levar parecer ao painel)**

17. Ouvidoria e Procon (04), cancelamento em setores regulados (05), bloqueio e suspensão por atraso (06) e a frase de LGPD de RevOps (08).

**Integrações**

18. Tempo do "pago" do ERP até o CRM (06); quem conserta a venda que não chegou ao ERP (08); ocorrências da transportadora por integração ou digitadas, e quem mantém o prazo por CEP (07).

**Teste com visitantes (consolidação)**

19. O rótulo "RevOps" é entendido por quem vem do B2C? O seletor B2B · B2C · Pequena é notado, ou a pessoa lê só a variação padrão?

---

## 7. Notas para a fase de código

Só para referência: nada disto foi implementado.
- **`DepartmentId`:** `marca-comunicacao` → `revops` no slot 8. O ícone `rules` está em `08` §4.
- **`types.ts`:** o `AreaContent` do §6.3 do `00` vale sem mudança. O `Relation` ganha `object` (obrigatório) e `breaks` (opcional), e `nature` continua com os mesmos 4 valores.
- **`menuLine()`:** no Backbone, usar `crmObjects.slice(0, 3).map(o => o.object).join(" · ")`. No Heart, continua o texto antes do ":" em `routine`.
- **Painel:** seletor de variações, automações recolhidas e ligação temporária do handoff (decisões 1 e 2). O molde da automação é "Quando {when} → {then}".
- **3D:** com a nº 5 no Brain, nenhum par tem duas relações no mesmo andar.
