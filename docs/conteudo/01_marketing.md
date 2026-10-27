# 01 · Marketing: Demanda, Lifecycle e Marca

**id:** `marketing-growth` · **Data:** 20/10/2026
**Dupla:** Gerente de Marketing de Demanda B2B com vivência em Marketing Ops (para o B2C, consulta a quem já coordenou um "time de CRM" em varejo e app) + Arquiteto de CRM/RevOps, autor do `00_arquitetura_areas.md`.
**Base:** `00_arquitetura_areas.md` §5.3, §6, §7 (briefing de Marketing) e §8. Ponto de partida: `src/content/areas.ts`. **Nenhum código foi alterado.**

> **Consolidado em 20/10/2026.** Este arquivo foi harmonizado com o `09_consolidacao.md`, que vale em caso de diferença. O bloco `ts` da seção 2 é a versão final para `areas.ts`, e o bloco da seção 3 já traz o texto final das relações.
> **O que a consolidação mudou aqui:**
> - a automação do "SAIR" ficou "o opt-out vale para toda ferramenta" (o opt-out é registrado no Consentimento);
> - a decisão do `feedback` ganhou ponto final;
> - a relação 8 ficou nos dois sentidos (texto de `04`);
> - a 11 usa "parou de usar";
> - a 12 junta o opt-out (daqui) com o prazo combinado com Vendas (de `08`).
>
> **Decidido:** o rótulo "Lifecycle / CRM" fica (decisão 10 do `09`), e a pausa de ofertas segue a regra da decisão 16.

---

## 1. O que mudou e por quê

1. **Frase da área sem palavra vazia (briefing 6).** Saíram "orquestrar", "jornada" e "relevante". A frase agora diz o que a área faz no CRM: atrai leads, registra a origem e decide quem recebe cada mensagem. *Diferença do §8.9:* "entrega o lead a Vendas" saiu do hover, porque o time de CRM do B2C não se reconhece nessa frase e o e-commerce não tem essa passagem. A passagem continua na subárea Demanda, na variação B2B e na relação nº 1.
2. **Uma subárea só de Demanda (briefing 2).** Growth/Aquisição e Performance/Mídia viraram "Demanda / Aquisição", com um processo só: verba → lead com origem → MQL para Vendas. A decisão ganhou critério de verdade: pôr verba onde vira venda, não onde dá clique.
3. **MQL, prazo e descarte com regra (briefing 1).** Vira MQL o lead com perfil do público e score acima do corte. Pedido de orçamento vira MQL direto. O SDR tem 4h úteis para abordar (ilustrativo). O descarte volta com motivo de lista fechada, e o lead segue nas mensagens da Lifecycle. O especialista queria uma estação "Marketing Ops"; o arquiteto a manteve em RevOps (§3). Marketing e Vendas definem o corte, e RevOps configura.
4. **O "time de CRM" é uma estação (briefing 3).** A subárea se chama "Lifecycle / CRM", e a variação B2C diz isso com todas as letras: o time que o mercado chama de CRM é uma estação de uma coluna. O "quando não falar" virou regra: checar aceite, ticket crítico e fatura vencida antes de enviar. Para equilibrar, o par sem/com CRM da Visão é B2B (a briga de leads) e o caso é B2C (carrinho e cupom).
5. **Marca entra como "Marca & Conteúdo" (briefing 4)**, só com o que passa pelo CRM: modelos de mensagem e tom de avisos difíceis (atraso, cobrança, reclamação pública). A subárea recebe o caso da Ouvidoria e devolve a resposta aprovada. Saíram biblioteca de ativos, guia de marca e "performance de linguagem".
6. **Objetos com campos (briefing 5).** Lead, contato, consentimento, campanha e segmento aparecem com os campos que a área preenche. O campo crítico é a origem do lead, em lista fechada. O opt-out fica no contato, e não em cada ferramenta.
7. **Brain com fonte do número.** Saiu "CAC × LTV", que agora é RevOps–Financeiro (§5.1, nº 9). Cada indicador diz de qual campo sai, e entrou o ritual de segunda com Vendas.
8. **Falhas reais no painel.** Entraram a lista da feira importada tarde, a meta em volume de leads e o opt-out preso no WhatsApp. O retorno do dado virou caso: quem entra com cupom cancela no 2º mês, e Marketing troca o cupom e o público.

