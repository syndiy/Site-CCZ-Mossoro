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
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span className="whitespace-nowrap text-lg font-bold">Painel do CCZ</span>

            <nav className="flex gap-2">
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

          <Button onClick={sair} variant="outline" size="sm" className="whitespace-nowrap">
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
