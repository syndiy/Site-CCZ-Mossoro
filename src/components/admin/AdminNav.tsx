"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Notícias", href: "/admin/noticias" },
  { label: "Artigos", href: "/admin/artigos" },
  { label: "Destaques da home", href: "/admin/destaques" },
  { label: "Denúncias e equipe", href: "/admin" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function sair() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  return (
    <header className="w-full border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-6">
            <span className="whitespace-nowrap text-lg font-bold">Painel do CCZ</span>

            <nav className="flex w-full flex-wrap gap-2 sm:w-auto" aria-label="Painel administrativo">
              {navItems.map((item) => {
                // "/admin" casaria com todas as telas, entao so ele exige igualdade.
                const ativo =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      ativo
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Button onClick={sair} variant="outline" size="sm" className="self-start whitespace-nowrap sm:self-center">
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
