"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { XpMode } from "@/lib/reading";
import { track } from "@/lib/telemetry";
import {
  LEVELS,
  greeting,
  levelInfo,
  nameFromLink,
  saveVisitor,
  visitSource,
  wasHereBefore,
  type CrmLevel,
} from "@/lib/visitor";

/**
 * Boas-vindas na entrada: saudação pela hora (e pelo nome, quando o link traz ?nome=),
 * e-mail e nível de CRM. Depois do envio, uma dica de percurso para aquele nível.
 * Quem não quiser deixar o e-mail entra do mesmo jeito.
 */
export default function Welcome({ mode, onDone }: { mode: XpMode; onDone: () => void }) {
  const [step, setStep] = useState<"form" | "ready">("form");
  const [level, setLevel] = useState<CrmLevel | null>(null);
  const [sending, setSending] = useState(false);
  const [missing, setMissing] = useState(false);
  const [hello] = useState(() => ({
    greet: greeting(),
    name: nameFromLink(),
    back: wasHereBefore(),
  }));
  const titleRef = useRef<HTMLHeadingElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);

  // foco no título (não no campo: no celular, o teclado cobriria a tela)
  useEffect(() => titleRef.current?.focus({ preventScroll: true }), []);
  useEffect(() => {
    if (step === "ready") startRef.current?.focus({ preventScroll: true });
  }, [step]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!level) {
      setMissing(true);
      return;
    }
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    setSending(true);
    try {
      await fetch("/api/boas-vindas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          level,
          name: hello.name,
          mode,
          source: visitSource(),
          site: data.get("site"),
        }),
      });
    } catch {
      // sem rede: a pessoa entra do mesmo jeito
    }
    saveVisitor({ email, level, status: "sent", at: Date.now() });
    track("welcome_sent", { level });
    setSending(false);
    setStep("ready");
  };

  const skip = () => {
    saveVisitor({ status: "skipped", at: Date.now() });
    track("welcome_skipped");
    onDone();
  };

  const enter = mode === "guide" ? "Começar a leitura" : "Entrar no prédio";
  const chosen = levelInfo(level ?? undefined);

  return (
    <div className="welcome" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome__art" aria-hidden="true">
        <img
          src="/guia/rooftop.jpg"
          srcSet="/guia/rooftop-sm.jpg 520w, /guia/rooftop.jpg 1040w"
          sizes="(max-width: 760px) 100vw, 60vw"
          alt=""
          decoding="async"
        />
      </div>

      <div className="welcome__card" translate="no">
        <span className="welcome__kicker">Gui Block · CRM como Sistema</span>

        {step === "form" ? (
          <>
            <h1 id="welcome-title" ref={titleRef} tabIndex={-1}>
              {hello.greet}
              {hello.name ? `, ${hello.name}` : ""}!{" "}
              <span>{hello.back ? "Que bom te ver de novo." : "Que bom ter você aqui."}</span>
            </h1>
            <p className="welcome__lead">
              Este prédio mostra o CRM além da ferramenta de campanha e do funil de vendas: como 8 áreas
              de uma empresa decidem, operam e registram a relação com o cliente. A visita leva uns 7
              minutos.
            </p>
            <p className="welcome__ask">
              Antes de entrar, me conta duas coisas. Assim eu sei para quem estou escrevendo e te sugiro
              um caminho.
            </p>

            <form className="welcome__form" onSubmit={submit}>
              <label className="welcome__field">
                Seu e-mail
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={160}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="voce@empresa.com.br"
                />
              </label>

              <fieldset className="welcome__levels" aria-describedby={missing ? "welcome-missing" : undefined}>
                <legend>Quanto você conhece de CRM?</legend>
                {LEVELS.map((l) => (
                  <label key={l.id} className="welcome__level">
                    <input
                      type="radio"
                      name="level"
                      value={l.id}
                      checked={level === l.id}
                      onChange={() => {
                        setLevel(l.id);
                        setMissing(false);
                      }}
                    />
                    <span className="welcome__level-text">
                      <b>{l.label}</b>
                      <small>{l.text}</small>
                    </span>
                  </label>
                ))}
              </fieldset>
              {missing && (
                <p id="welcome-missing" className="welcome__err" role="alert">
                  Escolha a frase que mais parece com você.
                </p>
              )}

              {/* honeypot: fora da tela e fora da ordem de foco */}
              <label className="contact__hp" aria-hidden="true">
                Site
                <input name="site" tabIndex={-1} autoComplete="off" />
              </label>

              <button type="submit" className="welcome__go" disabled={sending}>
                {sending ? "Enviando…" : enter}
              </button>
              <p className="welcome__legal">
                Uso seu e-mail só para falar de CRM e da mentoria. Sem spam, e você sai quando quiser.{" "}
                <a href="/privacidade" target="_blank" rel="noopener">
                  Como cuido dos seus dados
                </a>
              </p>
            </form>

            <button type="button" className="welcome__skip" onClick={skip}>
              Entrar sem deixar e-mail
            </button>
          </>
        ) : (
          <>
            <h1 id="welcome-title" ref={titleRef} tabIndex={-1}>
              Obrigado{hello.name ? `, ${hello.name}` : ""}. <span>Uma sugestão para o seu momento:</span>
            </h1>
            {chosen && (
              <div className="welcome__tip">
                <span className="welcome__tip-level">{chosen.label}</span>
                <p>{chosen.tip}</p>
              </div>
            )}
            <button ref={startRef} type="button" className="welcome__go" onClick={onDone}>
              {enter}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
