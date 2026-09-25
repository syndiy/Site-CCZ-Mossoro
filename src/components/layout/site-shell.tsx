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
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdmin) return <main id="content">{children}</main>;
  return <><VLibras /><AccessibilityBar /><Header /><main id="content">{children}</main><Footer /><BackToTop /><CookieBanner /></>;
}
