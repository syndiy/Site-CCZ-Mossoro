import { API_BASE, getToken, requisitar } from "./apiClient";
import type { PaginatedLogsResponse } from "../types/audit";

export async function listarAuditoriaAdmin(page = 0, size = 15): Promise<PaginatedLogsResponse> {
  const res = await requisitar(`${API_BASE}/audit?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) {
    throw new Error(res.status === 403 ? "Só o administrador pode ver a trilha de auditoria." : "Não foi possível carregar a trilha de auditoria.");
  }
  return (await res.json()) as PaginatedLogsResponse;
}
