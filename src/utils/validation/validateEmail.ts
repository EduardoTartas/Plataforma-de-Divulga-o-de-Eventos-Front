export function validateEmail(email: string): string | null {
  if (!email) return "O e-mail é obrigatório";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) return "Digite um e-mail válido";

  return null;
}
