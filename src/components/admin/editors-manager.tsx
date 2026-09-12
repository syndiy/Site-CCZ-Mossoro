"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface EditorUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role?: string;
}

export function EditorsManager() {
  const [editores, setEditores] = useState<EditorUser[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Estado para edição
  const [editorEmEdicao, setEditorEmEdicao] = useState<EditorUser | null>(null);
  const [nomeForm, setNomeForm] = useState("");
  const [emailForm, setEmailForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Busca os editores no Backend
  const carregarEditores = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/users/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Falha ao carregar a lista de editores.");
      }

      const data = await res.json();
      // Se a resposta for paginada, use data.content, caso contrário use data
      const lista: EditorUser[] = Array.isArray(data) ? data : data.content || [];
      
      // Se necessário, você pode filtrar apenas os usuários com perfil/role de EDITOR
      setEditores(lista);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarEditores();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [carregarEditores]);

  // Função para Deletar
  async function handleDeletar(id: number) {
    if (!confirm("Tem certeza que deseja remover este editor?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Não foi possível excluir o editor.");
      }

      setEditores((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir editor.");
    }
  }

  // Prepara o formulário de edição
  function handleIniciarEdicao(editor: EditorUser) {
    setEditorEmEdicao(editor);
    setNomeForm(editor.name);
    setEmailForm(editor.email);
  }

  // Envia a atualização (PUT)
  async function handleSalvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editorEmEdicao) return;

    setSalvando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/users/${editorEmEdicao.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nomeForm,
          email: emailForm,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar o editor.");
      }

      const atualizado: EditorUser = await res.json();

      setEditores((prev) =>
        prev.map((item) => (item.id === editorEmEdicao.id ? { ...item, ...atualizado, name: nomeForm, email: emailForm } : item))
      );
      setEditorEmEdicao(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Card className="shadow-sm animate-in fade-in duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Editores Cadastrados</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {editores.length} editor{editores.length !== 1 ? "es" : ""} cadastrado{editores.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={carregarEditores} variant="outline" size="sm">
          Atualizar
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {erro && <div className="text-sm text-red-500 mb-2">{erro}</div>}

        {carregando ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Carregando lista de editores...
          </div>
        ) : editores.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum editor encontrado no sistema.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-bold tracking-wider border-b">
                <tr>
                  <th className="p-3.5">Nome</th>
                  <th className="p-3.5">E-mail</th>
                  <th className="p-3.5">CPF</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {editores.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-semibold text-foreground">{item.name}</td>
                    <td className="p-3.5">{item.email}</td>
                    <td className="p-3.5">{item.cpf || "-"}</td>
                    <td className="p-3.5 text-right flex justify-end gap-2">
                      <Button
                        onClick={() => handleIniciarEdicao(item)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeletar(item.id)}
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

      {/* Modal / Dialog de Edição Simples */}
      {editorEmEdicao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full border space-y-4">
            <h3 className="text-lg font-bold">Editar Editor</h3>
            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={nomeForm}
                  onChange={(e) => setNomeForm(e.target.value)}
                  className="w-full text-sm border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={emailForm}
                  onChange={(e) => setEmailForm(e.target.value)}
                  className="w-full text-sm border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditorEmEdicao(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}