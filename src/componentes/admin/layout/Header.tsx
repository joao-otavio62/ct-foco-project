import { IconPlus } from "../../../icons/AdminIcons";
import type { View } from "../../../types/AdminTypes";

const VIEW_TITLES: Record<View, string> = {
  dashboard:  "Dashboard",
  members:    "Gerenciar Alunos",
  new_member: "Cadastrar Novo Aluno",
  staff:      "Gerenciar Equipe",
};

interface HeaderProps {
  view: View;
  onAddMember: () => void;
  onAddStaff: () => void;
}

export function Header({ view, onAddMember, onAddStaff }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-black/90 backdrop-blur border-b border-neutral-900 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-wide">
          {VIEW_TITLES[view]}
        </h1>
        <p className="text-gray-600 text-xs mt-0.5">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long", day: "2-digit", month: "long", year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {view === "members" && (
          <button onClick={onAddMember} className="btn-red flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide">
            <IconPlus /> Novo Aluno
          </button>
        )}
        {view === "staff" && (
          <button onClick={onAddStaff} className="btn-red flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide">
            <IconPlus /> Novo Membro
          </button>
        )}
      </div>
    </header>
  );
}