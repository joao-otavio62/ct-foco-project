import { useState } from "react";
import type StaffCard from "../../types/StaffCard";

interface EquipeProps {
  teamMembers: StaffCard[];
  loading: boolean;
  isVisible: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}

export function Equipe({ teamMembers, loading, isVisible, sectionRef }: EquipeProps) {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const v = isVisible ? "visible" : "";

  return (
    <section
      id="equipe"
      ref={sectionRef}
      className="py-32 px-6 md:px-20 bg-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className={`fade-up text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${v}`}>
              Nossos profissionais
            </p>
            <h2 className={`fade-up stagger-1 font-display font-black text-5xl md:text-7xl ${v}`}>
              EQUIPE
            </h2>
          </div>
        </div>

        {/* Estado de carregamento */}
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
            {/* Carrossel */}
            <div className="relative overflow-hidden">
              <div
                className="carousel-track flex"
                style={{ transform: `translateX(-${carouselIdx * 100}%)`, transition: "transform 0.5s ease" }}
              >
                {teamMembers.map(member => (
                  <div key={member.id} className="team-card px-3 w-full flex-shrink-0">
                    <div className="bg-neutral-950 border border-neutral-800 overflow-hidden group">
                      <div className="relative overflow-hidden aspect-[3/4]">
                        {member.fotoUrl ? (
                          <img
                            src={member.fotoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                            <span className="font-display font-black text-7xl text-neutral-700">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="w-8 h-1 bg-red-600 mb-3" />
                          <h3 className="font-display font-bold text-2xl">{member.name}</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-400 text-sm leading-relaxed">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots de navegação */}
            {teamMembers.length > 1 && (
              <div className="flex gap-2 mt-8 justify-center">
                {teamMembers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    className={`h-1 transition-all duration-300 ${
                      i === carouselIdx ? "w-8 bg-red-600" : "w-4 bg-neutral-700"
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