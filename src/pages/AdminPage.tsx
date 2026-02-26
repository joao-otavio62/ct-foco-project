import { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  age: number;
  height: number; // cm
  modality: string;
  schedule: string;
  status: "ativo" | "inativo";
  joinedAt: string;
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  specialty: string;
  status: "ativo" | "inativo";
  photo: string;
};

type View = "dashboard" | "members" | "new_member" | "staff";
type ModalType = "addMember" | "editMember" | "addStaff" | "editStaff" | "deleteMember" | "deleteStaff" | null;

// ── Seed data ──────────────────────────────────────────────────────────────
const seedMembers: Member[] = [
  { id: "m1", name: "Lucas Ferreira", email: "lucas@email.com", phone: "(11) 99123-4567", birthDate: "1995-03-15", age: 29, height: 178, modality: "Funcional", schedule: "07:00", status: "ativo", joinedAt: "2024-01-10" },
  { id: "m2", name: "Mariana Costa", email: "mari@email.com", phone: "(11) 98765-4321", birthDate: "1998-07-22", age: 26, height: 165, modality: "Pilates", schedule: "09:00", status: "ativo", joinedAt: "2024-02-05" },
  { id: "m3", name: "Pedro Alves", email: "pedro@email.com", phone: "(11) 97654-3210", birthDate: "1990-11-08", age: 34, height: 182, modality: "Musculação", schedule: "06:00", status: "ativo", joinedAt: "2023-11-20" },
  { id: "m4", name: "Fernanda Lima", email: "fernanda@email.com", phone: "(11) 96543-2109", birthDate: "2000-05-30", age: 24, height: 160, modality: "Fisioterapia", schedule: "10:00", status: "inativo", joinedAt: "2024-03-01" },
  { id: "m5", name: "Gabriel Santos", email: "gabriel@email.com", phone: "(11) 95432-1098", birthDate: "1993-09-12", age: 31, height: 175, modality: "Funcional", schedule: "19:00", status: "ativo", joinedAt: "2024-01-25" },
];

