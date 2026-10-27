# Gui Block · CRM como Sistema

Experiência educacional 3D com scroll (**Sprint 02**), construída sobre o prédio procedural do **Sprint 01**. Usa Next.js, React Three Fiber e GSAP/ScrollTrigger.

| Rota | O que é |
| --- | --- |
| **`/crm-como-sistema`** (e `/`) | A experiência: Rooftop → Brain → Heart → Backbone → síntese, com o painel de cada área |
| `/lab/building` | Laboratório do Sprint 01: vistas fixas, luz e bloom (só desenvolvimento) |

![Concept × protótipo](docs/review-sheet.png)

- **Sprint 02** (scroll, painel, conteúdo, testes): [docs/SPRINT02.md](docs/SPRINT02.md)
- **Sprint 01** (revisão do prédio contra o concept): [docs/REVIEW.md](docs/REVIEW.md)
- **Áreas e relações** (especialista em CRM/RevOps): [docs/RECOMENDACOES_AREAS.md](docs/RECOMENDACOES_AREAS.md)

---

## Como rodar

Requisitos: Node.js 20+ (testado com 24.14) e um navegador com WebGL2.

```bash
npm install
npm run dev            # http://localhost:3000/lab/building
```

Build de produção:

```bash
npm run build
npm start              # http://localhost:3000/lab/building
```

Verificações (com o app rodando em outro terminal; troque a porta com `--base=`):

```bash
npx playwright install chromium        # uma vez, só para os scripts abaixo
npm run typecheck
npm run capture -- final               # 3 vistas → docs/screenshots/final-*.png + FPS e erros de console
npm run capture -- final --uncapped    # FPS sem o teto do vsync (folga real)
npm run capture -- sel --select=produto --views=overview,heart   # estado de seleção
npm run check:leaks                    # desmonta/remonta a cena 20× e compara listeners, canvases e heap
npm run review-sheet -- final          # docs/review-sheet.png (concept × 3 vistas)
npm run test:xp                        # teste de fumaça da experiência (navegação, painel, teclado, console)
npm run capture:xp -- xp               # 6 capítulos da experiência → docs/screenshots/xp-*.png
npm run capture:xp -- xp --panel       # idem, com o painel aberto em cada andar (--reduced, --nowebgl, --uncapped, --size=390x844)
```

Parâmetros de URL do laboratório: `?view=overview|rooftop|heart`, `&select=<id da área>`, `&ui=0` (sem painel), `&instant=1` (sem transição de câmera).

## O laboratório

- **Vistas:** Visão geral, Rooftop e Heart, trocadas sem recarregar a página (transição suave do `CameraControls`).
- **Sliders:** exposição, key light, bloom e FOV. **Órbita livre** opcional, presa ao quadrante frontal para as fachadas fechadas nunca virarem a frente.
- **Áreas:** clique no cubo ou no rótulo para selecionar. Tab navega pelos rótulos (Enter/Espaço seleciona); Esc ou clique no vazio limpa. Em telas sem hover, o toque seleciona direto.
- **Diagnóstico:** contador de FPS, ids técnicos das áreas, "Remontar cena" (teste de vazamento).
- Respeita `prefers-reduced-motion` (desliga a pulsação dos cubos).

## O que está na cena

| Elemento | Como foi feito |
| --- | --- |
| **Prédio em corte** | Pódio/lobby, 3 pavimentos (pé-direito 5,4) e cobertura. Fachadas da frente abertas com vidro quase invisível, paredes de fundo fechadas, bordas de laje com linha de luz. Empena sólida à esquerda com **título e subtítulo de cada pavimento** (BRAIN · Objetivos e Estratégias / HEART · Pessoas e Processos / BACKBONE · Dados e Tecnologia), em Barlow. |
| **Brain** · objetivos e estratégia | Luz fria. Mesa de estratégia, sala de decisão, painéis abstratos (sem números de KPI) e **um quadro de indicadores por área**, com o ícone da área. |
| **Heart** · pessoas e processos | Luz quente, o andar mais humano. **Um posto por área** com a rotina real dela (pipeline de Vendas, fila do Atendimento, carteira de CS, fechamento do Financeiro...), mais reunião e lounge compartilhados. 8 figuras, uma por área. |
| **Backbone** · dados e tecnologia | Luz técnica. Fileiras de racks, **um terminal por área** e bandejas em **malha** (sem centro); o cloud é só mais um módulo da fileira. Nenhum "servidor central = CRM". |
| **Cubos das áreas** | 8 cubos de LED opacos com ícone, espalhados no rooftop. Estados: idle (pulsação suave da luz), hover/foco (bordas acesas), selecionado (aceso; os outros recuam). |
| **Conexões** | Rede **neural**, não cabos: cada área é um neurônio (cubo = corpo, prolongamentos, axônio atravessando as lajes, dendritos tocando quadro, mesa, pessoa e terminal). 16 filamentos de **relação entre áreas** formam a trama (mapa revisado com especialista; as 3 centrais — Vendas→CS, CS→Marketing, Atendimento→Produto — ficam em destaque). O impulso nasce no cubo e se propaga pela árvore (2 áreas de demonstração; a selecionada também pulsa). |
| **Térreo** | Terraço com árvores, balizadores, escada com LED e lobby aceso, só com emissivos (nenhuma luz dinâmica extra). |

