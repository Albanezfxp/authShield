import { render } from "@testing-library/react";
import App from "../App";
import { describe, it } from "vitest"; // <-- ADICIONE ESTA LINHA
describe("App", () => {
  it("should render without crashing", () => {
    render(<App />);
  });
});
