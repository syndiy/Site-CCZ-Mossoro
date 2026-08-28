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
    expect(data.image).toContain("/img/vacinacao.jpg");
    expect(data.datePublished).toBe("2026-08-20");
  });
});
