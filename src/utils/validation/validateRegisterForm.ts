import { validateEmail, validatePassword } from "../validation/index";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateRegisterForm(values: {
  nome?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Nome
  if (!values.nome || !values.nome.trim()) {
    errors.nome = "Nome obrigatório.";
  } else if (values.nome.trim().length < 3) {
    errors.nome = "O nome deve ter ao menos 3 caracteres.";
  } else if (values.nome.trim().length > 100) {
    errors.nome = "O nome deve ter no máximo 100 caracteres.";
  }

  // Email
  if (!values.email || !validateEmail(values.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  // Senha
  const pwRes = validatePassword(values.password);
  if (!pwRes.isValid) Object.assign(errors, pwRes.errors);

  // Confirmar senha
  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = "As senhas não conferem.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
