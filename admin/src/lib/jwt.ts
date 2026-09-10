/**
 * Verificacao local do JWT emitido pelo backend (JwtTokenService, HS256).
 *
 * Roda no proxy do Next, que usa runtime edge: por isso Web Crypto e nao node:crypto.
 * Validar aqui evita uma ida ao backend a cada navegacao no editor.
 */

export type JwtClaims = {
  sub: string;
  iss?: string;
  exp?: number;
  iat?: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlDecode(part: string): Uint8Array<ArrayBuffer> {
  const padding = part.length % 4 === 0 ? "" : "=".repeat(4 - (part.length % 4));
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/") + padding;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function parseSegment(part: string): Record<string, unknown> | null {
  try {
    return JSON.parse(decoder.decode(base64UrlDecode(part)));
  } catch {
    return null;
  }
}

export async function verifyJwt(
  token: string,
  secret: string,
  issuer: string,
): Promise<JwtClaims | null> {
  if (!token || !secret) return null;

  const [headerPart, payloadPart, signaturePart] = token.split(".");
  if (!headerPart || !payloadPart || !signaturePart) return null;

  const header = parseSegment(headerPart);
  // Recusa alg "none" e qualquer algoritmo que nao seja o do backend.
  if (header?.alg !== "HS256") return null;

  const payload = parseSegment(payloadPart);
  if (!payload || typeof payload.sub !== "string") return null;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signatureValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signaturePart),
    encoder.encode(`${headerPart}.${payloadPart}`),
  );
  if (!signatureValid) return null;

  if (issuer && payload.iss !== issuer) return null;

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp <= now) return null;

  return payload as JwtClaims;
}
