import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Icon } from "@/components/shared/icon";
import { Markdown } from "@/components/shared/markdown";
import { Card, CardContent } from "@/components/ui/card";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getArticle, getArticleSlugs, formatDate } from "@/lib/cms";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getArticle(slug);
  if (!doc) return {};
  return {
    title: doc.meta.title,
    description: doc.meta.description,
    alternates: { canonical: `/articles/${doc.meta.slug}/` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getArticle(slug);
  if (!doc) notFound();

  const { meta, body, toc } = doc;

  return (
    <article className="py-12 lg:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Artigos", path: "/articles/" },
          { name: meta.title, path: `/articles/${meta.slug}/` },
        ])}
      />

      <Container>
        <nav aria-label="Trilha de navegação" className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-brand-600">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link href="/articles/" className="hover:text-brand-600">
            Artigos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{meta.title}</span>
        </nav>

        <header className="max-w-3xl border-b border-line/70 pb-10">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            {meta.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">{meta.title}</h1>
          <p className="mt-5 text-lg text-ink-soft">{meta.description}</p>
          {meta.publishedAt ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Atualizado em {formatDate(meta.publishedAt)}
            </p>
          ) : null}
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
          <div>
            <Markdown>{body}</Markdown>
          </div>

          {toc.length > 1 ? (
            <aside className="order-first h-fit rounded-2xl border border-line/70 bg-surface p-6 lg:order-0 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-brand-900">Neste artigo</h2>
              <nav aria-label="Seções do artigo" className="mt-4">
                <ol className="space-y-2 text-sm">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a className="text-ink-soft hover:text-brand-600" href={`#${item.id}`}>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
        </div>

        <Card className="mt-12 rounded-2xl border-brand-300 bg-info-50 shadow-soft">
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Encontrou um foco?</h2>
              <p className="mt-1 text-ink-soft">
                Registre a denúncia para ajudar o CCZ a orientar a vistoria.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/reports/" size="lg">
                Denunciar um foco
              </ButtonLink>
              <ButtonLink href={`tel:${site.contact.phoneRaw}`} variant="outline" size="lg">
                <Icon name="phone" size={18} /> Ligar para o CCZ
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </Container>
    </article>
  );
}
