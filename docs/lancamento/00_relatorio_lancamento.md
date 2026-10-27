# Relatório de lançamento · CRM como Sistema

**Data:** 24/10/2026 · **Pedido do autor:** revisar com quatro papéis (usuário-alvo, UX/IHC, dev de jogos educativos, arquiteto de CRM) se o site está pronto para o mercado, e entregar o site com os refinamentos para o lançamento. O site passa a ser o primeiro canal de captação da mentoria.

## 1. Veredito

| Revisor | Veredito inicial | Motivo principal |
|---|---|---|
| Usuário-alvo (Rafael) | **Não pronto para captar** | Nenhum autor, oferta ou contato em lugar nenhum; a síntese não fechava a ideia |
| UX / aprendizado | Pronto com ajustes | Sem Open Graph (link sem cartão no LinkedIn); a roda do mouse sobre o cartão travava a descida |
| Jogos / 3D | Pronto com ajustes | 7–12 fps em GPU integrada; salto de capítulo ao redimensionar |
| Arquiteto de CRM | Pronto com ajustes | Financeiro contradizia Vendas sobre quem aprova desconto; números da Aurora não fechavam |

**Depois desta rodada: pronto para publicar**, com três coisas que só o autor pode fazer (§5). Todos os P0 e os P1 que não dependiam de aparelho real foram resolvidos; os P2 ficam listados em §6.

## 2. O que mudou

### Conteúdo (a autoridade do mentor)
- **As 8 áreas no contrato didático** (ideia central por andar, "Entenda o porquê", "Pense na sua empresa"), escritas por duplas simuladas de especialista + arquiteto, a partir dos 15 achados do arquiteto e dos 19 pontos de validação respondidos (`docs/lancamento/01`, `docs/conteudo/13`).
- **Dois casos por área**, que atravessam o prédio inteiro: **Aurora Transportes** (cliente de um software B2B) e **Marina** (cliente de uma loja online). O leitor alterna no painel; o seletor segue a escolha B2B/B2C.
- **Fio condutor fechado:** desconto sobe pela escada do Comercial (Financeiro aprova crédito e prazo); implantação R$ 17,6 mil em duas parcelas; mensalidade R$ 4.000 do go-live; uma fatura vencida na renovação por causa nova; o mesmo motivo de ticket em Atendimento e Produto.
- **Rodada de autossuficiência:** depois do teste com o leitor iniciante (Marketing 7, CS 6, Financeiro 5), cada área passou a se bastar sozinha: termos traduzidos na 1ª menção, uma unidade de tempo por caso, sem repetições, 2ª camada sempre com mecanismo.
- **Síntese nova:** "Tecnologia não corrige operação" explicada em 3 passos, a definição de CRM, o teste do mentor ("pergunte a dois vendedores o que significa 'proposta enviada'"), os 4 cartões do ciclo com a história da Aurora, "Você estudou N de 8 áreas", e as áreas transversais (Jurídico, TI, Dados/BI, Diretoria).
- **Glossário curado:** 139 → 102 termos; entraram "CRM (como usamos aqui)", "Disparo / campanha", "Automação", "Cadastro duplicado"…; definições fundidas; falsos destaques eliminados.
- **Rooftop:** diz o que é, quanto dura e que dá para parar em qualquer área. **Cada andar** termina com "O que fica deste andar".

### Conversão (o site como porta da mentoria)
- **Bloco "Quem fez isto"** na síntese e no fim da versão em texto: nome, frase, duas ofertas (mentoria · aplicação em empresas), **WhatsApp** (mensagem pronta), **LinkedIn** e **formulário** (nome, e-mail, empresa, mensagem). Fiel ao PRD: nada obrigatório, depois do conteúdo, sem modal.
- Formulário envia e-mail pela rota `/api/contato` (Resend). Sem as variáveis, o formulário se esconde e ficam WhatsApp e LinkedIn.
- "GUI BLOCK · CRM COMO SISTEMA" no topo leva ao bloco. Textos em `src/content/author.ts`.

### Divulgação
- **Open Graph e Twitter card** com imagem do prédio e a tese (`public/og.png`, 1200×630, gerada por `scripts/og-image.mjs`); ícone; site indexável.

### Experiência
- Percurso guiado acompanha **Vendas** (a área mais completa); clicar numa área já escolhida **abre o painel** (antes desmarcava).
- O painel abre **na Visão** na primeira vez em cada área; depois segue a câmera.
- Cartão do capítulo não trava mais a roda do mouse; barra de progresso de 2 px; subtítulos dos andares na barra (telas largas); seta de rolagem com pulso.
- Painel mais leve: "Um dia na área" e "Conexões neste andar" recolhidos nas abas de andar; tablet com linha ≤ 68 caracteres.
- Celular: tocar numa aba ou estação abre a folha em tela cheia; cabeçalho e rodapé compactos; estações escolhidas pelos chips (os números 3D se sobrepunham); alvos de toque maiores.
- Aviso de aparelho fraco virou toast no canto, com fechar, Esc e tempo; "Versão em texto" com um nome só, sumário e contato.
- Rótulos das áreas na fachada **não colidem** (o de menor prioridade desce uma linha).

