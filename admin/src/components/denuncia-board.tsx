"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { DenunciaResponse, StatusDenuncia, TipoDenuncia } from "@/lib/backend";
import {
  contarPorStatus,
  formatarEndereco,
  formatarProtocolo,
  formatarTelefone,
  ordemStatus,
  statusAberto,
  statusDenuncia,
  tiposDenuncia,
} from "@/lib/denuncias";
import { alterarStatus } from "@/app/denuncias/actions";

type Filtro = StatusDenuncia | "TODAS";

export function DenunciaBoard({ denuncias }: { denuncias: DenunciaResponse[] }) {
  const [filtro, setFiltro] = useState<Filtro>("EM_ANALISE");
  const [tipo, setTipo] = useState<TipoDenuncia | "TODOS">("TODOS");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const contagem = useMemo(() => contarPorStatus(denuncias), [denuncias]);

  const visiveis = useMemo(
    () =>
      denuncias
        .filter((d) => filtro === "TODAS" || d.statusDenuncia === filtro)
        .filter((d) => tipo === "TODOS" || d.tipoDeDenuncia === tipo)
        .sort((a, b) => b.idDenuncia - a.idDenuncia),
    [denuncias, filtro, tipo],
  );

  function mudarStatus(id: number, proximo: StatusDenuncia) {
    setErro(null);
    setSalvando(id);
    startTransition(async () => {
      const resultado = await alterarStatus(id, proximo);
      setSalvando(null);
      if (resultado.error) setErro(resultado.error);
    });
  }

  return (
    <>
      <div className="triagem-filtros">
        <div className="filtro-chips" role="group" aria-label="Filtrar por andamento">
          <FiltroChip
            ativo={filtro === "TODAS"}
            onClick={() => setFiltro("TODAS")}
            rotulo="Todas"
            total={denuncias.length}
          />
          {ordemStatus.map((status) => (
            <FiltroChip
              key={status}
              ativo={filtro === status}
              onClick={() => setFiltro(status)}
              rotulo={statusDenuncia[status]}
              total={contagem[status]}
              destaque={statusAberto(status)}
            />
          ))}
        </div>

        <label className="filtro-tipo">
          <span>Tipo</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoDenuncia | "TODOS")}>
            <option value="TODOS">Todos os tipos</option>
            {(Object.keys(tiposDenuncia) as TipoDenuncia[]).map((valor) => (
              <option key={valor} value={valor}>
                {tiposDenuncia[valor]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {erro ? (
        <p className="error" role="alert">
          {erro}
        </p>
      ) : null}

      {visiveis.length === 0 ? (
        <p className="triagem-vazio">
          {denuncias.length === 0
            ? "Nenhuma denúncia recebida até agora."
            : "Nenhuma denúncia com esses filtros."}
        </p>
      ) : (
        <ul className="triagem-lista">
          {visiveis.map((denuncia) => (
            <li key={denuncia.idDenuncia} className="denuncia-row">
              <div className="denuncia-topo">
                <Link href={`/denuncias/${denuncia.idDenuncia}`} className="denuncia-protocolo">
                  Protocolo {formatarProtocolo(denuncia.idDenuncia)}
                </Link>
                <span className="denuncia-tipo">{tiposDenuncia[denuncia.tipoDeDenuncia]}</span>
                <label className="denuncia-status">
                  <span className="sr-only">
                    Andamento do protocolo {formatarProtocolo(denuncia.idDenuncia)}
                  </span>
                  <select
                    value={denuncia.statusDenuncia}
                    disabled={salvando === denuncia.idDenuncia}
                    onChange={(e) =>
                      mudarStatus(denuncia.idDenuncia, e.target.value as StatusDenuncia)
                    }
                  >
                    {ordemStatus.map((status) => (
                      <option key={status} value={status}>
                        {statusDenuncia[status]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="denuncia-pessoa">
                {denuncia.nomeDenunciante?.trim() || "Sem identificação"}
                {denuncia.numeroTelefone ? (
                  <>
                    {" · "}
                    <a href={`tel:${denuncia.numeroTelefone.replace(/\D/g, "")}`}>
                      {formatarTelefone(denuncia.numeroTelefone)}
                    </a>
                  </>
                ) : null}
              </p>

              <p className="denuncia-endereco">{formatarEndereco(denuncia) || "Sem endereço"}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function FiltroChip({
  ativo,
  onClick,
  rotulo,
  total,
  destaque = false,
}: {
  ativo: boolean;
  onClick: () => void;
  rotulo: string;
  total: number;
  destaque?: boolean;
}) {
  return (
    <button
      type="button"
      className={`filtro-chip${ativo ? " ativo" : ""}${destaque && total > 0 ? " destaque" : ""}`}
      aria-pressed={ativo}
      onClick={onClick}
    >
      {rotulo}
      <span className="filtro-total">{total}</span>
    </button>
  );
}
