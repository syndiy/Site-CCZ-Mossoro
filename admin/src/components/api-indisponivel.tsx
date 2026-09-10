import { BackendError } from "@/lib/backend";

/**
 * Explica por que a tela nao carregou. Vale a pena separar os casos: enquanto o
 * backend nao liberar a rota de denuncias no SecurityConfig, o erro e sempre 403 e
 * nao adianta a equipe tentar de novo.
 */
export function ApiIndisponivel({ erro }: { erro: unknown }) {
  const status = erro instanceof BackendError ? erro.status : null;

  if (status === 0) {
    return (
      <div className="card aviso-api">
        <h2>Servidor fora do ar</h2>
        <p className="muted">
          Não deu para falar com a API das denúncias. Verifique se o backend está rodando e
          recarregue a página.
        </p>
      </div>
    );
  }

  if (status === 401 || status === 403) {
    return (
      <div className="card aviso-api">
        <h2>A API ainda não liberou esta rota</h2>
        <p className="muted">
          O servidor recusou a consulta às denúncias. No backend, a cadeia do
          <code> SecurityConfig </code> termina em <code>anyRequest().denyAll()</code> e nenhuma
          regra cobre <code>/denuncia</code>, então a rota fica fechada até para quem está logado.
        </p>
        <p className="muted">
          Esta tela volta a funcionar assim que a regra for adicionada — não há nada a mudar aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="card aviso-api">
      <h2>Não foi possível carregar</h2>
      <p className="muted">
        A API respondeu com erro{status ? ` (HTTP ${status})` : ""}. Tente de novo em instantes.
      </p>
    </div>
  );
}

export function LoginLocal() {
  return (
    <div className="card aviso-api">
      <h2>Disponível só com o login da equipe</h2>
      <p className="muted">
        As denúncias vêm da API, e o editor está no modo de senha local. Defina
        <code> CCZ_API_URL </code> e <code>CCZ_JWT_SECRET</code> para entrar com o usuário do
        backend e acompanhar as denúncias.
      </p>
    </div>
  );
}
