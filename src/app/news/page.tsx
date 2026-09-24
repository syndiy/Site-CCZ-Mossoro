import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { ContentCard, ContentGrid } from "@/components/cards/content-card";
import { breadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Notícias",
  description:
    "Campanhas, mutirões e avisos do Centro de Controle de Zoonoses de Mossoró. Acompanhe as ações e serviços na sua cidade.",
  alternates: { canonical: "/news/" },
};

// Interface alinhada com ConteudoListResponse do Spring Boot
interface NoticiaResponse {
  slug: string;
  titulo: string;
  resumo?: string | null;
  imagemCapaUrl?: string | null;
  status: "RASCUNHO" | "PUBLICADO";
  dataModificacao?: string;
  dataPublicacao?: string;
  modificadoPor?: string;
}

// Busca apenas notícias com status PUBLICADO no backend
async function getNoticiasBackend(): Promise<NoticiaResponse[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    const res = await fetch(`${baseUrl}/conteudo/noticias?status=PUBLICADO`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[API Error] Status: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Erro ao conectar com a API de notícias:", error);
    return [];
  }
}

export default async function NoticiasPage() {
  const noticias = await getNoticiasBackend();
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
            {/* Notícia em Destaque (Primeira da Lista) */}
            {destaque ? (
              <Link
                href={`/news/${destaque.slug}/`}
                className="group mt-12 grid gap-6 overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-soft transition hover:border-brand-300 hover:shadow-md md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-info-50 md:aspect-auto">
                  {destaque.imagemCapaUrl ? (
                    <Image
                      src={destaque.imagemCapaUrl}
                      alt={`Capa da notícia: ${destaque.titulo}`}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-8 text-sm text-ink-soft/60">
                      Sem imagem de capa
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-6 md:p-10">
                  {(destaque.dataPublicacao || destaque.dataModificacao) && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                      {formatDate(destaque.dataPublicacao || destaque.dataModificacao || "")}
                    </span>
                  )}
                  <h2 className="mt-2 text-2xl font-bold text-ink group-hover:text-brand-700 md:text-3xl">
                    {destaque.titulo}
                  </h2>
                  {destaque.resumo && (
                    <p className="mt-3 text-ink-soft">{destaque.resumo}</p>
                  )}
                </div>
              </Link>
            ) : null}

            {/* Demais Notícias da Lista */}
            {restante.length > 0 ? (
              <div className="mt-6">
                <ContentGrid>
                  {restante.map((noticia) => {
                    const dataExibicao = noticia.dataPublicacao || noticia.dataModificacao;
                    return (
                      <li key={noticia.slug} className="flex w-full">
                        <ContentCard
                          href={`/news/${noticia.slug}/`}
                          title={noticia.titulo}
                          summary={noticia.resumo || ""}
                          cover={noticia.imagemCapaUrl || null}
                          coverAlt={`Capa da notícia: ${noticia.titulo}`}
                          eyebrow="Notícia"
                          publishedAt={dataExibicao}
                        />
                      </li>
                    );
                  })}
                </ContentGrid>
              </div>
            ) : null}
          </>
        )}
      </Container>
    </div>
  );
}