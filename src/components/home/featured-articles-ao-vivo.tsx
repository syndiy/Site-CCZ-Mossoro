"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ButtonLink } from "@/components/layout/button-link";
import { ContentCard, ContentGrid } from "@/components/cards/content-card";
import { artigosPublicados } from "@/lib/publicacoes";
import type { ArticleMeta } from "@/lib/cms";

type Card = ArticleMeta & { href: string };

// Artigos da home: os do build e os publicados pelo painel, sem repetir slug.
export function FeaturedArticlesAoVivo({ doBuild }: { doBuild: ArticleMeta[] }) {
  const [artigos, setArtigos] = useState<Card[]>(doBuild.map((a) => ({ ...a, href: `/articles/${a.slug}/` })));

  useEffect(() => {
    let ativo = true;
    void artigosPublicados().then((aoVivo) => {
      if (!ativo || aoVivo.length === 0) return;
      // O que já está no build tem página própria (melhor para busca); só o que
      // foi publicado depois do último build usa a rota provisória.
      const noBuild = new Set(doBuild.map((a) => a.slug));
      const novos = aoVivo.filter((a) => !noBuild.has(a.slug));
      if (novos.length === 0) return;
      setArtigos([
        ...novos.map((a) => ({ ...a, href: `/articles/ver/?slug=${encodeURIComponent(a.slug)}` })),
        ...doBuild.map((a) => ({ ...a, href: `/articles/${a.slug}/` })),
      ].slice(0, 3));
    });
    return () => { ativo = false; };
  }, [doBuild]);

  if (artigos.length === 0) return null;
  return (
    <section className="py-12 lg:py-24">
      <Container>
        <SectionHeading eyebrow="Educação em saúde" title="Informação que protege sua família" />
        <ContentGrid>
          {artigos.map((artigo) => (
            <li key={artigo.slug}>
              <ContentCard
                href={artigo.href}
                title={artigo.title}
                summary={artigo.description}
                cover={artigo.cover}
                coverAlt={artigo.coverAlt}
                eyebrow={artigo.eyebrow}
              />
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
