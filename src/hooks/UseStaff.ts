import { useState, useEffect, useRef } from "react";
import type TeamMember from "../types/TeamMembers";
import api from "../api/axios";
import { mapStaff } from "../Utils/Helpers";

const blankStaff = {
  name: "", email: "", phone: "",
  role: "Instrutor(a) de Funcional",
  specialty: "Funcional",
  status: "ativo" as const,
};

export function useStaff() {
  const [staff, setStaff] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [sForm, setSForm] = useState<typeof blankStaff>(blankStaff);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/staffmembers");
        setStaff(data.map(mapStaff));
      } catch (e) {
        console.error("Erro ao buscar equipe:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const resetFoto = (fallback = "") => {
    setFotoFile(null);
    setFotoPreview(fallback);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const openAddForm = () => {
    setSForm(blankStaff);
    resetFoto();
  };

  const openEditForm = (s: TeamMember) => {
    setSForm({ name: s.name, email: s.email, phone: s.phone, role: s.role, specialty: s.specialty, status: s.status });
    resetFoto(s.fotoUrl);
  };

  const saveStaff = async (modal: "addStaff" | "editStaff", editTargetId?: string) => {
    if (!sForm.name || !sForm.email) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("nome", sForm.name);
      fd.append("cargo", sForm.role);
      fd.append("email", sForm.email);
      fd.append("telefone", sForm.phone);
      fd.append("especialidade", sForm.specialty);
      fd.append("status", sForm.status === "ativo" ? "true" : "false");
      if (fotoFile) fd.append("foto", fotoFile);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (modal === "addStaff") {
        const { data } = await api.post("/staffmembers", fd, config);
        setStaff(prev => [mapStaff(data), ...prev]);
      } else if (editTargetId) {
        const { data } = await api.put(`/staffmembers/${editTargetId}`, fd, config);
        setStaff(prev => prev.map(s => s.id === editTargetId ? mapStaff(data) : s));
      }
      resetFoto();
    } catch (error: any) {
      alert(`Erro ao salvar: ${JSON.stringify(error.response?.data ?? error.message)}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteStaff = async (id: string) => {
    setDeleting(true);
    try {
      await api.delete(`/staffmembers/${id}`);
      setStaff(prev => prev.filter(s => s.id !== id));
    } catch (error: any) {
      alert(`Erro ao excluir: ${JSON.stringify(error.response?.data ?? error.message)}`);
    } finally {
      setDeleting(false);
    }
  };

  return {
    staff, loading, saving, deleting,
    sForm, setSForm,
    fotoFile, fotoPreview, fileInputRef,
    handleFotoChange, resetFoto,
    openAddForm, openEditForm,
    saveStaff, deleteStaff,
  };
}