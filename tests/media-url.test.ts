import { it, expect, vi, afterEach } from "vitest";
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
it("não duplica o prefixo da API ao salvar e reler uma capa", async () => {
  vi.stubEnv("NEXT_PUBLIC_API_URL", "/api"); vi.resetModules();
  const { getImageUrl } = await import("@/lib/api/apiClient");
  expect(getImageUrl("/midia/capa.png")).toBe("/api/midia/capa.png");
  expect(getImageUrl("/api/midia/capa.png")).toBe("/api/midia/capa.png");
});
