# Sprint 02: experiência com scroll

**Rota:** `/crm-como-sistema` (a raiz `/` redireciona para ela). O laboratório do Sprint 01 continua em `/lab/building`.

**Fontes de conteúdo:**
- os documentos de pré-produção em `../gui_block_crm_como_sistema/` (01 mapa das áreas, 02 roteiro, 03 storyboard, 04 PRD);
- as recomendações do especialista em CRM/RevOps ([RECOMENDACOES_AREAS.md](RECOMENDACOES_AREAS.md)): indicadores, rotinas, dados que a área produz e consome, relações e contexto B2B/B2C.

O refinamento estético proposto pelo especialista (formas de gráfico nos quadros do Brain) ficou para depois, por decisão do autor.

## O que foi construído

| Briefing §8 | Como ficou |
|---|---|
| Câmera Rooftop → Brain → Heart → Backbone → síntese | 6 capítulos (rooftop, revelação, Brain, Heart, Backbone, síntese). Cada um tem uma pose de câmera e um ponto de repouso previsível. |
| Rota ligada ao scroll via GSAP/ScrollTrigger | Uma timeline única com `scrub`. O scroll é o nativo da página (sem scroll-jacking), e ida e volta funcionam. |
| `produto` aceso em todos os andares | Percurso guiado: ao chegar ao Brain sem nenhuma escolha feita, a experiência acompanha Produto. O visitante pode trocar de área a qualquer momento. |
| Painel educativo da área selecionada | Painel com o conteúdo **do andar atual**. Ações: fechar, trocar de área e ir ao próximo andar mantendo a área. |
| Usar os documentos de conteúdo e o PRD | O conteúdo está em `src/content/` (TS), separado do 3D (FR-10). |

### Arquitetura

```
src/content/        types · areas (8 áreas completas) · relations (16) · chapters (copy dos atos)
src/experience/
  ExperienceShell     estado mínimo (capítulo, área, painel, visitadas), Esc, percurso guiado
  useScrollStory      timeline GSAP + ScrollTrigger (useGSAP, limpeza automática)
  cameraPath          poses por capítulo, ritmo repouso/transição, saltos de navegação
  ExperienceCanvas    Canvas fixo + BuildingWorld + ExperienceCamera (só lê a pose)
  ChapterOverlay      texto do ato, exemplos guiados, ciclo e ações da síntese
  ChapterNav          5 momentos + "Ver áreas" + "Modo texto"
  AreaPanel           Brain / Heart (subáreas → processo) / Backbone / visão da área
  AreaIndex           lista das 8 áreas (<dialog>)
  LearningMap         mapa completo em texto: diálogo e fallback sem WebGL
src/scene/BuildingWorld   prédio compartilhado pelo laboratório e pela experiência
src/lib/                  hooks (movimento reduzido, WebGL), telemetry (eventos locais)
```

- **Um controlador por propriedade:** a timeline escreve uma pose em um objeto simples, e a câmera só lê esse objeto em `useFrame`. Clique e seleção nunca animam a câmera.
- **Ritmo:** cada capítulo tem um repouso de 0,55 tela e uma transição de 1 tela. A página tem cerca de 9,3 telas de altura.

### O que acontece em cada capítulo

- **Rooftop:** cubos anônimos, sem nomes (FR-02). O hover acende o cubo, mas não revela a área, e o clique fica desligado. Dois impulsos discretos percorrem os filamentos.
- **Revelação:** os nomes aparecem e o clique é liberado.
- **Brain / Heart / Backbone:**
  - os rótulos passam a ficar **sobre a área naquele andar** (quadro, posto, terminal), o que reforça a identidade espacial de cada área (FR-03);
  - o capítulo mostra 3 exemplos guiados, que podem ser clicados.
- **Backbone:** o impulso da área **sobe**, do terminal ao cubo, para mostrar o dado voltando à decisão (FR-08).
- **Síntese:** a tese, o ciclo decisão → execução → sinal → ajuste e as ações "Explorar outra área", "Rever um andar" e "Ver o mapa completo".

### Conteúdo do painel, por andar

