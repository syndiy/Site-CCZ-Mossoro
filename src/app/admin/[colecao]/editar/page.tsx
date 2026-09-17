"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConteudoForm } from "@/components/forms/conteudo-form";
import { buscarConteudoPorSlug } from "@/lib/api/conteudoApi";
import type { ColecaoConteudo, ConteudoCompletoResponse } from "@/lib/types/conteudo";

interface PageProps {
  params: Promise<{ colecao: string }>;
}

/**
 * O slug vem no query string, e nao no caminho, porque o site e exportado
 * estaticamente: as publicacoes nascem no backend depois do build, entao nao
 * existe lista de slugs para o Next pre-gerar.
 */
function EditarConteudo({ colecao }: { colecao: ColecaoConteudo }) {
  const slug = useSearchParams().get("slug") ?? "";

  const [dados, setDados] = useState<ConteudoCompletoResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      if (!slug) {
        if (ativo) {
          setErro("Publicação não informada.");
          setCarregando(false);
        }
        return;
      }
      try {
        const item = await buscarConteudoPorSlug(colecao, slug);
        if (ativo) setDados(item);
      } catch (err) {
        if (ativo) {
          setErro(err instanceof Error ? err.message : "Erro ao carregar conteúdo.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregar();
    return () => {
      ativo = false;
    };
  }, [colecao, slug]);

  if (carregando) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Carregando dados da publicação...
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="py-12 text-center text-sm text-destructive font-medium">
        {erro || "Conteúdo não encontrado."}
      </div>
    );
  }

  return <ConteudoForm colecao={colecao} dadosIniciais={dados} />;
}

export default function EditarConteudoPage({ params }: PageProps) {
  const { colecao } = use(params) as { colecao: ColecaoConteudo };

  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-muted-foreground">
          Carregando dados da publicação...
        </div>
      }
    >
      <EditarConteudo colecao={colecao} />
    </Suspense>
  );
}
