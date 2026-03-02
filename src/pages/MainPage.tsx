import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

// ── Tipo local só para o que a landing precisa ────────────────────────────
interface StaffCard {
  id: string;
  name: string;
  role: string;
  specialty: string;
  fotoUrl: string;
  bio?: string;
}

// ── Helper: monta o objeto que a landing usa a partir da resposta da API ──
const mapStaff = (s: any): StaffCard => ({
  id: String(s.id),
  name: s.nome,
  role: s.cargo,
  specialty: s.especialidade,
  fotoUrl: s.fotoUrl ?? "",
  bio: s.especialidade, // usa especialidade como bio fallback
});

const services = [
  {
    icon: "⚡",
    title: "Funcional",
    desc: "Treinos dinâmicos que desenvolvem força, resistência e agilidade com movimentos naturais do corpo.",
  },
  {
    icon: "🏋️",
    title: "Musculação",
    desc: "Treino com pesos e equipamentos para ganho de massa muscular, definição e aumento de força de forma segura e progressiva.",
  },
  {
    icon: "🧘",
    title: "Pilates",
    desc: "Método completo de condicionamento físico e mental, fortalecendo o core e melhorando a postura.",
  },
  {
    icon: "🩺",
    title: "Fisioterapia",
    desc: "Reabilitação e prevenção de lesões com atendimento individualizado por profissionais especializados.",
  },
];

const schedules = [
  "07:00", "08:00", "09:00", "10:00",
  "12:00", "13:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00",
];

