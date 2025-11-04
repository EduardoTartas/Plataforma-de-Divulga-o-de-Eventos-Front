import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
  "data-testid"?: string; 
}

export default function LayoutWrapper({
  children,
  "data-testid": dataTestId,
}: LayoutWrapperProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      data-testid={dataTestId ?? "layout-wrapper"}
    >
      <Header data-testid="header" />
      <main className="grow" data-testid="main-content">
        {children}
      </main>
      <Footer data-testid="footer" />
    </div>
  );
}