Tipografia: Barlow (conteúdo e títulos da empena, no lugar da Agrandir, que não está disponível) e Space Mono (sistema), servidas pelo próprio build via `next/font`.

Cores da marca centralizadas em `src/scene/config/palette.ts` (fonte única; o CSS recebe as mesmas variáveis pelo layout). Lime oficial: **`#D4FF42`**, usado só como SIGNAL (sinapses do Heart na seleção, contorno do posto selecionado, INDEX do Heart na empena).

## Estrutura

```
src/
  app/                       layout, redirecionamento / → /lab/building, rota do laboratório
  lab/                       BuildingLab (estado), VisualLabControls (painel), FpsMeter, settings
  scene/
    BuildingScene.tsx        Canvas, sombras, tone mapping; monta tudo
    CameraRig · LightingRig · PostFX (bloom por limiar + ACES)
    config/                  constants (eixos, níveis, áreas, zonas, vistas), palette, materials (kit compartilhado)
    building/                BuildingShell, FloorPlate, FloorLighting, Plinth
    floors/                  BrainFloor, HeartFloor, BackboneFloor, DepartmentBoards, departmentPods
    rooftop/                 Rooftop, CubeField (cubos instanciados), CubeLabels (rótulos DOM), iconAtlas, ledCubeMaterial
    connections/             NeuralNetwork, neuralPaths (traçado), neuralMaterial (impulso), taperedTube
    props/                   furniture (receitas de mobiliário), InstancedBlocks, BucketMeshes, Block
scripts/                     capture, remount-check, review-sheet (Playwright)
docs/                        REVIEW.md, review-sheet.png, screenshots/ (final-* e historico/)
```

**Sistema de coordenadas:** `Y` vertical, `X` distribuição dos departamentos, `Z` profundidade. Alturas em `LEVELS`, dimensões em `BUILDING`. Cada área tem id, âncora e **zona** estáveis em `DEPARTMENTS` (ids do briefing: `marketing-growth`, `vendas`, `produto`, `atendimento`, `customer-success`, `financeiro`, `operacoes-entrega`, `marca-comunicacao`).

**Leveza:** materiais e geometrias-base criados uma vez e descartados no unmount. Mobiliário em "baldes" instanciados (cerca de 10 malhas por andar), cubos em 3 malhas instanciadas, rede neural em 1 malha por área + 2 de relações. Toda a animação roda em poucos `useFrame`, sem timelines por objeto.

## Versões instaladas

| Pacote | Versão |
| --- | --- |
| next | 16.4.2 |
| react / react-dom | 19.3.1 |
| three | 0.186.1 |
| @react-three/fiber | 9.8.2 |
| @react-three/drei | 10.7.9 |
| @react-three/postprocessing / postprocessing | 3.2.1 / 6.39.5 |
| typescript | 5.9.3 (a 7.x existe, mas não foi adotada por compatibilidade com o Next) |
| playwright (dev, só scripts) | 1.64.1 |
| gsap / @gsap/react | 3.15.0 / 2.1.2 (Sprint 02) |

## Desempenho observado

Desktop de referência: NVIDIA GeForce GTX 1650 (ANGLE / Direct3D 11), Chromium headless do Playwright, build de produção, `devicePixelRatio` 1. Não é promessa de FPS universal.

| Vista | 1440×900 (vsync) | 1280×800 (vsync) | 1440×900 sem vsync |
| --- | --- | --- | --- |
| Visão geral | 60 | 60 | ~334 |
| Rooftop | 60 | 60 | ~388 |
| Heart | 60 | 60 | ~195 |

O Heart é a vista mais cara: o bloom e os filamentos translúcidos ocupam a tela inteira. Em telas de alta densidade o `dpr` vai até 1,75; vale conferir o FPS no Chrome normal pelo contador do painel.

**Teste de vazamento** (`npm run check:leaks`, produção, 20 remontagens): listeners de `window`/`document` idênticos antes e depois, 1 canvas, nenhum aviso de contexto WebGL e nenhum erro.

**Console:** sem erros. Restam 2 avisos de bibliotecas: `THREE.Clock` obsoleto (usado internamente pelo React Three Fiber 9.8) e `warning X4122` do compilador de shader do Direct3D, que só aparece no Windows/ANGLE.

## Lacunas conhecidas

- **Heap residual:** a remontagem deixa cerca de 0,2 MB por ciclo (+4,7 MB em 20 remontagens), sem crescimento linear e sem listeners ou contextos vazando. É provável que sejam caches de módulo das bibliotecas; não foi investigado a fundo.
- **Hover com mouse real** não é coberto pelos scripts; o foco por teclado, que usa o mesmo realce, é testado.
- **Quadros do Brain** ainda usam barras genéricas; a recomendação (indicadores por área e 4 formas de gráfico) está em [docs/RECOMENDACOES_AREAS.md](docs/RECOMENDACOES_AREAS.md) §2.
- **Agrandir** (fonte de voz da marca) não está disponível; os títulos da empena usam Barlow 700.
- **Rótulos dos cubos** podem encostar em cubos vizinhos na visão geral (distância grande). No Sprint 02 a câmera fica mais próxima.
- **Mobile:** fora do escopo. Não quebra: em telas estreitas a câmera abre o FOV para o prédio caber na largura e o painel vai para baixo. Os rótulos dos cubos ficam apertados.
- Diferenças visuais em relação ao concept: ver [docs/REVIEW.md](docs/REVIEW.md).
