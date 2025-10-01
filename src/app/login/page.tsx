import { LoginForm } from "@/components/login-form"
import Footer from "@/components/ui/footer"

  import Header from "@/components/ui/header"


export default function Page() {
  return (
  
    <div className=" fixed flex min-h-svh w-full flex-col justify-between p-6 md:p-10">
      
      <div className="fixed top-0 left-0 w-full h-16">
        <Header logo={"/ifro-events-icon.sv"} />
           </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {}
     
    </div>
  )
}