- **Brain:** o que a área busca, decisões, indicadores (sem números), consequência para o cliente e conexões de estratégia.
- **Heart:** rotina do posto, subáreas e conexões de passagem de trabalho. Clicar numa subárea mostra o processo **origem → decisão → saída**, o sinal e o impacto para o cliente (FR-06). Há 2 a 4 subáreas por área, 25 no total.
- **Backbone:** sinais, o que a área produz e consome, capacidades, retorno para a decisão, cuidado de governança e conexões de retorno (FR-07).
- **Rooftop, revelação e síntese:** visão da área, com papel, "por que isso é CRM", exemplo, os três andares e o contexto B2B/B2C.

## Revisão 1: leitura e aprendizado (pedido do autor)

- **Texto da esquerda:** agora é um cartão com fundo próprio, centralizado na altura (antes ficava no canto inferior, sobre a cena escura).
- **Menu das 8 áreas** no lugar dos 3 exemplos:
  - cada área traz uma frase do andar atual;
  - os exemplos do roteiro aparecem marcados como "exemplo";
  - as áreas já visitadas ganham um ponto lime;
  - o hover acende o neurônio da área.
- **Painel de estudo:**
  - **abas Visão · Brain · Heart · Backbone,** com a cor de cada andar. Uma aba de andar também leva a câmera até ele;
  - **seções numeradas, cada uma no formato do conteúdo:**
    - tags para objetivos e sinais;
    - cartões numerados para decisões;
    - indicadores com um glifo de barras;
    - etapas em linha do tempo (origem → decisão → saída);
    - corrente de processos;
    - esquema "recebe → área → entrega";
    - conexões no formato área → área;
  - **bloco de destaque** ("Para o cliente", "O dado volta para a decisão");
  - **"Cuidado"** em caixa tracejada.
- **Limpeza:** saíram a barra "Acompanhando" (que cobria o conteúdo) e a pergunta repetida no painel. No lugar da barra, um botão "Estudando … →" reabre o painel.
- **Correção:** os efeitos do React agora não devolvem a Promise de `scrollTo()`. Navegadores mais novos devolvem uma Promise, e isso quebrava o painel.

## Revisão 2: conteúdo prático das áreas (pedido do autor)

O autor pediu que a explicação fosse prática e mostrasse a realidade de cada área em relação ao CRM. O trabalho foi feito em duas fases, com especialistas, e está todo em [conteudo/](conteudo/).

1. **Arquitetura das áreas** ([00_arquitetura_areas.md](conteudo/00_arquitetura_areas.md)): um arquiteto de CRM/RevOps avaliou as 8 áreas contra empresas reais e definiu o modelo de conteúdo prático e as regras de redação.
   - **Decisão do autor:** Marca virou subárea de Marketing, e **RevOps** (Operações de Receita e Dados) entrou na 8ª coluna. O prédio continua com 8 colunas; só mudaram o id (`revops`), o rótulo, o ícone (controles deslizantes) e o posto do Heart.
2. **Revisão em dupla** ([01](conteudo/01_marketing.md) a [08](conteudo/08_revops.md)): cada área foi reescrita por um especialista da área junto com o arquiteto.
3. **Consolidação** ([09_consolidacao.md](conteudo/09_consolidacao.md)): o arquiteto harmonizou os 8 arquivos (um nome e um dono por objeto do CRM), fechou as **18 relações**, o glossário (69 termos), as frases do percurso guiado e a lista do que ainda precisa de validação humana.

**O que mudou no site**
- `src/content/areas.ts` é gerado dos blocos `ts` dos arquivos 01–08; `relations.ts` vem do 09 §2; o glossário novo está em `glossary.ts`.
- **Visão:** pergunta que a área faz ao CRM, "sem CRM × com CRM", um caso passo a passo com números ilustrativos e um seletor **B2B · B2C · Pequena** (a escolha vale para todas as áreas durante a visita).
- **Brain:** objetivos, decisões, indicadores **com a origem do dado** e a reunião em que o número vira decisão.
- **Heart:** cargos, "um dia na área", estações com processo, **para quem vai a saída** (link para a área) e o que fica registrado no CRM, e erros comuns.
- **Backbone:** objetos do CRM com o que a área cria, edita ou só vê (e o dono, quando é de outra área), o campo que não pode faltar, o retorno para a decisão, os sistemas ao redor e as **automações recolhidas** ("Quando … → …").
- **Conexões:** cada relação mostra o que passa entre as áreas e onde costuma quebrar; a seta segue o sentido da relação.
- **Menu e percurso guiado:** frases novas (09 §5), com Produto nos três andares e as 3 relações-chave (Vendas → CS, Financeiro → CS, Atendimento → Produto). No Backbone, o menu mostra os objetos do CRM da área.
- **Modo texto:** traz o conteúdo novo completo e o glossário.

