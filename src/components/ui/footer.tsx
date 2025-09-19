interface FooterProps {
    icon: string;
    text: string;
    text2: string;
    icon2: string;
}

export default function Footer() {
    return (
        <footer className="flex flex-row items-center border-2 h-[81px] pl-[35px] pr-[35px] relative">
            <img src="/ifro.svg" className="select-none" draggable='false'/>
            <p className="absolute left-20 text-[#4B5563]">Instituto Federal de Rondônia</p>
            <p className="absolute right-35 text-[#4B5563]">Plataforma de Divulgação de Eventos - Fábrica de Software III - ADS 2024/4 © Todos os direitos reservados.</p>
            <svg id="logo-fslab-detailed" width="82" height="40" xmlns="http://www.w3.org/2000/svg" aria-label="Logo FSLab" className="absolute right-10 select-none">
                <rect id="background-shape" x="0" y="0" width="100%" height="100%" rx="8" />
                <g>
                    <text id="f" className="char" x="10" y="25" fill="#efffff" fontWeight="bolder">F</text>
                    <text id="s" className="char" x="20" y="25" fill="#ffffff" fontWeight="bolder">S</text>
                    <text id="l" className="char" x="30" y="25" fill="#ffffff">L</text>
                    <text id="a" className="char" x="38" y="25" fill="#ffffff">a</text>
                    <text id="b" className="char" x="46" y="25" fill="#ffffff">b</text>
                    <text id="angle" className="char" x="56" y="25" fill="#9bd800">〉</text>
                    <text id="underscore" className="char" x="62" y="25" fill="#9bd800">_</text>
                </g>
            </svg>
        </footer>
    )
}