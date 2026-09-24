"use client";

import { useEffect, useState } from "react";
import { LogAtividade } from "@/lib/types/audit";
import { auditoriaApi } from "@/lib/api/auditoriaApi";

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<LogAtividade[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [logSelecionado, setLogSelecionado] = useState<LogAtividade | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function buscarLogs() {
      try {
        const data = await auditoriaApi.listarLogs(page, 15);
        if (ativo) {
          setLogs(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        if (ativo) console.error("Erro ao carregar auditoria:", error);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscarLogs();

    return () => {
      ativo = false;
    };
  }, [page]);

  const mudarPagina = (novaPagina: number) => {
    setCarregando(true);
    setPage(novaPagina);
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString("pt-BR");
  };

  const formatarDetalhesJson = (detalhes: string) => {
    try {
      const parsed = JSON.parse(detalhes);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return detalhes;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trilha de Auditoria</h1>
        <p className="text-gray-500">Acompanhe as ações realizadas no sistema.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data e Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recurso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carregando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Carregando registros...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatarData(log.dataHora)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.usuario}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{log.acao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.recurso}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status.includes("ERRO") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        {log.status.includes("ERRO") ? "Falha" : "Sucesso"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button 
                        onClick={() => setLogSelecionado(log)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <button 
            disabled={page === 0 || carregando} 
            onClick={() => mudarPagina(page - 1)}
            className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
          </span>
          <button 
            disabled={page >= totalPages - 1 || carregando} 
            onClick={() => mudarPagina(page + 1)}
            className="px-4 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {logSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Detalhes da Ação</h2>
              <button 
                onClick={() => setLogSelecionado(null)} 
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Usuário</p>
                <p className="text-gray-800">{logSelecionado.usuario}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">IP de Origem</p>
                <p className="text-gray-800">{logSelecionado.ipOrigem}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Ação / Recurso</p>
                <p className="text-gray-800">{logSelecionado.acao} - {logSelecionado.recurso}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Data e Hora</p>
                <p className="text-gray-800">{formatarData(logSelecionado.dataHora)}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">Dados Trafegados (Payload)</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                {formatarDetalhesJson(logSelecionado.detalhes)}
              </pre>
            </div>
            
            {logSelecionado.status.includes("ERRO") && (
              <div className="mt-4">
                 <p className="text-xs text-red-600 font-bold uppercase mb-1">Motivo da Falha</p>
                 <p className="text-red-800 bg-red-50 p-3 border border-red-200 rounded-lg text-sm">
                   {logSelecionado.status}
                 </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}