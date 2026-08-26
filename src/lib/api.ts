export type TipoDenuncia =
  | "MAUS_TRATOS"
  | "BARATAS"
  | "RATOS"
  | "MORCEGOS"
  | "ANIMAIS_SINANTROPICOS";

export type StatusDenuncia =
  | "EM_ANALISE"
  | "VISITA_REALIZADA"
  | "CONCLUIDA"
  | "NAO_RESOLVIDA";

export type DenunciaPayload = {
  tipoDeDenuncia: TipoDenuncia;
  nomeDenunciante: string;
  numeroTelefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  imagem: File | null;
};

export type Denuncia = {
  id: number;
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  nomeDenunciante?: string;
  numeroTelefone?: string;
};

export type DenunciaDetalhe = {
  id?: number;
  idDenuncia?: number;
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  nomeDenunciante?: string;
  numeroTelefone?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  localidade?: string;
  uf?: string;
  imagem?: string;
};

const SIMULATE = process.env.NEXT_PUBLIC_SIMULATE === "1";
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const endpoint = (path: string) => `${API_BASE}${path}`;

export async function criarDenuncia(payload: DenunciaPayload): Promise<Denuncia> {
  if (SIMULATE) {
    await new Promise((r) => setTimeout(r, 700));
    return {
      id: Math.floor(1000 + Math.random() * 9000),
      tipoDeDenuncia: payload.tipoDeDenuncia,
      statusDenuncia: "EM_ANALISE",
      nomeDenunciante: payload.nomeDenunciante,
      numeroTelefone: payload.numeroTelefone,
    };
  }

  const form = new FormData();
  form.append("tipoDeDenuncia", payload.tipoDeDenuncia);
  form.append("statusDenuncia", "EM_ANALISE");
  form.append("nomeDenunciante", payload.nomeDenunciante);
  form.append("numeroTelefone", payload.numeroTelefone);
  form.append("cep", payload.cep);
  form.append("logradouro", payload.logradouro);
  form.append("numero", payload.numero);
  form.append("complemento", payload.complemento);
  form.append("bairro", payload.bairro);
  form.append("localidade", payload.localidade);
  form.append("uf", payload.uf);
  if (payload.imagem) {
    form.append("imagem", payload.imagem);
  }

  const res = await fetch(endpoint("/denuncia"), { method: "POST", body: form });
  if (!res.ok) {
    throw new Error(`Não foi possível enviar a denúncia (HTTP ${res.status}).`);
  }
  return (await res.json()) as Denuncia;
}

export async function buscarDenuncia(id: string): Promise<DenunciaDetalhe | null> {
  if (SIMULATE) {
    await new Promise((r) => setTimeout(r, 500));
    return { id: Number(id), tipoDeDenuncia: "MAUS_TRATOS", statusDenuncia: "EM_ANALISE" };
  }

  const res = await fetch(endpoint(`/denuncia/${encodeURIComponent(id)}`));
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Não foi possível consultar a denúncia (HTTP ${res.status}).`);
  }
  return (await res.json()) as DenunciaDetalhe;
}
