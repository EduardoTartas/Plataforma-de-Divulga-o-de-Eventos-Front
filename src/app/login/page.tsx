import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-[#101010] relative hidden lg:block overflow-hidden">
        <img
          src="/ifro_events.png"
          className="absolute left-39 top-70 z-1"
        />
        <img
          src="ifro.png"
          className="absolute left-104 bottom-185 z-20"
        />
        <img
          src="/Rectangle.png"
          className="absolute bottom-220 left-20"
        />
        <img
          src="/Ellipse_Bolder.png"
          className="absolute bottom-160 left-[-60px] h-39 w-39"
        />
        <img
          src="/Polygon_Bolder.png"
          className="absolute bottom-[-80] left-[30px]"
        />
        <img
          src="/Rectangle_Bolder.png"
          className="absolute bottom-[80px] left-100"
        />
        <img
          src="/Ellipse.png"
          className="absolute bottom-10 right-30"
        />
        <img
          src="/Polygon_Bolder.png"
          className="absolute bottom-55 right-[-70]"
        />
        <img 
        src="/Ellipse_Bolder.png" 
        className="absolute right-0 top-30" 
        />
        <img 
        src="Polygon_Bolder.png" 
        className="absolute right-70 h-[120px] w-[120px] rotate-[-70deg]" 
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
        </div>
        <div className="flex flex-1 items-center justify-center pr-[200px]">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
