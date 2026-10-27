# Revisão de lançamento · 3 · Usuário-alvo (simulado)

**Data:** 24/10/2026 · **Persona:** Rafael, 31, analista de marketing; na empresa dele "CRM" é a ferramenta de disparos; chegou por um post no LinkedIn; 15 minutos no notebook e 3 no celular · **Método:** percurso real com Playwright (1440×900 e 390×844), lendo o que está na tela.

## Veredito

**Não pronto para captar clientes; pronto com ajustes como aula.** A experiência ensina (sobretudo Vendas), mas em nenhum lugar existia quem é o autor, o que oferece ou como falar com ele; e a resposta a "o que é CRM além de disparo e pipeline?" só aparecia inteira no modo texto, não na síntese do 3D.

## O percurso, em resumo

- **Chegada:** "Carregando o prédio…" numa tela preta por 3–8 s, sem título. Depois, o rooftop impressiona; ele entende "oito áreas, três andares" sem ler nada.
- **Rolagem:** "Pergunta do andar" é o melhor texto do site. Mas apareceu "ESTUDANDO PRODUTO NO BRAIN →" sem ele ter clicado ("eu não escolhi Produto"). No Heart apareceu o aviso de 3D pesado (8–23 fps numa Intel integrada).
- **Marketing (área dele, formato antigo):** o painel abriu na aba do andar, não na Visão; 11 termos sublinhados só na Visão; o caso do tênis não dizia que empresa é. Quase fechou a aba: parecia documentação interna de consultoria.
- **Vendas (formato novo):** mudou tudo. "Cada vendedor anota na própria planilha e no WhatsApp; o gerente soma palpites": ele riu, é a empresa dele. Primeira vez que pensou "ah, então CRM é isso".
- **Atendimento (formato antigo):** bom caso, mas voltou o telégrafo.
- **Estações no Heart:** surpresa positiva; foi quando "corrida de revezamento" fez sentido.
- **Glossário:** balão ótimo; mas buscou "disparo" → 0, "automação" → 0, e não há verbete "CRM".
- **Síntese:** abstrata; quatro cartões sem explicação; nenhum autor, nenhum contato ("legal, mas de quem é isso?").
- **Modo texto:** 9 mil palavras num overlay com três nomes diferentes; a melhor frase do site estava só ali.
- **Celular:** funciona, mas o cabeçalho ocupa ~190 px; a dica diz "passe o mouse"; o aviso de 3D pesado cobria a folha.

**Ele respondeu à pergunta?** Sim, mas só depois de Vendas + modo texto. Nas palavras dele: *"Não é a ferramenta de disparo nem só o funil. É a empresa inteira combinando como registra e usa o que sabe do cliente: cada área decide, faz e anota a parte dela, e o que uma anota a outra usa. Disparo e pipeline são a parte que aparece na tela."*

**Entendeu quem é o autor?** Não. Teve vontade de conversar depois de Vendas; não achou onde.

## Achados

| # | Prioridade | O que | Correção |
|---|---|---|---|
| 1 | **P0** | Sem autor, oferta e contato (3D, modo texto, topo) | Bloco final na síntese e no modo texto: nome, 2 frases, WhatsApp + LinkedIn; "Sobre" no topo |
| 2 | **P0** | A síntese do 3D não fecha a ideia; os 4 cartões do ciclo não têm conteúdo | Trazer a definição para a síntese; "disparos, régua e pipeline são a parte visível"; os 4 cartões com uma linha cada usando a Aurora |
| 3 | P1 | 7 áreas telegráficas, inclusive Marketing e Atendimento, as portas de entrada | Contrato didático nas 8 |
| 4 | P1 | Painel abre no andar atual, não na Visão | 1ª abertura de cada área em Visão |
| 5 | P1 | Demo automática "Estudando Produto" sem interação | Trocar para Vendas; rotular como exemplo; no celular, fora do topo |
| 6 | P1 | Glossário não fala a língua do iniciante | Verbetes "CRM (como usamos aqui)", "Disparo / campanha", "Automação", "Pipeline" |
| 7 | P1 | Carga e desempenho em máquina comum | Tela de carga com título e promessa; aviso uma vez, fora da folha; modo leve antes de sugerir sair do 3D |
| 8 | P1 | Painel longo e repetitivo (conexões 4× por área) | Conexões só na Visão ou recolhidas |
| 9 | P2 | Celular: cabeçalho alto, "passe o mouse", rótulos 3D de 14 px | Cabeçalho compacto; "toque numa área"; rótulos escondidos no toque |
| 10 | P2 | Três nomes para o modo texto; sem "voltar" explícito | Um nome |
| 11 | P2 | Título "Marketing: Demanda, Lifecycle e Marca" é jargão | Nome mais claro |

## O que já está forte

Metáfora do prédio; "Pergunta do andar"; Sem CRM × Com CRM; caso Aurora + "Entenda o porquê" + "Pense na sua empresa"; estações do Heart; "Onde quebra" e "Erros comuns"; balão do glossário; modo texto completo; celular sem overflow.

## Perguntas ao autor

1. Qual é a oferta e o próximo passo exato (mentoria individual, diagnóstico na empresa, newsletter)? (Respondido: mentoria e aplicação em empresas; WhatsApp, LinkedIn e formulário.)
2. Público prioritário do lançamento: analistas (Marketing e Atendimento precisam do contrato didático antes) ou gestores? (Respondido: as 8 áreas no formato novo.)
3. O 3D é o produto ou a porta? Se a maioria chegar sem GPU, aceita que a primeira experiência seja texto com o prédio de fundo, ou investe num modo leve?
