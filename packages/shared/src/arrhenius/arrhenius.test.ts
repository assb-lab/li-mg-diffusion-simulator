import { describe, expect, it } from "vitest";
import { calculateDiffusionCoeffArrhenius, DEFAULT_ARRHENIUS_INPUT } from "./arrhenius";
import { celsiusToKelvin } from "../units/units";

describe("calculateDiffusionCoeffArrhenius", () => {
  it("throws for non-positive temperature", () => {
    expect(() =>
      calculateDiffusionCoeffArrhenius({
        ...DEFAULT_ARRHENIUS_INPUT,
        temperatureK: 0,
      }),
    ).toThrow();
  });

  it("increases with temperature for positive activation energy", () => {
    const d0 = calculateDiffusionCoeffArrhenius({
      ...DEFAULT_ARRHENIUS_INPUT,
      temperatureK: celsiusToKelvin(0),
    });
    const d100 = calculateDiffusionCoeffArrhenius({
      ...DEFAULT_ARRHENIUS_INPUT,
      temperatureK: celsiusToKelvin(100),
    });
    expect(d100).toBeGreaterThan(d0);
  });
});
