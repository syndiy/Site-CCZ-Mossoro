"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AllowedEmployeesManager } from "@/components/admin/allowed-employees-manager"; 
import { DenunciasManager } from "@/components/admin/denuncias-manager";
import { EditorsManager } from "@/components/admin/editors-manager";
// 1. Importação adicionada
import { GlobalConfigManager } from "@/components/admin/global-config-manager"; 
import { useAdminSession } from "@/components/admin/auth-guard";

export default function AdminDashboard() {
  const router = useRouter();
  const session = useAdminSession();
  const isAdministrator = session?.roles.includes("ROLE_ADMINISTRATOR");
  const [autorizado, setAutorizado] = useState(false);
  
  // 2. Estado atualizado para incluir "configuracoes"
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
    <div className="bg-muted/30 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Painel do CCZ</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Centro de Controle de Zoonoses — Sistema de Gestão
            </p>
          </div>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            Encerrar Sessão
          </Button>
        </header>

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
          {isAdministrator && <button
            onClick={() => setAbaAtiva("servidores")}
            className={`pb-3 border-b-2 transition-colors ${
              abaAtiva === "servidores" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Servidores Autorizados
          </button>}
          {isAdministrator && <button
            onClick={() => setAbaAtiva("editores")}
            className={`pb-3 border-b-2 transition-colors ${
              abaAtiva === "editores" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Editores Cadastrados
          </button>}
          
          {/* 3. Botão do menu adicionado */}
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

        {abaAtiva === "denuncias" && <DenunciasManager />}

        {isAdministrator && abaAtiva === "servidores" && (
          <div className="animate-in fade-in duration-300">
            <AllowedEmployeesManager />
          </div>
        )}

        {isAdministrator && abaAtiva === "editores" && (
          <div className="animate-in fade-in duration-300">
            <EditorsManager />
          </div>
        )}

        {/* 4. Renderização do componente adicionada */}
        {abaAtiva === "configuracoes" && (
          <div className="animate-in fade-in duration-300">
            <GlobalConfigManager />
          </div>
        )}
      </div>
    </div>
  );
}
