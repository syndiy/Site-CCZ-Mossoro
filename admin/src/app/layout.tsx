import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Editor de conteúdo · CCZ Mossoró",
  description: "Painel para publicar artigos e notícias do site do CCZ Mossoró.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="topbar">
          <Link href="/">CCZ Mossoró · Editor de conteúdo</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
