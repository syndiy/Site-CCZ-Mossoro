"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, FileText, LayoutDashboard, LogOut, Newspaper, ShieldCheck, Star } from "lucide-react";
import { useAdminSession } from "./auth-guard";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
  { label: "Notícias", href: "/admin/noticias", icon: Newspaper },
  { label: "Artigos", href: "/admin/artigos", icon: FileText },
  { label: "Destaques", href: "/admin/destaques", icon: Star },
];

export function AdminNav() {
  const pathname = usePathname().replace(/\/$/, "");
  const session = useAdminSession();
  const sair = () => window.dispatchEvent(new Event("ccz-session-expired"));

  return (
    <aside className="border-b border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-6 lg:py-8">
        <Link href="/admin" className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-primary">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="size-6" /></span>
          <span><span className="block text-lg font-bold tracking-tight">CCZ Mossoró</span><span className="block text-xs text-muted-foreground">Painel de gestão</span></span>
        </Link>
        <Button onClick={sair} variant="ghost" size="sm" className="lg:hidden"><LogOut className="size-4" /> Sair</Button>
      </div>
      <p className="hidden px-6 pb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground lg:block">Área de trabalho</p>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4" aria-label="Painel administrativo">
        {navItems.map(({ label, href, icon: Icon }) => {
          const ativo = href === "/admin" ? pathname === href : pathname.startsWith(`${href}/`) || pathname === href;
          return <Link key={href} href={href} aria-current={ativo ? "page" : undefined} className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${ativo ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-4 shrink-0" />{label}</Link>;
        })}
      </nav>
      <div className="hidden lg:mt-auto lg:block lg:p-4">
        <Link href="/" className="mb-5 flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Ver portal público<ArrowUpRight className="size-4" /></Link>
        <div className="rounded-xl border bg-muted/40 p-3">
          <p className="truncate text-sm font-semibold" title={session?.name}>{session?.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{session?.roles.includes("ROLE_ADMINISTRATOR") ? "Administrador" : "Editor"}</p>
          <Button onClick={sair} variant="outline" size="sm" className="mt-3 w-full justify-start"><LogOut className="size-4" /> Encerrar sessão</Button>
        </div>
      </div>
    </aside>
  );
}
