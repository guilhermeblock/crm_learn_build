/**
 * Envio de e-mail ao autor pelo Resend (só no servidor).
 * Variáveis (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  chave da conta Resend
 *   CONTACT_TO      e-mail que recebe as mensagens e os cadastros (contato@guiblock.com)
 *   CONTACT_FROM    remetente de um domínio verificado no Resend (opcional;
 *                   padrão onboarding@resend.dev, que só entrega ao dono da conta Resend)
 */

export const mailEnabled = () => Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO);

export const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function sendToAuthor(mail: { subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) return { ok: false as const, status: 503 };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "CRM como Sistema <onboarding@resend.dev>",
      to: [to],
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      subject: mail.subject,
      html: mail.html,
    }),
  });
  return res.ok ? { ok: true as const, status: 200 } : { ok: false as const, status: 502 };
}
