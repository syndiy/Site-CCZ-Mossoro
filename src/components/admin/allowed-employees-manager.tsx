"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AllowedEmployeeResponse,
  listarFuncionariosPermitidos,
  cadastrarFuncionarioPermitido,
  atualizarFuncionarioPermitido,
} from "@/lib/api";

export function AllowedEmployeesManager() {
  const [servidores, setServidores] = useState<AllowedEmployeeResponse[]>([]);
  // Inicia como true para dispensar o setCarregando(true) síncrono no useEffect
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [servidorEmEdicao, setServidorEmEdicao] = useState<AllowedEmployeeResponse | null>(null);
  
  // Estados do Formulário
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  // 1. Busca inicial sem chamar setState síncrono no ciclo de render
  useEffect(() => {
    let isMounted = true;

    async function carregarInicial() {
      try {
        const dados = await listarFuncionariosPermitidos();
        if (isMounted) {
          setServidores(dados);
        }
      } catch (err) {
        if (isMounted) {
          setErro(err instanceof Error ? err.message : "Erro ao carregar servidores.");
        }
      } finally {
        if (isMounted) {
          setCarregando(false);
        }
      }
    }

    carregarInicial();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Função exclusiva para recarregar manualmente via clique ou pós-edição
  async function recarregarLista() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarFuncionariosPermitidos();
      setServidores(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar servidores.");
    } finally {
      setCarregando(false);
    }
  }

  function abrirModalCriar() {
    setServidorEmEdicao(null);
    setCpf("");
    setNome("");
    setErro("");
    setModalAberto(true);
  }

  function abrirModalEditar(servidor: AllowedEmployeeResponse) {
    setServidorEmEdicao(servidor);
    setCpf(servidor.cpf);
    setNome(servidor.name);
    setErro("");
    setModalAberto(true);
  }

  async function handleSalvar() {
    setSalvando(true);
    setErro("");

    try {
      if (servidorEmEdicao && servidorEmEdicao.id) {
        await atualizarFuncionarioPermitido(servidorEmEdicao.id, { cpf, name: nome });
      } else {
        await cadastrarFuncionarioPermitido({ cpf, name: nome });
      }
      
      setModalAberto(false);
      recarregarLista();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Servidores Autorizados</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie os CPFs que têm acesso ao painel.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={recarregarLista} variant="outline" size="sm">
            Atualizar
          </Button>
          <Button onClick={abrirModalCriar} size="sm">
            + Novo Servidor
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {erro && !modalAberto && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {carregando ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Carregando lista...
          </div>
        ) : servidores.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum servidor autorizado foi encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-bold tracking-wider border-b">
                <tr>
                  <th className="p-3.5">Nome</th>
                  <th className="p-3.5">CPF</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {servidores.map((srv, index) => (
                  <tr key={srv.id || index} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-medium">{srv.name || "Não informado"}</td>
                    <td className="p-3.5">{srv.cpf}</td>
                    <td className="p-3.5 text-right">
                      <Button onClick={() => abrirModalEditar(srv)} variant="outline" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* MODAL INTEGRADO DE CRIAR/EDITAR */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-background rounded-xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <h2 className="text-xl font-bold">
              {servidorEmEdicao ? "Editar Servidor" : "Autorizar Novo Servidor"}
            </h2>

            {erro && (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Nome</label>
              <input
                type="text"
                className="border p-2 rounded-md bg-background"
                placeholder="Nome do servidor"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">CPF</label>
              <input
                type="text"
                className="border p-2 rounded-md bg-background"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setModalAberto(false)} disabled={salvando}>
                Cancelar
              </Button>
              <Button onClick={handleSalvar} disabled={salvando || !cpf}>
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}