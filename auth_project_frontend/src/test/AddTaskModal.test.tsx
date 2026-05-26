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

  it("deve evitar a propagação do clique ao interagir com o corpo do modal", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    // Procura a div interna com a classe 'modal'
    const modalContent = screen.getByText("Nova Tarefa").closest(".modal");

    if (modalContent) {
      fireEvent.click(modalContent);
      // Se o stopPropagation funcionou, o evento não deve ter sido cancelado e o modal não fecha
      expect(defaultProps.setShowModal).not.toHaveBeenCalled();
    }
  });

  it("deve fechar modal ao clicar no botão fechar", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

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

  /* 🚀 NOVOS TESTES DE ACESSIBILIDADE E TECLADO PARA CRAVAR 100% DE COBERTURA */

  it("deve fechar o modal ao pressionar Enter no overlay", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    const overlay = screen.getByLabelText("Fechar modal ao clicar fora");
    fireEvent.keyDown(overlay, { key: "Enter" });

    expect(defaultProps.setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve fechar o modal ao pressionar a barra de Espaço no overlay", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    const overlay = screen.getByLabelText("Fechar modal ao clicar fora");
    fireEvent.keyDown(overlay, { key: " " }); // Espaço

    expect(defaultProps.setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve ignorar outras teclas pressionadas no overlay", () => {
    renderWithProviders(<AddTaskModal {...defaultProps} />);

    const overlay = screen.getByLabelText("Fechar modal ao clicar fora");
    fireEvent.keyDown(overlay, { key: "Escape" });

    expect(defaultProps.setShowModal).not.toHaveBeenCalled();
  });
});
