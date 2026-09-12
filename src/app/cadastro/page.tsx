import { RegisterEditorForm } from "@/components/auth/register-editor-form";

export const metadata = {
  title: "Cadastro de Editor | CCZ",
  description: "Crie sua conta de editor no painel do CCZ.",
};

export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      {/* Aqui estamos chamando o componente que você já criou */}
      <RegisterEditorForm />
    </main>
  );
}