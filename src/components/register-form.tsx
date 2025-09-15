import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-light">Cadastro</h1>
        <p className="text-muted-foreground text-sm">
          Preencha seus dados para começar
        </p>
      </div>

      <div className="grid gap-4">
        <div className="relative flex items-center">
          <img
            src="/user.svg"
            alt="Ícone de usuário"
            className="absolute left-3 h-4 w-4 opacity-50"
          />
          <Input
            id="username"
            type="text"
            placeholder="Nome do Usuário"
            required
            className="pl-9"
          />
        </div>

        <div className="relative flex items-center">
          <img
            src="/email.svg"
            alt="Ícone de e-mail"
            className="absolute left-3 h-4 w-4 opacity-50"
          />
          <Input
            id="email"
            type="email"
            placeholder="E-mail"
            required
            className="pl-9"
          />
        </div>

        <div className="relative flex items-center">
          <img
            src="/lock.svg"
            alt="Ícone de senha"
            className="absolute left-3 h-4 w-4 opacity-50"
          />
          <Input
            id="password"
            type="password"
            placeholder="Senha"
            required
            className="pl-9"
          />
        </div>

        <div className="relative flex items-center">
          <img
            src="/lock.svg"
            alt="Ícone de senha"
            className="absolute left-3 h-4 w-4 opacity-50"
          />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            required
            className="pl-9"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Cadastrar
      </Button>
    </form>
  );
}