"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GlobalConfigManager } from "@/components/admin/global-config-manager";

export default function ConfiguracoesPage() {
  return (
    <>
      <AdminPageHeader secao="Conteúdo do portal" titulo="Informações do CCZ" descricao="Endereço, horário, telefones e redes sociais exibidos em todo o portal." />
      <GlobalConfigManager />
    </>
  );
}
