import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../commons/contexts/useAuth";
import { AuthProvider } from "../commons/contexts/AuthProvider";

describe("useAuth & AuthProvider", () => {
  it("deve lançar erro se o hook for utilizado fora do AuthProvider", () => {
    // Suprime temporariamente o log de erro do console para manter o terminal limpo
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within AuthProvider",
    );

    consoleSpy.mockRestore();
  });

  it("deve atualizar e retornar o token de acesso corretamente dentro de um Provider válido", () => {
    const wrapper = ({ children }: { readonly children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Estado inicial deve ser nulo
    expect(result.current.access_token).toBeNull();

    // Atualiza o token
    act(() => {
      result.current.setAccess_token("novo-token-valido");
    });

    expect(result.current.access_token).toBe("novo-token-valido");
  });
});
