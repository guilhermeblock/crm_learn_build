# Áreas e relações — recomendações de especialista (CRM / RevOps)

Revisão feita em 2026-10-20 para dar base real ao conteúdo da maquete. **Status:**
- ✅ **Aplicado:** mapa de relações (§1), postos do Heart (§3), Backbone sem centro (§4). Uma pessoa por área no Heart, por causa do limite de figuras do briefing.
- ✅ **Aplicado em 21/10:** formas de gráfico dos quadros do Brain (§2), com os indicadores revisados em `docs/conteudo/` (`src/scene/floors/boardCharts.ts`).
- ✕ **Não aplicado por decisão:** laranja para "conta em risco" (reservado para um alerta real) e exibir só 3 relações sem seleção (o autor preferiu manter o emaranhado, com as 3 principais em destaque).

## 1. Relações entre áreas (16)

Fonte no código: `RELATIONS` em `src/scene/connections/neuralPaths.ts` (cada uma tem o campo `why`).

| Andar | Relação | Natureza | Por quê |
|---|---|---|---|
| rooftop | Marca – Marketing | meta compartilhada | Posicionamento e mensagem são a mesma promessa ao mercado |
| rooftop | Produto – Marca | meta compartilhada | O que a marca promete é o que o produto entrega |
| heart | Marketing → Vendas | handoff | Lead qualificado com origem e contexto; perdas voltam com motivo |
| heart | Vendas → Operações | handoff | Escopo, prazo e condição vendidos viram ordem de entrega |
| heart | **Vendas → CS** ★ | handoff | Cliente fechado passa com contexto, expectativas e critério de sucesso |
| heart | Atendimento – CS | handoff/feedback | Escalonamento de contas; chamados entram na saúde da conta |
| heart | Operações – Atendimento | dependência | Status da entrega responde o cliente; falha vira contato |
| heart | Produto – Operações | dependência | Lançamento precisa caber no processo de entrega |
| brain | Marketing – Financeiro | meta compartilhada | Orçamento por canal decidido por CAC × LTV |
| brain | Vendas – Financeiro | meta compartilhada | Previsão de receita, política de desconto e crédito |
| brain | Produto – CS | meta compartilhada | Adoção e tempo até valor são a mesma meta |
| brain | Financeiro – Operações | meta compartilhada | Custo de servir e margem |
| heart → brain | **CS → Marketing** ★ | feedback | Clientes saudáveis viram casos e indicações: o ciclo fecha |
| heart → brain | **Atendimento → Produto** ★ | feedback | Motivos de contato priorizam o roadmap |
| brain → heart | Marca → Atendimento | dependência | Tom de voz e reputação aplicados no contato |
| brain → heart | Financeiro → CS | dependência | Renovação e cobrança orientam CS; inadimplência é risco |

★ As 3 relações centrais do argumento "CRM atravessa a empresa": ficam em destaque na cena.
- **Relações por área:** de 3 a 5. CS tem 5, de propósito, para tirar Vendas do centro.
- **Se precisar reduzir para 12:** tirar Produto–Marca, Produto–Operações, Vendas–Financeiro e Financeiro–Operações.

## 2. Brain — famílias de indicadores por quadro (sem números) ✅

> Os quadros usam hoje os indicadores revisados pelas duplas (`docs/conteudo/01–08`) e não mais a tabela abaixo, que é da primeira revisão.

| Área | 1 | 2 | 3 |
|---|---|---|---|
| Marketing | Volume e qualidade da demanda por canal | CAC × LTV por canal* | Conversão por etapa da aquisição |
| Vendas | Conversão e velocidade do pipeline | Cobertura do pipeline × previsão* | Taxa de ganho e motivos de perda |
| Produto | Adoção e uso | Tempo até valor* | Roadmap priorizado por impacto |
| Atendimento | Tempo de resposta e resolução | Contatos por motivo e canal | Resolução no 1º contato e satisfação |
| CS | Saúde da carteira | Retenção, renovação e expansão | Tempo até valor no onboarding* |
| Financeiro | Receita realizada × prevista* | CAC × LTV e payback* | Margem, custo de servir, inadimplência* |
| Operações | Prazo e qualidade da entrega | Capacidade × demanda | Custo de servir e retrabalho* |
| Marca | Reputação e sentimento | Lembrança e consideração | Coerência entre promessa e experiência |

