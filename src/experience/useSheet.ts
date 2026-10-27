"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import { useMediaQuery } from "@/lib/hooks";

/** celular ou tablet em pé (folha de baixo); deitado, o painel fica ao lado */
export const SHEET_QUERY = "(max-width: 1099px) and (orientation: portrait)";

export type Snap = "peek" | "half" | "full";
const ORDER: Snap[] = ["half", "full", "peek"];
export const SNAP_LABEL: Record<Snap, string> = {
  peek: "só o título",
  half: "meia tela",
  full: "tela cheia",
};

/** abaixo disso um toque na alça é clique (muda a altura), não arraste */
const TAP = 6;

/**
 * Painel como folha de baixo arrastável (celular e tablet em pé): três alturas
 * (espiar · meio · tela cheia). Arrastar a alça segue o dedo e solta na altura mais
 * próxima; tocar (ou Enter) alterna. Fora do layout de folha, nada muda.
 */
export function useSheet(
  headRef: RefObject<HTMLElement | null>,
  /** false: o painel é uma página (leitura guiada), nunca folha */
  enabled = true,
) {
  const sheet = useMediaQuery(SHEET_QUERY) && enabled;
  const [snap, setSnap] = useState<Snap>("half");
  const [heights, setHeights] = useState<Record<Snap, number>>({
    peek: 160,
    half: 400,
    full: 700,
  });
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{ y: number; h: number; moved: boolean } | null>(null);
  // o navegador dispara um clique depois do arraste: este o ignora
  const dragged = useRef(false);

  const measure = useCallback(() => {
    const vh = window.innerHeight;
    const top =
      document.querySelector(".xp__top")?.getBoundingClientRect().bottom ?? 0;
    setHeights({
      // espiar: alça + cabeçalho (nome, frase e abas)
      peek: (headRef.current?.offsetHeight ?? 150) + 22,
      half: Math.round(vh * (window.innerWidth > 760 ? 0.56 : 0.62)),
      full: Math.round(vh - top - 8),
    });
  }, [headRef]);

  useEffect(() => {
    if (!sheet) return;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [sheet, measure]);

  const height = drag ?? heights[snap];

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { y: e.clientY, h: heights[snap], moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s) return;
    const dy = s.y - e.clientY;
    if (Math.abs(dy) > TAP) s.moved = true;
    if (s.moved)
      setDrag(Math.min(heights.full, Math.max(heights.peek, s.h + dy)));
  };
  const onPointerUp = () => {
    const s = start.current;
    start.current = null;
    if (!s || !s.moved || drag === null) return;
    dragged.current = true;
    // solta na altura mais próxima
    const near = (Object.keys(heights) as Snap[]).reduce((a, b) =>
      Math.abs(heights[b] - drag) < Math.abs(heights[a] - drag) ? b : a,
    );
    setSnap(near);
    setDrag(null);
  };
  // toque/Enter sem arraste: próxima altura
  const onClick = () => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    setSnap((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length]);
  };

  return {
    sheet,
    snap,
    /** abrir em tela cheia (toque numa aba ou estação): a leitura ganha a tela */
    expand: () => setSnap("full"),
    style: sheet ? { height } : undefined,
    dragging: drag !== null,
    grip: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClick,
    },
  };
}
