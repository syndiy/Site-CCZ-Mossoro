import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { servicoPaginas } from "@/lib/services-content";
import { getAllArticles, getAllNews } from "@/lib/cms";

export const dynamic = "force-static";

const absoluta = (caminho: string) => (/^https?:\/\//.test(caminho) ? caminho : `${site.url}${caminho}`);

type Rota = {
  path: string;
  lastModified?: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
  images?: string[];
};

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Rota[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/news/", changeFrequency: "daily", priority: 0.9 },
    { path: "/articles/", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services/", changeFrequency: "monthly", priority: 0.9 },
    { path: "/reports/", changeFrequency: "monthly", priority: 0.9 },
    ...["/about/", "/contact/", "/privacy/", "/accessibility/"].map((path) => ({ path, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...servicoPaginas.map((service) => ({ path: `/services/${service.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getAllArticles().map((article) => ({
      path: `/articles/${article.slug}/`,
      lastModified: article.updatedAt || article.publishedAt || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: article.cover ? [absoluta(article.cover)] : undefined,
    })),
    ...getAllNews().map((news) => ({
      path: `/news/${news.slug}/`,
      lastModified: news.updatedAt || news.publishedAt || undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: news.cover ? [absoluta(news.cover)] : undefined,
    })),
  ];

  return routes.map(({ path, lastModified, changeFrequency = "monthly", priority = 0.8, images }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
    ...(images ? { images } : {}),
  }));
}
