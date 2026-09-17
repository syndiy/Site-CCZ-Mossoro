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

export interface DenunciaResponse {
  idDenuncia: number;
  protocolo: string;
  dataCriacao: string;
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  descricao?: string;
  nomeDenunciante: string | null;
  numeroTelefone: string | null;
  imagem: string | null;
  idEndereco: number;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

export interface DenunciaUpdateRequest {
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  numeroTelefone: string | null;
  nomeDenunciante: string | null;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  localidade: string;
  uf: string;
}

export interface DenunciaPayload {
  tipoDeDenuncia: TipoDenuncia;
  descricao: string;
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
  latitude?: number;
  longitude?: number;
}

export type Denuncia = DenunciaResponse;
export type DenunciaDetalhe = DenunciaResponse;