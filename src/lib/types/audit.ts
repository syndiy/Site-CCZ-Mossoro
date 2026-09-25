export interface LogAtividade {
  id: number;
  usuario: string;
  acao: string;
  recurso: string;
  detalhes: string;
  ipOrigem: string;
  status: string;
  dataHora: string;
}

export interface PaginatedLogsResponse {
  content: LogAtividade[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}