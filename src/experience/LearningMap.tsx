"use client";

import { useEffect, useRef } from "react";
import { AREA_CONTENT } from "@/content/areas";
import { CHAPTERS, CYCLE, RULES, TRANSVERSALS } from "@/content/chapters";
import { Contact } from "./Contact";
import { CASE_COMPANIES } from "@/content/companies";
import type { CaseCompany } from "@/content/types";
import { GLOSSARY } from "@/content/glossary";
import { otherSide, relationsOf } from "@/content/relations";
import { DEPARTMENTS } from "@/scene/config/constants";

const AREA = Object.fromEntries(DEPARTMENTS.map((d) => [d.id, d]));

const ACTION_SHORT = { cria: "cria", edita: "edita", vê: "vê" } as const;

/** 2ª camada no modo texto: sempre aberta, logo depois do que explica */
function Why({ text }: { text?: string }) {
  return text ? (
    <p>
      <b>Por quê:</b> {text}
    </p>
  ) : null;
}

function Idea({ text }: { text?: string }) {
  return text ? (
    <p>
      <b>Ideia central:</b> {text}
    </p>
  ) : null;
}

function Think({ text }: { text?: string }) {
  return text ? (
    <p>
      <b>Pense na sua empresa:</b> {text}
    </p>
  ) : null;
}

function Areas() {
  return (
    <>
      {DEPARTMENTS.map((d) => {
        const c = AREA_CONTENT[d.id];
        return (
          <article key={d.id} className="map__area" id={`mapa-${d.id}`}>
            <h3>
              {String(d.index).padStart(2, "0")} · {d.fullName}
            </h3>
            <p>{c.oneLiner}</p>
            <p>
              <b>Pergunta ao CRM:</b> {c.keyQuestion}
            </p>
            <p>
              <b>Sem CRM:</b> {c.withoutCrm} <b>Com CRM:</b> {c.withCrm}
            </p>
            <Why text={c.whyCrm} />
            {(Object.keys(CASE_COMPANIES) as CaseCompany[]).map((k) => (
              <div key={k}>
                <p>
                  <b>
                    Caso {CASE_COMPANIES[k].label} ({CASE_COMPANIES[k].client};{" "}
                    {CASE_COMPANIES[k].badge.toLowerCase()}, fictícia; números
                    ilustrativos):
                  </b>{" "}
                  {c.cases[k].steps.join(" ")} {c.cases[k].outcome}
                </p>
                <Why text={c.cases[k].why} />
              </div>
            ))}
            <div className="map__floors">
              <section>
                <h4>Brain · Objetivos e Estratégias</h4>
                <Idea text={c.brain.idea} />
                <p>
                  <b>Busca:</b> {c.brain.objectives.join("; ")}.
                </p>
                <p>
                  <b>Decide:</b> {c.brain.decisions.join(" ")}
                </p>
                <Why text={c.brain.why} />
                <p>
                  <b>Acompanha:</b>{" "}
                  {c.brain.indicators
                    .map((m) => `${m.name} (vem de: ${m.source})`)
                    .join("; ")}
                  .
                </p>
                <p>
                  <b>Onde vira decisão:</b> {c.brain.ritual}
                </p>
                <p>
                  <b>Para o cliente:</b> {c.brain.customerImpact}
                </p>
                <Think text={c.brain.think} />
              </section>
              <section>
                <h4>Heart · Pessoas e Processos</h4>
                <Idea text={c.heart.idea} />
                <p>
                  <b>Quem faz:</b> {c.heart.roles.join(", ")}.
                </p>
                <p>
                  <b>Um dia:</b>{" "}
                  {c.heart.dayInLife
                    .map((x) => `${x.time}: ${x.action}`)
                    .join(" ")}
                </p>
                <ul>
                  {c.heart.subAreas.map((s) => (
                    <li key={s.id}>
                      <b>
                        {s.name}
                        {s.context ? ` (${s.context.toUpperCase()})` : ""}:
                      </b>{" "}
                      {s.process.origin} → {s.process.decision} →{" "}
                      {s.process.output}.
                      {s.handoff
                        ? ` Passa para ${AREA[s.handoff.to].label}: ${s.handoff.object}.`
                        : ""}{" "}
                      Fica no CRM: {s.record}. Para o cliente:{" "}
                      {s.customerImpact}
                      {s.why ? ` Por quê: ${s.why}` : ""}
                    </li>
                  ))}
                </ul>
                <p>
                  <b>Erros comuns:</b> {c.heart.pitfalls.join(" ")}
                </p>
                <Think text={c.heart.think} />
              </section>
              <section>
                <h4>Backbone · Dados e Tecnologia</h4>
                <Idea text={c.backbone.idea} />
                <ul>
                  {c.backbone.crmObjects.map((o) => (
                    <li key={o.object}>
                      <b>{o.object}</b> (
                      {o.actions.map((a) => ACTION_SHORT[a]).join(", ")}
                      {o.owner ? `; dono: ${AREA[o.owner].label}` : ""}):{" "}
                      {o.fields.join(", ")}.
                    </li>
                  ))}
                </ul>
                <p>
                  <b>Campo crítico:</b> {c.backbone.criticalField}
                </p>
                <p>
                  <b>Automações:</b>{" "}
                  {c.backbone.automations
                    .map(
                      (a) =>
                        `Quando ${a.when} → ${a.then}.${a.why ? ` ${a.why}` : ""}`,
                    )
                    .join(" ")}
                </p>
                <p>
                  <b>Sistemas ao redor:</b>{" "}
                  {c.backbone.neighborSystems.join(", ")}.
                </p>
                <p>
                  <b>Retorno para a decisão:</b> {c.backbone.feedback.data} →{" "}
                  {c.backbone.feedback.decision}
                </p>
                <Why text={c.backbone.feedback.why} />
                <p>
                  <b>Cuidado:</b> {c.backbone.governance}
                </p>
                <Think text={c.backbone.think} />
              </section>
            </div>
            <p>
              <b>Conexões:</b>{" "}
              {relationsOf(d.id)
                .map(
                  (r) =>
                    `${AREA[otherSide(r, d.id)].label} (${r.object}: ${r.why})`,
                )
                .join(" · ")}
            </p>
            <p className="map__context">
              <b>B2B:</b> {c.variants.b2b} <b>B2C:</b> {c.variants.b2c}{" "}
              <b>Empresa pequena:</b> {c.variants.small}
            </p>
          </article>
        );
      })}
    </>
  );
}

