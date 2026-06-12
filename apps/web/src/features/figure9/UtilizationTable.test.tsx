import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UtilizationTable } from "./UtilizationTable";

describe("UtilizationTable", () => {
  it("shows pass/fail with units in headers", () => {
    render(
      <UtilizationTable
        result={{
          cases: [
            {
              label: "10uA",
              currentDensityAcm2: 1e-5,
              result: {
                modelVersion: "0.1.0",
                solverVersion: "0.1.0",
                xUm: [0],
                profiles: [],
                stopTimeS: 1,
                stopReason: "BetaLowerBoundReached",
                betaPhaseUtilization: 0.93,
                totalLiUtilization: 0.61,
                strippedCapacityMahPerCm2: 0.1,
                interfaceConcentrationMmolPerCm3: 24,
                massBalanceRelativeError: 0.001,
              },
            },
          ],
        }}
      />,
    );
    expect(screen.getByText(/Current density \(A cm/)).toBeInTheDocument();
    expect(screen.getByText(/Time to β lower bound/)).toBeInTheDocument();
    expect(screen.getByText("1.0 s")).toBeInTheDocument();
    expect(screen.getByText("pass")).toBeInTheDocument();
  });
});
