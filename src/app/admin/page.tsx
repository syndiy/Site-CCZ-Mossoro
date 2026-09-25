"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, ClipboardList, FileText, Hourglass, MapPinCheck,
  Newspaper, Plus, RefreshCw, XCircle, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminSession } from "@/components/admin/auth-guard";
import { StatusBadge, formatarTipo } from "@/components/admin/status-badge";
import { listarDenunciasAdmin } from "@/lib/api/denunciaApi";
import { listarConteudo } from "@/lib/api/conteudoApi";
import type { DenunciaResponse, StatusDenuncia } from "@/lib/types/denuncia";
import type { ConteudoListResponse } from "@/lib/types/conteudo";

const indicadores: { status: StatusDenuncia; label: string; icon: LucideIcon; cor: string }[] = [
  { status: "EM_ANALISE", label: "Em análise", icon: Hourglass, cor: "bg-amber-50 text-amber-700" },
  { status: "VISITA_REALIZADA", label: "Visita realizada", icon: MapPinCheck, cor: "bg-blue-50 text-blue-700" },
  { status: "CONCLUIDA", label: "Concluídas", icon: CheckCircle2, cor: "bg-emerald-50 text-emerald-700" },
  { status: "NAO_RESOLVIDA", label: "Não resolvidas", icon: XCircle, cor: "bg-rose-50 text-rose-700" },
];

type Resumo = {
  total: number;
  porStatus: Record<StatusDenuncia, number>;
  recentes: DenunciaResponse[];
  noticias: ConteudoListResponse[];
  artigos: ConteudoListResponse[];
};

export default function AdminDashboard() {
  const session = useAdminSession();
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setErro("");
    try {
      const [recentes, contagens, noticias, artigos] = await Promise.all([
        listarDenunciasAdmin(0, 5),
        Promise.all(indicadores.map(({ status }) => listarDenunciasAdmin(0, 1, { status }).then((r) => r.totalElements))),
        listarConteudo("noticias"),
        listarConteudo("artigos"),
      ]);
      setResumo({
        total: recentes.totalElements,
        porStatus: Object.fromEntries(indicadores.map(({ status }, i) => [status, contagens[i]])) as Record<StatusDenuncia, number>,
        recentes: recentes.content,
        noticias,
        artigos,
      });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível carregar o resumo.");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void carregar(), 0);
    return () => clearTimeout(timer);
  }, [carregar]);

  const primeiroNome = session?.name?.split(" ")[0] || "equipe";

  return (
    <>
      <AdminPageHeader
        secao="Centro de Controle de Zoonoses"
        titulo={`Olá, ${primeiroNome}`}
        descricao="Resumo do atendimento à população e das publicações do portal."
        acoes={
          <>
            <Button variant="outline" className="h-9 bg-white" onClick={() => { setResumo(null); void carregar(); }}>
              <RefreshCw className="size-4" /> Atualizar
            </Button>
            <Link href="/" className="inline-flex h-9 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-medium hover:bg-muted/40">
              Ver portal <ArrowUpRight className="size-4" />
            </Link>
          </>
        }
      />

      {erro ? (
        <div role="alert" className="mb-8 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <p className="text-sm text-destructive">{erro}</p>
          <Button className="mt-3" variant="outline" onClick={() => void carregar()}>Tentar novamente</Button>
        </div>
      ) : null}

      <section aria-labelledby="titulo-ocorrencias" className="mb-8">
        <h2 id="titulo-ocorrencias" className="sr-only">Ocorrências por andamento</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <Link href="/admin/ocorrencias" className="group col-span-2 flex flex-col justify-between rounded-2xl bg-brand-900 p-5 lg:col-span-1 text-white shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-brand-600">
            <span className="flex items-center justify-between text-sm font-medium text-white/80">
              Ocorrências recebidas <ClipboardList className="size-5" />
            </span>
            <span className="mt-4 text-4xl font-bold">{resumo ? resumo.total : "–"}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-brand-300 group-hover:text-white">
              Ver todas <ArrowRight className="size-3" />
            </span>
          </Link>
          {indicadores.map(({ status, label, icon: Icon, cor }) => (
            <div key={status} className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
              <span className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                {label}
                <span className={`flex size-8 items-center justify-center rounded-lg ${cor}`}><Icon className="size-4" /></span>
              </span>
              <span className="mt-4 block text-3xl font-bold text-ink">
                {resumo ? resumo.porStatus[status] : <span className="inline-block h-8 w-10 animate-pulse rounded bg-muted/40 motion-reduce:animate-none" />}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section aria-labelledby="titulo-recentes" className="rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 id="titulo-recentes" className="text-base font-semibold">Últimas ocorrências</h2>
            <Link href="/admin/ocorrencias" className="inline-flex items-center gap-1 text-sm font-medium text-brand-800 hover:underline">
              Ver todas <ArrowRight className="size-4" />
            </Link>
          </div>
          {!resumo ? (
            <div role="status" className="space-y-3 p-5">
              <span className="sr-only">Carregando ocorrências…</span>
              {[1, 2, 3].map((k) => <div key={k} className="h-12 animate-pulse rounded-lg bg-muted/40 motion-reduce:animate-none" />)}
            </div>
          ) : resumo.recentes.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-12 text-center">
              <ClipboardList className="mb-3 size-8 text-muted-foreground" />
              <p className="font-medium">Nenhuma ocorrência ainda</p>
              <p className="mt-1 text-sm text-muted-foreground">Os relatos enviados pelo portal aparecem aqui.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {resumo.recentes.map((d) => (
                <li key={d.idDenuncia} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{formatarTipo(d.tipoDeDenuncia)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {d.protocolo} · {d.bairro || "Bairro não informado"}
                      {d.dataCriacao ? ` · ${new Date(d.dataCriacao).toLocaleDateString("pt-BR")}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={d.statusDenuncia} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="titulo-portal" className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 id="titulo-portal" className="text-base font-semibold">Publicações do portal</h2>
          </div>
          <div className="space-y-3 p-5">
            {[
              { titulo: "Notícias", itens: resumo?.noticias, href: "/admin/noticias", novo: "/admin/noticias/novo", icon: Newspaper, acao: "Publicar notícia" },
              { titulo: "Artigos", itens: resumo?.artigos, href: "/admin/artigos", novo: "/admin/artigos/novo", icon: FileText, acao: "Escrever artigo" },
            ].map(({ titulo, itens, href, novo, icon: Icon, acao }) => {
              const publicados = itens?.filter((i) => i.status === "PUBLICADO").length;
              const rascunhos = itens?.filter((i) => i.status !== "PUBLICADO").length;
              return (
                <div key={titulo} className="rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-800"><Icon className="size-5" /></span>
                    <div className="flex-1">
                      <Link href={href} className="font-semibold hover:underline">{titulo}</Link>
                      <p className="text-xs text-muted-foreground">
                        {itens ? `${publicados} publicada${publicados === 1 ? "" : "s"} · ${rascunhos} rascunho${rascunhos === 1 ? "" : "s"}` : "Carregando…"}
                      </p>
                    </div>
                  </div>
                  <Link href={novo} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-800 px-3 py-2 text-sm font-medium text-white hover:bg-brand-900">
                    <Plus className="size-4" /> {acao}
                  </Link>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">
              Notícias e artigos criados antes do painel (no build do site) não entram nesta contagem.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
