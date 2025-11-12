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

export function useCriarEvento() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<number>(() => {
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
    mode: "onTouched", // Só valida após o usuário interagir com o campo
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [validImages, setValidImages] = useState<File[]>([]);

  const formValues = form.watch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    }
  }, [formValues]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_STEP_KEY, step.toString());
    }
  }, [step]);

  const clearStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
    }
  }, []);

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
    const currentCount = validImages.length;
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
        valid.push(file);
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
  }, [validImages.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setValidImages((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
      // Validar imagens (mínimo de 1 imagem)
      if (validImages.length === 0) {
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
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof currentValues;
          form.setError(field as any, { message: issue.message });
        });
        toast.error("Complete todos os campos obrigatórios da Etapa 3");
        return false;
      }
      
      return true;
    }
    
    return true;
  }, [form, validImages.length]);

  // Mutation para criar evento
  const criarEventoMutation = useMutation({
    mutationFn: async (data: CriarEventoForm) => {
      // 1. Criar o evento
      const payload = {
        ...data,
        exibDia: data.exibDia.join(","),
        cor: parseInt(data.cor, 10),
        animacao: parseInt(data.animacao, 10),
      } as any;

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
    },
    onSuccess: async (eventoResponse) => {
      const eventoId = eventoResponse.data._id;

      if (!eventoId) {
        throw new Error("ID do evento não retornado pela API");
      }

      // 2. Fazer upload das imagens se houver
      if (validImages.length > 0) {
        await uploadImagensMutation.mutateAsync(eventoId);
      } else {
        toast.success("Evento criado com sucesso!", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      // Invalidar queries para atualizar lista de eventos
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      
      // Limpar tudo
      clearStorage();
      form.reset(initialFormData);
      setStep(1);
      setMediaFiles([]);
      setValidImages([]);
    },
    onError: (error: any) => {
      console.error("Erro ao criar evento:", error);
      toast.error(error?.message || "Erro ao criar evento", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Mutation para upload de imagens
  const uploadImagensMutation = useMutation({
    mutationFn: async (eventoId: string) => {
      const formData = new FormData();
      
      validImages.forEach((file) => {
        formData.append("files", file);
      });

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const uploadResponse = await fetch(
        `${API_URL}/eventos/${eventoId}/midias`,
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
      toast.success("Evento e imagens criados com sucesso!", {
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
    mediaFiles,
    validImages,
    step,
    setStep,
    validateStep,
    submit,
    loading: criarEventoMutation.isPending || uploadImagensMutation.isPending,
    clearStorage,
    resetForm,
  } as const;
}
