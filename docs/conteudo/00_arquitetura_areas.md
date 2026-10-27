# 00 · Arquitetura das áreas e padrão de conteúdo prático

**Projeto:** CRM como Sistema · **Data:** 20/10/2026
**Autor:** revisão de especialista em arquitetura de CRM e RevOps
**Escopo:** avaliar se as áreas refletem empresas reais e definir o modelo de conteúdo da fase 2.
**Nenhum código foi alterado.** Este documento é a base para reescrever `src/content/` na fase 2.

Fontes lidas: `src/content/` (types, areas, relations, chapters), `src/scene/config/constants.ts` (DEPARTMENT_INFO), pré-produção 01 a 04 + README e `docs/RECOMENDACOES_AREAS.md`.

---

## 1. Veredito

1. As 8 áreas são reconhecíveis e cobrem o ciclo real do cliente: atrair, vender, entregar, cobrar, atender e reter. A base está certa.
2. Há dois erros de realidade. **Marca** não trabalha no CRM: não cria nem consulta registro. E **ninguém no prédio é dono das regras e da qualidade do dado**, que é a falha nº 1 de implantações reais.
3. Recomendação: **manter 8 colunas**. Marca entra em Marketing, e a 8ª coluna passa a ser **RevOps** (Operações de Receita e Dados).
4. O problema maior não está no conjunto de áreas, e sim no texto. Ele é abstrato, quase não cita objetos do CRM (lead, ticket, fatura), não tem números e não diz o que dá errado.

---

## 2. Avaliação área por área

Legenda da decisão: **MANTER** · **AJUSTAR** (manter, mudando nome ou escopo) · **JUNTAR** · **TROCAR**.

### Problemas que valem para todas as áreas (exemplos de `areas.ts`)

- **`oneLiner` e `role` são o mesmo texto.** Exemplos: "Constrói demanda relevante e orquestra comunicações…" e "Construir demanda relevante e orquestrar comunicações…". São dois campos para uma frase só.
- **Os objetos do CRM quase não aparecem.** Em 600 linhas, "oportunidade" e "ticket" aparecem poucas vezes, e "fatura" quase nunca. Não há um único **campo** citado: data prevista de fechamento, motivo do contato, motivo de perda.
- **Faltam o "quem" e o "quando".** Exemplo de Marketing: "Uma pessoa demonstra interesse por uma solução e recebe informação consistente com sua etapa da jornada." Não diz quem fez, o que foi registrado nem quando aconteceu.
- **Frases de efeito no lugar de prática.** Exemplos: "A marca escuta antes de falar mais alto." e "Começar é coerente com o que foi vendido."
- **Os indicadores não dizem de onde vem o dado.** "Saúde da carteira" não diz de qual campo ou objeto sai o número.
- **`heart.processes` repete as subáreas** com uma lista genérica ("Descoberta de necessidades", "Ciclo de feedback").
- **Não aparece nenhuma falha.** Não existe um "sem CRM" nem um "onde quebra". Esse é justamente o motivo pelo qual as empresas compram CRM.

---

### 01 · Marketing (`marketing-growth`): AJUSTAR (absorve Marca)

**Como se chama nas empresas**
- **B2B pequena:** "Marketing", com 1 a 3 pessoas e muitas vezes uma agência.
- **B2B grande:** Demand Gen (geração de demanda), Marketing Ops, Product Marketing e Brand.
- **B2C:** Marketing, Growth, Performance e o **"time de CRM" ou "CRM & Retenção"**, que cuida da régua de e-mail, push e WhatsApp. Em B2C, quando alguém diz "o pessoal do CRM", quase sempre fala desse time de Marketing. **Isso é ótimo para a tese:** o time chamado CRM é só uma subárea de uma coluna.

**O que faz no CRM, na prática**
- Cria lead e contato com origem (campanha, UTM, formulário).
- Registra consentimento e descadastro (opt-out).
- Pontua o lead (lead scoring) e marca quando ele vira MQL.
- Monta segmentos e listas, e dispara réguas.
- Consulta quais origens viraram venda e receita.

**Sobreposições**
- **Marca:** juntar.
- **Growth/Aquisição × Performance/Mídia:** juntar numa subárea "Demanda". Hoje os dois processos são quase iguais ("escolher canais…" e "redistribuir verba…").
- **Regras de pontuação e de passagem do lead:** são desenhadas com RevOps.

**Genérico ou irreal hoje**
- Nenhuma subárea diz que a saída é **um lead que vai para Vendas com prazo de resposta**.
- Não existe devolução de lead com motivo, embora o `why` da relação cite isso.
- "Quando falar, e quando não falar, com cada pessoa" é uma boa ideia, mas falta a regra concreta: suprimir a comunicação se houver ticket crítico ou fatura vencida.

---

### 02 · Vendas (`vendas`): MANTER (Sales Ops sai, Parceiros entra)

**Como se chama nas empresas**
- **No Brasil:** "Comercial" é o nome mais comum.
- **B2B pequena:** o dono e 1 a 3 vendedores.
- **B2B grande:** SDR/BDR (pré-vendas), Executivo de contas/Closer, Key Account, Inside e Field Sales, Canais.
- **B2C:**
  - loja ou televendas;
  - e-commerce, que é venda **sem** vendedor e sem oportunidade no CRM;
  - venda consultiva em imóveis, carros, educação e seguros. Nesses casos, o B2C tem funil de verdade.

**O que faz no CRM, na prática**
- Converte o lead em oportunidade.
- Move a etapa quando há um critério claro de saída.
- Registra atividades (ligação, reunião, WhatsApp).
- Preenche valor, produtos, **data prevista de fechamento** e **próximo passo**.
- Anexa a proposta.
- Marca ganho ou perda **com motivo obrigatório**.
- No ganho, gera pedido ou contrato e preenche a passagem para as próximas áreas.

**Sobreposições**
- **Expansão × CS:** quem fecha o upsell? Regra comum: CS identifica e abre a oportunidade, e Vendas (ou Account Manager) fecha. Em contas pequenas, o próprio CS fecha.
- **Sales Ops × RevOps:** Sales Ops vira RevOps.

**Genérico ou irreal hoje**
- A subárea "Sales Ops" (origem: venda fechada; saída: passagem de contexto) tem o **dono errado**. Quem preenche a passagem é o vendedor. Sales Ops desenha o formulário e a trava que impede fechar sem ele.
- O objetivo "Experiência comercial coerente" não diz o que é.
- Faltam forecast (previsão de vendas), aprovação de desconto e motivo de perda como campo.
- O `context` "No varejo, Vendas pode ser loja ou e-commerce; o funil por etapas continua valendo" está **errado para e-commerce**. Ali existe carrinho e pedido, não oportunidade.

---

### 03 · Produto (`produto`): AJUSTAR (recorte mais estreito e honesto)

**Como se chama nas empresas**
- **SaaS:** Produto (PM, Design, Product Analytics).
- **Varejo e indústria:** Compras, Categoria, Mix e Desenvolvimento de produto.
- **Serviços:** Portfólio ou Ofertas.
- **Empresa pequena:** o fundador.

