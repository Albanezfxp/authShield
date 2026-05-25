import axios from "axios";
import type { RegisterRequest } from "./types/interfaces/register_request";
import type { LoginRequest } from "./types/interfaces/login_request.interface";
import { toast } from "react-toastify";
import type { CreateTaskInterface } from "./types/interfaces/create_task.interface";
import type { Situation } from "./types/enums/situation.enum";

const api = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      if (Array.isArray(data?.message)) {
        data.message.forEach((msg: string) => toast.error(msg));
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error("Erro na requisição");
      }
    } else {
      toast.error("Erro inesperado");
    }

    return Promise.reject(error);
  },
);

export const fetchLogin = async (payload: LoginRequest) => {
  const response = await api.post(`/user/login`, payload, {
    withCredentials: true,
  });
  return response;
};

export const fetchRefresh = async () => {
  try {
    const response = await api.post(`/user/auth/refresh`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Erro em fazer o refresh:", error);
    throw error;
  }
};

export const fetchRegister = async (payload: RegisterRequest) => {
  const response = await api.post(`/user/register`, payload);
  return response;
};

export const fetchAddTask = async (
  payload: CreateTaskInterface,
  token: string | null,
) => {
  const resposne = await api.post(`/task`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resposne;
};

export const fetchTasks = async (token: string | null) => {
  const response = await api.get("/task", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const fetchTasksByUser = async (id: number, token: string | null) => {
  const response = await api.get(`/task/byUser/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const fetchUpdateTask = async (
  taskId: string,
  newState: Situation,
  token: string,
) => {
  const response = await api.put(`/task/${+taskId}`, newState, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const fetchDeleteTask = async (taskId: string, token: string | null) => {
  try {
    const response = await api.delete(`/task/${+taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    throw error;
  }
};
