import { NextRequest, NextResponse } from "next/server";
import { isValidSession, sessionCookieName } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";

  if (!(await isValidSession(req.cookies.get(sessionCookieName)?.value))) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
