import { API_BASE, getToken } from "./apiClient";
import { fetchWithTimeout } from "../fetch-with-timeout";
import { PageResponse } from "../types/common";
import {
  DenunciaResponse,
  DenunciaPayload,
  DenunciaUpdateRequest,
  StatusDenuncia,
} from "../types/denuncia";

export function responseToUpdateRequest(
  data: DenunciaResponse,
  novoStatus?: StatusDenuncia
): DenunciaUpdateRequest {
  return {
    tipoDeDenuncia: data.tipoDeDenuncia,
    statusDenuncia: novoStatus ?? data.statusDenuncia,
    nomeDenunciante: data.nomeDenunciante,
    numeroTelefone: data.numeroTelefone,
    logradouro: data.rua,
    numero: data.numero,
    complemento: data.complemento,
    bairro: data.bairro,
    cep: data.cep,
    localidade: data.cidade,
    uf: data.estado,
  };
}

export async function criarDenuncia(payload: DenunciaPayload): Promise<DenunciaResponse> {
  const form = new FormData();
  form.append("tipoDeDenuncia", payload.tipoDeDenuncia);
  form.append("descricao", payload.descricao);
  form.append("statusDenuncia", "EM_ANALISE");
  form.append("nomeDenunciante", payload.nomeDenunciante);
  form.append("numeroTelefone", payload.numeroTelefone);
  form.append("cep", payload.cep);
  form.append("rua", payload.logradouro);
  form.append("numero", payload.numero);
  form.append("complemento", payload.complemento);
  form.append("bairro", payload.bairro);
  form.append("cidade", payload.localidade);
  form.append("estado", payload.uf);

  if (payload.latitude && payload.longitude) {
    form.append("latitude", String(payload.latitude));
    form.append("longitude", String(payload.longitude));
  }
  if (payload.imagem) {
    form.append("imagem", payload.imagem);
  }

  const res = await fetchWithTimeout(`${API_BASE}/denuncia`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Falha ao registrar denúncia (HTTP ${res.status}).`);
  }
  return (await res.json()) as DenunciaResponse;
}

export async function buscarDenunciaPorProtocolo(protocolo: string): Promise<DenunciaResponse | null> {
  const res = await fetchWithTimeout(`${API_BASE}/denuncia/protocolo/${encodeURIComponent(protocolo)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erro na busca da denúncia.");
  return (await res.json()) as DenunciaResponse;
}

export const buscarDenuncia = buscarDenunciaPorProtocolo;

export async function listarDenunciasAdmin(
  pagina: number = 0,
  tamanho: number = 10
): Promise<PageResponse<DenunciaResponse>> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/denuncia?page=${pagina}&size=${tamanho}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Sessão expirada ou acesso não autorizado.");
  return (await res.json()) as PageResponse<DenunciaResponse>;
}

export async function atualizarDenunciaAdmin(
  idDenuncia: number,
  payload: DenunciaUpdateRequest
): Promise<DenunciaResponse> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/denuncia/${idDenuncia}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Falha ao atualizar registro no servidor.");
  return (await res.json()) as DenunciaResponse;
}