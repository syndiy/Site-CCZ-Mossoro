import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const OUT = join(process.cwd(), "out");
const BACKEND = { host: "localhost", port: Number(process.env.BACKEND_PORT ?? 8085) };
const PORT = Number(process.env.PORT ?? 4000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
};

function isBackendPath(path) {
  return path === "/denuncia" || path.startsWith("/denuncia/");
}

function proxy(req, res) {
  const options = {
    host: BACKEND.host,
    port: BACKEND.port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${BACKEND.host}:${BACKEND.port}` },
  };
  const proxied = http.request(options, (backendRes) => {
    res.writeHead(backendRes.statusCode ?? 502, backendRes.headers);
    backendRes.pipe(res);
  });
  proxied.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end(`Backend indisponível: ${err.message}`);
  });
  req.pipe(proxied);
}

/**
 * Os payloads RSC do Next sao pedidos com ponto separando os segmentos
 * (`__next.news.$d$slug.__PAGE__.txt`) mas gravados no disco com barra
 * (`__next.news/$d$slug/__PAGE__.txt`). Traduz um no outro.
 */
function rscCandidate(path) {
  const corte = path.lastIndexOf("/");
  const dir = path.slice(0, corte);
  const nome = path.slice(corte + 1);
  if (!nome.startsWith("__next.") || !nome.endsWith(".txt")) return null;

  const partes = nome.slice(0, -".txt".length).split(".");
  if (partes.length < 3) return null;

  const raiz = `${partes[0]}.${partes[1]}`;
  const resto = partes.slice(2);
  return join(OUT, dir, raiz, ...resto.slice(0, -1), `${resto[resto.length - 1]}.txt`);
}

function contentType(file) {
  // Payload do roteador do Next, nao texto puro (robots.txt continua text/plain).
  // O nome do arquivo pode ser so `__PAGE__.txt`: quem marca e a pasta `__next.*`.
  if (extname(file) === ".txt") {
    const nome = file.split(/[\\/]/).pop() ?? "";
    if (file.includes("__next") || nome === "index.txt") return "text/x-component";
  }
  return MIME[extname(file)] ?? "application/octet-stream";
}

function serveStatic(req, res) {
  const path = decodeURIComponent(req.url.split("?")[0]);
  const candidates = [
    join(OUT, path),
    join(OUT, path, "index.html"),
    join(OUT, `${path}.html`),
    rscCandidate(path),
  ].filter(Boolean);
  const file = candidates.find((f) => existsSync(f) && statSync(f).isFile());

  if (!file) {
    const naoEncontrado = join(OUT, "404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    // Durante um rebuild o out/ some por alguns segundos: responder texto puro
    // em vez de estourar o servidor inteiro num ENOENT.
    if (existsSync(naoEncontrado)) createReadStream(naoEncontrado).pipe(res);
    else res.end("<h1>404</h1>");
    return;
  }
  res.writeHead(200, { "Content-Type": contentType(file) });
  const stream = createReadStream(file);
  stream.on("error", () => res.end());
  stream.pipe(res);
}

http
  .createServer((req, res) => {
    if (isBackendPath(req.url.split("?")[0])) return proxy(req, res);
    serveStatic(req, res);
  })
  .listen(PORT, () => {
    console.log(`Front + proxy no ar em http://localhost:${PORT}`);
    console.log(`  /denuncia* -> backend http://${BACKEND.host}:${BACKEND.port}`);
  });
