import type { DenunciaResponse, StatusDenuncia, TipoDenuncia } from "./backend";

export const tiposDenuncia: Record<TipoDenuncia, string> = {
  MAUS_TRATOS: "Maus-tratos",
  BARATAS: "Baratas",
  RATOS: "Ratos",
  MORCEGOS: "Morcegos",
  ANIMAIS_SINANTROPICOS: "Animais sinantrópicos",
};

export const statusDenuncia: Record<StatusDenuncia, string> = {
  EM_ANALISE: "Em análise",
  VISITA_REALIZADA: "Visita realizada",
  CONCLUIDA: "Concluída",
  NAO_RESOLVIDA: "Não resolvida",
};

/** Ordem de trabalho: o que espera alguem vem primeiro. */
export const ordemStatus: StatusDenuncia[] = [
  "EM_ANALISE",
  "VISITA_REALIZADA",
  "NAO_RESOLVIDA",
  "CONCLUIDA",
];

/** So EM_ANALISE cobra acao; o resto ja passou pela equipe. */
export const statusAberto = (status: StatusDenuncia) => status === "EM_ANALISE";

export function formatarEndereco(denuncia: DenunciaResponse): string {
  const linha = [denuncia.logradouro, denuncia.numero].filter(Boolean).join(", ");
  const complemento = denuncia.complemento?.trim();
  const cidade = [denuncia.localidade, denuncia.uf].filter(Boolean).join("/");

  return [linha, complemento, denuncia.bairro, cidade, denuncia.cep]
    .map((parte) => parte?.trim())
    .filter(Boolean)
    .join(" · ");
}

export function formatarTelefone(valor: string | null): string {
  const digitos = (valor ?? "").replace(/\D/g, "");
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return valor ?? "";
}

/** Protocolo e o id, do jeito que o cidadao ve na tela de consulta do site. */
export const formatarProtocolo = (id: number) => String(id).padStart(4, "0");

export function contarPorStatus(denuncias: DenunciaResponse[]): Record<StatusDenuncia, number> {
  const contagem: Record<StatusDenuncia, number> = {
    EM_ANALISE: 0,
    VISITA_REALIZADA: 0,
    CONCLUIDA: 0,
    NAO_RESOLVIDA: 0,
  };
  for (const denuncia of denuncias) {
    if (denuncia.statusDenuncia in contagem) contagem[denuncia.statusDenuncia] += 1;
  }
  return contagem;
}
