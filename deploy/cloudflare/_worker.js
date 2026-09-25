// Portal num endereço da Cloudflare (*.pages.dev / *.workers.dev): repassa cada
// requisição para a VM, que continua sendo a única origem (site, painel e API).
// Existe porque redes com filtro de categoria (FortiGate da faculdade) barram o
// sslip.io, mas liberam os domínios da Cloudflare. O Worker não consegue buscar
// um IP direto, por isso a origem é o nome sslip.io.
const ORIGEM = "https://134-65-250-41.sslip.io";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const destino = new URL(url.pathname + url.search, ORIGEM);

    // Para o navegador, o painel e a API estão na mesma origem deste endereço.
    // Só essas requisições viram "da origem" para o CORS do Spring; as de
    // outros sites seguem com a Origin delas e continuam sendo recusadas.
    const headers = new Headers(request.headers);
    if (headers.get("Origin") === url.origin) headers.set("Origin", ORIGEM);

    const resposta = await fetch(destino, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
      redirect: "manual",
    });

    // Redirecionamentos da origem apontariam para o sslip.io, que o filtro bloqueia.
    const location = resposta.headers.get("Location");
    if (!location) return resposta;
    const saida = new Headers(resposta.headers);
    saida.set("Location", location.replace(/^https?:\/\/134-65-250-41\.sslip\.io/, url.origin));
    return new Response(resposta.body, { status: resposta.status, statusText: resposta.statusText, headers: saida });
  },
};
