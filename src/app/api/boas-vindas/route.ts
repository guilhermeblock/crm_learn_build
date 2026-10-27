import { NextResponse } from "next/server";
import { clean, escapeHtml, isEmail, sendToAuthor } from "@/lib/mail";
import { levelInfo } from "@/lib/visitor";

/**
 * Tela de boas-vindas: o visitante deixa e-mail e nível de CRM, e o autor recebe
 * um e-mail por cadastro (responder vai direto para o visitante).
 * Usa as mesmas variáveis do contato (lib/mail.ts). Sem elas, responde 503 e a
 * página deixa a pessoa entrar do mesmo jeito.
 */
export const runtime = "nodejs";

interface Body {
  email?: string;
  level?: string;
  name?: string;
  mode?: string;
  source?: Record<string, unknown>;
  /** honeypot */
  site?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "pedido inválido" }, { status: 400 });
  }
  if (body.site) return NextResponse.json({ ok: true }); // robô: finge que deu certo

  const email = clean(body.email, 160);
  const level = levelInfo(clean(body.level, 20));
  if (!isEmail(email) || !level) {
    return NextResponse.json({ error: "confira o e-mail e escolha um nível" }, { status: 400 });
  }
  const name = clean(body.name, 24);
  const mode = body.mode === "guide" ? "Leitura guiada (celular)" : "Prédio 3D";
  const source = Object.entries(body.source ?? {})
    .slice(0, 6)
    .map(([k, v]) => `${escapeHtml(clean(k, 20))}: ${escapeHtml(clean(v, 80))}`)
    .filter((s) => !s.endsWith(": "));

  const row = (k: string, v: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${v}</td></tr>`;
  const html = `<p>Novo visitante no <b>CRM como Sistema</b>.</p><table style="border-collapse:collapse;font:14px/1.4 Arial,sans-serif">${
    row("E-mail", escapeHtml(email)) +
    row("Nível", `${escapeHtml(level.label)} <span style="color:#888">(${escapeHtml(level.text)})</span>`) +
    (name ? row("Nome no link", escapeHtml(name)) : "") +
    row("Entrou por", mode) +
    (source.length ? row("Origem", source.join("<br>")) : "")
  }</table><p style="color:#888">Responder este e-mail fala direto com o visitante.</p>`;

  const sent = await sendToAuthor({
    subject: `[CRM como Sistema] Novo visitante · ${level.label}`,
    html,
    replyTo: email,
  });
  if (!sent.ok) {
    return NextResponse.json({ error: "não foi possível registrar" }, { status: sent.status });
  }
  return NextResponse.json({ ok: true });
}
