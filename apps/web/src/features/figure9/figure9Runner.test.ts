import { DEFAULT_BASE_FORM_STATE } from "@li-mg/shared";
import { describe, expect, it, vi } from "vitest";
import { runFigure9WithBase } from "./figure9Runner";

vi.mock("@li-mg/shared/wasm/adapter", () => ({
  simulateDiffusion: vi.fn((params) => ({
    modelVersion: "0.1.0",
    solverVersion: "0.1.0",
    xUm: [0, params.thicknessUm],
    profiles: [],
    stopTimeS: 1,
    stopReason: "BetaLowerBoundReached",
    betaPhaseUtilization: 0.5,
    totalLiUtilization: 0.3,
    strippedCapacityMahPerCm2: 0.1,
    interfaceConcentrationMmolPerCm3: 24,
    massBalanceRelativeError: 0.001,
  })),
}));

describe("runFigure9WithBase", () => {
  it("applies custom thickness to all three cases", async () => {
    const { simulateDiffusion } = await import("@li-mg/shared/wasm/adapter");
    runFigure9WithBase({ ...DEFAULT_BASE_FORM_STATE, thicknessUm: 40 });
    const calls = vi.mocked(simulateDiffusion).mock.calls;
    expect(calls).toHaveLength(3);
    for (const call of calls) {
      expect(call[0]?.thicknessUm).toBe(40);
    }
  });
});
