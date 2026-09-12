"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DenunciaResponse } from "@/lib/types/denuncia";
import { listarDenunciasAdmin } from "@/lib/api/denunciaApi";
import { StatusBadge, formatarTipo } from "@/components/admin/status-badge";
import { DenunciaModal } from "@/components/admin/denuncia-modal";

export function DenunciasManager() {
  const [denuncias, setDenuncias] = useState<DenunciaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  const [denunciaSelecionada, setDenunciaSelecionada] = useState<DenunciaResponse | null>(null);
  const [modalDenunciaAberto, setModalDenunciaAberto] = useState(false);

  const carregarDados = useCallback(async (page: number) => {
    setCarregando(true);
    setErro("");
    try {
      const res = await listarDenunciasAdmin(page, 10);
      setDenuncias(res.content);
      setPaginaAtual(res.page);
      setTotalPaginas(res.totalPages);
      setTotalElementos(res.totalElements);
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

  function handleAbrirModalDenuncia(item: DenunciaResponse) {
    setDenunciaSelecionada(item);
    setModalDenunciaAberto(true);
  }

  function handleUpdateSuccess(atualizada: DenunciaResponse) {
    setDenunciaSelecionada(atualizada);
    setDenuncias((prev) =>
      prev.map((d) => (d.idDenuncia === atualizada.idDenuncia ? atualizada : d))
    );
  }

  return (
    <>
      <Card className="shadow-sm animate-in fade-in duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Denúncias Cadastradas</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalElementos} registro{totalElementos !== 1 ? "s" : ""} localizado
              {totalElementos !== 1 ? "s" : ""}
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
              Carregando ocorrências...
            </div>
          ) : denuncias.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhuma ocorrência foi cadastrada até o momento.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-bold tracking-wider border-b">
                    <tr>
                      <th className="p-3.5">Protocolo</th>
                      <th className="p-3.5">Tipo</th>
                      <th className="p-3.5">Denunciante</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {denuncias.map((item) => (
                      <tr key={item.idDenuncia} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-semibold text-foreground">{item.protocolo}</td>
                        <td className="p-3.5">{formatarTipo(item.tipoDeDenuncia)}</td>
                        <td className="p-3.5">{item.nomeDenunciante || "Anônimo"}</td>
                        <td className="p-3.5">
                          <StatusBadge status={item.statusDenuncia} />
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            onClick={() => handleAbrirModalDenuncia(item)}
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

      {denunciaSelecionada && (
        <DenunciaModal
          open={modalDenunciaAberto}
          denuncia={denunciaSelecionada}
          onClose={() => setModalDenunciaAberto(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}