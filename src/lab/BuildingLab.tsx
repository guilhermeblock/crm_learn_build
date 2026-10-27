"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BuildingScene } from "@/scene/BuildingScene";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { DEPARTMENTS, type DepartmentId } from "@/scene/config/constants";
import { CubeLabels } from "@/scene/rooftop/CubeLabels";
import { DEFAULT_SETTINGS, isViewId, type LabSettings } from "./settings";
import { VisualLabControls } from "./VisualLabControls";

/**
 * Lê parâmetros de URL usados nas capturas: ?view=heart&ui=0&instant=1&select=produto
 * e ?cam=px,py,pz,tx,ty,tz (câmera livre, para inspecionar detalhes de perto).
 */
function readCam(v: string | null): [number, number, number, number, number, number] | null {
  const n = v?.split(",").map(Number);
  return n && n.length === 6 && n.every(Number.isFinite) ? (n as [number, number, number, number, number, number]) : null;
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  const select = params.get("select");
  return {
    view: isViewId(view) ? view : DEFAULT_SETTINGS.view,
    hideUi: params.get("ui") === "0",
    instant: params.get("instant") === "1",
    select: DEPARTMENTS.find((d) => d.id === select)?.id ?? null,
    cam: readCam(params.get("cam")),
  };
}

export default function BuildingLab() {
  const [url] = useState(readUrl);
  const [settings, setSettings] = useState<LabSettings>({ ...DEFAULT_SETTINGS, view: url.view });
  const [fps, setFps] = useState(0);
  const [selectedId, setSelectedId] = useState<DepartmentId | null>(url.select);
  // hover (mouse no cubo ou no rótulo) e foco de teclado: o foco tem prioridade
  const [hoveredId, setHoveredId] = useState<DepartmentId | null>(null);
  const [focusedId, setFocusedId] = useState<DepartmentId | null>(null);
  const activeId = focusedId ?? hoveredId;
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // teste de vazamento: trocar a key desmonta e remonta o Canvas inteiro
  const [sceneKey, setSceneKey] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  // Esc limpa a seleção
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const change = useCallback((patch: Partial<LabSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setSettings((s) => ({ ...DEFAULT_SETTINGS, view: s.view }));
  }, []);

  return (
    <main className="lab">
      <div className="lab__canvas">
        <BuildingScene
          key={sceneKey}
          settings={settings}
          instant={url.instant}
          cam={url.cam}
          selectedId={selectedId}
          activeId={activeId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          labelRefs={labelRefs}
          reducedMotion={reducedMotion}
          onFps={setFps}
        />
        <CubeLabels
          labelRefs={labelRefs}
          selectedId={selectedId}
          activeId={activeId}
          showIds={settings.showIds}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          onFocusChange={setFocusedId}
        />
      </div>
      {!url.hideUi && (
        <VisualLabControls
          settings={settings}
          fps={fps}
          selectedId={selectedId}
          onClearSelection={() => setSelectedId(null)}
          onRemount={() => setSceneKey((k) => k + 1)}
          onChange={change}
          onReset={reset}
        />
      )}
    </main>
  );
}
