import { cookies } from "next/headers";
import { backendToken, sessionCookieName } from "@/lib/auth";
import { listDenuncias, type DenunciaResponse } from "@/lib/backend";
import { DenunciaBoard } from "@/components/denuncia-board";
import { ApiIndisponivel, LoginLocal } from "@/components/api-indisponivel";
import { BackLink } from "@/components/back-link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Denúncias recebidas | CCZ Mossoró" };

export default async function DenunciasPage() {
  const store = await cookies();
  const token = await backendToken(store.get(sessionCookieName)?.value);

  let denuncias: DenunciaResponse[] | null = null;
  let erro: unknown = null;

  if (token) {
    try {
      denuncias = await listDenuncias(token);
    } catch (problema) {
      erro = problema;
    }
  }

  return (
    <main className="page">
      <BackLink href="/">Voltar para o painel</BackLink>
      <header className="page-header">
        <p className="kicker">Atendimento</p>
        <h1>Denúncias recebidas</h1>
        <p className="muted">
          Cada denúncia enviada pelo site vira um protocolo. Mudar o andamento aqui é o que o
          cidadão vê quando consulta o protocolo dele.
        </p>
      </header>

      {!token ? (
        <LoginLocal />
      ) : erro ? (
        <ApiIndisponivel erro={erro} />
      ) : (
        <DenunciaBoard denuncias={denuncias ?? []} />
      )}
    </main>
  );
}
