import { useState, useRef, useEffect, useCallback } from "react";
import type StaffCard from "../../types/StaffCard";

const CARD_WIDTH = 300;
const CARD_GAP   = 16;
const CARD_STEP  = CARD_WIDTH + CARD_GAP;

interface EquipeProps {
  teamMembers: StaffCard[];
  loading: boolean;
  isVisible: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}

export function Equipe({ teamMembers, loading, isVisible, sectionRef }: EquipeProps) {
  const v = isVisible ? "visible" : "";

  // rolagem infinita
  const infinite   = [...teamMembers];
  const totalCards = teamMembers.length;

  const trackRef  = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animRef   = useRef<number | undefined>(undefined);

  const [activeIdx, setActiveIdx] = useState(0);

  // Drag state
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const startOffset = useRef(0);


  const applyTransform = (x: number, animated: boolean) => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = animated ? "transform 0.35s ease" : "none";
    trackRef.current.style.transform  = `translateX(${-x}px)`;
  };

  // Volta pro inicio
  const normalize = useCallback(() => {
    if (!totalCards) return;
    const min = totalCards * CARD_STEP;
    const max = totalCards * 2 * CARD_STEP;
    if (offsetRef.current < min) {
      offsetRef.current += totalCards * CARD_STEP;
      applyTransform(offsetRef.current, false);
    } else if (offsetRef.current >= max) {
      offsetRef.current -= totalCards * CARD_STEP;
      applyTransform(offsetRef.current, false);
    }
    const idx = Math.round(offsetRef.current / CARD_STEP) % totalCards;
    setActiveIdx((idx + totalCards) % totalCards);
  }, [totalCards]);

  // Snap suave ao card 
  const snapTo = useCallback((targetOffset: number) => {
    applyTransform(targetOffset, true);
    offsetRef.current = targetOffset;
    setTimeout(normalize, 370);
  }, [normalize]);

  //Mouse 
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current  = true;
    startX.current      = e.clientX;
    startOffset.current = offsetRef.current;
    cancelAnimationFrame(animRef.current!);
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    offsetRef.current = startOffset.current + (startX.current - e.clientX);
    applyTransform(offsetRef.current, false);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta  = startX.current - e.clientX;
    const target = Math.round((startOffset.current + delta) / CARD_STEP) * CARD_STEP;
    snapTo(target);
  };

  //Touch
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current  = true;
    startX.current      = e.touches[0].clientX;
    startOffset.current = offsetRef.current;
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    offsetRef.current = startOffset.current + (startX.current - e.touches[0].clientX);
    applyTransform(offsetRef.current, false);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta  = startX.current - e.changedTouches[0].clientX;
    const target = Math.round((startOffset.current + delta) / CARD_STEP) * CARD_STEP;
    snapTo(target);
  };

  // Dot click
  const goTo = (i: number) => {
    const target = totalCards * CARD_STEP + i * CARD_STEP;
    snapTo(target);
  };

  const CARD_H = Math.round(CARD_WIDTH * (4 / 3));
  const TRACK_H = CARD_H + 80;

  return (
    <section
      id="equipe"
      ref={sectionRef}
      className="py-32 px-6 md:px-20 bg-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="mb-16">
          <p className={`fade-up text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${v}`}>
            Nossos profissionais
          </p>
          <h2 className={`fade-up stagger-1 font-display font-black text-5xl md:text-7xl ${v}`}>
            EQUIPE
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm tracking-widest uppercase">Carregando equipe...</span>
          </div>
        ) : teamMembers.length === 0 ? (
          <p className="text-gray-600 text-center py-16 text-sm tracking-widest uppercase">
            Em breve novos profissionais.
          </p>
        ) : (
          <>
            {/* Viewport do carrossel */}
            <div
              className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
              style={{ height: TRACK_H }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Fade nas bordas */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-black to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-black to-transparent" />

              {/* Track */}
              <div
                ref={trackRef}
                className="flex absolute top-0 left-0"
                style={{ gap: CARD_GAP, willChange: "transform" }}
              >
                {infinite.map((member, i) => (
                  <div
                    key={`${member.id}-${i}`}
                    className="flex-shrink-0"
                    style={{ width: CARD_WIDTH }}
                  >
                    <div className="bg-neutral-950 border border-neutral-800 overflow-hidden">
                      {/* Foto */}
                      <div className="relative overflow-hidden" style={{ height: CARD_H }}>
                        {member.fotoUrl ? (
                          <img
                            src={member.fotoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                            <span className="font-display font-black text-7xl text-neutral-700">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="w-8 h-1 bg-red-600 mb-3" />
                          <h3 className="font-display font-bold text-xl text-white">{member.name}</h3>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="px-5 py-4">
                        <p className="text-gray-400 text-sm leading-relaxed">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {teamMembers.length > 1 && (
              <div className="flex gap-2 mt-8 justify-center">
                {teamMembers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1 transition-all duration-300 ${
                      i === activeIdx ? "w-8 bg-red-600" : "w-4 bg-neutral-700 hover:bg-neutral-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}