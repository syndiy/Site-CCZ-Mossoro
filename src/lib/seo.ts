import type { Metadata } from "next";
import { site } from "./site";

export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: {
    default: `${site.legalName} | ${site.address.city}-${site.address.state}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.parentOrg }],
  publisher: site.parentOrg,
  keywords: [
    "CCZ Mossoró",
    "Centro de Controle de Zoonoses",
    "zoonoses Mossoró",
    "vacinação antirrábica Mossoró",
    "castração de cães e gatos Mossoró",
    "controle de vetores dengue Mossoró",
    "denúncia maus-tratos animais Mossoró",
    "vigilância em saúde Mossoró",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.legalName,
    url: site.url,
    title: `${site.legalName} | ${site.address.city}-${site.address.state}`,
    description: site.description,
    images: [
      {
        url: "/img/home2.avif",
        width: 1200,
        height: 630,
        alt: "Centro de Controle de Zoonoses de Mossoró",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.legalName,
    description: site.description,
    images: ["/img/home2.avif"],
  },
  category: "government",
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    description: site.description,
    parentOrganization: { "@type": "GovernmentOrganization", name: site.parentOrg },
    logo: `${site.url}/logo.svg`,
    image: `${site.url}/img/home2.avif`,
    email: site.contact.email,
    telephone: site.contact.phoneRaw,
    areaServed: { "@type": "City", name: `${site.address.city}, ${site.address.state}` },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: site.hours.days,
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    sameAs: [site.social.instagram, site.social.facebook],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.legalName,
    url: site.url,
    inLanguage: "pt-BR",
    publisher: { "@type": "GovernmentOrganization", name: site.legalName },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}
