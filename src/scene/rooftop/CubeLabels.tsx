"use client";

import type { RefObject } from "react";
import { DEPARTMENTS, type DepartmentId } from "../config/constants";

export type LabelRefs = RefObject<(HTMLButtonElement | null)[]>;

interface CubeLabelsProps {
  labelRefs: LabelRefs;
  selectedId: DepartmentId | null;
  activeId: DepartmentId | null;
  showIds: boolean;
  onSelect: (id: DepartmentId | null) => void;
  onHover: (id: DepartmentId | null) => void;
  onFocusChange: (id: DepartmentId | null) => void;
  /** rooftop anônimo (FR-02): rótulos ainda não aparecem */
  hidden?: boolean;
}

/**
 * Rótulos dos cubos como botões DOM reais (fora do Canvas): foco por teclado,
 * Enter/Espaço selecionam, leitor de tela recebe o nome completo.
 * A posição é escrita a cada frame pelo projetor dentro da cena (CubeField).
 */
export function CubeLabels({
  labelRefs,
  selectedId,
  activeId,
  showIds,
  onSelect,
  onHover,
  onFocusChange,
  hidden = false,
}: CubeLabelsProps) {
  return (
    <div className="cube-labels" role="group" aria-label="Áreas da empresa" data-hidden={hidden || undefined} inert={hidden} translate="no">
      {DEPARTMENTS.map((d, i) => {
        const selected = d.id === selectedId;
        const classes = [
          "cube-label",
          d.id === activeId && "is-active",
          selected && "is-selected",
          selectedId && !selected && "is-dim",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <button
            key={d.id}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            type="button"
            className={classes}
            data-dept={d.id}
            aria-label={d.fullName}
            aria-pressed={selected}
            onClick={() => onSelect(d.id)}
            onFocus={() => onFocusChange(d.id)}
            onBlur={() => onFocusChange(null)}
            onMouseEnter={() => onHover(d.id)}
            onMouseLeave={() => onHover(null)}
          >
            {d.label}
            {showIds && <span className="cube-label__id"> · {d.id}</span>}
          </button>
        );
      })}
    </div>
  );
}
