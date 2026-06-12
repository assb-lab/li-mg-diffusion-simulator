import { describe, expect, it } from "vitest";
import { simulationParamsSchema } from "./simulation-params";

describe("simulationParamsSchema", () => {
  const valid = {
    modelVersion: "0.1.0",
    thicknessUm: 25,
    currentDensityAcm2: 1e-5,
    diffusionCoeffCm2PerS: 3e-11,
    initialConcentrationMmolPerCm3: 69.6,
    betaLowerBoundMmolPerCm3: 24,
    gridCount: 201,
    maxTimeS: 1e6,
    savedProfileCount: 20,
  };

  it("accepts valid parameters", () => {
    expect(simulationParamsSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects negative thickness", () => {
    const result = simulationParamsSchema.safeParse({ ...valid, thicknessUm: -1 });
    expect(result.success).toBe(false);
  });

  it("accepts beta lower bound of zero for Li metal reference", () => {
    const result = simulationParamsSchema.safeParse({
      ...valid,
      initialConcentrationMmolPerCm3: 76.8,
      betaLowerBoundMmolPerCm3: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects beta lower bound >= initial concentration", () => {
    const result = simulationParamsSchema.safeParse({
      ...valid,
      betaLowerBoundMmolPerCm3: 70,
    });
    expect(result.success).toBe(false);
  });
});
