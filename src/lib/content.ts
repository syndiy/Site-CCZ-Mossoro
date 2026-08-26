import type { IconName } from "@/components/shared/icon";
import type { StatusDenuncia, TipoDenuncia } from "./api";

export type ServiceItem = {
  title: string;
  description: string;
  icon: IconName;
  href: string;
};

export const quickAccess: ServiceItem[] = [
  {
    title: "Vacinação",
    description: "Veja onde e quando vacinar cães e gatos contra a raiva.",
    icon: "vaccine",
    href: "/services/vacinacao-antirrabica/",
  },
  {
    title: "Castração",
    description: "Saiba como participar do programa de castração gratuita.",
    icon: "paw",
    href: "/services/castracao/",
  },
  {
    title: "Denúncias",
    description: "Registre focos de pragas, roedores ou maus-tratos.",
    icon: "report",
    href: "/reports/",
  },
  {
    title: "Prevenção",
    description: "Como se proteger da dengue, da raiva e de outras zoonoses.",
    icon: "shield",
    href: "/services/prevencao-de-zoonoses/",
  },
];

export const services: ServiceItem[] = [
  {
    title: "Vacinação antirrábica",
    description:
      "Campanhas e calendário para proteger cães e gatos contra a raiva, o ano todo.",
    icon: "vaccine",
    href: "/services/vacinacao-antirrabica/",
  },
  {
    title: "Castração",
    description: "Cadastro, preparo do animal e orientações para a cirurgia gratuita.",
    icon: "paw",
    href: "/services/castracao/",
  },
  {
    title: "Leishmaniose (calazar)",
    description:
      "Transmissão pelo mosquito-palha, sinais nos cães e diagnóstico em laboratório.",
    icon: "lab",
    href: "/services/leishmaniose/",
  },
  {
    title: "Acidentes com animais",
    description:
      "O que fazer em caso de mordedura e de acidente com animais peçonhentos.",
    icon: "emergency",
    href: "/services/acidentes-com-animais/",
  },
  {
    title: "Prevenção de zoonoses",
    description: "Raiva, dengue, zika, chikungunya e doença de Chagas.",
    icon: "shield",
    href: "/services/prevencao-de-zoonoses/",
  },
  {
    title: "Educação em saúde",
    description: "Palestras nas comunidades, materiais educativos e guarda responsável.",
    icon: "book",
    href: "/services/educacao-em-saude/",
  },
];

export const tiposDenuncia: { value: TipoDenuncia; label: string }[] = [
  { value: "MAUS_TRATOS", label: "Maus-tratos a animais" },
  { value: "RATOS", label: "Ratos ou roedores" },
  { value: "BARATAS", label: "Baratas" },
  { value: "MORCEGOS", label: "Morcegos" },
  { value: "ANIMAIS_SINANTROPICOS", label: "Animais sinantrópicos (pombos e outros)" },
];

export const statusDenuncia: Record<
  StatusDenuncia,
  { label: string; className: string; icon: IconName }
> = {
  EM_ANALISE: { label: "Em análise", className: "bg-warning-50 text-warning-600", icon: "clock" },
  VISITA_REALIZADA: {
    label: "Visita realizada",
    className: "bg-info-50 text-info-600",
    icon: "calendar",
  },
  CONCLUIDA: { label: "Concluída", className: "bg-success-50 text-success-600", icon: "check" },
  NAO_RESOLVIDA: {
    label: "Não resolvida",
    className: "bg-danger-50 text-danger-600",
    icon: "report",
  },
};
