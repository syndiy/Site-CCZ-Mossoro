"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
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

  const carregarDados = useCallback(async () => {
    setErro("");
    try {
      const dados = await listarConteudo(colecao);
      setItens(dados);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar lista.");
    } finally {
      setCarregando(false);
    }
  }, [colecao]);

  useEffect(() => {
    let ativo = true;
    void (async () => {
      if (!ativo) return;
      await carregarDados();
    })();
    return () => {
      ativo = false;
    };
  }, [carregarDados]);

  const handleToggleStatus = async (item: ConteudoListResponse) => {
    const acao = item.status === "PUBLICADO" ? "despublicar" : "publicar";
    try {
      await alterarStatusConteudo(colecao, item.slug, acao);
      toast.success(acao === "publicar" ? "Publicado no portal." : "Retirado do portal.");
      await carregarDados();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Erro ao ${acao} conteúdo.`);
    }
  };

  const handleExcluir = async (slug: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      await excluirConteudo(colecao, slug);
      toast.success("Publicação excluída.");
      await carregarDados();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir conteúdo.");
    }
  };

  const tituloPagina = colecao === "noticias" ? "Notícias" : "Artigos";

  return (
    <>
    <AdminPageHeader
      secao="Conteúdo do portal"
      titulo={tituloPagina}
      descricao={`Rascunhos ficam só no painel. Ao publicar, ${colecao === "noticias" ? "a notícia aparece" : "o artigo aparece"} no portal na hora.`}
      acoes={
        <Link href={`/admin/${colecao}/novo`} className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-800 px-4 text-sm font-medium text-white hover:bg-brand-900">
          <Plus className="size-4" /> {colecao === "noticias" ? "Nova notícia" : "Novo artigo"}
        </Link>
      }
    />
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="pt-6">
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
                      <Link
                        href={`/admin/${colecao}/editar?slug=${encodeURIComponent(item.slug)}`}
                        className="inline-flex h-8 items-center rounded-lg border bg-white px-3 text-sm font-medium hover:bg-muted/40"
                      >
                        Editar
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
    </>
  );
}