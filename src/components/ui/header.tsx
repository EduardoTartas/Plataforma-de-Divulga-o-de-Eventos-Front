"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {

    return (
        <header className="h-16 w-full bg-white border-b border-gray-300 shrink-0">
            <div className="container mx-auto px-6 h-full flex flex-row items-center justify-between">
                {/* Logo */}
                <Link href='/meus_eventos' className="flex items-center shrink-0">
                    <img
                        src="/ifro-events-icon.svg"
                        className="h-10 sm:h-12 selection:bg-none cursor-pointer"
                        draggable="false"
                        alt="IFRO Events"
                    />
                </Link>

                <div className="flex flex-row gap-10">
                    <Link
                        href='/administrativo'
                        className="selection:bg-none cursor-pointer text-[#4B5563] flex items-center gap-2 border-b-2 border-transparent hover:border-[#4338CA] transition-all py-1"
                    >
                        <span className="text-sm sm:text-base">Usuários</span>
                    </Link>

                    <button
                        type="button"
                        className="selection:bg-none cursor-pointer text-[#4B5563] flex items-center gap-2 border-b-2 border-transparent hover:border-[#4338CA] transition-all py-1"
                        onClick={() => {
                            setTimeout(() => {
                                signOut({ callbackUrl: "/login" });
                            }, 0);
                        }}
                    >
                        <img
                            src="/exit.svg"
                            className="w-4 h-4 selection:bg-none"
                            draggable="false"
                            alt="Sair"
                        />
                        <span className="text-sm sm:text-base">Sair</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
