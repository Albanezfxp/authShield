// src/test/AddTaskModal.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AddTaskModal from "../components/modals/AddTaskModal";
import { renderWithProviders } from "./test-utils/test-utils";

describe("AddTaskModal", () => {
  const defaultProps = {
    setShowModal: vi.fn(),
    handleAddTask: vi.fn((e) => e.preventDefault()),
    newTask: { task_name: "", description: "" },
    setNewTask: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar modal corretamente", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    expect(screen.getByText("Nova Tarefa")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("O que você precisa fazer?"),
    ).toBeInTheDocument();
  });

  it("deve fechar modal ao clicar no botão fechar", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    // CORREÇÃO: Buscando cirurgicamente pelo botão através do seu aria-label exato
    const closeButton = screen.getByRole("button", { name: "Fechar modal" });
    fireEvent.click(closeButton);

    expect(defaultProps.setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve atualizar título", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    const input = screen.getByPlaceholderText("O que você precisa fazer?");
    fireEvent.change(input, { target: { value: "Nova Tarefa Teste" } });

    expect(defaultProps.setNewTask).toHaveBeenCalled();
  });

  it("deve submeter formulário", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    const form = screen
      .getByPlaceholderText("O que você precisa fazer?")
      .closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    expect(defaultProps.handleAddTask).toHaveBeenCalled();
  });

  it("deve fechar ao clicar em cancelar", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.setShowModal).toHaveBeenCalledWith(false);
  });
});
