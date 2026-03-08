import type MembersType from "../../../types/MembersType";
import type TeamMember from "../../../types/TeamMembers";
import { StatCard } from "./StatCard";
import { ModalityChart } from "./Modalities";
import { RecentMembers } from "./RecentMembers";
import { IconSpinner } from "../../../icons/AdminIcons";

interface DashboardViewProps {
  members: MembersType[];
  staff: TeamMember[];
  loadingMembers: boolean;
  loadingStaff: boolean;
}

export function DashboardView({ members, staff, loadingMembers, loadingStaff }: DashboardViewProps) {
  const activeMembers = members.filter(m => m.status === "ativo").length;
  const modalityCount: Record<string, number> = {};
  members.forEach(m => { modalityCount[m.modality] = (modalityCount[m.modality] || 0) + 1; });
  const topModality = Object.entries(modalityCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  return (
    <div className="">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de Alunos"  value={members.length}  sub="cadastrados" accent />
        <StatCard label="Alunos Ativos"    value={activeMembers}   sub={`${members.length - activeMembers} inativos`} />
        <StatCard label="Equipe"           value={staff.length}    sub="profissionais" />
        <StatCard label="Modalidade Top"   value={topModality}     sub="mais alunos" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <ModalityChart members={members} />
        <RecentMembers members={members} loading={loadingMembers} />
      </div>

      {/* Staff preview */}
      <div className="border border-neutral-800 bg-neutral-950 p-6">
        <h3 className="font-display font-bold text-lg mb-5 text-white tracking-wide">Equipe</h3>
        {loadingStaff ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm"><IconSpinner /> Carregando...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {staff.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800">
                {s.fotoUrl ? (
                  <img src={s.fotoUrl} alt={s.name} className="w-10 h-10 object-cover grayscale flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 bg-neutral-800 flex items-center justify-center text-neutral-500 font-display font-black text-lg flex-shrink-0">
                    {s.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 truncate">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}