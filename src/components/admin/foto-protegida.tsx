"use client";

import { useEffect, useState } from "react";
import { getImageUrl, getToken, requisitar } from "@/lib/api/apiClient";

/**
 * Foto enviada pelo cidadão. O backend só a entrega para a equipe logada, e uma
 * tag <img> comum não envia o token; por isso a imagem é baixada com o login e
 * exibida a partir da memória do navegador.
 */
export function FotoProtegida({ caminho, alt }: { caminho: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    let objeto: string | null = null;
    void (async () => {
      try {
        const res = await requisitar(getImageUrl(caminho), { headers: { Authorization: `Bearer ${getToken()}` } });
        if (!res.ok) throw new Error(String(res.status));
        objeto = URL.createObjectURL(await res.blob());
        if (ativo) setUrl(objeto);
      } catch {
        if (ativo) setErro(true);
      }
    })();
    return () => {
      ativo = false;
      if (objeto) URL.revokeObjectURL(objeto);
    };
  }, [caminho]);

  if (erro) {
    return <p className="text-sm text-destructive">Não foi possível carregar a foto. Tente fechar e abrir a ocorrência de novo.</p>;
  }
  if (!url) {
    return (
      <div role="status" className="h-48 w-full animate-pulse rounded-md bg-muted motion-reduce:animate-none">
        <span className="sr-only">Carregando foto…</span>
      </div>
    );
  }
  return (
    <>
      <img src={url} alt={alt} className="max-h-72 w-full rounded-md object-contain" />
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2.5 text-xs font-medium text-primary hover:underline">
        Abrir em tamanho original ↗
      </a>
    </>
  );
}
