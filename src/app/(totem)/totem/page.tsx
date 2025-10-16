"use client"

import { useState, useEffect, useRef } from "react";

export default function EventosPage() {
    const eventos = [
        {
            titulo: "Live Gawr Gura",
            data: "15 NOV 2025",
            horario: "19:00 - 22:00",
            local: "Gawr Gura Ch.",
            descricao: "Venha assistir a live da Gawr Gura!",
            imagens: [
                'https://wallpapers.com/images/high/gawr-gura-underwater-hololive-desktop-mh96gvsxjb3yyu1q.webp',
                'https://resize.cdn.otakumode.com/ex/700.560/shop/product/14db90e862d5410a866d27ca8a3491c3.jpg.webp',
                'https://www.siliconera.com/wp-content/uploads/2023/03/screen-shot-2023-03-03-at-101731-am.png'
            ]
        },
        {
            titulo: "Live Sameko Saba",
            data: "20 NOV 2025",
            horario: "08:00 - 18:00",
            local: "Sameko Saba Ch.",
            descricao: "Participe da live da Sameko Saba.",
            imagens: [
                'https://www.jaxon.gg/wp-content/uploads/2025/06/Gawr-Gura-debut-Sameko-Saba-1024x576.jpg.webp',
                'https://cdn.donmai.us/sample/14/56/__sameko_saba_and_kaniki_indie_virtual_youtuber_drawn_by_hyou_1027__sample-14566ad1fb8f2335124baab6bc845b9a.jpg'
            ]
        }
    ];

    // Estado que controla qual evento está sendo exibido (0 = primeiro, 1 = segundo, etc)
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

    // Pega o evento atual baseado no índice
    const eventoAtual = eventos[eventoAtualIndex];
    
    // Pega a imagem atual baseada no índice
    const imagemAtual = eventoAtual.imagens[imagemAtualIndex];

    // useEffect que controla o slideshow automático
    useEffect(() => {
        // Cria um intervalo que executa a cada 3 segundos
        const intervalo = setInterval(() => {
            
            // Pega os valores atuais das refs (sempre atualizados)
            const eventoAtual = eventoIndexRef.current;
            const imagemAtual = imagemIndexRef.current;
            
            // Pega o evento usando o índice atual
            const evento = eventos[eventoAtual];
            
            // Calcula qual seria a próxima imagem
            const proximaImagem = imagemAtual + 1;
            
            // Verifica se ainda existem imagens no evento atual
            if (proximaImagem < evento.imagens.length) {
                // Se ainda tem imagens, apenas avança para a próxima
                setImagemAtualIndex(proximaImagem);
            } else {
                // Se acabaram as imagens, avança para o próximo evento
                // O operador % faz voltar para o primeiro evento quando chegar no último
                const proximoEvento = (eventoAtual + 1) % eventos.length;
                setEventoAtualIndex(proximoEvento);
                
                // Volta para a primeira imagem do novo evento
                setImagemAtualIndex(0);
            }
            
        }, 3000);

        // Função de limpeza: remove o intervalo quando o componente for desmontado
        return () => clearInterval(intervalo);
        
    }, []); // Array vazio = executa apenas uma vez quando o componente é montado

    return (
        // O container principal que ocupa a tela inteira.
        <>
            {/* 1. Imagem de Fundo */}
            {/* 'fixed' para que ela preencha a tela e 'z-[-10]' para garantir que fique atrás de todo o conteúdo. */}
            <img
                className="fixed inset-0 object-cover w-full h-full -z-10"
                src={imagemAtual}
                alt="Imagem de fundo do evento"
                draggable='false'
            />

            {/* 2. Container do Conteúdo (Overlay + Barra Lateral) */}
            {/* - 'h-screen': Ocupa a altura total da tela.
              - 'w-screen': Ocupa a largura total da tela.
              - 'bg-black/60': Aplica o overlay escuro em toda a área.
              - 'justify-end': Alinha a barra lateral à DIREITA!
            */}
            <main className="h-screen w-screen bg-black/60 flex justify-end">

                {/* 3. Barra Lateral de Informações */}
                {/*  - 'h-full': Ocupa 100% da altura do pai ('main').
                  - 'w-full max-w-lg': Faz a barra ser responsiva. Ela tentará ocupar a largura total, mas terá um máximo de 'lg' (large).
                */}
                <div className="bg-indigo-950/80 h-full w-full max-w-lg p-12 flex flex-col rounded-tl-[16px] rounded-bl-[16px]">

                    <div className="flex-grow">
                        <p className="text-sm font-semibold text-gray-300 mb-4 font-inter">IFRO EVENTS</p>
                        <h1 className="text-4xl font-bold mb-8 font-inter">
                            {eventoAtual.titulo}
                        </h1>

                        <div className="flex flex-col space-y-4 text-gray-200">
                            <div className="flex flex-row gap-2">
                                <img src="/calendar.svg" /><p className="font-inter">{eventoAtual.data}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <img src="/watch.svg" /><p className="font-inter">{eventoAtual.horario}</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <img src="/gps.svg" /><p className="font-inter">{eventoAtual.local}</p>
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