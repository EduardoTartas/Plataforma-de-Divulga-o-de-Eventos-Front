import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(3, "A senha deve ter no mínimo 3 caracteres"),
});

type LoginData = {
  email: string;
  senha: string;
};

type ValidationResult =
  | { success: true }
  | {
      success: false;
      errors: Record<string, string[]>;
    };

export function validateLoginForm(data: LoginData): ValidationResult {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, errors };
  }

  return { success: true };
}
