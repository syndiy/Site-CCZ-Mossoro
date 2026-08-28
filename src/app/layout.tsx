import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccessibilityBar } from "@/components/widgets/accessibility-bar";
import { BackToTop } from "@/components/widgets/back-to-top";
import { CookieBanner } from "@/components/widgets/cookie-banner";
import { VLibras } from "@/components/widgets/vlibras";
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
    <html lang="pt-BR" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCIAS_ACESSIBILIDADE }} />
      </head>
      <body>
        <VLibras />
        <a href="#content" className="skip-link">
          Pular para o conteúdo
        </a>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <AccessibilityBar />
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <BackToTop />
        <CookieBanner />
      </body>
    </html>
  );
}
