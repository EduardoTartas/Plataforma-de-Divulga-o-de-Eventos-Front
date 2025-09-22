"use client";

import AlertModal from "@/components/ui/alertModal";
import { useState } from "react";

export default function TestesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <AlertModal
                title="Excluir Evento"
                message="Tem certeza de que deseja excluir este evento? Esta ação não pode ser desfeita."
                icon="/alertR.svg"
                type="info"
                button1={{
                    text: "Confirmar",
                    action: () => setIsModalOpen(false),
                    className: "bg-red-500 border border-red-800 text-white hover:bg-red-600"
                }}
                button2={{
                    text: "Cancelar",
                    action: () => setIsModalOpen(false),
                    className: "border border-gray-300 bg-white text-black hover:bg-gray-100"
                }}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <div>Página de Testes</div>
            <button onClick={() => {
                setIsModalOpen(true);
            }}>Abrir Modal</button>
        </div>
    )
}