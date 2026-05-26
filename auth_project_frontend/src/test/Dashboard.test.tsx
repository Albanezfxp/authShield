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

// Objeto base para simular a API nativa de DataTransfer do navegador de forma tipada
const createMockDataTransfer = (): DataTransfer => {
  return {
    clearData: vi.fn(),
    getData: vi.fn(),
    setData: vi.fn(),
    setDragImage: vi.fn(),
    dropEffect: "none" as const,
    effectAllowed: "uninitialized" as const,
    files: [] as unknown as FileList,
    items: [] as unknown as DataTransferItemList,
    types: [] as unknown as readonly string[],
  };
};

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      access_token: "fake-token",
      setAccess_token: vi.fn(),
    });

    vi.mocked(jwtDecode).mockReturnValue({ sub: "1" } as unknown as Awaited<
      ReturnType<typeof jwtDecode>
    >);
    vi.mocked(fetchTasksByUser).mockResolvedValue({
      data: [],
    } as unknown as Awaited<ReturnType<typeof fetchTasksByUser>>);
    vi.mocked(fetchRefresh).mockResolvedValue({
      data: { access_token: "fake-token" },
    } as unknown as Awaited<ReturnType<typeof fetchRefresh>>);
  });

  it("deve mostrar loading inicialmente e depois sumir", async () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/carregando tarefas/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/carregando tarefas/i)).not.toBeInTheDocument();
    });
  });

  it("deve carregar tarefas com sucesso", async () => {
    vi.mocked(fetchTasksByUser).mockResolvedValue({
      data: [
        {
          id: "1",
          task_name: "Task 1",
          description: "Desc 1",
          situation: "TO_DO",
        },
      ],
    } as unknown as Awaited<ReturnType<typeof fetchTasksByUser>>);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Desc 1")).toBeInTheDocument();
    });
  });

  it("deve tratar erro ao carregar tarefas da API", async () => {
    vi.mocked(fetchTasksByUser).mockRejectedValue(new Error("Erro de conexão"));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao carregar tarefas");
    });
  });

  it("deve tentar fazer refresh do token se access_token inicial for nulo", async () => {
    vi.mocked(useAuth).mockReturnValue({
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
    vi.mocked(useAuth).mockReturnValue({
      access_token: null,
      setAccess_token: mockSetAccessToken,
    });

    vi.mocked(fetchRefresh).mockRejectedValue({ response: { status: 401 } });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith(null);
    });
  });

  it("deve limpar access_token se o refresh falhar com outro erro genérico", async () => {
    const mockSetAccessToken = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      access_token: null,
      setAccess_token: mockSetAccessToken,
    });

    vi.mocked(fetchRefresh).mockRejectedValue(new Error("Crash total"));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith(null);
    });
  });

  it("deve adicionar tarefa com sucesso", async () => {
    vi.mocked(fetchAddTask).mockResolvedValue({
      data: { id: "2", task_name: "Nova Task", description: "" },
    } as unknown as Awaited<ReturnType<typeof fetchAddTask>>);

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
      target: { value: "   " },
    });
    fireEvent.click(screen.getByText("Criar Tarefa"));

    expect(toast.warning).toHaveBeenCalledWith("Título é obrigatório");
  });

  it("deve tratar erro genérico da API ao tentar criar tarefa", async () => {
    vi.mocked(fetchAddTask).mockRejectedValue(
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
    vi.mocked(fetchTasksByUser).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Delete", situation: "TO_DO" }],
    } as unknown as Awaited<ReturnType<typeof fetchTasksByUser>>);
    vi.mocked(fetchDeleteTask).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof fetchDeleteTask>>,
    );

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
    vi.mocked(fetchTasksByUser).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Erro Delete", situation: "TO_DO" }],
    } as unknown as Awaited<ReturnType<typeof fetchTasksByUser>>);
    vi.mocked(fetchDeleteTask).mockRejectedValue(new Error("Não deletou"));
    vi.mocked(fetchTasks).mockResolvedValue({
      data: [],
    } as unknown as Awaited<ReturnType<typeof fetchTasks>>);

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
    vi.mocked(fetchTasksByUser).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Same Col", situation: "TO_DO" }],
    } as unknown as Awaited<ReturnType<typeof fetchTasksByUser>>);

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Same Col")).toBeInTheDocument();
    });

    const task = screen.getByText("Task Same Col");
    const sameColumn = screen.getByText("A Fazer");

    const mockDataTransfer = createMockDataTransfer();

    fireEvent.dragStart(task, { dataTransfer: mockDataTransfer });
    fireEvent.drop(sameColumn, { dataTransfer: mockDataTransfer });

    expect(fetchUpdateTask).not.toHaveBeenCalled();
  });

  it("deve mover tarefa (drag and drop) com sucesso", async () => {
    vi.mocked(fetchTasksByUser).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Drag", situation: "TO_DO" }],
    } as unknown as Awaited<ReturnType<typeof fetchTasksByUser>>);
    vi.mocked(fetchUpdateTask).mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof fetchUpdateTask>>,
    );

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Drag")).toBeInTheDocument();
    });

    const task = screen.getByText("Task Drag");
    const targetColumn = screen.getByText("Em Progresso");

    const mockDataTransfer = createMockDataTransfer();

    fireEvent.dragStart(task, { dataTransfer: mockDataTransfer });
    fireEvent.dragOver(targetColumn, { dataTransfer: mockDataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer: mockDataTransfer });

    await waitFor(() => {
      expect(fetchUpdateTask).toHaveBeenCalledWith(
        "1",
        Situation.IN_PROGRESS,
        "fake-token",
      );
    });
  });

  it("deve fazer rollback do estado e exibir erro se mover tarefa falhar na API", async () => {
    vi.mocked(fetchTasksByUser).mockResolvedValue({
      data: [{ id: "1", task_name: "Task Rollback", situation: "TO_DO" }],
    } as unknown as Awaited<ReturnType<typeof fetchTasksByUser>>);
    vi.mocked(fetchUpdateTask).mockRejectedValue(
      new Error("Erro de persistence"),
    );

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Task Rollback")).toBeInTheDocument();
    });

    const task = screen.getByText("Task Rollback");
    const targetColumn = screen.getByText("Concluído");

    const mockDataTransfer = createMockDataTransfer();

    fireEvent.dragStart(task, { dataTransfer: mockDataTransfer });
    fireEvent.drop(targetColumn, { dataTransfer: mockDataTransfer });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao mover tarefa");
    });
  });
});
