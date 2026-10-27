# Revisão de lançamento · 2 · UX e experiência de aprendizado

**Data:** 24/10/2026 · **Papel:** designer UX / IHC e learning experience (subagente) · **Base:** site real em notebook 1366×768, celular 390×844 e tablet 820×1180 (Playwright, sem GPU: o aviso de aparelho fraco apareceu em todos os prints) + código.

## Veredito

**Pronto com ajustes.** O núcleo (prédio, descida por scroll, painel por andar, teclado, modo texto) está sólido e acima da média. Como primeiro site para captar mentoria, bloqueiam: o link não gera cartão no LinkedIn (sem Open Graph), a rolagem trava com o mouse sobre o cartão de texto, e falta o fechamento (síntese sem "aha" nem próximo passo com o autor).

## Achados

| # | Prioridade | Onde | O que | Correção |
|---|---|---|---|---|
| 1 | **P0** | `layout.tsx` | Sem Open Graph, sem favicon, `robots: noindex`; não existe `public/` | `openGraph` com imagem 1200×630 do prédio + frase da tese; `twitter: summary_large_image`; `icon.png`; decidir o `noindex` |
| 2 | **P0** | `.chapter` (`overflow-y:auto; overscroll-behavior:contain`) | Em 768 px o cartão tem 668 px e conteúdo de 863–1060 px; a roda sobre o cartão rola 220 px e para (medido: 22 giros → página não desce). "Role para descer" parece travado | Tirar `overscroll-behavior: contain`; fazer o cartão caber sem rolagem (menu das 8 áreas compacto; frase só no hover/foco). Só o painel rola |
| 3 | P1 | Síntese | Repete a abertura, fecha com frase abstrata; a tese da marca não aparece; nenhum nome de autor nem caminho para ir além; ações abaixo da dobra | Esboço: tese em 1 linha + "o software só guarda o combinado"; os 3 andares com o exemplo da área visitada; ciclo; "Você visitou 2 de 8"; "Pense na sua empresa"; bloco "Quem fez isto" com 2 links (sem modal, depois do conteúdo); "GUI BLOCK" do topo vira link para o bloco |
| 4 | P1 | `GUIDED_AREA = "produto"` | O percurso guiado acompanha Produto (formato antigo); quem não clica nunca vê Vendas | `GUIDED_AREA = "vendas"` (até as outras migrarem) |
| 5 | P1 | Rooftop e `ChapterNav` | Não diz o que é, quanto dura, nem o que são Brain/Heart/Backbone; "↓ role para descer" é texto estático de 11 px | Linha "Um prédio em corte: 3 andares, 8 áreas, uns 7 minutos"; subtítulo PT na nav; barra de progresso de 2 px; seta com pulso leve (não sob reduced-motion) |
| 6 | P1 | `AreaPanel` `useState<Tab>(floor ?? "overview")` | Abre direto no andar e pula a Visão (a porta para o leigo) | 1ª abertura de cada área → Visão (`seen` por área); depois segue a câmera |
| 7 | P1 | Painel | Visão 574 palavras / Heart 451 num painel de 445 px de leitura: 5–6 telas; 3 contextos de rolagem | "Um dia na área", "Erros comuns" e "Conexões" como `<details>` fechados, ou Conexões como 5ª aba; ≤ 300 palavras visíveis por aba |
| 8 | P1 | Celular, folha "meio" | Janela de leitura de 257 px (alça 22 + cabeçalho 180 + rodapé 61) | Tocar aba/estação → tela cheia; rodapé anterior/próxima vai para o fim do corpo; cabeçalho compacta ao rolar |
| 9 | P1 | Celular, Heart | 4 botões de estação sobrepostos (x 52–87, y 249–256); rótulos de área 14 px | No celular, esconder números 3D e usar os chips `.segmented`; `::after { inset: -14px }` |
| 10 | P1 | Tablet em pé | 103 caracteres por linha no painel | `.panel__body > * { max-width: 68ch }` |
| 11 | P1 | `.xp__perf` | Aviso de aparelho fraco cobre o conteúdo (z 40 > painel 30), sem ×, sem Esc | Toast no canto superior direito, ×, Esc, some em 12 s; "Modo texto" segue na nav |
| 12 | P2 | Celular, menu de áreas | Fileira mostra 4 de 8 sem indicação de continuação | Fade à direita + "todas →", ou grade 4×2 |
| 13 | P2 | `Gloss` no toque | 1º toque em "leads" já abre a gaveta inteira ("1 de 72 termos") | Mini-folha com termo + definição + "Abrir glossário" |
| 14 | P2 | `.cube-label` | Rótulos colidem (PRODUTO sobre ATENDIMENTO; FINANCEIRO/REVOPS) | Resolver colisão na projeção; 12 px / 26 px |
| 15 | P2 | Modo texto | 8.952 palavras num diálogo sem sumário; três nomes (Modo texto / Mapa completo / Ver o mapa completo) | Um nome; sumário fixo com âncoras (`#mapa-<id>` já existe) |

## O que já está forte

Teclado e foco (skip link; Enter abre e foca o título; Esc devolve o foco; `<dialog>`; `inert`; H1 com `aria-live`); zero erros de console. Leitura: Barlow 15–17 px, contraste ≈ 5:1 claro e ≈ 7,8:1 escuro; termos sublinhados só na 1ª ocorrência. Modelo mental: o prédio em corte com as placas explica a metáfora sozinho; as estações do Heart acendendo com o processo são o melhor momento didático. Estrutura de Vendas (ideia central + porquê fechado + pense na sua empresa) é a certa para o leigo. Movimento reduzido funciona.

## Perguntas ao autor

1. Lançar com 7 áreas no formato antigo, ou esperar a migração? (Respondido: as 8 no formato novo.)
2. Qual é o próximo passo real para quem terminou? (Respondido: WhatsApp, LinkedIn e formulário; discreto na síntese.)
3. Em que aparelhos o público do LinkedIn vai abrir (celular corporativo, notebook sem GPU)? Define se o modo texto é exceção ou caminho principal.

Prints e scripts do revisor: `scratchpad/ux/` da sessão (não versionados).
