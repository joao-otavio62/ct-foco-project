import { useState } from "react";
import type TeamMember from "../../../types/TeamMembers";
import { StaffCard } from "./StaffCard";
import { IconSearch, IconSpinner } from "../../../icons/AdminIcons";
import { inputCls } from "../../../constants/AdminConstants";

interface StaffViewProps {
  staff: TeamMember[];
  loading: boolean;
  onEdit: (s: TeamMember) => void;
  onDelete: (id: string) => void;
}

export function StaffView({ staff, loading, onEdit, onDelete }: StaffViewProps) {
  const [search, setSearch] = useState("");

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><IconSearch /></span>
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            className={inputCls + " pl-9"}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="text-gray-600 text-sm">{filtered.length} profissional{filtered.length !== 1 ? "is" : ""}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
          <IconSpinner /> Carregando equipe...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(s => (
            <StaffCard key={s.id} member={s} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}