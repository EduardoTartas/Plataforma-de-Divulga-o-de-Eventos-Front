"use client"

import { useState, useEffect, useRef } from "react";
import { useEventosTotem } from "@/hooks/useEventosTotem";
import { formatarDataEvento, formatarHorarioEvento, extrairImagensEvento } from "@/lib/utils";

import 'animate.css';
import { EventoTotem, QrCodeResponse } from "@/types/eventos";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5015';

export default function EventosPage() {
    // Estado para armazenar o tamanho da tela
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

    // useEffect para capturar o tamanho da tela
    useEffect(() => {
        const updateSize = () => {
            setScreenSize({ width: window.innerWidth, height: window.innerHeight });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Busca os eventos reais da API
    const { data: eventosApi, isLoading, isError } = useEventosTotem();

    // Transforma os eventos da API para o formato usado pelo componente
    const eventos: EventoTotem[] | any = eventosApi.map(evento => ({
        id: evento._id,
        titulo: evento.titulo,
        dataInicio: formatarDataEvento(evento.dataInicio),
        dataFim: formatarDataEvento(evento.dataFim),
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

    // Configuração: Quantas vezes o evento deve repetir suas imagens antes de mudar para o próximo
    const REPETICOES_POR_EVENTO = 3; // TODO: Ajustar para puxar o valor direto da API

    // Estado que rastreia quantas vezes o evento atual já completou o ciclo de todas as suas imagens
    const [repeticoesCompletadas, setRepeticoesCompletadas] = useState(0);

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
                // Se não tem imagens, pula para o próximo evento e reseta o contador
                const proximoEvento = (eventoAtual + 1) % eventos.length;
                setEventoAtualIndex(proximoEvento);
                setImagemAtualIndex(0);
                setRepeticoesCompletadas(0);
                return;
            }

            const proximaImagem = imagemAtual + 1;

            // Se ainda tem mais imagens no evento atual
            if (proximaImagem < evento.imagens.length) {
                setImagemAtualIndex(proximaImagem);
            } else {
                // Completou um ciclo de todas as imagens do evento
                setRepeticoesCompletadas(prev => {
                    const novasRepeticoes = prev + 1;

                    // Se já completou o número necessário de repetições, muda para o próximo evento
                    if (novasRepeticoes >= REPETICOES_POR_EVENTO) {
                        const proximoEvento = (eventoAtual + 1) % eventos.length;
                        setEventoAtualIndex(proximoEvento);
                        setImagemAtualIndex(0);
                        return 0; // Reseta o contador para o próximo evento
                    } else {
                        // Ainda precisa repetir, volta para a primeira imagem
                        setImagemAtualIndex(0);
                        return novasRepeticoes;
                    }
                });
            }

        }, 1000);

        return () => clearInterval(intervalo);
    }, [eventos, REPETICOES_POR_EVENTO]);

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
        1: 'bg-gray-900/90',      // #d2d4d7
        2: 'bg-pink-900/90',      // #f98dbe
        3: 'bg-purple-900/90',    // #b596ff
        4: 'bg-blue-900/90',      // #76adff
        5: 'bg-green-900/90',     // #77d86b
        6: 'bg-yellow-900/90',    // #f2ca77
        7: 'bg-orange-900/90',    // #fba67a
        8: 'bg-red-900/90',       // #ff766d
        9: 'bg-transparent'
    }

    const [eventoAnteriorIndex, setEventoAnteriorIndex] = useState(0);
    const mudouDeEvento = eventoAnteriorIndex !== eventoAtualIndex;

    // Estado para armazenar o QR code do evento atual
    const [qrCodeAtual, setQrCodeAtual] = useState<string | null>(null);
    const [carregandoQrCode, setCarregandoQrCode] = useState(false);

    // Estado para rastrear o ID do último evento para o qual buscamos QR code
    const [ultimoEventoIdBuscado, setUltimoEventoIdBuscado] = useState<string | null>(null);

    // useEffect separado para atualizar o eventoAnteriorIndex
    useEffect(() => {
        if (mudouDeEvento) {
            setEventoAnteriorIndex(eventoAtualIndex);
        }
    }, [eventoAtualIndex, mudouDeEvento]);

    // useEffect para buscar QR code quando o evento atual mudar
    useEffect(() => {
        // Só executa se houver eventos carregados
        if (eventos.length === 0) return;

        const eventoAtual = eventos[eventoAtualIndex];

        // Verifica se já buscamos o QR code para este evento
        if (ultimoEventoIdBuscado === eventoAtual.id) {
            return;
        }

        // Marca que estamos buscando para este evento
        setUltimoEventoIdBuscado(eventoAtual.id);

        // Se o evento não tem link, limpa o QR code
        if (!eventoAtual.link) {
            setQrCodeAtual(null);
            return;
        }

        // Função assíncrona para buscar o QR code
        async function buscarQrCode() {
            try {
                setCarregandoQrCode(true);
                const resposta = await fetch(`${apiUrl}/eventos/${eventoAtual.id}/qrcode`);

                if (!resposta.ok) {
                    throw new Error('Erro ao buscar QR code');
                }

                const dados: QrCodeResponse = await resposta.json();
                setQrCodeAtual(dados.data.qrcode);
            } catch (erro) {
                console.error('Erro ao buscar QR code:', erro);
                setQrCodeAtual(null);
            } finally {
                setCarregandoQrCode(false);
            }
        }

        buscarQrCode();
    }, [eventoAtualIndex, eventos, ultimoEventoIdBuscado]);

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
            <div className="h-screen w-screen bg-gradient-to-br from-indigo-950 to-purple-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 2xl:h-20 2xl:w-20 border-t-2 border-b-2 2xl:border-t-2 2xl:border-b-2 border-white mx-auto mb-4 2xl:mb-4"></div>
                    <p className="text-white text-base sm:text-xl md:text-2xl 2xl:text-2xl font-inter">Carregando eventos...</p>
                </div>
            </div>
        );
    }

    // Tela de erro
    if (isError) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-red-950 to-red-800 flex items-center justify-center p-4">
                <div className="text-center p-4 sm:p-6 md:p-8 2xl:p-8">
                    <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-3xl font-inter mb-3 sm:mb-4 2xl:mb-4">❌ Erro ao carregar eventos</p>
                    <p className="text-gray-300 font-inter text-sm sm:text-base md:text-lg 2xl:text-lg">Por favor, verifique a conexão com o servidor.</p>
                </div>
            </div>
        );
    }

    // Se não houver eventos
    if (eventos.length === 0) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-indigo-950 to-purple-900 flex items-center justify-center p-4">
                <div className="text-center p-4 sm:p-6 md:p-8 2xl:p-8">
                    <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-3xl font-inter mb-3 sm:mb-4 2xl:mb-4">📅 Nenhum evento disponível</p>
                    <p className="text-gray-300 font-inter text-sm sm:text-base md:text-lg 2xl:text-lg">Não há eventos programados para exibição no momento.</p>
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
            <main className="h-screen w-screen overflow-hidden bg-black/15 flex justify-end items-center sm:items-stretch relative">

                {/* Barra Lateral de Informações */}
                <div className={`relative h-auto sm:h-full w-full sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:max-w-2xl
                    p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-10
                    flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 2xl:gap-4
                    rounded-2xl sm:rounded-tl-2xl sm:rounded-bl-2xl sm:rounded-tr-none sm:rounded-br-none 2xl:rounded-tl-2xl 2xl:rounded-bl-2xl
                    mx-4 sm:mx-0 my-auto sm:my-0
                    ${obterClasseCorFundo()}`}>

                    <div className="grow">
                        <div className="flex justify-between items-center mb-3 sm:mb-4 lg:mb-2">
                            <p className="text-xs sm:text-sm md:text-base lg:text-xs font-semibold text-gray-300 font-inter">
                                IFRO EVENTS
                                <span className="text-red-500 ml-2 text-xs">
                                    [{screenSize.width}x{screenSize.height}]
                                    <span className="hidden sm:inline"> SM</span>
                                    <span className="hidden md:inline"> MD</span>
                                    <span className="hidden lg:inline"> LG</span>
                                    <span className="hidden xl:inline"> XL</span>
                                    <span className="hidden 2xl:inline"> 2XL</span>
                                </span>
                            </p>
                            <div className="flex gap-1 lg:gap-0.5">
                                {Array.from({ length: REPETICOES_POR_EVENTO }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-1 lg:w-1 rounded-full transition-all ${index <= repeticoesCompletadas
                                            ? 'bg-white'
                                            : 'bg-white/30'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-3 font-inter leading-tight">
                            {eventoAtual.titulo}
                        </h1>

                        <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 lg:gap-1.5 text-gray-200 text-xs sm:text-sm md:text-base lg:text-sm">
                            <div className="flex flex-row gap-2 lg:gap-1.5 items-center">
                                <img src="/calendar.svg" alt="Calendário" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-4 lg:h-4 shrink-0" />
                                <p className="font-inter">{eventoAtual.dataInicio} - {eventoAtual.dataFim}</p>
                            </div>
                            <div className="flex flex-row gap-2 lg:gap-1.5 items-center">
                                <img src="/watch.svg" alt="Relógio" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-4 lg:h-4 shrink-0" />
                                <p className="font-inter">{eventoAtual.horario}</p>
                            </div>
                            <div className="flex flex-row gap-2 lg:gap-1.5 items-center">
                                <img src="/gps.svg" alt="Localização" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-4 lg:h-4 shrink-0" />
                                <p className="font-inter">{eventoAtual.local}</p>
                            </div>
                            <div className="flex flex-row gap-2 lg:gap-1.5 items-center">
                                <img src="/category.svg" alt="Categoria" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-4 lg:h-4 shrink-0" />
                                <p className="font-inter">{eventoAtual.categoria.toUpperCase()}</p>
                            </div>
                            <div className="flex flex-row gap-2 lg:gap-1.5 items-center">
                                <img src="/tags.svg" alt="Tags" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-4 lg:h-4 shrink-0" />
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {eventoAtual.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="font-inter bg-white/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-xs sm:text-sm md:text-base lg:text-sm"
                                        >
                                            {tag.toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Descrição do Evento */}
                    <div className={`flex-1 max-h-[120px] sm:max-h-[150px] md:max-h-[180px] lg:max-h-[220px] xl:max-h-[250px] 2xl:max-h-[320px]
                            min-h-0 bg-white/10 rounded-lg 2xl:rounded-lg p-3 sm:p-4 md:p-5 2xl:p-4 overflow-hidden
                            ${eventoAtual.link ? 'mb-28 sm:mb-32 md:mb-36 lg:mb-44 xl:mb-48 2xl:mb-52' : ''}`}>
                        <p className="text-gray-300 font-inter text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-base leading-relaxed line-clamp-6 sm:line-clamp-7 md:line-clamp-8 lg:line-clamp-10 2xl:line-clamp-[15]">
                            {eventoAtual.descricao}
                        </p>
                    </div>

                    {/* QR Code - Absolute dentro da barra lateral */}
                    {eventoAtual.link && (
                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 xl:bottom-12 xl:right-12 2xl:bottom-10 2xl:right-10
                            bg-white/10 rounded-lg 2xl:rounded-lg
                            w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 2xl:w-48 2xl:h-48
                            p-3 sm:p-4 2xl:p-4 flex items-center justify-center 
                            shrink-0 z-10">
                            {carregandoQrCode ? (
                                <div className="animate-spin rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 2xl:w-12 2xl:h-12 border-t-2 border-b-2 2xl:border-t-2 2xl:border-b-2 border-white"></div>
                            ) : qrCodeAtual ? (
                                <img src={qrCodeAtual} className="h-full w-full object-contain rounded-lg 2xl:rounded-lg" alt="QR-Code" />
                            ) : (
                                <p className="text-white text-center font-inter text-xs sm:text-sm 2xl:text-sm">QR Code não disponível</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}