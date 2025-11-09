import Link from "next/link";

export default function NovaSenhaPage() {
  return (
    <div
      className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 py-8"
      data-test="page-nova-senha"
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 space-y-4"
        data-test="card-nova-senha"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          data-test="btn-voltar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            data-test="icon-voltar"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Voltar</span>
        </Link>

        <div className="text-center" data-test="header-nova-senha">
          <h1 className="text-3xl font-bold text-gray-900" data-test="titulo-nova-senha">
            Definir Nova Senha
          </h1>
          <p className="mt-3 text-sm text-gray-600" data-test="descricao-nova-senha">
            Escolha uma senha forte para proteger sua conta
          </p>
        </div>

        <form className="space-y-4" data-test="form-nova-senha">
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
              data-test="label-nova-senha"
            >
              Nova Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       placeholder:text-gray-400 transition-all"
              placeholder="••••••••"
              data-test="input-nova-senha"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
              data-test="label-confirmar-senha"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       placeholder:text-gray-400 transition-all"
              placeholder="••••••••"
              data-test="input-confirmar-senha"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            data-test="btn-redefinir-senha"
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
}
