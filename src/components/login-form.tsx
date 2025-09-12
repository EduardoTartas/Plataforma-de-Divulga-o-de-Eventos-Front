import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Bem-Vindo</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Acesso ao Ifro Events
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Input id="email" type="email" placeholder="Usuário:" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
          </div>
          <Input id="password" type="password" placeholder="Senha:" required />
          <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
        </div>
        <Button type="submit" className="w-full bg-[#5E5CB0]">
          Login
        </Button>
        
      </div>
      <div className="text-center text-sm">
        Não possui uma conta?{" "}
        <Link href="/cadastro" className="underline underline-offset-4">
          Inscreva-se
        </Link>
      </div>
    </form>
  )
}
