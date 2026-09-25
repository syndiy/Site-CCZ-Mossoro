import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteConfigProvider } from "@/components/layout/site-config-provider";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/shared/json-ld";
import { baseMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: "#023e84",
  width: "device-width",
  initialScale: 1,
};

// Aplica contraste e tamanho de fonte antes da primeira pintura: sem isso, quem
// depende do alto contraste vê o site normal piscar a cada carregamento.
const PREFERENCIAS_ACESSIBILIDADE = `try{
var c=localStorage.getItem("ccz-contraste");
if(c==="1")document.documentElement.classList.add("contraste");
var f=localStorage.getItem("ccz-fonte");
if(f)document.documentElement.style.fontSize=([100,112,125][+f]||100)+"%";
}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCIAS_ACESSIBILIDADE }} />
      </head>
      <body>
        <a href="#content" className="skip-link">
          Pular para o conteúdo
        </a>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <SiteConfigProvider>
          <SiteShell>{children}</SiteShell>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
