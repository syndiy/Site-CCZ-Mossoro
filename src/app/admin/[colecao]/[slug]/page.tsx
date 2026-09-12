"use client";

import { use, useEffect, useState } from "react";
import { ConteudoForm } from "@/components/forms/conteudo-form";
import { buscarConteudoPorSlug } from "@/lib/api/conteudoApi";
import type { ColecaoConteudo, ConteudoCompletoResponse } from "@/lib/types/conteudo";

interface PageProps {
  params: Promise<{ colecao: string; slug: string }>;
}

export default function EditarConteudoPage({ params }: PageProps) {
  const { colecao, slug } = use(params) as { colecao: ColecaoConteudo; slug: string };

  const [dados, setDados] = useState<ConteudoCompletoResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const item = await buscarConteudoPorSlug(colecao, slug);
        setDados(item);
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar conteúdo.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
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