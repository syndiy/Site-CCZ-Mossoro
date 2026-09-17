"use client";

import { useEffect, useState } from "react";
import { ContentCard, ContentGrid } from "@/components/cards/content-card";
import { formatDate } from "@/lib/format-date";
import {
  artigosPublicados,
  noticiasPublicadas,
  publicacoesAoVivoAtivas,
} from "@/lib/publicacoes";

type Item = {
  slug: string;
  title: string;
  cover: string | null;
  coverAlt: string;
  publishedAt: string;
  resumo: string;
};

/**
 * Mostra o que a equipe publicou depois do último build.
 *
 * As publicações que já entraram no build são servidas como HTML estático pela
 * própria página; aqui aparecem só as que ainda não estão lá, para o portal
 * refletir o trabalho da equipe sem esperar um novo deploy. Sem API
 * configurada, ou com ela fora do ar, o componente não renderiza nada e a
 * página continua exatamente como foi publicada.
 */
export function PublicacoesRecentes({
  colecao,
  slugsNoBuild,
}: {
  colecao: "noticias" | "artigos";
  slugsNoBuild: string[];
}) {
  const [itens, setItens] = useState<Item[]>([]);

  useEffect(() => {
    if (!publicacoesAoVivoAtivas()) return;
    let ativo = true;

    void (async () => {
      const lista =
        colecao === "noticias"
          ? (await noticiasPublicadas()).map((n) => ({ ...n, resumo: n.excerpt }))
          : (await artigosPublicados()).map((a) => ({ ...a, resumo: a.description }));

      const conhecidos = new Set(slugsNoBuild);
      const novos = lista.filter((item) => !conhecidos.has(item.slug));
      if (ativo) setItens(novos);
    })();

    return () => {
      ativo = false;
    };
  }, [colecao, slugsNoBuild]);

  if (itens.length === 0) return null;

  const rota = colecao === "noticias" ? "news" : "articles";

  return (
    <section className="mt-12" aria-label="Publicações recentes">
      <h2 className="text-2xl font-bold">Publicado recentemente</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Estas publicações acabaram de entrar no ar.
      </p>
      <div className="mt-6">
        <ContentGrid>
          {itens.map((item) => (
            <li key={item.slug}>
              <ContentCard
                href={`/${rota}/ver/?slug=${encodeURIComponent(item.slug)}`}
                title={item.title}
                summary={item.resumo}
                cover={item.cover}
                coverAlt={item.coverAlt}
                publishedAt={formatDate(item.publishedAt)}
              />
            </li>
          ))}
        </ContentGrid>
      </div>
    </section>
  );
}