## Revisão 3: leitura de estudo, glossário e scroll (pedido do autor)

- **Tema de leitura claro/escuro:** botão no topo ("☀ Claro" / "☾ Escuro"). O padrão é **claro**, melhor para estudar, e a escolha fica salva neste navegador. Só as superfícies de texto mudam: o cartão do capítulo, o painel, as listas, o balão e a gaveta. A cena e o topo continuam escuros. No fundo claro, o lime vira um verde-oliva escuro (`--signal`), porque o lime não lê sobre papel.
- **Glossário na leitura:** os 69 termos de `glossary.ts` aparecem destacados no painel (cor levemente diferente, sublinhado pontilhado). Cada termo é destacado só na primeira vez que aparece, para o texto não virar um mar de sublinhados.
  - **Hover ou foco:** um balão mostra o resumo do conceito.
  - **Clique no termo ou no balão:** abre a **gaveta do glossário**, com busca sem acento (ex.: "saude" acha "Health score").
  - **Toque:** o primeiro toque mostra o balão, e o segundo abre a gaveta.
  - O botão "Glossário" no topo abre a gaveta com todos os termos.
  - Plurais e siglas são reconhecidos (leads, tickets, MQLs), e siglas só casam com a grafia exata (OS não casa com o artigo "os").
- **Scroll sem zona morta:**
  - **O problema:** antes, cada capítulo tinha um repouso parado de 0,55 tela, e o pouso da navegação ficava no meio dele. Por isso eram necessários 2 ou 3 giros da roda antes de a câmera se mover. Depois a transição (`power2`) disparava.
  - **Agora:** o repouso é mais curto (0,35) e não é parado, porque a câmera avança devagar (12% do caminho). A transição usa `sine.inOut` e a inércia caiu de 0,6 para 0,35.
  - Um teste mede a câmera depois de **um** giro da roda.

## Estações do Heart, etapa 1 (FR-06)

Decisões do autor (aceitando a recomendação): a câmera não se aproxima no clique, e as estações abrem só no capítulo Heart.

- **O posto se abre em estações:** com uma área escolhida no Heart, o posto dela se abre em 2 a 4 estações, uma por subárea. Cada estação tem base no piso, balcão e tela, e elas ficam à frente do posto, em zigue-zague. As estações saem do centro do posto, uma depois da outra, e voltam ao fechar (`src/scene/floors/HeartStations.tsx`).
  - **Movimento reduzido:** as estações aparecem prontas.
- **Ligadas ao painel nos dois sentidos:** a estação escolhida vive no estado da experiência (`subByArea`). Clicar numa estação (no 3D ou no número) escolhe a subárea e abre o painel nela, e escolher no painel acende a estação.
  - **Estação escolhida:** contorno lime no piso, tela azul e o nome numa etiqueta acima do número.
- **Rótulos:** são botões DOM numerados (`StationLabels`), com teclado e leitor de tela ("Estação 2: Executivos de vendas"). O nome aparece na estação escolhida e no hover ou foco, para os números não se sobreporem. No celular, aparece só o número.
- **Enquadramento:** as 4 áreas da fachada direita (CS, Financeiro, Operações e RevOps) ficavam atrás do painel.
  - **O que mudou:** quando a área escolhida cairia atrás do painel ou do cartão do capítulo, a câmera desliza de lado só o necessário para ela ficar na faixa livre. Não há zoom nem giro, e se a área já está visível, nada se move.
  - **Onde vale:** nos três andares (`ExperienceCamera`, `focusRef`).
