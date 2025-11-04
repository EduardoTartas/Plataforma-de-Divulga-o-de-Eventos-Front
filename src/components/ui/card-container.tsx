"use client";

import { useState, useEffect, useRef } from "react";
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
  onFilterChange?: (filters: { search: string; status: string; category: string }) => void;
  initialFilters?: { search: string; status: string; category: string };
}

export default function CardContainer({
  eventos,
  titulo = "Meus Eventos",
  onEdit,
  onDelete,
  onToggleStatus,
  onFilterChange,
  initialFilters = { search: "", status: "all", category: "all" },
}: CardContainerProps) {
  const [searchText, setSearchText] = useState(initialFilters.search);
  const [statusFilter, setStatusFilter] = useState(initialFilters.status);
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.category);
  const isFirstRender = useRef(true);

  // Debounce para a busca
  useEffect(() => {
    const isFirst = isFirstRender.current;
    const timer = setTimeout(() => {
      if (isFirst) {
        // Não disparar o onFilterChange na primeira montagem; apenas marcar que já passou
        isFirstRender.current = false;
        return;
      }

      if (onFilterChange) {
        onFilterChange({
          search: searchText,
          status: statusFilter,
          category: categoryFilter,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]); 

  // Aplicar filtros imediatamente para status e categoria (sem debounce)
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({
          search: searchText,
          status: value,
          category: categoryFilter,
        });
      }
    }, 0);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({
          search: searchText,
          status: statusFilter,
          category: value,
        });
      }
    }, 0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div data-test="CardContainer" data-testid="CardContainer" className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Título */}
      <h1 data-test="CardContainer--title" data-testid="CardContainer--title" className="text-2xl font-bold text-gray-900 mb-6">{titulo}</h1>

      {/* Barra de busca e filtros */}
      <form onSubmit={handleSearch} className="mb-6" data-test="CardContainer--filters" data-testid="CardContainer--filters">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Campo de busca */}
          <div className="flex-1 relative" data-test="CardContainer--search" data-testid="CardContainer--search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 h-10 border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500"
              data-test="CardContainer--search-input"
              data-testid="CardContainer--search-input"
            />
          </div>

          {/* Filtro de status */}
          <div className="w-full md:w-48" data-test="CardContainer--status-filter" data-testid="CardContainer--status-filter">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full h-10 border-gray-300 text-gray-700 bg-white focus:ring-0 focus:ring-offset-0 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500" data-test="CardContainer--status-trigger" data-testid="CardContainer--status-trigger">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent className="bg-white" data-test="CardContainer--status-content" data-testid="CardContainer--status-content">
                <SelectItem value="all" className="text-gray-900" data-test="CardContainer--status-all" data-testid="CardContainer--status-all">Todos os status</SelectItem>
                <SelectItem value="active" className="text-gray-900" data-test="CardContainer--status-active" data-testid="CardContainer--status-active">Ativo</SelectItem>
                <SelectItem value="inactive" className="text-gray-900" data-test="CardContainer--status-inactive" data-testid="CardContainer--status-inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de categoria */}
          <div className="w-full md:w-52" data-test="CardContainer--category-filter" data-testid="CardContainer--category-filter">
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full h-10 border-gray-300 text-gray-700 bg-white focus:ring-0 focus:ring-offset-0 focus:border-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-indigo-500" data-test="CardContainer--category-trigger" data-testid="CardContainer--category-trigger">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent className="bg-white" data-test="CardContainer--category-content" data-testid="CardContainer--category-content">
                <SelectItem value="all" className="text-gray-900" data-test="CardContainer--category-all" data-testid="CardContainer--category-all">Todas as categorias</SelectItem>
                <SelectItem value="palestra" className="text-gray-900" data-test="CardContainer--category-palestra" data-testid="CardContainer--category-palestra">Palestra</SelectItem>
                <SelectItem value="seminario" className="text-gray-900" data-test="CardContainer--category-seminario" data-testid="CardContainer--category-seminario">Seminário</SelectItem>
                <SelectItem value="workshop" className="text-gray-900" data-test="CardContainer--category-workshop" data-testid="CardContainer--category-workshop">Workshop</SelectItem>
                <SelectItem value="curso" className="text-gray-900" data-test="CardContainer--category-curso" data-testid="CardContainer--category-curso">Curso</SelectItem>
                <SelectItem value="conferencia" className="text-gray-900" data-test="CardContainer--category-conferencia" data-testid="CardContainer--category-conferencia">Conferência</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </form>

      {/* Grid de cards */}
      {eventos.length > 0 ? (
        <div data-test="CardContainer--grid" data-testid="CardContainer--grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventos.map((evento) => (
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
        <div data-test="CardContainer--empty" data-testid="CardContainer--empty" className="text-center py-12">
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
