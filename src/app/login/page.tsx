"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUsuario } from "@/lib/api";

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
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Acesso Restrito</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Área exclusiva para funcionários do CCZ.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nome@mossoro.rn.gov.br"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {erro ? (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            ) : null}

            <Button type="submit" size="lg" disabled={carregando} className="mt-2 w-full">
              {carregando ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}