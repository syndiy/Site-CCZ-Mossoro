import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd, contentArticleJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/cms";

interface ConteudoCompletoResponse {
  titulo: string;
  slug: string;
  resumo?: string | null;
  corpo: string;
  imagemCapaUrl?: string | null;
  status: "RASCUNHO" | "PUBLICADO";
  ordemDestaque?: number | null;
  dataModificacao?: string;
  dataPublicacao?: string;
}

type Props = {
  params: Promise<{ slug: string }>;
};

// Busca os dados da notícia na API do Spring Boot
async function getNoticiaBackend(slug: string): Promise<ConteudoCompletoResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${baseUrl}/conteudo/noticias/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`[API Error] Status: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Erro ao conectar com a API de notícias:", error);
    return null;
  }
}

// SEO Dinâmico gerado via API
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBackend(slug);

  if (!noticia || noticia.status !== "PUBLICADO") {
    return { title: "Notícia não encontrada" };
  }

  const descricaoLimpa = noticia.resumo
    ? noticia.resumo
    : noticia.corpo.replace(/<[^>]*>/g, "").slice(0, 160) + "...";

  const dataPublicacaoOuModificacao = noticia.dataPublicacao || noticia.dataModificacao || undefined;

  return {
    title: `${noticia.titulo} | CCZ Mossoró`,
    description: descricaoLimpa,
    alternates: { canonical: `/news/${noticia.slug}/` },
    openGraph: {
      type: "article",
      title: noticia.titulo,
      description: descricaoLimpa,
      url: `/news/${noticia.slug}/`,
      publishedTime: dataPublicacaoOuModificacao,
      images: noticia.imagemCapaUrl ? [noticia.imagemCapaUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: noticia.titulo,
      description: descricaoLimpa,
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const noticia = await getNoticiaBackend(slug);

  // Redireciona para 404 se a notícia não existir no banco ou não estiver publicada
  if (!noticia || noticia.status !== "PUBLICADO") {
    notFound();
  }

  const dataExibicao = noticia.dataPublicacao || noticia.dataModificacao || "";
  const coverUrl = noticia.imagemCapaUrl ?? null;
  const descricaoTexto = noticia.resumo
    ? noticia.resumo
    : noticia.corpo.replace(/<[^>]*>/g, "").slice(0, 160);

  return (
    <article className="py-12 lg:py-20">
      {/* Schemas de SEO para Motores de Busca */}
      <JsonLd
        data={contentArticleJsonLd({
          type: "NewsArticle",
          title: noticia.titulo,
          description: descricaoTexto,
          path: `/news/${noticia.slug}/`,
          cover: coverUrl,
          publishedAt: dataExibicao,
          tags: [],
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Notícias", path: "/news/" },
          { name: noticia.titulo, path: `/news/${noticia.slug}/` },
        ])}
      />

      <Container>
        {/* Trilha de Navegação */}
        <nav aria-label="Trilha de navegação" className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-brand-600">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link href="/news/" className="hover:text-brand-600">
            Notícias
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{noticia.titulo}</span>
        </nav>

        {/* Cabeçalho */}
        <header className="max-w-3xl">
          {dataExibicao ? (
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              {formatDate(dataExibicao)}
            </span>
          ) : null}
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">{noticia.titulo}</h1>
          {noticia.resumo && (
            <p className="mt-5 text-lg text-ink-soft">{noticia.resumo}</p>
          )}
        </header>

        {/* Imagem de Capa */}
        {noticia.imagemCapaUrl ? (
          <div className="relative mt-8 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-line/70 bg-info-50 shadow-soft">
            <Image
              src={noticia.imagemCapaUrl}
              alt={`Capa da notícia: ${noticia.titulo}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : null}

        {/* Corpo do Texto (HTML vindo do Editor RichText) */}
        <div className="mt-10 max-w-3xl">
          <div
            className="prose prose-lg max-w-none leading-relaxed text-ink-soft 
                       prose-headings:font-bold prose-headings:text-ink 
                       prose-a:text-brand-600 hover:prose-a:text-brand-700 
                       prose-img:rounded-xl prose-strong:text-ink"
            dangerouslySetInnerHTML={{ __html: noticia.corpo }}
          />
        </div>

        {/* Botão de Voltar */}
        <div className="mt-12 max-w-3xl">
          <ButtonLink href="/news/" variant="outline">
            &larr; Voltar para as notícias
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}