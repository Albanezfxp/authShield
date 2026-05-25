import { Plus, X } from "lucide-react";
import { useRef, useEffect, type ChangeEvent } from "react";
import type { AddTaskModalProps } from "../../types/interfaces/add_task_modal_props.interface";

export default function AddTaskModal({
  setShowModal,
  handleAddTask,
  newTask,
  setNewTask,
}: Readonly<AddTaskModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    return () => {
      if (dialogRef.current?.open) {
        dialogRef.current.close();
      }
    };
  }, []);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setShowModal(false);
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Fecha modal apenas se clicar fora do conteúdo
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal-overlay"
      onClick={handleDialogClick}
      onClose={() => setShowModal(false)}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={handleClose}
          aria-label="Fechar modal"
          type="button"
        >
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2>Nova Tarefa</h2>
        </div>

        <form onSubmit={handleAddTask}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="task-title">Título *</label>
              <input
                id="task-title"
                type="text"
                placeholder="O que você precisa fazer?"
                value={newTask.task_name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewTask({ ...newTask, task_name: e.target.value })
                }
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-description">Descrição</label>
              <textarea
                id="task-description"
                placeholder="Adicione mais detalhes"
                value={newTask.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={18} />
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
