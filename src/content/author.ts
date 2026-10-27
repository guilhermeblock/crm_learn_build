/**
 * Quem assina a experiência e como falar com ele. Aparece na síntese e no modo
 * texto, depois do conteúdo (PRD §13: nenhuma captura obrigatória; a ligação
 * comercial é secundária). Textos a confirmar pelo autor.
 */
export const AUTHOR = {
  brand: "Gui Block",
  name: "Guilherme Block",
  /** uma linha abaixo do nome */
  role: "Mentor em CRM e operação do relacionamento com o cliente",
  /** o convite, em 2 frases */
  pitch:
    "Trabalho com profissionais e empresas para tirar o CRM da tela e colocá-lo na operação: regras combinadas entre as áreas, dados que voltam para a decisão.",
  offers: [
    {
      title: "Mentoria",
      text: "Para quem quer dominar CRM como sistema, com casos da própria empresa.",
    },
    {
      title: "Aplicação em empresas",
      text: "Diagnóstico das passagens entre áreas e desenho das regras no CRM que você já tem.",
    },
  ],
  linkedin: "https://www.linkedin.com/in/guillhermeblock/",
  /** só dígitos, com DDI */
  whatsapp: "5547997354777",
  whatsappText:
    "Oi, Gui! Passei pelo CRM como Sistema e quero conversar sobre a mentoria.",
} as const;

export const whatsappLink = () =>
  `https://wa.me/${AUTHOR.whatsapp}?text=${encodeURIComponent(AUTHOR.whatsappText)}`;
