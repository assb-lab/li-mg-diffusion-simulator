import { buildFigure9SimulationParams } from "@li-mg/shared";
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

describe("terminal concentration profile", () => {
  for (const label of ["10uA", "100uA", "1mA"] as const) {
    it(`${label} saves final profile at stop time with spatial gradient`, () => {
      const result = simulateDiffusion(buildFigure9SimulationParams(label));
      const last = result.profiles.at(-1)!;
      const concentrations = last.concentrationsMmolPerCm3;
      const min = Math.min(...concentrations);
      const max = Math.max(...concentrations);

      expect(last.timeS).toBeCloseTo(result.stopTimeS, 6);
      expect(max - min).toBeGreaterThan(1);
      expect(concentrations.at(-1)!).toBeLessThan(concentrations[0]!);
    });
  }
});
