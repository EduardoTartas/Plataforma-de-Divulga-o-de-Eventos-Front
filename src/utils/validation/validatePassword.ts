export interface PasswordValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validatePassword(password: string = ""): PasswordValidationResult {
  const errors: Record<string, string> = {};

  if (!password) {
    errors.password = "A senha é obrigatória.";
  } else if (password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  } else if (!/[A-Z]/i.test(password)) {
    errors.password = "A senha deve conter pelo menos uma letra.";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "A senha deve conter pelo menos um número.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
