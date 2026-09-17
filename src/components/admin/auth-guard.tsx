"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api/apiClient";

/**
 * Impede que as telas do painel apareçam sem login.
 *
 * A checagem roda no navegador porque o site é exportado estaticamente: não há
 * servidor para barrar a rota antes de entregar o HTML. Ela evita que a equipe
 * caia numa tela quebrada, mas quem protege os dados é o backend, que exige o
 * token em toda chamada.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // "checando" ate o primeiro efeito rodar: no servidor nao existe localStorage,
  // entao o estado inicial nao pode afirmar nem negar o acesso.
  const [acesso, setAcesso] = useState<"checando" | "liberado">("checando");

  useEffect(() => {
    let ativo = true;
    void Promise.resolve().then(() => {
      if (!ativo) return;
      if (getToken()) {
        setAcesso("liberado");
      } else {
        router.replace("/login");
      }
    });
    return () => {
      ativo = false;
    };
  }, [router]);

  if (acesso === "checando") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Verificando seu acesso...
      </div>
    );
  }

  return <>{children}</>;
}
