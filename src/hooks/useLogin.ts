"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LoginParams {
  email: string;
  senha: string;
  callbackUrl?: string;
}

export default function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login({ email, senha, callbackUrl = "/meus_eventos" }: LoginParams) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        senha,
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Login realizado com sucesso", { autoClose: 1000 });
        // navegar para a rota desejada
        router.push(callbackUrl);
        return { ok: true };
      }

      const message = (res as any)?.error || "Credenciais inválidas";
      setError(message);
      toast.error(message);
      return { ok: false, error: message };
    } catch (err: any) {
      const message = err?.message || "Erro ao efetuar login";
      setError(message);
      toast.error(message);
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    login,
    isLoading,
    error,
  };
}