**O que faz no CRM, na prática.** Produto não passa o dia no CRM. Ele faz três coisas:
1. **Consulta** a voz do cliente: pedidos de melhoria ligados à conta (e à receita dela), motivos de ticket e motivos de perda.
2. **Publica** catálogo, planos e preços que a proposta usa, muitas vezes junto com Financeiro.
3. **Envia** eventos de uso (ativou, parou de usar) que alimentam CS e Marketing. Em produtos de autoatendimento (PLG), o uso pode virar um lead para Vendas, chamado PQL.

**Sobreposições:** com CS (adoção) e com Marketing (réguas de ativação).

**Genérico ou irreal hoje**
- `capabilities: "Feature flags"` não tem relação com CRM.
- `processes` ("Descoberta de necessidades", "Ciclo de feedback") parece índice de livro.
- **Falta o elo mais real:** "12 contas pediram a mesma melhoria, e 4 delas renovam no próximo trimestre". É assim que Produto usa o CRM.

---

### 04 · Atendimento (`atendimento`): AJUSTAR (nome completo e absorve a reputação pública)

**Como se chama nas empresas**
- **B2C:** SAC, Central de Atendimento e Ouvidoria. Às vezes o nome é "Relacionamento", o que confunde com CS.
- **B2B e SaaS:** Suporte, Suporte técnico, Help desk, com níveis N1, N2 e N3.
- **Empresa pequena:** o WhatsApp do comercial ou do dono.
- **Empresa grande:** muitas vezes terceirizado (call center / BPO).

**O que faz no CRM (ou no help desk integrado)**
- Abre o ticket pelo canal de entrada e identifica o cliente.
- Classifica o motivo numa **lista fechada** e prioriza pelo prazo (SLA).
- Consulta pedido, fatura e contrato.
- Escala para N2 ou para outra área.
- Fecha com o desfecho e envia uma pesquisa curta (CSAT).

**Fronteira com CS (regra para o conteúdo)**

| | Atendimento | CS |
|---|---|---|
| Postura | reage | antecipa |
| Unidade de trabalho | ticket | conta |
| Quem atende | qualquer cliente | carteira |
| O que mede | tempo e resolução | retenção e expansão |

Em empresa pequena, as duas funções são da mesma pessoa.

**Genérico ou irreal hoje**
- `crmConnection`: "evita abordagens inadequadas e permite respostas mais contextuais". Não diz o que se vê na tela.
- A ideia do `example` é ótima (suspender promoção para quem tem reclamação aberta), mas falta a cena.
- Faltam os canais reais (**WhatsApp** é o principal no Brasil) e o SLA por canal.
- Faltam os motivos que ligam Atendimento a outras áreas: **2ª via de boleto**, **"onde está meu pedido"** e **estorno**.

---

### 05 · CS (`customer-success`): AJUSTAR (nome completo)

**Como se chama nas empresas**
- **SaaS e B2B recorrente:** Customer Success, CSM, Onboarding, Renovações, Account Management.
- **B2B não SaaS:** Pós-venda, Key Account, Gestão de carteira.
- **B2C:** quase nunca existe com esse nome. Aparece como **Retenção** (a equipe que atende quem quer cancelar, em telecom e assinaturas), **Fidelidade** (programa de pontos) ou como régua de Marketing.
- **Empresa pequena:** o próprio vendedor.

**O que faz no CRM, na prática**
- Recebe a conta com as notas de passagem e monta o plano de sucesso.
- Registra check-ins e revisões trimestrais (QBR).
- Acompanha a saúde da conta (health score), que mistura uso, tickets, pagamento e NPS.
- Cria tarefas de risco e a oportunidade de renovação.
- Registra o **motivo de cancelamento numa lista fechada**.
- Abre oportunidade de expansão para Vendas.

**Sobreposições:** Atendimento (ver acima), Vendas (expansão), Operações (implantação) e Marketing (em B2C, retenção costuma ser régua).

**Genérico ou irreal hoje**
- `capabilities: ["Plataforma de CS", "CRM", "BI", …]` lista **"CRM" como ferramenta de uma área**. Isso contradiz a tese do projeto.
- "Acompanhamento humano e comunicação automatizada compartilham contexto" é abstrato.
- Faltam data de renovação como campo, motivo de cancelamento, QBR e a passagem de expansão.

---

### 06 · Financeiro (`financeiro`): MANTER (Unit Economics sai, Crédito entra)

**Como se chama nas empresas**
- **Empresa pequena:** "o financeiro", muitas vezes 1 pessoa com contador externo.
- **Empresa grande:** Contas a Receber, Faturamento, Crédito e Cobrança, Tesouraria, FP&A, Controladoria.
- **B2C:** cobrança muitas vezes terceirizada, com gateway de pagamento.

**O que faz no CRM.** Quase sempre trabalha pelo ERP, integrado ao CRM.
- Recebe o pedido ou contrato ganho.
- Confere o **cadastro fiscal**: CNPJ/CPF, razão social, inscrição estadual e e-mail de cobrança.
- Aprova desconto e prazo fora da política, **antes** da assinatura.
- Emite **NF e boleto/Pix** e devolve o status ao CRM.
- Atualiza o status de pagamento, registra acordos e faz estornos.

**Genérico ou irreal hoje**
- `oneLiner`: "Torna claras, corretas e sustentáveis as condições econômicas da relação." Nenhum profissional de Financeiro descreve o próprio trabalho assim.
- A subárea "Controladoria / Unit Economics" é irreal no CRM. Controladoria lê relatório, não opera registro. O tema vai para o Brain (indicadores) e para a relação RevOps–Financeiro.
- Faltam NF, cadastro fiscal, aprovação de desconto, 2ª via e régua de cobrança.

---

### 07 · Operações (`operacoes-entrega`): AJUSTAR (deixar explícitas as duas faces)

**Definição para o conteúdo:** Operações faz **o que foi vendido acontecer**. Tem duas faces bem diferentes, e o conteúdo precisa marcar cada uma.
- **B2B e serviços:** Implantação, Projetos, Serviços profissionais e Assistência técnica (campo). O objeto é a **ordem de serviço ou o projeto**, e o marco é o **aceite (go-live)**.
- **B2C e varejo:** Logística, Fulfillment, Expedição e Logística reversa. O objeto é o **pedido**, com rastreio e prazo prometido.
- **Outros casos:** indústria (PCP e Expedição) e saúde ou educação (agenda presencial).

**O que faz no CRM.** Trabalha pelo sistema de pedidos, ERP ou gestão de projetos, e devolve o status.
- Recebe o pedido ou o escopo.
- Agenda, executa e atualiza o status: separado, enviado e entregue; ou kickoff, go-live e aceite.
- Registra ocorrências e devoluções.

**Fronteira com CS:** Operações entrega o que foi comprado (instalar, configurar, enviar). CS garante que o cliente **use e tenha resultado**. Implantação com escopo, cronograma e aceite fica em Operações. Treinamento e metas de adoção ficam em CS.

**Genérico ou irreal hoje**
- A subárea "Fulfillment / Entrega" (origem: "Pedido ou escopo vendido") mistura logística e implantação num processo só.
- Faltam aceite e go-live (que liberam o faturamento e o onboarding), agendamento, rastreio visível ao SAC e o campo "prazo prometido × prazo real".

