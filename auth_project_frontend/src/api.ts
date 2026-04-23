import axios from "axios";
import type { registerRequest } from "./types/interfaces/register_request";
import type { loginRequest } from "./types/interfaces/login_request.interface";
import { toast } from "react-toastify";

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

export const fetchLogin = async (payload: loginRequest) => {
  const response = await api.post(`/user/login`, payload);
  return response;
};

export const fetchRegister = async (payload: registerRequest) => {
  const response = await api.post(`/user/register`, payload);
  return response;
};
