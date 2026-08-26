import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { servicoPaginas } from "@/lib/services-content";
import { getAllArticles, getAllNews } from "@/lib/cms";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/services/",
    "/articles/",
    "/news/",
    "/reports/",
    "/about/",
    "/contact/",
    ...servicoPaginas.map((s) => `/services/${s.slug}/`),
    ...getAllArticles().map((a) => `/articles/${a.slug}/`),
    ...getAllNews().map((n) => `/news/${n.slug}/`),
  ];

  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
