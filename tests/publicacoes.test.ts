import { describe, expect, it, vi, afterEach } from "vitest";
import { mesclarPorSlug } from "@/lib/publicacoes";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
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
    // API_BASE e lido uma vez no import do modulo, entao o ambiente precisa
    // estar definido antes dele: por isso o vi.resetModules + import dinamico.
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.teste");
    vi.resetModules();
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
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.teste");
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("sem rede");
    }) as unknown as typeof fetch);

    const { noticiasPublicadas } = await import("@/lib/publicacoes");

    await expect(noticiasPublicadas()).resolves.toEqual([]);
  });
});

 it("resolve capa relativa usando a API e preserva ordem de destaque", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.teste");
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      json: async () => [{ titulo: "Campanha", slug: "campanha", status: "PUBLICADO", dataModificacao: "2026-09-17", imagemCapaUrl: "/midia/capa.png", ordemDestaque: 2 }],
    })));
    const { noticiasPublicadas } = await import("@/lib/publicacoes");
    const [noticia] = await noticiasPublicadas();
    expect(noticia.cover).toBe("https://api.teste/midia/capa.png");
    expect(noticia.home).toBe(true);
    expect(noticia.homeOrder).toBe(2);
  });
