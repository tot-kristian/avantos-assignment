import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Node } from "./Node";

describe("Node", () => {
  it("should render title", () => {
    render(<Node title="Test Title" label="Test Label" nodeClick={vi.fn()} />);

    const nodeTitle = screen.getByTestId("node-title");
    expect(nodeTitle).toBeInTheDocument();
    expect(nodeTitle).toHaveTextContent("Test Title");
  });

  it("should render label", () => {
    render(<Node title="Test Title" label="Test Label" nodeClick={vi.fn()} />);
    const nodeLabel = screen.getByTestId("node-label");
    expect(nodeLabel).toBeInTheDocument();
    expect(nodeLabel).toHaveTextContent("Test Label");
  });

  it("should call nodeClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Node title="Test Title" label="Test Label" nodeClick={handleClick} />,
    );

    const node = screen.getByTestId("node-card");
    await user.click(node!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
