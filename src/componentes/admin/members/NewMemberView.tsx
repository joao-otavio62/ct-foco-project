import { useState } from "react";
import type MembersType from "../../../types/MembersType";
import { calcAge } from "../../../Utils/Helpers";
import { MODALITIES, SCHEDULES, inputCls, selectCls } from "../../../constants/AdminConstants";
import { IconPlus } from "../../../icons/AdminIcons";
import api from "../../../api/axios";

const blank = {
  name: "", email: "", phone: "", birthDate: "",
  height: 170, modality: "Funcional", schedule: "07:00", status: "ativo" as const,
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">{label}</label>
    {children}
  </div>
);

interface NewMemberViewProps {
  onCreated: (m: MembersType) => void;
}

export function NewMemberView({ onCreated }: NewMemberViewProps) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())  errs.name = "Nome é obrigatório";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido";
    if (!form.phone.trim()) errs.phone = "Telefone é obrigatório";
    if (!form.birthDate)    errs.birthDate = "Data de nascimento é obrigatória";
    if (!form.height || form.height < 100 || form.height > 250) errs.height = "Altura inválida (100–250 cm)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      const { data } = await api.post("/members", {
        nome: form.name, email: form.email, telefone: form.phone,
        dataNascimento: form.birthDate, altura: form.height,
        modalidade: form.modality, horario: parseInt(form.schedule.split(":")[0], 10),
        dataEntrada: new Date().toISOString().slice(0, 10),
      });
      onCreated({
        id: data.id, name: data.nome, email: data.email, phone: data.telefone,
        birthDate: data.dataNascimento, age: calcAge(data.dataNascimento),
        height: data.altura, modality: data.modalidade,
        schedule: String(data.horario).padStart(2, "0") + ":00",
        status: "ativo", joinedAt: data.dataEntrada, paymentStatus: "pendente",
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setForm(blank); setErrors({}); }, 2500);
    } catch (error: any) {
      alert(`Erro ${error.response?.status}: ${JSON.stringify(error.response?.data ?? error.message)}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {success && (
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
        <div className="px-8 py-6 border-b border-neutral-800">
          <div className="w-8 h-0.5 bg-red-600 mb-3" />
          <h2 className="font-display font-black text-2xl text-white">Dados do Novo Aluno</h2>
          <p className="text-gray-500 text-sm mt-1">Preencha todos os campos obrigatórios para realizar o cadastro.</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Pessoal */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-red-600 font-medium mb-4">Dados Pessoais</p>
            <div className="space-y-4">
              <Field label="Nome completo *">
                <input className={inputCls + (errors.name ? " border-red-700" : "")} value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
                  placeholder="Ex: João da Silva" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email *">
                  <input className={inputCls + (errors.email ? " border-red-700" : "")} type="email" value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: "" })); }}
                    placeholder="email@exemplo.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </Field>
                <Field label="Telefone *">
                  <input className={inputCls + (errors.phone ? " border-red-700" : "")} value={form.phone}
                    onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: "" })); }}
                    placeholder="(11) 99999-9999" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data de Nascimento *">
                  <input className={inputCls + (errors.birthDate ? " border-red-700" : "")} type="date" value={form.birthDate}
                    onChange={e => { setForm(f => ({ ...f, birthDate: e.target.value })); setErrors(er => ({ ...er, birthDate: "" })); }} />
                  {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                  {form.birthDate && !errors.birthDate && <p className="text-gray-500 text-xs mt-1">Idade: {calcAge(form.birthDate)} anos</p>}
                </Field>
                <Field label="Altura (cm) *">
                  <input className={inputCls + (errors.height ? " border-red-700" : "")} type="number" min={100} max={250} value={form.height}
                    onChange={e => { setForm(f => ({ ...f, height: Number(e.target.value) })); setErrors(er => ({ ...er, height: "" })); }} />
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
                </Field>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800" />

          {/* Treino */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-red-600 font-medium mb-4">Dados de Treino</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Modalidade">
                <select className={selectCls} value={form.modality} onChange={e => setForm(f => ({ ...f, modality: e.target.value }))}>
                  {MODALITIES.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                </select>
              </Field>
              <Field label="Horário">
                <select className={selectCls} value={form.schedule} onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}>
                  {SCHEDULES.map(h => <option key={h} value={h} className="bg-black">{h}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Preview */}
          {form.name && (
            <div className="border border-neutral-700 bg-neutral-900 p-4">
              <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Pré-visualização</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-950 border border-red-800 flex items-center justify-center text-red-400 font-display font-black text-xl">
                  {form.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{form.name}</p>
                  <p className="text-gray-500 text-xs">{form.modality} · {form.schedule}{form.birthDate && ` · ${calcAge(form.birthDate)} anos`}{form.height && ` · ${form.height}cm`}</p>
                  <p className="text-gray-600 text-xs">{form.email}{form.phone && ` · ${form.phone}`}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 flex gap-3">
          <button onClick={() => { setForm(blank); setErrors({}); }}
            className="border border-neutral-700 text-gray-400 hover:text-white px-6 py-3 text-sm transition-colors">Limpar</button>
          <button onClick={submit}
            className="btn-red flex-1 py-3 text-sm font-medium tracking-wide flex items-center justify-center gap-2">
            <IconPlus /> Cadastrar Aluno
          </button>
        </div>
      </div>
    </div>
  );
}