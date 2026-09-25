"use client";

import { AdminPageHeader, SomenteAdministrador } from "@/components/admin/admin-page-header";
import { AllowedEmployeesManager } from "@/components/admin/allowed-employees-manager";

export default function ServidoresPage() {
  return (
    <>
      <AdminPageHeader secao="Administração" titulo="Servidores autorizados" descricao="Só quem tem o CPF liberado aqui consegue criar conta de editor no painel." />
      <SomenteAdministrador><AllowedEmployeesManager /></SomenteAdministrador>
    </>
  );
}
