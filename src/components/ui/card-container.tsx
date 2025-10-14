"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import EventCard from "./event-card";
import { Evento } from "@/types/eventos";
import { Input } from "./input";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface CardContainerProps {
  eventos: Evento[];
  titulo?: string;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onToggleStatus?: (eventId: string, currentStatus: number) => void;
}

export default function CardContainer({
  eventos,
  titulo = "Meus Eventos",
  onEdit,
  onDelete,
  onToggleStatus,
}: CardContainerProps) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filtrar eventos baseado nos critérios de busca
  const filteredEventos = eventos.filter((evento) => {
    // Filtro de texto
    const matchesSearch =
      searchText === "" ||
      evento.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
      evento.descricao.toLowerCase().includes(searchText.toLowerCase());

    // Filtro de status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && evento.status === 1) ||
      (statusFilter === "inactive" && evento.status === 0);

    // Filtro de categoria
    const matchesCategory =
      categoryFilter === "all" || evento.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Extrair categorias únicas
  const categorias = Array.from(
    new Set(eventos.map((evento) => evento.categoria))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já é feita em tempo real pelo filteredEventos
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{titulo}</h1>

      {/* Barra de busca e filtros */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Campo de busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 h-10 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500"
            />
          </div>

          {/* Filtro de status */}
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-10 border-gray-300 text-gray-700 bg-white focus:ring-0 focus:ring-offset-0 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all" className="text-gray-900">Todos os status</SelectItem>
                <SelectItem value="active" className="text-gray-900">Ativo</SelectItem>
                <SelectItem value="inactive" className="text-gray-900">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de categoria */}
          <div className="w-full md:w-52">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full h-10 border-gray-300 text-gray-700 bg-white focus:ring-0 focus:ring-offset-0 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all" className="text-gray-900">Todas as categorias</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria} className="text-gray-900">
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
      </form>

      {/* Grid de cards */}
      {filteredEventos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEventos.map((evento) => (
            <EventCard
              key={evento._id}
              evento={evento}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum evento encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros de busca.
          </p>
        </div>
      )}
    </div>
  );
}
