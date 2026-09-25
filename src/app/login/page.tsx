"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUsuario } from "@/lib/api/usuarioApi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const token = await loginUsuario(email, password);
      
      localStorage.setItem("token", token);
      
      router.push("/admin"); 
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao tentar fazer login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AuthLayout titulo="Entrar no painel" descricao="Use o e-mail e a senha cadastrados pelo CCZ.">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nome@mossoro.rn.gov.br"
            className="h-11 bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 bg-white"
          />
        </div>

        {erro ? (
          <Alert variant="destructive">
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" size="lg" disabled={carregando} className="mt-1 h-11 w-full">
          {carregando ? "Entrando…" : "Entrar"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Primeiro acesso?{" "}
          <Link href="/cadastro" className="font-medium text-brand-800 underline underline-offset-4">
            Crie sua conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
