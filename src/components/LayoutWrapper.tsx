import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  // Todas as páginas dentro de (app) têm Header e Footer
  // O grupo (totem) tem seu próprio layout sem Header/Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
