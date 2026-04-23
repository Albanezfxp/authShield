import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar">
        <div className="navContent">
          <div className="logo">
            <div className="logoIcon">T</div>
            <span>TaskFlow</span>
          </div>
          <button className="loginBtn" onClick={handleLoginClick}>
            Entrar
            <ArrowRight size={18} />
          </button>
        </div>
      </nav>
    </>
  );
}
