import { describe, expect, it } from "vitest";
import {
  buildCurrentDensityRange,
  DEFAULT_FIGURE10_FORM_STATE,
  figure10FormToSweepParams,
} from "./figure10SweepFormViewModel";

describe("figure10SweepFormViewModel", () => {
  it("builds temperature and current density sweep arrays", () => {
    const params = figure10FormToSweepParams(DEFAULT_FIGURE10_FORM_STATE);
    expect(params.temperatureCValues).toEqual([0, 25, 50, 75, 100]);
    expect(params.currentDensityAcm2Values).toHaveLength(4);
  });

  it("uses form diffusion coefficient as arrhenius reference", () => {
    const params = figure10FormToSweepParams({
      ...DEFAULT_FIGURE10_FORM_STATE,
      diffusionCoeffCm2PerS: 2.3e-11,
    });
    expect(params.arrhenius.diffusionRefCm2PerS).toBe(2.3e-11);
  });

  it("applies custom thickness to sweep base params", () => {
    const params = figure10FormToSweepParams({
      ...DEFAULT_FIGURE10_FORM_STATE,
      thicknessUm: 30,
    });
    expect(params.base.thicknessUm).toBe(30);
  });

  it("builds current density range from UI units", () => {
    const values = buildCurrentDensityRange(10, 1, 3);
    expect(values[0]).toBeCloseTo(1e-5);
    expect(values[2]).toBeCloseTo(1e-3);
  });
});
