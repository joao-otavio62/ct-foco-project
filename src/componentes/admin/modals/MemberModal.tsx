import type MembersType from "../../../types/MembersType";
import { MODALITIES, SCHEDULES, inputCls, selectCls } from "../../../constants/adminConstants";
import { IconX } from "../../../icons/AdminIcons";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">{label}</label>
    {children}
  </div>
);

type MemberForm = {
  name: string; email: string; phone: string; birthDate: string;
  height: number; modality: string; schedule: string;
  status: "ativo" | "inativo"; paymentStatus: "pago" | "pendente";
};

interface MemberModalProps {
  mode: "addMember" | "editMember";
  form: MemberForm;
  onChange: (form: MemberForm) => void;
  onSave: () => void;
  onClose: () => void;
}

export function MemberModal({ mode, form, onChange, onSave, onClose }: MemberModalProps) {
  const set = (partial: Partial<MemberForm>) => onChange({ ...form, ...partial });

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <div>
          <div className="w-6 h-0.5 bg-red-600 mb-2" />
          <h2 className="font-display font-bold text-xl">{mode === "addMember" ? "Cadastrar Novo Aluno" : "Editar Aluno"}</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><IconX /></button>
      </div>

      <div className="p-6 space-y-4">
        <Field label="Nome completo">
          <input className={inputCls} value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Ex: João da Silva" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input className={inputCls} type="email" value={form.email} onChange={e => set({ email: e.target.value })} placeholder="email@exemplo.com" />
          </Field>
          <Field label="Telefone">
            <input className={inputCls} value={form.phone} onChange={e => set({ phone: e.target.value })} placeholder="(11) 99999-9999" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data de Nascimento">
            <input className={inputCls} type="date" value={form.birthDate} onChange={e => set({ birthDate: e.target.value })} />
          </Field>
          <Field label="Altura (cm)">
            <input className={inputCls} type="number" min={100} max={250} value={form.height} onChange={e => set({ height: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Modalidade">
            <select className={selectCls} value={form.modality} onChange={e => set({ modality: e.target.value })}>
              {MODALITIES.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
            </select>
          </Field>
          <Field label="Horário">
            <select className={selectCls} value={form.schedule} onChange={e => set({ schedule: e.target.value })}>
              {SCHEDULES.map(h => <option key={h} value={h} className="bg-black">{h}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Status">
          <select className={selectCls} value={form.status} onChange={e => set({ status: e.target.value as "ativo" | "inativo" })}>
            <option value="ativo" className="bg-black">Ativo</option>
            <option value="inativo" className="bg-black">Inativo</option>
          </select>
        </Field>
        <Field label="Pagamento">
          <select className={selectCls} value={form.paymentStatus} onChange={e => set({ paymentStatus: e.target.value as "pago" | "pendente" })}>
            <option value="pago" className="bg-black">Pago</option>
            <option value="pendente" className="bg-black">Pendente</option>
          </select>
        </Field>
      </div>

      <div className="flex gap-3 px-6 pb-6">
        <button onClick={onClose} className="flex-1 border border-neutral-700 text-gray-400 hover:text-white py-2.5 text-sm transition-colors">Cancelar</button>
        <button onClick={onSave} disabled={!form.name || !form.email || !form.birthDate}
          className="btn-red flex-1 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed">
          {mode === "addMember" ? "Cadastrar Aluno" : "Salvar Alterações"}
        </button>
      </div>
    </>
  );
}