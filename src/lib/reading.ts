/** Tema das superfícies de leitura (a cena continua escura); preferência só deste navegador. */
export type Reading = "light" | "dark";

const READING_KEY = "crm-leitura";

export function storedReading(): Reading {
  try {
    return window.localStorage.getItem(READING_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function saveReading(r: Reading) {
  try {
    window.localStorage.setItem(READING_KEY, r);
  } catch {
    // sem armazenamento (aba privada): vale só nesta visita
  }
}

/**
 * Como a experiência abre: no celular, a leitura guiada (texto com imagens do prédio);
 * no tablet e no computador, o prédio 3D. A escolha da pessoa vale para a visita, e
 * `?modo=3d` / `?modo=guia` forçam um dos dois (testes e links diretos).
 */
export type XpMode = "guide" | "3d";

export const PHONE_QUERY =
  "(max-width: 760px), (max-height: 500px) and (orientation: landscape)";
const MODE_KEY = "crm-modo";

export function pickMode(): XpMode {
  const forced = new URLSearchParams(window.location.search).get("modo");
  if (forced === "3d") return "3d";
  if (forced === "guia") return "guide";
  try {
    const kept = window.sessionStorage.getItem(MODE_KEY);
    if (kept === "3d" || kept === "guide") return kept;
  } catch {
    // sem armazenamento: decide pelo tamanho da tela
  }
  return window.matchMedia(PHONE_QUERY).matches ? "guide" : "3d";
}

export function keepMode(mode: XpMode) {
  try {
    window.sessionStorage.setItem(MODE_KEY, mode);
  } catch {
    // vale só agora
  }
}

export const isPhone = () => window.matchMedia(PHONE_QUERY).matches;
