import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/layout/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Paw } from "@/components/shared/illustrations";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre o CCZ",
  description:
    "O que é o Centro de Controle de Zoonoses de Mossoró, o que faz e como atua na vigilância em saúde e na proteção animal.",
  alternates: { canonical: "/about/" },
};

const atuacao = [
  "Vacinação antirrábica de cães e gatos, o ano todo e em campanhas.",
  "Castração gratuita para o controle populacional de cães e gatos.",
  "Controle de vetores e pragas urbanas, como o mosquito da dengue e roedores.",
  "Investigação de denúncias de maus-tratos e de animais sinantrópicos.",
  "Diagnóstico e acompanhamento de zoonoses, como a leishmaniose.",
  "Educação em saúde nas escolas e comunidades.",
];

export default function SobrePage() {
  return (
    <section className="py-12 lg:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Sobre o CCZ", path: "/about/" },
        ])}
      />

      <Container>
        <SectionHeading as="h1" eyebrow="Institucional" title="Sobre o CCZ">
          O Centro de Controle de Zoonoses cuida da saúde das pessoas cuidando dos animais.
        </SectionHeading>

        <div className="mx-auto max-w-[70ch]">
          <p className="text-lg text-ink-soft">
            O {site.legalName} é uma unidade da {site.department}, ligada à {site.parentOrg}.
            Oficialmente, a unidade é chamada de Unidade de Vigilância em Zoonoses (UVZ).
          </p>

          <p className="mt-4 text-ink-soft">
            Zoonoses são doenças que podem passar de animais para pessoas. O trabalho do CCZ é
            quebrar essa cadeia de transmissão, com vacinação, controle de vetores, castração e
            orientação à população.
          </p>

          <h2 className="mt-12 text-2xl font-bold">Como atuamos</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {atuacao.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-soft">
                <Paw className="mt-1 size-4 shrink-0 fill-brand-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold">Onde estamos</h2>
          <p className="mt-3 text-ink-soft">
            {site.address.street}, {site.address.district}, {site.address.city}/{site.address.state}.
            <br />
            {site.hours.label}.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/contact/" size="lg">
              Ver no mapa
            </ButtonLink>
            <ButtonLink href="/services/" variant="outline" size="lg">
              Conhecer os serviços
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
