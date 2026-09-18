import { site } from "./site";

export type SiteConfig = Partial<Record<"nomeInstituicao" | "horarioFuncionamento" | "whatsapp" | "emailContato" | "linkInstagram" | "linkFacebook" | "logradouro" | "numero" | "bairro" | "cep" | "localidade" | "estado", string | null>>;
const value = (input: string | null | undefined, fallback: string) => {
  const text = input?.trim();
  return text && !/preencher|00000-000|preencher@/i.test(text) ? text : fallback;
};

export function applySiteConfig(config: SiteConfig) {
  const street = value(config.logradouro, site.address.street);
  const number = value(config.numero, "");
  const whatsapp = value(config.whatsapp, site.contact.whatsapp).replace(/\D/g, "");
  return {
    ...site,
    legalName: value(config.nomeInstituicao, site.legalName),
    hours: { ...site.hours, label: value(config.horarioFuncionamento, site.hours.label) },
    contact: { ...site.contact, email: value(config.emailContato, site.contact.email), whatsapp: whatsapp.length === 10 || whatsapp.length === 11 ? `55${whatsapp}` : whatsapp },
    address: {
      ...site.address,
      street: number ? `${street}, ${number}` : street,
      district: value(config.bairro, site.address.district),
      city: value(config.localidade, site.address.city),
      state: value(config.estado, site.address.state),
      zip: value(config.cep, site.address.zip),
    },
    social: { ...site.social, instagram: value(config.linkInstagram, site.social.instagram), facebook: value(config.linkFacebook, site.social.facebook) },
  };
}
