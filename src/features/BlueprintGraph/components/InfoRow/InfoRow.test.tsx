import { render, screen } from "@testing-library/react";
import { InfoRow } from "./InfoRow";

describe("InfoRow", () => {
  it("should render label with correct value", () => {
    render(<InfoRow label="Test Label" value="Test Value" />);

    const label = screen.getByTestId("info-row-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Test Label");
  });

  it("should render value with correct value", () => {
    render(<InfoRow label="Test Label" value="Test Value" />);

    const value = screen.getByTestId("info-row-value");
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent("Test Value");
  });
});
