"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DenunciasManager } from "@/components/admin/denuncias-manager";

export default function OcorrenciasPage() {
  return (
    <>
      <AdminPageHeader secao="Atendimento" titulo="Ocorrências" descricao="Relatos enviados pela população. Abra cada um para ver os detalhes e atualizar o andamento." />
      <DenunciasManager />
    </>
  );
}
