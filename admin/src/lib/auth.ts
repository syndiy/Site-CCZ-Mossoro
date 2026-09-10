import { backendAuthEnabled } from "./backend";
import { verifyJwt } from "./jwt";

export const sessionCookieName = "ccz-admin-session";

const DEFAULT_ISSUER = "SiteInstitucionalCcz";

export const jwtSecret = () => process.env.CCZ_JWT_SECRET ?? "";
export const jwtIssuer = () => process.env.CCZ_JWT_ISSUER ?? DEFAULT_ISSUER;

/** Login por usuario individual, contra o Spring Security do backend. */
export const backendLoginEnabled = () => backendAuthEnabled() && Boolean(jwtSecret());

/** Senha unica local. Fallback para desenvolver o editor sem subir o backend. */
export const adminPasswordConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export const loginEnabled = () => backendLoginEnabled() || adminPasswordConfigured();

export type Session = { email: string };

export async function sessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
  const payload = new TextEncoder().encode(
    `ccz-admin:${secret}:${process.env.ADMIN_PASSWORD ?? ""}`,
  );
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function readSession(value: string | undefined): Promise<Session | null> {
  if (!value) return null;

  if (backendLoginEnabled()) {
    const claims = await verifyJwt(value, jwtSecret(), jwtIssuer());
    return claims ? { email: claims.sub } : null;
  }

  if (!adminPasswordConfigured()) return null;
  return value === (await sessionToken()) ? { email: "equipe@local" } : null;
}

export async function isValidSession(value: string | undefined): Promise<boolean> {
  return (await readSession(value)) !== null;
}

/**
 * Token bruto para repassar ao backend, quando ele ainda vale.
 * No modo local nao existe token — as telas que falam com a API ficam indisponiveis.
 */
export async function backendToken(value: string | undefined): Promise<string | null> {
  if (!backendLoginEnabled() || !value) return null;
  const claims = await verifyJwt(value, jwtSecret(), jwtIssuer());
  return claims ? value : null;
}
