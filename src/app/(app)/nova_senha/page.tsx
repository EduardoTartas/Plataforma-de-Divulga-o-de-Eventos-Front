import Link from "next/link"

export default function NovaSenhaPage() {
    return (
        <>
            <div className="h-[375px] w-[416px] rounded-[8px] translate-x-115 translate-y-15 bg-white flex flex-col items-center gap-6 shadow-md overflow-hidden">
                <div className="translate-x-[-155px] translate-y-[15px]">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
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
                        <span>Voltar</span>
                    </Link>
                </div>
                <h1 className="text-[#1F2937] font-bold text-[20.4px] translate-y-5">Definir Nova Senha</h1>
                <div className="flex flex-col pt-4">
                    <label htmlFor="password" className="text-[#374151]">Nova Senha</label>
                    <input id="password" type="password" className="w-[352px] h-[42px] text-[#374151] border-1 pl-1.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] border-[#D1D5DB] rounded-[8px] placeholder:text-[#CCCCCC]" placeholder="!suaSenha123" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="confirm-password" className="text-[#374151]">Confirmar Senha</label>
                    <input id="password" type="password" className="w-[352px] h-[42px] text-[#374151] border-1 pl-1.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] border-[#D1D5DB] rounded-[8px] placeholder:text-[#CCCCCC]" placeholder="!suaSenha123" />
                </div>
                <button className="bg-[#4F46E5] w-[352px] h-[42px] rounded-[8px] text-white hover:bg-[#4338CA] cursor-pointer">Enviar Código</button>
            </div>
        </>
    )
}