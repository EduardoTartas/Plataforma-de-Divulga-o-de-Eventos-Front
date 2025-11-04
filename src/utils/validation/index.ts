

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

// validadores pontuais
export { validateEmail } from '../validation/validateEmail';
export { validatePassword } from '../validation/validatePassword';

// validadores de formulário
export { validateLoginForm } from '../validation/validateLooginForm';
export { validateRegisterForm } from '../validation/validateRegisterForm';
export { validateRecoverPasswordForm } from '../validation/validateRecoverPasswordForm';

