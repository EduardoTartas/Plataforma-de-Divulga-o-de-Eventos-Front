"use client";

import { useEffect, useState } from "react";


export default function Header() {
    const logado = true;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <header className="h-[64px] w-screen bg-white flex flex-row relative border-b border-gray-300 flex-shrink-0">
            <img
            src="/ifro-events-icon.svg"
            className={`pl-4 ${isMobile ? "ml-3" : "ml-20"} top-0.5 selection:bg-none cursor-pointer`}
            draggable="false"
            />
            {logado && (
            <>
                {!isMobile && (
                <p
                    className="absolute top-5 right-50 selection:bg-none cursor-pointer text-[#4B5563] border-b-2 transition-all duration-200"
                    style={{ borderColor: undefined }}
                    id="meus-eventos"
                >
                    Meus Eventos
                </p>
                )}
                <p
                className={`absolute top-5 ${isMobile ? "right-5" : "right-25"} selection:bg-none cursor-pointer text-[#4B5563] flex items-center border-b-2 border-transparent hover:border-[#4338CA] transition-all group`}
                onMouseEnter={() => {
                    if (!isMobile) {
                    const el = document.getElementById("meus-eventos");
                    if (el) el.style.borderColor = "transparent";
                    }
                }}
                onMouseLeave={() => {
                    if (!isMobile) {
                    const el = document.getElementById("meus-eventos");
                    if (el) el.style.borderColor = "#4338CA";
                    }
                }}
                >
                <img
                    src="/exit.svg"
                    className="w-4 h-4 mr-2 selection:bg-none cursor-pointer"
                    draggable="false"
                />
                <span>Sair</span>
                </p>
            </>
            )}
        </header>
    );
}
