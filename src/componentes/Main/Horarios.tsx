import { schedules } from "../../constants/MainConstants";

interface HorariosProps {
  isVisible: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}

export function Horarios({ isVisible, sectionRef }: HorariosProps) {
  const v = isVisible ? "visible" : "";

  return (
    <section
      id="horários"
      ref={sectionRef}
      className="py-32 px-6 md:px-20"
      style={{ background: "linear-gradient(180deg, #0a0a0a, #111)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className={`fade-up text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${v}`}>
            Grade horária
          </p>
          <h2 className={`fade-up stagger-1 font-display font-black text-5xl md:text-7xl ${v}`}>
            HORÁRIOS<br /><span className="text-red-600">DISPONÍVEIS</span>
          </h2>
        </div>

        <div className={`fade-up stagger-2 flex flex-wrap gap-3 ${v}`}>
          {schedules.map(h => (
            <div
              key={h}
              className="border border-neutral-700 px-6 py-3 font-display font-bold text-xl hover:border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-default"
            >
              {h}
            </div>
          ))}
        </div>

        <p className={`fade-up stagger-3 mt-8 text-gray-500 text-sm ${v}`}>
          * Turmas com vagas limitadas. Agende com antecedência para garantir seu horário.
        </p>
      </div>
    </section>
  );
}