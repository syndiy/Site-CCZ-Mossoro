import { describe, expect, it } from "vitest";
import { getAllArticles, getAllNews, getNews } from "@/lib/cms";

describe("CMS publico", () => {
  it("nao expoe noticias marcadas como rascunho", () => {
    expect(getNews("cuidados-com-escorpioes")).toBeNull();
    expect(getAllNews().some((news) => news.slug === "cuidados-com-escorpioes")).toBe(false);
  });

  it("ordena o destaque da home pelo homeOrder", () => {
    const news = getAllNews().filter((item) => item.home);
    const ordered = [...news].sort(
      (left, right) => (left.homeOrder ?? 9999) - (right.homeOrder ?? 9999),
    );
    expect(ordered.map((item) => item.slug)).toEqual(
      expect.arrayContaining(news.map((item) => item.slug)),
    );
  });

  it("mantem metadados necessarios para busca e compartilhamento", () => {
    const documents = [...getAllArticles(), ...getAllNews()];

    expect(documents.length).toBeGreaterThan(0);
    for (const document of documents) {
      expect(document.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(document.title.trim().length).toBeGreaterThan(0);
      expect(document.cover).toMatch(/^\/img\/.+\.(avif|jpe?g|png|webp)$/i);
      expect(document.coverAlt.trim().length).toBeGreaterThan(0);
      expect(document.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(document.tags.length).toBeGreaterThan(0);
    }
  });
});
