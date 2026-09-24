import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/layout/button-link";
import { JsonLd } from "@/components/shared/json-ld";
import { Icon } from "@/components/shared/icon";
import { Card, CardContent } from "@/components/ui/card";
import { breadcrumbJsonLd, contentArticleJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/cms";
import { site } from "@/lib/site";

interface ConteudoCompletoResponse {
  titulo: string;
  slug: string;
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

async function getArtigoBackend(slug: string): Promise<ConteudoCompletoResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${baseUrl}/conteudo/artigos/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`[API Error] Status: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Erro ao conectar com o backend:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artigo = await getArtigoBackend(slug);

  if (!artigo || artigo.status !== "PUBLICADO") {
    return { title: "Artigo não encontrado" };
  }

  const descricaoLimpa = artigo.corpo
    ? artigo.corpo.replace(/<[^>]*>/g, "").slice(0, 160) + "..."
    : "Artigo do Centro de Controle de Zoonoses de Mossoró.";

  const dataPublicacaoOuModificacao = artigo.dataPublicacao || artigo.dataModificacao || undefined;

  return {
    title: `${artigo.titulo} | CCZ Mossoró`,
    description: descricaoLimpa,
    alternates: { canonical: `/articles/${artigo.slug}/` },
    openGraph: {
      type: "article",
      title: artigo.titulo,
      description: descricaoLimpa,
      url: `/articles/${artigo.slug}/`,
      publishedTime: dataPublicacaoOuModificacao,
      images: artigo.imagemCapaUrl ? [artigo.imagemCapaUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: artigo.titulo,
      description: descricaoLimpa,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const artigo = await getArtigoBackend(slug);

  if (!artigo || artigo.status !== "PUBLICADO") {
    notFound();
  }

  const dataExibicao = artigo.dataPublicacao || artigo.dataModificacao || "";
  const coverUrl = artigo.imagemCapaUrl ?? null;
  const descricaoTexto = artigo.corpo
    ? artigo.corpo.replace(/<[^>]*>/g, "").slice(0, 160)
    : "";

  return (
    <article className="py-12 lg:py-20">
      <JsonLd
        data={contentArticleJsonLd({
          type: "Article",
          title: artigo.titulo,
          description: descricaoTexto,
          path: `/articles/${artigo.slug}/`,
          cover: coverUrl,
          publishedAt: dataExibicao,
          tags: [], // Adicionado array de tags exigido pelo Schema
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Artigos", path: "/articles/" },
          { name: artigo.titulo, path: `/articles/${artigo.slug}/` },
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
          <span className="text-ink">{artigo.titulo}</span>
        </nav>

        <header className="max-w-3xl border-b border-line/70 pb-10">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            Educação em saúde
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">{artigo.titulo}</h1>
          
          {dataExibicao ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Atualizado em {formatDate(dataExibicao)}
            </p>
          ) : null}
        </header>

        {artigo.imagemCapaUrl && (
          <div className="relative my-10 aspect-video w-full overflow-hidden rounded-2xl bg-info-50 shadow-soft">
            <Image
              src={artigo.imagemCapaUrl}
              alt={`Capa do artigo: ${artigo.titulo}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-10 max-w-3xl">
          <div
            className="prose prose-lg max-w-none leading-relaxed text-ink-soft 
                       prose-headings:font-bold prose-headings:text-ink 
                       prose-a:text-brand-600 hover:prose-a:text-brand-700 
                       prose-img:rounded-xl prose-strong:text-ink"
            dangerouslySetInnerHTML={{ __html: artigo.corpo }}
          />
        </div>

        <Card className="mt-16 rounded-2xl border-brand-300 bg-info-50 shadow-soft">
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">Encontrou um foco?</h2>
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