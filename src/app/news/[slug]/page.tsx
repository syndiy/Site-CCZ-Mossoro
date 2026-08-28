import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Markdown } from "@/components/shared/markdown";
import { breadcrumbJsonLd, contentArticleJsonLd } from "@/lib/seo";
import { getNews, getNewsSlugs, formatDate } from "@/lib/cms";

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getNews(slug);
  if (!doc) return {};
  return {
    title: doc.meta.title,
    description: doc.meta.excerpt,
    alternates: { canonical: `/news/${doc.meta.slug}/` },
    openGraph: {
      type: "article",
      title: doc.meta.title,
      description: doc.meta.excerpt,
      url: `/news/${doc.meta.slug}/`,
      publishedTime: doc.meta.publishedAt || undefined,
      tags: doc.meta.tags,
      images: doc.meta.cover ? [doc.meta.cover] : undefined,
    },
    twitter: { card: "summary_large_image", title: doc.meta.title, description: doc.meta.excerpt },
  };
}

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getNews(slug);
  if (!doc) notFound();

  const { meta, body } = doc;

  return (
    <article className="py-12 lg:py-20">
      <JsonLd
        data={contentArticleJsonLd({
          type: "NewsArticle",
          title: meta.title,
          description: meta.excerpt,
          path: `/news/${meta.slug}/`,
          cover: meta.cover,
          publishedAt: meta.publishedAt,
          tags: meta.tags,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Notícias", path: "/news/" },
          { name: meta.title, path: `/news/${meta.slug}/` },
        ])}
      />
      <Container>
        <nav aria-label="Trilha de navegação" className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-brand-600">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link href="/news/" className="hover:text-brand-600">
            Notícias
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{meta.title}</span>
        </nav>

        <header className="max-w-3xl">
          {meta.publishedAt ? (
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              {formatDate(meta.publishedAt)}
            </span>
          ) : null}
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">{meta.title}</h1>
          <p className="mt-5 text-lg text-ink-soft">{meta.excerpt}</p>
        </header>

        {meta.cover ? (
          <div className="relative mt-8 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-line/70 bg-info-50">
            <Image
              src={meta.cover}
              alt={meta.coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain p-8"
            />
          </div>
        ) : null}

        <div className="mt-10 max-w-3xl">
          <Markdown>{body}</Markdown>
        </div>

        <div className="mt-12 max-w-3xl">
          <ButtonLink href="/news/" variant="outline">
            ← Voltar para as notícias
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
