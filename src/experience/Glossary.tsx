"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { findTerms, GLOSSARY, searchGlossary } from "@/content/glossary";
import type { GlossaryTerm } from "@/content/types";
import { track } from "@/lib/telemetry";

/*
 * Glossário na leitura: termos do catálogo aparecem destacados no texto do painel.
 * Hover/foco mostra um balão com o resumo; clicar (no termo ou no balão) abre a
 * gaveta com busca. No toque, o primeiro toque mostra o balão e o segundo abre a gaveta.
 */

interface Tip {
  term: GlossaryTerm;
  rect: DOMRect;
}

interface GlossaryApi {
  showTip: (term: GlossaryTerm, el: HTMLElement) => void;
  hideTip: () => void;
  tipTerm: string | null;
  open: (term?: GlossaryTerm) => void;
}

/** estado do balão e da gaveta, lido pela camada que os desenha (GlossaryLayer) */
interface LayerState {
  tip: Tip | null;
  drawer: { term: GlossaryTerm | null } | null;
  cancelHide: () => void;
  hideTip: () => void;
  open: (term?: GlossaryTerm) => void;
  closeDrawer: () => void;
}

const LayerCtx = createContext<LayerState | null>(null);

const GlossaryCtx = createContext<GlossaryApi | null>(null);

/**
 * Escopo de destaque: cada termo é destacado só na primeira vez que aparece no painel,
 * para o texto não virar um mar de sublinhados. Recriado a cada render do painel.
 */
export type TermScope = Map<string, string>;
const ScopeCtx = createContext<TermScope | null>(null);
export const TermScopeProvider = ScopeCtx.Provider;

export function useGlossary() {
  return useContext(GlossaryCtx);
}

/** Texto com os termos do glossário destacados (só a 1ª ocorrência de cada termo no escopo). */
export function Gloss({ children }: { children: string }) {
  const api = useContext(GlossaryCtx);
  const scope = useContext(ScopeCtx);
  // id estável entre as duas chamadas do modo estrito: o dono do termo é esta instância
  const id = useId();
  const pointer = useRef<string>("mouse");
  if (!api || !scope) return <>{children}</>;

  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of findTerms(children)) {
    const owner = scope.get(m.term.term);
    if (owner && owner !== id) continue;
    if (!owner) scope.set(m.term.term, id);
    if (m.start > last) parts.push(children.slice(last, m.start));
    const t = m.term;
    parts.push(
      <button
        key={m.start}
        type="button"
        className="term"
        aria-expanded={api.tipTerm === t.term}
        aria-label={`${children.slice(m.start, m.end)}: ver no glossário`}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onMouseEnter={(e) => api.showTip(t, e.currentTarget)}
        onMouseLeave={api.hideTip}
        onFocus={(e) => api.showTip(t, e.currentTarget)}
        onBlur={api.hideTip}
        onClick={(e) => {
          // toque: o primeiro toque só mostra o balão
          if (pointer.current === "touch" && api.tipTerm !== t.term)
            api.showTip(t, e.currentTarget);
          else api.open(t);
        }}
      >
        {children.slice(m.start, m.end)}
      </button>,
    );
    last = m.end;
  }
  if (!parts.length) return <>{children}</>;
  if (last < children.length) parts.push(children.slice(last));
  return <>{parts}</>;
}

/** Balão fixo na tela (fora do painel rolável, para não ser cortado). */
function TermTip({
  tip,
  onEnter,
  onLeave,
  onOpen,
}: {
  tip: Tip;
  onEnter: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const r = tip.rect;
    const margin = 10;
    const left = Math.min(
      Math.max(margin, r.left + r.width / 2 - width / 2),
      window.innerWidth - width - margin,
    );
    // acima do termo; abaixo se não couber
    const top =
      r.top - height - 8 >= margin ? r.top - height - 8 : r.bottom + 8;
    setPos({ left, top });
  }, [tip]);

  return (
    <div
      ref={ref}
      className="term-tip"
      role="tooltip"
      style={
        pos
          ? { left: pos.left, top: pos.top }
          : { visibility: "hidden", left: 0, top: 0 }
      }
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onOpen}
    >
      <b>{tip.term.term}</b>
      <p>{tip.term.definition}</p>
      <button type="button" tabIndex={-1}>
        Abrir no glossário →
      </button>
    </div>
  );
}

