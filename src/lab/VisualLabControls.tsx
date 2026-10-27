"use client";

import { DEPARTMENTS, VIEWS, type DepartmentId } from "@/scene/config/constants";
import { VIEW_IDS, type LabSettings } from "./settings";

interface VisualLabControlsProps {
  settings: LabSettings;
  fps: number;
  selectedId: DepartmentId | null;
  onClearSelection: () => void;
  onRemount: () => void;
  onChange: (patch: Partial<LabSettings>) => void;
  onReset: () => void;
}

interface SliderDef {
  key: "exposure" | "keyLight" | "bloom" | "fov";
  label: string;
  min: number;
  max: number;
  step: number;
}

const SLIDERS: SliderDef[] = [
  { key: "exposure", label: "Exposição", min: 0.3, max: 2, step: 0.05 },
  { key: "keyLight", label: "Key light", min: 0, max: 6, step: 0.1 },
  { key: "bloom", label: "Bloom", min: 0, max: 3, step: 0.05 },
  { key: "fov", label: "FOV", min: 18, max: 55, step: 1 },
];

/** Painel de desenvolvimento. Não faz parte da experiência final. */
export function VisualLabControls({
  settings,
  fps,
  selectedId,
  onClearSelection,
  onRemount,
  onChange,
  onReset,
}: VisualLabControlsProps) {
  const selected = DEPARTMENTS.find((d) => d.id === selectedId);

  return (
    <aside className="lab-panel" aria-label="Controles do laboratório">
      <header className="lab-panel__head">
        <span>LAB / BUILDING</span>
        <span className="lab-panel__fps">{fps.toFixed(0)} FPS</span>
      </header>

      <div className="lab-panel__views" role="group" aria-label="Vistas">
        {VIEW_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={settings.view === id}
            onClick={() => onChange({ view: id })}
          >
            {VIEWS[id].label}
          </button>
        ))}
      </div>

      {SLIDERS.map((s) => (
        <label key={s.key} className="lab-panel__slider">
          <span>
            {s.label} <output>{settings[s.key].toFixed(s.step < 1 ? 2 : 0)}</output>
          </span>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={settings[s.key]}
            onChange={(e) => onChange({ [s.key]: Number(e.target.value) })}
          />
        </label>
      ))}

      <label className="lab-panel__toggle">
        <input
          type="checkbox"
          checked={settings.orbit}
          onChange={(e) => onChange({ orbit: e.target.checked })}
        />
        Órbita livre
      </label>
      <label className="lab-panel__toggle">
        <input
          type="checkbox"
          checked={settings.showIds}
          onChange={(e) => onChange({ showIds: e.target.checked })}
        />
        Mostrar ids dos departamentos
      </label>

      <div className="lab-panel__selection">
        <span>Seleção: {selected ? selected.fullName : "nenhuma"}</span>
        {selected && (
          <button type="button" onClick={onClearSelection}>
            Limpar (Esc)
          </button>
        )}
      </div>

      <button type="button" className="lab-panel__reset" onClick={onReset}>
        Restaurar padrões
      </button>
      <button type="button" data-action="remount" onClick={onRemount}>
        Remontar cena (teste de vazamento)
      </button>
    </aside>
  );
}
