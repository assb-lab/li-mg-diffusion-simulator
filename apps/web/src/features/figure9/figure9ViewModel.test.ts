import { describe, expect, it } from "vitest";
import {
  buildConcentrationColormapPanel,
  colormapPanelAtTime,
  timeToProfileColor,
  buildFigure9ChartSeriesAtTime,
  selectProfileAtTime,
  selectTerminalProfile,
  toConcentrationChartSeries,
} from "./figure9ViewModel";

const mockResult = {
  modelVersion: "0.1.0",
  solverVersion: "0.1.0",
  xUm: [0, 25],
  profiles: [
    { timeS: 0, concentrationsMmolPerCm3: [69.6, 69.6] },
    { timeS: 100, concentrationsMmolPerCm3: [69.6, 50] },
  ],
  stopTimeS: 100,
  stopReason: "BetaLowerBoundReached" as const,
  betaPhaseUtilization: 0.5,
  totalLiUtilization: 0.3,
  strippedCapacityMahPerCm2: 0.1,
  interfaceConcentrationMmolPerCm3: 50,
  massBalanceRelativeError: 0.001,
};

describe("figure9ViewModel", () => {
  it("maps solver output to chart data with units", () => {
    const series = {
      ...toConcentrationChartSeries("10uA", [0, 25], {
        timeS: 1,
        concentrationsMmolPerCm3: [69.6, 24],
      }),
      betaLowerBoundMmolPerCm3: 24,
    };
    expect(series.data[0]).toEqual({ xUm: 0, concentrationMmolPerCm3: 69.6 });
    expect(series.xMaxUm).toBe(25);
    expect(series.label).toBe("10uA");
  });

  it("selects profile at stop time over earlier snapshots", () => {
    const terminal = selectTerminalProfile(mockResult);
    expect(terminal?.timeS).toBe(100);
    expect(terminal?.concentrationsMmolPerCm3.at(-1)).toBe(50);
  });

  it("interpolates profile at intermediate time", () => {
    const profile = selectProfileAtTime(mockResult, 50);
    expect(profile?.timeS).toBe(50);
    expect(profile?.concentrationsMmolPerCm3.at(-1)).toBeCloseTo(59.8, 5);
  });

  it("builds line chart series at selected time", () => {
    const series = buildFigure9ChartSeriesAtTime(
      {
        cases: [{ label: "10uA", currentDensityAcm2: 1e-5, result: mockResult }],
      },
      50,
      24,
      69.6,
    );
    expect(series[0]?.selectedTimeLabel).toBe("50.0 s");
    expect(series[0]?.data.at(-1)?.concentrationMmolPerCm3).toBeCloseTo(59.8, 5);
    expect(series[0]?.yMinMmolPerCm3).toBe(0);
    expect(series[0]?.yMaxMmolPerCm3).toBe(70);
    expect(series[0]?.yTickValuesMmolPerCm3?.at(-1)).toBe(70);
  });

  it("builds overlaid profile layers for colormap", () => {
    const panel = buildConcentrationColormapPanel("10uA", mockResult, 24, 69.6, 3);
    expect(panel.profileLayers).toHaveLength(3);
    expect(panel.profileLayers[0]?.data).toHaveLength(2);
    expect(panel.profileLayers[0]?.color).toBe(timeToProfileColor(0, 100));
    expect(panel.profileLayers.at(-1)?.color).toBe(timeToProfileColor(100, 100));
    expect(panel.profileLayers[0]?.data).toHaveLength(2);
    expect(panel.xMaxUm).toBe(25);
    expect(panel.yMinMmolPerCm3).toBe(0);
    expect(panel.yMaxMmolPerCm3).toBe(70);
    expect(panel.yTickValuesMmolPerCm3).toContain(5);
    expect(panel.yTickValuesMmolPerCm3).toContain(10);
  });

  it("filters colormap layers up to selected time", () => {
    const panel = buildConcentrationColormapPanel("10uA", mockResult, 24, 69.6, 3);
    const partial = colormapPanelAtTime(panel, mockResult, 50);
    expect(partial.profileLayers.length).toBeGreaterThanOrEqual(2);
    expect(partial.profileLayers.at(-1)?.timeS).toBeCloseTo(50, 6);
  });
});
