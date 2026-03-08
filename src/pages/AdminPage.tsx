import { useState } from "react";
import type { View, ModalType } from "../types/AdminTypes";
import type MembersType from "../types/MembersType";
import type TeamMember from "../types/TeamMembers";

// layout
import { Sidebar }  from "../componentes/admin/layout/Sidebar";
import { Header }   from "../componentes/admin/layout/Header";

// view
import { DashboardView }  from "../componentes/admin/dashboard/DashboardView";
import { MembersView }    from "../componentes/admin/members/MembersView";
import { NewMemberView }  from "../componentes/admin/members/NewMemberView";
import { StaffView }      from "../componentes/admin/staff/StaffVIew";

// ModalS
import { MemberModal } from "../componentes/admin/modals/MemberModal";
import {StaffModal} from "../componentes/admin/modals/StaffModal";
import { DeleteModal } from "../componentes/admin/modals/DeleteModal";

// HOOKS
import { useMembers } from "../hooks/UseMembers";
import { useStaff }   from "../hooks/UseStaff";

import "../assets/AdminPage.css";

const blankMemberForm = {
  name: "", email: "", phone: "", birthDate: "",
  height: 170, modality: "Funcional", schedule: "07:00",
  status: "ativo" as "ativo" | "inativo", paymentStatus: "pendente" as "pendente" | "pago",
};

export function AdminPage() {
  const [view, setView]           = useState<View>("dashboard");
  const [modal, setModal]         = useState<ModalType>(null);
  const [editTarget, setEditTarget] = useState<MembersType | TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [mForm, setMForm]         = useState(blankMemberForm);

  const {
    members, setMembers, loading: loadingMembers,
    saveMember, deleteMember, openEditForm: openEditMemberForm,
  } = useMembers();

  const {
    staff, loading: loadingStaff, saving: savingStaff, deleting: deletingStaff,
    sForm, setSForm, fotoFile, fotoPreview, fileInputRef,
    handleFotoChange, resetFoto,
    openAddForm: openAddStaffForm, openEditForm: openEditStaffForm,
    saveStaff, deleteStaff,
  } = useStaff();

  const closeModal = () => {
    setModal(null);
    setEditTarget(null);
    resetFoto();
  };

  //Member handlers
  const handleOpenAddMember = () => {
    setMForm(blankMemberForm);
    setEditTarget(null);
    setModal("addMember");
  };

  const handleOpenEditMember = (m: MembersType) => {
    openEditMemberForm(m);
    setMForm({ name: m.name, email: m.email, phone: m.phone, birthDate: m.birthDate, height: m.height, modality: m.modality, schedule: m.schedule, status: m.status, paymentStatus: m.paymentStatus ?? "pendente" });
    setEditTarget(m);
    setModal("editMember");
  };

  const handleSaveMember = async () => {
    await saveMember(
      modal as "addMember" | "editMember",
      (editTarget as MembersType)?.id,
    );
    closeModal();
  };

  const handleDeleteMember = async () => {
    if (deleteTarget) await deleteMember(deleteTarget);
    closeModal();
  };

  // staff handlers
  const handleOpenAddStaff = () => {
    openAddStaffForm();
    setEditTarget(null);
    setModal("addStaff");
  };

  const handleOpenEditStaff = (s: TeamMember) => {
    openEditStaffForm(s);
    setEditTarget(s);
    setModal("editStaff");
  };

  const handleSaveStaff = async () => {
    await saveStaff(
      modal as "addStaff" | "editStaff",
      (editTarget as TeamMember)?.id,
    );
    closeModal();
  };

  const handleDeleteStaff = async () => {
    if (deleteTarget) await deleteStaff(deleteTarget);
    closeModal();
  };

  // render
  return (
    <div className="min-h-screen bg-black text-white flex" style={{ fontFamily: "'Barlow', sans-serif" }}>

      <Sidebar view={view} onNavigate={(v) => setView(v)} />

      <main className="ml-64 flex-1 min-h-screen">
        <Header
          view={view}
          onAddMember={handleOpenAddMember}
          onAddStaff={handleOpenAddStaff}
        />

        <div className="">
          {view === "dashboard" && (
            <DashboardView
              members={members}
              staff={staff}
              loadingMembers={loadingMembers}
              loadingStaff={loadingStaff}
            />
          )}

          {view === "new_member" && (
            <NewMemberView onCreated={(m) => setMembers(prev => [m, ...prev])} />
          )}

          {view === "members" && (
            <MembersView
              members={members}
              loading={loadingMembers}
              onEdit={handleOpenEditMember}
              onDelete={(id) => { setDeleteTarget(id); setModal("deleteMember"); }}
            />
          )}

          {view === "staff" && (
            <StaffView
              staff={staff}
              loading={loadingStaff}
              onEdit={handleOpenEditStaff}
              onDelete={(id) => { setDeleteTarget(id); setModal("deleteStaff"); }}
            />
          )}
        </div>
      </main>

      {/*Modais*/}
      {modal && (
        <div
          className="modal-bg fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="modal-box bg-neutral-950 border border-neutral-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {(modal === "addMember" || modal === "editMember") && (
              <MemberModal
                mode={modal}
                form={mForm}
                onChange={setMForm}
                onSave={handleSaveMember}
                onClose={closeModal}
              />
            )}

            {(modal === "addStaff" || modal === "editStaff") && (
              <StaffModal
                mode={modal}
                form={sForm}
                onChange={(form) => setSForm(form as typeof sForm)}
                fotoFile={fotoFile}
                fotoPreview={fotoPreview}
                fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
                onFotoChange={handleFotoChange}
                onFotoRemove={() => resetFoto(modal === "editStaff" ? (editTarget as TeamMember)?.fotoUrl : "")}
                saving={savingStaff}
                onSave={handleSaveStaff}
                onClose={closeModal}
              />
            )}

            {(modal === "deleteMember" || modal === "deleteStaff") && (
              <DeleteModal
                type={modal}
                deleting={deletingStaff}
                onConfirm={modal === "deleteMember" ? handleDeleteMember : handleDeleteStaff}
                onClose={closeModal}
              />
            )}

          </div>
        </div>
      )}
    </div>
  );
}