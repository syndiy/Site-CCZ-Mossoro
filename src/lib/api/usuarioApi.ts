import { API_BASE, getToken } from "./apiClient";
import {
  CreateUserDto,
  UserResponse,
  CreateAllowedEmployeeDto,
  AllowedEmployeeResponse,
  UpdateAllowedEmployeeDto,
} from "../types/usuario";

// Helper para extrair a mensagem de erro retornada pelo Spring Boot
async function extrairMensagemErro(res: Response, mensagemPadrao: string): Promise<string> {
  try {
    const errorData = await res.json();
    return errorData?.message || errorData?.error || mensagemPadrao;
  } catch {
    return mensagemPadrao;
  }
}

export async function loginUsuario(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const mensagem = await extrairMensagemErro(res, "Credenciais inválidas.");
    throw new Error(mensagem);
  }

  const data = await res.json();
  return data.token;
}

export async function criarUsuario(payload: CreateUserDto): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, role: "ROLE_EDITOR" }),
  });

  if (!res.ok) {
    const mensagem = await extrairMensagemErro(
      res,
      "Erro ao realizar cadastro. Verifique se o CPF está autorizado."
    );
    throw new Error(mensagem);
  }

  return (await res.json()) as UserResponse;
}

export async function cadastrarFuncionarioPermitido(
  payload: CreateAllowedEmployeeDto
): Promise<AllowedEmployeeResponse> {
  const token = getToken();
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");

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
    const mensagem = await extrairMensagemErro(res, "Erro ao autorizar funcionário.");
    throw new Error(mensagem);
  }

  return (await res.json()) as AllowedEmployeeResponse;
}

export async function listarFuncionariosPermitidos(): Promise<AllowedEmployeeResponse[]> {
  const token = getToken();
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");

  const res = await fetch(`${API_BASE}/allowedEmployee`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const mensagem = await extrairMensagemErro(res, "Erro ao buscar a lista de servidores.");
    throw new Error(mensagem);
  }

  return (await res.json()) as AllowedEmployeeResponse[];
}

export async function atualizarFuncionarioPermitido(
  id: number,
  payload: UpdateAllowedEmployeeDto
): Promise<AllowedEmployeeResponse> {
  const token = getToken();
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");

  const res = await fetch(`${API_BASE}/allowedEmployee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Apenas o Administrador pode atualizar cadastros de funcionários.");
    }
    const mensagem = await extrairMensagemErro(res, "Erro ao atualizar os dados do servidor.");
    throw new Error(mensagem);
  }

  return (await res.json()) as AllowedEmployeeResponse;
}