---

### 08 · Marca (`marca-comunicacao`): JUNTAR em Marketing (e a coluna é trocada)

**Por quê**
- Em empresas reais, Branding e Comunicação Corporativa quase nunca têm login no CRM.
- Os pontos de contato reais com o CRM (tom das mensagens, reputação, NPS público) são operados por **Marketing** (régua e conteúdo) e por **Atendimento** (resposta em canais públicos).
- Sozinha, a coluna não passa no teste "o que esta área cria, edita ou consulta no CRM?".

**Genérico ou irreal hoje**
- `routine`: "mesa de estúdio com peças espalhadas".
- `signals`: "Performance de linguagem".
- `produces`: "Biblioteca de ativos e guia de marca". Um repositório de ativos digitais não é CRM.
- `customerImpact`: "A marca escuta antes de falar mais alto" é slogan.

**O que se aproveita**
- Revisão de tom em mensagens sensíveis (cobrança, atraso) vira parte da subárea **Marca & Conteúdo** de Marketing.
- Reclamação pública vira a subárea **Ouvidoria e canais públicos** de Atendimento.

---

## 3. Áreas que faltam

| Área | Recomendação | Por quê |
|---|---|---|
| **RevOps / Operações de Receita** (inclui Sales Ops, Marketing Ops, CS Ops e admin de CRM) | **Entrar como área própria** (8ª coluna, no lugar de Marca) | Alguém define etapas, campos, regras de passagem, SLAs, permissões, integrações e qualidade do dado. Sem isso, o CRM vira planilha paralela em 6 meses. Também reforça a tese "tecnologia não corrige operação". |
| **Parcerias / Canais** (revendas, distribuidores, representantes comerciais) | **Subárea de Vendas** | É muito comum no Brasil (representantes em indústria e distribuição). O objeto é a conta do parceiro, o registro de oportunidade do parceiro e a comissão. Não justifica uma coluna. |
| **BI / Dados** | **Subárea de RevOps** ("Dados e relatórios"). O time central de dados, quando existe, fica no Backbone como transversal | Para o CRM, o que importa é a qualidade do dado e o relatório que vira decisão. Já o data lake corporativo é infraestrutura. |
| **TI / Engenharia** | **Fora como coluna.** Aparece no Backbone (integrações, acesso único, ERP) e na subárea "Integrações e acesso" de RevOps | Sustenta o sistema, mas não se relaciona com o cliente. |
| **Jurídico / Privacidade (DPO) / Compliance** | **Fora como coluna.** Aparece no campo "cuidado" de cada área e como dependência de Vendas (revisão de contrato) e de RevOps (LGPD) | É gargalo real no fechamento B2B, mas não é dono de nenhum objeto do relacionamento. |
| **RH** | **Fora** | Não toca o cliente. Única exceção: comissão e remuneração variável dependem do dado do CRM, e isso já está em RevOps–Financeiro. |
| **Liderança / Diretoria** | **Fora** | Consome o Brain (forecast, carteira). Não é uma área. |
| **Ouvidoria** | **Subárea de Atendimento** (B2C) | Recebe a parte de "reputação pública" que hoje está em Marca. |
| **Compras / Suprimentos** | **Fora**. No varejo, aparece como variação de Produto (sortimento) e de Operações (estoque) | Relação indireta com o cliente. |
| **Product Marketing (PMM)** | **Fora**, dentro de Marketing quando citado | Na prática do CRM, é conteúdo e mensagem, já coberto. |

---

## 4. Conjunto recomendado

**8 áreas, mesmas 8 colunas.** Só a 8ª coluna muda de dono.

| # | Rótulo curto | Nome completo | id | Mudança |
|---|---|---|---|---|
| 1 | Marketing | Marketing: Demanda, Lifecycle e Marca | `marketing-growth` | nome completo; absorve Marca |
| 2 | Vendas | Vendas / Comercial | `vendas` | Sales Ops sai; Parceiros entra |
| 3 | Produto | Produto / Oferta | `produto` | recorte mais estreito |
| 4 | Atendimento | Atendimento / SAC / Suporte | `atendimento` | nome completo; absorve Ouvidoria |
| 5 | CS | Customer Success / Relacionamento | `customer-success` | nome completo |
| 6 | Financeiro | Financeiro: Crédito, Faturamento e Cobrança | `financeiro` | Unit Economics sai; Crédito entra |
| 7 | Operações | Operações: Entrega e Implantação | `operacoes-entrega` | duas faces explícitas (B2B e B2C) |
| 8 | RevOps | RevOps: Operações de Receita e Dados | **novo** (sugestão: `revops`) | substitui `marca-comunicacao` |

**Impacto no 3D (para a fase de código, não agora)**
- Muda só o slot 8 do `DEPARTMENT_INFO`: id, rótulo, nome completo e ícone. O ícone `brand` vira algo como "engrenagem" ou "regras".
- Layout, cubos, colunas e zonas continuam iguais.
- `DepartmentId`, `AREA_CONTENT` e `RELATIONS` precisam trocar `marca-comunicacao` por `revops`.

**Rótulo "RevOps":** é o termo que o mercado usa e cabe no rótulo. Na aba Visão, a primeira linha precisa explicar o termo: "o time que define as regras do CRM e cuida do dado". **Não** chamar a coluna de "CRM Ops" nem de "CRM", porque isso contradiz a tese.

**Cuidado de mensagem com RevOps:** o texto deve dizer que RevOps **não é dono do cliente**. RevOps define as regras do jogo; quem joga são as outras 7 áreas. RevOps também não deve virar o centro do Backbone: tem só 3 relações (ver §5).

**Plano B (se o autor quiser manter Marca por razão editorial):** usar 9 colunas, com RevOps como a 9ª. O ganho é preservar o assunto "promessa da marca", que conversa com o público do canal. O custo é refazer o layout dos cubos (hoje 4 + 4 por fachada) e ficar com uma coluna de pouca prática de CRM. **Não recomendo.** A troca deixa o prédio mais real sem mudar o 3D.

---

## 5. Relações

### 5.1 Revisão das 16 relações atuais

| # | Relação atual | Veredito | Comentário |
|---|---|---|---|
| 1 | Marca – Marketing (rooftop) | **sai** | vira assunto interno de Marketing |
| 2 | Produto – Marca (rooftop) | **cortar** | promessa de marca não passa por registro no CRM |
| 3 | Marketing → Vendas (heart) | **manter, forte** | a passagem que mais quebra. Ajustar o `why` com o prazo de resposta e a devolução com motivo |
| 4 | Vendas → Operações (heart) | **manter, forte** | pedido ou escopo vira ordem de serviço |
| 5 | Vendas → CS (heart) ★ | **manter ★** | |
| 6 | Atendimento – CS (heart) | **manter** | tickets por conta entram na saúde da conta |
| 7 | Operações – Atendimento (heart) | **manter, forte em B2C** | "onde está meu pedido" é o motivo nº 1 do SAC em e-commerce |
| 8 | Produto – Operações (heart) | **cortar** | abstrato ("lançamento precisa caber no processo"); quase não passa registro |
| 9 | Marketing – Financeiro (brain) | **absorver** em RevOps–Financeiro | o custo por cliente (CAC) é calculado por RevOps e FP&A com dado do CRM e do ERP, não por Marketing |
| 10 | Vendas – Financeiro (brain) | **mover para o Heart** como passagem | o que acontece de verdade, todo dia, é pedido ganho virar NF e desconto pedir aprovação. O forecast vai para RevOps–Vendas |
| 11 | Produto – CS (brain) | **manter** | real em SaaS |
| 12 | Financeiro – Operações (brain) | **cortar** | custo de servir é assunto de controladoria, não de CRM |
| 13 | CS → Marketing (feedback) ★ | **manter, sem ★** | real, mas menos frequente e menos visível |
| 14 | Atendimento → Produto (feedback) ★ | **manter ★** | |
| 15 | Marca → Atendimento | **trocar** por Marketing → Atendimento | a versão real: promoção sai e o SAC não conhece as regras |
| 16 | Financeiro → CS | **manter, promover a ★** | |

