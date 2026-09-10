"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { backendToken, sessionCookieName } from "@/lib/auth";
import { BackendError, updateDenuncia, type StatusDenuncia } from "@/lib/backend";

export type StatusState = { error?: string };

export async function alterarStatus(id: number, status: StatusDenuncia): Promise<StatusState> {
  const store = await cookies();
  const token = await backendToken(store.get(sessionCookieName)?.value);

  if (!token) {
    return { error: "Sua sessão expirou. Entre novamente para registrar a mudança." };
  }

  try {
    await updateDenuncia(token, id, { statusDenuncia: status });
  } catch (error) {
    if (error instanceof BackendError && error.status === 0) {
      return { error: "Servidor fora do ar. A mudança não foi registrada." };
    }
    if (error instanceof BackendError && (error.status === 401 || error.status === 403)) {
      return { error: "Você não tem permissão para mudar o andamento desta denúncia." };
    }
    return { error: "Não foi possível registrar a mudança. Tente de novo." };
  }

  revalidatePath("/denuncias");
  revalidatePath(`/denuncias/${id}`);
  return {};
}
