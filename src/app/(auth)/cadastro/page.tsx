import Link from "next/link";

export default function CadastroPage() {
    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl pb-6 pl-6 pr-6 space-y-4">
                <img src="/ifro-events-icon.svg" alt="Ifro Events" className="mx-auto h-24 w-24" />
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Preencha os dados para se cadastrar
                    </p>
                </div>

                <form className="space-y-3.5">
                    <div className="space-y-1.5">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                            Nome Completo
                        </label>
                        <input
                            id="nome"
                            type="text"
                            className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                     placeholder:text-gray-400 transition-all"
                            placeholder="Seu Nome Completo"
                        />
                    </div>

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

                    <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirmar Senha
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                     placeholder:text-gray-400 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Criar Conta
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Já tem uma conta?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
}