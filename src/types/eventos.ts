// Tipo para o organizador do evento
export interface Organizador {
  _id: string;
  nome: string;
}

// Tipo para permissões de usuário
export interface Permissao {
  usuario: string;
  permissao: string;
  expiraEm: string;
}

// Tipo para um evento individual
export interface Evento {
  organizador: Organizador;
  _id: string;
  titulo: string;
  descricao: string;
  local: string;
  dataInicio: string;
  dataFim: string;
  link?: string;
  tags: string[];
  categoria: string;
  cor: number;
  animacao: number;
  status: number;
  midia: any[];
  permissoes: Permissao[];
  createdAt?: string;
  updatedAt: string;
}

// Tipo para os dados paginados
export interface EventosData {
  docs: Evento[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Tipo para a resposta completa da API
export interface EventosApiResponse {
  error: boolean;
  code: number;
  message: string;
  data: EventosData;
  errors: any[];
}

export interface EventoMidia {
  midiTipo: string;
  midiLink: string;
}

export interface EventoTotem {
  _id: string;
  titulo: string;
  descricao: string;
  local: string;
  dataInicio: string;
  dataFim: string;
  midia: EventoMidia[];
  cor: number;
  animacao: number;
  categoria: string;
  tags: string[];
  link?: string;
}

export interface EventosTotemApiResponse {
  error: boolean;
  code: number;
  message: string;
  data: EventoTotem[];
  errors: any[];
} 