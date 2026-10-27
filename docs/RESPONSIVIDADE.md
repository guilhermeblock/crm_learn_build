# Responsividade: como ensinar em qualquer dispositivo

**Data:** 21/10/2026 · **Pedido do autor:** testar a responsividade e definir o melhor caminho para educar, seja qual for o dispositivo.

## 1. Princípio

A experiência ensina em **três camadas, com o mesmo conteúdo** (tudo vem de `src/content/`):

| Camada | Papel no aprendizado | Onde funciona |
|---|---|---|
| **Prédio 3D** | Memória espacial: cada área tem um lugar e o mesmo lugar nos 3 andares; os fios mostram as ligações | Qualquer dispositivo com WebGL |
| **Painel de estudo** | O conteúdo em si: pergunta, sem/com CRM, caso, processo, objetos do CRM, glossário | Qualquer tela |
| **Modo texto** | Tudo em texto corrido, para leitor de tela, aparelho sem WebGL ou quem prefere ler | Qualquer navegador |

**Regra:** nada se aprende *só* no 3D. O 3D ancora e o painel explica. Em tela pequena, a prioridade é ler, e o prédio vira um mapa acima do texto, mostrando onde está a área estudada.

## 1b. Celular: leitura guiada (decisão do autor, 26/10)

**No celular, o site abre na leitura guiada, e o 3D vira opcional.**

**Por quê:**
- O público chega pelo LinkedIn, principalmente no celular.
- Os quatro revisores apontaram o celular como o pior caminho: leitura de cerca de 10 linhas, rótulos que se sobrepõem, peso e bateria.
- O Backbone ficava escondido atrás do cartão do capítulo.

**Como funciona:**
- **Mesmo conteúdo, em sequência:** rooftop, as 8 áreas, os três andares e a síntese, com o bloco "Quem fez isto".
- **Imagens do prédio** geradas do próprio 3D (`scripts/guide-images.mjs` → `public/guia/*.jpg`, cerca de 30 KB cada na versão de celular).
- **Tocar numa área abre o painel de estudo em tela cheia:** abre na aba do andar de onde veio; tem os dois casos, o glossário e o "Entenda o porquê"; o botão Voltar do celular fecha o painel.
- **O 3D fica a um toque** ("Abrir o prédio em 3D") e não é baixado antes disso. Dentro do 3D, "Leitura guiada" volta.
- **Quando vale:** largura até 760 px, ou altura até 500 px na horizontal. Tablet e computador seguem no 3D.
- **Para forçar um modo:** `?modo=3d` ou `?modo=guia`. A escolha da pessoa vale para a visita.

**Correção no 3D em retrato** (tablet em pé, e celular quando escolhe o 3D): com o painel fechado, a câmera sobe o andar do capítulo para a faixa acima do cartão. A auditoria agora mede o Backbone e conta os rótulos escondidos atrás do cartão ou do painel: 0 nos 7 formatos.

Código: `src/experience/MobileGuide.tsx`, `src/lib/reading.ts` (`pickMode`) e `AreaPanel` com `mode="page"`. Prints: `docs/screenshots/guide-*.png` (`node scripts/capture-guide.mjs`).

## 2. Formatos de tela

| Formato | Exemplos | Layout | O que muda para o aprendizado |
|---|---|---|---|
| **Computador / tablet deitado** (≥ 1100 px) | 1280×720, 1920×1080, iPad deitado | cartão do capítulo à esquerda · prédio · painel à direita | Lê e vê ao mesmo tempo; a câmera desliza de lado se a área estudada cair atrás do painel |
| **Tablet em pé** | 820×1180 | prédio em cima, cartão embaixo; o painel abre como folha de baixo (56% da altura) | Com o painel aberto, o cartão sai e a câmera **sobe/desce** para mostrar o andar estudado na faixa de cima |
| **Celular em pé** | 360×740, 390×844 | prédio em cima, cartão embaixo com as áreas numa fileira de botões; o painel abre como folha (62%) | Igual ao tablet: o andar estudado fica visível acima do texto |
| **Celular deitado** | 844×390 | barra compacta numa linha; cartão estreito à esquerda; o painel ocupa a metade direita | Com o painel aberto, o cartão sai e o prédio fica à esquerda, enquadrado |
| **Sem WebGL / aparelho fraco** | — | o modo texto completo abre no lugar da cena | Nada se perde: o mesmo conteúdo, em texto |

Em telas menores que 1100 px, abrir o painel (**estudando**) tira o cartão do capítulo de cena: o painel vira o foco, e o "Estudando … →" traz o cartão de volta ao fechar.

## 3. Toque, desempenho e acessibilidade

