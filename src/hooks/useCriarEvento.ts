"use client"

import { useState, useCallback } from "react";
import { criarEventoSchema, type CriarEventoForm } from "@/schema/criarEventoSchema";
import { fetchData } from "@/services/api";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export function useCriarEvento() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<CriarEventoForm>({
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
  });

  const [step, setStep] = useState<number>(1);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [validImages, setValidImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Helper to get image dimensions
  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
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

  // validate any arbitrary data object and set errors map
  const validateData = useCallback((data: CriarEventoForm) => {
    const result = criarEventoSchema.safeParse(data);
    if (!result.success) {
      const zErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "form";
        // prefer to set the first message for that path
        if (!zErrors[path]) zErrors[path] = issue.message;
      }
      setErrors(zErrors);
      return false;
    }
    setErrors({});
    return true;
  }, []);

  // set field and validate the resulting data immediately (but only show errors for touched fields)
  const setField = useCallback((name: string, value: string | boolean | string[]) => {
    setFormData((prev: CriarEventoForm) => {
      const next = { ...prev, [name]: value } as CriarEventoForm;
      // validate next state to update internal errors
      validateData(next);
      return next;
    });
  }, [validateData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouchedFields((prev) => new Set(prev).add(name));
      setField(name, value);
    },
    [setField]
  );

  const handleCheckboxChange = useCallback(
    (name: string, checked: boolean) => {
      setTouchedFields((prev) => new Set(prev).add(name));
      setField(name, checked);
    },
    [setField]
  );

  const handleSelectChange = useCallback((value: string, field = "categoria") => {
    setTouchedFields((prev) => new Set(prev).add(field));
    setField(field, value);
  }, [setField]);

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      setTouchedFields((prev) => new Set(prev).add("tags"));
      setField("tags", tags);
    },
    [setField]
  );

  const handleDiasChange = useCallback(
    (dias: string[]) => {
      setTouchedFields((prev) => new Set(prev).add("exibDia"));
      setField("exibDia", dias);
    },
    [setField]
  );

  const handleFilesChange = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Check limit - allow adding only if under 10 total
    const currentCount = validImages.length;
    const remainingSlots = 10 - currentCount;
    
    if (remainingSlots <= 0) {
      toast.error("Limite máximo de 10 imagens atingido");
      return;
    }
    
    const filesToProcess = fileArray.slice(0, remainingSlots);
    
    if (fileArray.length > remainingSlots) {
      toast.warning(`Apenas ${remainingSlots} imagem(ns) será(ão) adicionada(s) devido ao limite de 10`);
    }
    
    // Add to existing mediaFiles
    setMediaFiles((prev) => [...prev, ...filesToProcess]);

    // Validate image dimensions (min HD: 1280x720)
    const valid: File[] = [];
    const invalid: string[] = [];

    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        valid.push(file); // non-images pass through
        continue;
      }

      try {
        const dimensions = await getImageDimensions(file);
        if (dimensions.width >= 1280 && dimensions.height >= 720) {
          valid.push(file);
        } else {
          invalid.push(
            `${file.name} (${dimensions.width}x${dimensions.height} < 1280x720)`
          );
        }
      } catch (err) {
        invalid.push(`${file.name} (erro ao ler dimensões)`);
      }
    }

    // Add valid images to existing array
    setValidImages((prev) => [...prev, ...valid]);

    if (invalid.length > 0) {
      toast.error(
        `Erro: As seguintes imagens não atendem à resolução mínima de 1280x720:\n${invalid.join(
          "\n"
        )}`
      );
    }
  }, [validImages.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setValidImages((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const validate = useCallback(() => validateData(formData), [formData, validateData]);

  // Validate specific step fields
  const validateStep = useCallback((stepNumber: number) => {
    const result = criarEventoSchema.safeParse(formData);
    
    if (stepNumber === 1) {
      // Step 1: Basic info fields
      const requiredFields = ['titulo', 'descricao', 'local', 'dataInicio', 'dataFim', 'categoria'];
      const stepErrors: string[] = [];
      
      // Mark all step 1 fields as touched
      setTouchedFields((prev) => {
        const newSet = new Set(prev);
        requiredFields.forEach(field => newSet.add(field));
        newSet.add('tags');
        return newSet;
      });
      
      if (!result.success) {
        for (const issue of result.error.issues) {
          const fieldName = issue.path[0] as string;
          if (requiredFields.includes(fieldName)) {
            stepErrors.push(issue.message);
          }
        }
      }
      
      // Check tags separately (min 1)
      if (formData.tags.length === 0) {
        stepErrors.push("Pelo menos uma tag é obrigatória");
      }
      
      if (stepErrors.length > 0) {
        toast.error(`Complete todos os campos obrigatórios antes de continuar`);
        return false;
      }
    } else if (stepNumber === 3) {
      // Step 3: Display settings
      const requiredFields = ['exibDia', 'exibInicio', 'exibFim', 'cor', 'animacao'];
      const stepErrors: string[] = [];
      
      // Mark all step 3 fields as touched
      setTouchedFields((prev) => {
        const newSet = new Set(prev);
        requiredFields.forEach(field => newSet.add(field));
        newSet.add('exibManha');
        newSet.add('exibTarde');
        newSet.add('exibNoite');
        return newSet;
      });
      
      if (!result.success) {
        for (const issue of result.error.issues) {
          const fieldName = issue.path[0] as string;
          if (requiredFields.includes(fieldName) || fieldName === 'exibManha') {
            stepErrors.push(issue.message);
          }
        }
      }
      
      if (stepErrors.length > 0) {
        toast.error(`Complete todos os campos obrigatórios antes de finalizar`);
        return false;
      }
    }
    
    return true;
  }, [formData]);

  const submit = useCallback(async () => {
    // validate final
    const valid = validate();
    if (!valid) {
      toast.error("Por favor, corrija os erros antes de finalizar");
      return false;
    }

    setLoading(true);

    try {
      // prepare payload
      const payload = {
        ...formData,
        exibDia: formData.exibDia.join(","), // Convert array to comma-separated string
      } as any;

      // TODO: upload validImages if needed and include results in payload
      await fetchData("/eventos", "POST", session?.user?.accesstoken, payload);
      toast.success("Evento criado com sucesso!");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erro ao criar evento");
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, session, validate]);

  return {
    formData,
    setFormData,
    handleChange,
    handleCheckboxChange,
    handleSelectChange,
    handleTagsChange,
    handleDiasChange,
    handleFilesChange,
    handleRemoveImage,
    mediaFiles,
    validImages,
    step,
    setStep,
    validate,
    validateStep,
    submit,
    loading,
    errors,
    touchedFields,
  } as const;
}
