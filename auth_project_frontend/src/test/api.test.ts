import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios", () => {
  const localMockInstance = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  };

  return {
    default: {
      create: vi.fn(() => localMockInstance),
      isAxiosError: vi.fn(() => true),
    },
  };
});

// 🔥 mock toast
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// 👇 IMPORTS DAS FUNÇÕES DA API DO PROJETO
import {
  fetchLogin,
  fetchRegister,
  fetchRefresh,
  fetchAddTask,
  fetchTasks,
  fetchTasksByUser,
  fetchUpdateTask,
  fetchDeleteTask,
} from "../api";
import { Situation } from "../types/enums/situation.enum";

describe("api", () => {
  // 🚀 Resgatamos o mock criado pelo escopo interno do Vitest de forma limpa e segura
  const apiMock = vi.mocked(axios.create());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should login", async () => {
    apiMock.post.mockResolvedValue({ data: { token: "123" } });

    const res = await fetchLogin({
      email: "test@email.com",
      password: "123456",
    });

    expect(res.data.token).toBe("123");
    expect(apiMock.post).toHaveBeenCalledWith(
      "/user/login",
      expect.anything(),
      expect.anything(),
    );
  });

  it("should register", async () => {
    apiMock.post.mockResolvedValue({ data: { id: 1 } });

    const res = await fetchRegister({
      email: "test@email.com",
      password: "123456",
      confirm_password: "123456",
      name: "Gabriel",
    });
    expect(res.data.id).toBe(1);
  });

  it("should refresh", async () => {
    apiMock.post.mockResolvedValue({ data: { token: "refresh" } });

    const res = await fetchRefresh();

    expect(res.data.token).toBe("refresh");
  });

  it("should add task with token", async () => {
    apiMock.post.mockResolvedValue({ data: {} });

    const mockNewTask = {
      task_name: "Test Task",
      description: "Test Description",
      userId: 12,
    };
    await fetchAddTask(mockNewTask, "token123");

    expect(apiMock.post).toHaveBeenCalledWith(
      "/task",
      expect.anything(),
      expect.objectContaining({
        headers: { Authorization: "Bearer token123" },
      }),
    );
  });

  it("should fetch tasks", async () => {
    apiMock.get.mockResolvedValue({ data: [] });

    const res = await fetchTasks("token");

    expect(res.data).toEqual([]);
  });

  it("should fetch tasks by user", async () => {
    apiMock.get.mockResolvedValue({ data: [] });

    await fetchTasksByUser(1, "token");

    expect(apiMock.get).toHaveBeenCalledWith(
      "/task/byUser/1",
      expect.anything(),
    );
  });

  it("should update task", async () => {
    apiMock.put.mockResolvedValue({ data: {} });

    await fetchUpdateTask("1", Situation.DONE, "token");

    expect(apiMock.put).toHaveBeenCalledWith(
      "/task/1",
      { situation: "DONE" },
      expect.anything(),
    );
  });

  it("should delete task", async () => {
    apiMock.delete.mockResolvedValue({ data: {} });

    await fetchDeleteTask("1", "token");

    expect(apiMock.delete).toHaveBeenCalled();
  });

  it("should throw error on delete fail", async () => {
    apiMock.delete.mockRejectedValue(new Error("fail"));

    await expect(fetchDeleteTask("1", "token")).rejects.toThrow();
  });
});
