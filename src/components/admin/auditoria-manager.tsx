"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { History, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LogAtividade } from "@/lib/types/audit";
import { listarAuditoriaAdmin } from "@/lib/api/auditoriaApi";
import { descreverAcao, descreverRecurso, ehConsulta, mascararDetalhes } from "@/lib/auditoria";

const dataHora = (valor: string) => new Date(valor).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });
const falhou = (status: string) => (status ?? "").toUpperCase().includes("ERRO");
const quem = (usuario: string) => (usuario === "anonymousUser" ? "Visitante do portal" : usuario);

export function AuditoriaManager() {
  const [logs, setLogs] = useState<LogAtividade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [total, setTotal] = useState(0);
  const [mostrarConsultas, setMostrarConsultas] = useState(false);
  const [selecionado, setSelecionado] = useState<LogAtividade | null>(null);
  const pedido = useRef(0);

  const carregar = useCallback(async (p: number) => {
    const id = ++pedido.current;
    setCarregando(true);
    setErro("");
    try {
      const res = await listarAuditoriaAdmin(p, 50);
      if (id !== pedido.current) return;
      setLogs(res.content);
      setPagina(p);
      setTotalPaginas(res.totalPages);
      setTotal(res.totalElements ?? 0);
    } catch (err) {
      if (id === pedido.current) setErro(err instanceof Error ? err.message : "Não foi possível carregar a trilha de auditoria.");
    } finally {
      if (id === pedido.current) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void carregar(0), 0);
    return () => clearTimeout(timer);
  }, [carregar]);

  // Consultas (listar, buscar) são a maioria dos registros; por padrão ficam só as alterações.
  const visiveis = mostrarConsultas ? logs : logs.filter((l) => !ehConsulta(l.acao));

  return (
    <>
      <Card className="overflow-hidden rounded-2xl shadow-none">
        <CardHeader className="flex flex-wrap items-start justify-between gap-4 sm:flex-row">
          <div>
            <CardTitle className="text-xl font-semibold">Registro de atividades</CardTitle>
            <p className="mt-1.5 text-sm text-muted-foreground">{total} registros no total, dos mais recentes para os mais antigos.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="mostrar-consultas" className="flex items-center gap-2 text-sm">
              <input
                id="mostrar-consultas"
                type="checkbox"
                checked={mostrarConsultas}
                onChange={(e) => setMostrarConsultas(e.target.checked)}
                className="size-4 accent-brand-800"
              />
              Mostrar consultas
            </label>
            <Button onClick={() => void carregar(pagina)} disabled={carregando} variant="outline" size="sm">
              <RefreshCw className={`size-4 ${carregando ? "animate-spin motion-reduce:animate-none" : ""}`} /> Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {carregando ? (
            <div role="status" className="space-y-3 py-4">
              <span className="sr-only">Carregando registros…</span>
              {[1, 2, 3].map((k) => <div key={k} className="h-12 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />)}
            </div>
          ) : erro ? (
            <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
              <p className="text-sm text-destructive">{erro}</p>
              <Button className="mt-3" variant="outline" onClick={() => void carregar(pagina)}>Tentar novamente</Button>
            </div>
          ) : visiveis.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed px-4 py-12 text-center">
              <History className="mb-3 size-8 text-muted-foreground" />
              <p className="font-semibold">Nenhuma alteração nesta página</p>
              <p className="mt-2 text-sm text-muted-foreground">Marque &quot;Mostrar consultas&quot; ou veja os registros mais antigos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Registro de atividades do sistema</caption>
                <thead className="border-b bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    {["Quando", "Quem", "O que fez", "Onde", "Resultado", ""].map((c) => (
                      <th key={c || "acoes"} scope="col" className="whitespace-nowrap p-4">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visiveis.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30">
                      <td className="whitespace-nowrap p-4 tabular-nums text-muted-foreground">{dataHora(log.dataHora)}</td>
                      <td className="p-4">{quem(log.usuario)}</td>
                      <td className="p-4 font-medium">{descreverAcao(log.acao)}</td>
                      <td className="p-4 text-muted-foreground">{descreverRecurso(log.recurso)}</td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${falhou(log.status) ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {falhou(log.status) ? "Falhou" : "Concluído"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelecionado(log)}>Detalhes</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!carregando && !erro && totalPaginas > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Página {pagina + 1} de {totalPaginas}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagina === 0} onClick={() => void carregar(pagina - 1)}>Mais recentes</Button>
                <Button variant="outline" size="sm" disabled={pagina + 1 >= totalPaginas} onClick={() => void carregar(pagina + 1)}>Mais antigos</Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {selecionado ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-log"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelecionado(null)}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h2 id="titulo-log" className="text-lg font-semibold">
                {descreverAcao(selecionado.acao)} · {descreverRecurso(selecionado.recurso)}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSelecionado(null)} aria-label="Fechar">
                <X className="size-4" />
              </Button>
            </div>
            <dl className="grid grid-cols-1 gap-3 rounded-xl bg-muted/40 p-4 text-sm sm:grid-cols-2">
              {[
                ["Quem", quem(selecionado.usuario)],
                ["Quando", dataHora(selecionado.dataHora)],
                ["IP de origem", selecionado.ipOrigem || "—"],
                ["Resultado", selecionado.status],
              ].map(([rotulo, valor]) => (
                <div key={rotulo}>
                  <dt className="text-xs font-semibold uppercase text-muted-foreground">{rotulo}</dt>
                  <dd className="mt-0.5 break-words">{valor}</dd>
                </div>
              ))}
            </dl>
            <p className="mb-2 mt-5 text-xs font-semibold uppercase text-muted-foreground">Dados enviados (senhas, CPF e tokens ficam ocultos)</p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 font-mono text-xs">
              {mascararDetalhes(selecionado.detalhes) || "Sem dados."}
            </pre>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelecionado(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
