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

export interface DenunciaProtocoloResponse {
  idDenuncia: number;
  protocolo: string;
  dataCriacao: string;
  tipoDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
}

export interface DenunciaDetalhadaResponse {
  id: number;
  idDenuncia: number;
  protocolo: string;
  descricao: string;
  tipoDeDenuncia: TipoDenuncia;
  statusDenuncia: StatusDenuncia;
  nomeDenunciante?: string;
  numeroTelefone?: string;
  fonte: string;
  createdAt: string;
  dataCriacao: string;
  nomeFoto?: string;
  imagem?: string;
  rua: string;
  numero?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep?: string;
  complemento?: string | null;
  endereco?: {
    id: number;
    logradouro: string;
    numero?: string;
    bairro?: string;
    localidade: string;
    uf: string;
    cep?: string;
    complemento?: string | null;
  };
}

export interface Denuncia {
  id?: string | number;
  protocolo: string;
  statusDenuncia: string;
  tipoDeDenuncia?: string;
  descricao?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  createdAt?: string;
}

export type DenunciaDetalhe = Denuncia;