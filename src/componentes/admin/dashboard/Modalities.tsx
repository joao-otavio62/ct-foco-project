import type MembersType from "../../../types/MembersType";
import { MODALITIES } from "../../../constants/AdminConstants";

interface ModalityChartProps {
  members: MembersType[];
}

export function ModalityChart({ members }: ModalityChartProps) {
  return (
    <div className="border border-neutral-800 bg-neutral-950 p-6">
      <h3 className="font-display font-bold text-lg mb-5 text-white tracking-wide">Alunos por Modalidade</h3>
      <div className="space-y-4">
        {MODALITIES.map(mod => {
          const count = members.filter(m => m.modality === mod).length;
          const pct = members.length ? Math.round((count / members.length) * 100) : 0;
          return (
            <div key={mod}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-400">{mod}</span>
                <span className="text-white font-medium">
                  {count} <span className="text-gray-600 text-xs">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 bg-neutral-800 w-full">
                <div className="h-full bg-red-600 transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}