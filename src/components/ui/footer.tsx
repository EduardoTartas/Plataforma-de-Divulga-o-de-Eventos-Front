interface FooterProps {
    icon: string;
    text: string;
    text2: string;
    icon2: string;
}

export default function Footer() {
    return (
        <footer className="flex flex-row items-center justify-between border-t-2 border-gray-200 h-[60px] px-8 bg-white font-inter">

            <div className="flex items-center gap-3">
                <img src="/ifro.svg" className="select-none h-8" draggable='false'/>
                <p className="text-[#4B5563] text-sm font-medium">Instituto Federal de Rondônia</p>
            </div>
            
            <div className="flex-1 flex justify-center px-4">
                <p className="text-[#6B7280] text-xs text-center max-w-2xl leading-relaxed">
                    Plataforma de Divulgação de Eventos - Fábrica de Software III - ADS 2024/4 © Todos os direitos reservados.
                </p>
            </div>

            <div className="flex items-center">
                <img src="/logo_fslab.svg" alt="Logo FSLab" className="select-none h-9 w-auto" draggable='false'/>
            </div>
        </footer>
    )
}
