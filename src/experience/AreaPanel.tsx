"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AREA_CONTENT } from "@/content/areas";
import { FLOOR_META } from "@/content/chapters";
import { CASE_COMPANIES } from "@/content/companies";
import { otherSide, relationsOf } from "@/content/relations";
import type {
  AreaContent,
  CaseCompany,
  ChapterId,
  CrmAction,
  FloorKey,
  Relation,
} from "@/content/types";
import { DEPARTMENTS, type DepartmentId } from "@/scene/config/constants";
import { track } from "@/lib/telemetry";
import { Gloss, TermScopeProvider, type TermScope } from "./Glossary";
import { SNAP_LABEL, useSheet } from "./useSheet";

const AREA = Object.fromEntries(DEPARTMENTS.map((d) => [d.id, d]));
const LEVEL_LABEL: Record<string, string> = {
  rooftop: "Rooftop",
  brain: "Brain",
  heart: "Heart",
};

export type Tab = FloorKey | "overview";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Visão" },
  { id: "brain", label: "Brain" },
  { id: "heart", label: "Heart" },
  { id: "backbone", label: "Backbone" },
];

type Variant = keyof AreaContent["variants"];
const VARIANTS: { id: Variant; label: string }[] = [
  { id: "b2b", label: "B2B" },
  { id: "b2c", label: "B2C" },
  { id: "small", label: "Pequena" },
];
/** a escolha B2B · B2C · Pequena vale para todas as áreas durante a visita (09, decisão 1) */
let visitVariant: Variant = "b2b";
/** áreas já abertas nesta visita: a 1ª abertura começa pela Visão (a porta para o leigo) */
const seen = new Set<DepartmentId>();

const ACTION_LABEL: Record<CrmAction, { short: string; long: string }> = {
  cria: { short: "C", long: "cria" },
  edita: { short: "E", long: "edita" },
  vê: { short: "V", long: "só vê" },
};

/** "19h40: a cliente…" → horário/valor em destaque + o resto do passo */
function splitLead(step: string): [string | null, string] {
  const i = step.indexOf(": ");
  if (i <= 0 || i > 22) return [null, step];
  const rest = step.slice(i + 2);
  return [step.slice(0, i), rest.charAt(0).toUpperCase() + rest.slice(1)];
}

/* ---------- peças de estudo ---------- */

/** Seção numerada: o número dá ordem de leitura, o título diz o que se aprende ali. */
function Section({
  n,
  title,
  children,
  hint,
}: {
  n: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="lesson">
      <h3 className="lesson__title">
        <span className="lesson__n">{String(n).padStart(2, "0")}</span>
        {title}
      </h3>
      {hint && <p className="lesson__hint">{hint}</p>}
      {children}
    </section>
  );
}

function Tags({ items, plain }: { items: string[]; plain?: boolean }) {
  return (
    <ul className={plain ? "tags tags--plain" : "tags"}>
      {items.map((t) => (
        <li key={t}>
          <Gloss>{t}</Gloss>
        </li>
      ))}
    </ul>
  );
}

/** Ideia principal do bloco, em destaque. */
function Remember({
  label = "Para lembrar",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <aside className="remember">
      <span>{label}</span>
      <p>{children}</p>
    </aside>
  );
}

/** Ideia central do andar (1ª camada): a frase que liga os exemplos. */
function Idea({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="idea">
      <Gloss>{text}</Gloss>
    </p>
  );
}

/** 2ª camada: o mecanismo por trás do que está à vista; fechada até o leitor pedir. */
function Why({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <details className="why">
      <summary>Entenda o porquê</summary>
      <p>
        <Gloss>{text}</Gloss>
      </p>
    </details>
  );
}

/** Pergunta aberta para o leitor aplicar o andar à própria empresa. */
function Think({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <aside className="think">
      <span>Pense na sua empresa</span>
      <p>{text}</p>
    </aside>
  );
}

