import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  login: boolean;
  completedTasks: number | null;
  totalTasks: number | null;
  setShowModal?: (a: boolean) => void;
};

export default function Header({
  login,
  completedTasks,
  totalTasks,
  setShowModal,
}: HeaderProps) {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar">
        <div className="navContent">
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logoIcon">T</div>
            <span>TaskFlow</span>
          </div>
          {login ? (
            <div className="dashboard-actions">
              <div className="stats-badge">
                📊 {completedTasks} de {totalTasks} concluídas
              </div>
              <button
                className="add-task-btn"
                onClick={() => {
                  if (setShowModal) return setShowModal(true);
                }}
              >
                <Plus size={20} />
                Nova Tarefa
              </button>
            </div>
          ) : (
            <button className="loginBtn" onClick={handleLoginClick}>
              Entrar
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
