"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { criarUsuario } from "@/lib/api/usuarioApi";

export function RegisterEditorForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    CPF: "",
    password: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setSucesso(false);

    try {
      await criarUsuario(formData);
      setSucesso(true);
      // Limpar formulário após sucesso
      setFormData({
        username: "",
        email: "",
        phone: "",
        CPF: "",
        password: "",
      });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado ao realizar cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Cadastro de Editor</CardTitle>
          <CardDescription>
            Preencha seus dados para criar sua conta. Seu CPF deve estar previamente autorizado pelo administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {erro && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {sucesso && (
            <Alert className="mb-6 bg-emerald-50 text-emerald-900 border-emerald-200">
              <AlertDescription>
                Cadastro realizado com sucesso! Você já pode fazer login no painel.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium leading-none">
                Nome Completo
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Ex: João da Silva"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="CPF" className="text-sm font-medium leading-none">
                  CPF
                </label>
                <input
                  id="CPF"
                  name="CPF"
                  type="text"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="000.000.000-00"
                  value={formData.CPF}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium leading-none">
                  Telefone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Crie uma senha segura"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={carregando}>
              {carregando ? "Cadastrando..." : "Finalizar Cadastro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}