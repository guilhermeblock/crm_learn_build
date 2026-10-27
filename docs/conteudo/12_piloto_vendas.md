# 12 · Piloto: Vendas no contrato didático

**Data:** 21/10/2026 · **Status:** aguardando o autor aprovar o tom antes de escalar para as outras 7 áreas (F3).

## 1. O que foi feito

**Painel:**
- **Ideia central** no topo de cada andar.
- **"Entenda o porquê"**, que abre ao clicar:
  - Visão: sem × com CRM e o caso;
  - Brain: as decisões;
  - Heart: cada estação;
  - Backbone: o caminho de volta.
- **Porquê de cada automação**, dentro de "Automações".
- **"Pense na sua empresa"** no fim de cada andar.
- **Selo da empresa no caso:** "Empresa B2B · software de gestão por assinatura (fictícia)".
- **Modo texto:** mostra tudo aberto.

**Vendas:**
- Reescrita seguindo o doc 11.
- O caso agora é a **Aurora Transportes**, o fio condutor B2B.

**Glossário:** 3 termos novos (CS, B2B / B2C e expansão).

**Arquivos:**
- `src/content/types.ts`: campos opcionais `idea`, `why`, `think`, `whyCrm`, `scenario.company` e `scenario.why`;
- `src/content/companies.ts`;
- `AreaPanel.tsx`, `LearningMap.tsx` e `experience.css`;
- `scripts/capture-lesson.mjs`.

## 2. Teste com dois revisores independentes

| Revisor | Papel | Resultado na 1ª versão |
|---|---|---|
| **Leitora iniciante simulada** ("Júlia", analista administrativa, nunca usou CRM) | Responder às perguntas de aprendizagem do doc 11 §2 usando só a 1ª camada | **Clareza 6/10, profundidade 8/10.** Acertou Brain e Backbone com segurança; Heart e "por que CRM não é só software", mais ou menos. Travou em termos não traduzidos no texto (lead, CS, funil, alçada, ERP), no "×" dos indicadores e na troca de "vendedor" por "executivo" |
| **Especialista em Vendas B2B + arquiteto de CRM** | Proteger a exatidão e a profundidade | **1 erro de coerência grave:** o desconto de 12% não aparecia na fatura do Financeiro, ou seja, o próprio prédio cometia o erro que ensina a evitar. **3 pontos contestáveis:** forecast ≠ soma do funil; comissão "na assinatura"; cobertura sem recorte de período. **4 porquês rasos ou com slogan** |

## 3. O que mudou por causa do teste

**Exatidão:**
- O desconto passou a ser **na implantação** (prática comum em SaaS: protege o valor recorrente).
- Previsão = negociações com data no mês e etapa avançada, e não a soma do funil.
- Comissão "conta no ganho", e não "paga na assinatura".
- Cobertura do funil passou a ser "com fechamento previsto no mês".
- A integração com o ERP entrou **no escopo do contrato**, e não só nas notas.
- O prazo de 45 dias aparece em Vendas.

**Profundidade:**
- **Antes**, os porquês eram slogans, como "o depois não chega".
- **Agora**, mostram o mecanismo:
  - a meta conta no ganho, então o vendedor já está no próximo negócio;
  - a alçada protege a margem e pede contrapartida;
  - a comissão dividida evita a disputa entre CS e Vendas;
  - a regra de registro resolve o conflito entre representantes;
  - o viés de otimismo no forecast;
  - o "preço" como resposta padrão esconde o problema real.

**Didática:**
- 7 termos traduzidos em linha na 1ª vez em que aparecem.
- Indicadores sem "×".
- "Executivo" em todo o caso.
- "Dor" virou "o problema da Aurora".
- A frase "todos registram do mesmo jeito" subiu para a 1ª camada.

**Tese:** o porquê do "sem × com CRM" deixou de creditar à ferramenta o que é da regra.

## 4. Números

| | Antes do piloto | Piloto revisado |
|---|---|---|
| Palavras na 1ª camada (4 abas) | ~657 (tudo visível) | 1.240 (cerca de 310 por aba) |
| Palavras na 2ª camada | 0 | 589 |
| Regras e automações com porquê | 0 de 3 | 3 de 3 |
| Estações com porquê | 0 de 4 | 4 de 4 |

A 1ª camada ficou um pouco acima da meta de 300 palavras por aba, porque as traduções em linha custam palavras. Fica a decisão do autor: aceitar ou cortar.

## 5. Pendências para a F3

- **Operações:** fatura de R$ 17,6 mil no aceite.
- **Financeiro:** o oneLiner não deve dizer que aprova desconto.
- **Outras áreas:** passam a seguir as regras 9 a 13 do doc 11, aprendidas aqui.
- **Validação do doc 02 §4, ainda aberta:** a escada de alçada até a diretoria.
- **Repetir o teste nas 7 áreas:** um leitor iniciante e um especialista por área.

## 6. Prints

`docs/screenshots/lesson-vendas-{brain-tela,visao,brain,heart,backbone}.png`, gerados por `node scripts/capture-lesson.mjs --area=vendas`.
