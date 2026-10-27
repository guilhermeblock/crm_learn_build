"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AUTHOR, whatsappLink } from "@/content/author";
import { track } from "@/lib/telemetry";
import { readVisitor } from "@/lib/visitor";

type Status = "idle" | "sending" | "sent" | "error" | "off";

/**
 * Quem fez isto e como falar com ele. Fica depois do conteúdo (síntese e modo texto):
 * ninguém precisa passar por aqui para aprender. WhatsApp e LinkedIn sempre; o
 * formulário só aparece se a rota /api/contato estiver configurada.
 */
export function Contact({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // quem respondeu a boas-vindas já encontra o e-mail preenchido
  const [knownEmail, setKnownEmail] = useState("");
  useEffect(() => setKnownEmail(readVisitor()?.email ?? ""), []);

  // descobre se o formulário está ligado (sem variáveis, só WhatsApp e LinkedIn)
  useEffect(() => {
    fetch("/api/contato")
      .then((r) => r.json())
      .then((j: { enabled?: boolean }) => !j.enabled && setStatus("off"))
      .catch(() => setStatus("off"));
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const r = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(j.error ?? "não foi possível enviar");
      setStatus("sent");
      track("contact_sent", { via: "form" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "não foi possível enviar");
    }
  };

  return (
    <section className={`contact${compact ? " contact--compact" : ""}`} aria-labelledby="contact-title">
      <span className="contact__kicker">Quem fez isto</span>
      <h3 id="contact-title">
        {AUTHOR.name} <small>· {AUTHOR.brand}</small>
      </h3>
      <p className="contact__role">{AUTHOR.role}</p>
      <p className="contact__pitch">{AUTHOR.pitch}</p>
      <ul className="contact__offers">
        {AUTHOR.offers.map((o) => (
          <li key={o.title}>
            <b>{o.title}</b> {o.text}
          </li>
        ))}
      </ul>
      <div className="contact__links">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("contact_sent", { via: "whatsapp" })}
        >
          Conversar no WhatsApp
        </a>
        <a
          href={AUTHOR.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("contact_sent", { via: "linkedin" })}
        >
          Perfil no LinkedIn
        </a>
      </div>
      {status !== "off" && (
        <details className="contact__form">
          <summary>Ou deixe uma mensagem</summary>
          {status === "sent" ? (
            <p className="contact__ok" role="status">
              Recebi, obrigado. Respondo pelo e-mail que você deixou.
            </p>
          ) : (
            <form onSubmit={submit}>
              <label>
                Nome
                <input name="name" required minLength={2} maxLength={120} autoComplete="name" />
              </label>
              <label>
                E-mail
                <input
                  key={knownEmail}
                  name="email"
                  type="email"
                  required
                  maxLength={160}
                  autoComplete="email"
                  defaultValue={knownEmail}
                />
              </label>
              <label>
                Empresa <span>(opcional)</span>
                <input name="company" maxLength={120} autoComplete="organization" />
              </label>
              <label>
                O que você quer resolver?
                <textarea name="message" required minLength={10} maxLength={2000} rows={4} />
              </label>
              {/* honeypot: fora da tela e fora da ordem de foco */}
              <label className="contact__hp" aria-hidden="true">
                Site
                <input name="site" tabIndex={-1} autoComplete="off" />
              </label>
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando…" : "Enviar"}
              </button>
              {status === "error" && (
                <p className="contact__err" role="alert">
                  {error}. Se preferir, chame no WhatsApp.
                </p>
              )}
            </form>
          )}
        </details>
      )}
    </section>
  );
}
