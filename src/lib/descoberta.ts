/**
 * Arquivos que ajudam buscadores e assistentes de IA a encontrar e entender o
 * portal: feed RSS das publicações e os textos llms.txt / llms-full.txt, que
 * descrevem o site em Markdown simples (https://llmstxt.org).
 * Tudo é gerado no build, a partir do mesmo conteúdo das páginas.
 */
import { getAllArticles, getAllNews, getArticle, getNews } from "@/lib/cms";
import { servicoPaginas, type Bloco } from "@/lib/services-content";
import { site } from "@/lib/site";

type Publicacao = {
  tipo: "Notícia" | "Artigo";
  titulo: string;
  url: string;
  descricao: string;
  data: string;
  capa: string | null;
};

const absoluta = (caminho: string) => (/^https?:\/\//.test(caminho) ? caminho : `${site.url}${caminho}`);

export function publicacoes(): Publicacao[] {
  return [
    ...getAllNews().map((n) => ({
      tipo: "Notícia" as const,
      titulo: n.title,
      url: `${site.url}/news/${n.slug}/`,
      descricao: n.excerpt,
      data: n.publishedAt,
      capa: n.cover ? absoluta(n.cover) : null,
    })),
    ...getAllArticles().map((a) => ({
      tipo: "Artigo" as const,
      titulo: a.title,
      url: `${site.url}/articles/${a.slug}/`,
      descricao: a.description,
      data: a.publishedAt,
      capa: a.cover ? absoluta(a.cover) : null,
    })),
  ].sort((a, b) => b.data.localeCompare(a.data));
}

const xml = (texto: string) =>
  texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Datas do conteúdo são dias; o meio-dia de Mossoró evita trocar de dia no fuso UTC.
const dataRss = (dia: string) => (dia ? new Date(`${dia}T12:00:00-03:00`).toUTCString() : new Date().toUTCString());

const tipoImagem = (url: string) =>
  url.endsWith(".png") ? "image/png" : url.endsWith(".webp") ? "image/webp" : url.endsWith(".avif") ? "image/avif" : "image/jpeg";

export function feedRss(): string {
  const itens = publicacoes()
    .map(
      (p) => `    <item>
      <title>${xml(p.titulo)}</title>
      <link>${xml(p.url)}</link>
      <guid isPermaLink="true">${xml(p.url)}</guid>
      <description>${xml(p.descricao)}</description>
      <category>${p.tipo === "Notícia" ? "Notícias" : "Educação em saúde"}</category>
      <pubDate>${dataRss(p.data)}</pubDate>${p.capa ? `\n      <enclosure url="${xml(p.capa)}" type="${tipoImagem(p.capa)}" length="0" />` : ""}
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(site.legalName)}</title>
    <link>${site.url}/</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${xml(`Notícias e artigos de educação em saúde do ${site.legalName}.`)}</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itens}
  </channel>
</rss>
`;
}

function blocoMarkdown(bloco: Bloco): string {
  if (bloco.tipo === "texto") return bloco.texto;
  if (bloco.tipo === "lista") return bloco.itens.map((item) => `- ${item}`).join("\n");
  return bloco.itens.map((item, i) => `${i + 1}. ${item}`).join("\n");
}

function cabecalho(): string {
  return `# ${site.legalName} (${site.name})

> ${site.description}

Portal oficial do ${site.legalName}, órgão da ${site.parentOrg} (${site.department}). Atende a população de ${site.address.city}/${site.address.state}.

- Endereço: ${site.address.street}, ${site.address.district}, ${site.address.city}/${site.address.state}, CEP ${site.address.zip}
- Telefone: ${site.contact.phone}
- E-mail: ${site.contact.email}
- Atendimento: ${site.hours.label}
- Denúncias (focos do mosquito, maus-tratos, animais peçonhentos, roedores): ${site.url}/reports/ — o cidadão recebe um número de protocolo para acompanhar.`;
}

/** Índice curto do site para assistentes de IA. */
export function llmsTxt(): string {
  const servicos = servicoPaginas.map((s) => `- [${s.title}](${site.url}/services/${s.slug}/): ${s.metaDescription}`);
  const lista = (tipo: Publicacao["tipo"]) =>
    publicacoes()
      .filter((p) => p.tipo === tipo)
      .map((p) => `- [${p.titulo}](${p.url}): ${p.descricao}${p.data ? ` (${p.data})` : ""}`);
  return `${cabecalho()}

## Serviços

${servicos.join("\n")}

## Notícias

${lista("Notícia").join("\n") || "- Nenhuma notícia publicada."}

## Artigos de educação em saúde

${lista("Artigo").join("\n") || "- Nenhum artigo publicado."}

## Outras páginas

- [Sobre o CCZ](${site.url}/about/)
- [Contato](${site.url}/contact/)
- [Fazer ou acompanhar uma denúncia](${site.url}/reports/)
- [Privacidade e LGPD](${site.url}/privacy/)
- [Conteúdo completo em texto](${site.url}/llms-full.txt)
- [Feed RSS](${site.url}/feed.xml)
- [Mapa do site](${site.url}/sitemap.xml)
`;
}

/** Conteúdo completo (serviços, notícias e artigos) em um único Markdown. */
export function llmsFullTxt(): string {
  const servicos = servicoPaginas.map(
    (s) => `## ${s.title}

Fonte: ${site.url}/services/${s.slug}/

${s.intro}

${s.secoes.map((secao) => `### ${secao.titulo}\n\n${secao.blocos.map(blocoMarkdown).join("\n\n")}`).join("\n\n")}`,
  );
  const textos = [
    ...getAllNews().map((n) => ({ tipo: "Notícia", url: `${site.url}/news/${n.slug}/`, doc: getNews(n.slug) })),
    ...getAllArticles().map((a) => ({ tipo: "Artigo", url: `${site.url}/articles/${a.slug}/`, doc: getArticle(a.slug) })),
  ]
    .filter((t) => t.doc)
    .map(
      (t) => `## ${t.doc!.meta.title}

${t.tipo} · publicada em ${t.doc!.meta.publishedAt || "data não informada"} · Fonte: ${t.url}

${t.doc!.body.trim()}`,
    );
  return `${cabecalho()}

# Serviços

${servicos.join("\n\n")}

# Notícias e artigos

${textos.join("\n\n") || "Nenhuma publicação."}
`;
}
