import { useEffect, useState, type DragEvent, type FormEvent } from "react";
import { Trash2, Circle, Loader } from "lucide-react";
import "../styles/Dashboard.css";
import { Situation } from "../types/enums/situation.enum";
import { jwtDecode } from "jwt-decode";
import {
  fetchAddTask,
  fetchTasks,
  fetchUpdateTask,
  fetchDeleteTask,
  fetchRefresh,
  fetchTasksByUser,
} from "../api";
import { toast } from "react-toastify";
import Header from "../components/_shared_/Header";
import { useAuth } from "../commons/hooks/useAuth";
import type { Task } from "../types/interfaces/taks.interface";
import type { TaskColumn } from "../types/interfaces/task_colum.interface";
import type { TasksByColumn } from "../types/type/task_by_colum.type";
import type { DraggedTask } from "../types/interfaces/dragged_task.interface";
import type { JwtPayload } from "../types/type/jwt_payload.type";
import type { ColumnId } from "../types/type/colum_id.type";
import AddTaskModal from "../components/modals/AddTaskModal";

const COLUMNS: TaskColumn[] = [
  { id: "to-do", title: "A Fazer", icon: "○" },
  { id: "in-progress", title: "Em Progresso", icon: "●" },
  { id: "done", title: "Concluído", icon: "✓" },
];

const emptyTasks: TasksByColumn = {
  "to-do": [],
  "in-progress": [],
  done: [],
};

const organizeTasks = (tasksArray: Task[]): TasksByColumn => {
  return {
    "to-do": tasksArray.filter((t) => t.situation === Situation.TO_DO),
    "in-progress": tasksArray.filter(
      (t) => t.situation === Situation.IN_PROGRESS,
    ),
    done: tasksArray.filter((t) => t.situation === Situation.DONE),
  };
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<TasksByColumn>(emptyTasks);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);
  const [decoded_token, setDecodedToken] = useState<JwtPayload>();

  const [newTask, setNewTask] = useState({
    task_name: "",
    description: "",
  });

  const { access_token, setAccess_token } = useAuth();
  const totalTasks = Object.values(tasks).reduce(
    (acc, col) => acc + col.length,
    0,
  );
  const completedTasks = tasks["done"].length;
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        let jwt_token = access_token;

        if (!jwt_token) {
          const response = await fetchRefresh().catch((err) => {
            if (err.response?.status === 401) return null;
            throw err;
          });

          if (!response) {
            setAccess_token(null);
            return;
          }

          jwt_token = response.data.access_token;
          setAccess_token(jwt_token);
        }

        if (jwt_token) {
          const decoded = jwtDecode<JwtPayload>(jwt_token);
          setDecodedToken(decoded); // Seta antes de carregar tasks
        }
      } catch (error) {
        console.error("Erro ao carregar credenciais:", error);
        setAccess_token(null);
      }
    };

    loadCredentials();
  }, []);
  useEffect(() => {
    if (!decoded_token?.sub || !access_token) return;

    const loadTasks = async () => {
      setLoading(true);
      try {
        const response = await fetchTasksByUser(
          Number(decoded_token.sub),
          access_token,
        );
        const organized = organizeTasks(response.data);
        setTasks(organized);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        toast.error("Erro ao carregar tarefas");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [decoded_token, access_token]);
  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTask.task_name.trim()) {
      toast.warning("Título é obrigatório");
      return;
    }

    if (!decoded_token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const payload = {
        task_name: newTask.task_name,
        description: newTask.description,
        userId: decoded_token.sub,
      };

      const response = await fetchAddTask(payload, access_token);

      const newTaskData: Task = {
        id: response.data.id,
        task_name: response.data.task_name,
        description: response.data.description,
        situation: Situation.TO_DO,
      };

      setTasks((prev) => ({
        ...prev,
        "to-do": [...prev["to-do"], newTaskData],
      }));

      toast.success("Tarefa criada!");

      setNewTask({
        task_name: "",
        description: "",
      });

      setShowModal(false);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao criar tarefa");
    }
  };

  const handleDeleteTask = async (taskId: string, columnId: ColumnId) => {
    try {
      setTasks((prev) => ({
        ...prev,
        [columnId]: prev[columnId].filter((task) => task.id !== taskId),
      }));

      await fetchDeleteTask(taskId, access_token);
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar tarefa");

      const loadTasks = async () => {
        try {
          const response = await fetchTasks(access_token);
          const organized = organizeTasks(response.data);
          setTasks(organized);
        } catch (error) {
          console.error("Erro ao recarregar tarefas:", error);
        }
      };

      loadTasks();
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    task: Task,
    columnId: ColumnId,
  ) => {
    setDraggedTask({ task, sourceColumn: columnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    targetColumnId: ColumnId,
  ) => {
    e.preventDefault();

    if (!draggedTask) return;

    const { task, sourceColumn } = draggedTask;

    if (sourceColumn === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    if (!task.id || !access_token) {
      toast.error("Dados incompletos");
      setDraggedTask(null);
      return;
    }

    setTasks((prev) => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter((t) => t.id !== task.id),
      [targetColumnId]: [
        ...prev[targetColumnId],
        { ...task, situation: targetColumnId },
      ],
    }));

    setUpdatingTaskId(task.id);

    try {
      const newSituation =
        targetColumnId === "to-do"
          ? Situation.TO_DO
          : targetColumnId === "in-progress"
          ? Situation.IN_PROGRESS
          : Situation.DONE;

      await fetchUpdateTask(task.id, { situation: newSituation }, access_token);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      toast.error("Erro ao mover tarefa");

      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: [...prev[sourceColumn], task],
        [targetColumnId]: prev[targetColumnId].filter((t) => t.id !== task.id),
      }));
    } finally {
      setUpdatingTaskId(null);
    }

    setDraggedTask(null);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Loader size={40} className="animate-spin" />
            <p style={{ marginTop: "20px" }}>Carregando tarefas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header
        login={true}
        completedTasks={completedTasks}
        setShowModal={setShowModal}
        totalTasks={totalTasks}
      />

      <div className="dashboard-content">
        <div className="kanban-board">
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="column-header">
                <h2 className="column-title">{column.title}</h2>
                <div className="column-count">
                  {tasks[column.id]?.length || 0}
                </div>
              </div>

              <div className="tasks-container">
                {tasks[column.id] && tasks[column.id].length > 0 ? (
                  tasks[column.id].map((task) => (
                    <div
                      key={task.id}
                      className="task-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task, column.id)}
                      style={{
                        opacity: updatingTaskId === task.id ? 0.6 : 1,
                        pointerEvents:
                          updatingTaskId === task.id ? "none" : "auto",
                      }}
                    >
                      <div className="task-title">{task.task_name}</div>

                      {task.description && (
                        <div className="task-description">
                          {task.description}
                        </div>
                      )}

                      <div className="task-footer">
                        <div className="task-actions">
                          {updatingTaskId === task.id && (
                            <Loader
                              size={16}
                              style={{ animation: "spin 1s linear infinite" }}
                            />
                          )}
                          <button
                            className="task-btn"
                            onClick={() => handleDeleteTask(task.id, column.id)}
                            disabled={updatingTaskId === task.id}
                            title="Deletar tarefa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Circle size={32} strokeWidth={1} />
                    <p>Nenhuma tarefa aqui</p>
                    <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      Arraste tarefas ou crie uma nova
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <AddTaskModal
          setShowModal={setShowModal}
          handleAddTask={handleAddTask}
          newTask={newTask}
          setNewTask={setNewTask}
        />
      )}
    </div>
  );
}
