export type View = "dashboard" | "members" | "new_member" | "staff";

export type ModalType =
  | "addMember"
  | "editMember"
  | "addStaff"
  | "editStaff"
  | "deleteMember"
  | "deleteStaff"
  | null;