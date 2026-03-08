import { IconDashboard, IconUsers, IconPlus, IconStaff } from "../../../icons/AdminIcons";
import type { View } from "../../../types/AdminTypes";

interface SidebarProps {
  view: View;
  onNavigate: (v: View) => void;
}

const NAV_ITEMS = [
  { id: "dashboard" as View, label: "Dashboard",        Icon: IconDashboard },
  { id: "members"   as View, label: "Alunos",           Icon: IconUsers     },
  { id: "new_member"as View, label: "Cadastrar Aluno",  Icon: IconPlus      },
  { id: "staff"     as View, label: "Equipe",           Icon: IconStaff     },
];

export function Sidebar({ view, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-neutral-950 border-r border-neutral-900 flex flex-col fixed left-0 top-0 bottom-0 z-40">
      <div className="px-6 py-6 border-b border-neutral-900">
        <div className="font-display font-black text-2xl tracking-widest">
          CT <span className="text-red-600">FOCO</span>
        </div>
        <p className="text-gray-600 text-xs tracking-widest uppercase mt-1">Painel Administrativo</p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide text-left ${
              view === id ? "active text-white" : "text-gray-500"
            }`}
          >
            <Icon /> {label}
          </button>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-neutral-900">
        <p className="text-gray-700 text-xs">v1.0.0 · CT FOCO Admin</p>
      </div>
    </aside>
  );
}