### 5.2 Passagens que mais quebram em empresas de verdade (e faltavam)

1. **Vendas → Financeiro:** desconto fora da política descoberto depois da assinatura; NF com valor errado; cadastro incompleto trava o faturamento.
2. **CS → Vendas (expansão):** ninguém sabe quem fica com a comissão; o vendedor oferece upgrade a uma conta em crise.
3. **Atendimento → Financeiro:** o cliente pede estorno 3 vezes, e cada atendente abre um pedido novo.
4. **Marketing → Atendimento:** promoção no ar sem que o SAC saiba as regras do cupom.
5. **Operações → Financeiro:** fatura emitida antes do aceite; estorno feito antes de a devolução chegar.
6. **Produto → Marketing:** a régua manda "complete seu cadastro" para quem já completou, porque o evento de uso não chega.
7. **RevOps → todas:** a regra mudou na planilha e não mudou no CRM; cada vendedor entende "proposta enviada" de um jeito.

### 5.3 Conjunto recomendado: 18 relações

Andar: H = Heart (passagem ou dependência), B = Brain (meta compartilhada), H→B ou B→H = retorno entre andares.

| # | De → Para | Andar | Natureza | Objeto do CRM que passa | O que passa (`why`, até 15 palavras) | Onde quebra (novo campo `breaks`) |
|---|---|---|---|---|---|---|
| 1 | Marketing → Vendas | H | passagem | **Lead (MQL) → oportunidade** | Lead com origem e score, com prazo de resposta; o descarte volta com motivo. | Lead fica dias sem dono; cada área culpa a outra. |
| 2 | **Vendas → CS** ★ | H | passagem | **Conta + contrato + notas de passagem** | O que foi prometido na venda chega a quem cuida do cliente. | O CS descobre a promessa na primeira reunião com o cliente. |
| 3 | Vendas → Operações | H | passagem | **Pedido / escopo → ordem de serviço** | Escopo, prazo e endereço vendidos viram execução. | Prazo prometido que a operação não tem. |
| 4 | Vendas → Financeiro | H | passagem | **Pedido ganho + cadastro fiscal → fatura/NF** | Condição aprovada vira cobrança correta; desconto fora da política pede aprovação antes. | NF errada; desconto descoberto depois da assinatura. |
| 5 | CS → Vendas | H | passagem | **Oportunidade de expansão** | CS identifica a necessidade; Vendas fecha com o contexto da conta. | Disputa de comissão; abordagem a conta em crise. |
| 6 | Atendimento ↔ CS | H | passagem | **Tickets por conta / escalonamento** | Chamados entram na saúde da conta; casos críticos chegam ao CSM. | O CSM descobre 9 chamados na reunião de renovação. |
| 7 | Operações → Atendimento | H | dependência | **Status do pedido / ocorrência** | Rastreio e atraso visíveis para quem atende, antes do cliente perguntar. | "Onde está meu pedido" lota a fila. |
| 8 | Marketing → Atendimento | H | dependência | **Campanha / oferta com regras** | Regras de cupom, prazo e público chegam ao SAC antes do disparo. | Promoção sai e o SAC não sabe responder. |
| 9 | Atendimento → Financeiro | H | passagem | **Pedido de estorno, contestação ou 2ª via** | Solicitação com fatura e motivo vai a quem resolve. | O cliente repete o pedido em 3 contatos. |
| 10 | Operações → Financeiro | H | passagem | **Entrega concluída / aceite; devolução** | O aceite libera o faturamento; a devolução confirmada libera o estorno. | Faturar antes do aceite; estornar sem devolução. |
| 11 | Produto → Marketing | H | dependência | **Evento de uso (ativou / parou)** | O uso real decide a próxima mensagem da régua de ativação. | E-mail pede uma ação que o cliente já fez. |
| 12 | RevOps → Marketing | H | dependência | **Regras do lead: score, distribuição, SLA** | Regras únicas de quando o lead passa e para quem. | A regra mudou na planilha, não no CRM. |
| 13 | **Financeiro → CS** ★ | B→H | dependência | **Status de pagamento / inadimplência** | Fatura vencida muda a prioridade e o tom do CS. | Oferta de upgrade a cliente com 2 faturas atrasadas. |
| 14 | **Atendimento → Produto** ★ | H→B | retorno | **Motivos de ticket + pedidos de melhoria por conta** | Volume por motivo e receita das contas afetadas priorizam o roadmap. | Motivo em texto livre; ninguém consegue somar. |
| 15 | CS → Marketing | H→B | retorno | **Motivo de cancelamento, NPS, indicação** | Quem fica e quem sai redefine o público e as mensagens. | Marketing segue atraindo o perfil que mais cancela. |
| 16 | Produto – CS | B | meta compartilhada | **Uso por conta / tempo até o primeiro valor** | Adoção é meta das duas áreas. | Cada área mede adoção de um jeito. |
| 17 | RevOps – Vendas | B | meta compartilhada | **Etapas do funil + forecast** | Critério igual de etapa torna a previsão confiável. | Forecast vira chute; cada vendedor usa um critério. |
| 18 | RevOps – Financeiro | B | meta compartilhada | **Receita do CRM × ERP; custo por origem; comissão** | O número da reunião comercial bate com o do Financeiro. | Dois números de receita na mesma diretoria. |

**Rooftop:** nenhuma relação. O rooftop é a "superfície" e os cabos verticais já fazem esse papel. O tipo `rooftop` em `RelationLevel` pode ficar sem uso.

**Relações por área:**

| Área | Marketing | Vendas | Produto | Atendimento | CS | Financeiro | Operações | RevOps |
|---|---|---|---|---|---|---|---|---|
| Relações | 5 | 6 | 3 | 5 | 6 | 5 | 3 | 3 |

- Vendas e CS empatam, e Atendimento vem logo atrás. Vendas não fica sozinho no centro.
- RevOps tem só 3 relações, de propósito, para não virar o "hub do CRM".
- **Se for preciso voltar a 16:** tirar a 10 (Operações → Financeiro) e a 18 (RevOps – Financeiro). Operações e RevOps ficam com 2 relações cada.

### 5.4 As 3 relações-chave

