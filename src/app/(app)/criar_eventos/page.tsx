"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Stepper } from "@/components/ui/stepper";
import { useCriarEvento } from "@/hooks/useCriarEvento";
import { CriarEventoForm } from "@/schema/criarEventoSchema";
import "animate.css";

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
    resetForm,
  } = useCriarEvento();

  const [isDragging, setIsDragging] = useState(false);
  const [animacaoPreview, setAnimacaoPreview] = useState<{
    nome: string;
    classe: string;
  } | null>(null);
  const [animacaoKey, setAnimacaoKey] = useState(0);

  const handleContinue = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: CriarEventoForm) => {
    // Validar a etapa final antes de submeter
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
    if (
      confirm(
        "Tem certeza que deseja cancelar? Os dados salvos serão mantidos para uma próxima sessão."
      )
    ) {
      router.push("/meus_eventos");
    }
  };

  const handleClearDraft = () => {
      resetForm();
      toast.success("Rascunho limpo com sucesso!");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesChange(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesChange(e.target.files);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-[#718096] hover:text-[#1A202C] transition-colors"
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <h1 className="text-3xl font-bold text-[#1A202C]">
                  Criar Evento
                </h1>
              </div>
              
              {/* Clear Draft Button */}
              <button
                type="button"
                onClick={handleClearDraft}
                className="text-sm text-[#E53E3E] hover:text-[#C53030] transition-colors flex items-center gap-1"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpar rascunho
              </button>
            </div>
            
            {/* Info about auto-save */}
            <p className="text-sm text-[#718096] ml-9 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Seus dados são salvos automaticamente enquanto você preenche o formulário
            </p>
          </div>

          {/* Stepper */}
          <Stepper steps={STEPS} currentStep={step} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {step === 1 && (
                <>
                  {/* Step 1: Basic Info */}
                  
                  {/* Título */}
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#2D3748]">
                          Nome do Evento *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome do evento"
                            {...field}
                            className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Descrição */}
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#2D3748]">
                          Descrição do Evento *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os detalhes do evento"
                            {...field}
                            className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all resize-none"
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Categoria */}
                    <FormField
                      control={form.control}
                      name="categoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#2D3748]">
                            Categoria *
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all bg-white">
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border border-[#CBD5E0] rounded-lg shadow-lg">
                              <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="palestra">
                                Palestra
                              </SelectItem>
                              <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="workshop">
                                Workshop
                              </SelectItem>
                              <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="seminario">
                                Seminário
                              </SelectItem>
                              <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="curso">
                                Curso
                              </SelectItem>
                              <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="esportes">
                                Esportes
                              </SelectItem>
                              <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="outro">
                                Outro
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Local */}
                    <FormField
                      control={form.control}
                      name="local"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#2D3748]">
                            Local *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Local onde será realizado o evento"
                              {...field}
                              className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Data de Início */}
                    <FormField
                      control={form.control}
                      name="dataInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#2D3748] flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Hora de Início *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Data de Fim */}
                    <FormField
                      control={form.control}
                      name="dataFim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#2D3748] flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Hora de Término *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Link */}
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#2D3748]">
                          URL para QR Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://exemplo.com"
                            {...field}
                            value={field.value || ""}
                            className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      const [tagInput, setTagInput] = useState("");
                      
                      const handleAddTag = () => {
                        if (tagInput.trim() && !field.value.includes(tagInput.trim())) {
                          field.onChange([...field.value, tagInput.trim()]);
                          setTagInput("");
                        }
                      };
                      
                      const handleRemoveTag = (index: number) => {
                        field.onChange(field.value.filter((_: string, i: number) => i !== index));
                      };
                      
                      return (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#2D3748]">
                            Tags * (mínimo 1)
                          </FormLabel>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Digite uma tag e pressione Enter"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              className="flex-1 border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                            />
                            <Button 
                              type="button" 
                              onClick={handleAddTag}
                              className="px-6 py-3 bg-white border border-[#CBD5E0] text-[#4A5568] rounded-lg hover:bg-[#F7FAFC] transition-colors font-medium"
                            >
                              Adicionar
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value.map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="bg-[#E9D8FD] text-[#6B46C1] px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(index)}
                                  className="text-[#6B46C1] hover:text-[#553C9A] font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  {/* Step 2: Image Upload */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#1A202C]">Upload de Mídia</h2>
                    <p className="text-sm text-[#4A5568]">
                      Adicione imagens (mínimo 1280x720 pixels). Você pode arrastar e soltar ou clicar para selecionar. <strong>Limite: 6 imagens ({validImages.length}/6)</strong>
                    </p>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                        isDragging
                          ? "border-[#805AD5] bg-[#FAF5FF]"
                          : "border-[#CBD5E0] bg-white"
                      }`}
                    >
                      <input
                        id="fileUpload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="fileUpload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <svg
                          className="w-16 h-16 text-[#A0AEC0] mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-base text-[#4A5568] mb-1">
                          Arraste imagens aqui ou <span className="text-[#805AD5] underline font-medium">clique para selecionar</span>
                        </span>
                        <span className="text-sm text-[#718096]">PNG, JPG até 6 imagens</span>
                      </label>
                    </div>

                    {validImages.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4 max-h-[200px] overflow-y-auto scrollbar-thin">
                        {validImages.map((file, idx) => (
                          <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#E2E8F0]">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-24 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 font-bold shadow-md"
                              title="Remover imagem"
                            >
                              ×
                            </button>
                            <p className="text-xs text-[#718096] px-2 py-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {/* Step 3: Display Settings */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#1A202C]">Configurações de Exibição</h2>

                    {/* Dias da Semana */}
                    <FormField
                      control={form.control}
                      name="exibDia"
                      render={({ field }) => {
                        const diasDaSemana = [
                          { value: "domingo", label: "Domingo" },
                          { value: "segunda", label: "Segunda-feira" },
                          { value: "terca", label: "Terça-feira" },
                          { value: "quarta", label: "Quarta-feira" },
                          { value: "quinta", label: "Quinta-feira" },
                          { value: "sexta", label: "Sexta-feira" },
                          { value: "sabado", label: "Sábado" },
                        ];
                        
                        const todosDias = diasDaSemana.map(d => d.value);
                        const todosSelecionados = todosDias.every(dia => (field.value || []).includes(dia));
                        
                        const handleToggle = (dia: string) => {
                          const currentDias = field.value || [];
                          const newDias = currentDias.includes(dia)
                            ? currentDias.filter((d: string) => d !== dia)
                            : [...currentDias, dia];
                          field.onChange(newDias);
                        };
                        
                        const handleToggleTodos = () => {
                          if (todosSelecionados) {
                            field.onChange([]);
                          } else {
                            field.onChange(todosDias);
                          }
                        };
                        
                        return (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-[#2D3748]">
                              Dias da Semana * (selecione pelo menos um)
                            </FormLabel>
                            <div className="space-y-3">
                              <label className="flex items-center gap-2 cursor-pointer p-2 bg-purple-50 rounded-lg border border-purple-200">
                                <input
                                  type="checkbox"
                                  checked={todosSelecionados}
                                  onChange={handleToggleTodos}
                                  className="h-4 w-4 text-[#805AD5] focus:ring-[#805AD5] border-[#CBD5E0] rounded accent-[#805AD5]"
                                />
                                <span className="text-sm font-semibold text-[#805AD5]">Todos os dias</span>
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {diasDaSemana.map((dia) => (
                                  <label key={dia.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={(field.value || []).includes(dia.value)}
                                      onChange={() => handleToggle(dia.value)}
                                      className="h-4 w-4 text-[#805AD5] focus:ring-[#805AD5] border-[#CBD5E0] rounded accent-[#805AD5]"
                                    />
                                    <span className="text-sm text-[#2D3748]">{dia.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Período de Exibição */}
                    <div className="space-y-2">
                      <FormLabel className="text-sm font-medium text-[#2D3748]">Período de Exibição * (selecione pelo menos um)</FormLabel>
                      <div className="space-y-3">
                        {/* Opção Todos os Períodos */}
                        <label 
                          className="flex items-center gap-2 cursor-pointer p-2 bg-purple-50 rounded-lg border border-purple-200"
                          onClick={(e) => {
                            e.preventDefault();
                            const manha = form.getValues("exibManha");
                            const tarde = form.getValues("exibTarde");
                            const noite = form.getValues("exibNoite");
                            const todosSelecionados = manha && tarde && noite;
                            
                            form.setValue("exibManha", !todosSelecionados);
                            form.setValue("exibTarde", !todosSelecionados);
                            form.setValue("exibNoite", !todosSelecionados);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              form.watch("exibManha") && 
                              form.watch("exibTarde") && 
                              form.watch("exibNoite")
                            }
                            readOnly
                            className="h-4 w-4 text-[#805AD5] focus:ring-[#805AD5] border-[#CBD5E0] rounded accent-[#805AD5] pointer-events-none"
                          />
                          <span className="text-sm font-semibold text-[#805AD5]">Todos os períodos</span>
                        </label>
                        
                        <div className="flex flex-col gap-3">
                          <FormField
                            control={form.control}
                            name="exibManha"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 text-[#805AD5] border-[#CBD5E0] rounded focus:ring-[#805AD5] accent-[#805AD5]"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm text-[#2D3748] cursor-pointer mt-0!">
                                  Manhã
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="exibTarde"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 text-[#805AD5] border-[#CBD5E0] rounded focus:ring-[#805AD5] accent-[#805AD5]"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm text-[#2D3748] cursor-pointer mt-0!">
                                  Tarde
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="exibNoite"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 text-[#805AD5] border-[#CBD5E0] rounded focus:ring-[#805AD5] accent-[#805AD5]"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm text-[#2D3748] cursor-pointer mt-0!">
                                  Noite
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Início da Exibição */}
                      <FormField
                        control={form.control}
                        name="exibInicio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-[#2D3748]">
                              Início da Exibição *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Fim da Exibição */}
                      <FormField
                        control={form.control}
                        name="exibFim"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-[#2D3748]">
                              Fim da Exibição *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Cor */}
                      <FormField
                        control={form.control}
                        name="cor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-[#2D3748]">
                              Cor do Card *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all bg-white">
                                  <SelectValue placeholder="Selecione uma cor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border border-[#CBD5E0] rounded-lg shadow-lg max-h-[300px]">
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="1">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#6B7280] shadow-sm shrink-0"></div>
                                    <span>Cinza Escuro</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#F98DBE] shadow-sm shrink-0"></div>
                                    <span>Rosa</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#B596FF] shadow-sm shrink-0"></div>
                                    <span>Roxo</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#76ADFF] shadow-sm shrink-0"></div>
                                    <span>Azul</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#77D86B] shadow-sm shrink-0"></div>
                                    <span>Verde</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#F2CA77] shadow-sm shrink-0"></div>
                                    <span>Amarelo</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="7">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#FBA67A] shadow-sm shrink-0"></div>
                                    <span>Laranja</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="8">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#FF766D] shadow-sm shrink-0"></div>
                                    <span>Vermelho</span>
                                  </div>
                                </SelectItem>
                                <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] cursor-pointer" value="9">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-white border-2 border-dashed border-gray-400 shrink-0"></div>
                                    <span>Transparente</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Animação */}
                      <FormField
                        control={form.control}
                        name="animacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-[#2D3748]">
                              Animação de Entrada *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all bg-white">
                                  <SelectValue placeholder="Selecione uma animação" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border border-[#CBD5E0] rounded-lg shadow-lg max-h-[300px]">
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="1"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Fade In', classe: 'animate__fadeIn' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Fade In (Aparecer)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="2"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Fade In Up', classe: 'animate__fadeInUp' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Fade In Up (Subir)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="3"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Fade In Down', classe: 'animate__fadeInDown' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Fade In Down (Descer)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="4"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Slide In Left', classe: 'animate__slideInLeft' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Slide In Left (Esquerda)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="5"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Slide In Right', classe: 'animate__slideInRight' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Slide In Right (Direita)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="6"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Zoom In', classe: 'animate__zoomIn' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Zoom In (Aproximar)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="7"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Flip In X', classe: 'animate__flipInX' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Flip In X (Girar Horizontal)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="8"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Bounce In', classe: 'animate__bounceIn' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Bounce In (Saltar)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="9"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Back In Down', classe: 'animate__backInDown' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Back In Down (Voltar de Cima)
                                </SelectItem>
                                <SelectItem 
                                  className="text-[#2D3748] cursor-pointer" 
                                  value="10"
                                  onMouseEnter={() => {
                                    setAnimacaoPreview({ nome: 'Back In Up', classe: 'animate__backInUp' });
                                    setAnimacaoKey(prev => prev + 1);
                                  }}
                                  onMouseLeave={() => setAnimacaoPreview(null)}
                                  onClick={() => setAnimacaoPreview(null)}
                                >
                                  Back In Up (Voltar de Baixo)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
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
      </div>

      {/* Preview da Animação */}
      {animacaoPreview && (
        <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-2xl border-2 border-[#805AD5] p-6 z-50 w-[200px]">
          <p className="text-sm font-semibold text-[#2D3748] mb-3 text-center">
            {animacaoPreview.nome}
          </p>
          <div className="flex items-center justify-center w-full h-32 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg overflow-hidden">
            <div
              key={animacaoKey}
              className={`w-16 h-16 bg-gradient-to-br from-[#805AD5] to-[#9F7AEA] rounded-lg shadow-lg animate__animated ${animacaoPreview.classe}`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
