"use client";

import { useState } from "react";
import { AdminPageHeader, SomenteAdministrador } from "@/components/admin/admin-page-header";
import { EditorsManager } from "@/components/admin/editors-manager";
import { NovoEditorForm } from "@/components/admin/novo-editor-form";

export default function EquipePage() {
  // Troca a chave da lista para recarregá-la depois de criar uma conta.
  const [versao, setVersao] = useState(0);
  return (
    <>
      <AdminPageHeader secao="Administração" titulo="Equipe editorial" descricao="Pessoas com acesso ao painel. Crie contas para a equipe, edite os dados ou remova quem não faz mais parte dela." />
      <SomenteAdministrador>
        <NovoEditorForm onCriado={() => setVersao((v) => v + 1)} />
        <EditorsManager key={versao} />
      </SomenteAdministrador>
    </>
  );
}
