import { NextResponse } from "next/server";
import { clean, escapeHtml, isEmail, mailEnabled, sendToAuthor } from "@/lib/mail";

/**
 * Formulário de contato da síntese: envia um e-mail ao autor via Resend (variáveis em lib/mail.ts).
 * Sem RESEND_API_KEY ou CONTACT_TO, responde 503 e a página mostra só WhatsApp e LinkedIn.
 */
export const runtime = "nodejs";

interface Body {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  /** honeypot: campo invisível que só robô preenche */
  site?: string;
}

/** a página pergunta se o formulário está ligado (sem variáveis, mostra só WhatsApp e LinkedIn) */
export async function GET() {
  return NextResponse.json({ enabled: mailEnabled() });
}

export async function POST(req: Request) {
  if (!mailEnabled()) {
    return NextResponse.json({ error: "formulário desligado" }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "pedido inválido" }, { status: 400 });
  }
  if (body.site) return NextResponse.json({ ok: true }); // robô: finge que deu certo

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const company = clean(body.company, 120);
  const message = clean(body.message, 2000);
  if (name.length < 2 || !isEmail(email) || message.length < 10) {
    return NextResponse.json({ error: "preencha nome, e-mail e mensagem" }, { status: 400 });
  }

  const html = `<p><b>${escapeHtml(name)}</b> &lt;${escapeHtml(email)}&gt;${
    company ? ` · ${escapeHtml(company)}` : ""
  }</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p><p style="color:#888">Enviado pelo CRM como Sistema</p>`;

  const sent = await sendToAuthor({
    subject: `[CRM como Sistema] ${name}${company ? ` · ${company}` : ""}`,
    html,
    replyTo: email,
  });
  if (!sent.ok) {
    return NextResponse.json({ error: "não foi possível enviar" }, { status: sent.status });
  }
  return NextResponse.json({ ok: true });
}
