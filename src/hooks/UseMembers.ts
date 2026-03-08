import { useState, useEffect } from "react";
import type MembersType from "../types/MembersType";
import api from "../api/axios";
import { calcAge, genId } from "../Utils/Helpers";

const blankMember = {
  name: "", email: "", phone: "", birthDate: "",
  height: 170, modality: "Funcional", schedule: "07:00",
  status: "ativo" as const, paymentStatus: "pendente" as const,
};

export function useMembers() {
  const [members, setMembers] = useState<MembersType[]>([]);
  const [loading, setLoading] = useState(true);
  const [mForm, setMForm] = useState<typeof blankMember>(blankMember);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/members");
        setMembers(
          data.map((m: any) => ({
            id: m.id,
            name: m.nome,
            email: m.email,
            phone: m.telefone,
            birthDate: m.dataNascimento,
            age: calcAge(m.dataNascimento),
            height: m.altura,
            modality: m.modalidade,
            schedule: String(m.horario).padStart(2, "0") + ":00",
            status: "ativo" as const,
            paymentStatus: m.pagamento === "pago" ? "pago" : "pendente",
            joinedAt: m.dataEntrada,
          }))
        );
      } catch (e) {
        console.error("Erro ao buscar alunos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const saveMember = async (modal: "addMember" | "editMember", editTargetId?: string) => {
    const age = calcAge(mForm.birthDate);

    if (modal === "addMember") {
      const newMember = { ...mForm, id: genId(), age, joinedAt: new Date().toISOString().slice(0, 10) };
      setMembers(prev => [newMember, ...prev]);
      try {
        await api.post("/members", {
          nome: mForm.name, email: mForm.email, telefone: mForm.phone,
          dataNascimento: mForm.birthDate, altura: mForm.height,
          modalidade: mForm.modality, horario: parseInt(mForm.schedule.split(":")[0], 10),
          dataEntrada: new Date().toISOString().slice(0, 10),
          pagamento: mForm.paymentStatus === "pendente" ? "pendente" : "pago",
        });
      } catch (e) {
        console.error("Erro ao criar membro:", e);
      }
    } else if (editTargetId) {
      setMembers(prev => prev.map(m => m.id === editTargetId ? { ...m, ...mForm, age } : m));
      try {
        await api.put(`/members/${editTargetId}`, {
          nome: mForm.name, email: mForm.email, telefone: mForm.phone,
          dataNascimento: mForm.birthDate, altura: mForm.height,
          modalidade: mForm.modality, horario: parseInt(mForm.schedule.split(":")[0], 10),
          status: mForm.status, pagamento: mForm.paymentStatus === "pendente" ? "pendente" : "pago",
        });
      } catch (error: any) {
        alert(`Erro ${error.response?.status}: ${JSON.stringify(error.response?.data ?? error.message)}`);
      }
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await api.delete(`/members/${id}`);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (error: any) {
      alert(`Erro ${error.response?.status}: ${JSON.stringify(error.response?.data ?? error.message)}`);
    }
  };

  const resetForm = () => setMForm(blankMember);

  const openEditForm = (m: MembersType) =>
    setMForm({ name: m.name, email: m.email, phone: m.phone, birthDate: m.birthDate, height: m.height, modality: m.modality, schedule: m.schedule, status: m.status, paymentStatus: m.paymentStatus ?? "pendente" });

  return { members, setMembers, loading, mForm, setMForm, saveMember, deleteMember, resetForm, openEditForm, blankMember };
}