# Revisão de lançamento · 1 · Arquiteto de CRM / RevOps

**Data:** 24/10/2026 · **Papel:** especialista em arquitetura de CRM e RevOps (subagente) · **Pergunta:** o conteúdo tem profundidade realista e sustenta a autoridade do autor?

## Veredito

**Pronto com ajustes.** A base é sólida e acima do que se vê em conteúdo de CRM no Brasil (objetos com dono, motivo em lista fechada, "onde quebra", NF para quem usa e não para quem paga). Mas o prédio ainda comete, em 3 lugares, o erro que ensina a evitar (números do fio condutor que não batem e Financeiro contradizendo Vendas sobre quem aprova desconto), e isso um líder comercial experiente percebe em 5 minutos.

## Achados

| # | Prioridade | Onde | O que | Correção |
|---|---|---|---|---|
| 1 | **P0** | Financeiro (oneLiner, dayInLife, estação Crédito, decisão do Brain) | Diz que o Financeiro aprova **desconto**; Vendas (reescrita) diz que o gerente comercial aprova. Na prática, o percentual escala dentro do Comercial; Financeiro aprova **crédito e prazo de pagamento** | oneLiner "Analisa crédito e prazo, emite a NF e cobra o pagamento."; dayInLife "O crédito recusa 1 pedido de 60 dias de prazo e aprova 2, com garantia"; decisão "Que prazo e limite de crédito cada conta recebe, e quem aprova acima disso?" |
| 2 | **P0** | Fio condutor (Operações, CS, Marketing, Atendimento) | (a) Operações fatura R$ 20 mil, mas com 12% é R$ 17,6 mil; (b) CS fala em R$ 10 mil vencidos em 2 faturas, mas a mensalidade é R$ 4.000 (= R$ 8 mil); (c) o mesmo erro do e-mail de cobrança é "descoberto" duas vezes (Financeiro e CS); (d) Marina (B2C) não aparece em nenhuma área | Um evento, duas janelas: Financeiro corrige o e-mail no mês 2; CS vê no mês 9 outra fatura vencida (Aurora trocou de contador e contestou a fatura da implantação) e pausa a expansão. `company: "b2c"` em Marketing e Atendimento, com a Marina nomeada |
| 3 | P1 | Vendas × Financeiro | A aprovação do desconto mora em dois objetos (Proposta em Vendas; Oportunidade em Financeiro) | Financeiro edita **Proposta** (prazo de pagamento, aprovação de crédito, aprovador); Oportunidade só "vê" |
| 4 | P1 | Síntese | Definição de CRM "de livro"; a do doc 11 §5 (melhor) não está no site | Mecanismo em 3 passos: "O software só devolve o que alguém registrou. Alguém só registra o que uma regra exige e uma rotina confere. A regra só existe se duas áreas a combinaram." + o teste do mentor: "Pergunte a dois vendedores o que significa 'proposta enviada'. Se as respostas diferem, o CRM já está errado, seja qual for a ferramenta." |
| 5 | P1 | Marketing (LGPD) | "Falar só com quem aceitou receber" simplifica: e-mail a cliente ativo usa legítimo interesse com opt-out; opt-in no WhatsApp é regra da Meta, não da LGPD | Objetivo "Falar só com quem pode receber: consentimento ou legítimo interesse, sempre com saída fácil"; governança cita base legal por canal |
| 6 | P1 | Operações (trocas), Atendimento (ouvidoria), Marketing B2C | Faltam as regras brasileiras: 7 dias de arrependimento (CDC art. 49), estorno no cartão em até 2 faturas, consumidor.gov.br (10 dias) antes do Procon, marketplace sem contato do cliente | Uma frase em cada ponto |
| 7 | P1 | Vendas (governança) | O que sai pela porta no Brasil é o **WhatsApp pessoal com a carteira**, não o acesso ao CRM | "Conversa com cliente acontece no número da empresa (API), registrada na conta; o vendedor sai, a carteira fica." |
| 8 | P1 | Financeiro (cadastro fiscal) | SaaS é serviço (NFS-e, ISS): inscrição estadual não se aplica; o que muda o boleto são as **retenções** | "falta CNPJ, município ou e-mail de cobrança → não fecha como ganha"; campo "retenções na fonte" |
| 9 | P1 | Operações / Vendas (contrato) | Faturar 100% da implantação só no aceite é atípico; comum é 50% na assinatura e 50% no aceite, mensalidade a partir do go-live | Contrato define 50/50; Operações libera "a 2ª parcela da implantação, R$ 8,8 mil" |
| 10 | P2 | Financeiro / RevOps | Mesmo indicador com dois nomes ("Vendido × faturado" e "Receita CRM × ERP"); "×" nas fontes das 7 áreas | Um nome; Financeiro cita como meta compartilhada com RevOps |
| 11 | P2 | RevOps | "CNPJ já existe → bloqueia" é forte: matriz e filiais têm a mesma raiz | "avisa, mostra a conta existente e exige justificativa para criar outra (filial)" |
| 12 | P2 | CS | Automação abre Oportunidade, mas Oportunidade não está nos objetos de CS | "Oportunidade (cria): tipo renovação/expansão, valor, data" |
| 13 | P2 | Financeiro, relação 18 | Falta a régua de inadimplência (aviso → negociação → suspensão → negativação → protesto) e comissão sobre o **recebido** com estorno (clawback) | Uma frase em cada |
| 14 | P2 | Atendimento | "Backoffice" soa de banco/varejo; "identificar pelo CPF" vale só em B2C | "N2 / backoffice"; "CPF ou CNPJ" |
| 15 | P2 | Síntese, Backbone | Transversais ausentes (Jurídico, TI, Dados/BI, Diretoria); Backbone de Vendas mostra "sem conexões fixas" | Faixa "Transversais" na síntese; Backbone lista as relações dos outros andares com etiqueta |

