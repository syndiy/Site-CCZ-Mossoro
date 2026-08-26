import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Erro 404</p>
        <h1 className="mt-2 text-4xl font-bold">Página não encontrada</h1>
        <p className="mb-6 mt-3 text-ink-soft">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <ButtonLink href="/" size="lg">
          Voltar para o início
        </ButtonLink>
      </Container>
    </section>
  );
}
