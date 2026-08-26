import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidade e LGPD",
  description:
    "Política de privacidade e tratamento de dados pessoais do portal do CCZ Mossoró, conforme a Lei Geral de Proteção de Dados (LGPD).",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <section className="py-12 lg:py-24">
      <Container>
        <article className="max-w-[70ch]">
          <h1 className="mb-5 text-4xl font-bold">Privacidade e proteção de dados</h1>
          <p className="mb-3 text-ink-soft">
            Esta página explica como o {site.legalName} trata os dados pessoais coletados neste
            portal, conforme a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados, a LGPD).
          </p>

          <h2 className="mb-3 mt-6 text-2xl font-bold">Quais dados coletamos</h2>
          <p className="mb-3 text-ink-soft">
            Ao registrar uma denúncia, coletamos apenas os dados que você informar: descrição e
            localização da ocorrência e, se você quiser, nome, e-mail e telefone para retorno.
            Informar o contato é opcional.
          </p>

          <h2 className="mb-3 mt-6 text-2xl font-bold">Como usamos os dados</h2>
          <ul className="mb-3 list-disc space-y-2 pl-5 text-ink-soft">
            <li>Registrar, analisar e dar andamento às denúncias e solicitações.</li>
            <li>Entrar em contato para retorno, quando você fornecer seus dados.</li>
            <li>Gerar estatísticas de saúde pública de forma agregada e anônima.</li>
          </ul>

          <h2 className="mb-3 mt-6 text-2xl font-bold">Seus direitos</h2>
          <p className="mb-3 text-ink-soft">
            Você pode pedir informações sobre o uso dos seus dados, sua correção ou exclusão. Para
            isso, entre em contato pelo e-mail{" "}
            <a href={`mailto:${site.contact.email}`} className="text-brand-600 hover:underline">
              {site.contact.email}
            </a>
            .
          </p>

          <p className="mt-6 text-sm italic text-muted">
            Este texto é um modelo inicial e deve ser revisado pelo setor jurídico da{" "}
            {site.parentOrg} antes da publicação oficial.
          </p>
        </article>
      </Container>
    </section>
  );
}
