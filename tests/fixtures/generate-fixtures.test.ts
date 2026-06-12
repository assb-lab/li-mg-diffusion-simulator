import { buildFigure9SimulationParams } from "@li-mg/shared";
import { initDiffusionWasm, simulateDiffusion } from "@li-mg/shared/wasm/adapter";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, it } from "vitest";

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

describe("generate fixtures", () => {
  it("writes Figure 9 regression fixtures", () => {
    const dir = path.resolve(__dirname);
    mkdirSync(dir, { recursive: true });
    for (const label of ["10uA", "100uA", "1mA"] as const) {
      const params = buildFigure9SimulationParams(label);
      const result = simulateDiffusion(params);
      writeFileSync(
        path.join(dir, `figure9-${label}.json`),
        JSON.stringify({ params, result }, null, 2),
      );
    }
  });
});
