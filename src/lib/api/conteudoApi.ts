import { API_BASE, getToken } from "./apiClient";
import { 
  ColecaoConteudo, 
  ConteudoListResponse, 
  ConteudoCompletoResponse, 
  ConteudoRequest 
} from "../types/conteudo";

export async function listarConteudo(colecao: ColecaoConteudo): Promise<ConteudoListResponse[]> {
  const res = await fetch(`${API_BASE}/conteudo/${colecao}`);
  if (!res.ok) throw new Error(`Erro ao listar ${colecao}.`);
  return (await res.json()) as ConteudoListResponse[];
}

export async function buscarConteudoPorSlug(colecao: ColecaoConteudo, slug: string): Promise<ConteudoCompletoResponse> {
  const res = await fetch(`${API_BASE}/conteudo/${colecao}/${slug}`);
  if (!res.ok) throw new Error("Conteúdo não encontrado.");
  return (await res.json()) as ConteudoCompletoResponse;
}

export async function criarConteudo(colecao: ColecaoConteudo, payload: ConteudoRequest): Promise<ConteudoListResponse> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/conteudo/${colecao}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Erro ao criar registro em ${colecao}.`);
  return (await res.json()) as ConteudoListResponse;
}

export async function editarConteudo(colecao: ColecaoConteudo, slug: string, payload: ConteudoRequest): Promise<ConteudoListResponse> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/conteudo/${colecao}/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao editar conteúdo.");
  return (await res.json()) as ConteudoListResponse;
}

export async function alterarStatusConteudo(colecao: ColecaoConteudo, slug: string, acao: "publicar" | "despublicar"): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/conteudo/${colecao}/${slug}/${acao}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Erro ao ${acao} conteúdo.`);
}

export async function excluirConteudo(colecao: ColecaoConteudo, slug: string): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/conteudo/${colecao}/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao excluir conteúdo.");
}

export async function atualizarDestaques(slugs: string[]): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/conteudo/destaques`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ slugsDestaque: slugs }),
  });
  if (!res.ok) throw new Error("Erro ao atualizar a ordem dos destaques.");
}