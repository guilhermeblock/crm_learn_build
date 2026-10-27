"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { CHAPTER_IDS } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import {
  CHAPTER_POSES,
  chapterAtTime,
  DRIFT,
  HOLD,
  lerpPose,
  MOVE,
  restProgress,
  TIMELINE_LENGTH,
  type Pose,
} from "./cameraPath";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Options {
  storyRef: RefObject<HTMLElement | null>;
  poseRef: RefObject<Pose>;
  reducedMotion: boolean;
  onChapter: (id: ChapterId) => void;
}

/**
 * Uma timeline única, ligada ao scroll da página (scrub), anima a pose da câmera
 * por todos os capítulos: repouso → transição → repouso... Ida e volta naturais,
 * sem scroll-jacking (o scroll é o nativo; a câmera só acompanha).
 *
 * Movimento reduzido: sem timeline. O scroll ainda define o capítulo, e a câmera
 * muda de pose de uma vez (mudança discreta, nada some).
 */
export function useScrollStory({ storyRef, poseRef, reducedMotion, onChapter }: Options) {
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const lastChapter = useRef<ChapterId>("rooftop");
  // a timeline é criada uma vez: o callback mais recente fica num ref
  const onChapterRef = useRef(onChapter);
  onChapterRef.current = onChapter;

  useGSAP(
    () => {
      const story = storyRef.current;
      if (!story) return;
      const report = (t: number) => {
        const id = chapterAtTime(t);
        if (id !== lastChapter.current) {
          lastChapter.current = id;
          onChapterRef.current(id);
        }
        return id;
      };

      if (reducedMotion) {
        triggerRef.current = ScrollTrigger.create({
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const id = report(self.progress * TIMELINE_LENGTH);
            Object.assign(poseRef.current, CHAPTER_POSES[id]);
          },
        });
        Object.assign(poseRef.current, CHAPTER_POSES[lastChapter.current]);
        return;
      }

      const tl = gsap.timeline({
        // sine.inOut: começa a andar logo (power2 ficava parado nos primeiros giros da roda)
        defaults: { ease: "sine.inOut" },
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          // pequena inércia: a câmera "alcança" o scroll em vez de saltar
          scrub: 0.35,
          onUpdate: (self) => report(self.progress * TIMELINE_LENGTH),
        },
      });
      // a pose é um objeto simples: gsap só escreve nele; a câmera lê em useFrame
      gsap.set(poseRef.current, CHAPTER_POSES.rooftop);
      CHAPTER_IDS.slice(1).forEach((id, i) => {
        const from = CHAPTER_POSES[CHAPTER_IDS[i]];
        const to = CHAPTER_POSES[id];
        const start = i * (HOLD + MOVE);
        // repouso: avanço lento e linear (a câmera responde a cada giro), depois a transição
        tl.to(poseRef.current, { ...lerpPose(from, to, DRIFT), duration: HOLD, ease: "none" }, start);
        tl.to(poseRef.current, { ...to, duration: MOVE }, start + HOLD);
      });
      tl.to({}, { duration: HOLD }, TIMELINE_LENGTH - HOLD);
      triggerRef.current = tl.scrollTrigger ?? null;
    },
    // sem seletores: não precisa de scope (e o espaçador não existe no fallback em texto)
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  // redimensionar, girar o celular ou dar zoom muda a altura do espaçador: sem isto,
  // a pessoa continuava no mesmo scrollY e pulava de capítulo (medido: Heart → Backbone)
  useEffect(() => {
    let progress = 0;
    const init = () => {
      progress = triggerRef.current?.progress ?? 0;
    };
    const restore = () => {
      const st = triggerRef.current;
      if (!st || progress <= 0) return;
      window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: "auto" });
    };
    ScrollTrigger.addEventListener("refreshInit", init);
    ScrollTrigger.addEventListener("refresh", restore);
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", init);
      ScrollTrigger.removeEventListener("refresh", restore);
    };
  }, []);

  /** Salta para o repouso de um capítulo (navegação, "próximo andar", "voltar ao rooftop"). */
  const goTo = useCallback(
    (id: ChapterId) => {
      const st = triggerRef.current;
      if (!st) return;
      const k = CHAPTER_IDS.indexOf(id);
      const top = st.start + (st.end - st.start) * restProgress(k);
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion],
  );

  return { goTo };
}
