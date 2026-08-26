"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminPasswordConfigured, sessionCookieName, sessionToken } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminPasswordConfigured()) {
    return { error: "O servidor não tem a variável ADMIN_PASSWORD configurada." };
  }

  const password = String(formData.get("password") ?? "");
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Senha incorreta." };
  }

  const store = await cookies();
  store.set(sessionCookieName, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/");
}
