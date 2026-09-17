// Sem valor definido fica vazia de proposito: o fallback para localhost faria o
// site publicado procurar a API na maquina de quem visita.
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export const getImageUrl = (path: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
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
  try {
    return await fetch(input, init);
  } catch {
    throw new Error("Não foi possível falar com o servidor. Verifique se a API está no ar.");
  }
}
