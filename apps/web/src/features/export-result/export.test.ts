import { buildFigure9SimulationParams } from "@li-mg/shared";
import { describe, expect, it, vi } from "vitest";
import { buildSimulationExport, downloadTextFile, exportJson, exportProfileCsv } from "./export";

describe("export", () => {
  const params = buildFigure9SimulationParams("10uA");
  const result = {
    modelVersion: "0.1.0",
    solverVersion: "0.1.0",
    xUm: [0, 25],
    profiles: [{ timeS: 0, concentrationsMmolPerCm3: [69.6, 50] }],
    stopTimeS: 100,
    stopReason: "BetaLowerBoundReached" as const,
    betaPhaseUtilization: 0.9,
    totalLiUtilization: 0.6,
    strippedCapacityMahPerCm2: 0.1,
    interfaceConcentrationMmolPerCm3: 50,
    massBalanceRelativeError: 0.001,
  };

  it("builds reproducible JSON export", () => {
    const payload = buildSimulationExport(params, result);
    const json = exportJson(payload);
    const parsed = JSON.parse(json) as { params: typeof params; result: typeof result };
    expect(parsed.params.currentDensityAcm2).toBeCloseTo(params.currentDensityAcm2);
    expect(parsed.result.betaPhaseUtilization).toBe(0.9);
  });

  it("exports CSV with axis units in header", () => {
    const csv = exportProfileCsv(result);
    expect(csv.split("\n")[0]).toBe("time_s,x_um,concentration_mmol_cm3");
  });

  it("downloads a text file", () => {
    const click = vi.fn();
    const anchor = { click, href: "", download: "" } as unknown as HTMLAnchorElement;
    vi.spyOn(document, "createElement").mockReturnValue(anchor);
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:mock"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });

    downloadTextFile("test.json", "{}", "application/json");
    expect(click).toHaveBeenCalled();
  });
});
