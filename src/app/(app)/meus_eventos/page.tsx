"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/ui/header";
import CardContainer from "@/components/ui/card-container";
import AlertModal from "@/components/ui/alertModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useEventos, useToggleEventStatus, useDeleteEvent } from "@/hooks/useEventos";

const ITEMS_PER_PAGE = 8;

export default function MeusEventosPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: "",
    eventTitle: "",
  });

  const { data, isLoading, isError, error } = useEventos({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    filters,
  });

  const { toggleStatus } = useToggleEventStatus();
  const { deleteEvent } = useDeleteEvent();

  const eventos = data?.data?.docs || [];
  const totalPages = data?.data?.totalPages || 0;
  const totalDocs = data?.data?.totalDocs || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: { search: string; status: string; category: string }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleEdit = (eventId: string) => {
    console.log("Editar evento:", eventId);
  };

  const handleDelete = (eventId: string) => {
    const evento = eventos.find((e) => e._id === eventId);
    setDeleteModal({
      isOpen: true,
      eventId,
      eventTitle: evento?.titulo || "este evento",
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteEvent(deleteModal.eventId);
    } catch (error) {}
  };

  const handleToggleStatus = async (eventId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await toggleStatus({ eventId, newStatus });
    } catch (error) {}
  };

  const handleCriarEvento = () => {
    console.log("Navegar para criar evento");
  };

  return (
    <div className="font-inter" data-test="meus-eventos-page">

      <div className="relative overflow-hidden bg-indigo-700" data-test="banner-hero">
        <div className="container mx-auto px-6 py-12 lg:py-16 relative z-10">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-inter mb-4"
                data-test="titulo-banner">
              Facilidade para os professores, Informação para os alunos!
            </h1>

            <p className="text-lg text-white/90 font-inter mb-8 leading-relaxed"
               data-test="descricao-banner">
              Gerencie eventos acadêmicos, culturais e institucionais e exiba nos totens do campus em poucos cliques.
            </p>

            <button
              onClick={handleCriarEvento}
              data-test="btn-criar-evento"
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold font-inter rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Evento
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#F9FAFB] min-h-[calc(100vh-400px)]">
        <div className="container mx-auto px-6 py-8">

          {isLoading && (
            <div className="flex items-center justify-center py-12 min-h-[400px]" data-test="loading-eventos">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Carregando eventos...</span>
            </div>
          )}

          {isError && (
            <div data-test="erro-eventos"
              className="bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[400px] flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar eventos</h3>
              <p className="text-red-600">
                {error instanceof Error ? error.message : "Erro desconhecido"}
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <CardContainer
                data-test="lista-eventos"
                eventos={eventos}
                titulo="Meus Eventos"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />

              {totalPages > 1 && (
                <div className="flex flex-col items-center space-y-4 mt-8" data-test="paginacao-container">

                  <div className="text-sm text-gray-600" data-test="paginacao-info">
                    Página {currentPage} de {totalPages} ({totalDocs} eventos)
                  </div>

                  <Pagination>
                    <PaginationContent data-test="paginacao-botoes">

                      {/* Botão Anterior */}
                      <PaginationItem>
                        <button
                          data-test="btn-anterior"
                          type="button"
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === 1 ? "pointer-events-none opacity-50" : ""
                          } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                        >
                          ←
                        </button>
                      </PaginationItem>

                      {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = index + 1;
                        else if (currentPage <= 3) pageNum = index + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + index;
                        else pageNum = currentPage - 2 + index;

                        return (
                          <PaginationItem key={pageNum}>
                            <button
                              data-test={`btn-pagina-${pageNum}`}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                currentPage === pageNum
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          </PaginationItem>
                        );
                      })}

                      {/* Botão Próximo */}
                      <PaginationItem>
                        <button
                          data-test="btn-proximo"
                          type="button"
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                          } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                        >
                          →
                        </button>
                      </PaginationItem>

                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AlertModal
        data-test="modal-excluir"
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, eventId: "", eventTitle: "" })}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o evento "${deleteModal.eventTitle}"?`}
        icon="/alertR.svg"
        type="alerta"
        button1={{
          text: "Excluir",
          action: confirmDelete,
          className: "bg-red-600 hover:bg-red-700 text-white",
          "data-test": "btn-confirmar-excluir",
        } as any}
        button2={{
          text: "Cancelar",
          action: () => {},
          className: "bg-gray-200 hover:bg-gray-300 text-gray-800",
          "data-test": "btn-cancelar-excluir",
        } as any}
      />
    </div>
  );
}
