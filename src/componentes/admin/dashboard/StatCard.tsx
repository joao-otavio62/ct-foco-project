interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden border p-6 ${accent ? "border-red-800 bg-red-950/30" : "border-neutral-800 bg-neutral-950"}`}>
      {accent && <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />}
      <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">{label}</p>
      <p className={`font-display font-black text-4xl ${accent ? "text-red-400" : "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}