## Coerência do sistema

As 18 relações fecham: donos iguais em todas as áreas; nenhum par com duas relações no mesmo andar; todo handoff tem destino válido. Fio condutor: Vendas, Financeiro (R$ 4.000) e Operações (45 dias, ERP) alinhados; CS e Operações precisam dos números acima; Produto cabe na Aurora (basta nomear); RevOps precisa entrar no fio ("cadastro duplicado", não "40 leads"); Marketing e Atendimento precisam da Marina.

## Os 19 pontos de validação (09 §6), respondidos

1. **Sim.** 4h úteis para MQL; 40 min para pedido de demo (ideal < 1h). SAC: WhatsApp 15 min ok, chat 2 min, telefone 1 min, e-mail 24h úteis.
2. **Sim.** 12% e R$ 48 mil em 30 dias é plausível para inbound de webinar; ciclo típico 30–60 dias.
3. **Sim.** 90 dias é o padrão. Régua: aviso D+1, D+5, reunião D+15; acrescentar aviso de suspensão D+30.
4. **Sim.** 14 dias sem acesso e 3 convites são gatilhos comuns.
5. **Padrão:** executivo até 10%, gerente até 20%, diretor acima; Financeiro aprova crédito e prazo.
6. **Sim:** Qualificação → Reunião realizada → Proposta enviada → Negociação → Fechamento, com critério de saída escrito.
7. **Depende do tamanho:** CS fecha expansão pequena (até ~20%); Vendas fecha a grande. "Regra combinada antes" está certo.
8. **Serviço:** CNPJ, razão social, município, e-mail de cobrança, retenções; IE não. Quem corrige e-mail: Financeiro, com histórico.
9. **Sim:** crítico = canal público, cobrança indevida, 2ª reabertura, pedido de cancelamento. Pausa termina na resolução + 7 dias.
10. Jurídico aprova o modelo uma vez (CDC art. 42); Marketing dá o tom; Financeiro dispara.
11. Implantação 50/50 ou 100% na assinatura. Estorno após conferência, exceto arrependimento de 7 dias; cartão em até 2 faturas.
12. **Sim:** ganho só com assinatura. Comissão: base = recebido (mais comum), com clawback.
13. Listas sugeridas: descarte (sem perfil, sem orçamento, sem interesse, concorrente, contato inválido, duplicado); perda (preço, prazo de implantação, concorrente, adiou, sem orçamento, sem resposta); ticket (Pedido>Onde está · Cobrança>Duplicidade · Cobrança>2ª via · Produto>Erro · Troca>Tamanho · Cancelamento>Pedido); cancelamento (não usou, preço, fechou, concorrente, atendimento, funcionalidade); ocorrência (atraso, extravio, avaria, ausente, endereço errado, recusa).
14. **Sim:** B2C diz "time de CRM"; "N2 / backoffice".
15. Retenção existe também em SaaS para PME; RevOps em empresa média: 1–2 pessoas fazem as 4 estações.
16. Ferramenta de feedback ou planilha integrada; o CRM guarda a ligação à conta.
17. consumidor.gov.br: 10 dias. Regulados: cancelamento imediato. Suspensão com aviso prévio. Acrescentar "encarregado (DPO)".
18. Pago: boleto D+1, Pix minutos, cartão na hora. Venda que não chegou ao ERP: RevOps diagnostica, o dono corrige.
19. Em B2C "RevOps" é pouco conhecido; manter com explicação. Sugestão: pergunta no rooftop ("sua empresa vende para empresas ou para pessoas?") define o padrão da visita.

## O que já está forte

Objetos com dono e C/E/V; motivos em lista fechada como fio da causa-raiz; "onde quebra"; NF para quem usa × quem paga; prazo prometido × real; aceite libera fatura e CS; ticket crítico pausa oferta mas não aviso; RevOps como 8ª coluna sem virar centro; variantes "pequena"; os porquês de Vendas.

## Perguntas ao autor

1. Na sua mentoria, o Financeiro aprova **percentual** de desconto em alguma empresa? Se não, a correção P0 é só de texto.
2. A empresa B2B do fio condutor fatura a implantação como (50/50, 100% na assinatura, 100% no aceite), e a mensalidade começa quando?
3. O site vai receber primeiro leads **B2B** ou **B2C**? Define se a Marina ganha o mesmo cuidado que a Aurora antes do lançamento.
