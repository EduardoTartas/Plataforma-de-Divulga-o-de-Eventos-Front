"use client";

import AlertModal from "@/components/ui/alertModal";

export default function TestesPage() {
    return (
        <div>
            <AlertModal
                title="Teste"
                message="Esta é uma mensagem de teste."
                icon="/path/to/icon.png"
                type="info"
                button1={{
                    text: "Confirmar",
                    action: () => console.log("Ação do botão 1"),
                    className: "bg-green-500 text-white hover:bg-green-600"
                }}
                button2={{
                    text: "Cancelar",
                    action: () => console.log("Ação do botão 2"),
                    className: "border border-gray-300 bg-white text-black hover:bg-gray-100"
                }}
                isOpen={true}
                onClose={() => console.log("Modal fechado")}
            />
        </div>
    )
}