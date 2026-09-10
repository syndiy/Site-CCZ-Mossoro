import { backendLoginEnabled, loginEnabled } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar | CCZ Mossoró" };

export default function LoginPage() {
  const comBackend = backendLoginEnabled();

  return (
    <div className="page page-narrow">
      <h1>Acessar o editor</h1>
      <p className="muted">
        {comBackend
          ? "Área restrita à equipe do CCZ. Entre com o e-mail e a senha do seu usuário."
          : "Área restrita à equipe do CCZ. Informe a senha para gerenciar artigos e notícias."}
      </p>
      {loginEnabled() ? (
        <LoginForm withEmail={comBackend} />
      ) : (
        <div className="card">
          <p className="error">
            Configure CCZ_API_URL e CCZ_JWT_SECRET para usar o login da equipe, ou ADMIN_PASSWORD
            para o acesso local provisório.
          </p>
        </div>
      )}
    </div>
  );
}
