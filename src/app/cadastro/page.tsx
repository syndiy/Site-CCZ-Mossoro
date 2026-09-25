import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterEditorForm } from "@/components/auth/register-editor-form";

export const metadata = {
  title: "Cadastro de Editor | CCZ",
  description: "Crie sua conta de editor no painel do CCZ.",
};

export default function CadastroPage() {
  return (
    <AuthLayout titulo="Criar conta de editor" descricao="Seu CPF precisa ter sido autorizado antes pelo administrador do CCZ.">
      <RegisterEditorForm />
    </AuthLayout>
  );
}
