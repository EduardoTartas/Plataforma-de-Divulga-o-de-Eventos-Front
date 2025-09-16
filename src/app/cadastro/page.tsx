import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <div className="relative hidden lg:flex lg:items-center lg:justify-center" style={{backgroundColor: '#101010'}}>
        <img
          src="/Capa_Projeto.png"
          alt="Image"
          className=""
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-hidden" style={{backgroundColor: '#FFFFFF'}}>
        <div className="flex flex-1 items-center justify-center overflow-y-auto">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
