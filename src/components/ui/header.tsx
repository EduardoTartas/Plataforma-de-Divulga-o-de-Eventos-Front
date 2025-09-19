interface HeaderProps {
    logo: string;
    link1: string;
    link2: {
        icon: string;
        text: string;
    }
}

export default function Header({ logo, link1, link2 }: HeaderProps) {
    return (
        <header className="h-[64px] w-[screen] bg-white flex flex-row relative shadow-md">
            <img src={logo} className="absolute z-1 left-30 top-0.5 selection:bg-none cursor-pointer" draggable='false'/>
            <p className="absolute top-5 right-50 selection:bg-none cursor-pointer">{link1}</p>
            <p className="absolute top-5 right-25 selection:bg-none cursor-pointer"><img src={link2.icon} className="inline w-4 h-4 mr-2 absolute right-6 top-1  selection:bg-none cursor-pointer" draggable='false'/> {link2.text}</p>
        </header>
    )
}