import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Footer from "@/components/ui/footer";
import QueryProvider from "../../providers/queryProvider";
import ToastProvider from "@/components/ToastProvider";
// import Header from "@/components/ui/header";
import "../globals.css";
import Header from "@/components/ui/header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <Header />
      <ToastProvider />
      {children}
      <Footer />
    </QueryProvider>
  );
}
