import { buildFigure9SimulationParams } from "@li-mg/shared";
import {
  initDiffusionWasm,
  simulateDiffusion,
  simulateFigure9Preset,
} from "@li-mg/shared/wasm/adapter";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await initDiffusionWasm(async () => {
    const wasm = await import("../../packages/diffusion-core/pkg/diffusion_core.js");
    return wasm as {
      simulate_diffusion_json: (paramsJson: string) => string;
      simulate_figure9_preset_json: () => string;
      simulate_utilization_sweep_json: (paramsJson: string) => string;
      calculate_diffusion_coeff_arrhenius_json: (inputJson: string) => number;
    };
  });
});

describe("WASM integration", () => {
  it("runs Figure 9 10 uA/cm2 case via WASM", () => {
    const params = buildFigure9SimulationParams("10uA");
    const result = simulateDiffusion(params);
    expect(result.betaPhaseUtilization * 100).toBeGreaterThan(80);
    expect(result.stopReason).toBe("BetaLowerBoundReached");
  });

  it("returns typed error for invalid thickness", () => {
    const params = buildFigure9SimulationParams("10uA");
    expect(() => simulateDiffusion({ ...params, thicknessUm: -1 })).toThrow();
  });

  it("runs full Figure 9 preset via WASM", () => {
    const figure9 = simulateFigure9Preset();
    expect(figure9.cases).toHaveLength(3);
  });
});
