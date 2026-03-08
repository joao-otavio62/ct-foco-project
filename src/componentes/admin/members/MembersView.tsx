import { useState } from "react";
import type MembersType from "../../../types/MembersType";
import { MembersTable } from "./MembersTable";
import { IconSearch, IconSpinner } from "../../../icons/AdminIcons";
import { MODALITIES, inputCls, selectCls } from "../../../constants/AdminConstants";

const PER_PAGE = 8;

interface MembersViewProps {
  members: MembersType[];
  loading: boolean;
  onEdit: (m: MembersType) => void;
  onDelete: (id: string) => void;
}

export function MembersView({ members, loading, onEdit, onDelete }: MembersViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [page, setPage] = useState(1);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todos" || m.modality === filter || m.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
        <IconSpinner /> Carregando alunos...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><IconSearch /></span>
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            className={inputCls + " pl-9"}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className={selectCls + " w-auto"} value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          <option value="todos">Todos</option>
          {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
        <span className="text-gray-600 text-sm">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <MembersTable
        members={paged}
        page={page}
        totalPages={totalPages}
        onEdit={onEdit}
        onDelete={onDelete}
        onPageChange={setPage}
      />
    </div>
  );
}