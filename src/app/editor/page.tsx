"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AllowedEmployeesManager } from "@/components/admin/allowed-employees-manager"; 
import { DenunciasManager } from "@/components/admin/denuncias-manager";
import { EditorsManager } from "@/components/admin/editors-manager";
import { GlobalConfigManager } from "@/components/admin/global-config-manager"; // <-- Importe aqui

export default function AdminDashboard() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  // Atualize o tipo do estado para incluir "configuracoes"
  const [abaAtiva, setAbaAtiva] = useState<"denuncias" | "servidores" | "editores" | "configuracoes">("denuncias");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        setAutorizado(true);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (!autorizado) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Autenticando permissões de acesso...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel do CCZ (Admin)</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Centro de Controle de Zoonoses — Sistema de Gestão
            </p>
          </div>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            Encerrar Sessão
          </Button>
        </header>

        {/* Menu de Abas */}
        <div className="flex border-b gap-6 text-sm font-medium overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setAbaAtiva("denuncias")}
            className={`pb-3 border-b-2 transition-colors ${
              abaAtiva === "denuncias" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Gestão de Ocorrências
          </button>
          <button
            onClick={() => setAbaAtiva("servidores")}
            className={`pb-3 border-b-2 transition-colors ${
              abaAtiva === "servidores" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Servidores Autorizados
          </button>
          <button
            onClick={() => setAbaAtiva("editores")}
            className={`pb-3 border-b-2 transition-colors ${
              abaAtiva === "editores" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Editores Cadastrados
          </button>
          <button
            onClick={() => setAbaAtiva("configuracoes")}
            className={`pb-3 border-b-2 transition-colors ${
              abaAtiva === "configuracoes" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Configurações Globais
          </button>
        </div>

        {/* Renderização Condicional das Abas */}
        {abaAtiva === "denuncias" && <DenunciasManager />}

        {abaAtiva === "servidores" && (
          <div className="animate-in fade-in duration-300">
            <AllowedEmployeesManager />
          </div>
        )}

        {abaAtiva === "editores" && (
          <div className="animate-in fade-in duration-300">
            <EditorsManager />
          </div>
        )}

        {abaAtiva === "configuracoes" && (
          <div className="animate-in fade-in duration-300">
            <GlobalConfigManager />
          </div>
        )}
      </div>
    </div>
  );
}