import { describe, expect, it } from "vitest";
import { buildSimulationParamsFromBase } from "./build-simulation-params";
import { DEFAULT_BASE_FORM_STATE } from "./simulation-base";

describe("buildSimulationParamsFromBase", () => {
  it("includes temperatureC in simulation params", () => {
    const params = buildSimulationParamsFromBase(
      { ...DEFAULT_BASE_FORM_STATE, temperatureC: 80 },
      1e-4,
    );
    expect(params.temperatureC).toBe(80);
  });

  it("uses arrhenius diffusion coefficient when mode is arrhenius", () => {
    const params = buildSimulationParamsFromBase(
      {
        ...DEFAULT_BASE_FORM_STATE,
        diffusionMode: "arrhenius",
        diffusionCoeffCm2PerS: 1e-12,
        temperatureC: 100,
      },
      1e-4,
    );
    expect(params.diffusionCoeffCm2PerS).toBeGreaterThan(3e-11);
  });
});
