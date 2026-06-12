import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Figure10SweepForm } from "./Figure10SweepForm";
import { DEFAULT_FIGURE10_FORM_STATE } from "./figure10SweepFormViewModel";

describe("Figure10SweepForm", () => {
  it("renders base and sweep range inputs", () => {
    render(<Figure10SweepForm value={DEFAULT_FIGURE10_FORM_STATE} onChange={vi.fn()} />);
    expect(screen.getByLabelText(/Thickness \(µm\)/)).toBeInTheDocument();
    expect(screen.getByText(/Temperature sweep/)).toBeInTheDocument();
    expect(screen.getByText(/Current density sweep/)).toBeInTheDocument();
  });
});
