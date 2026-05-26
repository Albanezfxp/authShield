import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../commons/contexts/AuthProvider";
import type { ReactNode } from "react";

export function renderWithProviders(ui: ReactNode) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>,
  );
}
