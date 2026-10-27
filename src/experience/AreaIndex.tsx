"use client";

import { useEffect, useRef } from "react";
import { AREA_CONTENT } from "@/content/areas";
import { DEPARTMENTS, type DepartmentId } from "@/scene/config/constants";

interface AreaIndexProps {
  selectedId: DepartmentId | null;
  visited: Set<DepartmentId>;
  onPick: (id: DepartmentId) => void;
  onClose: () => void;
}

/**
 * Lista textual navegável das oito áreas ("ver áreas", doc 02 §3).
 * Usa <dialog> nativo: foco preso, Esc fecha, foco volta para quem abriu.
 */
export function AreaIndex({
  selectedId,
  visited,
  onPick,
  onClose,
}: AreaIndexProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // sem close() na limpeza: no modo estrito o efeito roda 2×, e o evento "close"
  // desmontaria o diálogo. Ao desmontar, o elemento sai do DOM (e da top layer) sozinho.
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="area-index"
      aria-labelledby="area-index-title"
      onClose={onClose}
    >
      <header>
        <h2 id="area-index-title">Áreas da empresa</h2>
        <button type="button" onClick={onClose} aria-label="Fechar lista">
          ×
        </button>
      </header>
      <ul>
        {DEPARTMENTS.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              aria-pressed={selectedId === d.id}
              onClick={() => onPick(d.id)}
            >
              <span className="area-index__n">
                {String(d.index).padStart(2, "0")}
              </span>
              <span className="area-index__name">
                {d.fullName}
                {visited.has(d.id) && (
                  <span className="area-index__visited"> · visitada</span>
                )}
              </span>
              <span className="area-index__line">
                {AREA_CONTENT[d.id].oneLiner}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
