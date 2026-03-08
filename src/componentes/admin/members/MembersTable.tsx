import type MembersType from "../../../types/MembersType";
import { IconEdit, IconTrash, IconChevron } from "../../../icons/AdminIcons";

interface MembersTableProps {
  members: MembersType[];
  page: number;
  totalPages: number;
  onEdit: (m: MembersType) => void;
  onDelete: (id: string) => void;
  onPageChange: (p: number) => void;
}

export function MembersTable({ members, page, totalPages, onEdit, onDelete, onPageChange }: MembersTableProps) {
  return (
    <>
      <div className="border border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950">
              {["Nome", "Contato", "Pagamento", "Nascimento / Idade", "Altura", "Modalidade", "Horário", "Status", "Ações"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs tracking-widest uppercase text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-black">
            {members.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-gray-600">Nenhum aluno encontrado.</td></tr>
            ) : members.map(m => (
              <tr key={m.id} className="row-hover border-b border-neutral-900">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{m.name}</div>
                  <div className="text-gray-600 text-xs mt-0.5">desde {m.joinedAt}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-300">{m.email}</div>
                  <div className="text-gray-600 text-xs">{m.phone}</div>
                </td>
                <td className="px-4 py-3">
                  {m.paymentStatus === "pago"
                    ? <span className="text-green-500">Pago</span>
                    : <span className="text-red-500">Pendente</span>}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {new Date(m.birthDate).toLocaleDateString("pt-BR")}
                  <span className="ml-1.5 text-xs text-gray-600">({m.age} anos)</span>
                </td>
                <td className="px-4 py-3 text-gray-300">{m.height} cm</td>
                <td className="px-4 py-3"><span className="tag text-xs px-2 py-0.5">{m.modality}</span></td>
                <td className="px-4 py-3 text-gray-300">{m.schedule}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 font-medium ${m.status === "ativo" ? "badge-ativo" : "badge-inativo"}`}>{m.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(m)} className="text-gray-500 hover:text-white transition-colors p-1 cursor-pointer"><IconEdit /></button>
                    <button onClick={() => onDelete(m.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1 cursor-pointer"><IconTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
              className="border border-neutral-700 px-3 py-1.5 text-sm disabled:opacity-30 hover:border-red-600 transition-colors flex items-center gap-1">
              <IconChevron dir="left" /> Ant
            </button>
            <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="border border-neutral-700 px-3 py-1.5 text-sm disabled:opacity-30 hover:border-red-600 transition-colors flex items-center gap-1">
              Próx <IconChevron dir="right" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}