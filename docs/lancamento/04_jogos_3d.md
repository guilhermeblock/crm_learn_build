# Revisão de lançamento · 4 · Desenvolvedor de jogos educativos / 3D

**Data:** 24/10/2026 · **Papel:** desenvolvedor sênior de serious games e 3D educacional no navegador (subagente) · **Método:** medições no build de produção com Playwright. Descoberta de método: nesta máquina o Chromium abre por padrão na **Intel UHD integrada** (cenário "notebook comum"); a GTX 1650 foi forçada para o cenário "placa dedicada".

## Veredito

**Pronto com ajustes: não divulgar antes de resolver o desempenho em GPU integrada e o salto de capítulo ao redimensionar.** Como experiência de leitura e cenário, está acima da média e tecnicamente limpa (sem erros, sem vazamento, fallback funciona). Como ambiente de aprendizagem, ainda é um "museu bonito": a pessoa rola, clica e lê, mas o 3D quase não devolve nada do que ela fez, e o sinal didático central (origem → decisão → saída) é ilegível no tamanho em que aparece.

## Achados

| # | Prioridade | O que | Medida | Correção |
|---|---|---|---|---|
| A1 | **P0** | Desempenho em GPU integrada | Intel UHD, 1440×900, dpr 1: Rooftop 12 fps, Brain 10, Heart 7, Backbone 8; 960×600: 26–38 fps (custo por pixel). GTX com dpr 1,75: 60 fps (66 sem vsync no Heart) | Piso de dpr 0,7; 2º degrau do PerformanceMonitor: desligar MSAA e Bloom, sombras básicas; detectar iGPU na abertura (`WEBGL_debug_renderer_info`) e começar leve; aviso após 1 janela de 4 s |
| A2 | P1 | Salto de capítulo ao redimensionar ou dar zoom | 1440×900 → 1000×700 no Heart pulou para Backbone; zoom 150% jogou na Síntese | Guardar `progress` em `refreshInit` e restaurar no `refresh` |
| A3 | P1 | Processo origem → decisão → saída ilegível no 3D | As três placas têm ~4 px em 1440×900 | Marcas no tampo ou na tela da estação; ou mini-rótulos DOM que acendem com `processRef` |
| A4 | P1 | Sem loop de aprendizagem (ação → consequência → progresso); `learning` dos capítulos nunca aparece no 3D; `breaks` das relações sem representação | — | 3 mecânicas leves (abaixo) + mostrar `chapter.learning` ao sair do capítulo |
| A5 | P1 | Rótulos das áreas se amontoam na fachada direita | "FINANCEIRO OPERAÇÕES REVOPS" sobrepostos | Resolver colisão em X; com área selecionada, nome só da selecionada + relacionadas |
| A6 | P1 | Celular: na revelação, cubos ganham quadradinhos sem nome; estações 1/3/4 sobrepostas | — | 1º toque mostra nome, 2º abre; estações em coluna fixa |
| A7 | P2 | Perda de contexto WebGL sem aviso | 48 avisos, tela congelada em silêncio | Ouvir `webglcontextlost/restored`; aviso; modo texto se não restaurar em 5 s |
| A8 | P2 | Tempo até o primeiro frame | JS ≈ 690 KB gzip (chunk 3D 451 KB); 1º frame 2,7 s (Intel) / 3,7 s (GTX); 30 frames em 4,3–5,5 s | Cartão do rooftop fora do `dynamic`; barra de carga; `compileAsync` |
| A9 | P2 | Quadros do Brain não comunicam "indicador" a ~60 px | — | Quadro ampliado ao selecionar a área |
| A10 | P2 | Câmera lateral do painel sem motivo visível | 3 movimentos simultâneos | Atrasar 300 ms; resposta 2 em vez de 3,2 |
| A11 | P2 | Tradução automática do navegador pode quebrar React (`removeChild`) | não verificado | `translate="no"` nos rótulos e nav; texto condicional em `<span>`; testar |
| A12 | P2 | Safari/iOS por código | `inert`, `<dialog>`, `overscroll-behavior`, WebGL2: ok em iOS ≥ 16 | `env(safe-area-inset-*)` no topo e na folha |

**Não reproduzido / inconclusivo:** aba escondida (delta limitado a 0,1 s, sem salto esperado); trackpad sem pulos; troca rápida de 8 áreas sem erro; remontagem 12× com heap 12,9 → 16 MB estável; sem WebGL ok; console só com avisos conhecidos; nenhuma requisição externa.

## Três mecânicas leves (sem gamificação pesada, sem avatar, sem LMS)

| | Faz | Vê | Aprende | Custo | Onde |
|---|---|---|---|---|---|
| **M1 · Siga a área até a base** | Abre Brain, Heart e Backbone da mesma área | Três pontinhos por área acendem; ao completar, o neurônio fica aceso e a Visão ganha um "Checkpoint" com o `learning` em pergunta e resposta | A mesma área atravessa decisão → rotina → dado (a tese inteira) | 6–8 h | ExperienceShell (`studied`), ChapterOverlay/AreaIndex, NeuralNetwork, AreaPanel |
| **M2 · Onde a passagem quebra?** | No Heart, quando o impulso chega ao receptor, 3 chips: "o que precisa ir junto?" | Acerto: linha e contorno pulsam lime e "Onde quebra" abre; erro: contorno laranja e o dado que faltou | O critério do Heart no contrato didático | 10–12 h | types (`distractors`), AreaPanel, HeartStations, telemetry |
| **M3 · Mande o dado de volta** | No Backbone, botão "Ver o dado subir" | Um impulso sobe pelo neurônio; o rótulo da área no Brain pisca; "Chegou em: {indicador} → {decisão}" com link para a aba Brain | O caminho de volta campo → indicador → decisão | 5–6 h | NeuralNetwork (one-shot), AreaPanel, ExperienceShell |

## O que já está forte

Arquitetura "um controlador por propriedade" (scroll nativo, pose em ref, câmera só lê); degradação honesta (PerformanceMonitor, aviso, fallback sem WebGL, movimento reduzido); acessibilidade acima do padrão de sites 3D; painel de estudo; higiene técnica (zero erro, sem vazamento, sem terceiros, fontes próprias, cache imutável).

## Perguntas ao autor

1. Qual é o aparelho mínimo que você aceita atender bem: notebook corporativo com Intel integrada (hoje 7–12 fps) ou só máquinas com placa dedicada?
2. Aceita que a experiência registre a escolha do visitante (M2) só no navegador, sem login? Quer telemetria saindo do navegador antes do lançamento?
3. Qual é a próxima ação ao fim da síntese? (Respondido: bloco discreto com WhatsApp, LinkedIn e formulário.)