- **Alvos de toque:** com ponteiro de toque (`pointer: coarse`), botões, abas e controles têm no mínimo 40 px. Os rótulos do prédio ganham uma área de toque invisível em volta, sem mudar o visual.
- **Hover não existe no toque:**
  - o primeiro toque num termo do glossário mostra o balão, e o segundo abre a gaveta;
  - tocar num rótulo escolhe a área e abre o painel.
- **Desempenho:**
  - no toque, a cena começa com resolução menor (dpr até 1,4, contra 1,75 no computador), o que poupa bateria e calor;
  - um monitor de desempenho baixa para 1 se o FPS cair e volta quando sobra folga.
- **Movimento reduzido:** câmera em poses fixas, sem impulsos e pessoas paradas numa pose. O conteúdo é o mesmo.
- **Leitura:** fundo claro por padrão nas superfícies de texto.

## 4. Resultado da auditoria (`npm run check:responsive`)

Medido no build de produção em 7 formatos e 6 momentos: rooftop, Brain, Heart, Heart com painel, glossário e síntese.

| Dispositivo | Tamanho | Erros | Sobreposição de interface | Rolagem lateral | Cena coberta com o painel aberto |
|---|---|---|---|---|---|
| Celular pequeno | 360×740 | 0 | 0 | não | 62% (antes: >100%) |
| Celular | 390×844 | 0 | 0 | não | 62% (antes: 100%) |
| Celular deitado | 844×390 | 0 | 0 | não | 44% (antes: 73%) |
| Tablet em pé | 820×1180 | 0 | 0 | não | 56% (antes: 81%) |
| Tablet deitado | 1180×820 | 0 | 0 | não | 62% |
| Notebook | 1280×720 | 0 | 0 | não | 56% |
| Computador | 1920×1080 | 0 | 0 | não | 36% |

**O que foi corrigido nesta rodada:**

| Problema | Antes | Agora |
|---|---|---|
| Tablet em pé (820 px) | recebia o layout de computador: cartão e painel sobrepostos, marca quebrando em 5 linhas | layout próprio (folha) |
| Celular deitado | cartão e painel ocupavam tudo; a barra do topo invadia o cartão | layout próprio (barra compacta, painel à direita) |
| Celular com o painel aberto | a faixa de cima mostrava o rooftop, e não o andar estudado | enquadramento vertical da câmera |
| Menu das áreas no celular | escondido; só aparecia pelo "Ver áreas" | fileira de botões no cartão |

**Ainda aparece na medição (aceito ou por decisão):**
- **Texto < 12 px:** são os rótulos curtos em Space Mono (índices, "ÁREA 03 / 08", etiquetas), que fazem parte da linguagem visual. Todo texto de leitura tem 13 px ou mais.
- **"Alvos < 40 px" no toque:**
  - os rótulos do prédio, cuja área de toque invisível o script não mede;
  - os termos do glossário dentro do texto, que fazem parte da frase (exceção de alvo em linha das diretrizes WCAG).

## 5. Próximos passos (quando o autor quiser)

1. **Dispositivos reais** (adiado pelo autor): Safari no iPhone, Chrome no Android, um tablet e um notebook comum, com GPU integrada. A emulação mede o layout, mas não o calor, a bateria nem o FPS de um celular de verdade.
2. ~~**Folha com alça:**~~ feito.
   - No celular e no tablet em pé, o painel tem uma alça para arrastar entre três alturas: **só o título** (o prédio aparece quase inteiro), **meia tela** e **tela cheia**.
   - Tocar na alça, ou apertar Enter nela, alterna as alturas.
   - A câmera reenquadra a área estudada conforme a altura (`useSheet.ts`).
3. ~~**Aparelho fraco:**~~ feito.
   - **Quando o aviso aparece:** já na resolução mínima, abaixo de 24 fps por 8 s seguidos.
   - **O que o aviso diz:** "O 3D está pesado neste aparelho. Quer ler o mesmo conteúdo em texto?", com as opções **Ler sem o 3D** e **Continuar com o 3D**.
   - **O modo texto tem volta:** "← Ver com o prédio 3D".
   - **Se a pessoa recusar:** o aviso não volta na mesma visita.
   - **Para testar:** `?lento=1` simula um aparelho fraco.
4. **Leitor de tela real** (NVDA e VoiceOver) no modo texto e no painel.

## 6. Como rodar

```
npm run build && npx next start -p 3200
node scripts/responsive-check.mjs --base=http://localhost:3200      # ou: npm run check:responsive
```

Os prints ficam em `docs/screenshots/resp-<dispositivo>-<momento>.png` e as medidas em `docs/responsividade.json`.
