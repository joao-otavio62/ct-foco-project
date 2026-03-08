import { useState, useEffect } from "react";
import api from "../api/axios";
import type StaffCard from "../types/StaffCard";

const mapStaff = (s: any): StaffCard => ({
  id: String(s.id),
  name: s.nome,
  role: s.cargo,
  specialty: s.especialidade,
  fotoUrl: s.fotoUrl ?? "",
  bio: s.especialidade,
});

export function useTeam() {
  const [teamMembers, setTeamMembers] = useState<StaffCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await api.get("/staffmembers");
        const ativos = data
          .filter((s: any) => s.status === true || s.status === "ativo")
          .map(mapStaff);
        setTeamMembers(ativos);
      } catch (err) {
        console.error("Erro ao buscar equipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return { teamMembers, loading };
}