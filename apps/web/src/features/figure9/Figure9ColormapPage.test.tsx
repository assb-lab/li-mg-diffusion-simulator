import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Figure9ColormapPage } from "./Figure9ColormapPage";

vi.mock("../../wasm/init", () => ({
  ensureWasmInitialized: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./figure9Runner", () => ({
  runFigure9WithBase: vi.fn(() => ({
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
  })),
}));

describe("Figure9ColormapPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders colormap panels after validation", async () => {
    render(<Figure9ColormapPage />);
    await waitFor(() => {
      expect(screen.getByLabelText(/Colormap 10uA/)).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: /Figure 9 — Colormap/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /Simulation time seek/i })).toBeInTheDocument();
  });
});
