import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  readonly login: boolean;
  readonly completedTasks: number | null;
  readonly totalTasks: number | null;
  readonly setShowModal?: (a: boolean) => void;
};

export default function Header({
  login,
  completedTasks,
  totalTasks,
  setShowModal,
}: Readonly<HeaderProps>) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogoKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      handleLogoClick();
    }
  };

  return (
    <nav className="navbar">
      <div className="navContent">
        <button
          className="logo"
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          aria-label="Ir para página inicial"
        >
          <div className="logoIcon">T</div>
          <span>TaskFlow</span>
        </button>

        {login ? (
          <div className="dashboard-actions">
            <div className="stats-badge">
              📊 {completedTasks} de {totalTasks} concluídas
            </div>
            <button
              className="add-task-btn"
              onClick={() => {
                if (setShowModal) {
                  setShowModal(true);
                }
              }}
              aria-label="Adicionar nova tarefa"
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
  );
}
