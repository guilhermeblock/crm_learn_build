"use client";

import type { RefObject } from "react";
import type { FloorKey } from "@/content/types";
import type { DepartmentId } from "./config/constants";
import { BuildingShell } from "./building/BuildingShell";
import { FloorLighting } from "./building/FloorLighting";
import { FloorSigns } from "./building/FloorSigns";
import { Plinth } from "./building/Plinth";
import { SceneKitProvider } from "./config/materials";
import { TONES } from "./config/palette";
import { NeuralNetwork } from "./connections/NeuralNetwork";
import { BackboneFloor } from "./floors/BackboneFloor";
import { BrainFloor } from "./floors/BrainFloor";
import { HeartFloor } from "./floors/HeartFloor";
import { HeartStations, type StationRefs } from "./floors/HeartStations";
import { LightingRig } from "./LightingRig";
import { People } from "./people/People";
import type { LabelRefs } from "./rooftop/CubeLabels";
import { Rooftop } from "./rooftop/Rooftop";

export interface BuildingWorldProps {
  selectedId: DepartmentId | null;
  activeId: DepartmentId | null;
  onSelect: (id: DepartmentId | null) => void;
  onHover: (id: DepartmentId | null) => void;
  labelRefs: LabelRefs;
  reducedMotion: boolean;
  keyLight?: number;
  exposure?: number;
  /** clique nos cubos habilitado */
  interactive?: boolean;
  pulsingIds?: DepartmentId[];
  pulseUp?: boolean;
  /** andar onde os rótulos das áreas ancoram */
  labelFloor?: FloorKey | null;
  /** estações das subáreas no Heart (experiência); ausente no laboratório */
  stations?: {
    count: number;
    activeIndex: number;
    open: boolean;
    onPick: (index: number) => void;
    labelRefs: StationRefs;
    /** passo do processo aceso (o painel acompanha) */
    processRef?: RefObject<number>;
    /** área que recebe a saída da estação escolhida */
    handoffTo?: DepartmentId | null;
  };
}

/** O prédio inteiro (sem câmera nem pós): compartilhado pelo laboratório e pela experiência. */
export function BuildingWorld({
  selectedId,
  activeId,
  onSelect,
  onHover,
  labelRefs,
  reducedMotion,
  keyLight = 2.4,
  exposure = 1,
  interactive = true,
  pulsingIds,
  pulseUp,
  labelFloor,
  stations,
}: BuildingWorldProps) {
  return (
    <>
      <color attach="background" args={[TONES.background]} />
      <fog attach="fog" args={[TONES.background, 60, 130]} />
      <SceneKitProvider>
        <LightingRig keyIntensity={keyLight} exposure={exposure} />
        <Plinth />
        <BuildingShell />
        <FloorSigns />
        <FloorLighting />
        <BrainFloor selectedId={selectedId} />
        <HeartFloor selectedId={selectedId} />
        {stations && (
          <HeartStations
            areaId={selectedId}
            reducedMotion={reducedMotion}
            {...stations}
          />
        )}
        <BackboneFloor />
        <People reducedMotion={reducedMotion} />
        <Rooftop
          selectedId={selectedId}
          activeId={activeId}
          onSelect={onSelect}
          onHover={onHover}
          labelRefs={labelRefs}
          reducedMotion={reducedMotion}
          interactive={interactive}
          labelFloor={labelFloor}
        />
        <NeuralNetwork
          selectedId={selectedId}
          hoverId={activeId}
          pulsingIds={pulsingIds}
          pulseUp={pulseUp}
          reducedMotion={reducedMotion}
        />
      </SceneKitProvider>
    </>
  );
}
