/**
 * Publicações vindas do backend, lidas no navegador.
 *
 * O site é exportado estaticamente: o HTML entregue traz o que existia em
 * content/ no momento do build. Estas funções buscam, já no navegador, o que a
 * equipe publicou depois disso, para o portal não ficar parado até o próximo
 * build. Se a API estiver fora do ar, o visitante continua vendo o conteúdo do
 * build — por isso toda falha aqui devolve lista vazia em vez de estourar.
 */
import { API_BASE } from "@/lib/api/apiClient";
import type { ArticleMeta, NewsMeta } from "@/lib/cms";
import type { ColecaoConteudo, ConteudoListResponse } from "@/lib/types/conteudo";

export const publicacoesAoVivoAtivas = () => Boolean(API_BASE);

type ItemPublicado = ConteudoListResponse & {
  imagemCapaUrl?: string | null;
  resumo?: string | null;
  dataPublicacao?: string | null;
  ordemDestaque?: number | null;
};

function base(item: ItemPublicado) {
  return {
    slug: item.slug,
    title: item.titulo,
    cover: item.imagemCapaUrl || null,
    coverAlt: item.titulo,
    publishedAt: (item.dataPublicacao || item.dataModificacao || "").slice(0, 10),
    tags: [] as string[],
    draft: false,
    home: item.ordemDestaque != null,
    homeOrder: item.ordemDestaque ?? null,
  };
}

async function listar(colecao: ColecaoConteudo): Promise<ItemPublicado[]> {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/conteudo/${colecao}`);
    if (!res.ok) return [];
    const dados = (await res.json()) as ItemPublicado[];
    return Array.isArray(dados) ? dados.filter((i) => i.status === "PUBLICADO") : [];
  } catch {
    return [];
  }
}

export async function noticiasPublicadas(): Promise<NewsMeta[]> {
  const itens = await listar("noticias");
  return itens.map((item) => ({ ...base(item), excerpt: item.resumo || "" }));
}

export async function artigosPublicados(): Promise<ArticleMeta[]> {
  const itens = await listar("artigos");
  return itens.map((item) => ({
    ...base(item),
    description: item.resumo || "",
    eyebrow: "",
    featured: item.ordemDestaque != null,
  }));
}

/**
 * Junta o que veio do build com o que veio da API, sem repetir slug. O que a
 * API devolve tem prioridade, porque é a versão mais recente daquele texto.
 */
export function mesclarPorSlug<T extends { slug: string; publishedAt: string }>(
  doBuild: T[],
  daApi: T[],
): T[] {
  const porSlug = new Map<string, T>();
  for (const item of doBuild) porSlug.set(item.slug, item);
  for (const item of daApi) porSlug.set(item.slug, item);
  return [...porSlug.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
