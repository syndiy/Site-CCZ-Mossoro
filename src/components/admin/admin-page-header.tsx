"use client";

import { ShieldAlert } from "lucide-react";
import { useAdminSession } from "./auth-guard";

export function AdminPageHeader({ secao, titulo, descricao, acoes }: { secao: string; titulo: string; descricao?: string; acoes?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">{secao}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{titulo}</h1>
        {descricao ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{descricao}</p> : null}
      </div>
      {acoes ? <div className="flex flex-wrap gap-2">{acoes}</div> : null}
    </header>
  );
}

// Telas que só o administrador usa; o backend também recusa, isto só evita a tela vazia.
export function SomenteAdministrador({ children }: { children: React.ReactNode }) {
  const session = useAdminSession();
  if (session?.roles.includes("ROLE_ADMINISTRATOR")) return <>{children}</>;
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
      <ShieldAlert className="mb-3 size-8 text-muted-foreground" />
      <h2 className="text-lg font-semibold">Área do administrador</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">Só o administrador do CCZ pode gerenciar servidores e a equipe editorial.</p>
    </div>
  );
}
