import { useState } from "react";

export function Hero() {
  const [videoExpanded, setVideoExpanded] = useState(false);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Overlay e grain */}
      <div
        className={`video-overlay absolute inset-0 z-10 bg-black ${
          videoExpanded ? "opacity-0 pointer-events-none" : "opacity-60"
        }`}
      />
      <div className="grain absolute inset-0 z-10 pointer-events-none opacity-30" />

      {/* Bordas vermelhas laterais */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 z-20" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600 z-20" />

      {/* Video de fundo */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
          videoExpanded ? "scale-100" : "scale-105"
        }`}
        src="/public/gym.mp4"
        autoPlay loop muted playsInline
      />

      {/* Conteúdo central */}
      <div
        className={`relative z-30 flex flex-col items-center text-center transition-all duration-600 ${
          videoExpanded ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="mb-6">
          <div className="font-display font-black text-7xl md:text-9xl tracking-tight leading-none">
            <span className="text-white">CT</span>
            <span className="text-red-600"> FOCO</span>
          </div>
          <div className="w-full h-1 bg-red-600 mt-2" />
          <p className="text-gray-300 tracking-[0.4em] text-xs uppercase mt-3 font-light">
            Treinamento · Performance · Resultados
          </p>
        </div>

        <button
          className="play-btn mt-8 w-20 h-20 rounded-full border-2 border-white flex items-center justify-center group cursor-pointer"
          style={{ background: "rgba(48,48,48,0.15)", backdropFilter: "blur(8px)" }}
          onClick={() => setVideoExpanded(true)}
        >
          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <p className="text-gray-400 text-xs tracking-widest uppercase mt-3">Assistir vídeo</p>
      </div>

      {/* Botao fechar vídeo */}
      {videoExpanded && (
        <button
          className="cursor-pointer mt-10 absolute top-6 right-8 z-50 text-white text-3xl font-light bg-red-600 w-10 h-10 flex items-center justify-center rounded-sm"
          onClick={() => setVideoExpanded(false)}
        >
          ×
        </button>
      )}

      {/* Indicador de Scroll */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <div className="w-px h-16 bg-gradient-to-b from-red-600 to-transparent scroll-line" />
        <a href="#sobre" className="flex flex-col items-center gap-1">
          <p className="text-gray-500 text-xs tracking-widest uppercase">Scroll</p>
        </a>
      </div>
    </section>
  );
}