---

## 2. Conteúdo final

```ts
{
  id: "marketing-growth",
  oneLiner: "Atrai leads, registra a origem e decide quem recebe cada mensagem.",
  keyQuestion: "Quais origens trazem clientes que ficam, e quem pode receber mensagem hoje?",
  withoutCrm: "Marketing comemora o volume de leads, Vendas diz que são ruins, e ninguém consegue provar.",
  withCrm: "Cada lead tem origem e etapa; o descarte tem motivo, e o prazo de resposta é medido.",
  scenario: {
    steps: [
      "19h40: a cliente deixa um tênis de R$ 300 no carrinho.",
      "19h41: a régua confere: aceite no WhatsApp sim, ticket crítico não.",
      "10h, dia seguinte: cupom no WhatsApp; o SAC já tem as regras.",
      "10h20: ela compra; o pedido fica ligado à campanha e à régua.",
    ],
    outcome: "No fim do mês, compras e opt-outs da régua decidem se o cupom continua.",
  },
  variants: {
    b2b: "Ciclo longo: o MQL vai a Vendas com prazo; o descarte volta com motivo.",
    b2c: "O “time de CRM” é a subárea Lifecycle: régua de e-mail, push e WhatsApp.",
    small: "Uma pessoa, muitas vezes com agência; o lead chega no WhatsApp, sem origem.",
  },
  brain: {
    objectives: [
      "Gerar demanda que vira venda",
      "Gerar recompra e indicação pela régua",
      "Falar só com quem aceitou receber",
    ],
    decisions: [
      "Qual canal recebe a verba do mês?",
      "Vendas descarta demais: o corte de MQL está errado?",
      "Qual régua manter, ajustar ou desligar?",
    ],
    indicators: [
      { name: "Receita por origem", source: "origem do lead na venda fechada" },
      { name: "MQL aceitos por Vendas", source: "etapa e motivo de descarte" },
      { name: "Conversão e opt-out por régua", source: "envio, venda e opt-out" },
    ],
    ritual: "Segunda, com Vendas: MQLs, descartes por motivo e SLA estourado.",
    customerImpact: "Quem pede orçamento tem retorno no dia; quem pede para sair, sai.",
  },
  heart: {
    routine: "Calendário de campanhas e réguas: mesa compartilhada e grade de disparos.",
    roles: ["Gerente de marketing", "Analista de performance", "Analista de CRM", "Analista de conteúdo"],
    dayInLife: [
      { time: "09h", action: "O analista de performance pausa o anúncio que mais gera descarte." },
      { time: "11h", action: "O analista de CRM confere segmento e exclusões antes do disparo." },
      { time: "16h", action: "A gerente manda ao SAC as regras do cupom de amanhã." },
    ],
    subAreas: [
      {
        id: "demanda",
        name: "Demanda / Aquisição",
        process: {
          origin: "Meta do trimestre e verba de mídia",
          decision: "Pôr verba onde vira venda, não onde dá clique",
          output: "Leads com origem; o MQL vai a Vendas",
        },
        handoff: { to: "vendas", object: "MQL com origem e score" },
        record: "Lead: origem, campanha, score e etapa",
        customerImpact: "O SDR liga sabendo o que a pessoa baixou.",
      },
      {
        id: "lifecycle",
        name: "Lifecycle / CRM",
        process: {
          origin: "Compra, carrinho parado, queda de uso, lead descartado",
          decision: "Checar aceite, ticket crítico e fatura vencida antes de enviar",
          output: "Mensagem enviada, ou adiada se há pendência",
        },
        handoff: { to: "atendimento", object: "Oferta com regras do cupom" },
        record: "Contato: envios, respostas e consentimento",
        customerImpact: "Quem reclamou ontem não recebe “compre de novo” hoje.",
      },
      {
        id: "marca-conteudo",
        name: "Marca & Conteúdo",
        process: {
          origin: "Reclamação pública, aviso de atraso ou cobrança",
          decision: "Definir tom e o que não se pode prometer",
          output: "Resposta pública e modelo de aviso aprovados",
        },
        handoff: { to: "atendimento", object: "Resposta aprovada para caso público" },
        record: "Modelo de mensagem: canal, uso, versão",
        customerImpact: "O aviso de atraso soa como explicação, não como anúncio.",
      },
    ],
    pitfalls: [
      "Lista da feira importada semanas depois, sem origem: o lead esfria.",
      "Meta em volume de leads: o número sobe e as oportunidades não.",
      "“Não me mande nada” fica só no WhatsApp; o e-mail segue enviando.",
    ],
  },
  backbone: {
    crmObjects: [
      { object: "Lead", actions: ["cria", "edita"], fields: ["origem", "score", "etapa", "motivo de descarte"] },
      { object: "Contato", actions: ["cria", "edita"], fields: ["e-mail", "telefone", "segmento"] },
      { object: "Consentimento", actions: ["cria", "edita"], fields: ["canal", "finalidade", "data do aceite", "opt-out"] },
      { object: "Campanha", actions: ["cria", "edita"], fields: ["UTM", "verba", "regras da oferta"] },
      { object: "Segmento", actions: ["cria", "edita"], fields: ["critério", "exclusões: ticket e fatura", "régua"] },
    ],
    criticalField: "Origem do lead, em lista fechada. Sem ela, ninguém sabe qual verba virou venda.",
    // o painel monta "Quando {when} → {then}"
    automations: [
      { when: "o lead vira MQL", then: "o SDR tem 4h úteis para abordar" },
      { when: "há fatura vencida", then: "o contato sai das ofertas até pagar" },
      { when: "alguém responde “SAIR”", then: "o opt-out vale para toda ferramenta" },
    ],
    neighborSystems: ["Automação de marketing", "Plataformas de anúncio", "Canais de mensagem"],
    feedback: {
      data: "Quem entra com cupom cancela no 2º mês",
      decision: "Marketing corta o cupom e muda o público dos anúncios.",
    },
    governance: "Quem envia mensagem vê o opt-out; a agência não exporta a base.",
  },
}
```

