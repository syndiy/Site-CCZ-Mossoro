"use client";

import { useEffect, useState } from "react";
import { HeroNewsBackground, type HeroSlide } from "./hero-news";
import { formatDate } from "@/lib/format-date";
import { noticiasPublicadas, publicacoesAoVivoAtivas } from "@/lib/publicacoes";

/**
 * Mantém o carrossel da home em dia com o que a equipe publicou.
 *
 * Começa exibindo os slides que vieram no build — é o que já está no HTML, então
 * o visitante não espera nada. Se houver publicações mais novas no backend, elas
 * entram na frente. Falha na API não muda nada do que já está na tela.
 */
export function HeroSlidesAoVivo({
  slidesDoBuild,
  fallback,
  fallbackAlt,
  children,
}: {
  slidesDoBuild: HeroSlide[];
  fallback: string;
  fallbackAlt: string;
  children?: React.ReactNode;
}) {
  const [slides, setSlides] = useState(slidesDoBuild);

  useEffect(() => {
    if (!publicacoesAoVivoAtivas()) return;
    let ativo = true;

    void (async () => {
      const noticias = await noticiasPublicadas();
      if (!ativo || noticias.length === 0) return;

      const jaNoBuild = new Set(slidesDoBuild.map((s) => s.slug));
      const novos: HeroSlide[] = noticias
        // Só entram no carrossel as que a equipe marcou em "Destaques da home",
        // o mesmo critério que o build usa para o conteúdo de content/.
        .filter((n) => n.home && !jaNoBuild.has(n.slug))
        .sort((a, b) => (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999))
        .slice(0, 3)
        .map((n) => ({
          slug: n.slug,
          href: `/news/ver/?slug=${encodeURIComponent(n.slug)}`,
          title: n.title,
          excerpt: n.excerpt,
          publishedAt: n.publishedAt,
          publishedLabel: formatDate(n.publishedAt),
          cover: n.cover,
          coverAlt: n.coverAlt,
        }));

      if (novos.length > 0) setSlides([...novos, ...slidesDoBuild].slice(0, 5));
    })();

    return () => {
      ativo = false;
    };
  }, [slidesDoBuild]);

  return (
    <HeroNewsBackground slides={slides} fallback={fallback} fallbackAlt={fallbackAlt}>
      {children}
    </HeroNewsBackground>
  );
}
