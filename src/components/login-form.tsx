"use client"

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateLoginForm } from "@/utils/validation";
import useLogin from "@/hooks/useLogin";

type LoginFormProps = React.HTMLAttributes<HTMLDivElement>;

export function LoginForm({ className, ...props }: LoginFormProps) {

  const { login, isLoading } = useLogin();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const validation = validateLoginForm({ email, senha });

    if (!validation.success) {
      const msgEmail = validation.errors.email?.[0];
      const msgSenha = validation.errors.senha?.[0];

      if (msgEmail) alert(msgEmail);
      if (msgSenha) alert(msgSenha);
      return;
    }

    await login({
      email,
      senha,
      remember,
      callbackUrl: "/meus_eventos"
    });
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 px-6", className)} {...props}>

      <Card className="w-[550px] shadow-2xl bg-white dark:bg-gray-400 rounded-2xl">
        <CardHeader className="text-center pt-12">
          <CardTitle className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
            <img src="/ifro-events-icon.svg" alt="IFRO EVENTS" className="w-32 mx-auto mb-6" />
          </CardTitle>
        </CardHeader>

        <CardContent className="p-14">
          <form className="flex flex-col gap-10" onSubmit={handleSubmit}>

            <div className="flex flex-col gap-4">
              <Label htmlFor="email" className="text-2xl font-medium text-gray-700 dark:text-gray-200">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="!text-2xl py-5 rounded-lg border-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label htmlFor="password" className="text-2xl font-medium text-gray-700 dark:text-gray-200">
                Senha
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="!text-2xl py-5 rounded-lg border-2 pr-20"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>

              <a href="/recuperar_senha" className="self-end text-blue-600 dark:text-blue-300 text-xl mt-2">
                Esqueceu a senha?
              </a>
            </div>

            <div className="flex items-center gap-5 mt-2">
              <input
                id="remember"
                type="checkbox"
                className="h-7 w-7 rounded"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <Label htmlFor="remember" className="text-xl text-gray-700 dark:text-gray-200">
                Lembrar-me
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-7 text-3xl rounded-lg mt-10"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-xl text-gray-700 dark:text-gray-200 mt-10">
              Não tem uma conta?{" "}
              <a href="/cadastro" className="text-blue-600 dark:text-blue-400 font-semibold">
                Criar conta
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
