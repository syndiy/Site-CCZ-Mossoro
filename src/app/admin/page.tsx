"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { listarDenunciasAdmin, DenunciaResponse } from "@/lib/api";
import { StatusBadge, formatarTipo } from "@/components/admin/status-badge";
import { DenunciaModal } from "@/components/admin/denuncia-modal";

export default function AdminDashboard() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [denuncias, setDenuncias] = useState<DenunciaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Paginação Spring Data
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  // Controle de Modal
  const [denunciaSelecionada, setDenunciaSelecionada] = useState<DenunciaResponse | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

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
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    let isMounted = true;

    async function inicializar() {
      setCarregando(true);
      try {
        const res = await listarDenunciasAdmin(0, 10);
        if (isMounted) {
          setDenuncias(res.content);
          setPaginaAtual(res.page);
          setTotalPaginas(res.totalPages);
          setTotalElementos(res.totalElements);
          setAutorizado(true);
        }
      } catch (err) {
        if (isMounted) {
          setErro(err instanceof Error ? err.message : "Sessão expirada.");
          setAutorizado(true);
        }
      } finally {
        if (isMounted) setCarregando(false);
      }
    }

    inicializar();
    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleAbrirModal(item: DenunciaResponse) {
    setDenunciaSelecionada(item);
    setModalAberto(true);
  }

  function handleUpdateSuccess(atualizada: DenunciaResponse) {
    setDenunciaSelecionada(atualizada);
    setDenuncias((prev) =>
      prev.map((d) => (d.idDenuncia === atualizada.idDenuncia ? atualizada : d))
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (!autorizado) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Autenticando permissões de acesso...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <header className="flex items-center justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel do CCZ</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Centro de Controle de Zoonoses — Sistema de Gestão de Ocorrências
            </p>
          </div>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            Encerrar Sessão
          </Button>
        </header>

        {erro && (
          <Alert variant="destructive">
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm">
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

                {/* Controles de Paginação */}
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
      </div>

      {/* Componente Modal */}
      {denunciaSelecionada && (
        <DenunciaModal
          open={modalAberto}
          denuncia={denunciaSelecionada}
          onClose={() => setModalAberto(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}