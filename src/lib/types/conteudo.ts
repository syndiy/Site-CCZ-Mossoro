export type ColecaoConteudo = "noticias" | "artigos";
export type StatusConteudo = "RASCUNHO" | "PUBLICADO";

export interface ConteudoListResponse {
  titulo: string;
  slug: string;
  status: StatusConteudo;
  dataModificacao: string;
  modificadoPor: string;
  colecao?: ColecaoConteudo;
}

export interface ConteudoCompletoResponse {
  titulo: string;
  slug: string;
  corpo: string;
  imagemCapaUrl: string;
  status: StatusConteudo;
  ordemDestaque: number | null;
  dataModificacao: string;
  dataPublicacao: string | null;
}

export interface ConteudoRequest {
  titulo: string;
  corpo: string;
  imagemCapaUrl: string | null;
}

export interface DestaqueItem {
  id: number;
  titulo: string;
  tipo: "NOTICIA" | "ARTIGO";
  ordem: number;
}