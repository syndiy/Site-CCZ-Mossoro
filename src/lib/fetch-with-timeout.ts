export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (err) {
    // Sem isto a pessoa recebe "Failed to fetch" ou "AbortError" na tela.
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("O servidor demorou para responder. Tente novamente em instantes.");
    }
    throw new Error("Não foi possível falar com o servidor. Verifique sua conexão.");
  } finally {
    globalThis.clearTimeout(timer);
  }
}
