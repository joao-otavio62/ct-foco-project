interface NavProps {
  scrollY: number;
}

const NAV_LINKS = ["Sobre", "Serviços", "Equipe", "Horários"];

export function Nav({ scrollY }: NavProps) {
  const scrolled = scrollY > 80;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between"
      style={{
        background: scrolled ? "rgba(0,0,0,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(220,38,38,0.2)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      <div className="font-display font-black text-2xl tracking-widest">
        CT <span className="text-red-600">FOCO</span>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase">
        {NAV_LINKS.map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="nav-link text-gray-300 hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase">
      <a
        href="#contato"
        className="btn-primary bg-red-600 text-white px-5 py-2 text-sm font-medium tracking-widest uppercase"
      >
        Agendar
      </a>
      <a
        href="/Login"
        className="btn-primary bg-red-600 text-white px-5 py-2 text-sm font-medium tracking-widest uppercase"
      >
        Login
      </a>
      </div>
    </nav>
  );
}