/** Gaveta do glossário: busca sem acento, termo escolhido em destaque no topo. */
function GlossaryDrawer({
  initial,
  onClose,
}: {
  initial: GlossaryTerm | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(
    initial?.term.replace(/\s*\(.*\)/, "") ?? "",
  );
  const results = useMemo(() => searchGlossary(query), [query]);

  useEffect(() => {
    // ver AreaIndex: sem close() na limpeza (modo estrito roda o efeito 2×)
    const d = ref.current;
    if (d && !d.open) d.showModal();
    inputRef.current?.focus();
  }, []);

  return (
    <dialog
      ref={ref}
      className="glossary"
      aria-labelledby="glossary-title"
      onClose={onClose}
    >
      <header>
        <h2 id="glossary-title">Glossário</h2>
        <button type="button" onClick={onClose} aria-label="Fechar glossário">
          ×
        </button>
      </header>
      <div className="glossary__search">
        <label htmlFor="glossary-q" className="sr-only">
          Buscar um termo
        </label>
        <input
          id="glossary-q"
          ref={inputRef}
          type="search"
          placeholder="Buscar um termo (ex.: forecast)"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-controls="glossary-list"
        />
        <span className="glossary__count" aria-live="polite">
          {query.trim()
            ? `${results.length} de ${GLOSSARY.length} termos`
            : `${GLOSSARY.length} termos`}
        </span>
      </div>
      <dl id="glossary-list" className="glossary__list">
        {results.map((t) => (
          <div
            key={t.term}
            className={t.term === initial?.term ? "is-focus" : undefined}
          >
            <dt>{t.term}</dt>
            <dd>{t.definition}</dd>
          </div>
        ))}
      </dl>
      {!results.length && (
        <p className="glossary__empty">
          Nenhum termo encontrado. Tente outra palavra.
        </p>
      )}
    </dialog>
  );
}

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [drawer, setDrawer] = useState<{ term: GlossaryTerm | null } | null>(
    null,
  );
  const hideTimer = useRef<number | undefined>(undefined);

  const cancelHide = useCallback(
    () => window.clearTimeout(hideTimer.current),
    [],
  );
  const closeDrawer = useCallback(() => setDrawer(null), []);
  const showTip = useCallback((term: GlossaryTerm, el: HTMLElement) => {
    window.clearTimeout(hideTimer.current);
    setTip({ term, rect: el.getBoundingClientRect() });
  }, []);
  // pequena espera: dá tempo de levar o mouse do termo até o balão
  const hideTip = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setTip(null), 160);
  }, []);
  const open = useCallback((term?: GlossaryTerm) => {
    window.clearTimeout(hideTimer.current);
    setTip(null);
    setDrawer({ term: term ?? null });
    track("glossary_opened", { term: term?.term ?? "" });
  }, []);

  // o balão segue o termo: ao rolar ou redimensionar, some
  useEffect(() => {
    if (!tip) return;
    const close = () => setTip(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [tip]);
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const api = useMemo<GlossaryApi>(
    () => ({ showTip, hideTip, open, tipTerm: tip?.term.term ?? null }),
    [showTip, hideTip, open, tip],
  );

  const layer = useMemo<LayerState>(
    () => ({ tip, drawer, cancelHide, hideTip, open, closeDrawer }),
    [tip, drawer, cancelHide, hideTip, open, closeDrawer],
  );

  return (
    <GlossaryCtx.Provider value={api}>
      <LayerCtx.Provider value={layer}>{children}</LayerCtx.Provider>
    </GlossaryCtx.Provider>
  );
}

/**
 * Balão e gaveta. Fica DENTRO de .xp (e não no provider) para herdar o tema de
 * leitura e os estilos da experiência.
 */
export function GlossaryLayer() {
  const s = useContext(LayerCtx);
  if (!s) return null;
  const { tip, drawer } = s;
  return (
    <>
      {tip && (
        <TermTip
          tip={tip}
          onEnter={s.cancelHide}
          onLeave={s.hideTip}
          onOpen={() => s.open(tip.term)}
        />
      )}
      {drawer && (
        <GlossaryDrawer
          key={drawer.term?.term ?? "all"}
          initial={drawer.term}
          onClose={s.closeDrawer}
        />
      )}
    </>
  );
}