const seedStaff: StaffMember[] = [
  { id: "s1", name: "Carlos Mendes", role: "Head Coach", email: "carlos@ctfoco.com", phone: "(11) 91234-5678", specialty: "Funcional", status: "ativo", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "s2", name: "Ana Paula Rocha", role: "Instrutora de Pilates", email: "ana@ctfoco.com", phone: "(11) 92345-6789", specialty: "Pilates", status: "ativo", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: "s3", name: "Dr. Felipe Costa", role: "Fisioterapeuta", email: "felipe@ctfoco.com", phone: "(11) 93456-7890", specialty: "Fisioterapia", status: "ativo", photo: "https://randomuser.me/api/portraits/men/58.jpg" },
  { id: "s4", name: "Juliana Lima", role: "Instrutora de Funcional", email: "juliana@ctfoco.com", phone: "(11) 94567-8901", specialty: "Funcional", status: "ativo", photo: "https://randomuser.me/api/portraits/women/68.jpg" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9);
const calcAge = (birthDate: string) => {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const MODALITIES = ["Funcional", "Musculação", "Pilates", "Fisioterapia"];
const SCHEDULES = ["06:00","07:00","08:00","09:00","10:00","12:00","13:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
const ROLES = ["Head Coach", "Instrutor(a) de Funcional", "Instrutor(a) de Musculação", "Instrutor(a) de Pilates", "Fisioterapeuta", "Coordenador(a)", "Recepcionista"];

// ── Icon components ────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm-10 9a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5zm10 2a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
  </svg>
);
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-5.477-1.5" />
  </svg>
);
const IconStaff = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconChevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
  </svg>
);

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) => (
  <div className={`relative overflow-hidden border p-6 ${accent ? "border-red-800 bg-red-950/30" : "border-neutral-800 bg-neutral-950"}`}>
    {accent && <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />}
    <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">{label}</p>
    <p className={`font-display font-black text-4xl ${accent ? "text-red-400" : "text-white"}`}>{value}</p>
    {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
  </div>
);

// ── Input field ────────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-red-600 transition-colors";
const selectCls = inputCls + " cursor-pointer";

// ── Main Component ─────────────────────────────────────────────────────────
export function AdminPage() {
  const [view, setView] = useState<View>("dashboard");
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [staff, setStaff] = useState<StaffMember[]>(seedStaff);
  const [modal, setModal] = useState<ModalType>(null);
  const [editTarget, setEditTarget] = useState<Member | StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState("todos");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // New member form (dedicated page)
  const blankNewMember = { name: "", email: "", phone: "", birthDate: "", height: 170, modality: "Funcional", schedule: "07:00", status: "ativo" as const };
  const [nForm, setNForm] = useState<typeof blankNewMember>(blankNewMember);
  const [nErrors, setNErrors] = useState<Record<string, string>>({});

  // Member form state
  const blankMember = { name: "", email: "", phone: "", birthDate: "", height: 170, modality: "Funcional", schedule: "07:00", status: "ativo" as const };
  const [mForm, setMForm] = useState<typeof blankMember>(blankMember);

  // Staff form state
  const blankStaff = { name: "", email: "", phone: "", role: "Instrutor(a) de Funcional", specialty: "Funcional", status: "ativo" as const, photo: "" };
  const [sForm, setSForm] = useState<typeof blankStaff>(blankStaff);

  const openAddMember = () => { setMForm(blankMember); setEditTarget(null); setModal("addMember"); };
  const openEditMember = (m: Member) => { setMForm({ name: m.name, email: m.email, phone: m.phone, birthDate: m.birthDate, height: m.height, modality: m.modality, schedule: m.schedule, status: m.status }); setEditTarget(m); setModal("editMember"); };
  const openAddStaff = () => { setSForm(blankStaff); setEditTarget(null); setModal("addStaff"); };
  const openEditStaff = (s: StaffMember) => { setSForm({ name: s.name, email: s.email, phone: s.phone, role: s.role, specialty: s.specialty, status: s.status, photo: s.photo }); setEditTarget(s); setModal("editStaff"); };

  const validateNewMember = () => {
    const errs: Record<string, string> = {};
    if (!nForm.name.trim()) errs.name = "Nome é obrigatório";
    if (!nForm.email.trim() || !/\S+@\S+\.\S+/.test(nForm.email)) errs.email = "Email inválido";
    if (!nForm.phone.trim()) errs.phone = "Telefone é obrigatório";
    if (!nForm.birthDate) errs.birthDate = "Data de nascimento é obrigatória";
    if (!nForm.height || nForm.height < 100 || nForm.height > 250) errs.height = "Altura inválida (100–250 cm)";
    setNErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitNewMember = () => {
    if (!validateNewMember()) return;
    const age = calcAge(nForm.birthDate);
    setMembers(prev => [{ ...nForm, id: genId(), age, joinedAt: new Date().toISOString().slice(0, 10) }, ...prev]);
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setNForm(blankNewMember);
      setNErrors({});
    }, 2500);
  };

  const saveMember = () => {
    const age = calcAge(mForm.birthDate);
    if (modal === "addMember") {
      setMembers(prev => [{ ...mForm, id: genId(), age, joinedAt: new Date().toISOString().slice(0, 10) }, ...prev]);
    } else if (editTarget) {
      setMembers(prev => prev.map(m => m.id === (editTarget as Member).id ? { ...m, ...mForm, age } : m));
    }
    setModal(null);
  };

  const saveStaff = () => {
    if (modal === "addStaff") {
      setStaff(prev => [{ ...sForm, id: genId(), photo: sForm.photo || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 80)}.jpg` }, ...prev]);
    } else if (editTarget) {
      setStaff(prev => prev.map(s => s.id === (editTarget as StaffMember).id ? { ...s, ...sForm } : s));
    }
    setModal(null);
  };

  const deleteMember = () => { setMembers(prev => prev.filter(m => m.id !== deleteTarget)); setModal(null); };
  const deleteStaff = () => { setStaff(prev => prev.filter(s => s.id !== deleteTarget)); setModal(null); };

  // Filtered members
  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchFilter = memberFilter === "todos" || m.modality === memberFilter || m.status === memberFilter;
    return matchSearch && matchFilter;
  });
  const totalPages = Math.ceil(filteredMembers.length / PER_PAGE);
  const pagedMembers = filteredMembers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
    s.role.toLowerCase().includes(staffSearch.toLowerCase())
  );

  // Stats
  const activeMembers = members.filter(m => m.status === "ativo").length;
  const modalityCount: Record<string, number> = {};
  members.forEach(m => { modalityCount[m.modality] = (modalityCount[m.modality] || 0) + 1; });
  const topModality = Object.entries(modalityCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  const closeModal = () => setModal(null);

  return (
    <div className="min-h-screen bg-black text-white flex" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Barlow Condensed', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #dc2626; }
        .nav-item { transition: all 0.2s ease; position: relative; }
        .nav-item.active { background: rgba(220,38,38,0.1); color: white; }
        .nav-item.active::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:#dc2626; }
        .nav-item:hover:not(.active) { background: rgba(255,255,255,0.04); }
        .row-hover { transition: background 0.15s ease; }
        .row-hover:hover { background: rgba(220,38,38,0.05); }
        .modal-bg { animation: fadeIn 0.2s ease; }
        .modal-box { animation: slideUp 0.25s cubic-bezier(0.22,1,0.36,1); }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .btn-red { background:#dc2626; transition: all 0.2s ease; }
        .btn-red:hover { background:#b91c1c; box-shadow: 0 4px 20px rgba(220,38,38,0.4); }
        .badge-ativo { background: rgba(34,197,94,0.15); color: #86efac; border: 1px solid rgba(34,197,94,0.3); }
        .badge-inativo { background: rgba(239,68,68,0.1); color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); }
        .tag { background: rgba(220,38,38,0.1); color: #fca5a5; border: 1px solid rgba(220,38,38,0.2); }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 min-h-screen bg-neutral-950 border-r border-neutral-900 flex flex-col fixed left-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-neutral-900">
          <div className="font-display font-black text-2xl tracking-widest">
            CT <span className="text-red-600">FOCO</span>
          </div>
          <p className="text-gray-600 text-xs tracking-widest uppercase mt-1">Painel Administrativo</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {[
            { id: "dashboard" as View, label: "Dashboard", Icon: IconDashboard },
            { id: "members" as View, label: "Alunos", Icon: IconUsers },
            { id: "new_member" as View, label: "Cadastrar Aluno", Icon: IconPlus },
            { id: "staff" as View, label: "Equipe", Icon: IconStaff },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setView(id); setPage(1); }}
              className={`nav-item w-full flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide text-left ${view === id ? "active text-white" : "text-gray-500"}`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-900">
          <p className="text-gray-700 text-xs">v1.0.0 · CT FOCO Admin</p>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-64 flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur border-b border-neutral-900 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-2xl text-white tracking-wide">
              {view === "dashboard" && "Dashboard"}
              {view === "members" && "Gerenciar Alunos"}
              {view === "new_member" && "Cadastrar Novo Aluno"}
              {view === "staff" && "Gerenciar Equipe"}
            </h1>
            <p className="text-gray-600 text-xs mt-0.5">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {view === "members" && (
              <button onClick={openAddMember} className="btn-red flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide">
                <IconPlus /> Novo Aluno
              </button>
            )}
            {view === "staff" && (
              <button onClick={openAddStaff} className="btn-red flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide">
                <IconPlus /> Novo Membro
              </button>
            )}
          </div>
        </header>

        <div className="p-8">

          {/* ══ DASHBOARD ══ */}
          {view === "dashboard" && (
            <div className="space-y-8">
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total de Alunos" value={members.length} sub="cadastrados" accent />
                <StatCard label="Alunos Ativos" value={activeMembers} sub={`${members.length - activeMembers} inativos`} />
                <StatCard label="Equipe" value={staff.length} sub="profissionais" />
                <StatCard label="Modalidade Top" value={topModality} sub="mais alunos" />
              </div>

              {/* Modality breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
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
                            <span className="text-white font-medium">{count} <span className="text-gray-600 text-xs">({pct}%)</span></span>
                          </div>
                          <div className="h-1.5 bg-neutral-800 w-full">
                            <div className="h-full bg-red-600 transition-all duration-700" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent members */}
                <div className="border border-neutral-800 bg-neutral-950 p-6">
                  <h3 className="font-display font-bold text-lg mb-5 text-white tracking-wide">Últimos Alunos</h3>
                  <div className="space-y-3">
                    {[...members].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).slice(0, 5).map(m => (
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
                </div>
              </div>

              {/* Team overview */}
              <div className="border border-neutral-800 bg-neutral-950 p-6">
                <h3 className="font-display font-bold text-lg mb-5 text-white tracking-wide">Equipe</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {staff.map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800">
                      <img src={s.photo} alt={s.name} className="w-10 h-10 object-cover grayscale" />
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{s.name}</p>
                        <p className="text-xs text-gray-500 truncate">{s.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ NEW MEMBER (dedicated page) ══ */}
          {view === "new_member" && (
            <div className="max-w-2xl mx-auto">
              {/* Success banner */}
              {registerSuccess && (
                <div className="mb-6 flex items-center gap-3 border border-green-800 bg-green-950/40 px-5 py-4 text-green-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-sm">Aluno cadastrado com sucesso!</p>
                    <p className="text-xs text-green-600 mt-0.5">O formulário será limpo automaticamente.</p>
                  </div>
                </div>
              )}

              <div className="border border-neutral-800 bg-neutral-950">
                {/* Header */}
                <div className="px-8 py-6 border-b border-neutral-800">
                  <div className="w-8 h-0.5 bg-red-600 mb-3" />
                  <h2 className="font-display font-black text-2xl text-white">Dados do Novo Aluno</h2>
                  <p className="text-gray-500 text-sm mt-1">Preencha todos os campos obrigatórios para realizar o cadastro.</p>
                </div>

                <div className="p-8 space-y-6">
                  {/* Seção pessoal */}
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-red-600 font-medium mb-4">Dados Pessoais</p>
                    <div className="space-y-4">
                      <Field label="Nome completo *">
                        <input
                          className={inputCls + (nErrors.name ? " border-red-700" : "")}
                          value={nForm.name}
                          onChange={e => { setNForm(f => ({ ...f, name: e.target.value })); setNErrors(er => ({ ...er, name: "" })); }}
                          placeholder="Ex: João da Silva"
                        />
                        {nErrors.name && <p className="text-red-500 text-xs mt-1">{nErrors.name}</p>}
                      </Field>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Email *">
                          <input
                            className={inputCls + (nErrors.email ? " border-red-700" : "")}
                            type="email"
                            value={nForm.email}
                            onChange={e => { setNForm(f => ({ ...f, email: e.target.value })); setNErrors(er => ({ ...er, email: "" })); }}
                            placeholder="email@exemplo.com"
                          />
                          {nErrors.email && <p className="text-red-500 text-xs mt-1">{nErrors.email}</p>}
                        </Field>
                        <Field label="Telefone *">
                          <input
                            className={inputCls + (nErrors.phone ? " border-red-700" : "")}
                            value={nForm.phone}
                            onChange={e => { setNForm(f => ({ ...f, phone: e.target.value })); setNErrors(er => ({ ...er, phone: "" })); }}
                            placeholder="(11) 99999-9999"
                          />
                          {nErrors.phone && <p className="text-red-500 text-xs mt-1">{nErrors.phone}</p>}
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Data de Nascimento *">
                          <input
                            className={inputCls + (nErrors.birthDate ? " border-red-700" : "")}
                            type="date"
                            value={nForm.birthDate}
                            onChange={e => { setNForm(f => ({ ...f, birthDate: e.target.value })); setNErrors(er => ({ ...er, birthDate: "" })); }}
                          />
                          {nErrors.birthDate && <p className="text-red-500 text-xs mt-1">{nErrors.birthDate}</p>}
                          {nForm.birthDate && !nErrors.birthDate && (
                            <p className="text-gray-500 text-xs mt-1">Idade: {calcAge(nForm.birthDate)} anos</p>
                          )}
                        </Field>
                        <Field label="Altura (cm) *">
                          <input
                            className={inputCls + (nErrors.height ? " border-red-700" : "")}
                            type="number"
                            min={100}
                            max={250}
                            value={nForm.height}
                            onChange={e => { setNForm(f => ({ ...f, height: Number(e.target.value) })); setNErrors(er => ({ ...er, height: "" })); }}
                          />
                          {nErrors.height && <p className="text-red-500 text-xs mt-1">{nErrors.height}</p>}
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-800" />

                  {/* Seção treino */}
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-red-600 font-medium mb-4">Dados de Treino</p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Modalidade">
                          <select className={selectCls} value={nForm.modality} onChange={e => setNForm(f => ({ ...f, modality: e.target.value }))}>
                            {MODALITIES.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                          </select>
                        </Field>
                        <Field label="Horário">
                          <select className={selectCls} value={nForm.schedule} onChange={e => setNForm(f => ({ ...f, schedule: e.target.value }))}>
                            {SCHEDULES.map(h => <option key={h} value={h} className="bg-black">{h}</option>)}
                          </select>
                        </Field>
                      </div>
                      <Field label="Status inicial">
                        <select className={selectCls} value={nForm.status} onChange={e => setNForm(f => ({ ...f, status: e.target.value as "ativo" | "inativo" }))}>
                          <option value="ativo" className="bg-black">Ativo</option>
                          <option value="inativo" className="bg-black">Inativo</option>
                        </select>
                      </Field>
                    </div>
                  </div>

                  {/* Preview card */}
                  {nForm.name && (
                    <div className="border border-neutral-700 bg-neutral-900 p-4 mt-2">
                      <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Pré-visualização</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-950 border border-red-800 flex items-center justify-center text-red-400 font-display font-black text-xl">
                          {nForm.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{nForm.name}</p>
                          <p className="text-gray-500 text-xs">{nForm.modality} · {nForm.schedule} {nForm.birthDate && `· ${calcAge(nForm.birthDate)} anos`} {nForm.height && `· ${nForm.height}cm`}</p>
                          <p className="text-gray-600 text-xs">{nForm.email} {nForm.phone && `· ${nForm.phone}`}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-8 pb-8 flex gap-3">
                  <button
                    onClick={() => { setNForm(blankNewMember); setNErrors({}); }}
                    className="border border-neutral-700 text-gray-400 hover:text-white px-6 py-3 text-sm transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={submitNewMember}
                    className="btn-red flex-1 py-3 text-sm font-medium tracking-wide flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Cadastrar Aluno
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ MEMBERS ══ */}
          {view === "members" && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-48">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><IconSearch /></span>
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    className={inputCls + " pl-9"}
                    value={memberSearch}
                    onChange={e => { setMemberSearch(e.target.value); setPage(1); }}
                  />
                </div>
                <select className={selectCls + " w-auto"} value={memberFilter} onChange={e => { setMemberFilter(e.target.value); setPage(1); }}>
                  <option value="todos">Todos</option>
                  {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                </select>
                <span className="text-gray-600 text-sm">{filteredMembers.length} resultado{filteredMembers.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Table */}
              <div className="border border-neutral-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950">
                      {["Nome", "Contato", "Nascimento / Idade", "Altura", "Modalidade", "Horário", "Status", "Ações"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs tracking-widest uppercase text-gray-600 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-black">
                    {pagedMembers.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-gray-600">Nenhum aluno encontrado.</td></tr>
                    ) : pagedMembers.map(m => (
                      <tr key={m.id} className="row-hover border-b border-neutral-900">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{m.name}</div>
                          <div className="text-gray-600 text-xs mt-0.5">desde {m.joinedAt}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-300">{m.email}</div>
                          <div className="text-gray-600 text-xs">{m.phone}</div>
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
                            <button onClick={() => openEditMember(m)} className="text-gray-500 hover:text-white transition-colors p-1"><IconEdit /></button>
                            <button onClick={() => { setDeleteTarget(m.id); setModal("deleteMember"); }} className="text-gray-500 hover:text-red-500 transition-colors p-1"><IconTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-sm">Página {page} de {totalPages}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border border-neutral-700 px-3 py-1.5 text-sm disabled:opacity-30 hover:border-red-600 transition-colors flex items-center gap-1">
                      <IconChevron dir="left" /> Ant
                    </button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border border-neutral-700 px-3 py-1.5 text-sm disabled:opacity-30 hover:border-red-600 transition-colors flex items-center gap-1">
                      Próx <IconChevron dir="right" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ STAFF ══ */}
          {view === "staff" && (
            <div className="space-y-5">
              {/* Search */}
              <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><IconSearch /></span>
                  <input
                    type="text"
                    placeholder="Buscar por nome ou cargo..."
                    className={inputCls + " pl-9"}
                    value={staffSearch}
                    onChange={e => setStaffSearch(e.target.value)}
                  />
                </div>
                <span className="text-gray-600 text-sm">{filteredStaff.length} profissional{filteredStaff.length !== 1 ? "is" : ""}</span>
              </div>

              {/* Staff grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStaff.map(s => (
                  <div key={s.id} className="border border-neutral-800 bg-neutral-950 overflow-hidden group">
                    <div className="relative">
                      <img src={s.photo} alt={s.name} className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 font-medium ${s.status === "ativo" ? "badge-ativo" : "badge-inativo"}`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="w-6 h-0.5 bg-red-600 mb-2" />
                      <h3 className="font-display font-bold text-lg text-white leading-tight">{s.name}</h3>
                      <p className="text-red-500 text-xs tracking-widest uppercase mt-0.5">{s.role}</p>
                      <p className="text-gray-500 text-xs mt-1">{s.specialty}</p>
                      <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1">
                        <p className="text-gray-500 text-xs">{s.email}</p>
                        <p className="text-gray-500 text-xs">{s.phone}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => openEditStaff(s)} className="flex-1 border border-neutral-700 hover:border-white text-gray-400 hover:text-white text-xs py-1.5 transition-colors flex items-center justify-center gap-1">
                          <IconEdit /> Editar
                        </button>
                        <button onClick={() => { setDeleteTarget(s.id); setModal("deleteStaff"); }} className="border border-neutral-700 hover:border-red-600 text-gray-400 hover:text-red-500 px-3 py-1.5 transition-colors">
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══ MODALS ══ */}
      {modal && (
        <div className="modal-bg fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-box bg-neutral-950 border border-neutral-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Member add/edit */}
            {(modal === "addMember" || modal === "editMember") && (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
                  <div>
                    <div className="w-6 h-0.5 bg-red-600 mb-2" />
                    <h2 className="font-display font-bold text-xl">{modal === "addMember" ? "Cadastrar Novo Aluno" : "Editar Aluno"}</h2>
                  </div>
                  <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors"><IconX /></button>
                </div>
                <div className="p-6 space-y-4">
                  <Field label="Nome completo">
                    <input className={inputCls} value={mForm.name} onChange={e => setMForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: João da Silva" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Email">
                      <input className={inputCls} type="email" value={mForm.email} onChange={e => setMForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
                    </Field>
                    <Field label="Telefone">
                      <input className={inputCls} value={mForm.phone} onChange={e => setMForm(f => ({ ...f, phone: e.target.value }))} placeholder="(11) 99999-9999" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Data de Nascimento">
                      <input className={inputCls} type="date" value={mForm.birthDate} onChange={e => setMForm(f => ({ ...f, birthDate: e.target.value }))} />
                    </Field>
                    <Field label="Altura (cm)">
                      <input className={inputCls} type="number" min={100} max={250} value={mForm.height} onChange={e => setMForm(f => ({ ...f, height: Number(e.target.value) }))} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Modalidade">
                      <select className={selectCls} value={mForm.modality} onChange={e => setMForm(f => ({ ...f, modality: e.target.value }))}>
                        {MODALITIES.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                      </select>
                    </Field>
                    <Field label="Horário">
                      <select className={selectCls} value={mForm.schedule} onChange={e => setMForm(f => ({ ...f, schedule: e.target.value }))}>
                        {SCHEDULES.map(h => <option key={h} value={h} className="bg-black">{h}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Status">
                    <select className={selectCls} value={mForm.status} onChange={e => setMForm(f => ({ ...f, status: e.target.value as "ativo" | "inativo" }))}>
                      <option value="ativo" className="bg-black">Ativo</option>
                      <option value="inativo" className="bg-black">Inativo</option>
                    </select>
                  </Field>
                </div>
                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={closeModal} className="flex-1 border border-neutral-700 text-gray-400 hover:text-white py-2.5 text-sm transition-colors">Cancelar</button>
                  <button onClick={saveMember} disabled={!mForm.name || !mForm.email || !mForm.birthDate} className="btn-red flex-1 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed">
                    {modal === "addMember" ? "Cadastrar Aluno" : "Salvar Alterações"}
                  </button>
                </div>
              </>
            )}

            {/* Staff add/edit */}
            {(modal === "addStaff" || modal === "editStaff") && (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
                  <div>
                    <div className="w-6 h-0.5 bg-red-600 mb-2" />
                    <h2 className="font-display font-bold text-xl">{modal === "addStaff" ? "Adicionar Membro da Equipe" : "Editar Membro"}</h2>
                  </div>
                  <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors"><IconX /></button>
                </div>
                <div className="p-6 space-y-4">
                  <Field label="Nome completo">
                    <input className={inputCls} value={sForm.name} onChange={e => setSForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Carlos Mendes" />
                  </Field>
                  <Field label="Cargo">
                    <select className={selectCls} value={sForm.role} onChange={e => setSForm(f => ({ ...f, role: e.target.value }))}>
                      {ROLES.map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
                    </select>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Email">
                      <input className={inputCls} type="email" value={sForm.email} onChange={e => setSForm(f => ({ ...f, email: e.target.value }))} placeholder="email@ctfoco.com" />
                    </Field>
                    <Field label="Telefone">
                      <input className={inputCls} value={sForm.phone} onChange={e => setSForm(f => ({ ...f, phone: e.target.value }))} placeholder="(11) 99999-9999" />
                    </Field>
                  </div>
                  <Field label="Especialidade">
                    <select className={selectCls} value={sForm.specialty} onChange={e => setSForm(f => ({ ...f, specialty: e.target.value }))}>
                      {MODALITIES.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                    </select>
                  </Field>
                  <Field label="URL da Foto (opcional)">
                    <input className={inputCls} value={sForm.photo} onChange={e => setSForm(f => ({ ...f, photo: e.target.value }))} placeholder="https://..." />
                  </Field>
                  <Field label="Status">
                    <select className={selectCls} value={sForm.status} onChange={e => setSForm(f => ({ ...f, status: e.target.value as "ativo" | "inativo" }))}>
                      <option value="ativo" className="bg-black">Ativo</option>
                      <option value="inativo" className="bg-black">Inativo</option>
                    </select>
                  </Field>
                </div>
                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={closeModal} className="flex-1 border border-neutral-700 text-gray-400 hover:text-white py-2.5 text-sm transition-colors">Cancelar</button>
                  <button onClick={saveStaff} disabled={!sForm.name || !sForm.email} className="btn-red flex-1 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed">
                    {modal === "addStaff" ? "Adicionar à Equipe" : "Salvar Alterações"}
                  </button>
                </div>
              </>
            )}

            {/* Delete confirm */}
            {(modal === "deleteMember" || modal === "deleteStaff") && (
              <>
                <div className="p-6 text-center">
                  <div className="w-14 h-14 bg-red-950/50 border border-red-900 flex items-center justify-center mx-auto mb-4">
                    <IconTrash />
                  </div>
                  <h2 className="font-display font-bold text-xl mb-2">Confirmar exclusão</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    {modal === "deleteMember"
                      ? "Tem certeza que deseja remover este aluno? Esta ação não pode ser desfeita."
                      : "Tem certeza que deseja remover este membro da equipe?"}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 border border-neutral-700 text-gray-400 hover:text-white py-2.5 text-sm transition-colors">Cancelar</button>
                    <button
                      onClick={modal === "deleteMember" ? deleteMember : deleteStaff}
                      className="flex-1 bg-red-700 hover:bg-red-600 py-2.5 text-sm font-medium transition-colors"
                    >
                      Sim, excluir
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}