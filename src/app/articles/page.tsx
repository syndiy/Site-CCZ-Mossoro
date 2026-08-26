import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { ContentCard, ContentGrid } from "@/components/cards/content-card";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getAllArticles } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Artigos",
  description:
    "Conteúdos de educação em saúde do Centro de Controle de Zoonoses de Mossoró: prevenção de dengue, leishmaniose, zoonoses e proteção animal.",
  alternates: { canonical: "/articles/" },
};

export default function ArtigosPage() {
  const artigos = getAllArticles();

  return (
    <div className="py-12 lg:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Artigos", path: "/articles/" },
        ])}
      />
      <Container>
        <header className="max-w-2xl">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            <span className="h-px w-8 bg-brand-600" />
            Educação em saúde
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Artigos</h1>
          <p className="mt-5 text-lg text-ink-soft">
            Informação confiável sobre prevenção de doenças, controle de vetores e proteção animal,
            preparada pela equipe do CCZ Mossoró.
          </p>
        </header>

        {artigos.length === 0 ? (
          <p className="mt-12 text-ink-soft">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="mt-12">
            <ContentGrid>
              {artigos.map((artigo) => (
                <li key={artigo.slug}>
                  <ContentCard
                    href={`/articles/${artigo.slug}/`}
                    title={artigo.title}
                    summary={artigo.description}
                    cover={artigo.cover}
                    coverAlt={artigo.coverAlt}
                    eyebrow={artigo.eyebrow}
                    publishedAt={artigo.publishedAt}
                  />
                </li>
              ))}
            </ContentGrid>
          </div>
        )}
      </Container>
    </div>
  );
}
