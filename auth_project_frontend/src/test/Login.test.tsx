import { renderWithProviders } from "./test-utils/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Login from "../pages/Login";
import { fetchLogin } from "../api";

// 👇 MOCK AQUI
vi.mock("../api", () => ({
  fetchLogin: vi.fn(),
}));

describe("Login", () => {
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
    (fetchLogin as any).mockResolvedValue({
      data: { access_token: "fake-token" },
    });

    renderWithProviders(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), "test@email.com");
    await userEvent.type(screen.getByLabelText(/senha/i), "123456");

    await userEvent.click(screen.getByLabelText("submit-login"));

    expect(fetchLogin).toHaveBeenCalled();
  });

  it("should show error on invalid login", async () => {
    (fetchLogin as any).mockRejectedValue(new Error("fail"));

    renderWithProviders(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), "test@email.com");
    await userEvent.type(screen.getByLabelText(/senha/i), "123456");

    await userEvent.click(screen.getByLabelText("submit-login"));

    expect(fetchLogin).toHaveBeenCalled();
  });
});
