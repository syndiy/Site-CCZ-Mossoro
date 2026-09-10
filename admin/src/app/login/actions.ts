"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminPasswordConfigured,
  backendLoginEnabled,
  jwtIssuer,
  jwtSecret,
  sessionCookieName,
  sessionToken,
} from "@/lib/auth";
import { BackendError, login as backendLogin } from "@/lib/backend";
import { verifyJwt } from "@/lib/jwt";
import { clearLoginFailures, isLoginBlocked, registerLoginFailure } from "@/lib/login-rate-limit";

export type LoginState = { error?: string };

function requestKey(value: string | null): string {
  return value?.split(",")[0]?.trim() || "unknown";
}

function secureEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

async function startSession(value: string, maxAge: number): Promise<void> {
  const store = await cookies();
  store.set(sessionCookieName, value, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const requestHeaders = await headers();
  const key = requestKey(requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip"));
  if (isLoginBlocked(key)) {
    return { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  }

  const password = String(formData.get("password") ?? "");

  if (backendLoginEnabled()) {
    const email = String(formData.get("email") ?? "").trim();
    if (!email || !password) {
      return { error: "Informe o e-mail e a senha." };
    }

    let token: string;
    try {
      token = (await backendLogin({ email, password })).token;
    } catch (error) {
      registerLoginFailure(key);
      if (error instanceof BackendError && error.status === 0) {
        return { error: "Servidor da equipe indisponivel. Tente novamente em instantes." };
      }
      return { error: "E-mail ou senha incorretos." };
    }

    // O cookie so vale enquanto o proprio token valer.
    const claims = await verifyJwt(token, jwtSecret(), jwtIssuer());
    if (!claims) {
      return { error: "O servidor devolveu um token que este editor nao reconhece." };
    }

    clearLoginFailures(key);
    const maxAge = Math.max(60, (claims.exp ?? 0) - Math.floor(Date.now() / 1000));
    await startSession(token, maxAge);
    redirect("/");
  }

  if (!adminPasswordConfigured()) {
    return { error: "O servidor nao tem login configurado (CCZ_API_URL ou ADMIN_PASSWORD)." };
  }

  if (!secureEqual(password, process.env.ADMIN_PASSWORD ?? "")) {
    registerLoginFailure(key);
    return { error: "Senha incorreta." };
  }

  clearLoginFailures(key);
  await startSession(await sessionToken(), 60 * 60 * 8);
  redirect("/");
}
