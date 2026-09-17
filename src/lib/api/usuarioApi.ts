import { API_BASE, getToken } from "./apiClient";
import {
  CreateUserDto,
  UserResponse,
  CreateAllowedEmployeeDto,
  AllowedEmployeeResponse,
  UpdateAllowedEmployeeDto,
} from "../types/usuario";

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

export async function criarUsuario(payload: CreateUserDto): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, role: "ROLE_EDITOR" }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message ||
        "Erro ao realizar cadastro. Verifique se o CPF está autorizado."
    );
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
    const erroData = await res.json().catch(() => null);
    throw new Error(erroData?.message || "Erro ao autorizar funcionário.");
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

  if (!res.ok) throw new Error("Erro ao buscar a lista de servidores.");
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

  if (!res.ok) throw new Error("Erro ao atualizar os dados do servidor.");
  return (await res.json()) as AllowedEmployeeResponse;
}