1. **Vendas → CS** (conta + contrato + notas de passagem). A promessa precisa sobreviver à troca de área. É a prova de que a venda não é o fim.
2. **Financeiro → CS** (status de pagamento). É a área que ninguém associa a CRM, e a falha é absurda e memorável: oferecer upgrade a quem está inadimplente. **Troca a atual CS → Marketing.** Em B2C, o equivalente é Financeiro → Marketing/Atendimento.
3. **Atendimento → Produto** (motivo do ticket + conta). Mostra o dado voltando para a decisão (FR-08) e liga o operacional ao estratégico.

**Por que Marketing → Vendas não é chave:** é a única relação que todo mundo já associa a CRM. Destacá-la reforçaria a ideia de que "CRM é funil de vendas". Ela continua visível, só não fica em destaque.

As 3 chaves também cobrem os três sentidos do prédio: passagem no Heart, Brain → Heart e Heart → Brain.

---

## 6. Padrão de conteúdo prático (fase 2)

### 6.1 Princípio

Cada aba do painel responde **uma pergunta prática**, e cada item cita **um objeto do CRM ou um momento real**.

| Aba | Pergunta |
|---|---|
| Visão | O que esta área faz com o cliente e o que muda com CRM? |
| Brain | O que ela decide, com qual número, em qual reunião? |
| Heart | Quem faz, em que ordem, e para quem passa? |
| Backbone | O que ela registra, qual campo não pode faltar, o que o sistema faz sozinho, e como o dado volta? |

**Orçamento de leitura por aba** (texto visível sem clicar):

| Aba | Limite |
|---|---|
| Visão | 110 palavras |
| Brain | 90 palavras |
| Heart | 100 palavras + 45 palavras por subárea aberta |
| Backbone | 110 palavras |

### 6.2 Avaliação das ideias propostas

| Ideia | Decisão | Como entra |
|---|---|---|
| "Um dia na área" / cena real | **Aceita, enxuta** | `dayInLife` no Heart: 3 batidas "horário · ação". Mais que isso vira crônica. |
| Objetos e campos que a área cria, edita ou consulta | **Aceita: é o campo mais importante** | `crmObjects` no Backbone, com selo C/E/V (cria, edita, vê) e a área dona quando o objeto vem de fora. Substitui `produces`, `consumes` e `signals`. |
| "Sem CRM / com CRM" | **Aceita** | `withoutCrm` e `withCrm` na Visão, em linhas pareadas. É o melhor recurso didático da lista e substitui `crmConnection`. |
| Erros comuns e armadilhas | **Aceita** | `pitfalls` no Heart: 3 itens. Os erros de dado vão no `criticalField` do Backbone. |
| Exemplo com números ilustrativos | **Aceita** | `scenario` na Visão: um caso de cliente em 3 a 4 passos com horário ou valor, marcado "ilustrativo". Substitui `example`. |
| Automações típicas | **Aceita** | `automations` no Backbone: 2 a 3 regras "Quando… → então…". |
| A pergunta que a área responde com o CRM | **Aceita** | `keyQuestion` no topo da Visão. É a âncora do painel. |
| Perfil e cargos | **Aceita, só cargos** | `roles` no Heart: 3 a 4 cargos reais. "Perfil" (competências) fica de fora, porque vira texto de vaga. |
| Diferenças B2B/B2C | **Aceita e melhorada** | `variants` na Visão com **3** linhas fixas: B2B · B2C · **empresa pequena**. O porte muda mais do que o modelo de negócio (na pequena, 1 pessoa faz tudo, muitas vezes no WhatsApp e na planilha). |
| (novo) Ritual de decisão | **Acrescentar** | `ritual` no Brain: a reunião em que o número do CRM vira decisão ("forecast de segunda"). Liga o Brain à realidade. |
| (novo) Campo crítico | **Acrescentar** | `criticalField` no Backbone: o campo que, se vier errado, estraga tudo depois. |
| (novo) Fonte do indicador | **Acrescentar** | cada indicador ganha `source`: de qual objeto e campo o número sai. |
| (novo) Passagem por subárea | **Acrescentar (pedido do briefing)** | `handoff: { to, object }` em cada subárea que entrega para outra área. O 3D pode desenhar a estação apontando para a coluna de destino. |

### 6.3 O que manter, cortar e acrescentar em `types.ts`

| Campo atual | Decisão | Vira |
|---|---|---|
| `oneLiner` | manter, reescrever | 1 frase com verbo concreto + objeto |
| `role` | **cortar** | duplica `oneLiner` |
| `crmConnection` | **cortar** | `withoutCrm` + `withCrm` |
| `example` | **cortar** | `scenario` |
| `context` | **cortar** | `variants` (b2b, b2c, small) |
| `brain.objectives` | manter | 3 itens |
| `brain.decisions` | manter | 3 perguntas |
| `brain.indicators` | **ajustar** | `{ name, source }[]` |
| `brain.customerImpact` | manter | 1 frase |
| `heart.routine` | manter | é usado pelo posto 3D e pelo `menuLine` |
| `heart.subAreas` | **ajustar** | `signal` vira `record`; entram `handoff` e `context` |
| `heart.processes` | **cortar** | repete as subáreas |
| `backbone.signals` | **cortar** | `crmObjects`. Atenção: `menuLine()` em `chapters.ts` usa `signals`; trocar pelos 3 primeiros `crmObjects[].object` |
| `backbone.capabilities` | **ajustar** | `neighborSystems` (2 a 4 tipos genéricos, sem marca) |
| `backbone.produces` / `consumes` | **cortar** | `crmObjects` com ação e dono |
| `backbone.feedback` | **ajustar** | `{ data, decision }` |
| `backbone.governance` | manter | 1 frase sobre quem vê o quê |
| `Relation` | **ajustar** | entram `object` (obrigatório) e `breaks` (opcional) |

**Proposta de tipo** (apenas referência para a fase de código):

```ts
type CrmAction = "cria" | "edita" | "vê";

interface CrmObject {
  object: string;          // "Ticket" — nome único usado no projeto todo
  actions: CrmAction[];    // o que ESTA área faz com ele
  fields: string[];        // 3–4 campos-chave
  owner?: DepartmentId;    // quando o objeto é de outra área
}

interface SubArea {
  id: string;
  name: string;                       // ≤ 3 palavras
  context?: "b2b" | "b2c";            // quando só existe em um modelo
  process: { origin: string; decision: string; output: string };
  handoff?: { to: DepartmentId; object: string };  // para quem vai a saída
  record: string;                     // o que fica registrado no CRM
  customerImpact: string;
}

interface AreaContent {
  id: DepartmentId;
  oneLiner: string;
  keyQuestion: string;
  withoutCrm: string;
  withCrm: string;
  scenario: { steps: string[]; outcome: string };
  variants: { b2b: string; b2c: string; small: string };
  brain: {
    objectives: string[];
    decisions: string[];
    indicators: { name: string; source: string }[];
    ritual: string;
    customerImpact: string;
  };
  heart: {
    routine: string;
    roles: string[];
    dayInLife: { time: string; action: string }[];
    subAreas: SubArea[];       // 2–4
    pitfalls: string[];
  };
  backbone: {
    crmObjects: CrmObject[];   // 3–5
    criticalField: string;
    automations: { when: string; then: string }[];
    neighborSystems: string[];
    feedback: { data: string; decision: string };
    governance: string;
  };
}

interface Relation {
  a: DepartmentId; b: DepartmentId;
  floor: RelationLevel; floorB?: RelationLevel;
  key?: boolean;
  nature: "handoff" | "meta compartilhada" | "dependência" | "feedback";
  object: string;   // NOVO: "Pedido ganho → fatura/NF"
  why: string;      // ≤ 15 palavras
  breaks?: string;  // NOVO: ≤ 12 palavras
}
```

