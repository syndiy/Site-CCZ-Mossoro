"use client";

import { AdminPageHeader, SomenteAdministrador } from "@/components/admin/admin-page-header";
import { AuditoriaManager } from "@/components/admin/auditoria-manager";

export default function AuditoriaPage() {
  return (
    <>
      <AdminPageHeader secao="Administração" titulo="Trilha de auditoria" descricao="Registro das ações feitas no sistema: quem fez, o quê, quando e de onde." />
      <SomenteAdministrador><AuditoriaManager /></SomenteAdministrador>
    </>
  );
}
