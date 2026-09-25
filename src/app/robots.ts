import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// Fora do índice: painel, login e as rotas provisórias de publicações recém-criadas
// (o endereço definitivo delas é /news/<slug>/ e /articles/<slug>/).
const bloqueadas = ["/admin/", "/login/", "/cadastro/", "/news/ver/", "/articles/ver/"];

// Buscadores e assistentes de IA liberados de forma explícita: é informação
// pública de saúde, e quanto mais fontes a citarem corretamente, melhor.
const robosDeIa = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: bloqueadas },
      { userAgent: robosDeIa, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: bloqueadas },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
