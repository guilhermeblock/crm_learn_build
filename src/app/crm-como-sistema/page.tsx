"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isPhone, keepMode, pickMode, type XpMode } from "@/lib/reading";
import { needsWelcome } from "@/lib/visitor";
import Welcome from "@/experience/Welcome";

// WebGL e GSAP só no navegador: a experiência não passa por SSR.
const ExperienceShell = dynamic(() => import("@/experience/ExperienceShell"), {
  ssr: false,
  loading: () => <div className="xp xp--loading">Carregando o prédio…</div>,
});
// celular: a leitura guiada não carrega o 3D (nem o pacote dele)
const MobileGuide = dynamic(() => import("@/experience/MobileGuide"), {
  ssr: false,
  loading: () => <div className="xp xp--loading">Carregando…</div>,
});

export default function CrmComoSistemaPage() {
  const [mode, setMode] = useState<XpMode | null>(null);
  const [phone, setPhone] = useState(false);
  const [welcome, setWelcome] = useState(false);
  useEffect(() => {
    setMode(pickMode());
    setPhone(isPhone());
    setWelcome(needsWelcome());
  }, []);

  // boas-vindas aberta: a página atrás não rola (o prédio carrega enquanto a pessoa responde)
  useEffect(() => {
    if (!welcome) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [welcome]);

  const go = (m: XpMode) => {
    keepMode(m);
    window.scrollTo(0, 0);
    setMode(m);
  };

  if (!mode) return <div className="xp xp--loading">Carregando…</div>;
  return (
    <>
      <div inert={welcome} className="xp-root">
        {mode === "guide" ? (
          <MobileGuide onOpen3d={() => go("3d")} />
        ) : (
          <ExperienceShell onOpenGuide={phone ? () => go("guide") : undefined} />
        )}
      </div>
      {welcome && (
        <Welcome
          mode={mode}
          onDone={() => {
            window.scrollTo(0, 0);
            setWelcome(false);
          }}
        />
      )}
    </>
  );
}
