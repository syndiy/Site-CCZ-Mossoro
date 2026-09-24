"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LogAtividade } from "@/lib/types/audit";
import { listarAuditoriaAdmin } from "@/lib/api/auditoriaApi";
import { AuditoriaModal } from "@/components/admin/auditoria-modal";

export function AuditoriaManager() {
  const [logs, setLogs] = useState<LogAtividade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  const [logSelecionado, setLogSelecionado] = useState<LogAtividade | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const carregarDados = useCallback(async (page: number) => {
    setCarregando(true);
    setErro("");
    try {
      const res = await listarAuditoriaAdmin(page, 10);
      setLogs(res.content);
      
      setPaginaAtual(page); 
      setTotalPaginas(res.totalPages);
      
      // Acesso direto e seguro sem a palavra reservada 'any'
      setTotalElementos(res.totalElements ?? 0);
      
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarDados(0);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [carregarDados]);

  function handleAbrirModal(item: LogAtividade) {
    setLogSelecionado(item);
    setModalAberto(true);
  }

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString("pt-BR");
  };

  return (
    <>
      <Card className="shadow-sm animate-in fade-in duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Trilha de Auditoria</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalElementos} registro{totalElementos !== 1 ? "s" : ""} de atividade
            </p>
          </div>
          <Button onClick={() => carregarDados(paginaAtual)} variant="outline" size="sm">
            Atualizar
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {erro && <div className="text-sm text-red-500 mb-2">{erro}</div>}

          {carregando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Carregando registros...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhum registro de auditoria foi localizado.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-bold tracking-wider border-b">
                    <tr>
                      <th className="p-3.5">Data e Hora</th>
                      <th className="p-3.5">Usuário</th>
                      <th className="p-3.5">Ação</th>
                      <th className="p-3.5">Recurso</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {logs.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-medium text-foreground whitespace-nowrap">
                          {formatarData(item.dataHora)}
                        </td>
                        <td className="p-3.5">{item.usuario}</td>
                        <td className="p-3.5 font-semibold text-foreground">{item.acao}</td>
                        <td className="p-3.5 text-muted-foreground">{item.recurso}</td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              item.status.includes("ERRO")
                                ? "bg-red-100 text-red-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.status.includes("ERRO") ? "Falha" : "Sucesso"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            onClick={() => handleAbrirModal(item)}
                            variant="outline"
                            size="sm"
                          >
                            Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span>
                  Página {paginaAtual + 1} de {Math.max(totalPaginas, 1)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={paginaAtual === 0 || carregando}
                    onClick={() => carregarDados(paginaAtual - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={paginaAtual + 1 >= totalPaginas || carregando}
                    onClick={() => carregarDados(paginaAtual + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AuditoriaModal
        open={modalAberto}
        log={logSelecionado}
        onClose={() => setModalAberto(false)}
      />
    </>
  );
}