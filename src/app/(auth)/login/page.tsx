"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { toast } from "react-toastify";


export default function LoginPage() {

const { data: session, status } = useSession()
  const router = useRouter()
  
  // Se já está autenticado, redireciona para a página de listagem dos planos do usuário
  useEffect(() => {
    if (session?.user) {
      router.push("/meus_eventos");
    }
  }, [status, router]);
  
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("eduardo@gmail.com")

  const [senha, setSenha] = useState(
    process.env.NEXT_PUBLIC_AMBIENTE != "production" ? "ABab@123456" : ""
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setLoading(true);
    
    const res = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    if (res?.ok) {
      toast.success('Login realizado com sucesso', { autoClose: 1000 });
      setLoading(false);
      router.push("/meus_eventos");
    } else {  
      toast.error('Credenciais inválidas');
      setLoading(false);
    }
  };






  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-xl pb-6 pl-6 pr-6 space-y-4">
        <img src="/ifro-events-icon.svg" alt="Ifro Events" className="mx-auto h-24 w-24" />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Entrar</h1>
          <p className="mt-2 text-sm text-gray-600">
            Acesse sua conta para continuar
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       placeholder:text-gray-400 transition-all"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       placeholder:text-gray-400 transition-all"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded 
                         focus:ring-2 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Lembrar de mim
              </label>
            </div>
            <Link
              href="/recuperar_senha"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            aria-busy={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link
            href="/cadastro"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
