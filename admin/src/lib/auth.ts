export const sessionCookieName = "ccz-admin-session";

export const adminPasswordConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export async function sessionToken(): Promise<string> {
  const payload = new TextEncoder().encode(`ccz-admin:${process.env.ADMIN_PASSWORD ?? ""}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSession(value: string | undefined): Promise<boolean> {
  if (!value || !adminPasswordConfigured()) return false;
  return value === (await sessionToken());
}
