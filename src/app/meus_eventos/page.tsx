"use client";

import { useState } from "react";
import Header from "@/components/ui/header";
import EventCard from "@/components/ui/event-card";
import { Evento } from "@/types/eventos";

export default function MeusEventosPage() {
    // Criar datas dinâmicas para os testes
    const agora = new Date();
    const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000); // 1 hora atrás
    const umaHoraDepois = new Date(agora.getTime() + 60 * 60 * 1000); // 1 hora depois
    const amanha = new Date(agora.getTime() + 24 * 60 * 60 * 1000); // amanhã
    const ontem = new Date(agora.getTime() - 24 * 60 * 60 * 1000); // ontem

    // Dados falsos para visualização dos diferentes status
    const eventoEmBreve: Evento = {
        _id: "fake-id-123",
        titulo: "Workshop de Programação Web",
        descricao: "Workshop sobre desenvolvimento web moderno com React e Next.js",
        local: "Laboratório de Informática 3",
        dataInicio: amanha.toISOString(),
        dataFim: new Date(amanha.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 horas depois
        tags: ["tecnologia", "programação", "web"],
        categoria: "workshop",
        cor: 1,
        animacao: 0,
        status: 1, // Ativo (mas ainda vai acontecer = Em breve)
        midia: [],
        permissoes: [],
        organizador: {
            _id: "org-123",
            nome: "Eduardo Tartas"
        },
        updatedAt: "2025-10-07T23:35:32.558Z",
        createdAt: "2025-10-07T23:35:32.558Z"
    };

    const eventoAtivo: Evento = {
        _id: "fake-id-456",
        titulo: "Seminário de IA - Acontecendo Agora!",
        descricao: "Seminário sobre Inteligência Artificial em andamento",
        local: "Auditório Principal",
        dataInicio: umaHoraAtras.toISOString(), // Começou 1 hora atrás
        dataFim: umaHoraDepois.toISOString(), // Termina em 1 hora
        tags: ["inteligencia artificial", "tecnologia"],
        categoria: "seminario",
        cor: 2,
        animacao: 1,
        status: 1, // Ativo (e está acontecendo agora = Ativo)
        midia: [],
        permissoes: [],
        organizador: {
            _id: "org-456",
            nome: "Prof. Maria Silva"
        },
        updatedAt: "2025-10-07T23:35:32.558Z",
        createdAt: "2025-10-07T23:35:32.558Z"
    };

    const eventoInativo: Evento = {
        _id: "fake-id-789",
        titulo: "Feira de Ciências 2024",
        descricao: "Feira de ciências que já aconteceu",
        local: "Pátio Central",
        dataInicio: new Date(ontem.getTime() - 8 * 60 * 60 * 1000).toISOString(), // Ontem 8h antes
        dataFim: new Date(ontem.getTime() - 4 * 60 * 60 * 1000).toISOString(), // Ontem 4h antes
        tags: ["ciencias", "feira", "projetos"],
        categoria: "feira",
        cor: 3,
        animacao: 0,
        status: 1, // Ativo mas data já passou = Inativo
        midia: [],
        permissoes: [],
        organizador: {
            _id: "org-789",
            nome: "Coordenação Acadêmica"
        },
        updatedAt: "2024-09-15T23:35:32.558Z",
        createdAt: "2024-09-15T23:35:32.558Z"
    };

    const eventoDesativado: Evento = {
        _id: "fake-id-000",
        titulo: "Evento Cancelado",
        descricao: "Este evento foi cancelado pela organização",
        local: "Sala 101",
        dataInicio: amanha.toISOString(),
        dataFim: new Date(amanha.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        tags: ["cancelado"],
        categoria: "palestra",
        cor: 0,
        animacao: 0,
        status: 0, // Inativo por decisão = Inativo
        midia: [],
        permissoes: [],
        organizador: {
            _id: "org-000",
            nome: "Administração"
        },
        updatedAt: "2025-10-07T23:35:32.558Z",
        createdAt: "2025-10-07T23:35:32.558Z"
    };

    const eventosIniciais = [eventoEmBreve, eventoAtivo, eventoInativo, eventoDesativado];
    
    // Estado para gerenciar os eventos
    const [eventos, setEventos] = useState<Evento[]>(eventosIniciais);

    const handleEdit = (eventId: string) => {
        console.log('Editar evento:', eventId);
    };

    const handleDelete = (eventId: string) => {
        console.log('Excluir evento:', eventId);
        // Aqui você implementaria a lógica de exclusão
        // setEventos(eventos.filter(evento => evento._id !== eventId));
    };

    const handleToggleStatus = (eventId: string, currentStatus: number) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        console.log(`Alterando status do evento ${eventId} de ${currentStatus} para ${newStatus}`);
        
        setEventos(eventos.map(evento => 
            evento._id === eventId 
                ? { ...evento, status: newStatus }
                : evento
        ));
    };

    const handleCriarEvento = () => {
        console.log('Navegar para criar evento');
        // Aqui você adicionaria a navegação para a página de criar evento
        // router.push('/criar_eventos');
    };

    return (
        <>
            <Header logo="/ifro-events-icon.svg"/>
            
            {/* Banner Hero */}
            <div className="relative overflow-hidden" style={{ backgroundColor: '#4338CA' }}>
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
                
                {/* Imagem das mãos na frente do banner */}
                <div className="absolute top-0 right-20 w-full h-full flex justify-end items-center z-20 pointer-events-none">
                    <img 
                        src="/maos.png" 
                        alt="Ilustração de mãos" 
                        className="h-full object-contain opacity-100"
                        style={{ width: '900px', height: '387px', maxHeight: '100%' }}
                    />
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-32 translate-y-32"></div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-inter">Meus Eventos</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventos.map((evento) => (
                        <EventCard 
                            key={evento._id}
                            evento={evento}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}