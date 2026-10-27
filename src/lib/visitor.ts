/**
 * Boas-vindas: quem é o visitante, em que nível está e o que já respondeu.
 * Tudo fica neste navegador (localStorage). O e-mail e o nível só saem daqui
 * quando a pessoa envia a tela de boas-vindas (rota /api/boas-vindas).
 */

export type CrmLevel = "comecando" | "uso" | "configuro" | "desenho";

export interface LevelInfo {
  id: CrmLevel;
  label: string;
  text: string;
  /** dica de percurso, mostrada depois do envio */
  tip: string;
}

export const LEVELS: LevelInfo[] = [
  {
    id: "comecando",
    label: "Estou começando",
    text: "Conheço CRM de nome, ou só pelo disparo de campanha e pelo funil de vendas.",
    tip: "Desça sem pressa, do topo até a base. Os termos sublinhados abrem uma explicação curta, e o percurso acompanha Vendas, a área mais completa.",
  },
  {
    id: "uso",
    label: "Uso no dia a dia",
    text: "Registro clientes, oportunidades ou atendimentos, mas não decido como o CRM funciona.",
    tip: "Você já conhece a sua parte. Repare no que acontece antes e depois dela: as passagens entre as áreas estão no Heart, o andar do meio.",
  },
  {
    id: "configuro",
    label: "Configuro ou gerencio",
    text: "Defino campos, etapas, automações ou relatórios para a minha equipe.",
    tip: "Abra o \"Entenda o porquê\" de cada área e preste atenção no Backbone: é onde as regras que você configura viram registro, ou viram retrabalho.",
  },
  {
    id: "desenho",
    label: "Desenho a operação",
    text: "Penso em como as áreas se conectam e qual regra vale para a empresa toda.",
    tip: "Siga os casos da Aurora e da Marina: eles atravessam o prédio inteiro. A síntese fecha com o ciclo completo e as áreas que cortam todos os andares.",
  },
];

export const levelInfo = (id: string | undefined) => LEVELS.find((l) => l.id === id);

export interface Visitor {
  email?: string;
  level?: CrmLevel;
  /** "sent" respondeu; "skipped" entrou sem e-mail */
  status: "sent" | "skipped";
  at: number;
}

const KEY = "crm-visitante";
const SEEN_KEY = "crm-visita";
/** quem pulou vê a tela de novo depois deste prazo */
const SKIP_DAYS = 30;

export function readVisitor(): Visitor | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Visitor) : null;
  } catch {
    return null;
  }
}

export function saveVisitor(v: Visitor) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    // aba privada: vale só nesta visita
  }
}

/** a tela de boas-vindas aparece nesta visita? */
export function needsWelcome(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.get("boasvindas") === "1") return true; // forçar (testes, revisão)
  if (params.get("boasvindas") === "0") return false;
  // navegadores automatizados (testes e capturas) entram direto
  if (navigator.webdriver) return false;
  const v = readVisitor();
  if (!v) return true;
  if (v.status === "sent") return false;
  return Date.now() - v.at > SKIP_DAYS * 86_400_000;
}

let hereBefore: boolean | undefined;

/** já esteve aqui antes? Marca a visita atual para a próxima vez (resposta guardada na 1ª chamada). */
export function wasHereBefore(): boolean {
  if (hereBefore !== undefined) return hereBefore;
  try {
    hereBefore = window.localStorage.getItem(SEEN_KEY) !== null;
    window.localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    hereBefore = false;
  }
  return hereBefore;
}

/** "Bom dia", "Boa tarde" ou "Boa noite", pela hora do visitante */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

/**
 * Nome vindo do link (?nome=Ana): permite mandar um link personalizado por mensagem.
 * Só letras, primeira palavra, até 24 caracteres.
 */
export function nameFromLink(): string | undefined {
  const raw = new URLSearchParams(window.location.search).get("nome");
  if (!raw) return undefined;
  const first = raw.trim().split(/\s+/)[0]?.replace(/[^\p{L}'-]/gu, "").slice(0, 24);
  if (!first || first.length < 2) return undefined;
  return first.charAt(0).toLocaleUpperCase("pt-BR") + first.slice(1).toLocaleLowerCase("pt-BR");
}

/** de onde a pessoa veio: parâmetros utm_* e o site anterior */
export function visitSource(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const v = params.get(k);
    if (v) out[k] = v.slice(0, 80);
  }
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) out.referrer = host;
    }
  } catch {
    // referrer inválido: ignora
  }
  return out;
}
