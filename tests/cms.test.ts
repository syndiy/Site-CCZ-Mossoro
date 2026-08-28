import { describe, expect, it } from "vitest";
import { getAllNews, getNews } from "@/lib/cms";

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
});
