import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acessibilidade",
  description:
    "Compromisso de acessibilidade do portal do CCZ Mossoró, em conformidade com o eMAG e a WCAG 2.1 nível AA.",
  alternates: { canonical: "/accessibility/" },
};

export default function AccessibilityPage() {
  return (
    <section className="py-12 lg:py-24">
      <Container>
        <article className="max-w-[70ch]">
          <h1 className="mb-5 text-4xl font-bold">Acessibilidade</h1>
          <p className="mb-3 text-ink-soft">
            O portal do {site.legalName} é feito para ser acessível ao maior número possível de
            pessoas, seguindo o Modelo de Acessibilidade em Governo Eletrônico (eMAG) e as
            diretrizes internacionais WCAG 2.1, nível AA.
          </p>

          <h2 className="mb-3 mt-6 text-2xl font-bold">Recursos disponíveis</h2>
          <ul className="mb-3 list-disc space-y-2 pl-5 text-ink-soft">
            <li>Navegação completa por teclado e atalho “Pular para o conteúdo”.</li>
            <li>Estrutura semântica compatível com leitores de tela.</li>
            <li>Contraste de cores adequado para leitura.</li>
            <li>Texto que pode ser ampliado até 200% sem perda de conteúdo.</li>
            <li>Respeito à preferência de redução de movimento do sistema.</li>
          </ul>

          <h2 className="mb-3 mt-6 text-2xl font-bold">Encontrou uma barreira?</h2>
          <p className="mb-3 text-ink-soft">
            Se você tiver dificuldade para acessar algum conteúdo, fale com a gente para que
            possamos corrigir:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-ink-soft">
            <li>
              E-mail:{" "}
              <a href={`mailto:${site.contact.email}`} className="text-brand-600 hover:underline">
                {site.contact.email}
              </a>
            </li>
            <li>
              Telefone:{" "}
              <a href={`tel:${site.contact.phoneRaw}`} className="text-brand-600 hover:underline">
                {site.contact.phone}
              </a>
            </li>
          </ul>
        </article>
      </Container>
    </section>
  );
}
