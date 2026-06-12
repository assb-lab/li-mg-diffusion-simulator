import { describe, expect, it } from "vitest";
import {
  buildFigure10ChartByCurrentDensity,
  buildFigure10ChartByTemperature,
  buildFigure10SeriesByCurrentDensity,
  buildFigure10SeriesByTemperature,
  formatCurrentDensityAcm2Label,
} from "./figure10ChartViewModel";

const mockResult = {
  currentDensityAcm2Values: [1e-5, 1e-4],
  temperatureCValues: [0, 25],
  betaPhaseUtilizationMatrix: [
    [0.5, 0.4],
    [0.6, 0.3],
  ],
  totalLiUtilizationMatrix: [
    [0.3, 0.2],
    [0.4, 0.1],
  ],
};

describe("figure10ChartViewModel", () => {
  it("formats current density labels for µA and mA ranges", () => {
    expect(formatCurrentDensityAcm2Label(1e-5)).toBe("10 µA cm⁻²");
    expect(formatCurrentDensityAcm2Label(1e-3)).toBe("1 mA cm⁻²");
  });

  it("builds temperature-axis chart data with current-density series", () => {
    const data = buildFigure10ChartByTemperature(mockResult);
    expect(data).toHaveLength(2);
    expect(data[0]?.temperatureC).toBe(0);
    expect(data[0]?.["i_0.00001"]).toBeCloseTo(50);
    expect(data[1]?.["i_0.0001"]).toBeCloseTo(30);
  });

  it("builds current-density-axis chart data with temperature series", () => {
    const data = buildFigure10ChartByCurrentDensity(mockResult);
    expect(data).toHaveLength(2);
    expect(data[0]?.currentDensityAcm2).toBeCloseTo(1e-5);
    expect(data[0]?.t_0).toBeCloseTo(50);
    expect(data[1]?.t_25).toBeCloseTo(30);
  });

  it("defines distinct series metadata for each chart orientation", () => {
    expect(buildFigure10SeriesByCurrentDensity(mockResult).map((series) => series.label)).toEqual([
      "10 µA cm⁻²",
      "100 µA cm⁻²",
    ]);
    expect(buildFigure10SeriesByTemperature(mockResult).map((series) => series.label)).toEqual([
      "0 °C",
      "25 °C",
    ]);
  });
});
