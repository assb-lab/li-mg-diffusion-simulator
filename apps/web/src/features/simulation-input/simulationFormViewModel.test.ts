import { describe, expect, it } from "vitest";
import { DEFAULT_FORM_STATE, formStateToSimulationParams } from "./simulationFormViewModel";

describe("simulationFormViewModel", () => {
  it("converts form input to internal A/cm2 units", () => {
    const params = formStateToSimulationParams({
      ...DEFAULT_FORM_STATE,
      currentDensity: 100,
      currentDensityUnit: "uAcm2",
    });
    expect(params.currentDensityAcm2).toBeCloseTo(1e-4);
  });

  it("includes temperature and arrhenius diffusion in params", () => {
    const params = formStateToSimulationParams({
      ...DEFAULT_FORM_STATE,
      diffusionMode: "arrhenius",
      temperatureC: 100,
    });
    expect(params.temperatureC).toBe(100);
    expect(params.diffusionCoeffCm2PerS).toBeGreaterThan(3e-11);
  });
});
