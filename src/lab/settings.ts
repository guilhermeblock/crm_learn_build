import type { ViewId } from "@/scene/config/constants";

/** Parâmetros ajustáveis no painel de laboratório (somente desenvolvimento). */
export interface LabSettings {
  view: ViewId;
  exposure: number;
  keyLight: number;
  bloom: number;
  fov: number;
  orbit: boolean;
  showIds: boolean;
}

export const DEFAULT_SETTINGS: LabSettings = {
  view: "overview",
  exposure: 1.0,
  keyLight: 2.4,
  bloom: 0.8,
  fov: 36,
  orbit: false,
  showIds: false,
};

export const VIEW_IDS: ViewId[] = ["overview", "rooftop", "heart"];

export function isViewId(value: string | null): value is ViewId {
  return value !== null && (VIEW_IDS as string[]).includes(value);
}
