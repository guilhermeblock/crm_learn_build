"use client";

import { CHAPTERS } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import type { Reading } from "@/lib/reading";

interface ChapterNavProps {
  chapter: ChapterId;
  onGo: (id: ChapterId) => void;
  onOpenIndex: () => void;
  onOpenMap: () => void;
  onOpenGlossary: () => void;
  reading: Reading;
  onToggleReading: () => void;
  /** celular no 3D: volta à leitura guiada */
  onOpenGuide?: () => void;
}

const MARKS = CHAPTERS.filter((c) => c.nav);

/** Indicador dos cinco momentos (Rooftop → Brain → Heart → Backbone → Síntese) + atalhos. */
export function ChapterNav({
  chapter,
  onGo,
  onOpenIndex,
  onOpenMap,
  onOpenGlossary,
  reading,
  onToggleReading,
  onOpenGuide,
}: ChapterNavProps) {
  // a revelação pertence ao momento "Rooftop"
  const current = chapter === "reveal" ? "rooftop" : chapter;
  return (
    <nav className="chapter-nav" aria-label="Andares da experiência" translate="no">
      <ol>
        {MARKS.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              aria-current={current === c.id ? "step" : undefined}
              onClick={() => onGo(c.id)}
              title={c.subtitle}
            >
              <span className="chapter-nav__dot" aria-hidden="true" />
              {c.nav}
              {c.subtitle && (
                <span className="chapter-nav__sub">{c.subtitle}</span>
              )}
            </button>
          </li>
        ))}
      </ol>
      <div className="chapter-nav__tools">
        {onOpenGuide && (
          <button type="button" onClick={onOpenGuide}>
            Leitura guiada
          </button>
        )}
        <button type="button" onClick={onOpenIndex}>
          Ver áreas
        </button>
        <button type="button" onClick={onOpenGlossary}>
          Glossário
        </button>
        <button type="button" onClick={onOpenMap}>
          Versão em texto
        </button>
        <button
          type="button"
          className="chapter-nav__theme"
          onClick={onToggleReading}
          aria-pressed={reading === "light"}
          title="Fundo dos textos: claro ou escuro"
        >
          <span aria-hidden="true">{reading === "light" ? "☀" : "☾"}</span>
          {reading === "light" ? "Claro" : "Escuro"}
          <span className="sr-only"> (leitura em fundo claro)</span>
        </button>
      </div>
    </nav>
  );
}
