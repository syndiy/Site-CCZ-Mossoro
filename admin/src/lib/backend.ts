/**
 * Cliente do backend Spring (SiteInstitucionalCCZ-BackEnd).
 *
 * Os tipos abaixo espelham os DTOs do backend com os mesmos nomes de campo,
 * para o contrato ficar rastreavel quando ele mudar do lado de la.
 */

export type RoleName = "ROLE_ADMINISTRATOR" | "ROLE_EDITOR";

export type LoginUserDto = { email: string; password: string };

export type RecoveryJwtTokenDto = { token: string };

export type CreateUserDto = {
  username: string;
  password: string;
  email: string;
  phone: string;
  CPF: string;
  role?: RoleName;
};

export type UpdateUserDto = {
  id: number;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  CPF?: string;
};

export type AllowedEmployee = {
  id: number;
  cpf: string;
  name: string;
  registered: boolean;
};

export type CreateAllowedEmployeeDto = { cpf: string; name: string };

export type UpdateAllowedEmployeeDto = AllowedEmployee;

export const apiBaseUrl = () => (process.env.CCZ_API_URL ?? "").replace(/\/+$/, "");

export const backendAuthEnabled = () => Boolean(apiBaseUrl());

export class BackendError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = init;

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...rest,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new BackendError("Nao foi possivel falar com o servidor da equipe.", 0);
  }

  if (response.status === 401 || response.status === 403) {
    throw new BackendError("Credenciais invalidas ou sem permissao.", response.status);
  }
  if (!response.ok) {
    throw new BackendError(`O servidor respondeu com erro (HTTP ${response.status}).`, response.status);
  }
  if (response.status === 204) return undefined as T;

  const body = await response.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

/** POST /users/login — unico endpoint publico do backend. */
export function login(dto: LoginUserDto): Promise<RecoveryJwtTokenDto> {
  return request<RecoveryJwtTokenDto>("/users/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/** POST /users — exige sessao ativa; um admin cadastra o usuario do funcionario liberado. */
export function createUser(token: string, dto: CreateUserDto): Promise<void> {
  return request<void>("/users", { method: "POST", token, body: JSON.stringify(dto) });
}

/** PUT /users — restrito a ROLE_ADMINISTRATOR. */
export function updateUser(token: string, dto: UpdateUserDto): Promise<unknown> {
  return request<unknown>("/users", { method: "PUT", token, body: JSON.stringify(dto) });
}

/** DELETE /users/{id} — restrito a ROLE_ADMINISTRATOR. */
export function deleteUser(token: string, id: number): Promise<void> {
  return request<void>(`/users/${id}`, { method: "DELETE", token });
}

/** GET /allowedEmployee — restrito a ROLE_ADMINISTRATOR. */
export function listAllowedEmployees(token: string): Promise<AllowedEmployee[]> {
  return request<AllowedEmployee[]>("/allowedEmployee", { token });
}

/** POST /allowedEmployee — libera um CPF para se cadastrar. */
export function createAllowedEmployee(
  token: string,
  dto: CreateAllowedEmployeeDto,
): Promise<AllowedEmployee> {
  return request<AllowedEmployee>("/allowedEmployee", {
    method: "POST",
    token,
    body: JSON.stringify(dto),
  });
}

/** PUT /allowedEmployee */
export function updateAllowedEmployee(
  token: string,
  dto: UpdateAllowedEmployeeDto,
): Promise<AllowedEmployee> {
  return request<AllowedEmployee>("/allowedEmployee", {
    method: "PUT",
    token,
    body: JSON.stringify(dto),
  });
}

/** DELETE /allowedEmployee/{id} */
export function deleteAllowedEmployee(token: string, id: number): Promise<void> {
  return request<void>(`/allowedEmployee/${id}`, { method: "DELETE", token });
}

/* ------------------------------------------------------------------ *
 * Denuncias — DenunciaController, no backend.
 * ------------------------------------------------------------------ */

export type TipoDenuncia =
  | "MAUS_TRATOS"
  | "BARATAS"
  | "RATOS"
  | "MORCEGOS"
  | "ANIMAIS_SINANTROPICOS";

export type StatusDenuncia = "EM_ANALISE" | "VISITA_REALIZADA" | "CONCLUIDA" | "NAO_RESOLVIDA";

export type DenunciaResponse = {
  idDenuncia: number;
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  numeroTelefone: string | null;
  nomeDenunciante: string | null;
  idEndereco: number | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  localidade: string | null;
  uf: string | null;
  /** Data URI base64 montada pelo backend. So vem no GET por id. */
  imagem: string | null;
};

/**
 * O mapper do backend ignora campo nulo, entao da para mandar so o que muda.
 */
export type DenunciaUpdateRequest = Partial<{
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  numeroTelefone: string;
  nomeDenunciante: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  localidade: string;
  uf: string;
}>;

/** GET /denuncia — a listagem nao traz a foto. */
export function listDenuncias(token: string): Promise<DenunciaResponse[]> {
  return request<DenunciaResponse[]>("/denuncia", { token });
}

/** GET /denuncia/{id} — traz a foto embutida como data URI. */
export function getDenuncia(token: string, id: number): Promise<DenunciaResponse> {
  return request<DenunciaResponse>(`/denuncia/${id}`, { token });
}

/** PUT /denuncia/{id} */
export function updateDenuncia(
  token: string,
  id: number,
  dto: DenunciaUpdateRequest,
): Promise<DenunciaResponse> {
  return request<DenunciaResponse>(`/denuncia/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(dto),
  });
}
