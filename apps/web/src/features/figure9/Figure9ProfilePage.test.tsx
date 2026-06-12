import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Figure9ProfilePage } from "./Figure9ProfilePage";

vi.mock("../../wasm/init", () => ({
  ensureWasmInitialized: vi.fn().mockResolvedValue(undefined),
}));

const runFigure9WithBase = vi.fn(() => ({
  cases: [
    {
      label: "10uA",
      currentDensityAcm2: 1e-5,
      result: {
        modelVersion: "0.1.0",
        solverVersion: "0.1.0",
        xUm: [0, 25],
        profiles: [
          { timeS: 0, concentrationsMmolPerCm3: [69.6, 69.6] },
          { timeS: 100, concentrationsMmolPerCm3: [69.6, 24] },
        ],
        stopTimeS: 100,
        stopReason: "BetaLowerBoundReached",
        betaPhaseUtilization: 0.93,
        totalLiUtilization: 0.61,
        strippedCapacityMahPerCm2: 0.1,
        interfaceConcentrationMmolPerCm3: 24,
        massBalanceRelativeError: 0.001,
      },
    },
  ],
}));

vi.mock("./figure9Runner", () => ({
  runFigure9WithBase: (...args: unknown[]) => runFigure9WithBase(...args),
}));

describe("Figure9ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows time seek bar and concentration chart", async () => {
    render(<Figure9ProfilePage />);
    await waitFor(() => {
      expect(screen.getByRole("slider", { name: /Simulation time seek/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/Concentration profile \(10uA\)/)).toBeInTheDocument();
  });
});
