"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AREA_CONTENT } from "@/content/areas";
import { chapterIndex, FLOOR_META, floorOfChapter } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import {
  useMediaQuery,
  usePrefersReducedMotion,
  useWebGLSupport,
} from "@/lib/hooks";
import { storedReading, saveReading, type Reading } from "@/lib/reading";
import { track } from "@/lib/telemetry";
import { DEPARTMENTS, type DepartmentId } from "@/scene/config/constants";
import { CubeLabels } from "@/scene/rooftop/CubeLabels";
import { AreaIndex } from "./AreaIndex";
import { AreaPanel } from "./AreaPanel";
import { CHAPTER_POSES, TIMELINE_LENGTH, type Pose } from "./cameraPath";
import { ChapterNav } from "./ChapterNav";
import { ChapterOverlay } from "./ChapterOverlay";
import { ExperienceCanvas } from "./ExperienceCanvas";
import { GlossaryLayer, GlossaryProvider, useGlossary } from "./Glossary";
import { LearningMap } from "./LearningMap";
import { StationLabels } from "./StationLabels";
import { labelAnchor } from "@/scene/labelAnchors";
import { stationWorld } from "@/scene/floors/HeartStations";
import { LEVELS } from "@/scene/config/constants";
import * as THREE from "three";
import { useScrollStory } from "./useScrollStory";
import { SHEET_QUERY } from "./useSheet";

/** área do percurso guiado (briefing §8 / PRD Gate 2): acesa do Brain ao Backbone */
const GUIDED_AREA: DepartmentId = "vendas";
/** pulsos discretos no rooftop anônimo (doc 02, ato 00) */
const ROOFTOP_PULSES: DepartmentId[] = ["produto", "financeiro"];
const AREA = Object.fromEntries(DEPARTMENTS.map((d) => [d.id, d]));

export type { Reading };

/** onOpenGuide: celular que escolheu o 3D pode voltar à leitura guiada */
export default function ExperienceShell({
  onOpenGuide,
}: {
  onOpenGuide?: () => void;
}) {
  return (
    <GlossaryProvider>
      <Experience onOpenGuide={onOpenGuide} />
    </GlossaryProvider>
  );
}

/** botão "Glossário" do topo: abre a gaveta sem termo escolhido */
function useOpenGlossary() {
  const g = useGlossary();
  return useCallback(() => g?.open(), [g]);
}

