import type React from "react";
import Header from "./Header";
import "../../styles/AuthLayout.css";
import { useNavigate } from "react-router-dom";

type AuthProps = {
  title: string;
  text: string;
  login: boolean;
  children: React.ReactNode;
};

export default function AuthLayout({
  title,
  text,
  login,
  children,
}: AuthProps) {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <Header
        login={false}
        completedTasks={null}
        setShowModal={undefined}
        totalTasks={null}
      />
      <section className="auth-section">
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <h1>{title}</h1>
              <p>{text}</p>
            </div>

            {children}

            <div className="divider">
              <span>{login ? "Não tem conta?" : "Já tem uma conta?"}</span>
            </div>

            <div className="btn-container">
              {login ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/register")}
                >
                  Criar nova conta
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/login")}
                >
                  Fazer login
                </button>
              )}
            </div>
          </div>

          <div className="loginIllustration">
            <div className="illustrationBox">
              <div className="illustrationItem item1"></div>
              <div className="illustrationItem item2"></div>
              <div className="illustrationItem item3"></div>
              <div className="illustrationText">
                <h3>Organize suas ideias</h3>
                <p>Gerencie seus projetos de forma simples e intuitiva</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
