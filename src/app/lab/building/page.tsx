"use client";

import dynamic from "next/dynamic";

// WebGL só existe no navegador: a cena não passa por SSR.
const BuildingLab = dynamic(() => import("@/lab/BuildingLab"), {
  ssr: false,
  loading: () => <div className="lab lab--loading">Carregando cena…</div>,
});

export default function LabBuildingPage() {
  return <BuildingLab />;
}
