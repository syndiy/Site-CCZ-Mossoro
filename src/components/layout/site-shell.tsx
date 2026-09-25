"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { AccessibilityBar } from "@/components/widgets/accessibility-bar";
import { BackToTop } from "@/components/widgets/back-to-top";
import { CookieBanner } from "@/components/widgets/cookie-banner";
import { VLibras } from "@/components/widgets/vlibras";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Painel, login e cadastro da equipe têm moldura própria, sem o cabeçalho do portal.
  const semMoldura = ["/admin", "/login", "/cadastro"].some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));
  if (semMoldura) return <>{children}</>;
  return <><VLibras /><AccessibilityBar /><Header /><main id="content">{children}</main><Footer /><BackToTop /><CookieBanner /></>;
}
