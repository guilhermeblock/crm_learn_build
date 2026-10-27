"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { AREA_CONTENT } from "@/content/areas";
import { CHAPTERS, CYCLE, menuLine } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import { DEPARTMENTS, type DepartmentId } from "@/scene/config/constants";
import { Contact } from "./Contact";

interface ChapterOverlayProps {
  chapter: ChapterId;
  selectedId: DepartmentId | null;
  activeId: DepartmentId | null;
  visited: Set<DepartmentId>;
  reducedMotion: boolean;
  onPickArea: (id: DepartmentId) => void;
  onHoverArea: (id: DepartmentId | null) => void;
  onOpenMap: () => void;
  onReviewFloor: () => void;
}

/**
 * Cartão do capítulo (coluna esquerda, centralizado na altura): título do ato,
 * pergunta do andar e o MENU das oito áreas — cada uma com uma frase daquele andar.
 * Entra com movimento curto e preciso; com movimento reduzido, só troca.
 */
export function ChapterOverlay({
  chapter,
  selectedId,
  activeId,
  visited,
  reducedMotion,
  onPickArea,
  onHoverArea,
  onOpenMap,
  onReviewFloor,
}: ChapterOverlayProps) {
  const root = useRef<HTMLDivElement>(null);
  const c = CHAPTERS.find((x) => x.id === chapter)!;
  // no rooftop as áreas ainda são anônimas (FR-02): sem menu
  const showMenu = chapter !== "rooftop";

  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        "[data-reveal]",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.035,
          overwrite: true,
        },
      );
    },
    {
      scope: root,
      dependencies: [chapter, reducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <div className="chapter-wrap" ref={root}>
      <section
        className={`chapter chapter--${chapter}`}
        aria-labelledby="chapter-title"
      >
        {/* o menu das áreas tem texto condicional: a tradução automática do navegador quebraria o React */}
        <header className="chapter__head" aria-live="polite">
          <span className="chapter__index" data-reveal>
            {c.index} / 05
          </span>
          <h1 id="chapter-title" className="chapter__title" data-reveal>
            {c.title}
            {c.subtitle && (
              <span className="chapter__subtitle">{c.subtitle}</span>
            )}
          </h1>
          {c.question && (
            <p className="chapter__question" data-reveal>
              <span>Pergunta do andar</span>
              {c.question}
            </p>
          )}
          {c.lines.map((l) => (
            <p key={l} className="chapter__line" data-reveal>
              {l}
            </p>
          ))}
        </header>

        {chapter === "synthesis" && (
          <ol
            className="chapter__cycle"
            data-reveal
            aria-label="Ciclo do relacionamento"
          >
            {CYCLE.map((s, i) => (
              <li key={s.name}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s.name}
                <small>{s.line}</small>
              </li>
            ))}
          </ol>
        )}

        {showMenu && (
          <nav
            className="chapter__menu"
            aria-label="Áreas da empresa"
            data-reveal
            translate="no"
          >
            <span className="chapter__menu-title">
              {chapter === "synthesis"
                ? "Explore outra área"
                : "Áreas · escolha uma para estudar"}
            </span>
            {chapter === "reveal" && (
              <span className="chapter__menu-hint">
                Passe o mouse para ver; clique para estudar nos três andares.
              </span>
            )}
            <ul>
              {DEPARTMENTS.map((d) => {
                const line = menuLine(c, AREA_CONTENT[d.id]);
                const selected = selectedId === d.id;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      className={activeId === d.id ? "is-active" : undefined}
                      onClick={() => onPickArea(d.id)}
                      onMouseEnter={() => onHoverArea(d.id)}
                      onMouseLeave={() => onHoverArea(null)}
                      onFocus={() => onHoverArea(d.id)}
                      onBlur={() => onHoverArea(null)}
                    >
                      <span className="chapter__menu-n">
                        {String(d.index).padStart(2, "0")}
                      </span>
                      <span className="chapter__menu-name">
                        {d.label}
                        {line.guided && <em>exemplo</em>}
                        {visited.has(d.id) && !selected && (
                          <i aria-label="visitada">●</i>
                        )}
                      </span>
                      <span className="chapter__menu-line">{line.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {chapter === "synthesis" && (
          <div className="chapter__actions" data-reveal>
            <button type="button" onClick={onReviewFloor}>
              Rever um andar
            </button>
            <button type="button" onClick={onOpenMap}>
              Ler tudo em texto
            </button>
          </div>
        )}

        {(chapter === "brain" || chapter === "heart" || chapter === "backbone") && (
          <p className="chapter__learning" data-reveal>
            <span>O que fica deste andar</span>
            {c.learning}
          </p>
        )}
        {c.exit && (
          <p className="chapter__exit" data-reveal>
            {c.exit}
          </p>
        )}
        {chapter === "synthesis" && (
          <>
            <p className="chapter__visited" data-reveal>
              Você estudou {visited.size} de {DEPARTMENTS.length} áreas.
            </p>
            <Contact compact />
          </>
        )}
        {chapter === "rooftop" && (
          <span className="chapter__scroll" data-reveal aria-hidden="true">
            ↓ role para descer
          </span>
        )}
      </section>
    </div>
  );
}
