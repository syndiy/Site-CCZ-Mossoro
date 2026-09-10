import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { readSession, sessionCookieName } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Editor de conteúdo | CCZ Mossoró",
  description: "Painel para publicar artigos e notícias do site do CCZ Mossoró.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const session = await readSession(store.get(sessionCookieName)?.value);

  return (
    <html lang="pt-BR">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand-link">
              <strong>CCZ Mossoró</strong>
              <span>Editor de conteúdo</span>
            </Link>
            {session ? (
              <div className="session-box">
                <nav className="topbar-nav" aria-label="Seções do editor">
                  <Link href="/" className="site-link">Conteúdo</Link>
                </nav>
                <form action="/api/logout" method="post" className="session-box">
                  <span className="session-user">{session.email}</span>
                  <button type="submit" className="site-link">Sair</button>
                </form>
              </div>
            ) : (
              <Link href="/" className="site-link">Painel</Link>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
