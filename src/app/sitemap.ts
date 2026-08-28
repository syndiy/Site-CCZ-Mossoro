import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { servicoPaginas } from "@/lib/services-content";
import { getAllArticles, getAllNews } from "@/lib/cms";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; lastModified?: string }[] = [
    ...[
      "/",
      "/services/",
      "/articles/",
      "/news/",
      "/reports/",
      "/about/",
      "/contact/",
      "/privacy/",
      "/accessibility/",
    ].map((path) => ({ path })),
    ...servicoPaginas.map((service) => ({ path: `/services/${service.slug}/` })),
    ...getAllArticles().map((article) => ({
      path: `/articles/${article.slug}/`,
      lastModified: article.publishedAt || undefined,
    })),
    ...getAllNews().map((news) => ({
      path: `/news/${news.slug}/`,
      lastModified: news.publishedAt || undefined,
    })),
  ];

  return routes.map(({ path, lastModified }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