**Passagens das subáreas:** Demanda → **Vendas** (MQL com origem e score) · Lifecycle → **Atendimento** (oferta com regras do cupom) · Marca & Conteúdo → **Atendimento** (resposta aprovada para caso público, fechando o ciclo com a Ouvidoria).

**Contagem** (o mesmo critério foi aplicado ao exemplo de Atendimento do §6.5). Todos os campos estão dentro do §6.4. As subáreas abertas têm 44, 45 e 45 palavras (máximo de 45).

| Aba | Marketing | Exemplo de Atendimento | Orçamento do §6.1 |
|---|---|---|---|
| Visão | 156 | 157 | 110 |
| Brain | 88 | 83 | 90 |
| Heart | 100 | 103 | 100 |
| Backbone | 119 | 123 (com a coluna Dono) | 110 |

**Glossário (§8.5):** o painel usa quatro termos que ainda não estão na tabela.
- **Score:** nota do lead que soma perfil e sinais de interesse.
- **SDR:** pré-vendedor que faz a primeira abordagem do lead.
- **UTM:** etiqueta no link que diz de qual campanha veio o clique.
- **Lifecycle:** mensagens para leads e clientes conforme a etapa de cada um.

---

## 3. Relações desta área

São as 5 relações do §5.3 que envolvem Marketing (nº 1, 8, 11, 12 e 15). No tipo, "passagem" vira `handoff` e "retorno" vira `feedback`.

