import { describe, expect, it } from "vitest";
import { contentArticleJsonLd } from "@/lib/seo";

describe("SEO de conteudo", () => {
  it("gera dados estruturados para noticias e artigos", () => {
    const data = contentArticleJsonLd({
      type: "NewsArticle",
      title: "Mutirao de vacinacao",
      description: "Atendimento gratuito.",
      path: "/news/mutirao-de-vacinacao/",
      cover: "/img/vacinacao.jpg",
      publishedAt: "2026-08-20",
      tags: ["vacinacao"],
    });

    expect(data["@type"]).toBe("NewsArticle");
    expect(data.url).toContain("/news/mutirao-de-vacinacao/");
    expect(data.image[0]).toContain("/img/vacinacao.jpg");
    expect(data.datePublished).toBe("2026-08-20");
    expect(data.dateModified).toBe("2026-08-20");
  });

  it("usa a data de modificacao e aceita capa com endereco completo", () => {
    const data = contentArticleJsonLd({
      type: "Article",
      title: "Dengue",
      description: "Prevencao.",
      path: "/articles/dengue/",
      cover: "https://cdn.exemplo.org/capa.png",
      publishedAt: "2026-08-01",
      updatedAt: "2026-09-25",
      section: "Educação em saúde",
      tags: [],
    });
    expect(data.dateModified).toBe("2026-09-25");
    expect(data.image).toEqual(["https://cdn.exemplo.org/capa.png"]);
    expect(data.articleSection).toBe("Educação em saúde");
    expect(data.keywords).toBeUndefined();
  });
});
