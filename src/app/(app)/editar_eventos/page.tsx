"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Etapa1InformacoesBasicas } from "@/components/criar-eventos/Etapa1";
import { Etapa2UploadImagens } from "@/components/criar-eventos/Etapa2";
import { Etapa3ConfiguracoesExibicao } from "@/components/criar-eventos/Etapa3";
import { AnimationPreview } from "@/components/criar-eventos/AnimationPreview";
import { Stepper } from "@/components/ui/stepper";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCriarEvento } from "@/hooks/useCriarEvento";
import { useEvento } from "@/hooks/useEventos";
import { useImageDragDrop } from "@/hooks/useImageDragDrop";
import { ThreeDot } from "react-loading-indicators";
import { CriarEventoForm } from "@/schema/criarEventoSchema";

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

function EditarEventoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("id");

  const {
    form,
    handleFilesChange,
    handleRemoveImage,
    handleRemoveExistingMedia,
    validImages,
    existingMedia,
    mediaToDelete,
    step,
    setStep,
    validateStep,
    submit,
    loading,
    loadEventData,
  } = useCriarEvento({ eventId: eventId || undefined, isEditMode: true });

  const { data: eventoData, isLoading: isLoadingEvento } = useEvento(eventId || "");

  const [animacaoPreview, setAnimacaoPreview] = useState<{
    nome: string;
    classe: string;
  } | null>(null);
  const [animacaoKey, setAnimacaoKey] = useState(0);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const imageDragDrop = useImageDragDrop(handleFilesChange);

  // Carregar dados do evento quando disponíveis (apenas uma vez)
  useEffect(() => {
    if (eventoData?.data && loadEventData && !hasLoadedData) {
      console.log('Carregando dados do evento pela primeira vez');
      loadEventData(eventoData.data);
      setHasLoadedData(true);
    }
  }, [eventoData, loadEventData, hasLoadedData]);

  // Atualizar localStorage imediatamente após carregar os dados
  useEffect(() => {
    if (hasLoadedData && typeof window !== "undefined") {
      console.log('=== SALVANDO NO LOCALSTORAGE PARA PREVIEW ===');
      console.log('existingMedia:', existingMedia);
      console.log('validImages:', validImages);
      console.log('mediaToDelete:', mediaToDelete);
      
      const formValues = form.getValues();
      localStorage.setItem('criar_evento_draft', JSON.stringify(formValues));
      
      // Salvar imagens para o preview
      const allImages: string[] = [];
      
      // Adicionar imagens existentes (que não estão marcadas para exclusão)
      existingMedia.forEach((media) => {
        if (!mediaToDelete.includes(media._id)) {
          console.log('Adicionando imagem existente:', media.midiLink);
          allImages.push(media.midiLink);
        }
      });
      
      // Adicionar novas imagens (blob URLs)
      validImages.forEach((file) => {
        const blobUrl = URL.createObjectURL(file);
        console.log('Adicionando nova imagem:', blobUrl);
        allImages.push(blobUrl);
      });
      
      console.log('Total de imagens para preview:', allImages.length);
      console.log('Array de imagens:', allImages);
      
      if (allImages.length > 0) {
        localStorage.setItem('criar-evento-images', JSON.stringify(allImages));
      } else {
        console.warn('Nenhuma imagem para salvar no localStorage!');
      }
    }
  }, [hasLoadedData, existingMedia, validImages, mediaToDelete, form]);

  // Salvar dados do formulário no localStorage para o preview funcionar (em tempo real)
  useEffect(() => {
    if (typeof window !== "undefined" && hasLoadedData) {
      const subscription = form.watch((formValues) => {
        console.log('=== FORM WATCH DISPARADO ===');
        localStorage.setItem('criar_evento_draft', JSON.stringify(formValues));
        
        // Salvar imagens para o preview
        const allImages: string[] = [];
        
        // Adicionar imagens existentes (que não estão marcadas para exclusão)
        console.log('existingMedia no watch:', existingMedia.length);
        existingMedia.forEach((media) => {
          if (!mediaToDelete.includes(media._id)) {
            allImages.push(media.midiLink);
          }
        });
        
        // Adicionar novas imagens (blob URLs)
        console.log('validImages no watch:', validImages.length);
        validImages.forEach((file) => {
          allImages.push(URL.createObjectURL(file));
        });
        
        console.log('Total de imagens no watch:', allImages.length);
        
        if (allImages.length > 0) {
          localStorage.setItem('criar-evento-images', JSON.stringify(allImages));
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [form, existingMedia, validImages, mediaToDelete, hasLoadedData]);

  const handleContinue = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    const isValid = await validateStep(step);
    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: CriarEventoForm) => {
    // Só submete se estiver na etapa 3
    if (step !== 3) return;
    
    const isValid = await validateStep(step);
    if (!isValid) return;

    const ok = await submit(data);
    if (ok) router.push("/meus_eventos");
  };

  const handleAnimacaoPreview = (preview: { nome: string; classe: string } | null) => {
    setAnimacaoPreview(preview);
  };

  const handleAnimacaoKeyChange = () => {
    setAnimacaoKey(prev => prev + 1);
  };

  if (!eventId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ID do evento não encontrado
          </h3>
          <p className="text-red-600">
            Por favor, acesse esta página através da lista de eventos.
          </p>
          <button
            onClick={() => router.push("/meus_eventos")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Voltar aos Eventos
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingEvento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <ThreeDot variant="bounce" color="#4338CA" size="medium" text="" textColor="" />
          <span className="mt-3 text-gray-600">Carregando evento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {step > 1 && (
        <div className="mb-8 flex items-center gap-4">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#805AD5] hover:text-[#6B46C1] bg-transparent hover:bg-purple-50 border-none shadow-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Editar Evento</h1>
        <p className="text-[#718096] mb-8">
          Atualize as informações do seu evento
        </p>
      </div>

      <div className="mb-10">
        <Stepper steps={STEPS} currentStep={step} />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && <Etapa1InformacoesBasicas form={form} />}

            {step === 2 && (
              <Etapa2UploadImagens
                validImages={validImages}
                existingMedia={existingMedia}
                mediaToDelete={mediaToDelete}
                isDragging={imageDragDrop.isDragging}
                onDragOver={imageDragDrop.handleDragOver}
                onDragLeave={imageDragDrop.handleDragLeave}
                onDrop={imageDragDrop.handleDrop}
                onFileInputChange={imageDragDrop.handleFileInputChange}
                onRemoveImage={handleRemoveImage}
                onRemoveExistingMedia={handleRemoveExistingMedia}
              />
            )}

            {step === 3 && (
              <Etapa3ConfiguracoesExibicao
                form={form}
                onAnimacaoPreview={handleAnimacaoPreview}
                onAnimacaoKeyChange={handleAnimacaoKeyChange}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => router.push("/meus_eventos")}
                  disabled={loading}
                  className="px-6 py-3 bg-white border border-[#CBD5E0] text-[#4A5568] rounded-lg hover:bg-[#F7FAFC] transition-colors font-medium"
                >
                  Cancelar
                </Button>
                
                {/* Indicador de mídias marcadas para exclusão */}
                {mediaToDelete.length > 0 && (
                  <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm font-medium text-orange-700">
                      {mediaToDelete.length} mídia(s) será(ão) excluída(s)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {step === 3 && (
                  <Button
                    type="button"
                    onClick={() => {
                      // Abre o preview em uma nova aba
                      window.open('/preview-evento', '_blank', 'noopener,noreferrer');
                    }}
                    disabled={loading || (validImages.length === 0 && existingMedia.length === 0)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title={(validImages.length === 0 && existingMedia.length === 0) ? "Adicione imagens para visualizar o preview" : "Ver preview do evento"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </Button>
                )}
                
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
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>

      <AnimationPreview animacaoPreview={animacaoPreview} animacaoKey={animacaoKey} />
    </div>
  );
}

export default function EditarEventoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <ThreeDot variant="bounce" color="#4338CA" size="medium" text="" textColor="" />
          <span className="mt-3 text-gray-600">Carregando...</span>
        </div>
      </div>
    }>
      <EditarEventoContent />
    </Suspense>
  );
}