- **Desempenho:** no máximo 4 estações por vez, com materiais e geometrias compartilhados. O Heart sem vsync ficou em ~192 fps, igual a antes.

### Etapa 2: ramos do neurônio e o processo

- **Ramos:** um dendrito sai do ponto onde o axônio da área se ramifica no Heart (`heartBranchPoint`) e vai até cada estação.
  - **Estação escolhida:** o ramo dela fica mais aceso e leva impulsos, num ritmo mais calmo que o axônio.
  - **Outras estações:** os ramos ficam fracos.
  - **Aparição:** os ramos só aparecem quando as estações terminam de abrir.
- **Processo:** na metade da frente da base da estação escolhida há três placas (origem, decisão, saída). Quando o impulso chega pelo ramo, elas acendem em lime, uma depois da outra, a cada 0,55 s, e o ciclo se repete.
  - **Posição das placas:** um caminho no piso à frente da estação foi testado e descartado, porque ficava escondido pela borda da laje.
- **Painel em sincronia:** a linha origem → decisão → saída do painel acende o mesmo passo, ao mesmo tempo. A cena escreve o passo (`processRef`) e o painel só lê.
- **Movimento reduzido:** as três placas ficam acesas, sem impulso, e o painel não pisca.
- **Ver de perto:** `npm run capture:stations` grava a sequência ampliada em volta da estação (`docs/screenshots/xp-process-*.png`).

### Etapa 3: passagem para outra área

- **Linha temporária:** quando a subárea escolhida tem `handoff` (ex.: Executivos de vendas → CS), uma linha sai da placa "saída" da estação e faz um arco sobre o andar até o posto da área que recebe. Enquanto a estação está aberta, a linha fica fraca.
- **Ciclo:** impulso chega → origem → decisão → saída → o impulso viaja pela linha (1,3 s) → o posto que recebe acende com um contorno lime (0,9 s) → pausa → recomeça. O impulso do ramo usa o mesmo período, para tudo andar junto.
- **Painel:** a linha "Passa para · CS · objeto" ganha fundo e borda acesos enquanto a passagem acontece.
- **Enquadramento:** a câmera passa a considerar a estação e a área que recebe.
  - Se as duas cabem na faixa livre, ela desliza o mínimo para mostrar as duas.
  - Se não cabem, ela centraliza o conjunto.
  - Assim, a chegada em CS não fica atrás do painel.
- **Relação fixa do par:** continua acesa, como já acontece com todas as relações da área escolhida.
  - **Diferença em relação à decisão 2 do doc 09:** a linha temporária aparece **sempre**, mesmo quando existe uma relação fixa entre as duas áreas.
  - **Motivo:** a relação fixa liga os pontos de ramificação, às vezes em outro andar, e não mostra o caminho estação → posto.
- **Sem passagem** (ex.: Faturamento, Administração do CRM): o ciclo termina na saída.
- **Movimento reduzido:** a linha fica acesa e o contorno de quem recebe fica fixo, sem viagem.

### Etapa 4: a pessoa nas estações (substituída na Revisão 4)

> O autor preferiu que ninguém saia do posto: as pessoas agora só fazem gestos de trabalho. O texto abaixo fica como registro.


- **Uma pessoa por área, como antes:** o briefing limita o Heart a 8 figuras. Por isso não entram pessoas novas: quando as estações abrem, a figura do posto **sai do posto e caminha até a estação escolhida**.
  - Ao trocar de estação, ela caminha até a nova.
  - Quando as estações fecham, ela volta ao posto.
  - Em código: as figuras dos postos ficam em baldes próprios (`departmentPod(..., people)`), e o Heart esconde a da área cujas estações estão abertas.
- **Posição:** ao lado do balcão, virada para ele. Atrás do balcão, o monitor (voltado para a câmera) a esconderia.
- **Movimento discreto:**
  - **andando:** a figura olha para onde vai e balança levemente;
  - **parada:** respira devagar;
  - **com o processo andando** (origem → saída): inclina para o balcão e "digita", com um aceno curto da cabeça.
- **Movimento reduzido:** a figura vai direto para a estação, sem caminhar nem se mover.

