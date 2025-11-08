"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCriarEvento } from "@/hooks/useCriarEvento";

export default function CriarEvento() {
  const router = useRouter();
  const {
    formData,
    handleChange,
    handleCheckboxChange,
    handleSelectChange,
    handleTagsChange,
    handleDiasChange,
    handleFilesChange,
    handleRemoveImage,
    validImages,
    step,
    setStep,
    validateStep,
    submit,
    loading,
    errors,
    touchedFields,
  } = useCriarEvento();

  const [tagInput, setTagInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const diasDaSemana = [
    { value: "domingo", label: "Domingo" },
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
    { value: "sabado", label: "Sábado" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      // Validate current step before advancing
      const isValid = validateStep(step);
      if (isValid) {
        setStep(step + 1);
      }
      return;
    }

    // Final step - validate and submit
    const isValid = validateStep(step);
    if (!isValid) return;

    const ok = await submit();
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
    router.push("/meus_eventos");
  };

  const handleDiaToggle = (dia: string) => {
    const currentDias = formData.exibDia || [];
    const newDias = currentDias.includes(dia)
      ? currentDias.filter((d) => d !== dia)
      : [...currentDias, dia];
    handleDiasChange(newDias);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTags = [...formData.tags, tagInput.trim()];
      handleTagsChange(newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    handleTagsChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
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
              <h1 className="text-3xl font-bold text-[#1A202C]">Criar Evento</h1>
            </div>
            <p className="text-base text-[#4A5568] ml-9">
              Etapa {step} de 3: {step === 1 ? "Informações Básicas" : step === 2 ? "Upload de Mídia" : "Configurações de Exibição"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                {/* Step 1: Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-sm font-medium text-[#2D3748]">
                    Nome do Evento *
                  </Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    type="text"
                    placeholder="Digite o nome do evento"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                    required
                  />
                  {touchedFields.has('titulo') && errors.titulo && <p className="text-sm text-red-600 mt-1">{errors.titulo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-sm font-medium text-[#2D3748]">
                    Descrição do evento *
                  </Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descreva os detalhes do evento"
                    value={formData.descricao}
                    onChange={handleChange}
                    className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all resize-none"
                    rows={5}
                    required
                  />
                  {touchedFields.has('descricao') && errors.descricao && <p className="text-sm text-red-600 mt-1">{errors.descricao}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="text-sm font-medium text-[#2D3748]">
                      Categoria *
                    </Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => handleSelectChange(value, "categoria")}
                      required
                    >
                      <SelectTrigger 
                        id="categoria"
                        className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all bg-white"
                      >
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
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
                    {touchedFields.has('categoria') && errors.categoria && <p className="text-sm text-red-600 mt-1">{errors.categoria}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="local" className="text-sm font-medium text-[#2D3748]">
                      Local *
                    </Label>
                    <Input
                      id="local"
                      name="local"
                      type="text"
                      placeholder="Local onde será realizado o evento"
                      value={formData.local}
                      onChange={handleChange}
                      className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                      required
                    />
                    {touchedFields.has('local') && errors.local && <p className="text-sm text-red-600 mt-1">{errors.local}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio" className="text-sm font-medium text-[#2D3748] flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hora de Início *
                    </Label>
                    <Input
                      id="dataInicio"
                      name="dataInicio"
                      type="datetime-local"
                      value={formData.dataInicio}
                      onChange={handleChange}
                      className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                      required
                    />
                    {touchedFields.has('dataInicio') && errors.dataInicio && <p className="text-sm text-red-600 mt-1">{errors.dataInicio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataFim" className="text-sm font-medium text-[#2D3748] flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hora de Término *
                    </Label>
                    <Input
                      id="dataFim"
                      name="dataFim"
                      type="datetime-local"
                      value={formData.dataFim}
                      onChange={handleChange}
                      className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                      required
                    />
                    {touchedFields.has('dataFim') && errors.dataFim && <p className="text-sm text-red-600 mt-1">{errors.dataFim}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link" className="text-sm font-medium text-[#2D3748]">
                    Link
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    placeholder="https://exemplo.com"
                    value={formData.link ?? ""}
                    onChange={handleChange}
                    className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                  />
                  {touchedFields.has('link') && errors.link && <p className="text-sm text-red-600 mt-1">{errors.link}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium text-[#2D3748]">
                    Tags * (mínimo 1)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      type="text"
                      placeholder="Digite uma tag e pressione Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
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
                    {formData.tags.map((tag, index) => (
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
                  {touchedFields.has('tags') && errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Step 2: Image Upload */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-[#1A202C]">Upload de Mídia</h2>
                  <p className="text-sm text-[#4A5568]">
                    Adicione imagens (mínimo 1280x720 pixels). Você pode arrastar e soltar ou clicar para selecionar. <strong>Limite: 10 imagens ({validImages.length}/10)</strong>
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
                      <span className="text-sm text-[#718096]">PNG, JPG até 10 imagens</span>
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

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2D3748]">
                      Dias da Semana * (selecione pelo menos um)
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {diasDaSemana.map((dia) => (
                        <label key={dia.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formData.exibDia || []).includes(dia.value)}
                            onChange={() => handleDiaToggle(dia.value)}
                            className="h-4 w-4 text-[#805AD5] focus:ring-[#805AD5] border-[#CBD5E0] rounded accent-[#805AD5]"
                          />
                          <span className="text-sm text-[#2D3748]">{dia.label}</span>
                        </label>
                      ))}
                    </div>
                    {touchedFields.has('exibDia') && errors.exibDia && <p className="text-sm text-red-600 mt-1">{errors.exibDia}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2D3748]">Período de Exibição * (selecione pelo menos um)</Label>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.exibManha}
                          onChange={(e) => handleCheckboxChange("exibManha", e.target.checked)}
                          className="w-4 h-4 text-[#805AD5] border-[#CBD5E0] rounded focus:ring-[#805AD5] accent-[#805AD5]"
                        />
                        <span className="text-sm text-[#2D3748]">Manhã</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.exibTarde}
                          onChange={(e) => handleCheckboxChange("exibTarde", e.target.checked)}
                          className="w-4 h-4 text-[#805AD5] border-[#CBD5E0] rounded focus:ring-[#805AD5] accent-[#805AD5]"
                        />
                        <span className="text-sm text-[#2D3748]">Tarde</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.exibNoite}
                          onChange={(e) => handleCheckboxChange("exibNoite", e.target.checked)}
                          className="w-4 h-4 text-[#805AD5] border-[#CBD5E0] rounded focus:ring-[#805AD5] accent-[#805AD5]"
                        />
                        <span className="text-sm text-[#2D3748]">Noite</span>
                      </label>
                    </div>
                    {touchedFields.has('exibManha') && errors.exibManha && <p className="text-sm text-red-600 mt-1">{errors.exibManha}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exibInicio" className="text-sm font-medium text-[#2D3748]">
                        Início da Exibição *
                      </Label>
                      <Input
                        id="exibInicio"
                        name="exibInicio"
                        type="datetime-local"
                        value={formData.exibInicio}
                        onChange={handleChange}
                        className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                        required
                      />
                      {touchedFields.has('exibInicio') && errors.exibInicio && <p className="text-sm text-red-600 mt-1">{errors.exibInicio}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exibFim" className="text-sm font-medium text-[#2D3748]">
                        Fim da Exibição *
                      </Label>
                      <Input
                        id="exibFim"
                        name="exibFim"
                        type="datetime-local"
                        value={formData.exibFim}
                        onChange={handleChange}
                        className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all"
                        required
                      />
                      {touchedFields.has('exibFim') && errors.exibFim && <p className="text-sm text-red-600 mt-1">{errors.exibFim}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cor" className="text-sm font-medium text-[#2D3748]">
                        Cor *
                      </Label>
                      <Select
                        value={formData.cor}
                        onValueChange={(v) => handleSelectChange(v, "cor")}
                      >
                        <SelectTrigger
                          id="cor"
                          className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all bg-white"
                        >
                          <SelectValue placeholder="Selecione uma cor" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#CBD5E0] rounded-lg shadow-lg">
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="0">Cor 0</SelectItem>
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="1">Cor 1</SelectItem>
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="2">Cor 2</SelectItem>
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="3">Cor 3</SelectItem>
                        </SelectContent>
                      </Select>
                      {touchedFields.has('cor') && errors.cor && <p className="text-sm text-red-600 mt-1">{errors.cor}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="animacao" className="text-sm font-medium text-[#2D3748]">
                        Animação *
                      </Label>
                      <Select
                        value={formData.animacao}
                        onValueChange={(v) => handleSelectChange(v, "animacao")}
                      >
                        <SelectTrigger
                          id="animacao"
                          className="w-full border border-[#CBD5E0] rounded-lg px-4 py-3 text-[#2D3748] focus:outline-none focus:border-[#805AD5] focus:ring-2 focus:ring-[#E9D8FD] transition-all bg-white"
                        >
                          <SelectValue placeholder="Selecione uma animação" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#CBD5E0] rounded-lg shadow-lg">
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="0">Animação 0</SelectItem>
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="1">Animação 1</SelectItem>
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="2">Animação 2</SelectItem>
                          <SelectItem className="text-[#2D3748] hover:bg-[#F7FAFC] hover:text-[#805AD5] cursor-pointer" value="3">Animação 3</SelectItem>
                        </SelectContent>
                      </Select>
                      {touchedFields.has('animacao') && errors.animacao && <p className="text-sm text-red-600 mt-1">{errors.animacao}</p>}
                    </div>
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

              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#805AD5] hover:bg-[#6B46C1] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Carregando..."
                  : step < 3
                  ? "Continuar"
                  : "Finalizar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
