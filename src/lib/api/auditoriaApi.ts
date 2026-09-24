import { API_BASE, getToken } from "./apiClient";
import type { PaginatedLogsResponse } from "@/lib/types/audit";

export async function listarAuditoriaAdmin(
  page = 0,
  size = 10
): Promise<PaginatedLogsResponse> {
  const token = getToken();

  const response = await fetch(`${API_BASE}/audit?page=${page}&size=${size}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar os registros de auditoria (${response.status}).`);
  }

  return response.json();
}