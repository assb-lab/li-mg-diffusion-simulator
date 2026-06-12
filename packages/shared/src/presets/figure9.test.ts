import { describe, expect, it } from "vitest";
import { buildFigure9SimulationParams, FIGURE9_CASES, FIGURE9_PRESET } from "./figure9";

describe("Figure 9 preset", () => {
  it("matches paper default parameters", () => {
    expect(FIGURE9_PRESET.thicknessUm).toBe(25);
    expect(FIGURE9_PRESET.initialConcentrationMmolPerCm3).toBe(69.6);
    expect(FIGURE9_PRESET.betaLowerBoundMmolPerCm3).toBe(24);
    expect(FIGURE9_PRESET.diffusionCoeffCm2PerS).toBe(3e-11);
  });

  it("throws for unknown case label", () => {
    expect(() => buildFigure9SimulationParams("unknown" as "1mA")).toThrow();
  });

  it("defines three current density cases", () => {
    expect(FIGURE9_CASES).toHaveLength(3);
    expect(FIGURE9_CASES.map((c) => c.label)).toEqual(["10uA", "100uA", "1mA"]);
    expect(FIGURE9_CASES[0]?.currentDensityAcm2).toBeCloseTo(1e-5);
    expect(FIGURE9_CASES[1]?.currentDensityAcm2).toBeCloseTo(1e-4);
    expect(FIGURE9_CASES[2]?.currentDensityAcm2).toBeCloseTo(1e-3);
  });
});
