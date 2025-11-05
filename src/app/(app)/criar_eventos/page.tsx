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
import { fetchData } from "@/services/api";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { link } from "fs";

export default function CriarEvento() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    local: "",
    organizador: "",
    link: "",
    horaInicio: "",
    horaTermino: "",
    dataInicio: "",
    dataFim: "",
    tags: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoria: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combinar data e hora para criar timestamps completos
      const dataInicioCompleta =
        formData.dataInicio && formData.horaInicio
          ? `${formData.dataInicio}T${formData.horaInicio}:00`
          : "";

      const dataFimCompleta =
        formData.dataFim && formData.horaTermino
          ? `${formData.dataFim}T${formData.horaTermino}:00`
          : "";

      // Converter tags de string para array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const eventoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: formData.categoria,
        local: formData.local,
        organizador: formData.organizador,
        dataInicio: dataInicioCompleta,
        dataFim: dataFimCompleta,
        tags: tagsArray,
        link: formData.link,
        // Adicione outros campos conforme necessário pela API
        cor: 0,
        animacao: 0,
        status: 1,
      };

      await fetchData(
        "/eventos",
        "POST",
        session?.user?.accesstoken,
        eventoData
      );

      toast.success("Evento criado com sucesso!");
      router.push("/meus_eventos");
    } catch (error: any) {
      console.error("Erro ao criar evento:", error);
      toast.error(error.message || "Erro ao criar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/meus_eventos");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Criar Evento</h1>
            <p className="text-sm text-gray-600 mt-2">
              Para cadastrar um evento, preencha as informações propostas na
              primeira página e em seguida adicione imagens, vídeos e outros
              arquivos de desejar antes de finalizar o cadastro
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Evento */}
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-[#374151]">
                Nome do Evento
              </Label>
              <Input
                id="titulo"
                name="titulo"
                type="text"
                placeholder="Digite o nome do evento"
                value={formData.titulo}
                onChange={handleInputChange}
                className="border-[#9CA3AF] placeholder:text-[#9CA3AF] text-[#374151]"
                required
              />
            </div>

            {/* Descrição do evento */}
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-[#374151]">
                Descrição do evento
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva os detalhes do evento"
                value={formData.descricao}
                onChange={handleInputChange}
                className="border-[#9CA3AF] placeholder:text-[#9CA3AF] text-[#374151]"
                rows={5}
                required
              />
            </div>

            {/* Categoria e Local */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-[#374151]">
                  Categoria
                </Label>
                <Select
                  value={formData.categoria}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger
                    id="categoria"
                    className="w-full border-[#9CA3AF] data-[placeholder]:text-[#9CA3AF] bg-white text-[#374151]"
                  >
                    <SelectValue placeholder="Ex: Palestra, Workshop, Seminário" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem className="text-[#374151]" value="palestra">
                      Palestra
                    </SelectItem>
                    <SelectItem className="text-[#374151]" value="workshop">
                      Workshop
                    </SelectItem>
                    <SelectItem className="text-[#374151]" value="seminario">
                      Seminário
                    </SelectItem>
                    <SelectItem className="text-[#374151]" value="curso">
                      Curso
                    </SelectItem>
                    <SelectItem className="text-[#374151]" value="esportes">
                      Esportes
                    </SelectItem>
                    <SelectItem className="text-[#374151]" value="outro">
                      Outro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local" className="text-[#374151]">
                  Local
                </Label>
                <Input
                  id="local"
                  name="local"
                  type="text"
                  placeholder="Local onde será realizado o evento"
                  value={formData.local}
                  onChange={handleInputChange}
                  className="border-[#9CA3AF] placeholder:text-[#9CA3AF] text-[#374151]"
                  required
                />
              </div>
            </div>

            {/* Organizador e Período de Inscrição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizador" className="text-[#374151]">
                  Organizador
                </Label>
                <Input
                  id="organizador"
                  name="organizador"
                  type="text"
                  placeholder="Nome do organizador ou departamento"
                  value={formData.organizador}
                  onChange={handleInputChange}
                  className="border-[#9CA3AF] placeholder:text-[#9CA3AF] text-[#374151]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link" className="text-[#374151]">
                  Link externo
                </Label>
                <Input
                  id="link"
                  name="link"
                  type="text"
                  placeholder="Link externo para inscrições ou mais informações"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="border-[#9CA3AF] placeholder:text-[#9CA3AF] text-[#374151]"
                />
              </div>
            </div>

            {/* Hora de Início e Término */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horaInicio" className="text-[#374151]">
                  Hora de Início
                </Label>
                <Input
                  id="horaInicio"
                  name="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  className="border-[#9CA3AF] text-[#374151]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaTermino" className="text-[#374151]">
                  Hora de Término
                </Label>
                <Input
                  id="horaTermino"
                  name="horaTermino"
                  type="time"
                  value={formData.horaTermino}
                  onChange={handleInputChange}
                  className="border-[#9CA3AF] text-[#374151]"
                  required
                />
              </div>
            </div>

            {/* Data de Término e Início do Evento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio" className="text-[#374151]">
                  Data de Início do Evento
                </Label>
                <Input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={handleInputChange}
                  className="border-[#9CA3AF] text-[#374151]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim" className="text-[#374151]">
                  Data de Início do Evento
                </Label>
                <Input
                  id="dataFim"
                  name="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={handleInputChange}
                  className="border-[#9CA3AF] text-[#374151]"
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-[#374151]">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                placeholder="Separe as tags por vírgula (ex: educação, tecnologia, workshop)"
                value={formData.tags}
                onChange={handleInputChange}
                className="border-[#9CA3AF] placeholder:text-[#9CA3AF] text-[#374151]"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Criando..." : "Continuar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
