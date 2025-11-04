
export interface EventFormValues {
  titulo?: string;
  descricao?: string;
  local?: string;
  dataInicio?: string;
  dataFim?: string; 
  link?: string;
  tags?: string[];
  categoria?: string;
  midia?: Array<{ midiTipo?: string; midiLink?: string }>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const isISODateString = (s?: string) => {
  if (!s) return false;
  // Tenta criar Date e verificar se é válido
  const d = new Date(s);
  return !Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s);
};

const isUrl = (s: string) => {
  try {
    const url = new URL(s);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export function validateEventForm(values: EventFormValues): ValidationResult {
  const errors: Record<string, string> = {};

  // Título
  if (!values.titulo || !values.titulo.trim()) {
    errors.titulo = 'O título é obrigatório.';
  } else if (values.titulo.trim().length < 3) {
    errors.titulo = 'O título deve ter ao menos 3 caracteres.';
  } else if (values.titulo.trim().length > 120) {
    errors.titulo = 'O título deve ter no máximo 120 caracteres.';
  }

  // Descrição
  if (!values.descricao || !values.descricao.trim()) {
    errors.descricao = 'A descrição é obrigatória.';
  } else if (values.descricao.trim().length < 10) {
    errors.descricao = 'A descrição deve ter ao menos 10 caracteres.';
  }

  // Local
  if (!values.local || !values.local.trim()) {
    errors.local = 'O local é obrigatório.';
  }

  // Datas
  if (!values.dataInicio) {
    errors.dataInicio = 'A data de início é obrigatória.';
  } else if (!isISODateString(values.dataInicio)) {
    errors.dataInicio = 'A data de início deve ser uma data válida (ISO).' ;
  }

  if (!values.dataFim) {
    errors.dataFim = 'A data de fim é obrigatória.';
  } else if (!isISODateString(values.dataFim)) {
    errors.dataFim = 'A data de fim deve ser uma data válida (ISO).';
  }

  if (!errors.dataInicio && !errors.dataFim && values.dataInicio && values.dataFim) {
    const start = new Date(values.dataInicio).getTime();
    const end = new Date(values.dataFim).getTime();
    if (end < start) {
      errors.dataFim = 'A data de fim não pode ser anterior à data de início.';
    }
  }

  // Link
  if (values.link && values.link.trim()) {
    if (!isUrl(values.link.trim())) {
      errors.link = 'O link informado não é uma URL válida (precisa começar com http(s)).';
    }
  }

  // Tags
  if (values.tags) {
    if (!Array.isArray(values.tags)) {
      errors.tags = 'Tags devem ser um array de strings.';
    } else if (values.tags.length > 10) {
      errors.tags = 'No máximo 10 tags são permitidas.';
    } else {
      for (let i = 0; i < values.tags.length; i++) {
        const t = values.tags[i];
        if (!t || !t.trim()) {
          errors[`tags.${i}`] = 'Tag inválida.';
          break;
        }
      }
    }
  }

  // Categoria
  if (!values.categoria || !values.categoria.trim()) {
    errors.categoria = 'A categoria é obrigatória.';
  }

  // Mídia (se houver)
  if (values.midia) {
    if (!Array.isArray(values.midia)) {
      errors.midia = 'Mídia deve ser um array.';
    } else {
      for (let i = 0; i < values.midia.length; i++) {
        const m = values.midia[i];
        if (!m) continue;
        if (m.midiLink && !isUrl(m.midiLink)) {
          errors[`midia.${i}.midiLink`] = 'Link de mídia inválido.';
          break;
        }
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Funções utilitárias mais pequenas para validações pontuais
export function validateEmail(email?: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(pw?: string): ValidationResult {
  const errors: Record<string, string> = {};
  if (!pw) {
    errors.password = 'Senha obrigatória.';
    return { isValid: false, errors };
  }
  if (pw.length < 6) {
    errors.password = 'A senha deve ter ao menos 6 caracteres.';
    return { isValid: false, errors };
  }
  return { isValid: true, errors: {} };
}

export function validateLoginForm(values: { email?: string; password?: string; remember?: boolean }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!values.email || !validateEmail(values.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  const pwRes = validatePassword(values.password);
  if (!pwRes.isValid) Object.assign(errors, pwRes.errors);

  return { isValid: Object.keys(errors).length === 0, errors };
}


