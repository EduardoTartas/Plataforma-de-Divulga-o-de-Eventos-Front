import Header from "@/components/ui/header"

export default function InicioPage() {
    return (
        <Header
            logo="/ifro-events-icon.svg"
            link1="Meus Eventos"
            link2={{ icon: "/exit.svg", text: "Sair" }}
        />
    )
}