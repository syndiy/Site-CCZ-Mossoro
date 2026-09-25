"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ClipboardList, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DenunciaResponse, StatusDenuncia, TipoDenuncia } from "@/lib/types/denuncia";
import { listarDenunciasAdmin } from "@/lib/api/denunciaApi";
import { STATUS_CONFIG, TIPO_LABELS, StatusBadge, formatarTipo } from "./status-badge";
import { DenunciaModal } from "./denuncia-modal";

export function DenunciasManager() {
  const [denuncias, setDenuncias] = useState<DenunciaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [status, setStatus] = useState<StatusDenuncia | "">("");
  const [tipo, setTipo] = useState<TipoDenuncia | "">("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState<DenunciaResponse | null>(null);
  const requests = useRef({ id: 0 });

  const carregarDados = useCallback(async (page: number) => {
    const id = ++requests.current.id;
    setCarregando(true);
    setErro("");
    try {
      const res = await listarDenunciasAdmin(page, 10, { status: status || undefined, tipo: tipo || undefined });
      if (id !== requests.current.id) return;
      setDenuncias(res.content);
      setPaginaAtual(res.page);
      setTotalPaginas(res.totalPages);
      setTotalElementos(res.totalElements);
    } catch (err) {
      if (id === requests.current.id) setErro(err instanceof Error ? err.message : "Erro ao carregar os dados.");
    } finally {
      if (id === requests.current.id) setCarregando(false);
    }
  }, [status, tipo]);

  useEffect(() => {
    const pending = requests.current;
    const timer = setTimeout(() => void carregarDados(0), 0);
    return () => { clearTimeout(timer); pending.id++; };
  }, [carregarDados]);

  return (
    <>
      <Card className="overflow-hidden rounded-2xl shadow-none">
        <CardHeader className="flex flex-wrap items-start justify-between gap-4 sm:flex-row">
          <div>
            <CardTitle className="text-xl font-semibold">Ocorrências da população</CardTitle>
            <p className="mt-1.5 text-sm text-muted-foreground">Consulte os relatos e atualize o andamento de cada atendimento.</p>
          </div>
          <Button onClick={() => void carregarDados(paginaAtual)} disabled={carregando} variant="outline" size="sm"><RefreshCw className={`size-4 ${carregando ? "animate-spin motion-reduce:animate-none" : ""}`} />Atualizar</Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-end gap-3 rounded-xl bg-muted/50 p-4">
            <SlidersHorizontal className="mb-3 hidden size-4 text-muted-foreground sm:block" />
            <label className="w-full min-w-0 text-xs font-medium sm:w-auto sm:min-w-44 sm:flex-1">Andamento
              <select value={status} onChange={(event) => setStatus(event.target.value as StatusDenuncia | "")} className="mt-1.5 block h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary">
                <option value="">Todos os status</option>
                {Object.entries(STATUS_CONFIG).map(([value, config]) => <option key={value} value={value}>{config.label}</option>)}
              </select>
            </label>
            <label className="w-full min-w-0 text-xs font-medium sm:w-auto sm:min-w-52 sm:flex-1">Tipo de ocorrência
              <select value={tipo} onChange={(event) => setTipo(event.target.value as TipoDenuncia | "")} className="mt-1.5 block h-10 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-primary">
                <option value="">Todos os tipos</option>
                {Object.entries(TIPO_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            {(status || tipo) && <Button variant="ghost" onClick={() => { setStatus(""); setTipo(""); }}>Limpar filtros</Button>}
          </div>
          {carregando ? (
            <div role="status" className="space-y-3 py-6"><p className="text-sm text-muted-foreground">Carregando ocorrências…</p>{[1, 2, 3].map((key) => <div key={key} className="h-14 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />)}</div>
          ) : erro ? (
            <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-6"><p className="text-sm text-destructive">{erro}</p><Button className="mt-3" variant="outline" onClick={() => void carregarDados(paginaAtual)}>Tentar novamente</Button></div>
          ) : denuncias.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed px-4 py-12 text-center"><ClipboardList className="mb-3 size-8 text-muted-foreground" /><h3 className="font-semibold">Nenhuma ocorrência encontrada</h3><p className="mt-2 text-sm text-muted-foreground">{status || tipo ? "Altere os filtros para consultar outros atendimentos." : "Os novos relatos da população aparecerão aqui."}</p></div>
          ) : (
            <>
              <p role="status" className="text-xs text-muted-foreground">{totalElementos} ocorrência{totalElementos !== 1 ? "s" : ""} encontrada{totalElementos !== 1 ? "s" : ""}</p>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Ocorrências recebidas pelo CCZ</caption>
                  <thead className="border-b bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground"><tr>{["Protocolo / data", "Tipo / bairro", "Denunciante", "Andamento", "Ações"].map((label) => <th key={label} scope="col" className="whitespace-nowrap p-4">{label}</th>)}</tr></thead>
                  <tbody className="divide-y">{denuncias.map((item) => <tr key={item.idDenuncia} className="transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap p-4"><span className="block font-semibold">{item.protocolo}</span><span className="mt-1 block text-xs text-muted-foreground">{item.dataCriacao ? new Date(item.dataCriacao).toLocaleDateString("pt-BR") : "—"}</span></td>
                    <td className="p-4"><span className="block">{formatarTipo(item.tipoDeDenuncia)}</span><span className="mt-1 block text-xs text-muted-foreground">{item.bairro || "Bairro não informado"}</span></td>
                    <td className="p-4">{item.nomeDenunciante || "Anônimo"}</td>
                    <td className="whitespace-nowrap p-4"><StatusBadge status={item.statusDenuncia} /></td>
                    <td className="p-4"><Button onClick={() => setDenunciaSelecionada(item)} variant="outline" size="sm" aria-label={`Detalhes da ocorrência ${item.protocolo}`}>Detalhes</Button></td>
                  </tr>)}</tbody>
                </table>
              </div>
            </>
          )}
          {!carregando && !erro && totalPaginas > 0 && <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>Página {paginaAtual + 1} de {totalPaginas}</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={paginaAtual === 0} onClick={() => void carregarDados(paginaAtual - 1)}>Anterior</Button><Button variant="outline" size="sm" disabled={paginaAtual + 1 >= totalPaginas} onClick={() => void carregarDados(paginaAtual + 1)}>Próxima</Button></div></div>}
        </CardContent>
      </Card>
      {denunciaSelecionada && <DenunciaModal open denuncia={denunciaSelecionada} onClose={() => setDenunciaSelecionada(null)} onUpdateSuccess={(atualizada) => { setDenunciaSelecionada(atualizada); void carregarDados(0); }} />}
    </>
  );
}
