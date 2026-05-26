// src/test/Dashboard.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { renderWithProviders } from "./test-utils/test-utils";
import { Situation } from "../types/enums/situation.enum";

// Mocks das APIs
vi.mock("../api", () => ({
  fetchTasksByUser: vi.fn(),
  fetchAddTask: vi.fn(),
  fetchDeleteTask: vi.fn(),
  fetchUpdateTask: vi.fn(),
  fetchRefresh: vi.fn(),
  fetchTasks: vi.fn(),
}));

vi.mock("../commons/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// Imports após mock
import {
  fetchTasksByUser,
  fetchAddTask,
  fetchDeleteTask,
  fetchUpdateTask,
  fetchRefresh,
  fetchTasks,
} from "../api";
import { useAuth } from "../commons/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock padrão do useAuth
    (useAuth as any).mockReturnValue({
      access_token: "fake-token",
      setAccess_token: vi.fn(),
    });

    // Mock padrão do jwtDecode
    (jwtDecode as any).mockReturnValue({ sub: "1" });

    // Mock padrão de sucesso das APIs básicas
    (fetchTasksByUser as any).mockResolvedValue({ data: [] });
    (fetchRefresh as any).mockResolvedValue({
      data: { access_token: "fake-token" },
    });
  });

  it("deve mostrar loading inicialmente e depois sumir", async () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/carregando tarefas/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/carregando tarefas/i)).not.toBeInTheDocument();
    });
  });

  it("deve carregar tarefas com sucesso", async () => {
    (fetchTasksByUser as any).mockResolvedValue({
      data: [
        {
          id: "1",
          task_name: "Task 1",
          description: "Desc 1",
          situation: "TO_DO",
        },
      ],
    });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Desc 1")).toBeInTheDocument();
    });
  });

  it("deve tratar erro ao carregar tarefas da API", async () => {
    (fetchTasksByUser as any).mockRejectedValue(new Error("Erro de conexão"));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao carregar tarefas");
    });
  });

  it("deve tentar fazer refresh do token se access_token inicial for nulo", async () => {
    (useAuth as any).mockReturnValue({
      access_token: null,
      setAccess_token: vi.fn(),
    });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(fetchRefresh).toHaveBeenCalled();
    });
  });

  it("deve limpar access_token se o refresh falhar com erro 401", async () => {
    const mockSetAccessToken = vi.fn();
    (useAuth as any).mockReturnValue({
      access_token: null,
      setAccess_token: mockSetAccessToken,
    });

    const error401 = { response: { status: 401 } };
    (fetchRefresh as any).mockRejectedValue(error401);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith(null);
    });
  });

  it("deve limpar access_token se o refresh falhar com outro erro genérico", async () => {
    const mockSetAccessToken = vi.fn();
    (useAuth as any).mockReturnValue({
      access_token: null,
      setAccess_token: mockSetAccessToken,
    });

    (fetchRefresh as any).mockRejectedValue(new Error("Crash total"));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith(null);
    });
  });

  it("deve adicionar tarefa com sucesso", async () => {
    (fetchAddTask as any).mockResolvedValue({
      data: { id: "2", task_name: "Nova Task", description: "" },
    });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("A Fazer")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/nova tarefa/i));
    fireEvent.change(screen.getByPlaceholderText("O que você precisa fazer?"), {
      target: { value: "Nova Task" },
    });
    fireEvent.click(screen.getByText("Criar Tarefa"));

    await waitFor(() => {
      expect(fetchAddTask).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Tarefa criada!");
    });
  });

  it("deve exibir aviso se tentar adicionar tarefa com título em branco", async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/nova tarefa/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/nova tarefa/i));
    fireEvent.change(screen.getByPlaceholderText("O que você precisa fazer?"), {
      target: { value: "   " }, // Título em branco
    });
    fireEvent.click(screen.getByText("Criar Tarefa"));

    expect(toast.warning).toHaveBeenCalledWith("Título é obrigatório");
  });

  it("deve tratar erro genérico da API ao tentar criar tarefa", async () => {
    (fetchAddTask as any).mockRejectedValue(
      new Error("Erro interno do servidor"),
    );

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/nova tarefa/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/nova tarefa/i));
    fireEvent.change(screen.getByPlaceholderText("O que você precisa fazer?"), {
      target: { value: "Tarefa Falha" },
    });
    fireEvent.click(screen.getByText("Criar Tarefa"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar tarefa");
    });
  });

  it("deve deletar tarefa com sucesso", async () => {
    (fetchTasksByUser as any).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Delete", situation: "TO_DO" }],
    });
    (fetchDeleteTask as any).mockResolvedValue({});

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Delete")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle("Deletar tarefa"));

    await waitFor(() => {
      expect(fetchDeleteTask).toHaveBeenCalledWith("1", "fake-token");
    });
  });

  it("deve tentar recarregar tudo via fetchTasks se a deleção falhar", async () => {
    (fetchTasksByUser as any).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Erro Delete", situation: "TO_DO" }],
    });
    (fetchDeleteTask as any).mockRejectedValue(new Error("Não deletou"));
    (fetchTasks as any).mockResolvedValue({ data: [] });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Erro Delete")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle("Deletar tarefa"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao deletar tarefa");
      expect(fetchTasks).toHaveBeenCalledWith("fake-token");
    });
  });

  it("deve ignorar drop se for na mesma coluna de origem", async () => {
    (fetchTasksByUser as any).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Same Col", situation: "TO_DO" }],
    });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Same Col")).toBeInTheDocument();
    });

    const task = screen.getByText("Task Same Col");
    const sameColumn = screen.getByText("A Fazer"); // Mesma coluna original (to-do)

    const dataTransfer = { data: {}, setData: vi.fn(), effectAllowed: "" };

    fireEvent.dragStart(task, { dataTransfer });
    fireEvent.drop(sameColumn, { dataTransfer });

    expect(fetchUpdateTask).not.toHaveBeenCalled();
  });

  it("deve mover tarefa (drag and drop) com sucesso", async () => {
    (fetchTasksByUser as any).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Drag", situation: "TO_DO" }],
    });
    (fetchUpdateTask as any).mockResolvedValue({});

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Drag")).toBeInTheDocument();
    });

    const task = screen.getByText("Task Drag");
    const targetColumn = screen.getByText("Em Progresso");

    const dataTransfer = {
      data: {},
      setData: vi.fn(),
      effectAllowed: "",
      dropEffect: "",
    };

    fireEvent.dragStart(task, { dataTransfer });
    fireEvent.dragOver(targetColumn, { dataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer });

    await waitFor(() => {
      expect(fetchUpdateTask).toHaveBeenCalledWith(
        "1",
        Situation.IN_PROGRESS,
        "fake-token",
      );
    });
  });

  it("deve fazer rollback do estado e exibir erro se mover tarefa falhar na API", async () => {
    (fetchTasksByUser as any).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Rollback", situation: "TO_DO" }],
    });
    (fetchUpdateTask as any).mockRejectedValue(
      new Error("Erro de persistência"),
    );

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Rollback")).toBeInTheDocument();
    });

    const task = screen.getByText("Task Rollback");
    const targetColumn = screen.getByText("Concluído");

    const dataTransfer = {
      data: {},
      setData: vi.fn(),
      effectAllowed: "",
      dropEffect: "",
    };

    fireEvent.dragStart(task, { dataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao mover tarefa");
    });
  });
});
