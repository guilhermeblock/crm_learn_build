# 10 · Diagnóstico didático dos textos e estratégia de revisão

**Data:** 21/10/2026 · **Pedido do autor:** analisar os textos num contexto educacional, com didática, mas com profundidade suficiente para não ficarem "soltos".
**Escopo lido:** `src/content/` inteiro (8 áreas × 3 andares, 6 capítulos, 18 relações, 69 termos do glossário).

## 1. Veredito em uma frase

O conteúdo está **certo e prático**, mas é **telegráfico**: são cerca de 100 fragmentos de 6 palavras por área, quase sem "porquê". Quem já conhece CRM preenche as lacunas sozinho; quem está começando recebe peças soltas, sem a ideia que as liga. O problema está na **camada de ensino**, não nos fatos.

## 2. O que medimos

| Área | Campos de texto | Palavras | Leitura | Termos do glossário | Siglas | Campos com 3+ termos | Campos que explicam o porquê |
|---|---|---|---|---|---|---|---|
| Marketing | 96 | 593 | 3 min | 50 | 18 | 5 | 4 |
| Vendas | 107 | 657 | 3,3 min | 63 | 15 | 4 | 3 |
| Produto | 95 | 602 | 3 min | 40 | 11 | 1 | 2 |
| Atendimento | 99 | 635 | 3,2 min | 51 | 9 | 2 | 4 |
| CS | 98 | 645 | 3,2 min | 65 | 19 | 11 | 3 |
| Financeiro | 103 | 660 | 3,3 min | 51 | 35 | 7 | 3 |
| Operações | 104 | 650 | 3,3 min | 37 | 15 | 0 | 2 |
| RevOps | 100 | 639 | 3,2 min | 36 | 30 | 6 | 2 |

**Como ler:**
- **6,3 palavras por campo em média:** a maior parte do texto são listas e fragmentos, não frases que explicam.
- **Um termo técnico a cada 12 palavras:** o glossário ajuda, mas uma frase com 3 termos exige 3 balões.
- **2 a 4 campos em 100 dizem por quê:** a relação de causa e efeito, que é onde mora a profundidade, fica implícita.

## 3. O que já está bom (manter)

- **Realidade:** os casos, horários, valores e erros comuns soam como empresa de verdade. Foi o pedido da revisão 2, e ele foi atendido.
- **Modelo consistente:** origem → decisão → saída em toda estação; objetos do CRM com "cria / edita / vê"; o dado que volta para a decisão.
- **"Erros comuns" e "O campo que não pode faltar":** são os trechos mais didáticos, porque mostram a consequência.
- **Glossário e versão B2B / B2C / pequena empresa.**

## 4. Os 7 problemas, com exemplos

### 4.1 Telegráfico: o aluno precisa montar o sentido sozinho
> "19h41: a régua confere: aceite no WhatsApp sim, ticket crítico não."

Está correto, mas o iniciante não sabe o que é "régua", nem por que conferir um ticket antes de mandar cupom. A frase **mostra** o mecanismo sem **explicá-lo**.

### 4.2 Falta o porquê: regra sem razão vira decoreba
> "Quando há fatura vencida → o contato sai das ofertas até pagar."

A regra é boa, mas o motivo não aparece (oferecer compra a quem deve irrita o cliente e confunde a cobrança). Sem o motivo, o aluno decora a regra e não consegue criar a próxima.

### 4.3 Jargão em pilha
> "Segunda, com Vendas: MQLs, descartes por motivo e SLA estourado."
> "Uso, tickets, faturas e renovação aparecem na conta; queda de uso vira tarefa do CSM."

São 3 ou mais termos por frase. CS (11 campos densos) e Financeiro (35 siglas) são os mais pesados.

### 4.4 Exemplo sem conceito: é isso que deixa "solto"
Cada andar lista objetivos, decisões e indicadores, mas **nenhum texto diz a ideia que os liga**. Por exemplo:
- **Brain:** "a decisão depende de um número, e o número depende de um campo que alguém preenche lá embaixo";
- **Heart:** "toda passagem entre áreas é um ponto onde a informação pode se perder";
- **Backbone:** "dado que ninguém usa para decidir é custo, não CRM".

Os capítulos têm o campo `learning`, mas ele não aparece como lente de leitura no painel. O aluno vê 15 exemplos e nenhum modelo.

### 4.5 Casos sem fio condutor
São 8 casos de 8 empresas diferentes: um tênis de R$ 300, uma oportunidade de R$ 48 mil, uma fatura de R$ 4.000, uma implantação de R$ 20 mil… Cada caso funciona sozinho, mas a tese "o CRM atravessa a empresa" se prova melhor **seguindo o mesmo cliente** de área em área. Hoje, essa costura só existe nas relações, de forma abstrata.

### 4.6 B2B e B2C misturados sem aviso
- **Casos B2C:** Marketing e Atendimento;
- **Casos B2B:** Vendas, CS, Operações e RevOps.

Quem troca de área sai de um "tênis no carrinho" e cai num "contrato de R$ 48 mil" sem saber que mudou de tipo de empresa.

### 4.7 Abertura e fechamento abstratos
- **Abertura:** "CRM é maior do que parece." O texto não diz o que é CRM, então o aluno não tem uma definição de trabalho para testar ao longo do prédio.
- **Fechamento:** "CRM dá direção à forma como esse conhecimento é usado…" é vago no ponto mais importante.
- **Não há momento de aplicar:** falta uma pergunta do tipo "o que quebraria se…?". Sem LMS, uma reflexão opcional é suficiente.

