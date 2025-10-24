"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="bg-linear-to-br from-indigo-50 to-blue-100 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Carregando ...</span>
      </div>
    );
  }

  // Se está autenticado, renderiza os filhos
  if (status === "authenticated") {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  // Evita renderizar algo antes da verificação
  return null;
}
