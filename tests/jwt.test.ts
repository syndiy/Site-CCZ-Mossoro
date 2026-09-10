import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyJwt } from "../admin/src/lib/jwt";

const SECRET = "4Z^XrroxR@dWxqf$mTTKwW$!@#qGr4P";
const ISSUER = "SiteInstitucionalCcz";

const b64url = (input: string | Buffer) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Reproduz o formato emitido pelo JwtTokenService do backend. */
function sign(
  payload: Record<string, unknown>,
  { secret = SECRET, alg = "HS256" }: { secret?: string; alg?: string } = {},
) {
  const head = b64url(JSON.stringify({ alg, typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(`${head}.${body}`).digest();
  return `${head}.${body}.${b64url(signature)}`;
}

const emAlgumasHoras = () => Math.floor(Date.now() / 1000) + 4 * 60 * 60;

describe("verificacao do token do backend", () => {
  it("aceita um token valido e devolve o e-mail do usuario", async () => {
    const token = sign({ iss: ISSUER, sub: "admin@ccz.gov.br", exp: emAlgumasHoras() });

    const claims = await verifyJwt(token, SECRET, ISSUER);

    expect(claims?.sub).toBe("admin@ccz.gov.br");
  });

  it("recusa token assinado com outro segredo", async () => {
    const token = sign(
      { iss: ISSUER, sub: "invasor@exemplo.com", exp: emAlgumasHoras() },
      { secret: "segredo-errado" },
    );

    expect(await verifyJwt(token, SECRET, ISSUER)).toBeNull();
  });

  it("recusa token adulterado depois de assinado", async () => {
    const token = sign({ iss: ISSUER, sub: "editor@ccz.gov.br", exp: emAlgumasHoras() });
    const [head, , signature] = token.split(".");
    const outroCorpo = b64url(
      JSON.stringify({ iss: ISSUER, sub: "admin@ccz.gov.br", exp: emAlgumasHoras() }),
    );

    expect(await verifyJwt(`${head}.${outroCorpo}.${signature}`, SECRET, ISSUER)).toBeNull();
  });

  it("recusa alg none, mesmo com corpo bem formado", async () => {
    const head = b64url(JSON.stringify({ alg: "none", typ: "JWT" }));
    const body = b64url(JSON.stringify({ iss: ISSUER, sub: "admin@ccz.gov.br", exp: emAlgumasHoras() }));

    expect(await verifyJwt(`${head}.${body}.`, SECRET, ISSUER)).toBeNull();
  });

  it("recusa token expirado", async () => {
    const token = sign({ iss: ISSUER, sub: "editor@ccz.gov.br", exp: Math.floor(Date.now() / 1000) - 1 });

    expect(await verifyJwt(token, SECRET, ISSUER)).toBeNull();
  });

  it("recusa token sem prazo de validade", async () => {
    const token = sign({ iss: ISSUER, sub: "editor@ccz.gov.br" });

    expect(await verifyJwt(token, SECRET, ISSUER)).toBeNull();
  });

  it("recusa token de outro emissor", async () => {
    const token = sign({ iss: "OutroSistema", sub: "editor@ccz.gov.br", exp: emAlgumasHoras() });

    expect(await verifyJwt(token, SECRET, ISSUER)).toBeNull();
  });

  it("recusa entrada que nao e um token", async () => {
    expect(await verifyJwt("", SECRET, ISSUER)).toBeNull();
    expect(await verifyJwt("nao.e-um.token", SECRET, ISSUER)).toBeNull();
  });
});
