"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Stepper } from "@/components/ui/stepper";
import Modal from "@/components/ui/modal";
import { useCriarEvento } from "@/hooks/useCriarEvento";
import { CriarEventoForm } from "@/schema/criarEventoSchema";
import { Step1BasicInfo } from "@/components/criar-eventos/Step1BasicInfo";
import { Step2ImageUpload } from "@/components/criar-eventos/Step2ImageUpload";
import { Step3DisplaySettings } from "@/components/criar-eventos/Step3DisplaySettings";
import { AnimationPreview } from "@/components/criar-eventos/AnimationPreview";
import { useImageDragDrop } from "@/hooks/useImageDragDrop";

const STEPS = [
  {
    number: 1,
    title: "Informações Básicas",
    description: "Detalhes do evento",
  },
  {
    number: 2,
    title: "Upload de Mídia",
    description: "Imagens do evento",
  },
  {
    number: 3,
    title: "Configurações",
    description: "Exibição e aparência",
  },
];

export default function CriarEvento() {
  const router = useRouter();
  const {
    form,
    handleFilesChange,
    handleRemoveImage,
    validImages,
    step,
    setStep,
    validateStep,
    submit,
    loading,
    clearStorage,
  } = useCriarEvento();

  const [animacaoPreview, setAnimacaoPreview] = useState<{
    nome: string;
    classe: string;
  } | null>(null);
  const [animacaoKey, setAnimacaoKey] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const imageDragDrop = useImageDragDrop(handleFilesChange);

  const handleContinue = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: CriarEventoForm) => {
    const isValid = await validateStep(step);
    if (!isValid) return;

    const ok = await submit(data);
    if (ok) router.push("/meus_eventos");
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/meus_eventos");
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    clearStorage();
    router.push("/meus_eventos");
  };

  const handleAnimacaoPreview = (preview: { nome: string; classe: string } | null) => {
    setAnimacaoPreview(preview);
  };

  const handleAnimacaoKeyChange = () => {
    setAnimacaoKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <Button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#805AD5] hover:text-[#6B46C1] bg-transparent hover:bg-purple-50 border-none shadow-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step === 1 ? "Voltar aos Eventos" : "Voltar"}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Criar Novo Evento</h1>
        <p className="text-[#718096] mb-8">
          Preencha os detalhes do seu evento para exibição no totem digital
        </p>
      </div>

      <div className="mb-10">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && <Step1BasicInfo form={form} />}

            {step === 2 && (
              <Step2ImageUpload
                validImages={validImages}
                isDragging={imageDragDrop.isDragging}
                onDragOver={imageDragDrop.handleDragOver}
                onDragLeave={imageDragDrop.handleDragLeave}
                onDrop={imageDragDrop.handleDrop}
                onFileInputChange={imageDragDrop.handleFileInputChange}
                onRemoveImage={handleRemoveImage}
              />
            )}

            {step === 3 && (
              <Step3DisplaySettings
                form={form}
                onAnimacaoPreview={handleAnimacaoPreview}
                onAnimacaoKeyChange={handleAnimacaoKeyChange}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-[#E2E8F0]">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 bg-white border border-[#CBD5E0] text-[#4A5568] rounded-lg hover:bg-[#F7FAFC] transition-colors font-medium"
              >
                Cancelar
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={loading}
                  className="px-8 py-3 bg-[#805AD5] hover:bg-[#6B46C1] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#805AD5] hover:bg-[#6B46C1] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Carregando..." : "Finalizar"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      <AnimationPreview animacaoPreview={animacaoPreview} animacaoKey={animacaoKey} />

      <Modal 
        titulo="Cancelar criação do evento?" 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)}
      >
        <p className="text-gray-700 mb-4">
          Os dados preenchidos serão perdidos. Tem certeza que deseja cancelar?
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={() => setShowCancelModal(false)} 
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Voltar
          </button>
          <button 
            onClick={confirmCancel} 
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Sim, cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
