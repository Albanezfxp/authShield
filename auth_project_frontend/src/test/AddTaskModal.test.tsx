// src/test/AddTaskModal.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AddTaskModal from "../components/modals/AddTaskModal";
import { renderWithProviders } from "./test-utils/test-utils";

describe("AddTaskModal", () => {
  const defaultProps = {
    setShowModal: vi.fn(),
    handleAddTask: vi.fn((e: any) => e.preventDefault()),
    newTask: {
      task_name: "",
      description: "",
    },
    setNewTask: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar modal corretamente", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
    expect(screen.getByLabelText("Título *")).toBeInTheDocument();
    expect(screen.getByText("Criar Tarefa")).toBeInTheDocument();
  });

  it("deve fechar modal ao clicar no botão fechar", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    fireEvent.click(screen.getByLabelText(/fechar modal/i));

    expect(defaultProps.setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve atualizar título", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    const input = screen.getByPlaceholderText("O que você precisa fazer?");

    fireEvent.change(input, { target: { value: "Nova task" } });

    expect(defaultProps.setNewTask).toHaveBeenCalled();
  });

  it("deve submeter formulário", () => {
    // Passamos uma prop com o título preenchido para o formulário ser válido
    const propsComTitulo = {
      ...defaultProps,
      newTask: {
        task_name: "Minha Nova Tarefa Valida",
        description: "Descrição opcional",
      },
    };

    renderWithProviders(<AddTaskModal {...propsComTitulo} />);

    // Agora o formulário está válido e vai permitir o disparo do evento onSubmit
    const submitButton = screen.getByRole("button", { name: /criar tarefa/i });
    fireEvent.click(submitButton);

    expect(propsComTitulo.handleAddTask).toHaveBeenCalled();
  });

  it("deve fechar ao clicar em cancelar", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    fireEvent.click(screen.getByText("Cancelar"));

    expect(defaultProps.setShowModal).toHaveBeenCalledWith(false);
  });
});
