import Link from "next/link";

export default function RecuperarSenhaPage() {
    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl pt-4 pb-6 pl-6 pr-6 space-y-4">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Voltar para login</span>
                </Link>
                <img src="/ifro-events-icon.svg" alt="Ifro Events" className="mx-auto h-24 w-24" />

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Recuperar Senha</h1>
                    <p className="mt-3 text-sm text-gray-600">
                        Enviaremos um link de verificação para o seu e-mail para redefinir sua senha.
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

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Enviar Código
                    </button>
                </form>
            </div>
        </div>
    );
}