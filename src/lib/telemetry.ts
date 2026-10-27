/*
 * Eventos de aprendizagem (PRD FR-13 / §10), sem envio de dados.
 * Nesta fase ficam só no navegador: um CustomEvent "crm:event" e um contador em memória.
 * Nenhum dado pessoal, identificador ou rede. (O e-mail da boas-vindas vai por outra rota, /api/boas-vindas.)
 */
export type LearningEvent =
  | "experience_started"
  | "chapter_viewed"
  | "area_selected"
  | "subarea_opened"
  | "area_context_completed"
  | "synthesis_viewed"
  | "fallback_used"
  | "glossary_opened"
  | "contact_sent"
  | "welcome_sent"
  | "welcome_skipped";

const counts = new Map<LearningEvent, number>();

export function track(event: LearningEvent, detail?: Record<string, string>) {
  counts.set(event, (counts.get(event) ?? 0) + 1);
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("crm:event", { detail: { event, ...detail } }));
}

export function eventCounts() {
  return Object.fromEntries(counts);
}
