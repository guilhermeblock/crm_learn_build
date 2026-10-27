"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AREA_CONTENT } from "@/content/areas";
import {
  CHAPTERS,
  CYCLE,
  FLOOR_META,
  menuLine,
  TRANSVERSALS,
} from "@/content/chapters";
import type { FloorKey } from "@/content/types";
import { saveReading, storedReading, type Reading } from "@/lib/reading";
import { track } from "@/lib/telemetry";
import { DEPARTMENTS, type DepartmentId } from "@/scene/config/constants";
import { AreaPanel, type Tab } from "./AreaPanel";
import { Contact } from "./Contact";
import { GlossaryLayer, GlossaryProvider, useGlossary } from "./Glossary";

const CH = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
const FLOORS: FloorKey[] = ["brain", "heart", "backbone"];

/**
 * Celular: leitura guiada. O mesmo conteúdo da experiência, em sequência, com imagens
 * do prédio (geradas do próprio 3D) no lugar da cena. Tocar numa área abre o painel de
 * estudo em tela cheia. O 3D continua a um toque, para quem quiser e puder.
 */
export default function MobileGuide({ onOpen3d }: { onOpen3d: () => void }) {
  return (
    <GlossaryProvider>
      <Guide onOpen3d={onOpen3d} />
    </GlossaryProvider>
  );
}

interface Reader {
  area: DepartmentId;
  tab: Tab;
}

