import { useState } from "react";
import AuthLayout from "../components/_shared_/AuthLayout";
import type { RegisterRequest } from "../types/interfaces/register_request";
import { fetchRegister } from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    confirm_password: "",
    name: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: RegisterRequest) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password.trim(),
        confirm_password: formData.confirm_password.trim(),
        name: formData.name.trim(),
        role: "USER",
      };

      const response = await fetchRegister(payload);

      if (response) {
        toast.success("Conta registrada!");
        navigate("/login");
      }
    } catch {
      toast.error("Falha ao registrar");
    }
  };

  return (
    <AuthLayout
      text="Faça o registro e organize suas tarefas"
      title="Dificuldades para organizar tarefas?"
      login={false}
    >
      <form onSubmit={handleSubmit} className="loginForm">
        <div className="formGroup">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nome"
            value={formData?.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>
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
        <div className="formGroup">
          <label htmlFor="confirm_password">Confirmar senha</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            placeholder="••••••••"
            value={formData?.confirm_password || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submitBtn">
          Cadastrar
        </button>
      </form>
    </AuthLayout>
  );
}
