"use client"

import { useState, useEffect, useRef } from "react";
import { useEventosTotem } from "@/hooks/useEventosTotem";
import { formatarDataEvento, formatarHorarioEvento, extrairImagensEvento } from "@/lib/utils";

export default function EventosPage() {
    // Busca os eventos reais da API
    const { data: eventosApi, isLoading, isError } = useEventosTotem();

    // Transforma os eventos da API para o formato usado pelo componente
    const eventos = eventosApi.map(evento => ({
        id: evento._id,
        titulo: evento.titulo,
        data: formatarDataEvento(evento.dataInicio),
        horario: formatarHorarioEvento(evento.dataInicio, evento.dataFim),
        local: evento.local,
        descricao: evento.descricao,
        imagens: extrairImagensEvento(evento.midia),
        cor: evento.cor,
        animacao: evento.animacao
    }));

    // Estado que controla qual evento está sendo exibido
    const [eventoAtualIndex, setEventoAtualIndex] = useState(0);
    
    // Estado que controla qual imagem do evento atual está sendo exibida
    const [imagemAtualIndex, setImagemAtualIndex] = useState(0);

    // useRef para guardar os índices atuais (resolve problema de closure)
    const eventoIndexRef = useRef(eventoAtualIndex);
    const imagemIndexRef = useRef(imagemAtualIndex);
    
    // Atualiza as refs sempre que os estados mudarem
    useEffect(() => {
        eventoIndexRef.current = eventoAtualIndex;
        imagemIndexRef.current = imagemAtualIndex;
    }, [eventoAtualIndex, imagemAtualIndex]);

    // useEffect que controla o slideshow automático
    useEffect(() => {
        // Só inicia o slideshow se tiver eventos
        if (eventos.length === 0) return;

        const intervalo = setInterval(() => {
            const eventoAtual = eventoIndexRef.current;
            const imagemAtual = imagemIndexRef.current;
            const evento = eventos[eventoAtual];
            
            // Verifica se o evento tem imagens
            if (!evento.imagens || evento.imagens.length === 0) {
                // Se não tem imagens, pula para o próximo evento
                const proximoEvento = (eventoAtual + 1) % eventos.length;
                setEventoAtualIndex(proximoEvento);
                setImagemAtualIndex(0);
                return;
            }
            
            const proximaImagem = imagemAtual + 1;
            
            if (proximaImagem < evento.imagens.length) {
                setImagemAtualIndex(proximaImagem);
            } else {
                const proximoEvento = (eventoAtual + 1) % eventos.length;
                setEventoAtualIndex(proximoEvento);
                setImagemAtualIndex(0);
            }
        }, 3000);

        return () => clearInterval(intervalo);
    }, [eventos]);

    // Tela de loading
    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-indigo-950 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-xl font-inter">Carregando eventos...</p>
                </div>
            </div>
        );
    }

    // Tela de erro
    if (isError) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-red-950 to-red-800 flex items-center justify-center">
                <div className="text-center p-8">
                    <p className="text-white text-2xl font-inter mb-4">❌ Erro ao carregar eventos</p>
                    <p className="text-gray-300 font-inter">Por favor, verifique a conexão com o servidor.</p>
                </div>
            </div>
        );
    }

    // Se não houver eventos
    if (eventos.length === 0) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-indigo-950 to-purple-900 flex items-center justify-center">
                <div className="text-center p-8">
                    <p className="text-white text-2xl font-inter mb-4">📅 Nenhum evento disponível</p>
                    <p className="text-gray-300 font-inter">Não há eventos programados para exibição no momento.</p>
                </div>
            </div>
        );
    }

    // Pega o evento e imagem atuais
    const eventoAtual = eventos[eventoAtualIndex];
    const imagemAtual = eventoAtual.imagens[imagemAtualIndex];

    return (
        <>
            {/* Imagem de Fundo */}
            <img
                className="fixed inset-0 object-cover w-full h-full -z-10"
                src={imagemAtual}
                alt="Imagem de fundo do evento"
                draggable='false'
            />

            {/* Container do Conteúdo (Overlay + Barra Lateral) */}
            <main className="h-screen w-screen bg-black/60 flex justify-end">

                {/* Barra Lateral de Informações */}
                <div className="bg-indigo-950/80 h-full w-full max-w-lg p-12 flex flex-col rounded-tl-[16px] rounded-bl-[16px]">

                    <div className="flex-grow">
                        <p className="text-sm font-semibold text-gray-300 mb-4 font-inter">IFRO EVENTS</p>
                        <h1 className="text-4xl font-bold mb-8 font-inter">
                            {eventoAtual.titulo}
                        </h1>

                        <div className="flex flex-col space-y-4 text-gray-200">
                            <div className="flex flex-row gap-2">
                                <img src="/calendar.svg" alt="Calendário" />
                                <p className="font-inter">{eventoAtual.data}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <img src="/watch.svg" alt="Relógio" />
                                <p className="font-inter">{eventoAtual.horario}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <img src="/gps.svg" alt="Localização" />
                                <p className="font-inter">{eventoAtual.local}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 mb-16 bg-white/10 rounded-[8px] p-2">
                        <p className="text-gray-300 font-inter">
                            {eventoAtual.descricao}
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}