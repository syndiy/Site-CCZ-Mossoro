import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { ContentCard, ContentGrid } from "@/components/cards/content-card";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Artigos",
  description:
    "Conteúdos de educação em saúde do Centro de Controle de Zoonoses de Mossoró: prevenção de dengue, leishmaniose, zoonoses e proteção animal.",
  alternates: { canonical: "/articles/" },
};

// Interface alinhada com o DTO do Spring Boot
interface ArtigoResponse {
  slug: string;
  titulo: string;
  resumo: string;
  imagemCapaUrl?: string | null; // O backend já devolve a URL completa
  dataModificacao?: string;
  autor?: string;
}

async function getArtigosBackend(): Promise<ArtigoResponse[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    const res = await fetch(`${baseUrl}/conteudo/artigos?status=PUBLICADO`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[API Error] Status: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Erro de conexão com a API:", error);
    return [];
  }
}

export default async function ArtigosPage() {
  const artigos = await getArtigosBackend();

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
                <li key={artigo.slug} className="flex w-full">
                  <ContentCard
                    href={`/articles/${artigo.slug}/`}
                    title={artigo.titulo}
                    summary={artigo.resumo}
                    // Repassa a URL diretamente; o fallback cuida caso seja nulo
                    cover={artigo.imagemCapaUrl || null}
                    coverAlt={`Capa do artigo sobre ${artigo.titulo}`}
                    eyebrow="Artigo"
                    publishedAt={artigo.dataModificacao}
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