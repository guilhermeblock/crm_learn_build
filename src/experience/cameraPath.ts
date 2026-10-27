import { CHAPTER_IDS } from "@/content/chapters";
import type { ChapterId } from "@/content/types";
import { LEVELS, orbitView, VIEWS } from "@/scene/config/constants";

/** Pose de câmera: posição + alvo. É o que a timeline de scroll anima (um único controlador). */
export interface Pose {
  px: number;
  py: number;
  pz: number;
  tx: number;
  ty: number;
  tz: number;
  /** deslocamento lateral (unidades de cena): abre espaço para o texto em telas largas */
  pan: number;
}

type View = { position: [number, number, number]; target: [number, number, number] };

/** `pan` é aplicado pela câmera (ExperienceCamera), proporcional à largura da tela. */
function pose(v: View, pan = 0): Pose {
  return { px: v.position[0], py: v.position[1], pz: v.position[2], tx: v.target[0], ty: v.target[1], tz: v.target[2], pan };
}

/**
 * Pontos de referência da descida (storyboard §7): rooftop próximo → borda do rooftop
 * → interior de cada andar → recuo de síntese. Azimutes levemente diferentes por andar
 * dão leitura de "descida" sem desorientar.
 */
export const CHAPTER_POSES: Record<ChapterId, Pose> = {
  rooftop: pose(orbitView("rooftop", "Rooftop", [-0.8, LEVELS.rooftop + 2.2, -0.8], 45, 30, 21), 3.4),
  reveal: pose(orbitView("rooftop", "Revelação", [-0.4, LEVELS.rooftop + 0.2, -0.4], 45, 13, 30), 4.5),
  brain: pose(orbitView("heart", "Brain", [-1.2, LEVELS.brain + 1.4, -1.2], 41, 10, 27), 4),
  heart: pose(orbitView("heart", "Heart", [-1.2, LEVELS.heart + 1.3, -1.2], 47, 9, 27), 4),
  backbone: pose(orbitView("heart", "Backbone", [-1.2, LEVELS.backbone + 1.3, -1.2], 43, 10, 27), 4),
  synthesis: pose(VIEWS.overview, 6),
};

/*
 * Ritmo do scroll, em "unidades de timeline" (1 unidade ≈ 1 altura de tela):
 * cada capítulo tem um repouso (HOLD, ponto de pausa previsível para clicar)
 * e depois uma transição (MOVE) até o próximo. O último capítulo também repousa.
 * O repouso não é parado: a câmera avança DRIFT do caminho até o próximo capítulo,
 * para que todo giro da roda tenha resposta imediata (sem "zona morta").
 */
export const HOLD = 0.35;
export const DRIFT = 0.12;
export const MOVE = 1;
const STEP = HOLD + MOVE;
export const TIMELINE_LENGTH = (CHAPTER_IDS.length - 1) * STEP + HOLD;

/** pose entre a e b (t = 0..1): usada no avanço lento do repouso */
export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const out = { ...a };
  for (const k of Object.keys(a) as (keyof Pose)[]) out[k] = a[k] + (b[k] - a[k]) * t;
  return out;
}

/** tempo em que a câmera chega ao capítulo k */
export function arrivalTime(k: number) {
  return k * STEP;
}

/** capítulo ativo para um tempo da timeline: troca no meio da transição */
export function chapterAtTime(t: number): ChapterId {
  let k = 0;
  for (let i = 1; i < CHAPTER_IDS.length; i++) {
    if (t >= arrivalTime(i) - MOVE / 2) k = i;
  }
  return CHAPTER_IDS[k];
}

/** progresso (0..1) do centro do repouso do capítulo k: destino dos saltos de navegação */
export function restProgress(k: number) {
  return Math.min(1, (arrivalTime(k) + HOLD / 2) / TIMELINE_LENGTH);
}
