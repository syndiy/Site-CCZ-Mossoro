import { fetchWithTimeout } from "./fetch-with-timeout";

export type TipoDenuncia =
  | "MAUS_TRATOS"
  | "BARATAS"
  | "RATOS"
  | "MORCEGOS"
  | "ANIMAIS_SINANTROPICOS";

export type StatusDenuncia =
  | "EM_ANALISE"
  | "VISITA_REALIZADA"
  | "CONCLUIDA"
  | "NAO_RESOLVIDA";

export interface DenunciaResponse {
  idDenuncia: number;
  protocolo: string;
  dataCriacao: string;
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  descricao?: string;
  nomeDenunciante: string | null;
  numeroTelefone: string | null;
  imagem: string | null;
  idEndereco: number;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

export interface DenunciaUpdateRequest {
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  numeroTelefone: string | null;
  nomeDenunciante: string | null;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  localidade: string;
  uf: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface DenunciaPayload {
  tipoDeDenuncia: TipoDenuncia;
  descricao: string;
  nomeDenunciante: string;
  numeroTelefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  imagem: File | null;
  latitude?: number;
  longitude?: number;
}

// DTOs para Autorização de Servidor (AllowedEmployee)
export interface CreateAllowedEmployeeDto {
  cpf: string;
  name: string;
}

export interface AllowedEmployeeResponse {
  id?: number;
  cpf: string;
  name: string;
}

export type Denuncia = DenunciaResponse;
export type DenunciaDetalhe = DenunciaResponse;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getImageUrl = (path: string | null): string => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const baseUrl = API_BASE.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};

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

export async function loginUsuario(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Credenciais inválidas.");
  const data = await res.json();
  return data.token;
}

export async function listarDenunciasAdmin(
  pagina: number = 0,
  tamanho: number = 10
): Promise<PageResponse<DenunciaResponse>> {
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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

/**
 * Cadastra um novo CPF na lista de funcionários permitidos (AllowedEmployee).
 * Apenas o Administrador pode executar essa rota.
 */
export async function cadastrarFuncionarioPermitido(
  payload: CreateAllowedEmployeeDto
): Promise<AllowedEmployeeResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");

  // CORREÇÃO AQUI: Mudado de /allowed-employees para /allowedEmployee
  const res = await fetch(`${API_BASE}/allowedEmployee`, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Apenas o Administrador pode liberar cadastros de funcionários.");
    }
    const erroData = await res.json().catch(() => null);
    throw new Error(erroData?.message || "Erro ao autorizar funcionário.");
  }

  return (await res.json()) as AllowedEmployeeResponse;
}

/**
 * Lista todos os funcionários permitidos (AllowedEmployees)
 */
export async function listarFuncionariosPermitidos(): Promise<AllowedEmployeeResponse[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");

  const res = await fetch(`${API_BASE}/allowedEmployee`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar a lista de servidores.");
  
  // Dependendo de como seu backend retorna, pode ser um array direto ou paginado. 
  // Assumindo que retorna um array (List<AllowedEmployee>)
  return (await res.json()) as AllowedEmployeeResponse[];
}

export async function atualizarFuncionarioPermitido(
  id: number,
  payload: CreateAllowedEmployeeDto
): Promise<AllowedEmployeeResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");

  const res = await fetch(`${API_BASE}/allowedEmployee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Erro ao atualizar os dados do servidor.");
  
  return (await res.json()) as AllowedEmployeeResponse;
}