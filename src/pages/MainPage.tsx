import "../assets/MainPage.css";

import { Nav }      from "../componentes/Main/Nav";
import { Hero }     from "../componentes/Main/Hero";
import { Sobre }    from "../componentes/Main/Sobre";
import { Servicos } from "../componentes/Main/Servicos";
import { Horarios } from "../componentes/Main/Horarios";
import { Equipe }   from "../componentes/Main/Equipe";
import { Contato }  from "../componentes/Main/Contato";
import { Footer }   from "../componentes/Main/Footer";

import { useScrollVisibility } from "../hooks/UseScrollVisibility";
import { useTeam }             from "../hooks/UseTeam";

export function MainPage() {
  const { scrollY, isVisible, setRef } = useScrollVisibility();
  const { teamMembers, loading: loadingTeam } = useTeam();

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      <Nav scrollY={scrollY} />

      <Hero />

      <Sobre
        isVisible={isVisible("sobre")}
        sectionRef={setRef("sobre")}
      />

      <Servicos
        isVisible={isVisible("servicos")}
        sectionRef={setRef("servicos")}
      />

      <Horarios
        isVisible={isVisible("horarios")}
        sectionRef={setRef("horarios")}
      />

      <Equipe
        teamMembers={teamMembers}
        loading={loadingTeam}
        isVisible={isVisible("equipe")}
        sectionRef={setRef("equipe")}
      />

      <Contato
        isVisible={isVisible("contato")}
        sectionRef={setRef("contato")}
      />

      <Footer />
    </div>
  );
}