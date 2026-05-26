import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import FeatureCard from "../components/Home/FeatureCard";
import { renderWithProviders } from "./test-utils/test-utils";

describe("FeatureCard", () => {
  it("deve renderizar os dados da feature passados por prop corretamente", () => {
    const mockFeature = {
      id: "feat-1",
      icon: <span data-testid="mock-icon">🚀</span>,
      title: "Alta Performance",
      description: "Sistemas web rápidos e responsivos.",
    };

    renderWithProviders(<FeatureCard feature={mockFeature} />);

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    expect(screen.getByText("Alta Performance")).toBeInTheDocument();
    expect(
      screen.getByText("Sistemas web rápidos e responsivos."),
    ).toBeInTheDocument();
  });
});
