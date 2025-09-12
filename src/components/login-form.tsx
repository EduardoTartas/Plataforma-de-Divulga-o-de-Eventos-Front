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
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[60px] ml-[170px] w-[307px] text-[#5E5CB0] font-light">Bem-Vindo</h1>
        <p className="ml-[170px] w-[307px] text-sm text-balance text-[#F17A86] text-[25px]">
          Acesso ao Ifro Events
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Input id="email" type="email" placeholder="Usuário:" className="text-[#7490EA] text-[20px] placeholder:text-[#7490EA] placeholder:text-[20px] w-[534px] h-[56.99px] focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus:border-transparent" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
          </div>
          <Input id="password" type="password" placeholder="Senha:" className="text-[#7490EA] text-[20px] placeholder:text-[#7490EA] placeholder:text-[20px] w-[534px] h-[56.99px] focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none focus:border-transparent" required />
          <a
            href="#"
            className="ml-auto text-sm underline-offset-4 hover:underline text-[#7490EA]"
          >
            Esqueceu sua senha?
          </a>
        </div>
        <Button type="submit" className="w-[307px] h-[75.91px] ml-[115px] bg-[#5E5CB0] hover:bg-[#4B4A8D] cursor-pointer font-[20px] text-[25px]">
          Acessar
        </Button>
      </div>
      <div className="flex flex-col w-[550px] items-end gap-2 relative top-20">
        <p className="text-[#7490EA]">Não possui Cadastro?</p>
        <Link href="/cadastro" className="underline underline-offset-4 text-[#7490EA]">Clique aqui para cadastrar-se</Link>
      </div>
    </form>
  )
}
