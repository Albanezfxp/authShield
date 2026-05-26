// src/test/AuthLayout.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AuthLayout from "../components/_shared_/AuthLayout";
import { renderWithProviders } from "./test-utils/test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar a tela de login corretamente", () => {
    renderWithProviders(
      <AuthLayout title="Título Login" text="Texto Login" login={true}>
        <input data-testid="children-input" />
      </AuthLayout>,
    );

    expect(screen.getByText("Título Login")).toBeInTheDocument();
    expect(screen.getByText("Texto Login")).toBeInTheDocument();
    expect(screen.getByTestId("children-input")).toBeInTheDocument();
    expect(screen.getByText("Não tem conta?")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /ir para página de registro/i }),
    ).toBeInTheDocument();
  });

  it("deve renderizar a tela de registro corretamente", () => {
    renderWithProviders(
      <AuthLayout title="Título Registro" text="Texto Registro" login={false}>
        <div />
      </AuthLayout>,
    );

    expect(screen.getByText("Já tem uma conta?")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /ir para página de login/i }),
    ).toBeInTheDocument();
  });

  it("deve navegar para registro ao clicar no botão em modo login", () => {
    renderWithProviders(
      <AuthLayout title="Login" text="Texto" login={true}>
        <div />
      </AuthLayout>,
    );

    const button = screen.getByRole("button", {
      name: /ir para página de registro/i,
    });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("deve navegar para login ao clicar no botão em modo registro", () => {
    renderWithProviders(
      <AuthLayout title="Registro" text="Texto" login={false}>
        <div />
      </AuthLayout>,
    );

    const button = screen.getByRole("button", {
      name: /ir para página de login/i,
    });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("deve aceitar evento de teclado no botão de ir para registro", () => {
    renderWithProviders(
      <AuthLayout title="Login" text="Texto" login={true}>
        <div />
      </AuthLayout>,
    );

    const button = screen.getByRole("button", {
      name: /ir para página de registro/i,
    });
    fireEvent.keyDown(button, { key: "Enter" });

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("deve ignorar teclas não mapeadas nos botões de navegação", () => {
    renderWithProviders(
      <AuthLayout title="Login" text="Texto" login={true}>
        <div />
      </AuthLayout>,
    );

    const button = screen.getByRole("button", {
      name: /ir para página de registro/i,
    });
    fireEvent.keyDown(button, { key: "Escape" });

    expect(mockNavigate).not.toLocaleString();
  });
  it("deve aceitar evento de teclado no botão de ir para login quando em modo registro", () => {
    renderWithProviders(
      <AuthLayout title="Registro" text="Texto" login={false}>
        <div />
      </AuthLayout>,
    );

    const button = screen.getByRole("button", {
      name: /ir para página de login/i,
    });
    fireEvent.keyDown(button, { key: "Enter" });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
