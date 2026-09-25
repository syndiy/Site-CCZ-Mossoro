// Portal no endereço *.pages.dev: repassa cada requisição para a VM, que continua
// sendo a única origem (site, painel e API). Existe porque redes com filtro de
// categoria (FortiGate da faculdade) barram o sslip.io, mas liberam o pages.dev.
// O Worker não consegue buscar um IP direto, por isso a origem é o nome sslip.io.
const ORIGEM = "https://134-65-250-41.sslip.io";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const destino = new URL(url.pathname + url.search, ORIGEM);
    const resposta = await fetch(new Request(destino, request), { redirect: "manual" });

    // Redirecionamentos da origem apontariam para o sslip.io, que o filtro bloqueia.
    const location = resposta.headers.get("Location");
    if (!location) return resposta;
    const headers = new Headers(resposta.headers);
    headers.set("Location", location.replace(/^https?:\/\/134-65-250-41\.sslip\.io/, url.origin));
    return new Response(resposta.body, { status: resposta.status, statusText: resposta.statusText, headers });
  },
};
