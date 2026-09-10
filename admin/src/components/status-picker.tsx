"use client";

import { useState, useTransition } from "react";
import type { StatusDenuncia } from "@/lib/backend";
import { ordemStatus, statusDenuncia } from "@/lib/denuncias";
import { alterarStatus } from "@/app/denuncias/actions";

export function StatusPicker({ id, atual }: { id: number; atual: StatusDenuncia }) {
  const [valor, setValor] = useState<StatusDenuncia>(atual);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [pendente, startTransition] = useTransition();

  function mudar(proximo: StatusDenuncia) {
    const anterior = valor;
    setValor(proximo);
    setErro(null);
    setSalvo(false);

    startTransition(async () => {
      const resultado = await alterarStatus(id, proximo);
      if (resultado.error) {
        setValor(anterior);
        setErro(resultado.error);
        return;
      }
      setSalvo(true);
    });
  }

  return (
    <div className="status-picker">
      <label className="field-label" htmlFor="andamento">
        Mudar andamento
      </label>
      <select
        id="andamento"
        value={valor}
        disabled={pendente}
        onChange={(e) => mudar(e.target.value as StatusDenuncia)}
      >
        {ordemStatus.map((status) => (
          <option key={status} value={status}>
            {statusDenuncia[status]}
          </option>
        ))}
      </select>
      <p className="status-recado" role="status">
        {pendente ? "Registrando…" : salvo ? "Andamento registrado." : ""}
      </p>
      {erro ? (
        <p className="error" role="alert">
          {erro}
        </p>
      ) : null}
    </div>
  );
}
