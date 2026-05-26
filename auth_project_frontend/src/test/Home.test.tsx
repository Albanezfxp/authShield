// src/test/Home.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import Home from "../pages/Home";
import { renderWithProviders } from "./test-utils/test-utils";

// 🔥 Mock do hook useNavigate do react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar a estrutura da página inicial corretamente", () => {
    renderWithProviders(<Home />);

    // Valida o conteúdo principal (Hero Section)
    expect(screen.getByText(/Organize suas tarefas com/i)).toBeInTheDocument();
    expect(screen.getByText(/simplicidade/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /TaskFlow é a forma mais intuitiva de gerenciar suas atividades/i,
      ),
    ).toBeInTheDocument();

    // Valida a renderização dos Avatares (Social Proof)
    expect(
      screen.getByText(/Junte-se a milhares de usuários produtivos/i),
    ).toBeInTheDocument();

    // Valida a renderização estática do Board Preview (Mock Kanban)
    expect(screen.getByText("Meu Projeto")).toBeInTheDocument();
    expect(screen.getByText("A fazer")).toBeInTheDocument();
    expect(screen.getByText("Em progresso")).toBeInTheDocument();
    expect(screen.getByText("Concluído")).toBeInTheDocument();
    expect(screen.getByText("Implementar login")).toBeInTheDocument();
    expect(screen.getByText("Página inicial")).toBeInTheDocument();
    expect(screen.getByText("Banco de dados")).toBeInTheDocument();
  });

  it("deve listar todos os FeatureCards mapeados dinamicamente", () => {
    renderWithProviders(<Home />);

    // Valida os títulos injetados na lista de recursos
    expect(screen.getByText("Organização Visual")).toBeInTheDocument();
    expect(screen.getByText("Produtividade em Foco")).toBeInTheDocument();
    expect(screen.getByText("Acompanhe o Progresso")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Interface intuitiva que deixa você concentrado no que importa.",
      ),
    ).toBeInTheDocument();
  });

  it("deve navegar para a rota de login ao clicar no botão 'Começar Agora'", () => {
    renderWithProviders(<Home />);

    const startButton = screen.getByRole("button", { name: /começar agora/i });
    fireEvent.click(startButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("deve navegar para a rota de registro ao clicar no botão 'Criar Conta' da seção CTA", () => {
    renderWithProviders(<Home />);

    const ctaButton = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(ctaButton);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it("deve renderizar os elementos estruturais do rodapé", () => {
    renderWithProviders(<Home />);

    const footerElement = screen.getByRole("contentinfo"); // Procura semanticamente a tag <footer>
    expect(footerElement).toBeInTheDocument();

    expect(
      screen.getByText("Gerenciamento de tarefas simples e poderoso"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2024 TaskFlow. Todos os direitos reservados/i),
    ).toBeInTheDocument();

    // Valida os links de navegação interna do footer
    expect(screen.getByRole("link", { name: "Recursos" })).toHaveAttribute(
      "href",
      "#features",
    );
    expect(screen.getByRole("link", { name: "Preços" })).toHaveAttribute(
      "href",
      "#pricing",
    );
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});
