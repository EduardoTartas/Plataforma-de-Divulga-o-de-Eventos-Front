"use client"

import { useState, useEffect, useRef } from "react";
import { useEventosTotem } from "@/hooks/useEventosTotem";
import { formatarDataEvento, formatarHorarioEvento, extrairImagensEvento } from "@/lib/utils";

import 'animate.css';
import { EventoTotem } from "@/types/eventos";

export default function EventosPage() {
    // Busca os eventos reais da API
    const { data: eventosApi, isLoading, isError } = useEventosTotem();

    // Transforma os eventos da API para o formato usado pelo componente
    const eventos: EventoTotem[] | any = eventosApi.map(evento => ({
        id: evento._id,
        titulo: evento.titulo,
        data: formatarDataEvento(evento.dataInicio),
        horario: formatarHorarioEvento(evento.dataInicio, evento.dataFim),
        local: evento.local,
        descricao: evento.descricao,
        imagens: extrairImagensEvento(evento.midia),
        cor: evento.cor,
        animacao: evento.animacao,
        categoria: evento.categoria,
        tags: evento.tags,
        link: evento.link
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
        }, 5000);

        return () => clearInterval(intervalo);
    }, [eventos]);

    // Animações disponíveis
    const ANIMACOES_MAP: Record<number, string> = {
        1: 'animate__fadeIn',
        2: 'animate__fadeInUp',
        3: 'animate__fadeInDown',
        4: 'animate__slideInLeft',
        5: 'animate__slideInRight',
        6: 'animate__zoomIn',
        7: 'animate__flipInX',
        8: 'animate__bounceIn',
        9: 'animate__backInDown',
        10: 'animate__backInUp',
    };

    const CORES_MAP: Record<number, string> = {
        1: 'bg-gray-700/90',      // #d2d4d7
        2: 'bg-pink-400/90',      // #f98dbe
        3: 'bg-purple-400/90',    // #d27cfe
        4: 'bg-purple-300/90',    // #b596ff
        5: 'bg-blue-400/90',      // #76adff
        6: 'bg-green-400/90',     // #77d86b
        7: 'bg-yellow-300/90',    // #f2ca77
        8: 'bg-orange-300/90',    // #fba67a
        9: 'bg-red-400/90',       // #ff766d
        10: 'bg-transparent'
    }

    const [eventoAnteriorIndex, setEventoAnteriorIndex] = useState(0);
    const mudouDeEvento = eventoAnteriorIndex !== eventoAtualIndex;

    useEffect(() => {
        // Este código roda toda vez que eventoAtualIndex muda
        setEventoAnteriorIndex(eventoAtualIndex);
    }, [eventoAtualIndex]);

    function obterAnimacao() {
        if (mudouDeEvento) {
            return 'animate__animated animate__fadeIn';
        } else {
            const eventoAtual = eventos[eventoAtualIndex];
            const animacaoEvento = ANIMACOES_MAP[eventoAtual.animacao] || 'animate__fadeIn';
            return `animate__animated ${animacaoEvento}`;
        }
    }

    function obterClasseCorFundo() {
        const eventoAtual = eventos[eventoAtualIndex];
        const corFundoEvento = CORES_MAP[eventoAtual.cor] || 'bg-gray-300';
        return corFundoEvento;
    }

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
                key={`${eventoAtualIndex}-${imagemAtualIndex}`}
                className={`fixed inset-0 object-cover w-full h-full -z-10 ${obterAnimacao()}`}
                src={imagemAtual}
                alt="Imagem de fundo do evento"
                draggable='false'
            />

            {/* Container do Conteúdo (Overlay + Barra Lateral) */}
            <main className="h-screen w-screen bg-black/15 flex justify-end">

                {/* Barra Lateral de Informações */}
                <div className={`h-full w-full max-w-lg p-12 flex flex-col rounded-tl-[16px] rounded-bl-[16px] ${obterClasseCorFundo()}`}>

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
                            <div className="flex flex-row gap-2">
                                <img src="/category.svg" alt="Localização" />
                                <p className="font-inter">{eventoAtual.categoria.toUpperCase()}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <img src="/tags.svg" alt="Localização" />
                                <p className="font-inter ">{eventoAtual.tags.join(' - ').toLowerCase()}</p>
                            </div>
                        </div>
                    </div>

                    {eventoAtual.link && (
                        <div className="bg-white/10 rounded-[8px] h-70 w-70 p-4 flex items-center justify-center mb-8">
                            <img src={eventoAtual.link} className="h-full w-full object-contain" alt="QR-Code" />
                        </div>
                    )}

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