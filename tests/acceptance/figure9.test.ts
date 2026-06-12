import { FIGURE9_CASES, buildFigure9SimulationParams } from "@li-mg/shared";
import { initDiffusionWasm, simulateDiffusion } from "@li-mg/shared/wasm/adapter";
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

describe("Figure 9 acceptance", () => {
  for (const caseDef of FIGURE9_CASES) {
    it(`${caseDef.label} beta utilization within ±5pp of ${caseDef.targetBetaUtilizationPercent}%`, () => {
      const params = buildFigure9SimulationParams(caseDef.label);
      const result = simulateDiffusion(params);
      const betaPercent = result.betaPhaseUtilization * 100;
      expect(Math.abs(betaPercent - caseDef.targetBetaUtilizationPercent)).toBeLessThanOrEqual(5);
    });
  }
});
