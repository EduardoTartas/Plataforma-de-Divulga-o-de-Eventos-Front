import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10", className)} {...props}>
      <div className="flex flex-col items-center gap-2 sm:gap-4 text-center">
        <h1 className="font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl" style={{color: '#5E5CB0'}}>Cadastrar</h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed" style={{color: '#F17A86'}}>
          Preencha seus dados para começar
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6">
        <div className="relative flex items-center">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#8BA3E2] to-[#F17A86] p-[1px]">
            <div className="h-full w-full rounded-md bg-white"></div>
          </div>
          <img
            src="/user.svg"
            alt="Ícone de usuário"
            className="absolute left-4 h-4 w-4 sm:h-5 sm:w-5 opacity-50 z-10"
          />
          <Input
            id="username"
            type="text"
            placeholder="Nome do Usuário"
            required
            className="pl-10 sm:pl-12 placeholder:text-[#5E5CB0] text-[#5E5CB0] relative z-10 border-0 bg-transparent h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
          />
        </div>

        <div className="relative flex items-center">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#8BA3E2] to-[#F17A86] p-[1px]">
            <div className="h-full w-full rounded-md bg-white"></div>
          </div>
          <img
            src="/email.svg"
            alt="Ícone de e-mail"
            className="absolute left-4 h-4 w-4 sm:h-5 sm:w-5 opacity-50 z-10"
          />
          <Input
            id="email"
            type="email"
            placeholder="E-mail"
            required
            className="pl-10 sm:pl-12 placeholder:text-[#5E5CB0] text-[#5E5CB0] relative z-10 border-0 bg-transparent h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
          />
        </div>

        <div className="relative flex items-center">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#F17A86] to-[#8BA3E2] p-[1px]">
            <div className="h-full w-full rounded-md bg-white"></div>
          </div>
          <img
            src="/lock.svg"
            alt="Ícone de senha"
            className="absolute left-4 h-5 w-5 opacity-50 z-10"
          />
          <Input
            id="password"
            type="password"
            placeholder="Senha"
            required
            className="pl-12 placeholder:text-[#5E5CB0] text-[#5E5CB0] relative z-10 border-0 bg-transparent h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg"
          />
        </div>

        <div className="relative flex items-center">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#F17A86] to-[#8BA3E2] p-[1px]">
            <div className="h-full w-full rounded-md bg-white"></div>
          </div>
          <img
            src="/lock.svg"
            alt="Ícone de senha"
            className="absolute left-4 h-5 w-5 opacity-50 z-10"
          />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            required
            className="pl-12 placeholder:text-[#5E5CB0] text-[#5E5CB0] relative z-10 border-0 bg-transparent h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg"
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-medium px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4" style={{backgroundColor: '#5E5CB0', borderColor: '#5E5CB0'}}>
        Cadastrar
      </Button>
    </form>
  );
}