import { LoginForm } from "@/components/login-form";
import Footer from "@/components/ui/footer";

export default function Page() {
  return (
    
    <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">

      {/* Header */}
      <HeaderWrapper />

      {}
      <main className="flex flex-1 items-center justify-center px-6 md:px-9">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>

      {}
      <FooterWrapper />

    </div>
  );
}


function HeaderWrapper() {
  return <></>;
}


function FooterWrapper() {
  return (
    <div className="fixed bottom-0 left-0 w-full z-10">
      <Footer />
    </div>
  );
}
