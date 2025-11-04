'use client'
import { useEffect, useState } from "react";

interface FooterProps {
    icon: string;
    text: string;
    text2: string;
    icon2: string;
}

export default function Footer() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <footer data-test="Footer" data-testid="Footer" className="flex flex-row items-center justify-between border-t-2 border-gray-200 h-[60px] px-8 bg-white font-inter">

            <div data-test="Footer--left" data-testid="Footer--left" className="flex items-center gap-3">
                <img data-test="Footer--ifro" data-testid="Footer--ifro" src="/ifro.svg" className="select-none h-8" draggable='false'/>
                <p data-test="Footer--texto" data-testid="Footer--texto" className="text-[#4B5563] text-sm font-medium">Instituto Federal de Rondônia</p>
            </div>
            
            {!isMobile && (
                <div data-test="Footer--center" data-testid="Footer--center" className="flex-1 flex justify-center px-4">
                <p className="text-[#6B7280] text-xs text-center max-w-2xl leading-relaxed">
                    Plataforma de Divulgação de Eventos - Fábrica de Software III - ADS 2024/4 © Todos os direitos reservados.
                </p>
            </div>
            )}
            
            <div data-test="Footer--right" data-testid="Footer--right" className="flex items-center">
                <img data-test="Footer--logo-fslab" data-testid="Footer--logo-fslab" src="/logo_fslab.svg" alt="Logo FSLab" className="select-none h-9 w-auto" draggable='false'/>
            </div>
        </footer>
    )
}
