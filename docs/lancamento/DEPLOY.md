# Como publicar (Vercel)

**Repositório:** https://github.com/guilhermeblock/crm_learn_build (a raiz do repositório é esta pasta, `gui-block-building/`).
**E-mail que recebe cadastros e mensagens:** contato@guiblock.com.

## 1. Importar na Vercel

1. Na Vercel: **Add New → Project → Import** o repositório `crm_learn_build`. Framework: Next.js (detectado). *Root Directory*: deixe em branco.
2. Antes do primeiro deploy, preencha as variáveis do passo 3.
3. **Deploy.** O primeiro build leva cerca de 2 minutos. Cada `git push` na branch `main` publica de novo sozinho.

## 2. Resend (envio dos e-mails)

1. Crie a conta em resend.com.
2. **Domains → Add Domain → `guiblock.com`** e copie os registros DNS para o painel onde o domínio está registrado. Espere ficar "Verified".
3. **API Keys → Create API Key** (permissão "Sending access").

Sem o domínio verificado, o Resend só entrega no e-mail dono da conta. Para testar antes, crie a conta com contato@guiblock.com e deixe `CONTACT_FROM` vazio.

## 3. Variáveis de ambiente (Settings → Environment Variables)

| Variável | Para quê | Valor |
|---|---|---|
| `RESEND_API_KEY` | Enviar os e-mails | chave criada no passo 2 |
| `CONTACT_TO` | Quem recebe os cadastros da boas-vindas e as mensagens do contato | `contato@guiblock.com` |
| `CONTACT_FROM` | Remetente | `CRM como Sistema <site@guiblock.com>` (exige o domínio verificado) |
| `NEXT_PUBLIC_SITE_URL` | Endereço público, para a imagem do link no LinkedIn | `https://seu-endereco` (sem barra no fim) |

Sem `RESEND_API_KEY` e `CONTACT_TO`, o site funciona, mas nada chega ao seu e-mail: a boas-vindas deixa a pessoa entrar sem registrar, e a síntese mostra só WhatsApp e LinkedIn.

Depois de mudar variáveis, faça **Redeploy**.

## 4. Domínio

Settings → Domains → adicione o domínio (por exemplo, `crm.guiblock.com`) e siga as instruções de DNS. Atualize `NEXT_PUBLIC_SITE_URL` e faça redeploy.

## 5. Conferir antes de divulgar

1. Abra a URL pública numa janela anônima: a boas-vindas aparece. Deixe um e-mail e um nível, e confira se o cadastro chegou em contato@guiblock.com.
2. Abra no celular e no notebook.
3. Cole a URL no [Post Inspector do LinkedIn](https://www.linkedin.com/post-inspector/) e confira imagem e título.
4. Envie uma mensagem pelo formulário da síntese e confirme que chegou.
5. Teste o botão do WhatsApp.

## 6. Boas-vindas: o que dá para ajustar

- **Link com nome:** `.../crm-como-sistema?nome=Rafael` faz a tela dizer "Boa tarde, Rafael!". Bom para mandar por mensagem.
- **Origem:** `utm_source`, `utm_medium`, `utm_campaign` e `utm_content` do link chegam no e-mail do cadastro (por exemplo, `?utm_source=linkedin&utm_campaign=lancamento`).
- **Quem já respondeu** não vê a tela de novo naquele navegador. Quem clicou em "Entrar sem deixar e-mail" vê de novo depois de 30 dias.
- **Para revisar a tela** num navegador que já respondeu: `?boasvindas=1`.
- Textos e níveis: `src/lib/visitor.ts` e `src/experience/Welcome.tsx`. Política de privacidade: `src/app/privacidade/page.tsx`.

## 7. Dados do autor

Nome, frase, links e mensagem do WhatsApp ficam em `src/content/author.ts`. Para mudar, edite e faça commit (a Vercel publica sozinha).

## 8. Para esconder o site de buscadores

Em `src/app/layout.tsx`: `robots: { index: false, follow: false }`.
