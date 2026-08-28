import { describe, expect, it } from "vitest";
import { collections, toFormValues, toPayload } from "../admin/src/lib/collections";

describe("contrato do editor", () => {
  it("usa home como fonte atual do destaque de artigos", () => {
    const values = toFormValues(collections.articles, {
      featured: false,
      home: true,
      title: "Artigo",
    });
    expect(values.featured).toBe(true);
  });

  it("normaliza tags antes de enviar ao endpoint", () => {
    const payload = toPayload(collections.news, {
      title: "Noticia",
      excerpt: "Resumo",
      cover: "",
      coverAlt: "",
      publishedAt: "2026-08-20",
      tags: "dengue, prevencao, dengue",
      home: true,
    });
    expect(payload.tags).toEqual(["dengue", "prevencao", "dengue"]);
  });
});
