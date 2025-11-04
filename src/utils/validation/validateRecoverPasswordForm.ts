import { validateEmail } from "./validateEmail";

interface RecoverPasswordValues {
  email?: string;
}

interface ValidationResult {
  success: boolean;
  errors: { email?: string };
}

export function validateRecoverPasswordForm(values: RecoverPasswordValues): ValidationResult {
  const errors: { email?: string } = {};

  // Se o usuário não digitou nada
  if (!values.email || !values.email.trim()) {
    errors.email = "Informe seu e-mail.";
  }
  // Se digitou mas é inválido
  else if (!validateEmail(values.email)) {
    errors.email = "Digite um e-mail válido.";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors
  };
}
