"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight, ClipboardList, FileText, LayoutDashboard, LogOut, Menu, Newspaper,
  Settings2, Star, UserCheck, Users, X, type LucideIcon,
} from "lucide-react";
import { useAdminSession } from "./auth-guard";

type Item = { label: string; href: string; icon: LucideIcon; admin?: boolean };

const grupos: { titulo: string; itens: Item[] }[] = [
  {
    titulo: "Atendimento",
    itens: [
      { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
      { label: "Ocorrências", href: "/admin/ocorrencias", icon: ClipboardList },
    ],
  },
  {
    titulo: "Conteúdo do portal",
    itens: [
      { label: "Notícias", href: "/admin/noticias", icon: Newspaper },
      { label: "Artigos", href: "/admin/artigos", icon: FileText },
      { label: "Destaques da home", href: "/admin/destaques", icon: Star },
      { label: "Informações do CCZ", href: "/admin/configuracoes", icon: Settings2 },
    ],
  },
  {
    titulo: "Administração",
    itens: [
      { label: "Servidores autorizados", href: "/admin/servidores", icon: UserCheck, admin: true },
      { label: "Equipe editorial", href: "/admin/equipe", icon: Users, admin: true },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname().replace(/\/$/, "") || "/admin";
  const session = useAdminSession();
  const administrador = session?.roles.includes("ROLE_ADMINISTRATOR") ?? false;
  // Guarda em qual tela o menu do celular foi aberto: ao navegar, ele fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const aberto = abertoEm === pathname;
  const sair = () => window.dispatchEvent(new Event("ccz-session-expired"));

  const ativo = (href: string) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  const navegacao = (
    <nav aria-label="Painel administrativo" className="flex flex-col gap-6">
      {grupos.map(({ titulo, itens }) => {
        const visiveis = itens.filter((item) => !item.admin || administrador);
        if (!visiveis.length) return null;
        return (
          <div key={titulo}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-brand-300">{titulo}</p>
            <ul className="flex flex-col gap-1">
              {visiveis.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={ativo(href) ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white ${
                      ativo(href) ? "bg-white text-brand-900 shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  const rodape = (
    <div className="space-y-3">
      <Link href="/" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">
        Ver portal público <ArrowUpRight className="size-4" />
      </Link>
      <div className="rounded-xl bg-white/10 p-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-900">
            {session?.name?.trim().charAt(0).toUpperCase() || "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white" title={session?.name}>{session?.name}</p>
            <p className="text-xs text-brand-300">{administrador ? "Administrador" : "Editor"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={sair}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
        >
          <LogOut className="size-4" /> Encerrar sessão
        </button>
      </div>
    </div>
  );

  const marca = (
    <Link href="/admin" className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-white">
      <Image src="/logo.svg" alt="CCZ Mossoró" width={112} height={50} className="h-10 w-auto" priority />
      <span className="border-l border-white/25 pl-3 text-xs font-medium leading-tight text-white/80">
        Painel de<br />gestão
      </span>
    </Link>
  );

  return (
    <>
      {/* Computador: barra lateral fixa */}
      <aside className="hidden bg-brand-900 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:gap-8 lg:overflow-y-auto lg:px-4 lg:py-6">
        <div className="px-2">{marca}</div>
        {navegacao}
        <div className="mt-auto">{rodape}</div>
      </aside>

      {/* Celular: barra superior com menu */}
      <header className="sticky top-0 z-40 bg-brand-900 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {marca}
          <button
            type="button"
            onClick={() => setAbertoEm(aberto ? null : pathname)}
            aria-expanded={aberto}
            aria-controls="menu-painel"
            className="flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium text-white"
          >
            {aberto ? <X className="size-4" /> : <Menu className="size-4" />} Menu
          </button>
        </div>
        {aberto ? (
          <div id="menu-painel" className="max-h-[calc(100vh-4rem)] space-y-6 overflow-y-auto border-t border-white/10 px-4 pb-6 pt-4">
            {navegacao}
            {rodape}
          </div>
        ) : null}
      </header>
    </>
  );
}
