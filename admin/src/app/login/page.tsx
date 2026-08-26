import { adminPasswordConfigured } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar · CCZ Mossoró" };

export default function LoginPage() {
  return (
    <div className="page page-narrow">
      <h1>Acessar o editor</h1>
      <p className="muted">
        Área restrita à equipe do CCZ. Informe a senha para gerenciar artigos e notícias.
      </p>
      {adminPasswordConfigured() ? (
        <LoginForm />
      ) : (
        <div className="card">
          <p className="error">
            Defina a variável de ambiente ADMIN_PASSWORD no servidor para habilitar o acesso.
          </p>
        </div>
      )}
    </div>
  );
}
