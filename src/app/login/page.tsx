import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="h-[425px] w-[416px] rounded-[8px] translate-x-115 translate-y-9 bg-white flex flex-col items-center gap-6 shadow-md overflow-hidden">
        <h1 className="text-[#1F2937] font-bold text-[20.4px] translate-y-5">Entrar</h1>
        <div className="flex flex-col pt-4">
          <label htmlFor="email" className="text-[#374151]">E-mail</label>
          <input id="email" type="email" className="w-[352px] h-[42px] text-[#374151] border-1 pl-1.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] border-[#D1D5DB] rounded-[8px] placeholder:text-[#CCCCCC]" placeholder="seu@email.com" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[#374151]">Senha</label>
          <input id="password" type="password" className="w-[352px] h-[42px] text-[#374151] border-1 pl-1.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] border-[#D1D5DB] rounded-[8px] placeholder:text-[#CCCCCC]" placeholder="!suaSenha123" />
        </div>
        <div className="flex flex-row gap-18">
          <div className="flex flex-row gap-2">
            <input id="remember" type="checkbox" />
            <label htmlFor="remember" className="text-[#374151]">Lembrar de mim</label>
          </div>
          <Link href="/recuperar_senha" className="text-[#4F46E5] hover:text-[#4338CA]">Esqueceu a senha?</Link>
        </div>
        <button className="bg-[#4F46E5] w-[352px] h-[42px] rounded-[8px] text-white hover:bg-[#4338CA] cursor-pointer">Entrar</button>
        <p className="text-[#4B5563]">Não tem uma conta? <Link href="/cadastro" className="text-[#4F46E5] hover:text-[#4338CA]">Criar conta</Link></p>
      </div>
    </>
  );
}
