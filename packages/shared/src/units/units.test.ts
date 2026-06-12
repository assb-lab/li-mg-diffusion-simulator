import { describe, expect, it } from "vitest";
import {
  celsiusToKelvin,
  cmToUm,
  currentDensityAcm2ToMaCm2,
  currentDensityAcm2ToUaCm2,
  currentDensityMaCm2ToAcm2,
  currentDensityUaCm2ToAcm2,
  kelvinToCelsius,
  umToCm,
} from "./units";

describe("unit conversions", () => {
  it("converts thickness um <-> cm", () => {
    expect(umToCm(25)).toBeCloseTo(0.0025);
    expect(cmToUm(0.0025)).toBeCloseTo(25);
  });

  it("converts current density uA/cm2 to A/cm2", () => {
    expect(currentDensityUaCm2ToAcm2(10)).toBeCloseTo(1e-5);
    expect(currentDensityMaCm2ToAcm2(1)).toBeCloseTo(1e-3);
    expect(currentDensityAcm2ToUaCm2(1e-5)).toBeCloseTo(10);
    expect(currentDensityAcm2ToMaCm2(1e-3)).toBeCloseTo(1);
  });

  it("converts temperature C <-> K", () => {
    expect(celsiusToKelvin(25)).toBeCloseTo(298.15);
    expect(kelvinToCelsius(298.15)).toBeCloseTo(25);
  });
});
