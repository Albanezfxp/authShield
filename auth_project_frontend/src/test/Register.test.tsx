// src/test/Register.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/Register";
import { renderWithProviders } from "./test-utils/test-utils";

// 1. Criamos os Mocks das dependências externas antes dos testes
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../api", () => ({
  fetchRegister: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Importamos a função mockada para manipular os retornos nos blocos de teste
import { fetchRegister } from "../api";
import { toast } from "react-toastify";

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o formulário com todos os elementos iniciais", () => {
    renderWithProviders(<Register />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/senha/i)[0]).toBeInTheDocument(); // Campo Senha
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cadastrar/i }),
    ).toBeInTheDocument();
  });

  it("deve permitir a digitação nos campos do formulário", () => {
    renderWithProviders(<Register />);

    const nameInput = screen.getByPlaceholderText("Nome") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(
      "seu@email.com",
    ) as HTMLInputElement;

    // Dispara o handleInputChange
    fireEvent.change(nameInput, { target: { value: "Gabriel" } });
    fireEvent.change(emailInput, { target: { value: "gabriel@email.com" } });

    expect(nameInput.value).toBe("Gabriel");
    expect(emailInput.value).toBe("gabriel@email.com");
  });

  it("deve exibir erro se as senhas digitadas não coincidirem", async () => {
    renderWithProviders(<Register />);

    // Preenche os inputs com senhas diferentes para entrar no primeiro IF do handleSubmit
    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "Gabriel" },
    });
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "gabriel@email.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("••••••••")[0], {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("••••••••")[1], {
      target: { value: "senhaDiferente" },
    });

    const submitButton = screen.getByRole("button", { name: /cadastrar/i });
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("As senhas não coincidem!");
    // CORREÇÃO: Alterado de .not.toLocaleString() para o assinalador correto do vitest
    expect(fetchRegister).not.toHaveBeenCalled();
  });

  it("deve registrar a conta com sucesso e redirecionar para a página de login", async () => {
    vi.mocked(fetchRegister).mockResolvedValue({
      data: { success: true },
    } as unknown as Awaited<ReturnType<typeof fetchRegister>>);

    renderWithProviders(<Register />);

    // Preenche o formulário corretamente
    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "Gabriel" },
    });
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "gabriel@email.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("••••••••")[0], {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("••••••••")[1], {
      target: { value: "senha123" },
    });

    const submitButton = screen.getByRole("button", { name: /cadastrar/i });
    fireEvent.click(submitButton);

    // Como o fluxo envolve uma Promise assíncrona da API, aguardamos as respostas com o waitFor
    await waitFor(() => {
      expect(fetchRegister).toHaveBeenCalledWith({
        name: "Gabriel",
        email: "gabriel@email.com",
        password: "senha123",
        confirm_password: "senha123",
        role: "USER",
      });
      expect(toast.success).toHaveBeenCalledWith("Conta registrada!");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("deve exibir um toast de erro se a requisição da API falhar", async () => {
    vi.mocked(fetchRegister).mockRejectedValue(new Error("Erro interno"));

    renderWithProviders(<Register />);

    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "Gabriel" },
    });
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "gabriel@email.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("••••••••")[0], {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("••••••••")[1], {
      target: { value: "senha123" },
    });

    const submitButton = screen.getByRole("button", { name: /cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Falha ao registrar");
      expect(mockNavigate).not.toHaveBeenCalled(); // Não deve tentar mudar de página
    });
  });
});