### 6.4 Ficha de cada campo: aba e tamanho máximo

| Campo | Aba | Tamanho máximo | Regra |
|---|---|---|---|
| `oneLiner` | hover + Visão | 1 frase, até 12 palavras | verbo concreto + objeto do CRM |
| `keyQuestion` | Visão (topo) | 1 pergunta, até 14 palavras | pergunta que a área faz **ao CRM** |
| `withoutCrm` | Visão | 1 frase, até 20 palavras | uma dor real e visível, sem drama |
| `withCrm` | Visão | 1 frase, até 20 palavras | o que se vê ou faz diferente; nada de "melhora" ou "otimiza" |
| `scenario.steps` | Visão | 3 a 4 passos, até 15 palavras cada | começar com horário ou valor; marcado "ilustrativo" |
| `scenario.outcome` | Visão | 1 frase, até 15 palavras | o dado que fica e para onde vai |
| `variants` | Visão | 3 linhas, até 15 palavras cada | B2B · B2C · empresa pequena |
| `brain.objectives` | Brain | 3 itens, até 6 palavras | verbo no infinitivo |
| `brain.decisions` | Brain | 3 perguntas, até 12 palavras | decisões que se tomam com dado do CRM |
| `brain.indicators` | Brain | 3 itens: nome até 5 palavras + fonte até 8 | sem número de mercado |
| `brain.ritual` | Brain | 1 frase, até 15 palavras | quando, quem, o que olha |
| `brain.customerImpact` | Brain | 1 frase, até 15 palavras | o que o cliente percebe |
| `heart.routine` | Heart + 3D | 1 frase, até 12 palavras | descreve o posto da maquete |
| `heart.roles` | Heart | 3 a 4 cargos, até 4 palavras cada | títulos reais do mercado brasileiro |
| `heart.dayInLife` | Heart | 3 batidas: horário + ação de até 12 palavras | cita canal ou objeto |
| `subAreas[].name` | Heart (estação) | até 3 palavras | |
| `subAreas[].process.*` | Heart (estação aberta) | 3 linhas, até 10 palavras cada | origem → decisão → saída |
| `subAreas[].handoff` | Heart (estação aberta) | área + objeto, até 6 palavras | obrigatório quando a saída sai da área |
| `subAreas[].record` | Heart (estação aberta) | até 8 palavras | objeto + campos |
| `subAreas[].customerImpact` | Heart (estação aberta) | até 12 palavras | |
| `heart.pitfalls` | Heart | 3 itens, até 14 palavras | erro concreto + consequência |
| `backbone.crmObjects` | Backbone | 3 a 5 objetos × 3 a 4 campos | selo C/E/V; dono quando for de fora |
| `backbone.criticalField` | Backbone | 1 frase, até 18 palavras | campo + o que quebra sem ele |
| `backbone.automations` | Backbone | 2 a 3 regras, até 14 palavras | "Quando… → então…" |
| `backbone.neighborSystems` | Backbone | 2 a 4 itens, até 3 palavras | categorias genéricas, nunca marcas |
| `backbone.feedback` | Backbone (destaque) | dado até 10 + decisão até 12 palavras | sempre termina numa decisão do Brain |
| `backbone.governance` | Backbone ("Cuidado") | 1 frase, até 18 palavras | quem vê o quê; sem parecer jurídico |

### 6.5 Exemplo completo: Atendimento

> Números e horários são ilustrativos. No painel, um selo "ilustrativo" aparece uma vez, no `scenario`.

**Visão**
- **oneLiner:** Recebe o cliente com problema, resolve e registra o motivo.
- **keyQuestion:** Quem está com problema agora, há quanto tempo e por quê?
- **Sem CRM:** O cliente reclama no WhatsApp, liga no dia seguinte e conta tudo de novo a outra pessoa.
- **Com CRM:** Quem atende vê contatos anteriores, pedido e fatura na mesma tela. Ninguém pede a história de novo.
- **Caso (ilustrativo):**
  1. 09h12: cliente escreve no WhatsApp: "fui cobrado duas vezes".
  2. 09h14: ticket aberto; a tela mostra a fatura paga e um contato de ontem.
  3. 09h20: o N1 envia ao Financeiro um pedido de estorno com a fatura anexada.
  4. 11h00: estorno confirmado; ticket fechado com o motivo "cobrança duplicada".
  - **Desfecho:** no fim do mês, "cobrança duplicada" é o 3º motivo da fila e vai para Financeiro e Produto.
- **Variações:**
  - **B2B:** poucos clientes, casos técnicos; o ticket fica ligado à conta e ao contrato.
  - **B2C:** alto volume no WhatsApp e no chat; pedido e entrega lideram os motivos.
  - **Empresa pequena:** uma pessoa atende pelo celular; o histórico fica preso na conversa.

**Brain**
- **Objetivos:** Resolver no primeiro contato · Cumprir o prazo prometido (SLA) · Reduzir contatos repetidos.
- **Decisões:**
  1. Quais motivos atacar na causa neste mês?
  2. Quantas pessoas por canal e por horário?
  3. O que escalar para outra área, e com qual prazo?
- **Indicadores:**
  - Tempo de 1ª resposta: abertura × 1ª resposta do ticket.
  - Resolução no 1º contato: tickets fechados sem reabertura.
  - Contatos por motivo: campo "motivo" do ticket.
- **Ritual:** Reunião de segunda: os 5 motivos que mais cresceram e os SLAs estourados.
- **Para o cliente:** O problema é resolvido de vez, sem repetir a história.

**Heart**
- **Rotina (posto 3D):** Fila em vários canais: baias e painel da fila.
- **Cargos:** Analista de atendimento (N1) · Especialista de suporte (N2) · Supervisor de atendimento · Analista de qualidade.
- **Um dia:**
  - 08h: o supervisor confere a fila da noite e os SLAs vencendo.
  - 11h: o N1 responde chat, WhatsApp e e-mail numa fila única.
  - 17h: a qualidade revisa 10 atendimentos e ajusta as respostas prontas.
- **Subáreas:**

