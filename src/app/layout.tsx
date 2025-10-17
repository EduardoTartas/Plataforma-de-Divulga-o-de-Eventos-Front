import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meu App',
  description: 'Descrição do meu app',
};

// Este é o layout raiz que envolve TUDO.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* O 'children' aqui será o layout de um dos seus grupos,
            seja o AppLayout ou o AuthLayout. */}
        {children}
      </body>
    </html>
  );
}