\* Indicador compartilhado: aparece igual nos dois quadros de uma relação de Brain.

**Formas de gráfico sugeridas** (no lugar das barras genéricas):
- **funil:** conversão;
- **barras pareadas:** comparações A × B;
- **linha:** prazo e tendência;
- **grade de blocos:** carteira, saúde e capacidade.

## 3. Heart — posto de cada área (aplicado)

| Área | Rotina | Na maquete |
|---|---|---|
| Marketing | Planejamento de campanhas | Mesa compartilhada + calendário em grade |
| Vendas | Reunião de pipeline | Quadro de etapas com cartões em funil; pessoa em pé |
| Produto | Descoberta e priorização | Mesa alta + quadro agora / próximo / depois |
| Atendimento | Fila em vários canais | Duas baias + painel da fila |
| CS | Acompanhamento do cliente | Mesa redonda (a cadeira vazia é o cliente) + tela da carteira |
| Financeiro | Fechamento e aprovações | Monitor largo, bandejas de documentos, arquivo |
| Operações | Expedição / implantação | Bancada, caixas e quadro recebido → execução → entregue |
| Marca | Revisão criativa | Mesa de estúdio com peças + painel de referências |

## 4. Backbone — dados que cada área produz e consome

| Área | Produz | Consome |
|---|---|---|
| Marketing | Leads com origem; engajamento; consentimento (LGPD) | O que virou venda; retenção por segmento |
| Vendas | Oportunidades e etapas; propostas, contratos, pedidos | Leads com histórico; condições de crédito |
| Produto | Eventos de uso; catálogo e planos | Motivos de contato; saúde por conta |
| Atendimento | Chamados com motivo, canal e prazo; satisfação | Status da entrega; base de conhecimento |
| CS | Saúde da conta; renovações e expansão; NPS | Uso, chamados, pagamentos, contexto da venda (maior consumidor) |
| Financeiro | Faturas, pagamentos, inadimplência; custos | Contratos e pedidos; entregas concluídas; gasto de mídia |
| Operações | Ordens de entrega com status; capacidade e estoque | Escopo ou pedido vendido |
| Marca | Biblioteca de ativos; menções, sentimento, avaliações | Reclamações e NPS |

**Na cena:** bandejas em malha (anel externo, anel interno e eixos) e cloud do porte de um rack. Nada converge para um centro, e nenhum objeto se chama "CRM".

## 5. Riscos de mensagem

- **Vendas como protagonista:** o quadro de pipeline não pode ser o único com "cara de CRM". Fila (Atendimento) e carteira (CS) precisam ter o mesmo peso visual.
- **"Servidor central = CRM":** o CRM é o prédio inteiro funcionando.
- **Excesso de linhas:** o filamento de relação é menos ondulado que o dendrito (relação ≠ anatomia).
- **Nomes de ferramentas:** nada de marcas de software.
- **Áreas que costumam ser esquecidas:** Financeiro, Operações, Marca e Atendimento.

## 6. B2B × B2C

- **CS:** em B2C vira "Relacionamento / Fidelização".
- **Vendas:** no varejo é loja ou e-commerce.
- **Operações:** implantação no B2B, logística no B2C.
- **Produto:** software, produtos à venda ou portfólio de serviços.
- **Financeiro → CS:** forte em recorrência. No varejo, o equivalente é Financeiro ↔ Atendimento (estorno e reembolso).
- **Operações ↔ Atendimento e Marca → Atendimento:** muito fortes no B2C.
