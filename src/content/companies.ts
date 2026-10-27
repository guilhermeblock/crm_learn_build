import type { CaseCompany } from "./types";

/**
 * As duas empresas fictícias do fio condutor (docs/conteudo/11 §5): toda área tem
 * um caso em cada uma, e o leitor alterna entre elas.
 */
export const CASE_COMPANIES: Record<
  CaseCompany,
  { label: string; client: string; badge: string; about: string }
> = {
  b2b: {
    label: "B2B",
    client: "Aurora Transportes",
    badge: "Empresa B2B · software de gestão por assinatura",
    about:
      "Software de gestão financeira vendido por assinatura anual, com implantação. A cliente é a Aurora Transportes: 80 caminhões, fechamento do mês que levava 10 dias.",
  },
  b2c: {
    label: "B2C",
    client: "Marina",
    badge: "Empresa B2C · loja online de calçados",
    about:
      "Loja online de calçados, com app, WhatsApp e entrega por transportadora. A cliente é a Marina, que compra pelo site e pelo WhatsApp.",
  },
};
