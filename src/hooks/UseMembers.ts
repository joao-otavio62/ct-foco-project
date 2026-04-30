import { useState, useEffect } from "react";
import type MembersType from "../types/MembersType";
import api from "../api/axios";
import { calcAge } from "../Utils/Helpers";

export type MemberForm = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  height: number;
  modality: string;
  schedule: string;
  status: "ativo" | "inativo";
  paymentStatus: "pago" | "pendente";
  dataVencimento: string;
};

export const blankMemberForm: MemberForm = {
  name: "", email: "", phone: "", birthDate: "",
  height: 170, modality: "Funcional", schedule: "07:00",
  status: "ativo", paymentStatus: "pendente",
  dataVencimento: "",
};

export function useMembers() {
  const [members, setMembers] = useState<MembersType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get("/members");
        setMembers(
          data.map((m: any) => ({
            id:            String(m.id),
            name:          m.nome,
            email:         m.email,
            phone:         m.telefone,
            birthDate:     m.dataNascimento,
            age:           calcAge(m.dataNascimento),
            height:        m.altura,
            modality:      m.modalidade,
            schedule:      m.horario,
            status:        m.status ?? "ativo",
            paymentStatus: m.pagamento === "pago" ? "pago" : "pendente",
            paymentDate:   m.vencimento ? m.vencimento.slice(0, 10) : null,
            joinedAt:      m.dataEntrada ? m.dataEntrada.slice(0, 10) : "",
          }))
        );
      } catch (e) {
        console.error("Erro ao buscar alunos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  
  const saveMember = async (
    form: MemberForm,
    modal: "addMember" | "editMember",
    editTargetId?: string,
  ) => {
    const body = {
      nome:           form.name,
      email:          form.email,
      telefone:       form.phone,
      dataNascimento: form.birthDate,
      altura:         form.height,
      modalidade:     form.modality,
      horario:        form.schedule,
      pagamento:      form.paymentStatus,
      vencimento:     form.dataVencimento || null,
      status:         form.status,
    };

    if (modal === "addMember") {
      try {
        const { data } = await api.post("/members", body);
        const newMember: MembersType = {
          id:            String(data.id),
          name:          data.nome,
          email:         data.email,
          phone:         data.telefone,
          birthDate:     data.dataNascimento,
          age:           calcAge(data.dataNascimento),
          height:        data.altura,
          modality:      data.modalidade,
          schedule:      data.horario,
          status:        data.status ?? "ativo",
          paymentStatus: data.pagamento === "pago" ? "pago" : "pendente",
          paymentDate:   data.vencimento ? data.vencimento.slice(0, 10) : null,
          joinedAt:      data.dataEntrada ? data.dataEntrada.slice(0, 10) : "",
        };
        setMembers(prev => [newMember, ...prev]);
      } catch (error: any) {
        alert(`Erro ${error.response?.status}: ${JSON.stringify(error.response?.data ?? error.message)}`);
      }
      } else if (editTargetId) {
      try {
        await api.put(`/members/${editTargetId}`, body);
        setMembers(prev => prev.map(m =>
          m.id === editTargetId
            ? {
                ...m,
                name:          form.name,
                email:         form.email,
                phone:         form.phone,
                birthDate:     form.birthDate,
                age:           calcAge(form.birthDate),
                height:        form.height,
                modality:      form.modality,
                schedule:      form.schedule,
                status:        form.status,
                paymentStatus: form.paymentStatus,
                paymentDate:   form.dataVencimento ? form.dataVencimento : m.paymentDate,
              }
            : m
        ));
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

  return { members, setMembers, loading, saveMember, deleteMember };
}