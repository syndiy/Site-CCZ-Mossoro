import { cookies } from "next/headers";
import { backendToken, sessionCookieName } from "@/lib/auth";
import { getDenuncia, type DenunciaResponse } from "@/lib/backend";
import { ApiIndisponivel, LoginLocal } from "@/components/api-indisponivel";
import { BackLink } from "@/components/back-link";
import { StatusPicker } from "@/components/status-picker";
import {
  formatarEndereco,
  formatarProtocolo,
  formatarTelefone,
  statusDenuncia,
  tiposDenuncia,
} from "@/lib/denuncias";

export const dynamic = "force-dynamic";

export default async function DenunciaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numero = Number(id);
  const store = await cookies();
  const token = await backendToken(store.get(sessionCookieName)?.value);

  let denuncia: DenunciaResponse | null = null;
  let erro: unknown = null;

  if (token && Number.isFinite(numero)) {
    try {
      denuncia = await getDenuncia(token, numero);
    } catch (problema) {
      erro = problema;
    }
  }

  return (
    <main className="page page-detalhe">
      <BackLink href="/denuncias">Voltar para as denúncias</BackLink>

      {!token ? (
        <LoginLocal />
      ) : erro || !denuncia ? (
        <ApiIndisponivel erro={erro} />
      ) : (
        <>
          <header className="page-header">
            <p className="kicker">Protocolo {formatarProtocolo(denuncia.idDenuncia)}</p>
            <h1>{tiposDenuncia[denuncia.tipoDeDenuncia]}</h1>
            <p className="muted">
              Andamento atual: {statusDenuncia[denuncia.statusDenuncia]}
            </p>
          </header>

          <div className="detalhe-grade">
            <div className="card">
              <h2 className="detalhe-titulo">Ocorrência</h2>
              <dl className="detalhe-dados">
                <dt>Endereço</dt>
                <dd>{formatarEndereco(denuncia) || "Não informado"}</dd>
                <dt>Quem denunciou</dt>
                <dd>{denuncia.nomeDenunciante?.trim() || "Sem identificação"}</dd>
                <dt>Telefone</dt>
                <dd>
                  {denuncia.numeroTelefone ? (
                    <a href={`tel:${denuncia.numeroTelefone.replace(/\D/g, "")}`}>
                      {formatarTelefone(denuncia.numeroTelefone)}
                    </a>
                  ) : (
                    "Não informado"
                  )}
                </dd>
              </dl>

              <StatusPicker id={denuncia.idDenuncia} atual={denuncia.statusDenuncia} />
            </div>

            <div className="card">
              <h2 className="detalhe-titulo">Foto enviada</h2>
              {denuncia.imagem ? (
                <img
                  className="detalhe-foto"
                  src={denuncia.imagem}
                  alt={`Foto enviada na denúncia de ${tiposDenuncia[denuncia.tipoDeDenuncia].toLowerCase()}`}
                />
              ) : (
                <p className="muted">Esta denúncia veio sem foto.</p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
