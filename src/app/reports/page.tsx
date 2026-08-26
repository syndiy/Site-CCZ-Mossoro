import type { Metadata } from "next";
import { ReportForm, ProtocolLookup } from "@/components/forms/report-form";
import { JsonLd } from "@/components/shared/json-ld";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Denúncias",
  description:
    "Registre denúncias de focos do mosquito da dengue, pragas urbanas, animais sinantrópicos ou maus-tratos a animais em Mossoró. Acompanhe pelo número de protocolo.",
  alternates: { canonical: "/reports/" },
};

export default function ReportsPage() {
  return (
    <section className="py-12 lg:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Denúncias", path: "/reports/" },
        ])}
      />
      <Container>
        <SectionHeading as="h1" eyebrow="Vigilância em Saúde" title="Denúncia de focos e pragas">
          Sua denúncia ajuda a proteger toda a comunidade. Preencha os dados abaixo. O envio é
          rápido e você recebe um número de protocolo para acompanhar.
        </SectionHeading>

        <div className="mx-auto max-w-3xl">
          <ReportForm />
          <ProtocolLookup />
        </div>
      </Container>
    </section>
  );
}
