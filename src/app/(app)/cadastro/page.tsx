import Link from "next/link";

export default function CadastroPage() {
    return (
        <div
            className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 py-8"
            data-test="cadastro-container"
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 space-y-4"
                data-test="cadastro-card"
            >
                <div className="text-center" data-test="cadastro-header">
                    <h1
                        className="text-3xl font-bold text-gray-900"
                        data-test="cadastro-title"
                    >
                        Criar Conta
                    </h1>
                    <p
                        className="mt-2 text-sm text-gray-600"
                        data-test="cadastro-subtitle"
                    >
                        Preencha os dados para se cadastrar
                    </p>
                </div>

                <form className="space-y-3.5" data-test="cadastro-form">
                    <div className="space-y-1.5" data-test="field-nome">
                        <label
                            htmlFor="nome"
                            className="block text-sm font-medium text-gray-700"
                            data-test="label-nome"
                        >
                            Nome Completo
                        </label>
                        <input
                            id="nome"
                            type="text"
                            data-test="input-nome"
                            className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                     placeholder:text-gray-400 transition-all"
                            placeholder="Seu Nome Completo"
                        />
                    </div>

                    <div className="space-y-1.5" data-test="field-email">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                            data-test="label-email"
                        >
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            data-test="input-email"
                            className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                     placeholder:text-gray-400 transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="space-y-1.5" data-test="field-password">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                            data-test="label-password"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            data-test="input-password"
                            className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                     placeholder:text-gray-400 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-1.5" data-test="field-confirm-password">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                            data-test="label-confirm-password"
                        >
                            Confirmar Senha
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            data-test="input-confirm-password"
                            className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                     placeholder:text-gray-400 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        data-test="btn-submit-cadastro"
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium
                                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Criar Conta
                    </button>
                </form>

                <p
                    className="text-center text-sm text-gray-600"
                    data-test="footer-login"
                >
                    Já tem uma conta?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        data-test="link-login"
                    >
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
}
