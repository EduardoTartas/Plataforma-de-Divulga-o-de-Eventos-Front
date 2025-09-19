

import { useEffect, useRef } from "react";
import { Button } from "./button";

interface AlertModalProps {
    title: string;
    message: string;
    icon: string;
    type: 'successo' | 'erro' | 'alerta' | 'info';
    button1: {
        text: string;
        action: () => void;
        className?: string;
    };
    button2?: {
        text: string;
        action: () => void;
        className?: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function AlertModal({ title, message, icon, type, button1, button2, isOpen, onClose }: AlertModalProps) {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = modalRef.current;
        if (dialog) {
            isOpen ? dialog.showModal() : dialog.close();
        }
    }, [isOpen]);

    const handlePrimaryAction = () => {
        button1.action();
        onClose();
    };

    const handleSecondaryAction = () => {
        if (button2) {
            button2.action();
        }
        onClose();
    };

    return (
        <dialog ref={modalRef} onCancel={onClose} className="w-full max-w-lg rounded-xl p-0 shadow-2xl backdrop:bg-gray-900/60 backdrop:blur-sm">
            <div>
                <header>
                    <img src={icon} />
                    <h2>{title}</h2>
                </header>
                <main>
                    <p>{message}</p>
                </main>
                <footer className="flex justify-end gap-2 p-4">
                    {button2 && <Button onClick={handleSecondaryAction} className={button2?.className}>{button2?.text}</Button>}
                    <Button onClick={handlePrimaryAction} className={button1.className}>{button1.text}</Button>
                </footer>
            </div>
        </dialog>
    )
}