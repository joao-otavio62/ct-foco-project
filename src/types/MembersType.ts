interface MembersType {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  age: number;
  height: number;
  modality: string;
  schedule: string;
  status: string;
  joinedAt: string;
  paymentStatus: string;
  paymentDate: string | null;
}

export type { MembersType };
export default MembersType;