import type { Metadata } from "next";
import { AUTHOR } from "@/content/author";

export const metadata: Metadata = {
  title: "Privacidade — CRM como Sistema",
  description: "Quais dados o CRM como Sistema coleta, para quê e como pedir para sair.",
};

const EMAIL = "contato@guiblock.com";

/** Política curta, em linguagem simples (LGPD). Texto a revisar pelo autor. */
export default function Privacidade() {
  return (
    <main className="legal">
      <a className="legal__back" href="/crm-como-sistema">
        ← Voltar ao CRM como Sistema
      </a>
      <h1>Como cuido dos seus dados</h1>
      <p className="legal__lead">
        O CRM como Sistema é feito por {AUTHOR.name} ({AUTHOR.brand}). Esta página explica, em poucas
        linhas, o que o site guarda e o que você pode pedir.
      </p>

      <h2>O que eu recebo</h2>
      <ul>
        <li>
          <b>Na entrada:</b> o e-mail e o nível de conhecimento em CRM que você escolhe, e de onde você
          chegou (por exemplo, um link do LinkedIn).
        </li>
        <li>
          <b>No formulário de contato:</b> nome, e-mail, empresa (se você informar) e a mensagem.
        </li>
      </ul>
      <p>Esses dados chegam ao meu e-mail. O envio passa pelo Resend, um serviço de e-mail.</p>

      <h2>Para que uso</h2>
      <ul>
        <li>Entender quem visita o site e melhorar o conteúdo para cada nível.</li>
        <li>Mandar, de vez em quando, conteúdo sobre CRM e notícias da mentoria.</li>
        <li>Responder quando você me escreve.</li>
      </ul>
      <p>Não vendo nem compartilho seus dados com ninguém para fins de marketing.</p>

      <h2>O que fica só no seu navegador</h2>
      <p>
        O site lembra algumas escolhas neste aparelho: o tema de leitura, o modo (3D ou leitura guiada)
        e se você já respondeu a tela de entrada. Não há cookies de rastreamento nem anúncios.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode pedir a qualquer momento para ver, corrigir ou apagar seus dados, ou para não receber
        mais e-mails. É só escrever para <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Respondo em até 15
        dias.
      </p>

      <p className="legal__date">Atualizado em 26 de outubro de 2026.</p>
    </main>
  );
}
