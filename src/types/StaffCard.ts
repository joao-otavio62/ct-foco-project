interface StaffCard {
  id: string;
  name: string;
  role: string;
  specialty: string;
  fotoUrl: string;
  bio?: string;
}

export type { StaffCard };
export default StaffCard;