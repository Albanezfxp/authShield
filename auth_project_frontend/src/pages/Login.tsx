import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../api";
import { toast } from "react-toastify";
import type { loginRequest } from "../types/interfaces/login_request.interface";
import AuthLayout from "../components/_shared_/AuthLayout";
import { useAuth } from "../commons/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState<loginRequest>({
    email: "",
    password: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      const response = await fetchLogin(payload);
      console.log("TOKEN:", response.data.access_token);

      if (!response.data?.access_token) {
        throw new Error("Credenciais inválidas");
      }

      toast.success("Login feito!");

      auth.setAccess_token(response.data.access_token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Credenciais inválidas!");
    }
  };

  return (
    <>
      <AuthLayout
        title={"Bem-vindo de volta"}
        text={"Faça login para acessar suas tarefas"}
        login={true}
        children={
          <form onSubmit={handleSubmit} className="loginForm">
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={formData?.email || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData?.password || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="formFooter">
              <label className="rememberMe">
                <input type="checkbox" />
                <span>Lembrar-me</span>
              </label>
              <a href="#" className="forgotPassword">
                Esqueci a senha
              </a>
            </div>

            <button type="submit" className="submitBtn">
              Entrar
            </button>
          </form>
        }
      />
    </>
  );
}
