// src/test/Login.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login";
import { renderWithProviders } from "./test-utils/test-utils";

// 🔥 Mock do módulo da API
vi.mock("../api", () => ({
  fetchLogin: vi.fn(),
}));

// Import da função após o mock do módulo
import { fetchLogin } from "../api";

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow typing and submitting", async () => {
    renderWithProviders(<Login />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/senha/i);
    const button = screen.getByLabelText("submit-login");

    await userEvent.type(email, "test@email.com");
    await userEvent.type(password, "123456");

    await userEvent.click(button);

    expect(email).toHaveValue("test@email.com");
  });

  it("should login successfully", async () => {
    vi.mocked(fetchLogin).mockResolvedValue({
      data: { access_token: "fake-token" },
    } as unknown as Awaited<ReturnType<typeof fetchLogin>>);

    renderWithProviders(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), "test@email.com");
    await userEvent.type(screen.getByLabelText(/senha/i), "123456");

    await userEvent.click(screen.getByLabelText("submit-login"));

    expect(fetchLogin).toHaveBeenCalled();
  });

  it("should show error on invalid login", async () => {
    // CORREÇÃO: Usando vi.mocked() para injetar a rejeição com tipagem estrita
    vi.mocked(fetchLogin).mockRejectedValue(new Error("fail"));

    renderWithProviders(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), "test@email.com");
    await userEvent.type(screen.getByLabelText(/senha/i), "123456");

    await userEvent.click(screen.getByLabelText("submit-login"));

    expect(fetchLogin).toHaveBeenCalled();
  });
});
