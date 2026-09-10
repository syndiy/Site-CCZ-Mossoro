import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/auth";

export async function POST(req: Request) {
  // 303 para o navegador trocar o POST do formulario por um GET em /login.
  const response = NextResponse.redirect(new URL("/login", req.url), 303);
  response.cookies.delete(sessionCookieName);
  return response;
}