**Observação para o autor:** escolher uma estação cuja saída vai para uma área distante (ex.: Expansão de contas → Financeiro) faz a câmera deslizar de lado para mostrar quem recebe (etapa 3). Se isso incomodar, dá para limitar o enquadramento só à estação.

**Limitação no celular:** o painel ocupa a parte de baixo e cobre o andar, então as estações são vistas com o painel fechado.

## Revisão 4: refinamento estético e pessoas (pedido do autor)

**Quadros do Brain (recomendação §2 do especialista)**
- **Conteúdo do quadro:** cada quadro mostra os **3 indicadores reais da área**, vindos de `brain.indicators`, em três painéis. Cada painel traz o nome do indicador e a forma do gráfico, sem números:
  - **funil:** conversão;
  - **barras pareadas:** comparações A × B;
  - **linha:** prazo e tendência, com uma linha tracejada para meta ou prometido × real;
  - **grade de blocos:** carteira, risco e qualidade do dado;
  - **barras ordenadas:** "por motivo" e "por origem";
  - **colunas:** volume ao longo do tempo.
- **Código:** o desenho fica em `src/scene/floors/boardCharts.ts` e é refeito com a Barlow quando ela carrega.
- **Peso visual:** todas as áreas têm o mesmo, inclusive Atendimento e CS (risco de mensagem do §5: o pipeline não é o único quadro "com cara de CRM").

**Pessoas no estilo "The Sims"**
- **Personagens:** as figuras de cilindro e esfera viraram personagens montados em código (`src/scene/people/`), sem arquivos 3D.
  - Têm corpo, cabeça com olhos, cabelo (curto ou preso), braços e pernas com articulações.
  - Variam em tom de pele, cor de cabelo e roupa, numa paleta discreta.
- **Sem deslocamento:** ninguém sai do posto, só gestos em laço. A pessoa que caminhava até as estações (etapa 4) saiu, a pedido do autor, e as estações continuam sem figura.
- **Gestos por posto:**

| Posto | Gesto |
|---|---|
| Marketing | digita e às vezes olha o calendário |
| Vendas | apresenta no quadro do funil: aponta, depois fala com as mãos |
| Produto | organiza cartões na mesa alta |
| Atendimento | de fone, digita enquanto fala e ajusta o fone |
| CS | conversa com o cliente (a cadeira vazia), gesticulando |
| Financeiro | calcula na calculadora, segura o documento, confere a tela |
| Operações | levanta a caixa na bancada e passa a fita |
| RevOps | digita alternando o olhar entre os dois monitores |
| Brain | duas pessoas apresentam nos quadros, uma lê a prancheta; na mesa de estratégia, uma conversa e outra lê |

- **Quantidade:** continua 1 pessoa por área no Heart (8), mais 5 no Brain (eram 5 figuras simples).
- **Movimento reduzido:** cada pessoa fica parada numa pose do seu gesto.
- **Desempenho** (sem vsync): Heart ~181 fps (antes ~188), Brain ~256 (antes ~276) e Síntese ~250 (antes ~309).
- **Ver de perto:** `npm run capture:people` usa o laboratório com câmera livre (`/lab/building?cam=px,py,pz,tx,ty,tz`) e grava `docs/screenshots/people-*.png`.

## Revisão 5: responsividade (pedido do autor)

Análise, estratégia e resultados completos em [RESPONSIVIDADE.md](RESPONSIVIDADE.md).

- **Layouts por formato:**
  - computador e tablet deitado: três colunas;
  - celular e tablet em pé: folha de baixo, com o andar estudado visível em cima;
  - celular deitado: barra compacta, com o painel à direita.
- **Estudando:** em telas menores que 1100 px, abrir o painel tira o cartão de cena.
- **Enquadramento da câmera:** também na vertical (retrato). A área estudada fica entre a barra do topo e a folha.
- **Celular:** as 8 áreas aparecem numa fileira de botões no cartão.
- **Toque:** alvos de 40 px ou mais, e área de toque invisível nos rótulos do prédio.
- **Desempenho:** resolução adaptativa (`PerformanceMonitor`), mais leve no toque.
- **Auditoria:** `npm run check:responsive`, em 7 formatos. Resultado: 0 erros, 0 sobreposição e nenhuma rolagem lateral.
- **Painel arrastável:** no celular e no tablet em pé, o painel tem alça com três alturas (só o título, meia tela, tela cheia).
- **Aparelho fraco:** se o 3D seguir pesado mesmo na resolução mínima, aparece o aviso **Ler sem o 3D**, que leva ao modo texto completo, com volta ao prédio.

