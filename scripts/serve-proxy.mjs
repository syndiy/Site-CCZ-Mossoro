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

function serveStatic(req, res) {
  const path = decodeURIComponent(req.url.split("?")[0]);
  const candidates = [
    join(OUT, path),
    join(OUT, path, "index.html"),
    join(OUT, `${path}.html`),
  ];
  const file = candidates.find((f) => existsSync(f) && statSync(f).isFile());

  if (!file) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    createReadStream(join(OUT, "404.html")).pipe(res);
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
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
