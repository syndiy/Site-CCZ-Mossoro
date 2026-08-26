import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/auth";

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.delete(sessionCookieName);
  return response;
}
