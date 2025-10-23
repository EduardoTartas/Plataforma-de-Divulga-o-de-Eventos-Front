import Link from "next/link";

export default function LoginPage() {
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

        <form className="space-y-4">
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
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Entrar
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
