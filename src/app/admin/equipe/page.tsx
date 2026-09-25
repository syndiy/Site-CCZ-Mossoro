"use client";

import { AdminPageHeader, SomenteAdministrador } from "@/components/admin/admin-page-header";
import { EditorsManager } from "@/components/admin/editors-manager";

export default function EquipePage() {
  return (
    <>
      <AdminPageHeader secao="Administração" titulo="Equipe editorial" descricao="Pessoas com acesso ao painel. Edite os dados ou remova quem não faz mais parte da equipe." />
      <SomenteAdministrador><EditorsManager /></SomenteAdministrador>
    </>
  );
}
