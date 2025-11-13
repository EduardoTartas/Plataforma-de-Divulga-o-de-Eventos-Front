"use client"

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  criarEventoSchema, 
  step1Schema, 
  step3Schema,
  type CriarEventoForm 
} from "@/schema/criarEventoSchema";
import { fetchData } from "@/services/api";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const STORAGE_KEY = "criar_evento_draft";
const STORAGE_STEP_KEY = "criar_evento_step";

const initialFormData: CriarEventoForm = {
  titulo: "",
  descricao: "",
  categoria: "",
  local: "",
  link: "",
  dataInicio: "",
  dataFim: "",
  tags: [],
  exibDia: [],
  exibManha: false,
  exibTarde: false,
  exibNoite: false,
  exibInicio: "",
  exibFim: "",
  cor: "",
  animacao: "",
};

interface UseCriarEventoParams {
  eventId?: string;
  isEditMode?: boolean;
}

export function useCriarEvento(params?: UseCriarEventoParams) {
  const eventId = params?.eventId;
  const isEditMode = params?.isEditMode || !!eventId;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<number>(() => {
    // Não carregar step do localStorage no modo de edição
    if (isEditMode) return 1;
    
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_STEP_KEY);
      if (stored) {
        try {
          return parseInt(stored, 10);
        } catch (e) {
          console.error("Failed to parse stored step", e);
        }
      }
    }
    return 1;
  });
  
  const form = useForm<CriarEventoForm>({
    resolver: zodResolver(criarEventoSchema),
    defaultValues: (() => {
      // Não carregar do localStorage no modo de edição
      if (isEditMode) return initialFormData;
      
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error("Failed to parse stored form data", e);
          }
        }
      }
      return initialFormData;
    })(),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const restaurarImagens = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("criar-evento-images-data");
      if (stored) {
        try {
          const imagesData = JSON.parse(stored);
          // Converte os dados base64 de volta para Files
          return imagesData.map((img: any) => {
            const byteString = atob(img.data.split(',')[1]);
            const mimeString = img.data.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            return new File([blob], img.name, { type: mimeString });
          });
        } catch (e) {
          console.error("Failed to restore images", e);
        }
      }
    }
    return [];
  };

  const [validImages, setValidImages] = useState<File[]>(() => restaurarImagens());
  const [mediaFiles, setMediaFiles] = useState<File[]>(() => restaurarImagens());
  
  // Estado para rastrear mídias existentes no servidor (apenas em modo edição)
  const [existingMedia, setExistingMedia] = useState<Array<{
    _id: string;
    midiLink: string;
    midiTipo: string;
  }>>([]);
  
  // Estado para rastrear IDs de mídias que devem ser removidas
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);

  const formValues = form.watch();

  useEffect(() => {
    // Não salvar no localStorage no modo de edição
    if (isEditMode) return;
    
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    }
  }, [formValues, isEditMode]);

  useEffect(() => {
    // Não salvar step no localStorage no modo de edição
    if (isEditMode) return;
    
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_STEP_KEY, step.toString());
    }
  }, [step, isEditMode]);

  // Salva as imagens válidas no localStorage para o preview acessar
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (validImages.length > 0) {
        // Converte as imagens para base64 e URLs blob
        const promises = validImages.map(file => {
          return new Promise<{ name: string, data: string, url: string }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const url = URL.createObjectURL(file);
              resolve({
                name: file.name,
                data: reader.result as string,
                url: url
              });
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(promises).then(imagesData => {
          // Salva dados base64 para restaurar os Files
          localStorage.setItem("criar-evento-images-data", JSON.stringify(imagesData.map(img => ({ name: img.name, data: img.data }))));
          // Salva URLs blob para o preview
          localStorage.setItem("criar-evento-images", JSON.stringify(imagesData.map(img => img.url)));
        });
      } else {
        // Remove do localStorage se não houver imagens
        localStorage.removeItem("criar-evento-images");
        localStorage.removeItem("criar-evento-images-data");
      }
    }
  }, [validImages]);

  const clearStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
      localStorage.removeItem("criar-evento-images");
      localStorage.removeItem("criar-evento-images-data");
    }
  }, []);

  // Função para carregar dados do evento no formulário
  const loadEventData = useCallback((evento: any) => {
    console.log('=== LOAD EVENT DATA ===');
    console.log('Evento completo recebido:', evento);
    console.log('Mídias do evento:', evento.midia);
    
    // Formatar datas para o formato do input datetime-local (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Formatar datas para o formato do input date (YYYY-MM-DD)
    const formatDateOnlyForInput = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Extrair dias da semana da string (ex: "seg,ter,qua" -> ["seg", "ter", "qua"])
    const exibDia = typeof evento.exibDia === 'string' 
      ? evento.exibDia.split(',').filter(Boolean)
      : Array.isArray(evento.exibDia) 
        ? evento.exibDia 
        : [];

    const formData: CriarEventoForm = {
      titulo: evento.titulo || "",
      descricao: evento.descricao || "",
      categoria: evento.categoria || "",
      local: evento.local || "",
      link: evento.link || "",
      dataInicio: formatDateForInput(evento.dataInicio),
      dataFim: formatDateForInput(evento.dataFim),
      tags: evento.tags || [],
      exibDia: exibDia,
      exibManha: evento.exibManha || false,
      exibTarde: evento.exibTarde || false,
      exibNoite: evento.exibNoite || false,
      exibInicio: formatDateOnlyForInput(evento.exibInicio),
      exibFim: formatDateOnlyForInput(evento.exibFim),
      cor: evento.cor?.toString() || "",
      animacao: evento.animacao?.toString() || "",
    };

    console.log('Carregando dados do evento:', formData);

    // Resetar o formulário com os novos dados
    form.reset(formData, {
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
    });
    
    // Forçar atualização dos campos Select após um pequeno delay
    setTimeout(() => {
      form.setValue('categoria', formData.categoria, { shouldValidate: false });
      form.setValue('cor', formData.cor, { shouldValidate: false });
      form.setValue('animacao', formData.animacao, { shouldValidate: false });
      // Limpar erros manualmente
      form.clearErrors('categoria');
      form.clearErrors('cor');
      form.clearErrors('animacao');
    }, 100);

    // Carregar imagens se existirem
    if (evento.midia && Array.isArray(evento.midia) && evento.midia.length > 0) {
      console.log('Mídias do evento:', evento.midia);
      
      // Salvar as mídias existentes para exibir (NÃO baixar)
      setExistingMedia(evento.midia.map((media: any) => ({
        _id: media._id,
        midiLink: media.midiLink,
        midiTipo: media.midiTipo,
      })));
      
      // Limpar imagens novas ao carregar evento para edição
      setValidImages([]);
      setMediaFiles([]);
    } else {
      // Se não tem mídia, garantir que os arrays estão vazios
      setExistingMedia([]);
      setValidImages([]);
      setMediaFiles([]);
    }
  }, [form]);

  const resetForm = useCallback(() => {
    form.reset(initialFormData);
    setStep(1);
    setMediaFiles([]);
    setValidImages([]);
    clearStorage();
  }, [form, clearStorage]);

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };
      img.src = url;
    });
  };

  const handleFilesChange = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    // Descontar as mídias marcadas para exclusão da contagem
    const remainingExistingMedia = existingMedia.length - mediaToDelete.length;
    const currentCount = validImages.length + remainingExistingMedia;
    const remainingSlots = 6 - currentCount;
    
    if (remainingSlots <= 0) {
      toast.error("Limite máximo de 6 imagens atingido");
      return;
    }
    
    const filesToProcess = fileArray.slice(0, remainingSlots);
    
    if (fileArray.length > remainingSlots) {
      toast.warning(`Apenas ${remainingSlots} imagem(ns) será(ão) adicionada(s) devido ao limite de 6`);
    }
    
    setMediaFiles((prev) => [...prev, ...filesToProcess]);

    const valid: File[] = [];
    const invalid: string[] = [];

    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        // Arquivos que não são imagens devem ser considerados inválidos
        invalid.push(`${file.name} (tipo de arquivo não suportado)`);
        continue;
      }

      try {
        const dimensions = await getImageDimensions(file);
        if (dimensions.width >= 1280 && dimensions.height >= 720) {
          valid.push(file);
        } else {
          invalid.push(`${file.name} (${dimensions.width}x${dimensions.height} < 1280x720)`);
        }
      } catch (err) {
        invalid.push(`${file.name} (erro ao ler dimensões)`);
      }
    }

    setValidImages((prev) => [...prev, ...valid]);

    if (invalid.length > 0) {
      toast.error(`Erro: As seguintes imagens não atendem à resolução mínima de 1280x720:\n${invalid.join("\n")}`);
    }
  }, [validImages.length, existingMedia.length, mediaToDelete.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setValidImages((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Função para marcar mídia existente para exclusão (não deleta imediatamente)
  const handleRemoveExistingMedia = useCallback((mediaId: string) => {
    if (!isEditMode) {
      console.error('Modo de edição não ativo');
      return;
    }

    // Adiciona o ID à lista de mídias a serem deletadas
    setMediaToDelete((prev) => {
      if (prev.includes(mediaId)) {
        // Se já está marcada, remove da lista (desfaz a marcação)
        return prev.filter(id => id !== mediaId);
      } else {
        // Marca para exclusão
        return [...prev, mediaId];
      }
    });
    
    // Mostra feedback ao usuário
    const isMarked = !mediaToDelete.includes(mediaId);
    if (isMarked) {
      toast.info("Mídia marcada para exclusão. Salve as alterações para confirmar.", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.info("Exclusão cancelada.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, [isEditMode, mediaToDelete]);

  const validateStep = useCallback(async (stepNumber: number) => {
    if (stepNumber === 1) {
      // Validar apenas campos da Step 1
      const currentValues = form.getValues();
      const step1Data = {
        titulo: currentValues.titulo,
        descricao: currentValues.descricao,
        categoria: currentValues.categoria,
        local: currentValues.local,
        dataInicio: currentValues.dataInicio,
        dataFim: currentValues.dataFim,
        link: currentValues.link,
        tags: currentValues.tags,
      };
      
      const result = step1Schema.safeParse(step1Data);
      
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof currentValues;
          form.setError(field as any, { message: issue.message });
        });
        toast.error("Complete todos os campos obrigatórios da Etapa 1");
        return false;
      }
      
      return true;
    } 
    
    if (stepNumber === 2) {
      // Validar imagens (mínimo de 1 imagem entre novas e existentes, descontando as marcadas para exclusão)
      const remainingExistingMedia = existingMedia.length - mediaToDelete.length;
      const totalImages = validImages.length + remainingExistingMedia;
      if (totalImages === 0) {
        toast.error("Adicione pelo menos 1 imagem antes de continuar");
        return false;
      }
      return true;
    }
    
    if (stepNumber === 3) {
      // Validar apenas campos da Step 3
      const currentValues = form.getValues();
      const step3Data = {
        exibDia: currentValues.exibDia,
        exibManha: currentValues.exibManha,
        exibTarde: currentValues.exibTarde,
        exibNoite: currentValues.exibNoite,
        exibInicio: currentValues.exibInicio,
        exibFim: currentValues.exibFim,
        cor: currentValues.cor,
        animacao: currentValues.animacao,
      };
      
      const result = step3Schema.safeParse(step3Data);
      
      if (!result.success) {
        // Só mostra toast, não define erros no form para evitar mostrar antes de interagir
        const errorMessages = result.error.issues.map(issue => issue.message).join(", ");
        toast.error(`Complete todos os campos obrigatórios: ${errorMessages}`);
        return false;
      }
      
      return true;
    }
    
    return true;
  }, [form, validImages.length, existingMedia.length, mediaToDelete.length]);

  // Mutation para criar evento
  const criarEventoMutation = useMutation({
    mutationFn: async (data: CriarEventoForm) => {
      const payload = {
        ...data,
        exibDia: data.exibDia.join(","),
        cor: parseInt(data.cor, 10),
        animacao: parseInt(data.animacao, 10),
        // Ao editar, não sobrescrever o status existente no servidor
        ...(isEditMode ? {} : { status: 1 }),
      } as any;

      if (isEditMode && eventId) {
        // Atualizar evento existente
        const eventoResponse = await fetchData<{ 
          error: boolean;
          code: number;
          message: string;
          data: {
            _id: string;
            [key: string]: any;
          };
        }>(
          `/eventos/${eventId}`,
          "PATCH",
          session?.user?.accesstoken,
          payload
        );
        return eventoResponse;
      } else {
        // Criar novo evento
        const eventoResponse = await fetchData<{ 
          error: boolean;
          code: number;
          message: string;
          data: {
            _id: string;
            [key: string]: any;
          };
        }>(
          "/eventos",
          "POST",
          session?.user?.accesstoken,
          payload
        );
        return eventoResponse;
      }
    },
    onSuccess: async (eventoResponse) => {
      const eventoIdToUse = eventId || eventoResponse.data._id;

      if (!eventoIdToUse) {
        throw new Error("ID do evento não encontrado");
      }

      // 1. Deletar mídias marcadas para exclusão (apenas em modo edição)
      if (isEditMode && mediaToDelete.length > 0) {
        await deletarMidiasMutation.mutateAsync(eventoIdToUse);
      }

      // 2. Fazer upload das imagens se houver
      if (validImages.length > 0) {
        await uploadImagensMutation.mutateAsync(eventoIdToUse);
      } else {
        const successMessage = isEditMode 
          ? "Evento atualizado com sucesso!" 
          : "Evento criado com sucesso!";
        
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Invalidar queries para atualizar lista de eventos
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      queryClient.invalidateQueries({ queryKey: ["evento", eventId] });
      
      // Limpar tudo
      clearStorage();
      form.reset(initialFormData);
      setStep(1);
      setMediaFiles([]);
      setValidImages([]);
      setExistingMedia([]);
      setMediaToDelete([]);
    },
    onError: (error: any) => {
      console.error("Erro ao salvar evento:", error);
      const errorMessage = isEditMode 
        ? "Erro ao atualizar evento" 
        : "Erro ao criar evento";
      
      toast.error(error?.message || errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Mutation para deletar mídias marcadas
  const deletarMidiasMutation = useMutation({
    mutationFn: async (eventoIdToUse: string) => {
      const deletionPromises = mediaToDelete.map(async (midiaId) => {
        try {
          await fetchData(
            `/eventos/${eventoIdToUse}/midia/${midiaId}`,
            "DELETE",
            session?.user?.accesstoken
          );
          return { success: true, midiaId };
        } catch (error: any) {
          console.error(`Erro ao deletar mídia ${midiaId}:`, error);
          return { success: false, midiaId, error };
        }
      });

      const results = await Promise.all(deletionPromises);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      return { successCount, failCount, results };
    },
    onSuccess: (data) => {
      if (data.successCount > 0) {
        toast.success(`${data.successCount} mídia(s) removida(s) com sucesso!`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      if (data.failCount > 0) {
        toast.warning(`${data.failCount} mídia(s) não puderam ser removidas.`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
    onError: (error: any) => {
      console.error("Erro ao deletar mídias:", error);
      toast.error("Erro ao deletar mídias", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Mutation para upload de imagens
  const uploadImagensMutation = useMutation({
    mutationFn: async (eventoIdToUse: string) => {
      const formData = new FormData();
      
      validImages.forEach((file) => {
        formData.append("files", file);
      });

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const uploadResponse = await fetch(
        `${API_URL}/eventos/${eventoIdToUse}/midias`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user?.accesstoken}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(
          errorData?.message || "Erro ao fazer upload das imagens"
        );
      }

      return uploadResponse.json();
    },
    onSuccess: () => {
      const successMessage = isEditMode 
        ? "Evento e imagens atualizados com sucesso!" 
        : "Evento e imagens criados com sucesso!";
      
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Erro ao fazer upload das imagens:", error);
      toast.error(error?.message || "Erro ao fazer upload das imagens", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const submit = useCallback(async (data: CriarEventoForm) => {
    try {
      await criarEventoMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  }, [criarEventoMutation]);

  return {
    form,
    handleFilesChange,
    handleRemoveImage,
    handleRemoveExistingMedia,
    mediaFiles,
    validImages,
    existingMedia,
    mediaToDelete,
    step,
    setStep,
    validateStep,
    submit,
    loading: criarEventoMutation.isPending || uploadImagensMutation.isPending || deletarMidiasMutation.isPending,
    clearStorage,
    resetForm,
    loadEventData,
    isEditMode,
  } as const;
}
