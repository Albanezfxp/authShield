import { Plus } from "lucide-react";
import type { ChangeEvent } from "react";
import type { AddTaskModalProps } from "../../types/interfaces/add_task_modal_props.interface";

export default function AddTaskModal({
  setShowModal,
  handleAddTask,
  newTask,
  setNewTask,
}: Readonly<AddTaskModalProps>) {
  const handleOverlayClick = () => setShowModal(false);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleCloseKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      setShowModal(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className="modal" onClick={handleModalClick} role="dialog">
        <button
          className="close-btn"
          onClick={() => setShowModal(false)}
          onKeyDown={handleCloseKeyDown}
          aria-label="Fechar modal"
        >
          ✕
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
              onClick={() => setShowModal(false)}
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
    </div>
  );
}