```ts
[
  // §5.3 nº 1
  {
    a: "marketing-growth", b: "vendas",
    floor: "heart", nature: "handoff",
    object: "Lead (MQL) → oportunidade",
    why: "Lead com origem e score, com prazo de resposta; o descarte volta com motivo.",
    breaks: "Lead fica dias sem dono; cada área culpa a outra.",
  },
  // §5.3 nº 8 (final: dois sentidos, texto de 04)
  {
    a: "marketing-growth", b: "atendimento",
    floor: "heart", nature: "dependência",
    object: "Campanha com regras ↔ ticket crítico e caso público",
    why: "Regras do cupom chegam ao SAC antes do disparo; ticket crítico pausa a promoção.",
    breaks: "O SAC desconhece o cupom; quem reclamou ontem recebe promoção hoje.",
  },
  // §5.3 nº 11 (final)
  {
    a: "produto", b: "marketing-growth",
    floor: "heart", nature: "dependência",
    object: "Evento de uso (ativou / parou de usar)",
    why: "O uso real decide a próxima mensagem da régua de ativação.",
    breaks: "E-mail pede uma ação que o cliente já fez.",
  },
  // §5.3 nº 12 (final: opt-out de 01 + prazo combinado de 08)
  {
    a: "revops", b: "marketing-growth",
    floor: "heart", nature: "dependência",
    object: "Regras do lead e do opt-out: score, distribuição, SLA",
    why: "Score, distribuição e prazo combinados com Vendas; o opt-out vale em toda ferramenta.",
    breaks: "A regra mudou na planilha, não no CRM.",
  },
  // §5.3 nº 15
  {
    a: "customer-success", b: "marketing-growth",
    floor: "heart", floorB: "brain", nature: "feedback",
    object: "Motivo de cancelamento, NPS, indicação",
    why: "Quem fica e quem sai redefine o público e as mensagens.",
    breaks: "Marketing segue atraindo o perfil que mais cancela.",
  },
]
```

**Ajuste na nº 12 (RevOps → Marketing): aceito na consolidação.** O texto final junta esta proposta (opt-out) com a de `08_revops.md` (prazo combinado com Vendas).

| Campo | Antes (§5.3) | Final |
|---|---|---|
| `object` | Regras do lead: score, distribuição, SLA | Regras do lead e do opt-out: score, distribuição, SLA |
| `why` | Regras únicas de quando o lead passa e para quem. | Score, distribuição e prazo combinados com Vendas; o opt-out vale em toda ferramenta. |
| `breaks` | A regra mudou na planilha, não no CRM. | (igual) |

**Nº 8, final:** a relação passou a ter os dois sentidos, como propôs `04_atendimento.md`. As regras do cupom vão ao SAC, e o ticket crítico e o caso público voltam para a Lifecycle e para Marca & Conteúdo.

**Motivo.** O consentimento é um dos 5 objetos de Marketing, e a falha mais comum é o opt-out ficar preso numa ferramenta (a 3ª armadilha). Quem garante que todas as ferramentas de envio leiam o mesmo registro é RevOps, pela subárea "Integrações e acesso" e pela governança LGPD do §7. Sem esse ajuste, a regra existe em Marketing, mas ninguém cuida da parte técnica. O ajuste não cria linha nova: Marketing continua com 5 relações e RevOps com 3.

**Fica sem relação nova, de propósito:**
- O caso da Ouvidoria que vai para Marca & Conteúdo e volta como resposta aprovada usa o mesmo par da nº 8 (Marketing–Atendimento).
- A pausa de ofertas por fatura vencida usa o status de pagamento, que já é o objeto da nº 13 (Financeiro → CS, chave). Não criamos Financeiro → Marketing. Sugestão para a dupla de Financeiro: no B2C, citar que o mesmo status pausa as ofertas de Marketing.

---

## 4. Para validar

1. **Corte de MQL e prazo de 4h úteis.** Um gerente de pré-vendas B2B deve confirmar se os números ilustrativos são plausíveis e se o pedido de orçamento entra direto como MQL.
2. **Motivos de descarte em lista fechada.** A proposta é: sem perfil, sem orçamento, sem momento, contato inválido, já é cliente, concorrente ou estudante. Quem confirma é Vendas, que preenche o campo.
3. **Rótulo "Lifecycle / CRM" na estação.** *Decidido no `09` (decisão 10): o rótulo fica.* Falta só confirmar com quem já coordenou um time de CRM em varejo ou app que esse é o nome usado no mercado.
4. **Pausa por ticket crítico e fatura vencida.** *Decidido no `09` (decisão 16):*
   - Atendimento define o que é ticket crítico, e Financeiro marca a fatura vencida.
   - Marketing aplica a pausa, e RevOps configura a regra.
   - Só a oferta pausa; os avisos de entrega e de cobrança continuam.
5. **Quem aprova o texto de cobrança e de atraso.** Pode ser Marca & Conteúdo, Financeiro ou Jurídico. Essa fronteira muda muito de uma empresa para outra.