function Glossary() {
  return (
    <section id="mapa-glossario">
      <h3>Glossário</h3>
      <dl className="map__glossary">
        {GLOSSARY.map((g) => (
          <div key={g.term}>
            <dt>{g.term}</dt>
            <dd>{g.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Content() {
  return (
    <>
      <p className="map__lead">
        Uma empresa vista através das relações com o cliente, em três camadas.
        Esta é a versão em texto da experiência 3D: o mesmo conteúdo, sem
        depender da cena.
      </p>
      <nav className="map__toc" aria-label="Sumário">
        <a href="#mapa-percurso">O percurso</a>
        {DEPARTMENTS.map((d) => (
          <a key={d.id} href={`#mapa-${d.id}`}>
            {d.label}
          </a>
        ))}
        <a href="#mapa-glossario">Glossário</a>
        <a href="#mapa-contato">Quem fez isto</a>
      </nav>
      <section id="mapa-percurso">
        <h3>O percurso</h3>
        <ol className="map__chapters">
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <b>
                {c.title}
                {c.subtitle ? ` — ${c.subtitle}` : ""}
              </b>{" "}
              {c.question ?? ""} {c.lines.join(" ")} <i>{c.learning}</i>
            </li>
          ))}
        </ol>
        <p>
          <b>Ciclo (com a Aurora):</b>{" "}
          {CYCLE.map((s) => `${s.name}: ${s.line}`).join(" → ")} → (de volta
          à decisão)
        </p>
        <p>
          <b>Áreas transversais (sem coluna no prédio):</b>{" "}
          {TRANSVERSALS.map((t) => `${t.name}: ${t.text}`).join(" ")}
        </p>
      </section>
      <h3>As oito áreas</h3>
      <Areas />
      <Glossary />
      <section>
        <h3>Regras deste modelo</h3>
        <ul>
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <div id="mapa-contato">
        <Contact />
      </div>
    </>
  );
}

/** Página inteira (sem WebGL) ou diálogo sobre a experiência ("Versão em texto" / "Ler tudo em texto"). */
export function LearningMap({
  mode,
  onClose,
  onBack,
}: {
  mode: "page" | "dialog";
  onClose?: () => void;
  /** página escolhida no lugar do 3D (aparelho fraco): volta ao prédio */
  onBack?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (mode !== "dialog") return;
    // ver AreaIndex: sem close() na limpeza (modo estrito roda o efeito 2×)
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, [mode]);

  if (mode === "page") {
    return (
      <main className="map map--page" id="conteudo">
        {onBack && (
          <button type="button" className="map__back" onClick={onBack}>
            ← Ver com o prédio 3D
          </button>
        )}
        <h1>CRM como Sistema</h1>
        <p className="map__thesis">
          Tecnologia não corrige operação. O CRM que você vê é só a superfície:
          o que o sustenta atravessa a empresa inteira.
        </p>
        <Content />
      </main>
    );
  }
  return (
    <dialog
      ref={ref}
      className="map map--dialog"
      aria-labelledby="map-title"
      onClose={onClose}
    >
      <header>
        <h2 id="map-title">Versão em texto</h2>
        <button type="button" onClick={onClose} aria-label="Fechar mapa">
          ×
        </button>
      </header>
      <Content />
    </dialog>
  );
}
