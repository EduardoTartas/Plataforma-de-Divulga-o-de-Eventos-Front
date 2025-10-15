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

const ITEMS_PER_PAGE = 8; // 2 fileiras x 4 cards = 8 eventos por página

export default function MeusEventosPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
    
    // Estado para controlar o modal de confirmação de exclusão
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        eventId: "",
        eventTitle: "",
    });

    // Buscar eventos usando React Query
    const { data, isLoading, isError, error } = useEventos({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
    });

    // Hooks para ações
    const { toggleStatus, isPending: toggleStatusIsPending } = useToggleEventStatus();
    const { deleteEvent, isPending: deleteEventIsPending } = useDeleteEvent();

    // Valores derivados dos dados
    const eventos = data?.data?.docs || [];
    const totalPages = data?.data?.totalPages || 0;
    const totalDocs = data?.data?.totalDocs || 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEdit = (eventId: string) => {
        console.log('Editar evento:', eventId);
        // TODO: Navegar para página de edição
        // router.push(`/editar_eventos?id=${eventId}`);
    };

    const handleDelete = (eventId: string) => {
        // Encontrar o evento para pegar o título
        const evento = eventos.find(e => e._id === eventId);
        
        // Abrir o modal de confirmação
        setDeleteModal({
            isOpen: true,
            eventId,
            eventTitle: evento?.titulo || "este evento",
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteEvent(deleteModal.eventId);
            // Toast de sucesso é exibido automaticamente pelo hook
        } catch (error) {
            // Toast de erro é exibido automaticamente pelo hook
        }
    };

    const handleToggleStatus = async (eventId: string, currentStatus: number) => {
        const newStatus = currentStatus === 1 ? 0 : 1;

        try {
            await toggleStatus({ eventId, newStatus });
            // Toast de sucesso é exibido automaticamente pelo hook
        } catch (error) {
            // Toast de erro é exibido automaticamente pelo hook
        }
    };

    const handleCriarEvento = () => {
        console.log('Navegar para criar evento');
        // Aqui você adicionaria a navegação para a página de criar evento
        // router.push('/criar_eventos');
    };

    return (
        <div className="font-inter">
            <Header logo="/ifro-events-icon.svg"/>
            
            {/* Banner Hero */}
            <div className="relative overflow-hidden bg-indigo-700">
                <div className="container mx-auto px-6 py-12 lg:py-16 relative z-10">
                    <div className="relative z-10 max-w-3xl">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white font-inter mb-4">
                            Facilidade para os professores, Informação para os alunos!
                        </h1>
                        <p className="text-lg text-white/90 font-inter mb-8 leading-relaxed">
                            Gerencie eventos acadêmicos, culturais e institucionais e exiba nos totens do campus em poucos cliques.
                        </p>
                        <button
                            onClick={handleCriarEvento}
                            className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold font-inter rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Criar Evento
                        </button>
                    </div>
                </div>
                
                {/* Imagem das mãos alinhada à esquerda - oculta em telas menores que 1546px */}
                <div className="absolute bottom-0 right-20 z-20 pointer-events-none hidden min-[1546px]:block">
                    <img 
                        src="/teste.png" 
                        alt="Ilustração de mãos" 
                        className="object-contain w-[650px] h-auto max-h-[140%]"
                    />
                </div>
                
                {/* Elementos decorativos */}
                {/* Círculos grandes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-32 translate-y-32"></div>
                
                {/* Círculos médios */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full"></div>
                <div className="absolute bottom-20 right-32 w-40 h-40 bg-gradient-to-tl from-purple-300/15 to-transparent rounded-full"></div>
                
                {/* Círculos pequenos */}
                <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute top-1/2 left-10 w-12 h-12 bg-gradient-to-r from-blue-300/20 to-transparent rounded-full"></div>
                <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-bl from-yellow-300/15 to-transparent rounded-full"></div>
                
                {/* Formas geométricas */}
                <div className="absolute top-16 right-1/3 w-8 h-8 bg-white/15 rounded-md transform rotate-45"></div>
                <div className="absolute bottom-16 right-1/4 w-6 h-6 bg-green-300/20 rounded-sm transform rotate-12"></div>
                <div className="absolute top-1/3 right-16 w-10 h-10 border-2 border-white/20 rounded-full"></div>
                
                {/* Pontos decorativos */}
                <div className="absolute top-24 left-1/3 w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="absolute top-40 right-1/2 w-2 h-2 bg-purple-300/40 rounded-full"></div>
                <div className="absolute bottom-24 left-1/2 w-4 h-4 bg-blue-300/25 rounded-full"></div>
            </div>

            <div className="bg-[#F9FAFB] min-h-[calc(100vh-400px)]">
                <div className="container mx-auto px-6 py-8">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12 min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <span className="ml-3 text-gray-600">Carregando eventos...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center min-h-[400px] flex flex-col items-center justify-center">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Erro ao carregar eventos
                            </h3>
                            <p className="text-red-600">
                                {error instanceof Error ? error.message : "Ocorreu um erro desconhecido"}
                            </p>
                        </div>
                    )}

                    {/* Content */}
                    {!isLoading && !isError && (
                        <>
                            <CardContainer
                                eventos={eventos}
                                titulo="Meus Eventos"
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                    
                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center space-y-4 mt-8">
                            {/* Informação de paginação */}
                            <div className="text-sm text-gray-600">
                                Página {currentPage} de {totalPages} ({totalDocs} eventos no total)
                            </div>

                            <Pagination>
                                <PaginationContent>
                                    {/* Botão Anterior */}
                                    <PaginationItem>
                                        <button
                                            onClick={() => {
                                                if (currentPage > 1) handlePageChange(currentPage - 1);
                                            }}
                                            disabled={currentPage === 1}
                                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                currentPage === 1 
                                                    ? 'pointer-events-none opacity-50 cursor-not-allowed' 
                                                    : 'cursor-pointer'
                                            } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Anterior
                                        </button>
                                    </PaginationItem>

                                    {/* Números das páginas */}
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = index + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = index + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + index;
                                        } else {
                                            pageNum = currentPage - 2 + index;
                                        }

                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(pageNum);
                                                    }}
                                                    isActive={currentPage === pageNum}
                                                    className={`cursor-pointer ${
                                                        currentPage === pageNum
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
                                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {/* Botão Próximo */}
                                    <PaginationItem>
                                        <button
                                            onClick={() => {
                                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                            }}
                                            disabled={currentPage === totalPages}
                                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                currentPage === totalPages 
                                                    ? 'pointer-events-none opacity-50 cursor-not-allowed' 
                                                    : 'cursor-pointer'
                                            } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                                        >
                                            Próximo
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
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

            {/* Modal de confirmação de exclusão */}
            <AlertModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, eventId: "", eventTitle: "" })}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o evento "${deleteModal.eventTitle}"? Esta ação não pode ser desfeita.`}
                icon="/alertR.svg"
                type="alerta"
                button1={{
                    text: "Excluir",
                    action: confirmDelete,
                    className: "bg-red-600 hover:bg-red-700 text-white",
                }}
                button2={{
                    text: "Cancelar",
                    action: () => {},
                    className: "bg-gray-200 hover:bg-gray-300 text-gray-800",
                }}
            />
        </div>
    );
}