| Subárea | Origem → Decisão → Saída | Passa para | Registro no CRM | Para o cliente |
|---|---|---|---|---|
| **N1 / Linha de frente** | Contato chega por WhatsApp, chat, e-mail ou telefone → identificar o cliente, classificar o motivo, resolver ou escalar → ticket resolvido ou escalado com histórico | (interno: N2) | Ticket: cliente, canal, motivo, prioridade | Ninguém pede para contar tudo de novo. |
| **N2 / Especialistas** | Caso escalado pelo N1 → resolver aqui ou acionar a área dona do problema → solicitação com evidência anexada | **Financeiro**: pedido de estorno com fatura | Ticket vinculado à fatura ou ao pedido | O caso difícil tem dono e prazo. |
| **Qualidade e voz do cliente** | Notas de satisfação (CSAT) e reaberturas da semana → qual motivo cresce e qual resposta falha → relatório de motivos e respostas prontas ajustadas | **Produto**: motivos com volume e contas afetadas | Motivo e CSAT por ticket | O mesmo problema aparece menos. |
| **Ouvidoria e canais públicos** (B2C) | Reclamação em site público, rede social ou Procon → responder no prazo, com tom combinado com Marketing → caso resolvido em privado e resposta pública | **Marketing**: caso com risco de reputação | Ticket com origem "canal público" | A reclamação pública recebe resposta, não silêncio. |

- **Armadilhas:**
  - Motivo em texto livre: depois ninguém consegue somar.
  - Fechar o ticket sem resolver, só para bater a meta de tempo.
  - WhatsApp no celular pessoal: o histórico vai embora com a pessoa.

**Backbone**
- **Objetos do CRM:**

| Objeto | Ação | Campos-chave | Dono |
|---|---|---|---|
| Ticket | C · E | canal, motivo, prioridade, status, prazo | Atendimento |
| Contato | V · E | telefone, e-mail, canal preferido | Marketing / Vendas |
| Pedido | V | status, rastreio, prazo prometido | Operações |
| Fatura | V | status de pagamento, vencimento | Financeiro |
| Avaliação (CSAT) | C | nota, comentário | Atendimento |

- **Campo crítico:** O motivo do contato, escolhido de uma lista fechada. Sem ele, não existe causa-raiz nem relatório para Produto.
- **Automações:**
  - Quando o ticket passa 1h sem resposta → alerta ao supervisor.
  - Quando há ticket crítico aberto → pausa os e-mails promocionais para o cliente.
  - Quando o ticket fecha → envia pesquisa de 1 pergunta.
- **Sistemas vizinhos:** Help desk · Canais de mensagem · Base de conhecimento · Telefonia.
- **O dado volta para a decisão:** "cobrança duplicada" cresce 3 semanas seguidas → Financeiro revisa a régua e Produto corrige o checkout.
- **Cuidado:** Motivo e status do ticket podem ser vistos por outras áreas; o texto da conversa, só por quem atende.

---

## 7. Briefing para a fase 2

Cada área é revisada por uma dupla: eu (CRM/RevOps) + um especialista da área.

### Marketing
**Especialista:** Gerente de Marketing de Demanda B2B com vivência em Marketing Ops. Para a variação B2C, consultar alguém que já coordenou um "time de CRM" (régua e retenção) em varejo ou app.
1. Definir quando o lead vira MQL, o prazo de resposta de Vendas e o campo "motivo de descarte" que volta para Marketing.
2. Juntar "Growth/Aquisição" e "Performance/Mídia" numa subárea "Demanda". Hoje os processos se repetem.
3. Explicar que, em B2C, o "time de CRM" é a subárea Lifecycle de Marketing, e usar isso a favor da tese.
4. Absorver Marca como "Marca & Conteúdo", com o que é real no CRM: tom de mensagens sensíveis e modelos de mensagem.
5. Escrever os objetos: lead, contato, campanha, segmento, consentimento/descadastro.
6. Eliminar "orquestrar", "jornada" e "relevante" do `oneLiner` e do `crmConnection` atuais.

### Vendas
**Especialista:** Gerente comercial B2B de venda consultiva (ciclo de semanas a meses) que conduz o forecast semanal.
1. Definir as etapas com **critério de saída** (o que precisa ser verdade para avançar).
2. Listar os campos obrigatórios: valor, data prevista, próximo passo, motivo de perda.
3. Reescrever a passagem para CS, Financeiro e Operações com o vendedor como dono. Sales Ops sai da área.
4. Incluir a aprovação de desconto antes da assinatura.
5. Criar a subárea Parceiros/Representantes, que é a realidade de indústria e distribuição no Brasil.
6. Corrigir o `context`: e-commerce não tem oportunidade; venda consultiva B2C (imóveis, educação) tem.

### Produto
**Especialista:** Product Manager de SaaS B2B que prioriza com dado de suporte e de uso. Para a variação, ouvir um gerente de categoria de varejo.
1. Cortar o que não é CRM: feature flags e a lista genérica de `processes`.
2. Definir 3 eventos de uso que outras áreas consomem (ex.: ativou, convidou um colega, parou de usar).
3. Criar o objeto "pedido de melhoria" ligado à conta e à receita.
4. Escrever as variações de varejo (sortimento) e de serviços (portfólio) de forma concreta.
5. Marcar o PQL como contexto de PLG, não como regra.

### Atendimento
**Especialista:** Coordenador(a) de SAC omnichannel (WhatsApp, chat, telefone) de e-commerce ou serviços B2C. Validar a variação B2B com alguém de suporte SaaS.
1. Montar uma lista fechada de motivos em 2 níveis (ex.: Cobrança > Duplicidade).
2. Definir o SLA por canal, com números ilustrativos e plausíveis.
3. Escrever os motivos que conectam com outras áreas: 2ª via, estorno, "onde está meu pedido".
4. Validar a automação de pausa de promoção quando há ticket crítico.
5. Criar a subárea Ouvidoria e canais públicos (absorve a reputação que estava em Marca).
6. Escrever no painel a fronteira com CS (tabela do §2).

### CS
**Especialista:** Head de Customer Success de SaaS B2B (carteira, renovação, health score).
1. Definir os campos mínimos das notas de passagem que Vendas preenche.
2. Definir o que entra no health score, deixando claro que ele "existe quando a empresa define".
3. Criar data de renovação e motivo de cancelamento como campos de lista fechada.
4. Definir a regra de expansão: quem identifica e quem fecha.
5. Escrever a versão B2C (Retenção/Fidelidade) e a de empresa pequena (o vendedor faz CS).
6. Tirar "CRM" da lista de capacidades.

### Financeiro
**Especialista:** Gerente de contas a receber e faturamento de empresa B2B com receita recorrente, com prática em NF e régua de cobrança.
1. Trocar "Controladoria / Unit Economics" por "Crédito e aprovação".
2. Listar os campos do cadastro fiscal que travam a NF.
3. Definir o que o CRM mostra do pagamento: status e vencimento, sem detalhe bancário.
4. Decidir quem é fonte da verdade: ERP para fatura, CRM para contrato.
5. Escrever a passagem de estorno e 2ª via com Atendimento.
6. Reescrever o `oneLiner` em linguagem de quem trabalha no Financeiro.

### Operações
**Especialista:** Gerente de implantação de serviços B2B. Para a face B2C, ouvir um coordenador de logística de e-commerce.
1. Separar as subáreas por contexto: Implantação (B2B) e Logística (B2C), com `context`.
2. Criar o campo "prazo prometido × prazo real" no pedido ou na ordem de serviço.
3. Fazer o aceite/go-live liberar o faturamento (Financeiro) e o onboarding (CS).
4. Deixar o rastreio e a ocorrência visíveis ao SAC antes do contato do cliente.
5. Escrever no painel a fronteira com CS (entrega × resultado).