### Técnica
- **Modo leve para GPU integrada:** detecta Intel/Iris/Mali/Adreno e começa sem bloom e sem MSAA; degraus do monitor de desempenho: dpr teto → 1 → leve → 0,75; aviso após uma janela de 4 s.
- **Posição preservada** ao redimensionar, girar o celular ou dar zoom (antes pulava de capítulo).
- `translate="no"` nos rótulos e menus (tradução automática do navegador quebrava o React); `safe-area-inset` no topo.

## 3. Testes

| Teste | Resultado |
|---|---|
| `npm run test:xp` (build de produção, 33 verificações: navegação, painel, estações, glossário, síntese, contato, metadados, celular, aparelho fraco) | **33/33**, em duas rodadas seguidas |
| `npm run check:responsive` (7 formatos × 6 momentos) | **7/7**, sem erros nem sobreposições |
| `npx tsc --noEmit` / `npm run build` | sem erros |
| Prints | `docs/screenshots/launch-*.png`, `lesson-{vendas,financeiro,marketing-growth}-*.png` |

## 4. Relatórios dos revisores

`01_arquiteto_crm.md` · `02_ux_aprendizado.md` · `03_usuario_alvo.md` · `04_jogos_3d.md`. O teste do leitor iniciante nas áreas novas está resumido em `docs/conteudo/13_f3_oito_areas.md`.

## 5. O que só o autor pode fazer

1. **E-mail do formulário:** definir `CONTACT_TO` (e criar a conta no Resend) na Vercel. Até lá, o site mostra WhatsApp e LinkedIn.
2. **Textos do bloco "Quem fez isto"** em `src/content/author.ts` (frase de posicionamento, as duas ofertas, a mensagem do WhatsApp): estão como proposta.
3. **Publicar** seguindo `DEPLOY.md` e conferir o cartão do link no Post Inspector do LinkedIn.

**Decisões de conteúdo a confirmar** (todas documentadas em `docs/conteudo/13`): 6 objetos no Backbone em Produto, Financeiro e CS; números ilustrativos novos (expansão da Aurora ≈ R$ 12 mil/ano; "1 em 5 trocas"); "site público de reclamação" em vez de nomear o Reclame Aqui; relógio de cada área contado do próprio início.

## 5b. Rodada de 26/10: celular

**Pedido do autor:** no celular, o Backbone ficava atrás do cartão. A pergunta era se valia desativar o 3D.

**Decisão:** leitura guiada no celular, com o 3D opcional. Os detalhes estão em `docs/RESPONSIVIDADE.md` §1b.

**Testes:**
- `test:xp` com **34/34** em duas rodadas. Entrou um teste novo: o celular abre na leitura, não baixa o 3D, o painel vira página, o botão Voltar fecha o painel, a síntese tem o contato e dá para ir ao 3D e voltar.
- Auditoria de responsividade com o momento Backbone: 0 rótulos escondidos e 0 sobreposições nos 7 formatos.

## 5c. Rodada de 26/10: boas-vindas com e-mail e nível

**Pedido do autor:** coletar dados logo na entrada, com uma boas-vindas personalizada pedindo e-mail e nível de conhecimento em CRM. Isso muda a regra anterior do PRD ("nenhuma captura na entrada"), por decisão do autor.

**Como ficou:**
- **Saudação** pela hora do visitante ("Boa tarde!"), com o nome quando o link traz `?nome=`, e "Que bom te ver de novo" para quem volta.
- **E-mail e 4 níveis** (começando, uso no dia a dia, configuro ou gerencio, desenho a operação). Depois do envio, uma dica de percurso para aquele nível.
- **Cada cadastro chega em contato@guiblock.com** com nível, modo de entrada (3D ou leitura guiada) e origem (utm e site anterior). Responder o e-mail fala direto com o visitante.
- **"Entrar sem deixar e-mail"** continua possível; a tela volta depois de 30 dias. O prédio carrega atrás enquanto a pessoa responde.
- **Página `/privacidade`** em linguagem simples (LGPD), linkada no formulário.
- O e-mail informado já aparece preenchido no formulário de contato da síntese.

**Testes:** `test:xp` com **36/36** (dois testes novos: envio com nome, origem e validação da rota; celular sem rolagem lateral e entrada sem e-mail). Prints em `docs/screenshots/welcome-*.png` (`node scripts/capture-welcome.mjs`).

## 6. O que ficou para depois (P2 e ideias)

- **Mecânicas de aprendizagem** propostas pelo dev de jogos: "Siga a área até a base" (6–8 h), "Onde a passagem quebra?" (10–12 h), "Mande o dado de volta" (5–6 h).
- Processo origem → decisão → saída mais legível no 3D (placas maiores ou mini-rótulos).
- Perda de contexto WebGL com aviso; tela de carga com título e barra; quadro do Brain ampliado ao selecionar.
- Termo do glossário no toque: mini-folha em vez da gaveta inteira.
- Aparelhos e navegadores reais (iPhone/Safari, Android, notebook corporativo), leitor de tela real, teste com tradução automática do Chrome.
- Telemetria fora do navegador (hoje só eventos locais) e domínio próprio.
