export default function Header() {
    const logado = true;
    return (
        <header className="h-[64px] w-[screen] bg-white flex flex-row relative border-1 border-b border-gray-300">
            <img src="/ifro-events-icon.svg" className="absolute z-1 left-30 top-0.5 selection:bg-none cursor-pointer" draggable='false' />
            {logado ? (
                <>
                    <p className="absolute top-5 right-50 selection:bg-none cursor-pointer text-[#4B5563]">Meus Eventos</p>
                    <p className="absolute top-5 right-25 selection:bg-none cursor-pointer text-[#4B5563]">
                        <img src='/exit.svg' className="inline w-4 h-4 mr-2 absolute right-6 top-1  selection:bg-none cursor-pointer" draggable='false' /> Sair
                    </p>
                </>
            ) : (<></>)
            }
        </header>
    )
}