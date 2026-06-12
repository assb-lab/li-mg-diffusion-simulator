import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_BASE_FORM_STATE } from "@li-mg/shared";
import { BaseSimulationForm } from "./BaseSimulationForm";

describe("BaseSimulationForm", () => {
  it("shows anode preset selector and applies Li metal reference", () => {
    const onChange = vi.fn();
    render(<BaseSimulationForm value={DEFAULT_BASE_FORM_STATE} onChange={onChange} />);
    expect(screen.getByLabelText(/Anode preset/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Anode preset/), {
      target: { value: "li-metal-reference" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        initialConcentrationMmolPerCm3: 76.8,
        betaLowerBoundMmolPerCm3: 0,
        diffusionCoeffCm2PerS: 0.8e-11,
      }),
    );
    cleanup();
  });

  it("shows temperature and diffusion mode labels", () => {
    render(<BaseSimulationForm value={DEFAULT_BASE_FORM_STATE} onChange={vi.fn()} />);
    expect(screen.getByLabelText(/Temperature \(°C\)/)).toBeInTheDocument();
    expect(screen.getByText(/Manual D/)).toBeInTheDocument();
    expect(screen.getByText(/Arrhenius D\(T\)/)).toBeInTheDocument();
  });

  it("makes diffusion coefficient read-only in arrhenius mode", () => {
    cleanup();
    render(
      <BaseSimulationForm
        value={{ ...DEFAULT_BASE_FORM_STATE, diffusionMode: "arrhenius" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/Diffusion coefficient/)).toHaveAttribute("readonly");
  });
});