/** Linha do tempo: horário (ou valor) + ação. Serve ao caso e ao "um dia na área". */
function Timeline({ items }: { items: [string | null, string][] }) {
  return (
    <ol className="timeline">
      {items.map(([lead, text]) => (
        <li key={text}>
          {/* sem horário: a célula vazia mantém o texto alinhado na coluna */}
          <b>{lead ?? ""}</b>
          <span>
            <Gloss>{text}</Gloss>
          </span>
        </li>
      ))}
    </ol>
  );
}

function AreaLink({
  id,
  onSelect,
}: {
  id: DepartmentId;
  onSelect: (id: DepartmentId) => void;
}) {
  return (
    <button
      type="button"
      className="area-link"
      onClick={() => onSelect(id)}
      aria-label={`Estudar ${AREA[id].fullName}`}
    >
      {AREA[id].label}
    </button>
  );
}

function Relations({
  id,
  relations,
  onSelect,
}: {
  id: DepartmentId;
  relations: Relation[];
  onSelect: (id: DepartmentId) => void;
}) {
  if (!relations.length)
    return (
      <p className="lesson__hint">
        Neste andar, esta área não tem conexões fixas mapeadas.
      </p>
    );
  return (
    <ul className="links">
      {relations.map((r) => {
        const other = otherSide(r, id);
        const where = r.floorB
          ? `${LEVEL_LABEL[r.floor]} → ${LEVEL_LABEL[r.floorB]}`
          : LEVEL_LABEL[r.floor];
        // a seta segue o sentido da relação (a → b), mesmo vista do lado de b
        const outgoing = r.a === id;
        const oneWay = r.nature === "handoff" || r.nature === "feedback";
        return (
          <li
            key={`${r.a}-${r.b}-${r.floor}`}
            className={r.key ? "is-key" : undefined}
          >
            <div className="links__head">
              <span className="links__from">{AREA[id].label}</span>
              <span className="links__arrow" aria-hidden="true">
                {oneWay ? (outgoing ? "→" : "←") : "↔"}
              </span>
              <AreaLink id={other} onSelect={onSelect} />
            </div>
            <p className="links__object">
              <Gloss>{r.object}</Gloss>
            </p>
            <p>
              <Gloss>{r.why}</Gloss>
            </p>
            {r.breaks && (
              <p className="links__breaks">
                <span>Onde quebra</span>
                <Gloss>{r.breaks}</Gloss>
              </p>
            )}
            <span className="links__meta">
              {r.nature} · {where}
              {r.key ? " · relação central" : ""}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- painel ---------- */

interface AreaPanelProps {
  areaId: DepartmentId;
  /** andar do capítulo atual; null = rooftop, revelação ou síntese */
  floor: FloorKey | null;
  onClose: () => void;
  onSelect: (id: DepartmentId) => void;
  /** abas de andar levam a câmera até o andar (a área continua selecionada) */
  onGoFloor: (id: ChapterId) => void;
  /** estação (subárea) escolhida: compartilhada com as estações do Heart no 3D */
  subId: string;
  onSubChange: (id: string) => void;
  /** passo do processo aceso na estação 3D (-1 nenhum): a linha do processo acompanha */
  processRef?: RefObject<number>;
  /** "page": o painel ocupa a tela inteira como página (leitura guiada do celular) */
  mode?: "float" | "page";
  /** só no modo página: a aba em que o painel abre */
  initialTab?: Tab;
}

/**
 * Painel de estudo da área. Abas por andar (Visão · Brain · Heart · Backbone),
 * seções numeradas com o formato que cada conteúdo pede, e um destaque por andar.
 * Modelo prático: pergunta da área, sem/com CRM, caso com números, objetos do CRM
 * e passagens entre áreas (docs/conteudo/00 §6 e 09).
 * Não é modal: a cena e o scroll continuam livres.
 */
export function AreaPanel({
  areaId,
  floor,
  onClose,
  onSelect,
  onGoFloor,
  subId,
  onSubChange,
  processRef,
  mode = "float",
  initialTab,
}: AreaPanelProps) {
  const page = mode === "page";
  const c = AREA_CONTENT[areaId];
  const area = AREA[areaId];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLOListElement>(null);
  const handoffRef = useRef<HTMLParagraphElement>(null);
  const headRef = useRef<HTMLElement>(null);
  // celular e tablet em pé: folha arrastável (espiar · meio · tela cheia)
  const sheet = useSheet(headRef, !page);
  const [tab, setTab] = useState<Tab>(() =>
    page
      ? (initialTab ?? "overview")
      : seen.has(areaId)
        ? (floor ?? "overview")
        : "overview",
  );
  // abertura atual: área, andar em que abriu e se a área já tinha sido vista
  const opened = useRef<{ area: DepartmentId; floor: FloorKey | null } | null>(
    null,
  );
  const [variant, setVariant] = useState<Variant>(visitVariant);
  // o caso segue a empresa escolhida (B2C → Marina; B2B e pequena → Aurora), mas pode ser trocado
  const [caseKey, setCaseKey] = useState<CaseCompany>(
    visitVariant === "b2c" ? "b2c" : "b2b",
  );
  const idx = DEPARTMENTS.findIndex((d) => d.id === areaId);
  const prev = DEPARTMENTS[(idx + DEPARTMENTS.length - 1) % DEPARTMENTS.length];
  const next = DEPARTMENTS[(idx + 1) % DEPARTMENTS.length];

  // 1ª abertura de uma área: Visão (a porta para o leigo); depois, o andar da câmera.
  // Idempotente por área: o modo estrito do React roda o efeito duas vezes.
  useEffect(() => {
    if (opened.current?.area === areaId) return;
    const first = opened.current === null;
    const seenBefore = seen.has(areaId);
    seen.add(areaId);
    opened.current = { area: areaId, floor };
    // página: abre na aba pedida; trocar de área (link, anterior/próxima) mantém a aba
    if (page) {
      if (first) setTab(initialTab ?? "overview");
      return;
    }
    setTab(seenBefore ? (floor ?? "overview") : "overview");
  }, [areaId, floor]);
  // a aba acompanha o andar da câmera (sem mexer na abertura em si)
  useEffect(() => {
    const o = opened.current;
    if (o && o.area === areaId && o.floor === floor) return;
    if (o) o.floor = floor;
    setTab(floor ?? "overview");
  }, [floor, areaId]);
  // foco no título só ao abrir/trocar de área (o scroll não rouba o foco)
  // efeitos com chaves: alguns navegadores já fazem scrollTo() devolver uma Promise,
  // e o React trata qualquer retorno não-função como erro de limpeza
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [areaId]);
  // a linha origem → decisão → saída acende junto com a estação no prédio (só no Heart)
  useEffect(() => {
    if (floor !== "heart" || !processRef) return;
    let raf = 0;
    const tick = () => {
      const el = stepperRef.current;
      const step = processRef.current ?? -1;
      // 3–4: a saída já foi; a passagem para a outra área está em viagem / chegou
      if (el) el.dataset.step = String(Math.min(step, 2));
      if (handoffRef.current)
        handoffRef.current.dataset.live = step >= 3 ? "1" : "0";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [floor, processRef]);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [areaId, tab]);
  useEffect(() => {
    if (tab !== "overview")
      track("area_context_completed", { area: areaId, floor: tab });
  }, [areaId, tab]);

  const meta = tab === "overview" ? null : FLOOR_META[tab];
  const relations = relationsOf(areaId).filter((r) =>
    tab === "overview"
      ? true
      : tab === "backbone"
        ? Boolean(r.floorB)
        : r.floor === tab || r.floorB === tab,
  );
  const sub =
    c.heart.subAreas.find((s) => s.id === subId) ?? c.heart.subAreas[0];
  // termos do glossário: cada um destacado só na 1ª vez que aparece no painel
  const termScope: TermScope = new Map();
  // numeração das seções na ordem em que aparecem
  let section = 0;
  const n = () => ++section;

  const pickTab = (t: Tab) => {
    setTab(t);
    if (sheet.sheet) sheet.expand();
    if (t !== "overview" && t !== floor) onGoFloor(t);
  };
  const pickSub = (id: string) => {
    onSubChange(id);
    if (sheet.sheet) sheet.expand();
  };
  const pickVariant = (v: Variant) => {
    visitVariant = v;
    setVariant(v);
    setCaseKey(v === "b2c" ? "b2c" : "b2b");
  };
  const theCase = c.cases[caseKey];
  const company = CASE_COMPANIES[caseKey];

  return (
    <TermScopeProvider value={termScope}>
      <aside
        className={`panel panel--${tab}${page ? " panel--page" : ""}`}
        aria-labelledby="panel-title"
        style={sheet.style}
        data-snap={sheet.sheet ? sheet.snap : undefined}
        data-dragging={sheet.dragging || undefined}
      >
        {sheet.sheet && (
          <button
            type="button"
            className="panel__grip"
            aria-label={`Altura do painel: ${SNAP_LABEL[sheet.snap]}. Toque para mudar ou arraste.`}
            {...sheet.grip}
          />
        )}
        <header className="panel__head" ref={headRef}>
          <span className="panel__index">
            ÁREA {String(area.index).padStart(2, "0")} / 08
          </span>
          <h2 id="panel-title" ref={headingRef} tabIndex={-1}>
            {area.fullName}
          </h2>
          <p className="panel__summary">
            <Gloss>{c.oneLiner}</Gloss>
          </p>
          <button
            type="button"
            className="panel__close"
            onClick={onClose}
            aria-label="Fechar painel (Esc)"
          >
            ×
          </button>
          <div
            className="panel__tabs"
            role="tablist"
            aria-label="Andares desta área"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`panel__tab panel__tab--${t.id}`}
                onClick={() => pickTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <div
          className="panel__body"
          ref={bodyRef}
          role="tabpanel"
          aria-label={meta ? meta.title : "Visão da área"}
        >
          {meta && (
            <p className="panel__floor">
              {meta.title} <span>· {meta.subtitle}</span>
            </p>
          )}

          {tab === "overview" && (
            <>
              <Section n={n()} title="A pergunta que a área faz ao CRM">
                <p className="ask">
                  <Gloss>{c.keyQuestion}</Gloss>
                </p>
              </Section>
              <Section n={n()} title="Sem CRM × com CRM">
                <div className="compare">
                  <p className="compare__without">
                    <span>Sem CRM</span>
                    <Gloss>{c.withoutCrm}</Gloss>
                  </p>
                  <p className="compare__with">
                    <span>Com CRM</span>
                    <Gloss>{c.withCrm}</Gloss>
                  </p>
                </div>
                <Why text={c.whyCrm} />
              </Section>
              <Section
                n={n()}
                title="Um caso, passo a passo"
                hint="Duas empresas fictícias atravessam o prédio inteiro. Horários e valores são ilustrativos."
              >
                <div
                  className="case-switch"
                  role="group"
                  aria-label="Empresa do caso"
                >
                  {(Object.keys(CASE_COMPANIES) as CaseCompany[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={caseKey === k}
                      onClick={() => setCaseKey(k)}
                    >
                      {CASE_COMPANIES[k].client}
                      <small>{CASE_COMPANIES[k].label}</small>
                    </button>
                  ))}
                </div>
                <p className="case__badge">{company.badge}</p>
                <Timeline items={theCase.steps.map(splitLead)} />
                <Remember label="O dado que fica">
                  <Gloss>{theCase.outcome}</Gloss>
                </Remember>
                <Why key={caseKey} text={theCase.why} />
              </Section>
              <Section n={n()} title="Muda conforme a empresa">
                <div
                  className="variant-switch"
                  role="group"
                  aria-label="Modelo de empresa"
                >
                  {VARIANTS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      aria-pressed={variant === v.id}
                      onClick={() => pickVariant(v.id)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                <p className="variant-text" aria-live="polite">
                  <Gloss>{c.variants[variant]}</Gloss>
                </p>
              </Section>
              <Section
                n={n()}
                title="A área nos três andares"
                hint="Escolha um andar para descer até ele."
              >
                <ol className="floors">
                  {(["brain", "heart", "backbone"] as FloorKey[]).map((f) => (
                    <li key={f} className={`floors__item floors__item--${f}`}>
                      <button type="button" onClick={() => pickTab(f)}>
                        <span className="floors__name">
                          {FLOOR_META[f].title}{" "}
                          <small>{FLOOR_META[f].subtitle}</small>
                        </span>
                        <span className="floors__line">
                          {f === "brain"
                            ? c.brain.objectives.slice(0, 2).join(" · ")
                            : f === "heart"
                              ? c.heart.subAreas.map((s) => s.name).join(" · ")
                              : c.backbone.crmObjects
                                  .map((o) => o.object)
                                  .join(" · ")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </Section>
            </>
          )}

          {tab === "brain" && (
            <>
              <Idea text={c.brain.idea} />
              <Section n={n()} title="O que a área busca">
                <Tags items={c.brain.objectives} />
              </Section>
              <Section n={n()} title="Decisões que ela toma com o CRM">
                <ol className="cards">
                  {c.brain.decisions.map((d) => (
                    <li key={d}>
                      <Gloss>{d}</Gloss>
                    </li>
                  ))}
                </ol>
                <Why text={c.brain.why} />
              </Section>
              <Section n={n()} title="Indicadores e de onde vem o dado">
                <ul className="metrics">
                  {c.brain.indicators.map((m) => (
                    <li key={m.name}>
                      <span className="metrics__glyph" aria-hidden="true" />
                      <span className="metrics__text">
                        <b>
                          <Gloss>{m.name}</Gloss>
                        </b>
                        <small>
                          vem de: <Gloss>{m.source}</Gloss>
                        </small>
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section n={n()} title="Onde o número vira decisão">
                <p className="ritual">
                  <Gloss>{c.brain.ritual}</Gloss>
                </p>
              </Section>
              <Remember label="Para o cliente">
                <Gloss>{c.brain.customerImpact}</Gloss>
              </Remember>
              <Think text={c.brain.think} />
            </>
          )}

          {tab === "heart" && (
            <>
              <Idea text={c.heart.idea} />
              <Section n={n()} title="Quem faz o trabalho">
                <Tags items={c.heart.roles} plain />
                <p className="lesson__hint lesson__hint--after">
                  No prédio: <Gloss>{c.heart.routine}</Gloss>
                </p>
              </Section>
              <details className="more">
                <summary>Um dia na área</summary>
                <Timeline
                  items={c.heart.dayInLife.map((d) => [d.time, d.action])}
                />
              </details>
              <Section
                n={n()}
                title="Estações e o processo de cada uma"
                hint={
                  floor === "heart"
                    ? "Escolha uma estação aqui ou no prédio."
                    : "Escolha uma estação."
                }
              >
                <div className="segmented" role="group" aria-label="Subáreas">
                  {c.heart.subAreas.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={s.id === sub.id}
                      onClick={() => pickSub(s.id)}
                    >
                      {s.name}
                      {s.context && <em>{s.context.toUpperCase()}</em>}
                    </button>
                  ))}
                </div>
                <ol
                  ref={stepperRef}
                  className="stepper"
                  aria-live="polite"
                  aria-label={`Processo de ${sub.name}`}
                >
                  <li>
                    <span>Origem</span>
                    <Gloss>{sub.process.origin}</Gloss>
                  </li>
                  <li>
                    <span>Decisão</span>
                    <Gloss>{sub.process.decision}</Gloss>
                  </li>
                  <li>
                    <span>Saída</span>
                    <Gloss>{sub.process.output}</Gloss>
                  </li>
                </ol>
                {sub.handoff && (
                  <p className="handoff" ref={handoffRef}>
                    <span>Passa para</span>
                    <AreaLink id={sub.handoff.to} onSelect={onSelect} />
                    <i aria-hidden="true">·</i>
                    <Gloss>{sub.handoff.object}</Gloss>
                  </p>
                )}
                <p className="record">
                  <span>Fica no CRM</span>
                  <Gloss>{sub.record}</Gloss>
                </p>
                <Remember label="Para o cliente">
                  <Gloss>{sub.customerImpact}</Gloss>
                </Remember>
                {/* key: troca de estação fecha o porquê da anterior */}
                <Why key={sub.id} text={sub.why} />
              </Section>
              <Section n={n()} title="Erros comuns">
                <ul className="pitfalls">
                  {c.heart.pitfalls.map((p) => (
                    <li key={p}>
                      <Gloss>{p}</Gloss>
                    </li>
                  ))}
                </ul>
              </Section>
              <Think text={c.heart.think} />
            </>
          )}

          {tab === "backbone" && (
            <>
              <Idea text={c.backbone.idea} />
              <Section
                n={n()}
                title="O que a área registra no CRM"
                hint="C = cria · E = edita · V = só vê. Quando o objeto é de outra área, o dono aparece ao lado."
              >
                <ul className="objects">
                  {c.backbone.crmObjects.map((o) => (
                    <li key={o.object}>
                      <div className="objects__head">
                        <b>
                          <Gloss>{o.object}</Gloss>
                        </b>
                        <span
                          className="objects__acts"
                          aria-label={`Esta área ${o.actions.map((a) => ACTION_LABEL[a].long).join(", ")}`}
                        >
                          {o.actions.map((a) => (
                            <abbr key={a} title={ACTION_LABEL[a].long}>
                              {ACTION_LABEL[a].short}
                            </abbr>
                          ))}
                        </span>
                        {o.owner && (
                          <span className="objects__owner">
                            de {AREA[o.owner].label}
                          </span>
                        )}
                      </div>
                      <span className="objects__fields">
                        <Gloss>{o.fields.join(" · ")}</Gloss>
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section n={n()} title="O campo que não pode faltar">
                <p className="critical">
                  <Gloss>{c.backbone.criticalField}</Gloss>
                </p>
              </Section>
              <Remember label="↑ O dado volta para a decisão">
                <span className="feedback__data">
                  <Gloss>{c.backbone.feedback.data}</Gloss>
                </span>
                <Gloss>{c.backbone.feedback.decision}</Gloss>
              </Remember>
              <Why text={c.backbone.feedback.why} />
              <Section
                n={n()}
                title="Sistemas ao redor"
                hint="Tipos de sistema, não marcas."
              >
                <Tags items={c.backbone.neighborSystems} plain />
              </Section>
              <details className="automations">
                <summary>
                  Automações <span>· {c.backbone.automations.length}</span>
                </summary>
                <ul>
                  {c.backbone.automations.map((a) => (
                    <li key={a.when}>
                      <b>Quando</b> <Gloss>{a.when}</Gloss>{" "}
                      <i aria-hidden="true">→</i>
                      <span className="sr-only">, então</span>{" "}
                      <Gloss>{a.then}</Gloss>
                      {a.why && (
                        <small className="automations__why">
                          <Gloss>{a.why}</Gloss>
                        </small>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
              <p className="caution">
                <span>Cuidado</span>
                <Gloss>{c.backbone.governance}</Gloss>
              </p>
              <Think text={c.backbone.think} />
            </>
          )}

          {tab === "overview" ? (
            <Section n={n()} title="Com quem esta área se conecta">
              <Relations id={areaId} relations={relations} onSelect={onSelect} />
            </Section>
          ) : (
            <details className="more">
              <summary>
                Conexões neste andar <span>· {relations.length}</span>
              </summary>
              <Relations id={areaId} relations={relations} onSelect={onSelect} />
            </details>
          )}
        </div>

        <footer className="panel__foot">
          <button
            type="button"
            onClick={() => onSelect(prev.id)}
            aria-label={`Área anterior: ${prev.fullName}`}
          >
            ← {prev.label}
          </button>
          <button
            type="button"
            onClick={() => onSelect(next.id)}
            aria-label={`Próxima área: ${next.fullName}`}
          >
            {next.label} →
          </button>
        </footer>
      </aside>
    </TermScopeProvider>
  );
}