export function MainPage() {
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  //  Estado da equipe vindo da API
  const [teamMembers, setTeamMembers] = useState<StaffCard[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  //Busca a equipe da API ao montar o componente
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await api.get("/staffmembers");
        // filtra apenas membros ativos
        const ativos = data
          .filter((s: any) => s.status === true || s.status === "ativo")
          .map(mapStaff);
        setTeamMembers(ativos);
      } catch (err) {
        console.error("Erro ao buscar equipe:", err);
        
      } finally {
        setLoadingTeam(false);
      }
    };
    fetchTeam();
  }, []); // [] = roda só uma vez quando a página abre

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.entries(sectionRefs.current).forEach(([key, el]) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, key]));
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const isVisible = (key: string) => visibleSections.has(key);


  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@300;400;500&display=swap');
        * { font-family: 'Barlow', sans-serif; }
        .font-display { font-family: 'Barlow Condensed', sans-serif; }
        .fade-up { opacity: 0; transform: translateY(60px); transition: all 0.8s cubic-bezier(0.22,1,0.36,1); }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-left { opacity: 0; transform: translateX(-60px); transition: all 0.8s cubic-bezier(0.22,1,0.36,1); }
        .fade-left.visible { opacity: 1; transform: translateX(0); }
        .fade-right { opacity: 0; transform: translateX(60px); transition: all 0.8s cubic-bezier(0.22,1,0.36,1); }
        .fade-right.visible { opacity: 1; transform: translateX(0); }
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.25s; }
        .stagger-3 { transition-delay: 0.4s; }
        .stagger-4 { transition-delay: 0.55s; }
        .red-glow { box-shadow: 0 0 40px rgba(220,38,38,0.4); }
        .team-card { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .scroll-line { animation: scrollLine 2s ease-in-out infinite; }
        @keyframes scrollLine { 0%,100%{transform:scaleY(0);transform-origin:top;} 50%{transform:scaleY(1);transform-origin:top;} 51%{transform-origin:bottom;} }
        .video-overlay { transition: all 0.6s cubic-bezier(0.22,1,0.36,1); }
        .play-btn { transition: all 0.3s ease; }
        .play-btn:hover { transform: scale(1.1); }
        .service-card { transition: all 0.4s cubic-bezier(0.22,1,0.36,1); }
        .service-card:hover { transform: translateY(-8px); border-color: rgb(220,38,38); box-shadow: 0 20px 60px rgba(220,38,38,0.2); }
        .carousel-track { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .nav-link { position: relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:rgb(220,38,38); transition:width 0.3s ease; }
        .nav-link:hover::after { width:100%; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); }
        .input-field { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: border-color 0.3s ease, box-shadow 0.3s ease; }
        .input-field:focus { outline: none; border-color: rgb(220,38,38); box-shadow: 0 0 0 3px rgba(220,38,38,0.15); }
        .btn-primary { transition: all 0.3s ease; }
        .btn-primary:hover { box-shadow: 0 10px 40px rgba(220,38,38,0.5); transform: translateY(-2px); }
      `}</style>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between"
        style={{
          background: scrollY > 80 ? "rgba(0,0,0,0.95)" : "transparent",
          backdropFilter: scrollY > 80 ? "blur(12px)" : "none",
          borderBottom: scrollY > 80 ? "1px solid rgba(220,38,38,0.2)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div className="font-display font-black text-2xl tracking-widest">
          CT <span className="text-red-600">FOCO</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase">
          {["Sobre", "Serviços", "Equipe", "Horários"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-gray-300 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
        <a href="#contato" className="btn-primary bg-red-600 text-white px-5 py-2 text-sm font-medium tracking-widest uppercase">
          Agendar
        </a>
      </nav>

      {/* HERO / VIDEO */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className={`video-overlay absolute inset-0 z-10 bg-black ${videoExpanded ? "opacity-0 pointer-events-none" : "opacity-60"}`} />
        <div className="grain absolute inset-0 z-10 pointer-events-none opacity-30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-600 z-20" />
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${videoExpanded ? "scale-100" : "scale-105"}`}
          src="/public/gym.mp4"
          autoPlay loop muted playsInline
        />
        <div className={`relative z-30 flex flex-col items-center text-center transition-all duration-600 ${videoExpanded ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}>
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
            style={{ background: "rgba(48, 48, 48, 0.15)", backdropFilter: "blur(8px)" }}
            onClick={() => setVideoExpanded(true)}
          >
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-3">Assistir vídeo</p>
        </div>
        {videoExpanded && (
          <button
            className="absolute top-6 right-8 z-50 text-white text-3xl font-light bg-red-600 w-10 h-10 flex items-center justify-center rounded-sm"
            onClick={() => setVideoExpanded(false)}
          >×</button>
        )}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-red-600 to-transparent scroll-line" />
          <a href="#sobre" className="flex flex-col items-center gap-1">
            <p className="text-gray-500 text-xs tracking-widest uppercase">Scroll</p>
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section
        id="sobre"
        ref={(el) => { sectionRefs.current["sobre"] = el; }}
        className="relative py-32 px-6 md:px-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)" }}
      >
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <div className="w-full h-full bg-red-600" style={{ clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className={`fade-left text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${isVisible("sobre") ? "visible" : ""}`}>
              Sobre o CT FOCO
            </p>
            <h2 className={`fade-left stagger-1 font-display font-black text-5xl md:text-7xl leading-none mb-6 ${isVisible("sobre") ? "visible" : ""}`}>
              ONDE O<br /><span className="text-red-600">FOCO</span><br />TRANSFORMA
            </h2>
            <p className={`fade-left stagger-2 text-gray-400 leading-relaxed mb-8 max-w-md ${isVisible("sobre") ? "visible" : ""}`}>
              O CT FOCO nasceu da paixão por resultados reais. Com turmas reduzidas e horário marcado, garantimos atenção individualizada e a intensidade certa para cada aluno — do iniciante ao avançado.
            </p>
            <div className={`fade-left stagger-3 flex gap-12 ${isVisible("sobre") ? "visible" : ""}`}>
              {[["6h–22h", "Horário de funcionamento"], ["4", "Modalidades"], ["<12", "Alunos por turma"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display font-black text-4xl text-red-600">{val}</div>
                  <div className="text-gray-500 text-xs tracking-widest uppercase mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`fade-right ${isVisible("sobre") ? "visible" : ""} relative`}>
            <div className="aspect-square bg-neutral-900 border border-neutral-800 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
                alt="CT FOCO academia"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 font-display font-black text-5xl text-white opacity-10">FOCO</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section
        id="serviços"
        ref={(el) => { sectionRefs.current["servicos"] = el; }}
        className="py-32 px-6 md:px-20 bg-black"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className={`fade-up text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${isVisible("servicos") ? "visible" : ""}`}>
              Nossas modalidades
            </p>
            <h2 className={`fade-up stagger-1 font-display font-black text-5xl md:text-7xl ${isVisible("servicos") ? "visible" : ""}`}>
              SERVIÇOS
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className={`service-card fade-up border border-neutral-800 p-8 bg-neutral-950 ${isVisible("servicos") ? "visible" : ""}`}
                style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="text-5xl mb-6">{svc.icon}</div>
                <h3 className="font-display font-bold text-3xl mb-4 text-white">{svc.title}</h3>
                <p className="text-gray-400 leading-relaxed">{svc.desc}</p>
                <div className="mt-8 w-12 h-1 bg-red-600" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HORÁRIOS */}
      <section
        id="horários"
        ref={(el) => { sectionRefs.current["horarios"] = el; }}
        className="py-32 px-6 md:px-20"
        style={{ background: "linear-gradient(180deg, #0a0a0a, #111)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className={`fade-up text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${isVisible("horarios") ? "visible" : ""}`}>
              Grade horária
            </p>
            <h2 className={`fade-up stagger-1 font-display font-black text-5xl md:text-7xl ${isVisible("horarios") ? "visible" : ""}`}>
              HORÁRIOS<br /><span className="text-red-600">DISPONÍVEIS</span>
            </h2>
          </div>
          <div className={`fade-up stagger-2 flex flex-wrap gap-3 ${isVisible("horarios") ? "visible" : ""}`}>
            {schedules.map((h) => (
              <div key={h} className="border border-neutral-700 px-6 py-3 font-display font-bold text-xl hover:border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-default">
                {h}
              </div>
            ))}
          </div>
          <p className={`fade-up stagger-3 mt-8 text-gray-500 text-sm ${isVisible("horarios") ? "visible" : ""}`}>
            * Turmas com vagas limitadas. Agende com antecedência para garantir seu horário.
          </p>
        </div>
      </section>

      {/* EQUIPE*/}
      <section
        id="equipe"
        ref={(el) => { sectionRefs.current["equipe"] = el; }}
        className="py-32 px-6 md:px-20 bg-black overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <p className={`fade-up text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${isVisible("equipe") ? "visible" : ""}`}>
                Nossos profissionais
              </p>
              <h2 className={`fade-up stagger-1 font-display font-black text-5xl md:text-7xl ${isVisible("equipe") ? "visible" : ""}`}>
                EQUIPE
              </h2>
            </div>
            
          </div>

          {/*carregamento */}
          {loadingTeam ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-sm tracking-widest uppercase">Carregando equipe...</span>
            </div>
          ) : teamMembers.length === 0 ? (
            // Nenhum membro ativo cadastrado ainda
            <p className="text-gray-600 text-center py-16 text-sm tracking-widest uppercase">
              Em breve novos profissionais.
            </p>
          ) : (
            <>
              
              <div className="relative overflow-hidden">
                <div
                  className="carousel-track flex w-80"
              
                >
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="team-card px-3 w-full flex-shrink-0"
                      
                    >
                      <div className="bg-neutral-950 border border-neutral-800 overflow-hidden group">
                        <div className="relative overflow-hidden aspect-[3/4]">
                         
                          {member.fotoUrl ? (
                            <img
                              src={member.fotoUrl}
                              alt={member.name}
                              className="w-full h-full object-cover "
                            />
                          ) : (
                            
                            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                              <span className="font-display font-black text-7xl text-neutral-700">{member.name.charAt(0)}</span>
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
                      className={`h-1 transition-all duration-300 ${i === carouselIdx ? "w-8 bg-red-600" : "w-4 bg-neutral-700"}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CONTATO */}
      <section
        id="contato"
        ref={(el) => { sectionRefs.current["contato"] = el; }}
        className="py-32 px-6 md:px-20"
        style={{ background: "linear-gradient(135deg, #0f0f0f, #1a0000 50%, #0f0f0f)" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className={`fade-left text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${isVisible("contato") ? "visible" : ""}`}>
              Dê o primeiro passo
            </p>
            <h2 className={`fade-left stagger-1 font-display font-black text-5xl md:text-7xl leading-none mb-6 ${isVisible("contato") ? "visible" : ""}`}>
              AGENDE<br />SUA <span className="text-red-600">AULA</span>
            </h2>
            <p className={`fade-left stagger-2 text-gray-400 leading-relaxed max-w-sm mb-8 ${isVisible("contato") ? "visible" : ""}`}>
              Entre em contato pelo WhatsApp e vamos encontrar o melhor horário e modalidade para você. Primeira aula gratuita!
            </p>
            <div className={`fade-left stagger-3 flex items-center gap-3 ${isVisible("contato") ? "visible" : ""}`}>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-300 text-sm">Atendimento online agora</span>
            </div>
          </div>
          <div className={`fade-right ${isVisible("contato") ? "visible" : ""} flex flex-col items-center justify-center`}>
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20as%20aulas%20do%20CT%20FOCO."
              target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-6"
            >
              <div className="relative flex items-center justify-center" style={{ filter: "drop-shadow(0 0 60px rgba(37,211,102,0.5))" }}>
                <div className="absolute w-56 h-56 rounded-full bg-green-500 opacity-10 group-hover:opacity-20 transition-all duration-500 scale-100 group-hover:scale-110" />
                <div className="absolute w-44 h-44 rounded-full bg-green-500 opacity-10 group-hover:opacity-20 transition-all duration-500 animate-ping" style={{ animationDuration: "2s" }} />
                <svg className="w-40 h-40 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110 transform relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display font-black text-3xl text-white tracking-widest group-hover:text-green-400 transition-colors duration-300">FALAR AGORA</p>
                <p className="text-gray-500 text-sm tracking-widest uppercase mt-1">(73) 99999-9999</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="font-display font-black text-3xl tracking-widest mb-3">
              CT <span className="text-red-600">FOCO</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Treinamento funcional, Musculação, Pilates e Fisioterapia com foco em resultados reais.
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gray-600 mb-4">Modalidades</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Funcional", "Musculação", "Pilates", "Fisioterapia"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 rounded-full" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gray-600 mb-4">Contato</h4>
            <p className="text-gray-400 text-sm mb-2">📍 Rua Sartunino Jose Soares, 561, Fatima</p>
            <p className="text-gray-400 text-sm mb-2">📞 (73) 99999-9999</p>
            <p className="text-gray-400 text-sm">⏰ Seg–Sext: 07h00 – 22h00</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-neutral-900 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-xs tracking-widest">© 2025 CT FOCO. Todos os direitos reservados.</p>
          <div className="flex gap-1 text-gray-700 text-xs">
            <span>Feito com</span>
            <span className="text-red-600">♥</span>
            <span>para quem tem foco.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}