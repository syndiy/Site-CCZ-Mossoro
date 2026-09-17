import { describe, expect, it, vi, afterEach } from "vitest";
import { mesclarPorSlug } from "@/lib/publicacoes";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("mesclarPorSlug", () => {
  it("nao repete a publicacao que ja veio no build", () => {
    const doBuild = [{ slug: "mutirao", publishedAt: "2026-09-01" }];
    const daApi = [{ slug: "mutirao", publishedAt: "2026-09-10" }];

    const juntos = mesclarPorSlug(doBuild, daApi);

    expect(juntos).toHaveLength(1);
    // A versao da API e a mais recente daquele texto, entao ela prevalece.
    expect(juntos[0].publishedAt).toBe("2026-09-10");
  });

  it("mostra a mais recente primeiro", () => {
    const juntos = mesclarPorSlug(
      [{ slug: "antiga", publishedAt: "2026-01-05" }],
      [{ slug: "nova", publishedAt: "2026-09-16" }],
    );

    expect(juntos.map((i) => i.slug)).toEqual(["nova", "antiga"]);
  });
});

describe("publicacoes vindas da API", () => {
  it("ignora rascunhos e devolve apenas o que esta publicado", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.teste");
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => [
        { titulo: "No ar", slug: "no-ar", status: "PUBLICADO", dataModificacao: "2026-09-10" },
        { titulo: "Rascunho", slug: "rascunho", status: "RASCUNHO", dataModificacao: "2026-09-11" },
      ],
    })) as unknown as typeof fetch);

    const { noticiasPublicadas } = await import("@/lib/publicacoes");
    const lista = await noticiasPublicadas();

    expect(lista.map((n) => n.slug)).toEqual(["no-ar"]);
  });

  it("devolve lista vazia quando a API esta fora do ar, para o site nao quebrar", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("sem rede");
    }) as unknown as typeof fetch);

    const { noticiasPublicadas } = await import("@/lib/publicacoes");

    await expect(noticiasPublicadas()).resolves.toEqual([]);
  });
});