**Detalhes menores:**
- horários em formatos diferentes (9h, 09h, 09h12, 16h00);
- "SAC" e "Atendimento" alternados;
- faltam no glossário: SAC, BI, segmento e expansão;
- a pergunta do Brain ("o que a área quer construir") não casa com o que o painel mostra (decisões e indicadores).

## 5. Estratégia: profundidade em camadas

**Princípio:** não deixar o texto mais longo em todo lugar. A ideia é **dar estrutura**. Cada trecho segue a mesma ordem:

**Ideia central → Caso → Mecanismo (porquê) → Consequência**

A leitura tem duas camadas:
- **Primeira camada:** curta e completa sozinha. É a que o aluno lê de passagem.
- **Segunda camada:** "Entenda o porquê", que abre ao clicar. É onde fica a profundidade, para quem quer.

Assim o iniciante não se afoga, e o profissional experiente não acha raso.

### Fases (com parada para aprovação em cada uma)

| Fase | O que acontece | Quem | Entrega |
|---|---|---|---|
| **F0 · Contrato didático** | Público, objetivo de aprendizagem de cada capítulo (verbos: identificar, explicar, relacionar), regras de escrita e orçamento de tamanho por campo | Eu | 1 página para aprovar |
| **F1 · Estrutura** | Campos novos no modelo: **ideia central** por andar; **porquê** em regras, automações e campo crítico; **caso contínuo**; **pergunta para pensar** por andar | Eu | Modelo + painel com a 2ª camada |
| **F2 · Piloto (1 área)** | Reescrever **uma** área inteira (sugestão: Vendas, que conversa com todas) | Designer instrucional + especialista da área + arquiteto de CRM | Área piloto no ar, para o autor ler |
| **F3 · Escala (7 áreas)** | Aplicar o tom aprovado às outras 7, em paralelo | As mesmas duplas da revisão 2, agora com o designer instrucional | 7 áreas reescritas |
| **F4 · Teste com leitor** | **Leitor iniciante** (simulado): lê só o painel e responde às perguntas de aprendizagem. Onde ele erra, o texto falhou. **Leitor experiente:** aponta o que ficou raso ou impreciso | Dois revisores independentes | Relatório; o que falhar volta para F2/F3 |
| **F5 · Montagem** | Capítulos (abertura com definição de trabalho, síntese concreta), glossário completo, prints do painel no claro e no celular, testes | Eu | Experiência atualizada |

**Por que um piloto antes de escalar:** é o maior ganho de qualidade com o menor retrabalho. O tom ("quanto explicar") é uma decisão de gosto. Se ele for calibrado numa área com o autor, as outras 7 saem certas de primeira, em vez de 8 áreas refeitas duas vezes.

### Critérios de qualidade (medidos, como na tabela do §2)

**Regras de escrita:**
- toda frase tem sujeito e verbo; fragmento só em listas de campos do CRM;
- no máximo 1 termo técnico novo por frase;
- toda regra, automação e campo crítico tem um porquê, na 1ª ou na 2ª camada.

**Tamanho:**
- a 1ª camada de cada andar se lê em até 90 s;
- o texto cabe no painel do celular sem quebrar o layout.

**Testes:**
- o leitor iniciante acerta as perguntas de aprendizagem de cada capítulo (meta: todas);
- o leitor experiente não aponta erro de fato. A exatidão das revisões 2 e 3 é preservada.

## 6. Como fica: antes e depois (amostra do tom proposto, a calibrar no piloto)

**Caso, passo 2 (Marketing):**
- **Antes:** "19h41: a régua confere: aceite no WhatsApp sim, ticket crítico não."
- **Depois, 1ª camada:** "19h41: antes de enviar o lembrete, o CRM confere duas coisas: se ela aceitou receber WhatsApp e se há alguma reclamação grave em aberto. Está tudo certo."
- **Depois, 2ª camada:** "Por que conferir: oferta para quem está reclamando piora a relação. Só o CRM junta o aceite (Marketing) e a reclamação (Atendimento) no mesmo lugar."

**Ideia central do Brain (Vendas):**
- **Hoje:** não existe.
- **Proposta:** "No Brain, Vendas decide com o forecast. Mas o forecast só é confiável se, lá embaixo, cada vendedor mantém valor, data e próximo passo atualizados. A estratégia depende da rotina."

**Automação (Financeiro):**
- **Antes:** "Quando a fatura vence sem pagamento → aviso ao cliente e alerta ao CSM."
- **Depois:** igual, com o porquê: "Para que o CSM não ofereça upgrade a quem está devendo, e a cobrança não pegue o cliente de surpresa."

## 7. Decisões do autor antes de começar

1. **Fio condutor dos casos:**
   - **(a) Recomendado:** duas empresas fixas, uma B2B (empresa de software) e uma B2C (e-commerce), e todo caso acontece numa delas, com selo visível;
   - **(b)** manter os casos variados, só com o selo B2B / B2C.
2. **Formato da profundidade:**
   - **(a) Recomendado:** duas camadas, com "Entenda o porquê" abrindo ao clicar;
   - **(b)** tudo na primeira leitura, com textos mais longos.
3. **Área piloto:** Vendas (recomendado), ou outra.
