"use client";

import type { SubArea } from "@/content/types";
import type { StationRefs } from "@/scene/floors/HeartStations";

interface StationLabelsProps {
  labelRefs: StationRefs;
  areaLabel: string;
  subAreas: SubArea[];
  activeIndex: number;
  onPick: (index: number) => void;
  /** estações fechadas: os rótulos saem do foco */
  hidden: boolean;
}

/**
 * Rótulos das estações do Heart como botões DOM (teclado e leitor de tela),
 * posicionados a cada frame pelas próprias estações (HeartStations).
 */
export function StationLabels({
  labelRefs,
  areaLabel,
  subAreas,
  activeIndex,
  onPick,
  hidden,
}: StationLabelsProps) {
  return (
    <div
      className="station-labels"
      translate="no"
      role="group"
      aria-label={`Estações de ${areaLabel}`}
      data-hidden={hidden || undefined}
      inert={hidden}
    >
      {subAreas.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          type="button"
          className={
            i === activeIndex ? "station-label is-active" : "station-label"
          }
          data-station={s.id}
          aria-pressed={i === activeIndex}
          aria-label={`Estação ${i + 1}: ${s.name}`}
          onClick={() => onPick(i)}
        >
          <span className="station-label__n">{i + 1}</span>
          {/* o nome aparece na estação escolhida e no hover/foco: números não se sobrepõem */}
          <span className="station-label__name">{s.name}</span>
        </button>
      ))}
    </div>
  );
}
