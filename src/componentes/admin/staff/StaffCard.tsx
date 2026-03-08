import type TeamMember from "../../../types/TeamMembers";
import { IconEdit, IconTrash } from "../../../icons/AdminIcons";

interface StaffCardProps {
  member: TeamMember;
  onEdit: (s: TeamMember) => void;
  onDelete: (id: string) => void;
}

export function StaffCard({ member: s, onEdit, onDelete }: StaffCardProps) {
  return (
    <div className="border border-neutral-800 bg-neutral-950 overflow-hidden group">
      <div className="relative">
        {s.fotoUrl ? (
          <img src={s.fotoUrl} alt={s.name} className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        ) : (
          <div className="w-full h-48 bg-neutral-900 flex items-center justify-center">
            <span className="font-display font-black text-6xl text-neutral-700">{s.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 font-medium ${s.status === "ativo" ? "badge-ativo" : "badge-inativo"}`}>
          {s.status}
        </span>
      </div>

      <div className="p-4">
        <div className="w-6 h-0.5 bg-red-600 mb-2" />
        <h3 className="font-display font-bold text-lg text-white leading-tight">{s.name}</h3>
        <p className="text-red-500 text-xs tracking-widest uppercase mt-0.5">{s.role}</p>
        <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1">
          <p className="text-gray-500 text-xs">{s.email}</p>
          <p className="text-gray-500 text-xs">{s.phone}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => onEdit(s)}
            className="flex-1 border border-neutral-700 hover:border-white text-gray-400 hover:text-white text-xs py-1.5 transition-colors flex items-center justify-center gap-1">
            <IconEdit /> Editar
          </button>
          <button onClick={() => onDelete(s.id)}
            className="border border-neutral-700 hover:border-red-600 text-gray-400 hover:text-red-500 px-3 py-1.5 transition-colors">
            <IconTrash />
          </button>
        </div>
      </div>
    </div>
  );
}