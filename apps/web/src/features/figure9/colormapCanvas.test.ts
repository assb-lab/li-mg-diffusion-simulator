import { describe, expect, it, vi } from "vitest";
import { buildConcentrationColormapPanel } from "./figure9ViewModel";
import { renderColormapToCanvas } from "./colormapCanvas";

describe("renderColormapToCanvas", () => {
  it("draws raster canvas without throwing for a typical panel", () => {
    const panel = buildConcentrationColormapPanel(
      "10uA",
      {
        modelVersion: "0.1.0",
        solverVersion: "0.1.0",
        xUm: Array.from({ length: 11 }, (_, index) => index * 2.5),
        profiles: [
          { timeS: 0, concentrationsMmolPerCm3: Array.from({ length: 11 }, () => 69.6) },
          {
            timeS: 100,
            concentrationsMmolPerCm3: Array.from({ length: 11 }, (_, i) => 69.6 - i * 4),
          },
        ],
        stopTimeS: 100,
        stopReason: "BetaLowerBoundReached",
        betaPhaseUtilization: 0.5,
        totalLiUtilization: 0.3,
        strippedCapacityMahPerCm2: 0.1,
        interfaceConcentrationMmolPerCm3: 24,
        massBalanceRelativeError: 0.001,
      },
      24,
      69.6,
      12,
    );

    const canvas = {
      width: 0,
      height: 0,
      style: {} as CSSStyleDeclaration,
      getContext: vi.fn(() => ({
        setTransform: vi.fn(),
        clearRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        strokeRect: vi.fn(),
        setLineDash: vi.fn(),
        fillText: vi.fn(),
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 1,
        font: "",
        textAlign: "left",
        textBaseline: "alphabetic",
      })),
    } as unknown as HTMLCanvasElement;

    expect(() =>
      renderColormapToCanvas(canvas, panel, {
        width: 480,
        height: 320,
        padding: { top: 12, right: 16, bottom: 36, left: 52 },
      }),
    ).not.toThrow();
    expect(panel.profileLayers.length).toBe(12);
  });
});
