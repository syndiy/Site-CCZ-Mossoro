"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Markdown } from "@/components/shared/markdown";
import { formatDate } from "@/lib/format-date";
import { API_BASE, getImageUrl } from "@/lib/api/apiClient";
import type { ColecaoConteudo, ConteudoCompletoResponse } from "@/lib/types/conteudo";

/**
 * Lê uma publicação direto do backend.
 *
 * As publicações que existiam no build têm sua própria página estática, com o
 * texto no HTML. Esta rota atende as que nasceram depois dele: sem ela, o que a
 * equipe publica hoje só abriria no próximo deploy.
 */
function Publicacao({ colecao, rotulo, rota }: { colecao: ColecaoConteudo; rotulo: string; rota: string }) {
  const slug = useSearchParams().get("slug") ?? "";
  const [doc, setDoc] = useState<ConteudoCompletoResponse | null>(null);
  const [estado, setEstado] = useState<"carregando" | "pronto" | "erro">("carregando");

  useEffect(() => {
    let ativo = true;

    void (async () => {
      if (!slug || !API_BASE) {
        if (ativo) setEstado("erro");
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/conteudo/${colecao}/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("nao encontrado");
        const dados = (await res.json()) as ConteudoCompletoResponse;
        if (!ativo) return;
        setDoc(dados);
        setEstado("pronto");
      } catch {
        if (ativo) setEstado("erro");
      }
    })();

    return () => {
      ativo = false;
    };
  }, [colecao, slug]);

  if (estado === "carregando") {
    return <p className="py-20 text-center text-ink-soft">Carregando a publicação...</p>;
  }

  if (estado === "erro" || !doc) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-soft">Não encontramos esta publicação.</p>
        <Link href={`/${rota}/`} className="mt-4 inline-block font-medium text-brand-600 underline">
          Ver todas as publicações
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12 lg:py-20">
      <Container>
        <nav aria-label="Trilha de navegação" className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-brand-600">
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${rota}/`} className="hover:text-brand-600">
            {rotulo}
          </Link>
        </nav>

        <header className="max-w-3xl">
          {doc.dataPublicacao ? (
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              {formatDate(doc.dataPublicacao.slice(0, 10))}
            </span>
          ) : null}
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">{doc.titulo}</h1>
        </header>

        {doc.imagemCapaUrl ? (
          // Imagem vinda do backend, fora do domínio do site; o next/image esta
          // com unoptimized, entao a tag simples e equivalente aqui.
          <img
            src={getImageUrl(doc.imagemCapaUrl)}
            alt={doc.titulo}
            className="mt-10 w-full rounded-2xl object-cover"
          />
        ) : null}

        <div className="prose-ccz mt-10 max-w-3xl">
          <Markdown>{doc.corpo}</Markdown>
        </div>
      </Container>
    </article>
  );
}

export function PublicacaoAoVivo(props: { colecao: ColecaoConteudo; rotulo: string; rota: string }) {
  return (
    <Suspense fallback={<p className="py-20 text-center text-ink-soft">Carregando...</p>}>
      <Publicacao {...props} />
    </Suspense>
  );
}
