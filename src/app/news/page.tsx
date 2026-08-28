import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { ContentCard, ContentGrid } from "@/components/cards/content-card";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getAllNews, formatDate } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Notícias",
  description:
    "Campanhas, mutirões e avisos do Centro de Controle de Zoonoses de Mossoró. Acompanhe as ações e serviços na sua cidade.",
  alternates: { canonical: "/news/" },
};

export default function NoticiasPage() {
  const noticias = getAllNews();
  const [destaque, ...restante] = noticias;

  return (
    <div className="py-12 lg:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Notícias", path: "/news/" },
        ])}
      />
      <Container>
        <header className="max-w-2xl">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            Comunicação
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Notícias</h1>
          <p className="mt-5 text-lg text-ink-soft">
            Campanhas, mutirões e avisos do CCZ Mossoró para toda a comunidade.
          </p>
        </header>

        {noticias.length === 0 ? (
          <p className="mt-12 text-ink-soft">Nenhuma notícia publicada ainda.</p>
        ) : (
          <>
            {destaque ? (
              <Link
                href={`/news/${destaque.slug}/`}
                className="group mt-12 grid gap-6 overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-soft transition hover:border-brand-300 hover:shadow-md md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-info-50 md:aspect-auto">
                  {destaque.cover ? (
                    <Image
                      src={destaque.cover}
                      alt={destaque.coverAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-8 transition group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col justify-center p-6 md:p-10">
                  {destaque.publishedAt ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                      {formatDate(destaque.publishedAt)}
                    </span>
                  ) : null}
                  <h2 className="mt-2 text-2xl font-bold text-ink group-hover:text-brand-700 md:text-3xl">
                    {destaque.title}
                  </h2>
                  <p className="mt-3 text-ink-soft">{destaque.excerpt}</p>
                </div>
              </Link>
            ) : null}

            {restante.length > 0 ? (
              <div className="mt-6">
                <ContentGrid>
                  {restante.map((noticia) => (
                    <li key={noticia.slug}>
                      <ContentCard
                        href={`/news/${noticia.slug}/`}
                        title={noticia.title}
                        summary={noticia.excerpt}
                        cover={noticia.cover}
                        coverAlt={noticia.coverAlt}
                        publishedAt={noticia.publishedAt}
                      />
                    </li>
                  ))}
                </ContentGrid>
              </div>
            ) : null}
          </>
        )}
      </Container>
    </div>
  );
}
