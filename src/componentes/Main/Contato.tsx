interface ContatoProps {
  isVisible: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}

const WHATSAPP_URL =
  "https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20as%20aulas%20do%20CT%20FOCO.";

export function Contato({ isVisible, sectionRef }: ContatoProps) {
  const v = isVisible ? "visible" : "";

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="py-32 px-6 md:px-20"
      style={{ background: "linear-gradient(135deg, #0f0f0f, #1a0000 50%, #0f0f0f)" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div>
          <p className={`fade-left text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${v}`}>
            Dê o primeiro passo
          </p>
          <h2 className={`fade-left stagger-1 font-display font-black text-5xl md:text-7xl leading-none mb-6 ${v}`}>
            AGENDE<br />SUA <span className="text-red-600">AULA</span>
          </h2>
          <p className={`fade-left stagger-2 text-gray-400 leading-relaxed max-w-sm mb-8 ${v}`}>
            Entre em contato pelo WhatsApp e vamos encontrar o melhor horário e modalidade para você.
            Primeira aula gratuita!
          </p>
          <div className={`fade-left stagger-3 flex items-center gap-3 ${v}`}>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-300 text-sm">Atendimento online agora</span>
          </div>
        </div>

        {/* Botão WhatsApp */}
        <div className={`fade-right ${v} flex flex-col items-center justify-center`}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-6"
          >
            <div
              className="relative flex items-center justify-center"
              style={{ filter: "drop-shadow(0 0 60px rgba(37,211,102,0.5))" }}
            >
              <div className="absolute w-56 h-56 rounded-full bg-green-500 opacity-10 group-hover:opacity-20 transition-all duration-500 scale-100 group-hover:scale-110" />
              <div
                className="absolute w-44 h-44 rounded-full bg-green-500 opacity-10 group-hover:opacity-20 transition-all duration-500 animate-ping"
                style={{ animationDuration: "2s" }}
              />
              <svg
                className="w-40 h-40 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110 transform relative z-10"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-display font-black text-3xl text-white tracking-widest group-hover:text-green-400 transition-colors duration-300">
                FALAR AGORA
              </p>
              <p className="text-gray-500 text-sm tracking-widest uppercase mt-1">(73) 99999-9999</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}