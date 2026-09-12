"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadMidia } from "@/lib/api/midiaApi";
import { criarConteudo, editarConteudo } from "@/lib/api/conteudoApi";
import type { ColecaoConteudo, ConteudoCompletoResponse } from "@/lib/types/conteudo";

interface ConteudoFormProps {
  colecao: ColecaoConteudo;
  dadosIniciais?: ConteudoCompletoResponse;
}

export function ConteudoForm({ colecao, dadosIniciais }: ConteudoFormProps) {
  const router = useRouter();
  const editando = Boolean(dadosIniciais);

  const [titulo, setTitulo] = useState(dadosIniciais?.titulo || "");
  const [imagemCapaUrl, setImagemCapaUrl] = useState<string | null>(
    dadosIniciais?.imagemCapaUrl || null
  );
  const [corpo, setCorpo] = useState(dadosIniciais?.corpo || "");

  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleCapaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviandoImagem(true);
    setErro("");
    try {
      const url = await uploadMidia(file);
      setImagemCapaUrl(url);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar imagem de capa.");
    } finally {
      setEnviandoImagem(false);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErro("O título é obrigatório.");
      return;
    }

    setSalvando(true);
    setErro("");

    const payload = {
      titulo,
      corpo,
      imagemCapaUrl,
    };

    try {
      if (editando && dadosIniciais?.slug) {
        await editarConteudo(colecao, dadosIniciais.slug, payload);
      } else {
        await criarConteudo(colecao, payload);
      }

      router.push(`/admin/${colecao}`);
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar conteúdo.");
    } finally {
      setSalvando(false);
    }
  };

  const nomeColecaoSingular = colecao === "noticias" ? "Notícia" : "Artigo";

  return (
    <Card className="max-w-4xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {editando ? `Editar ${nomeColecaoSingular}` : `Nova ${nomeColecaoSingular}`}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSalvar} className="space-y-6">
          {erro && (
            <Alert variant="destructive">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {/* Título */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={`Digite o título da ${nomeColecaoSingular.toLowerCase()}...`}
              className="w-full rounded-md border p-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Imagem de Capa */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Imagem de Capa</label>
            {imagemCapaUrl && (
              <div className="relative w-full max-h-56 overflow-hidden rounded-md border mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagemCapaUrl}
                  alt="Capa"
                  className="w-full h-56 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setImagemCapaUrl(null)}
                >
                  Remover
                </Button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCapaUpload}
              disabled={enviandoImagem}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {enviandoImagem && (
              <p className="text-xs text-muted-foreground">Enviando capa...</p>
            )}
          </div>

          {/* Editor Tiptap */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Corpo do Texto</label>
            <TiptapEditor content={corpo} onChange={setCorpo} />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/${colecao}`)}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : editando ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}