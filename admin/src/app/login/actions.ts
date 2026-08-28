"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminPasswordConfigured, sessionCookieName, sessionToken } from "@/lib/auth";
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

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminPasswordConfigured()) {
    return { error: "O servidor não tem a variável ADMIN_PASSWORD configurada." };
  }

  const password = String(formData.get("password") ?? "");
  const requestHeaders = await headers();
  const key = requestKey(requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip"));
  if (isLoginBlocked(key)) {
    return { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  }

  if (!secureEqual(password, process.env.ADMIN_PASSWORD ?? "")) {
    registerLoginFailure(key);
    return { error: "Senha incorreta." };
  }
  clearLoginFailures(key);

  const store = await cookies();
  store.set(sessionCookieName, await sessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/");
}
