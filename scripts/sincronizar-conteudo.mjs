/**
 * Traz para o build as notícias e os artigos publicados pelo painel.
 *
 * O painel grava no backend, mas o portal é exportado como páginas estáticas.
 * Antes de cada build, este script busca na API o que está publicado e grava
 * como Markdown em content/.painel/, que o CMS lê junto com content/. Assim cada
 * publicação vira uma página HTML pronta, com metadados, dados estruturados e
 * entrada no sitemap, legível por buscadores e assistentes de IA que não
 * executam JavaScript.
 *
 * Uso: CONTENT_API_URL=https://endereco-da-api node scripts/sincronizar-conteudo.mjs
 * Sem CONTENT_API_URL, ou com a API fora do ar, o build segue com o que já existe.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = path.join(RAIZ, "content", ".painel");
const COLECOES = [
  { api: "noticias", pasta: "news", tags: ["notícias", "CCZ Mossoró"] },
  { api: "artigos", pasta: "articles", tags: ["educação em saúde", "CCZ Mossoró"] },
];

/** Texto corrido a partir do Markdown, para descrição quando não há resumo. */
export function resumir(markdown, limite = 158) {
  const texto = String(markdown ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (texto.length <= limite) return texto;
  const corte = texto.slice(0, limite);
  return `${corte.slice(0, Math.max(corte.lastIndexOf(" "), limite - 20)).trim()}…`;
}

/** Endereço da imagem como o site serve: /midia/x.png vira /api/midia/x.png. */
export function enderecoImagem(url) {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith("/api/")) return url;
  return `/api${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Converte uma publicação da API no Markdown que o CMS do site entende. */
export function paraMarkdown(item, colecao) {
  const descricao = item.resumo?.trim() || resumir(item.corpo);
  const destaque = item.ordemDestaque != null;
  const frontmatter = {
    title: item.titulo,
    ...(colecao.api === "noticias" ? { excerpt: descricao } : { description: descricao, eyebrow: "Educação em saúde", featured: true }),
    cover: enderecoImagem(item.imagemCapaUrl),
    coverAlt: item.titulo,
    publishedAt: String(item.dataPublicacao || item.dataModificacao || "").slice(0, 10),
    updatedAt: String(item.dataModificacao || item.dataPublicacao || "").slice(0, 10),
    tags: colecao.tags,
    home: destaque,
    ...(destaque ? { homeOrder: item.ordemDestaque } : {}),
    origem: "painel",
  };
  // JSON é YAML válido: evita problemas com dois-pontos, aspas e acentos nos títulos.
  const linhas = Object.entries(frontmatter)
    .filter(([, valor]) => valor !== null && valor !== undefined && valor !== "")
    .map(([chave, valor]) => `${chave}: ${JSON.stringify(valor)}`);
  return `---\n${linhas.join("\n")}\n---\n\n${String(item.corpo ?? "").trim()}\n`;
}

async function buscar(url) {
  const resposta = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!resposta.ok) throw new Error(`${url} respondeu ${resposta.status}`);
  return resposta.json();
}

async function sincronizar(api) {
  const saida = [];
  for (const colecao of COLECOES) {
    const lista = await buscar(`${api}/conteudo/${colecao.api}`);
    for (const resumo of lista.filter((item) => item.status === "PUBLICADO")) {
      const completo = await buscar(`${api}/conteudo/${colecao.api}/${encodeURIComponent(resumo.slug)}`);
      saida.push({ pasta: colecao.pasta, slug: resumo.slug, conteudo: paraMarkdown({ ...resumo, ...completo }, colecao) });
    }
  }
  // Só troca a pasta depois de buscar tudo: uma falha no meio não apaga o que havia.
  fs.rmSync(DESTINO, { recursive: true, force: true });
  for (const { pasta, slug, conteudo } of saida) {
    const dir = path.join(DESTINO, pasta);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${slug}.md`), conteudo, "utf8");
  }
  return saida.length;
}

const executadoDireto = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (executadoDireto) {
  const api = process.env.CONTENT_API_URL?.trim().replace(/\/+$/, "");
  if (!api) {
    console.warn("[conteudo] CONTENT_API_URL não definido: o build usa só o que já está em content/.");
  } else {
    try {
      const total = await sincronizar(api);
      console.log(`[conteudo] ${total} publicações do painel trazidas para o build.`);
    } catch (erro) {
      console.warn(`[conteudo] Não foi possível sincronizar (${erro.message}). O build segue com o conteúdo anterior.`);
    }
  }
}
