import { ROLES, inputCls, selectCls } from "../../../constants/AdminConstants";
import { IconX, IconUpload, IconSpinner } from "../../../icons/AdminIcons";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">{label}</label>
    {children}
  </div>
);

type StaffForm = {
  name: string; email: string; phone: string;
  role: string; specialty: string; status: "ativo" | "inativo";
};

interface StaffModalProps {
  mode: "addStaff" | "editStaff";
  form: StaffForm;
  onChange: (form: StaffForm) => void;
  fotoFile: File | null;
  fotoPreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFotoRemove: () => void;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function StaffModal({
  mode, form, onChange, fotoFile, fotoPreview,
  fileInputRef, onFotoChange, onFotoRemove,
  saving, onSave, onClose,
}: StaffModalProps) {
  const set = (partial: Partial<StaffForm>) => onChange({ ...form, ...partial });

  return (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
        <div>
          <div className="w-6 h-0.5 bg-red-600 mb-2" />
          <h2 className="font-display font-bold text-xl">{mode === "addStaff" ? "Adicionar Membro da Equipe" : "Editar Membro"}</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><IconX /></button>
      </div>

      <div className="p-6 space-y-4">
        {/* Foto */}
        <Field label="Foto do profissional">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFotoChange} />
          <div className="flex gap-4 items-start">
            <div className="w-20 h-20 flex-shrink-0 border border-neutral-700 overflow-hidden bg-neutral-900">
              {fotoPreview ? (
                <img src={fotoPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="upload-zone w-full px-4 py-3 flex items-center justify-center gap-2 text-sm text-gray-400">
                <IconUpload />
                {fotoFile ? fotoFile.name : mode === "editStaff" ? "Trocar foto" : "Escolher foto"}
              </button>
              <p className="text-gray-600 text-xs">JPG, PNG ou WEBP · máx. 5MB</p>
              {fotoFile && (
                <button type="button" onClick={onFotoRemove} className="text-red-500 text-xs hover:underline">
                  ✕ Remover seleção
                </button>
              )}
            </div>
          </div>
        </Field>

        <Field label="Nome completo">
          <input className={inputCls} value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Ex: Carlos Mendes" />
        </Field>
        <Field label="Cargo">
          <select className={selectCls} value={form.role} onChange={e => set({ role: e.target.value })}>
            {ROLES.map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input className={inputCls} type="email" value={form.email} onChange={e => set({ email: e.target.value })} placeholder="email@ctfoco.com" />
          </Field>
          <Field label="Telefone">
            <input className={inputCls} value={form.phone} onChange={e => set({ phone: e.target.value })} placeholder="(11) 99999-9999" />
          </Field>
        </div>
        <Field label="Status">
          <select className={selectCls} value={form.status} onChange={e => set({ status: e.target.value as "ativo" | "inativo" })}>
            <option value="ativo" className="bg-black">Ativo</option>
            <option value="inativo" className="bg-black">Inativo</option>
          </select>
        </Field>
      </div>

      <div className="flex gap-3 px-6 pb-6">
        <button onClick={onClose} className="flex-1 border border-neutral-700 text-gray-400 hover:text-white py-2.5 text-sm transition-colors">Cancelar</button>
        <button onClick={onSave} disabled={!form.name || !form.email || saving}
          className="btn-red flex-1 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {saving ? <><IconSpinner /> Salvando...</> : mode === "addStaff" ? "Adicionar à Equipe" : "Salvar Alterações"}
        </button>
      </div>
    </>
  );
}