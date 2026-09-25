"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, FileText, Newspaper, Settings2, Users, UserCheck } from "lucide-react";
import { AllowedEmployeesManager } from "@/components/admin/allowed-employees-manager";
import { DenunciasManager } from "@/components/admin/denuncias-manager";
import { EditorsManager } from "@/components/admin/editors-manager";
import { GlobalConfigManager } from "@/components/admin/global-config-manager";
import { useAdminSession } from "@/components/admin/auth-guard";

const sections = [
  { id: "denuncias", label: "Ocorrências", icon: ClipboardList, admin: false },
  { id: "servidores", label: "Servidores autorizados", icon: UserCheck, admin: true },
  { id: "editores", label: "Equipe editorial", icon: Users, admin: true },
  { id: "configuracoes", label: "Configurações do portal", icon: Settings2, admin: false },
] as const;

export default function AdminDashboard() {
  const session = useAdminSession();
  const isAdministrator = session?.roles.includes("ROLE_ADMINISTRATOR");
  const [abaAtiva, setAbaAtiva] = useState<string>("denuncias");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Centro de Controle de Zoonoses</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Visão geral</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Olá, {session?.name?.split(" ")[0] || "equipe"}. Acompanhe as ocorrências e mantenha a população informada.</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted">Ver portal<ArrowUpRight className="size-4" /></Link>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "Publicar notícia", description: "Informe sobre campanhas, ações e novidades do CCZ.", href: "/admin/noticias/novo", icon: Newspaper },
          { title: "Escrever artigo", description: "Compartilhe orientações de prevenção e cuidados.", href: "/admin/artigos/novo", icon: FileText },
        ].map(({ title, description, href, icon: Icon }) => <Link key={href} href={href} className="group flex gap-4 rounded-2xl border bg-background p-5 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-primary"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="flex-1"><span className="block font-semibold">{title}</span><span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{description}</span></span><ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" /></Link>)}
      </div>
      <div>
        <nav aria-label="Gestão do CCZ" className="mb-6 flex gap-2 overflow-x-auto border-b pb-3">
          {sections.filter((section) => !section.admin || isAdministrator).map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={abaAtiva === id} aria-controls="gestao-conteudo" onClick={() => setAbaAtiva(id)} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary ${abaAtiva === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-4" />{label}</button>)}
        </nav>
        <section id="gestao-conteudo" aria-label={sections.find((section) => section.id === abaAtiva)?.label}>
          {abaAtiva === "denuncias" && <DenunciasManager />}
          {isAdministrator && abaAtiva === "servidores" && <AllowedEmployeesManager />}
          {isAdministrator && abaAtiva === "editores" && <EditorsManager />}
          {abaAtiva === "configuracoes" && <GlobalConfigManager />}
        </section>
      </div>
    </div>
  );
}
