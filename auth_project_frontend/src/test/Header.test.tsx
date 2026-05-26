import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import Header from "../components/_shared_/Header";
import { renderWithProviders } from "./test-utils/test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Header", () => {
  const mockSetShowModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar botão de login quando não autenticado", () => {
    renderWithProviders(
      <Header login={false} completedTasks={null} totalTasks={null} />,
    );

    expect(screen.getByText("TaskFlow")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("deve redirecionar ao clicar no botão entrar", () => {
    renderWithProviders(
      <Header login={false} completedTasks={null} totalTasks={null} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("deve exibir badge de progresso e botão de nova tarefa se logado", () => {
    renderWithProviders(
      <Header
        login={true}
        completedTasks={4}
        totalTasks={10}
        setShowModal={mockSetShowModal}
      />,
    );

    expect(screen.getByText(/4 de 10 concluídas/i)).toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: /nova tarefa/i });
    fireEvent.click(addButton);

    expect(mockSetShowModal).toHaveBeenCalledWith(true);
  });

  it("deve navegar para a home ao clicar na logo", () => {
    renderWithProviders(
      <Header login={false} completedTasks={null} totalTasks={null} />,
    );

    fireEvent.click(screen.getByText("TaskFlow"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
