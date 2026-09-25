import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { formatDate } from "@/lib/format-date";

const CONTENT_ROOT = path.join(process.cwd(), "content");
// Publicações do painel, gravadas por scripts/sincronizar-conteudo.mjs antes do build.
const PAINEL_ROOT = path.join(CONTENT_ROOT, ".painel");

export type TocItem = { id: string; title: string };

type BaseMeta = {
  slug: string;
  title: string;
  cover: string | null;
  coverAlt: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  draft: boolean;
  home: boolean;
  homeOrder: number | null;
};

export type ArticleMeta = BaseMeta & {
  description: string;
  eyebrow: string;
  featured: boolean;
};

export type NewsMeta = BaseMeta & {
  excerpt: string;
};

export type Doc<Meta> = { meta: Meta; body: string; toc: TocItem[] };

function readDir(dir: string): { slug: string; raw: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.mdx?$/, ""),
      raw: fs.readFileSync(path.join(dir, file), "utf8"),
    }));
}

function readCollection(collection: string): { slug: string; raw: string }[] {
  const doPainel = readDir(path.join(PAINEL_ROOT, collection));
  const doPainelSlugs = new Set(doPainel.map((item) => item.slug));
  // Se o mesmo slug existir nos dois lugares, vale a versão do painel.
  return [...readDir(path.join(CONTENT_ROOT, collection)).filter((item) => !doPainelSlugs.has(item.slug)), ...doPainel];
}

function buildToc(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let insideFence = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) insideFence = !insideFence;
    if (insideFence) continue;
    const match = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const title = match[1].replace(/[*_`]/g, "").trim();
      items.push({ id: slugger.slug(title), title });
    }
  }
  return items;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function baseMeta(slug: string, data: Record<string, unknown>): BaseMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    cover: data.cover ? String(data.cover) : null,
    coverAlt: String(data.coverAlt ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    updatedAt: String(data.updatedAt ?? data.publishedAt ?? ""),
    tags: toStringArray(data.tags),
    draft: Boolean(data.draft),
    home: data.home === undefined ? Boolean(data.featured) : Boolean(data.home),
    homeOrder: Number.isFinite(Number(data.homeOrder)) ? Number(data.homeOrder) : null,
  };
}

function parseArticle(slug: string, raw: string): Doc<ArticleMeta> {
  const { data, content } = matter(raw);
  return {
    meta: {
      ...baseMeta(slug, data),
      home: data.home === undefined ? Boolean(data.featured) : Boolean(data.home),
      description: String(data.description ?? ""),
      eyebrow: String(data.eyebrow ?? "Educação em saúde"),
      featured: Boolean(data.featured),
    },
    body: content,
    toc: buildToc(content),
  };
}

function parseNews(slug: string, raw: string): Doc<NewsMeta> {
  const { data, content } = matter(raw);
  return {
    meta: {
      ...baseMeta(slug, data),
      home: data.home === undefined ? true : Boolean(data.home),
      excerpt: String(data.excerpt ?? ""),
    },
    body: content,
    toc: buildToc(content),
  };
}

const byDateDesc = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  b.publishedAt.localeCompare(a.publishedAt);

const isPublished = (meta: { draft: boolean }) => !meta.draft;

export function getAllArticles(): ArticleMeta[] {
  return readCollection("articles")
    .map(({ slug, raw }) => parseArticle(slug, raw).meta)
    .filter(isPublished)
    .sort(byDateDesc);
}

export function getFeaturedArticles(limit = 3): ArticleMeta[] {
  const published = getAllArticles();
  const featured = published.filter((article) => article.home);
  return featured
    .sort((a, b) => (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999) || byDateDesc(a, b))
    .slice(0, limit);
}

// Rotas estáticas: as publicadas. Rascunhos só entram quando não há nenhuma
// publicada, porque o export exige ao menos uma página; nesse caso respondem
// "não encontrado". Com publicações, endereços antigos dão 404 de verdade.
function slugsParaRotas(publicados: string[], collection: string): string[] {
  return publicados.length > 0 ? publicados : readCollection(collection).map(({ slug }) => slug);
}

export function getArticleSlugs(): string[] {
  return slugsParaRotas(getAllArticles().map(({ slug }) => slug), "articles");
}

export function getArticle(slug: string): Doc<ArticleMeta> | null {
  const found = readCollection("articles").find((item) => item.slug === slug);
  if (!found) return null;
  const doc = parseArticle(found.slug, found.raw);
  return doc.meta.draft ? null : doc;
}

export function getAllNews(): NewsMeta[] {
  return readCollection("news")
    .map(({ slug, raw }) => parseNews(slug, raw).meta)
    .filter(isPublished)
    .sort(byDateDesc);
}

export function getLatestNews(limit = 3): NewsMeta[] {
  const homeNews = getAllNews().filter((news) => news.home);
  return homeNews
    .sort((a, b) => (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999) || byDateDesc(a, b))
    .slice(0, limit);
}

export function getNewsSlugs(): string[] {
  return slugsParaRotas(getAllNews().map(({ slug }) => slug), "news");
}

export function getNews(slug: string): Doc<NewsMeta> | null {
  const found = readCollection("news").find((item) => item.slug === slug);
  if (!found) return null;
  const doc = parseNews(found.slug, found.raw);
  return doc.meta.draft ? null : doc;
}

export { formatDate };
