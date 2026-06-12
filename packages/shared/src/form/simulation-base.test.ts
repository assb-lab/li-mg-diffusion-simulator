import { describe, expect, it } from "vitest";
import {
  buildNumericRange,
  DEFAULT_BASE_FORM_STATE,
  resolveDiffusionCoeffCm2PerS,
} from "./simulation-base";
import { DEFAULT_ARRHENIUS_INPUT } from "../arrhenius/arrhenius";

describe("resolveDiffusionCoeffCm2PerS", () => {
  it("returns manual diffusion coefficient in manual mode", () => {
    const value = resolveDiffusionCoeffCm2PerS({
      diffusionMode: "manual",
      diffusionCoeffCm2PerS: 1e-10,
      temperatureC: 25,
    });
    expect(value).toBe(1e-10);
  });

  it("returns D_ref at reference temperature in arrhenius mode", () => {
    const value = resolveDiffusionCoeffCm2PerS(
      {
        diffusionMode: "arrhenius",
        diffusionCoeffCm2PerS: 1e-12,
        temperatureC: 25,
      },
      DEFAULT_ARRHENIUS_INPUT,
    );
    expect(value).toBeCloseTo(DEFAULT_ARRHENIUS_INPUT.diffusionRefCm2PerS);
  });

  it("increases with temperature in arrhenius mode", () => {
    const cold = resolveDiffusionCoeffCm2PerS({
      ...DEFAULT_BASE_FORM_STATE,
      diffusionMode: "arrhenius",
      temperatureC: 0,
    });
    const hot = resolveDiffusionCoeffCm2PerS({
      ...DEFAULT_BASE_FORM_STATE,
      diffusionMode: "arrhenius",
      temperatureC: 100,
    });
    expect(hot).toBeGreaterThan(cold);
  });
});

describe("buildNumericRange", () => {
  it("builds inclusive stepped range", () => {
    expect(buildNumericRange(0, 100, 50)).toEqual([0, 50, 100]);
  });
});
