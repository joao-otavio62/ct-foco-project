import { services } from "../../constants/MainConstants";

interface ServicosProps {
  isVisible: boolean;
  sectionRef: (el: HTMLElement | null) => void;
}

export function Servicos({ isVisible, sectionRef }: ServicosProps) {
  const v = isVisible ? "visible" : "";

  return (
    <section
      id="serviços"
      ref={sectionRef}
      className="py-32 px-6 md:px-20 bg-black"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className={`fade-up text-red-600 text-xs font-medium tracking-[0.3em] uppercase mb-4 ${v}`}>
            Nossas modalidades
          </p>
          <h2 className={`fade-up stagger-1 font-display font-black text-5xl md:text-7xl ${v}`}>
            SERVIÇOS
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className={`service-card fade-up border border-neutral-800 p-8 bg-neutral-950 ${v}`}
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
  );
}