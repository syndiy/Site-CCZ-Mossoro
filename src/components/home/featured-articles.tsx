import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/layout/button-link";
import { Reveal } from "@/components/shared/reveal";
import { ContentCard, ContentGrid } from "@/components/cards/content-card";
import { getFeaturedArticles } from "@/lib/cms";

export function FeaturedArticles() {
  const artigos = getFeaturedArticles();
  if (artigos.length === 0) return null;

  return (
    <section className="py-12 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Educação em saúde"
            title="Informação que protege sua família"
          />
        </Reveal>
        <ContentGrid>
          {artigos.map((artigo, index) => (
            <li key={artigo.slug}>
              <Reveal delay={index * 90} className="h-full">
                <ContentCard
                  href={`/articles/${artigo.slug}/`}
                  title={artigo.title}
                  summary={artigo.description}
                  cover={artigo.cover}
                  coverAlt={artigo.coverAlt}
                  eyebrow={artigo.eyebrow}
                />
              </Reveal>
            </li>
          ))}
        </ContentGrid>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/articles/" variant="secondary" size="lg">
            Ver todos os artigos
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