function Experience({ onOpenGuide }: { onOpenGuide?: () => void }) {
  const webgl = useWebGLSupport();
  // celular e tablet em pé: o cartão do capítulo fica embaixo e pode cobrir o andar
  const portraitSheet = useMediaQuery(SHEET_QUERY);
  const reducedMotion = usePrefersReducedMotion();
  const storyRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<Pose>({ ...CHAPTER_POSES.rooftop });
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stationRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // passo do processo aceso na estação escolhida (escrito pela cena, lido pelo painel)
  const processRef = useRef(-1);
  const focusRef = useRef<THREE.Vector3[] | null>(null);

  // estado mínimo compartilhado (storyboard §6)
  const [chapter, setChapter] = useState<ChapterId>("rooftop");
  const [selectedId, setSelectedId] = useState<DepartmentId | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<DepartmentId | null>(null);
  const [focusedId, setFocusedId] = useState<DepartmentId | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [visited, setVisited] = useState<Set<DepartmentId>>(() => new Set());
  // estação (subárea) escolhida em cada área: o painel e o 3D leem o mesmo valor
  const [subByArea, setSubByArea] = useState<
    Partial<Record<DepartmentId, string>>
  >({});
  const touched = useRef(false);
  const [reading, setReading] = useState<Reading>(storedReading);
  // aparelho fraco: oferece o mesmo conteúdo em texto (a pessoa escolhe)
  const [struggle, setStruggle] = useState(false);
  const [textOnly, setTextOnly] = useState(false);
  const onStruggle = useCallback(() => {
    try {
      if (window.sessionStorage.getItem("crm-aviso-3d") === "fechado") return;
    } catch {
      // sem armazenamento: o aviso aparece normalmente
    }
    setStruggle(true);
  }, []);
  // o aviso some sozinho; Esc também fecha
  useEffect(() => {
    if (!struggle) return;
    const t = window.setTimeout(() => setStruggle(false), 14000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStruggle(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [struggle]);
  const keep3d = useCallback(() => {
    setStruggle(false);
    try {
      window.sessionStorage.setItem("crm-aviso-3d", "fechado");
    } catch {
      // sem armazenamento: vale só agora
    }
  }, []);
  // ?lento=1 simula um aparelho fraco (testes e revisão do aviso)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lento") !== "1")
      return;
    const t = window.setTimeout(() => setStruggle(true), 2500);
    return () => window.clearTimeout(t);
  }, []);
  const openGlossary = useOpenGlossary();

  const toggleReading = useCallback(() => {
    setReading((r) => {
      const next = r === "light" ? "dark" : "light";
      saveReading(next);
      return next;
    });
  }, []);

  const revealed = chapter !== "rooftop";
  const activeId = revealed ? (focusedId ?? hoveredId) : null;

  const { goTo } = useScrollStory({
    storyRef,
    poseRef,
    reducedMotion,
    onChapter: setChapter,
  });
  // barra de progresso do percurso (2 px no topo), escrita fora do React
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      progressRef.current?.style.setProperty("--p", p.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    track("experience_started");
  }, []);
  useEffect(() => {
    track(chapter === "synthesis" ? "synthesis_viewed" : "chapter_viewed", {
      chapter,
    });
    // percurso guiado: ao chegar ao Brain sem escolha feita, acompanha Produto
    if (!touched.current && chapterIndex(chapter) >= chapterIndex("brain")) {
      touched.current = true;
      setSelectedId((s) => s ?? GUIDED_AREA);
    }
  }, [chapter]);

  const select = useCallback(
    (id: DepartmentId | null) => {
      touched.current = true;
      // área já escolhida: com o painel fechado, abre o painel; aberto, solta a área
      if (id && id === selectedId) {
        if (!panelOpen) setPanelOpen(true);
        else {
          setSelectedId(null);
          setPanelOpen(false);
        }
        return;
      }
      setSelectedId(id);
      setPanelOpen(id !== null);
      if (id) {
        setVisited((v) => new Set(v).add(id));
        track("area_selected", { area: id });
      }
    },
    [selectedId, panelOpen],
  );

  const subAreas = selectedId ? AREA_CONTENT[selectedId].heart.subAreas : [];
  const subId = selectedId ? (subByArea[selectedId] ?? subAreas[0].id) : "";
  const subIndex = Math.max(
    0,
    subAreas.findIndex((s) => s.id === subId),
  );
  const pickSub = useCallback(
    (id: string) => {
      if (!selectedId) return;
      setSubByArea((m) => ({ ...m, [selectedId]: id }));
      track("subarea_opened", { area: selectedId, subarea: id });
    },
    [selectedId],
  );
  // estação clicada no prédio: escolhe a subárea e abre o painel nela
  const pickStation = useCallback(
    (i: number) => {
      if (!selectedId) return;
      pickSub(AREA_CONTENT[selectedId].heart.subAreas[i].id);
      setPanelOpen(true);
    },
    [selectedId, pickSub],
  );
  // as estações abrem só no capítulo Heart, com uma área escolhida (a câmera não se move)
  const stationsOpen = chapter === "heart" && selectedId !== null;

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    // devolve o foco ao rótulo da área (previsível)
    const i = DEPARTMENTS.findIndex((d) => d.id === selectedId);
    labelRefs.current[i]?.focus({ preventScroll: true });
  }, [selectedId]);

  // Esc: fecha o painel; com o painel fechado, solta a seleção
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // um diálogo aberto (lista, mapa, glossário) trata o próprio Esc
      if (
        e.key !== "Escape" ||
        indexOpen ||
        mapOpen ||
        document.querySelector("dialog[open]")
      )
        return;
      if (panelOpen) closePanel();
      else if (selectedId) setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen, selectedId, indexOpen, mapOpen, closePanel]);

  useEffect(() => {
    if (webgl === "unsupported") track("fallback_used");
  }, [webgl]);

  if (webgl === "unsupported") return <LearningMap mode="page" />;
  if (textOnly)
    return (
      <LearningMap
        mode="page"
        onBack={() => {
          setTextOnly(false);
          keep3d();
        }}
      />
    );

  const floor = floorOfChapter(chapter);

  // a área escolhida não pode ficar atrás do cartão nem do painel: a câmera desliza
  // de lado só o necessário (ExperienceCamera). Heart: o centro das estações e,
  // havendo passagem, o posto da área que recebe o trabalho.
  const focusArea =
    panelOpen && floor
      ? DEPARTMENTS.find((d) => d.id === selectedId)
      : undefined;
  if (!focusArea)
    // retrato com o painel fechado: o andar inteiro sobe para a faixa acima do cartão
    // (no celular, o Backbone ficava escondido atrás do cartão do capítulo)
    focusRef.current =
      portraitSheet && floor
        ? [
            new THREE.Vector3(...labelAnchor(DEPARTMENTS[0], floor)),
            new THREE.Vector3(
              ...labelAnchor(DEPARTMENTS[DEPARTMENTS.length - 1], floor),
            ),
          ]
        : null;
  else if (floor === "heart") {
    const n = subAreas.length;
    const mid = stationWorld(focusArea, 0, n)
      .add(stationWorld(focusArea, n - 1, n))
      .multiplyScalar(0.5);
    const receiver = DEPARTMENTS.find(
      (d) => d.id === subAreas[subIndex]?.handoff?.to,
    );
    focusRef.current = [
      mid.setY(LEVELS.heart + 1),
      ...(receiver
        ? [
            new THREE.Vector3(
              receiver.zone.x,
              LEVELS.heart + 1,
              receiver.zone.z,
            ),
          ]
        : []),
    ];
  } else
    focusRef.current = [new THREE.Vector3(...labelAnchor(focusArea, floor))];

  return (
    <div
      // estudando (painel aberto): em telas menores o cartão do capítulo sai de cena
      className={panelOpen && selectedId ? "xp xp--studying" : "xp"}
      data-reading={reading}
    >
      <a
        className="skip-link"
        href="#modo-texto"
        onClick={(e) => (e.preventDefault(), setMapOpen(true))}
      >
        Pular para a versão em texto
      </a>
      <p className="sr-only">
        Cena 3D ilustrativa: um prédio em corte com um rooftop e três andares —
        Brain, Heart e Backbone. Oito cubos azuis no topo representam áreas da
        empresa; filamentos de luz descem de cada cubo pelos andares e ligam
        áreas que trabalham juntas. Todo o conteúdo também está disponível na
        versão em texto.
      </p>

      <div className="xp__stage">
        {webgl === "supported" && (
          <ExperienceCanvas
            poseRef={poseRef}
            focusRef={focusRef}
            onStruggle={onStruggle}
            selectedId={selectedId}
            activeId={activeId}
            onSelect={select}
            onHover={setHoveredId}
            labelRefs={labelRefs}
            reducedMotion={reducedMotion}
            interactive={revealed}
            pulsingIds={revealed ? [] : ROOFTOP_PULSES}
            pulseUp={chapter === "backbone"}
            labelFloor={floorOfChapter(chapter)}
            stations={{
              count: subAreas.length,
              activeIndex: subIndex,
              open: stationsOpen,
              onPick: pickStation,
              labelRefs: stationRefs,
              processRef,
              handoffTo: subAreas[subIndex]?.handoff?.to ?? null,
            }}
          />
        )}
        <CubeLabels
          labelRefs={labelRefs}
          selectedId={selectedId}
          activeId={activeId}
          showIds={false}
          hidden={!revealed}
          onSelect={select}
          onHover={setHoveredId}
          onFocusChange={setFocusedId}
        />
        {selectedId && (
          <StationLabels
            key={selectedId}
            labelRefs={stationRefs}
            areaLabel={AREA[selectedId].label}
            subAreas={subAreas}
            activeIndex={subIndex}
            onPick={pickStation}
            hidden={!stationsOpen}
          />
        )}
      </div>

      <div ref={progressRef} className="xp__progress" aria-hidden="true" />
      <header className="xp__top">
        <button
          type="button"
          className="xp__brand"
          onClick={() => goTo("synthesis")}
          title="Quem fez isto (na síntese)"
        >
          GUI BLOCK · CRM COMO SISTEMA
        </button>
        <ChapterNav
          chapter={chapter}
          onGo={goTo}
          onOpenIndex={() => setIndexOpen(true)}
          onOpenMap={() => setMapOpen(true)}
          onOpenGlossary={openGlossary}
          reading={reading}
          onToggleReading={toggleReading}
          onOpenGuide={onOpenGuide}
        />
      </header>

      <ChapterOverlay
        chapter={chapter}
        selectedId={selectedId}
        activeId={activeId}
        visited={visited}
        reducedMotion={reducedMotion}
        onPickArea={select}
        onHoverArea={setHoveredId}
        onOpenMap={() => setMapOpen(true)}
        onReviewFloor={() => goTo("brain")}
      />

      {activeId && !panelOpen && (
        <p className="xp__hint" aria-hidden="true">
          <b>{AREA[activeId].label}</b> {AREA_CONTENT[activeId].oneLiner}
        </p>
      )}

      {struggle && (
        <div className="xp__perf" role="status">
          <button
            type="button"
            className="xp__perf-close"
            onClick={() => setStruggle(false)}
            aria-label="Fechar aviso"
          >
            ×
          </button>
          <p>
            O 3D está pesado neste aparelho. Quer ler o mesmo conteúdo em texto?
          </p>
          <div>
            <button
              type="button"
              onClick={() => {
                setStruggle(false);
                setTextOnly(true);
                track("fallback_used", { reason: "desempenho" });
              }}
            >
              Ler sem o 3D
            </button>
            <button type="button" onClick={keep3d}>
              Continuar com o 3D
            </button>
          </div>
        </div>
      )}

      {/* área acompanhada com o painel fechado: um botão discreto para reabrir */}
      {selectedId && !panelOpen && revealed && (
        <button
          type="button"
          className="xp__reopen"
          onClick={() => setPanelOpen(true)}
        >
          <span>Estudando</span> {AREA[selectedId].label}
          {floor ? ` no ${FLOOR_META[floor].title}` : ""} →
        </button>
      )}

      {panelOpen && selectedId && (
        <AreaPanel
          areaId={selectedId}
          floor={floor}
          onClose={closePanel}
          onSelect={select}
          onGoFloor={goTo}
          subId={subId}
          onSubChange={pickSub}
          processRef={processRef}
        />
      )}

      {indexOpen && (
        <AreaIndex
          selectedId={selectedId}
          visited={visited}
          onPick={(id) => {
            setIndexOpen(false);
            select(id);
            if (!revealed) goTo("reveal");
          }}
          onClose={() => setIndexOpen(false)}
        />
      )}
      {mapOpen && (
        <LearningMap mode="dialog" onClose={() => setMapOpen(false)} />
      )}
      <GlossaryLayer />

      {/* espaçador de scroll: 1 unidade da timeline = 1 altura de tela */}
      <div
        ref={storyRef}
        className="xp__story"
        style={{ height: `${(TIMELINE_LENGTH + 1) * 100}vh` }}
        aria-hidden="true"
      />
    </div>
  );
}
