export const site = {
  name: "CCZ Mossoró",
  legalName: "Centro de Controle de Zoonoses de Mossoró",
  parentOrg: "Prefeitura Municipal de Mossoró",
  department: "Secretaria Municipal de Saúde. Vigilância em Saúde",

  // Endereço público usado em links canônicos, sitemap, feed e dados estruturados.
  // Enquanto o domínio oficial não existe, o build informa o endereço em uso.
  url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ccz.mossoro.rn.gov.br").replace(/\/+$/, ""),

  description:
    "Centro de Controle de Zoonoses de Mossoró: vacinação antirrábica, castração, " +
    "controle de vetores (dengue, zika, chikungunya), denúncias de focos e maus-tratos, " +
    "e prevenção de zoonoses. Serviços de saúde pública e proteção animal.",

  contact: {
    email: "ccz@mossoro.rn.gov.br",
    phone: "(84) 2140-0753",
    phoneRaw: "+558421400753",
    whatsapp: "558433151234",
  },

  address: {
    street: "R. Dr. Moisés da Costa Lopes, 48",
    district: "Nova Betânia",
    city: "Mossoró",
    state: "RN",
    zip: "59607-490",
    country: "BR",
    lat: -5.187,
    lng: -37.344,
  },

  hours: {
    label: "Segunda a sexta, das 7h às 11h e das 13h às 17h",
    opens: "07:00",
    closes: "17:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },

  oficial: {
    prefeitura: "https://prefeiturademossoro.com.br",
    ouvidoria: "https://ouvidoria.mossoro.rn.gov.br",
    diarioOficial: "https://dom.mossoro.rn.gov.br",
    falabr: "https://falabr.cgu.gov.br",
  },
} as const;

export const mapsRotaUrl = (address: { street: string; district: string; city: string; state: string } = site.address) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${address.street}, ${address.district}, ${address.city}, ${address.state}`,
  )}`;

export const whatsappUrl = (message?: string, whatsapp: string = site.contact.whatsapp) =>
  `https://wa.me/${whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

export const nav = [
  { href: "/", label: "Início" },
  { href: "/services/", label: "Serviços" },
  { href: "/articles/", label: "Artigos" },
  { href: "/news/", label: "Notícias" },
  { href: "/reports/", label: "Denúncias" },
  { href: "/contact/", label: "Contato" },
] as const;