### RevOps (nova)
**Especialista:** Gerente de RevOps ou administrador de CRM de empresa média B2B, com experiência em integração CRM–ERP.
1. Escrever a área do zero, deixando claro que **RevOps não é dona do cliente: define as regras**.
2. Definir as subáreas: Administração do CRM · Regras e passagens · Dados e relatórios · Integrações e acesso.
3. Escrever a versão de empresa pequena (o gerente comercial "cuida do CRM") e a B2C ("CRM & BI").
4. Mostrar a rotina real: duplicados, campos vazios, pedidos de novo campo, permissões.
5. Escrever a governança LGPD prática (acesso por perfil, prazo de guarda, consentimento) sem dar parecer jurídico.
6. Manter só 3 relações e evitar qualquer imagem de "centro".

---

## 8. Regras de redação para todos

### 8.1 Tom
- Direto, no presente e em 3ª pessoa da área ("Vendas registra…", "O N1 classifica…").
- Uma ideia por frase, com até 20 palavras.
- Escrever como um profissional experiente explicaria a um colega novo, não como um folheto.

### 8.2 Fórmula da frase prática
**Quem + verbo concreto + objeto do CRM + quando ou condição.**
- Ruim: "Vendas garante uma experiência comercial coerente."
- Bom: "O vendedor marca a perda com motivo antes de fechar a oportunidade."

### 8.3 Dois testes antes de aprovar um texto
1. **Teste da troca:** troque o nome da área por outra. Se a frase continua verdadeira, ela é genérica. Exemplo: "Coletar e compartilhar só o necessário, com finalidade definida" serve para qualquer área.
2. **Teste do crachá:** um profissional da área lê e diz "é isso que eu faço". Se ele franzir a testa, reescreva.

### 8.4 Palavras proibidas (ou só com complemento concreto)
- Proibidas: orquestrar, alavancar, potencializar, sinergia, holístico, 360°, ecossistema, robusto.
- Só com complemento concreto:
  - "jornada" (diga qual etapa);
  - "relevante" e "contextual" (diga relevante para quem e por quê);
  - "experiência" (diga qual momento);
  - "inadequado" (diga o que acontece);
  - "coerente" e "consistente" (diga com o quê).

### 8.5 Jargão: permitido com glossário
Use o termo do mercado, porque o visitante vai encontrá-lo no trabalho, mas explique na primeira vez em que aparece no painel. A sugestão é um glossário único (`glossary.ts`) exibido como dica ao passar o mouse.

| Termo | Definição curta |
|---|---|
| Lead | pessoa ou empresa que demonstrou interesse e ainda não comprou |
| MQL / SQL | lead aprovado por Marketing / aceito por Vendas para abordagem |
| Oportunidade | negociação aberta, com valor e data prevista |
| Funil (pipeline) | etapas pelas quais as oportunidades passam até ganho ou perda |
| Forecast | previsão de vendas do período, feita a partir do funil |
| SLA | prazo combinado para responder ou resolver |
| Ticket | registro de um pedido de ajuda do cliente |
| N1 / N2 | primeiro nível de atendimento / especialistas |
| CSAT | nota de satisfação logo após um atendimento |
| NPS | pergunta "recomendaria a empresa?", de 0 a 10 |
| Churn | cliente que cancelou ou não renovou |
| Health score | nota de saúde da conta, que soma uso, chamados e pagamento |
| Onboarding | primeiros passos do cliente depois da compra |
| Upsell / expansão | venda adicional para quem já é cliente |
| Régua | sequência automática de mensagens com regras de envio |
| Opt-out | pedido do cliente para não receber mais mensagens |
| ERP | sistema de gestão onde ficam nota fiscal, estoque e financeiro |
| Help desk | sistema onde os tickets são atendidos |
| Go-live / aceite | momento em que o cliente confirma que a entrega está pronta |

### 8.6 Onde usar exemplo concreto
- **Obrigatório:** `scenario`, `dayInLife`, `pitfalls`, `automations`, `criticalField`, `feedback` e `breaks` das relações.
- **Proibido:** `oneLiner` (precisa ser geral o bastante para o hover) e `objectives`.
- Números são **ilustrativos**: redondos, plausíveis e com o selo "ilustrativo" uma vez por painel. Horários, prazos e contagens pequenas ("3 contatos", "SLA de 1h") funcionam melhor que porcentagens.

### 8.7 O que nunca escrever
- **Benchmarks de mercado** ("a conversão média é 2%", "empresas com CRM vendem 30% mais").
- **Nomes de software de CRM, help desk, ERP ou automação**, nem como exemplo. Use categorias: "help desk", "ERP", "automação de marketing".
- **Promessas de resultado** ("o CRM resolve", "elimina o retrabalho"). Prefira "permite", "deixa visível", "evita quando…".
- **Universais:** "toda empresa tem", "sempre". Prefira "em geral", "costuma", "em empresas pequenas".
- **Health score, IA ou previsão automática como algo que toda empresa tem.**
- **Afirmações jurídicas** sobre LGPD (o que é legal ou não). Diga "com finalidade e base legal definidas" e "acesso por responsabilidade".

**O que pode ser nomeado:** canais (WhatsApp, e-mail, telefone, chat) e documentos e meios de pagamento brasileiros (NF, boleto, Pix, CNPJ, Procon). Eles são a realidade do visitante, não marcas de ferramenta. Sites de reclamação entram sem marca: "site público de reclamação".

### 8.8 Um nome por objeto
- Escolha um termo e use sempre: **ticket** (e não chamado, caso e protocolo misturados), **oportunidade** (e não negócio ou deal), **conta** para empresa-cliente e **contato** para a pessoa.
- O glossário registra os sinônimos ("ticket, também chamado de chamado ou protocolo").

### 8.9 Antes → depois (reescritas do conteúdo atual)

| Atual (`areas.ts` / `chapters.ts`) | Proposta |
|---|---|
| Marketing `oneLiner`: "Constrói demanda relevante e orquestra comunicações ao longo da jornada." | "Atrai interessados, registra de onde vieram e entrega o lead a Vendas." |
| Financeiro `oneLiner`: "Torna claras, corretas e sustentáveis as condições econômicas da relação." | "Aprova condições, emite a nota e acompanha se o cliente pagou." |
| Atendimento `crmConnection`: "Reconhecer um problema já relatado evita abordagens inadequadas…" | Sem CRM: "O cliente reclama no WhatsApp e, no dia seguinte, recebe uma promoção por e-mail." Com CRM: "Ticket crítico aberto pausa as promoções até a resolução." |
| CS `example`: "Um sinal de queda de uso gera investigação de CS antes de enviar uma oferta de renovação." | "Uso caiu pela metade em 30 dias (ilustrativo) → o CSM liga antes da renovação, não depois." |
| Guiado Brain (Financeiro): "reduzir fricções de pagamento e manter a relação viável." | "Financeiro: cobrar o valor certo e avisar CS quando há atraso." |
| Produto `capabilities`: "Event tracking, Analytics de produto, Feature flags…" | `crmObjects`: "Pedido de melhoria (C): conta, tema, receita das contas que pediram." |