## Revisão 6: prontidão para lançamento (pedido do autor, 24/10)

O site passa a ser o primeiro canal de captação da mentoria do autor. Quatro papéis revisaram (usuário-alvo, UX/IHC, dev de jogos educativos, arquiteto de CRM): relatórios em `docs/lancamento/01–04`, consolidação e o que foi feito em `docs/lancamento/00_relatorio_lancamento.md`, publicação em `docs/lancamento/DEPLOY.md`.

**Resumo do que mudou:**
- **Conteúdo:** as 8 áreas no contrato didático (doc 13), com dois casos por área (Aurora B2B · Marina B2C) e seletor no painel; definição de CRM e tese em 3 passos na síntese; transversais; glossário curado.
- **Conversão:** bloco "Quem fez isto" na síntese e na versão em texto (WhatsApp, LinkedIn, formulário via `/api/contato` + Resend); `src/content/author.ts`.
- **Divulgação:** Open Graph + imagem do link (`scripts/og-image.mjs` → `public/og.png`), ícone, `robots: index`.
- **UX:** 1ª abertura do painel na Visão; percurso guiado em Vendas; cartão do capítulo sem travar a rolagem; "O que fica deste andar"; ciclo da síntese com conteúdo; barra de progresso; nav com subtítulos (telas largas); "Versão em texto" com um nome só e sumário; aviso de aparelho fraco como toast com fechar; celular: estações nos chips, meia tela com mais leitura, alvos maiores; tablet: linha ≤ 68ch; rótulos da fachada sem colisão.
- **Técnica:** modo leve para GPU integrada (sem bloom/MSAA, dpr até 0,75; detecção pelo nome da GPU); posição preservada ao redimensionar/zoom; `translate="no"` nos rótulos; `safe-area-inset` no topo.

## Revisão 7: leitura guiada no celular (pedido do autor, 26/10)

- **Celular:** abre numa leitura guiada (`MobileGuide.tsx`): o mesmo conteúdo em sequência, com imagens do prédio geradas do 3D e o painel de estudo em tela cheia. O 3D é opcional e não é baixado antes de a pessoa pedir.
- **Retrato no 3D:** o andar do capítulo sobe para cima do cartão quando o painel está fechado (o Backbone ficava escondido).
- **Resultados:** testes 34/34; responsividade com Backbone, 0 rótulos escondidos. Ver `docs/RESPONSIVIDADE.md` §1b.

## PRD: critérios atendidos

| FR | Status |
|---|---|
| 01 Cena única + scroll | ✅ mesmo prédio do começo ao fim, ida e volta, salto por capítulos |
| 02 Blocos anônimos no rooftop | ✅ nomes só a partir da revelação |
| 03 Identidade espacial persistente | ✅ mesma área/coluna nos 3 andares; o rótulo acompanha a área |
| 04 Interação contextual | ✅ hover/foco = nome + frase + filamento em destaque; clique = painel do andar; o mesmo vale para mouse, teclado e toque |
| 05 Brain por área | ✅ objetivo, decisões, indicadores e impacto para as 8 áreas |
| 06 Heart com subáreas e processos | ✅ estações no 3D ligadas ao painel, impulso pelo processo origem → decisão → saída, passagem para a área que recebe; pessoas trabalhando nos postos |
| 07 Backbone distribuído | ✅ sinais e capacidades por área; sem servidor central |
| 08 Fios e feedback | ✅ impulso descendo na execução e subindo no Backbone; 16 relações com o porquê |
| 09 Síntese | ✅ recuo, tese, ciclo e caminhos de retorno; nenhum CTA comercial |
| 10 Conteúdo fora do 3D | ✅ `src/content/*.ts` |
| 11 Responsividade e degradação | ◐ 7 formatos auditados (Revisão 5): layouts próprios para celular, celular deitado e tablet em pé; resolução adaptativa; sem WebGL, página de texto completa. **Falta testar em aparelhos reais.** |
| 12 Acessibilidade | ✅ rótulos são botões; Tab/Enter/Esc; foco devolvido; `<dialog>` nativo; descrição da cena; modo texto com tudo; movimento reduzido. ◐ falta teste com leitor de tela real |
| 13 Instrumentação respeitosa | ◐ eventos do PRD emitidos só localmente (`crm:event`), sem rede nem dados pessoais. Integração e consentimento: decisão futura |

