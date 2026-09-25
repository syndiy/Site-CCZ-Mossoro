"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cadastrarFuncionarioPermitido, criarUsuario } from "@/lib/api/usuarioApi";

const vazio = { nome: "", email: "", cpf: "", telefone: "", senha: "" };
const campo = "mt-1.5 block h-10 w-full rounded-lg border bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-brand-600";

/**
 * O administrador cria a conta de quem vai usar o painel. Em uma ação só:
 * autoriza o CPF (se ainda não estiver) e cria o usuário com senha provisória,
 * que ele repassa à pessoa por um canal seguro.
 */
export function NovoEditorForm({ onCriado }: { onCriado: () => void }) {
  const [dados, setDados] = useState(vazio);
  const [aberto, setAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const mudar = (chave: keyof typeof vazio) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDados((atual) => ({ ...atual, [chave]: e.target.value }));

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const cpf = dados.cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return setErro("Informe um CPF com 11 dígitos.");
    if (dados.senha.length < 6) return setErro("A senha provisória precisa ter pelo menos 6 caracteres.");
    setSalvando(true);
    try {
      try {
        await cadastrarFuncionarioPermitido({ cpf, name: dados.nome.trim() });
      } catch (err) {
        // CPF já autorizado antes: segue para criar a conta.
        if (!(err instanceof Error && err.message.includes("já está autorizado"))) throw err;
      }
      await criarUsuario({ username: dados.nome.trim(), email: dados.email.trim(), phone: dados.telefone.trim(), cpf, password: dados.senha });
      toast.success(`Conta de ${dados.nome.trim()} criada. Passe o e-mail e a senha provisória por um canal seguro.`);
      setDados(vazio);
      setAberto(false);
      onCriado();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível criar a conta.");
    } finally {
      setSalvando(false);
    }
  }

  if (!aberto) {
    return (
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setAberto(true)}>
          <UserPlus className="size-4" /> Novo editor
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6 rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Novo editor</CardTitle>
        <p className="text-sm text-muted-foreground">O CPF é autorizado automaticamente. A pessoa entra com o e-mail e a senha provisória.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={criar} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium" htmlFor="novo-nome">Nome completo
            <input id="novo-nome" required value={dados.nome} onChange={mudar("nome")} className={campo} autoComplete="off" />
          </label>
          <label className="text-sm font-medium" htmlFor="novo-email">E-mail
            <input id="novo-email" type="email" required value={dados.email} onChange={mudar("email")} className={campo} autoComplete="off" />
          </label>
          <label className="text-sm font-medium" htmlFor="novo-cpf">CPF
            <input id="novo-cpf" required inputMode="numeric" placeholder="000.000.000-00" value={dados.cpf} onChange={mudar("cpf")} className={campo} autoComplete="off" />
          </label>
          <label className="text-sm font-medium" htmlFor="novo-telefone">Telefone
            <input id="novo-telefone" required inputMode="tel" placeholder="(84) 90000-0000" value={dados.telefone} onChange={mudar("telefone")} className={campo} autoComplete="off" />
          </label>
          <label className="text-sm font-medium sm:col-span-2" htmlFor="novo-senha">Senha provisória
            <input id="novo-senha" type="text" required minLength={6} maxLength={72} value={dados.senha} onChange={mudar("senha")} className={campo} autoComplete="new-password" />
          </label>
          {erro ? <p role="alert" className="text-sm text-destructive sm:col-span-2">{erro}</p> : null}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={salvando}>{salvando ? "Criando…" : "Criar conta"}</Button>
            <Button type="button" variant="outline" onClick={() => { setAberto(false); setErro(""); }}>Cancelar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
