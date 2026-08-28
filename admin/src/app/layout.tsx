import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Editor de conteúdo | CCZ Mossoró",
  description: "Painel para publicar artigos e notícias do site do CCZ Mossoró.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand-link">
              <strong>CCZ Mossoró</strong>
              <span>Editor de conteúdo</span>
            </Link>
            <Link href="/" className="site-link">Painel</Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
