"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Enquanto o estado da sessão estiver carregando, você pode mostrar um loader
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }

  // Se está autenticado, renderiza os filhos
  if (status === "authenticated") {
    return <>
    <Header />
      {children}
    <Footer />
    </>;
  }

  // Evita renderizar algo antes da verificação
  return null;
}
