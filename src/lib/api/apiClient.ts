// Produção usa o proxy HTTP do nginx; desenvolvimento pode apontar para o Spring.
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL?.trim() || "/api").replace(/\/+$/, "");

export const getImageUrl = (path: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (API_BASE.startsWith("/") && path.startsWith(`${API_BASE}/`)) return path;
  const baseUrl = API_BASE.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

/**
 * Traduz as falhas de rede do fetch. Sem isto o editor mostra "Failed to fetch",
 * que nao diz nada a quem esta publicando; o problema quase sempre e a API fora
 * do ar ou o endereco errado em NEXT_PUBLIC_API_URL.
 */
export async function requisitar(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(30000) });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new Error("O servidor demorou para responder. Tente novamente.");
    }
    throw new Error("Não foi possível falar com o servidor. Verifique se a API está no ar.");
  }
  if (response.status === 401 && new Headers(init?.headers).has("Authorization")) {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("ccz-session-expired"));
    throw new Error("Sua sessão expirou. Entre novamente no painel.");
  }
  return response;
}
