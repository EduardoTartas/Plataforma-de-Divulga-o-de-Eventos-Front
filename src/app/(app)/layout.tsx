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
