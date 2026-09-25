import { describe, expect, it } from "vitest";
import { feedRss, llmsFullTxt, llmsTxt } from "@/lib/descoberta";
import { enderecoImagem, paraMarkdown, resumir } from "../scripts/sincronizar-conteudo.mjs";

describe("descoberta por buscadores e IA", () => {
  it("gera um feed RSS valido com os servicos do site", () => {
    const rss = feedRss();
    expect(rss).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(rss).toContain('<rss version="2.0"');
    expect(rss).toContain("<language>pt-BR</language>");
    expect(rss).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });

  it("descreve o site para assistentes de IA", () => {
    const indice = llmsTxt();
    expect(indice.startsWith("# Centro de Controle de Zoonoses de Mossoró")).toBe(true);
    expect(indice).toContain("## Serviços");
    expect(indice).toContain("/services/vacinacao-antirrabica/");
    expect(llmsFullTxt()).toContain("# Serviços");
  });
});

describe("sincronizacao das publicacoes do painel", () => {
  it("resume o texto sem marcacao e corta em palavra inteira", () => {
    const texto = resumir("## Titulo\n\nO **CCZ** abre [vagas](https://x) para castracao gratuita de caes e gatos em toda a cidade de Mossoro.", 60);
    expect(texto).not.toMatch(/[#*[\]]/);
    expect(texto.length).toBeLessThanOrEqual(61);
    expect(texto.endsWith("…")).toBe(true);
  });

  it("aponta as imagens do painel para /api/midia", () => {
    expect(enderecoImagem("/midia/a.png")).toBe("/api/midia/a.png");
    expect(enderecoImagem("https://cdn.x/a.png")).toBe("https://cdn.x/a.png");
    expect(enderecoImagem(null)).toBeNull();
  });

  it("gera frontmatter seguro mesmo com dois-pontos e aspas no titulo", () => {
    const md = paraMarkdown(
      { titulo: 'Castração: "vagas" abertas', corpo: "Texto.", resumo: "", imagemCapaUrl: "/midia/c.avif", dataPublicacao: "2026-09-25T10:00:00", dataModificacao: "2026-09-26T08:00:00", ordemDestaque: 1 },
      { api: "noticias", tags: ["notícias"] },
    );
    expect(md).toContain('title: "Castração: \\"vagas\\" abertas"');
    expect(md).toContain('cover: "/api/midia/c.avif"');
    expect(md).toContain('publishedAt: "2026-09-25"');
    expect(md).toContain('updatedAt: "2026-09-26"');
    expect(md).toContain("home: true");
    expect(md).toContain('excerpt: "Texto."');
  });
});
