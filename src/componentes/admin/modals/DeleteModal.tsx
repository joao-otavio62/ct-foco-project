import { IconSpinner } from "../../../icons/AdminIcons";

interface DeleteModalProps {
  type: "deleteMember" | "deleteStaff";
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteModal({ type, deleting, onConfirm, onClose }: DeleteModalProps) {
  return (
    <div className="p-6 text-center">
      <h2 className="font-display font-bold text-xl mb-2">Confirmar exclusão</h2>
      <p className="text-gray-400 text-sm mb-6">
        {type === "deleteMember"
          ? "Tem certeza que deseja remover este aluno? Esta ação não pode ser desfeita."
          : "Tem certeza que deseja remover este membro? A foto também será deletada do servidor."}
      </p>
      <div className="flex gap-3">
        <button onClick={onClose}
          className="cursor-pointer flex-1 border border-neutral-700 text-gray-400 hover:text-white py-2.5 text-sm transition-colors">
          Cancelar
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="cursor-pointer flex-1 bg-red-700 hover:bg-red-600 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
          {deleting ? <><IconSpinner /> Excluindo...</> : "Sim, excluir"}
        </button>
      </div>
    </div>
  );
}