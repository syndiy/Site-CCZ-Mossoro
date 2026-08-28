import type { Collection } from "@/lib/content";

export type WorkspaceEntry = {
  collection: Collection;
  slug: string;
  title: string;
  publishedAt: string;
  draft: boolean;
  cover: string | null;
  home: boolean;
  homeOrder: number | null;
};

export const collectionInfo: Record<Collection, { label: string; singular: string }> = {
  news: { label: "Noticias", singular: "noticia" },
  articles: { label: "Artigos", singular: "artigo" },
};

export function entryId(entry: WorkspaceEntry) {
  return `${entry.collection}:${entry.slug}`;
}

export function sortEntries(entries: WorkspaceEntry[]) {
  return [...entries].sort(
    (a, b) =>
      (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999) ||
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.title.localeCompare(b.title),
  );
}
