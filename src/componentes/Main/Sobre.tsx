interface SobreProps {
  isVisible: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}

const STATS = [
  ["6h–22h", "Horário de funcionamento"],
  ["4",      "Modalidades"],
  ["<12",    "Alunos por turma"],
] as const;

export function Sobre({ isVisible, sectionRef }: SobreProps) {
  const v = isVisible ? "visible" : "";

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative py-32 px-6 md:px-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)" }}
    >
      {/* Detalhe geométrico */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
        <div
          className="w-full h-full bg-red-600"
          style={{ clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div>
          <p className={`fade-left text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${v}`}>
            Sobre o CT FOCO
          </p>
          <h2 className={`fade-left stagger-1 font-display font-black text-5xl md:text-7xl leading-none mb-6 ${v}`}>
            ONDE O<br /><span className="text-red-600">FOCO</span><br />TRANSFORMA
          </h2>
          <p className={`fade-left stagger-2 text-gray-400 leading-relaxed mb-8 max-w-md ${v}`}>
            O CT FOCO nasceu da paixão por resultados reais. Com turmas reduzidas e horário marcado,
            garantimos atenção individualizada e a intensidade certa para cada aluno — do iniciante ao avançado.
          </p>
          <div className={`fade-left stagger-3 flex gap-12 ${v}`}>
            {STATS.map(([val, label]) => (
              <div key={label}>
                <div className="font-display font-black text-4xl text-red-600">{val}</div>
                <div className="text-gray-500 text-xs tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Imagem */}
        <div className={`fade-right ${v} relative`}>
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
  );
}