import type TeamMember from "../types/TeamMembers";

export const genId = () => Math.random().toString(36).slice(2, 9);

export const calcAge = (birthDate: string) => {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

export const mapStaff = (s: any): TeamMember => ({
  id: String(s.id),
  name: s.nome,
  role: s.cargo,
  email: s.email,
  phone: s.telefone,
  specialty: s.especialidade,
  status: s.status === true || s.status === "ativo" ? "ativo" : "inativo",
  fotoUrl: s.fotoUrl ?? "",
  paymentStatus: s.paymentStatus === "paid" ? "pago" : "pendente",
});