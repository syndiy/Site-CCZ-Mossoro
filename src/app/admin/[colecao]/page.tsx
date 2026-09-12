"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  listarConteudo,
  alterarStatusConteudo,
  excluirConteudo,
} from "@/lib/api/conteudoApi";
import type { ColecaoConteudo, ConteudoListResponse } from "@/lib/types/conteudo";

interface PageProps {
  params: Promise<{ colecao: string }>;
}

export default function ConteudoListPage({ params }: PageProps) {
  const { colecao } = use(params) as { colecao: ColecaoConteudo };

  const [itens, setItens] = useState<ConteudoListResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDados = async () => {
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarConteudo(colecao);
      setItens(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar lista.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [colecao]);

  const handleToggleStatus = async (item: ConteudoListResponse) => {
    const acao = item.status === "PUBLICADO" ? "despublicar" : "publicar";
    try {
      await alterarStatusConteudo(colecao, item.slug, acao);
      await carregarDados();
    } catch (err) {
      alert(err instanceof Error ? err.message : `Erro ao ${acao} conteúdo.`);
    }
  };

  const handleExcluir = async (slug: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      await excluirConteudo(colecao, slug);
      await carregarDados();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir conteúdo.");
    }
  };

  const tituloPagina = colecao === "noticias" ? "Notícias" : "Artigos";

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl font-bold">{tituloPagina}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Gerencie as publicações de {tituloPagina.toLowerCase()} do portal.
          </p>
        </div>
        <Link href={`/admin/${colecao}/novo`}>
          <Button size="sm">+ Criar {colecao === "noticias" ? "Notícia" : "Artigo"}</Button>
        </Link>
      </CardHeader>

      <CardContent>
        {erro && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {carregando ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Carregando publicações...
          </div>
        ) : itens.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhuma publicação cadastrada em {tituloPagina.toLowerCase()}.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-bold tracking-wider border-b">
                <tr>
                  <th className="p-3.5">Título</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Última Modificação</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {itens.map((item) => (
                  <tr key={item.slug} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-medium">{item.titulo}</td>
                    <td className="p-3.5">
                      {item.status === "PUBLICADO" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {new Date(item.dataModificacao).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3.5 text-right flex justify-end gap-2">
                      <Button
                        onClick={() => handleToggleStatus(item)}
                        variant="outline"
                        size="sm"
                      >
                        {item.status === "PUBLICADO" ? "Despublicar" : "Publicar"}
                      </Button>
                      <Link href={`/admin/${colecao}/${item.slug}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleExcluir(item.slug)}
                        variant="destructive"
                        size="sm"
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}