## Testes (build de produção, GTX 1650, Chromium)

`npm run test:xp`: 29 de 29 passaram.

| Grupo | O que foi testado |
|---|---|
| Rooftop e navegação | rooftop anônimo; navegação; percurso guiado com Produto |
| Seleção e painel | clique seleciona e abre o painel do andar; a seleção persiste ao descer; o seletor B2B · B2C · Pequena troca o texto e passa para a próxima área |
| Heart | o posto de Vendas abre em 4 estações; estação → painel e painel → estação; a subárea abre o processo e o registro no CRM; a passagem leva à área de destino; Financeiro (fachada direita) não fica atrás do painel; o painel acende origem → decisão → saída junto com a estação; a linha "Passa para" acende durante a passagem |
| Teclado | Esc fecha o painel e devolve o foco; Tab/Enter selecionam |
| Backbone | objetos do CRM, campo crítico, retorno para a decisão; automações recolhidas que abrem no clique |
| Síntese e modo texto | a síntese abre a lista das 8 áreas; o mapa completo traz as 8 áreas |
| Rooftop de novo | voltar ao rooftop esconde os nomes de novo |
| Menu | o menu do capítulo lista as 8 áreas, com RevOps no lugar de Marca |
| Scroll | um giro da roda no repouso já move a câmera |
| Glossário | balão no hover; clique abre a gaveta; busca sem acento; Esc fecha só a gaveta; botão do topo |
| Tema | claro por padrão; o botão troca e a escolha fica salva |
| Celular | painel em folha com alça: meia tela → tela cheia → só o título; o cartão sai com o painel aberto |
| Aparelho fraco | o aviso oferece o modo texto, e dá para voltar ao 3D |
| Console | nenhum erro |

FPS sem vsync (`npm run capture:xp -- x --uncapped`). Com vsync, todos os capítulos ficam em 60.

| Rooftop | Brain | Heart | Backbone | Síntese |
|---|---|---|---|---|
| ~423 | ~276 | ~191 | ~191 | ~309 |

- **Movimento reduzido** (`--reduced`): a câmera troca de pose de uma vez, sem impulsos nem animação de texto. O conteúdo é o mesmo.
- **Sem WebGL** (`--nowebgl`): a página em texto aparece com todo o conteúdo, sem avisos.
- **Laboratório:** continua funcionando, e o teste de vazamento (`npm run check:leaks`) passa.

**Capturas:**
- desktop: `docs/screenshots/xp-*.png` e `xp-1280-*.png`;
- painel: `xp-panel-*.png`;
- celular: `xp-mobile-*.png`;
- movimento reduzido: `xp-reduced-*.png`;
- fallback: `xp-fallback.png`.

## Lacunas e próximos passos

1. ~~**Heart no 3D (FR-06):**~~ feito: estações, processo e passagem (ver "Estações do Heart", etapas 1 a 3).
2. ~~**Pessoas:**~~ feito: todas trabalham com gestos (Revisão 4).
3. ~~**Quadros do Brain:**~~ feito (Revisão 4).
4. **Rótulos no Brain:** do lado da fachada direita, eles se aproximam em perspectiva. Vale testar mostrar só os da área ativa e das relacionadas.
5. **Testes faltando:** Safari/WebKit e Firefox, notebook comum, celular real e leitor de tela (PRD §11).
6. **Conteúdo:** os textos foram revisados por especialistas (Revisão 2), mas os números dos casos são ilustrativos e há 19 pontos para validação humana (09 §6) antes de publicar.
7. **Telemetria:** decidir se, como e com qual consentimento os eventos sairão do navegador.
