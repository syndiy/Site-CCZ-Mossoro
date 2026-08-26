import type { Metadata } from "next";
import { ServiceGrid } from "@/components/cards/service-card";
import { JsonLd } from "@/components/shared/json-ld";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { PawPattern } from "@/components/shared/illustrations";
import { services } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Conheça os serviços do CCZ Mossoró: vacinação antirrábica, castração de cães e gatos, controle de vetores, leishmaniose, acidentes com animais e prevenção de zoonoses.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <section className="relative overflow-hidden py-12 lg:py-24">
      <PawPattern className="text-brand-800/5" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Serviços", path: "/services/" },
        ])}
      />
      <Container className="relative">
        <SectionHeading as="h1" eyebrow="O que fazemos" title="Nossos serviços">
          Atuamos na prevenção e no controle de doenças transmitidas por animais e vetores, além
          do cuidado e do bem-estar dos animais em Mossoró.
        </SectionHeading>
        <ServiceGrid items={services} />
      </Container>
    </section>
  );
}