function Guide({ onOpen3d }: { onOpen3d: () => void }) {
  const glossary = useGlossary();
  const [reading, setReading] = useState<Reading>(storedReading);
  const [reader, setReader] = useState<Reader | null>(null);
  const [visited, setVisited] = useState<Set<DepartmentId>>(() => new Set());
  const [subByArea, setSubByArea] = useState<
    Partial<Record<DepartmentId, string>>
  >({});
  const trigger = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("experience_started", { mode: "guia" });
  }, []);

  // progresso da leitura (2 px no topo)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      progressRef.current?.style.setProperty("--p", p.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleReading = () =>
    setReading((r) => {
      const next = r === "light" ? "dark" : "light";
      saveReading(next);
      return next;
    });

  const visit = useCallback((id: DepartmentId) => {
    setVisited((v) => new Set(v).add(id));
    track("area_selected", { area: id, mode: "guia" });
  }, []);

  // o painel abre como página por cima; o botão Voltar do celular fecha o painel
  const openReader = (area: DepartmentId, tab: Tab) => {
    trigger.current = document.activeElement as HTMLElement | null;
    if (!reader) window.history.pushState({ guia: "area" }, "");
    setReader({ area, tab });
    visit(area);
  };
  const closeReader = useCallback(() => {
    if (window.history.state?.guia === "area") window.history.back();
    else setReader(null);
  }, []);
  useEffect(() => {
    const onPop = () => setReader(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  // painel aberto: a página de trás não rola; Esc fecha (a gaveta do glossário trata o próprio Esc)
  useEffect(() => {
    if (!reader) {
      trigger.current?.focus({ preventScroll: true });
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]"))
        closeReader();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [reader, closeReader]);

  const rooftop = CH.rooftop;
  const reveal = CH.reveal;
  const synthesis = CH.synthesis;

  return (
    <div className="xp xp--guide" data-reading={reading}>
      <div ref={progressRef} className="xp__progress" aria-hidden="true" />
      <header className="guide__top">
        <a className="guide__brand" href="#guia-inicio">
          Gui Block · CRM como Sistema
        </a>
        <div className="guide__tools">
          <button type="button" onClick={() => glossary?.open()}>
            Glossário
          </button>
          <button
            type="button"
            onClick={toggleReading}
            aria-pressed={reading === "light"}
            title="Fundo dos textos: claro ou escuro"
          >
            <span aria-hidden="true">{reading === "light" ? "☀" : "☾"}</span>
            <span className="sr-only">Leitura em fundo claro</span>
          </button>
        </div>
      </header>

      <main className="guide" id="conteudo">
        {/* 00 · rooftop */}
        <section className="guide__hero" id="guia-inicio">
          <Picture name="rooftop" alt="Rooftop do prédio: oito cubos azuis, um por área da empresa, com filamentos de luz que descem pelos andares." eager />
          <div className="guide__pad">
            <span className="guide__index">00 / 05</span>
            <h1>{rooftop.title}</h1>
            <p className="guide__lead">
              Uma empresa vista como um prédio em corte: 8 áreas e 3 andares. Leia
              de cima para baixo (uns 10 minutos) ou toque numa área para estudá-la.
            </p>
            <nav className="guide__jump" aria-label="Andares">
              {FLOORS.map((f) => (
                <a key={f} href={`#guia-${f}`}>
                  {FLOOR_META[f].title}
                  <small>{FLOOR_META[f].subtitle}</small>
                </a>
              ))}
              <a href="#guia-sintese">
                Síntese<small>O que fica</small>
              </a>
            </nav>
            <button type="button" className="guide__3d-link" onClick={onOpen3d}>
              Prefere o prédio em 3D? Abrir a versão interativa →
            </button>
          </div>
        </section>

        {/* 01 · as 8 áreas */}
        <section className="guide__section" id="guia-areas">
          <div className="guide__pad">
            <span className="guide__index">01 / 05</span>
            <h2>{reveal.title}</h2>
            <p className="guide__lead">{reveal.lines[0]}</p>
            <p className="guide__hint">
              Cada área abre em quatro abas: Visão, Brain, Heart e Backbone, com
              dois casos (Aurora, uma empresa cliente; Marina, uma consumidora).
            </p>
            <ul className="guide__areas">
              {DEPARTMENTS.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => openReader(d.id, "overview")}
                  >
                    <span className="guide__n">
                      {String(d.index).padStart(2, "0")}
                    </span>
                    <span className="guide__name">
                      {d.fullName}
                      {visited.has(d.id) && (
                        <i aria-label="estudada">●</i>
                      )}
                    </span>
                    <span className="guide__line">
                      {AREA_CONTENT[d.id].oneLiner}
                    </span>
                    <span className="guide__go" aria-hidden="true">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 02–04 · os três andares */}
        {FLOORS.map((f) => {
          const c = CH[f];
          return (
            <section
              key={f}
              className={`guide__section guide__floor guide__floor--${f}`}
              id={`guia-${f}`}
            >
              <Picture
                name={f}
                alt={`O andar ${FLOOR_META[f].title} (${FLOOR_META[f].subtitle}) em destaque no prédio.`}
              />
              <div className="guide__pad">
                <span className="guide__index">{c.index} / 05</span>
                <h2>
                  {c.title}
                  <small>{c.subtitle}</small>
                </h2>
                {c.question && (
                  <p className="guide__question">
                    <span>Pergunta do andar</span>
                    {c.question}
                  </p>
                )}
                <span className="guide__label">
                  As áreas neste andar · toque para estudar
                </span>
                <ul className="guide__areas guide__areas--floor">
                  {DEPARTMENTS.map((d) => {
                    const line = menuLine(c, AREA_CONTENT[d.id]);
                    return (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => openReader(d.id, f)}
                        >
                          <span className="guide__n">
                            {String(d.index).padStart(2, "0")}
                          </span>
                          <span className="guide__name">
                            {d.label}
                            {line.guided && <em>exemplo</em>}
                            {visited.has(d.id) && (
                              <i aria-label="estudada">●</i>
                            )}
                          </span>
                          <span className="guide__line">{line.text}</span>
                          <span className="guide__go" aria-hidden="true">
                            →
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="guide__learning">
                  <span>O que fica deste andar</span>
                  {c.learning}
                </p>
                {c.exit && <p className="guide__exit">{c.exit}</p>}
              </div>
            </section>
          );
        })}

        {/* 05 · síntese */}
        <section className="guide__section guide__synthesis" id="guia-sintese">
          <Picture
            name="synthesis"
            alt="O prédio inteiro: do rooftop ao Backbone, as áreas ligadas por filamentos de luz."
          />
          <div className="guide__pad">
            <span className="guide__index">05 / 05</span>
            <h2>{synthesis.title}</h2>
            {synthesis.lines.map((l) => (
              <p key={l} className="guide__text">
                {l}
              </p>
            ))}
            <span className="guide__label">O ciclo, com a Aurora</span>
            <ol className="guide__cycle">
              {CYCLE.map((s, i) => (
                <li key={s.name}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <b>{s.name}</b>
                  {s.line}
                </li>
              ))}
            </ol>
            <span className="guide__label">
              Também existem, sem coluna no prédio
            </span>
            <ul className="guide__transversals">
              {TRANSVERSALS.map((t) => (
                <li key={t.name}>
                  <b>{t.name}</b> {t.text}
                </li>
              ))}
            </ul>
            <p className="guide__visited">
              Você estudou {visited.size} de {DEPARTMENTS.length} áreas.
            </p>
            <Contact />
            <aside className="guide__3d">
              <b>Quer ver o prédio em 3D?</b>
              <p>
                A versão interativa mostra as áreas ligadas por fios e as estações
                acendendo. É mais pesada: melhor com Wi-Fi e um celular recente.
              </p>
              <button type="button" onClick={onOpen3d}>
                Abrir o prédio em 3D
              </button>
            </aside>
          </div>
        </section>
      </main>

      {reader && (
        <div
          className="guide__reader"
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-title"
        >
          <AreaPanel
            mode="page"
            areaId={reader.area}
            floor={null}
            initialTab={reader.tab}
            onClose={closeReader}
            onSelect={(id) => {
              setReader((r) => (r ? { ...r, area: id } : r));
              visit(id);
            }}
            onGoFloor={() => undefined}
            subId={
              subByArea[reader.area] ??
              AREA_CONTENT[reader.area].heart.subAreas[0].id
            }
            onSubChange={(id) =>
              setSubByArea((m) => ({ ...m, [reader.area]: id }))
            }
          />
        </div>
      )}
      <GlossaryLayer />
    </div>
  );
}

/** imagem do prédio gerada do 3D (scripts/guide-images.mjs), em duas larguras */
function Picture({
  name,
  alt,
  eager = false,
}: {
  name: string;
  alt: string;
  eager?: boolean;
}) {
  return (
    <img
      className="guide__img"
      src={`/guia/${name}.jpg`}
      srcSet={`/guia/${name}-sm.jpg 520w, /guia/${name}.jpg 1040w`}
      sizes="(max-width: 700px) 100vw, 680px"
      width={1040}
      height={680}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
