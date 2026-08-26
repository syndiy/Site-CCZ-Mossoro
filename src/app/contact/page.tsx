import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/layout/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Icon } from "@/components/shared/icon";
import { GoogleMapEmbed } from "@/components/maps/google-map";
import { Card, CardContent } from "@/components/ui/card";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site, mapsRotaUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Endereço, telefone e horário de atendimento do Centro de Controle de Zoonoses de Mossoró.",
  alternates: { canonical: "/contact/" },
};

export default function ContatoPage() {
  return (
    <section className="py-12 lg:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Contato", path: "/contact/" },
        ])}
      />

      <Container>
        <SectionHeading as="h1" eyebrow="Fale com o CCZ" title="Onde estamos">
          Venha até a nossa sede ou fale com a equipe pelo telefone.
        </SectionHeading>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <GoogleMapEmbed
            query={`${site.address.street}, ${site.address.district}, ${site.address.city}, ${site.address.state}`}
            title="Mapa da sede do CCZ Mossoró"
            className="h-96 w-full"
          />

          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="flex gap-4">
                <Icon name="location" size={26} className="mt-0.5 shrink-0 text-brand-600" />
                <div>
                  <h2 className="text-lg font-semibold">Endereço</h2>
                  <p className="mt-1 text-ink-soft">
                    {site.address.street}
                    <br />
                    {site.address.district}, {site.address.city}/{site.address.state}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex gap-4">
                <Icon name="clock" size={26} className="mt-0.5 shrink-0 text-brand-600" />
                <div>
                  <h2 className="text-lg font-semibold">Atendimento</h2>
                  <p className="mt-1 text-ink-soft">{site.hours.label}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex gap-4">
                <Icon name="phone" size={26} className="mt-0.5 shrink-0 text-brand-600" />
                <div>
                  <h2 className="text-lg font-semibold">Telefone</h2>
                  <p className="mt-1 text-ink-soft">{site.contact.phone}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-4">
              <ButtonLink href={`tel:${site.contact.phoneRaw}`} size="lg">
                <Icon name="phone" size={18} /> Ligar agora
              </ButtonLink>
              <ButtonLink href={mapsRotaUrl()} variant="outline" size="lg">
                <Icon name="gps" size={18} /> Como chegar
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
