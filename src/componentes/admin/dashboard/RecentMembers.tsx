import type MembersType from "../../../types/MembersType";
import { IconSpinner } from "../../../icons/AdminIcons";

interface RecentMembersProps {
  members: MembersType[];
  loading: boolean;
}

export function RecentMembers({ members, loading }: RecentMembersProps) {
  const recent = [...members].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).slice(0, 5);

  return (
    <div className="border border-neutral-800 bg-neutral-950 p-6">
      <h3 className="font-display font-bold text-lg mb-5 text-white tracking-wide">Últimos Alunos</h3>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
          <IconSpinner /> Carregando...
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map(m => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-neutral-900 last:border-0">
              <div>
                <p className="text-sm text-white font-medium">{m.name}</p>
                <p className="text-xs text-gray-600">{m.modality} · {m.schedule}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 font-medium ${m.status === "ativo" ? "badge-ativo" : "badge-inativo"}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}