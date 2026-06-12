import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SimulationForm } from "./SimulationForm";
import { DEFAULT_FORM_STATE } from "./simulationFormViewModel";

describe("SimulationForm", () => {
  it("renders labeled inputs with units", () => {
    render(<SimulationForm value={DEFAULT_FORM_STATE} onChange={vi.fn()} />);
    expect(screen.getByLabelText(/Thickness \(µm\)/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temperature \(°C\)/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Diffusion coefficient/)).toBeInTheDocument();
    expect(screen.getByText(/Manual D/)).toBeInTheDocument();
    expect(screen.getByText(/Arrhenius D\(T\)/)).toBeInTheDocument();
  });

  it("calls onChange when thickness is edited", () => {
    cleanup();
    const onChange = vi.fn();
    render(<SimulationForm value={DEFAULT_FORM_STATE} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Thickness \(µm\)/), { target: { value: "30" } });
    expect(onChange).toHaveBeenCalled();
  });
});
