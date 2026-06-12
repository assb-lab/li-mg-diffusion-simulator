import {
  ACTIVATION_ENERGY_EV,
  DEFAULT_ARRHENIUS_INPUT,
  DEFAULT_DIFFUSION_COEFF_CM2_PER_S,
  FIGURE9_PRESET,
  MODEL_VERSION,
} from "@li-mg/shared";
import { initDiffusionWasm, simulateUtilizationSweep } from "@li-mg/shared/wasm/adapter";
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

function runSweep() {
  return simulateUtilizationSweep({
    base: {
      modelVersion: MODEL_VERSION,
      thicknessUm: FIGURE9_PRESET.thicknessUm,
      initialConcentrationMmolPerCm3: FIGURE9_PRESET.initialConcentrationMmolPerCm3,
      betaLowerBoundMmolPerCm3: FIGURE9_PRESET.betaLowerBoundMmolPerCm3,
      gridCount: FIGURE9_PRESET.gridCount,
      dtS: FIGURE9_PRESET.dtS,
      maxTimeS: FIGURE9_PRESET.maxTimeS,
      savedProfileCount: 5,
    },
    currentDensityAcm2Values: [1e-5, 1e-4, 1e-3],
    temperatureCValues: [0, 50, 100],
    arrhenius: {
      ...DEFAULT_ARRHENIUS_INPUT,
      activationEnergyEv: ACTIVATION_ENERGY_EV,
      diffusionRefCm2PerS: DEFAULT_DIFFUSION_COEFF_CM2_PER_S,
    },
  });
}

describe("Figure 10 acceptance", () => {
  it("utilization increases with temperature at fixed current density", () => {
    const result = runSweep();
    const col = 1;
    const low = result.betaPhaseUtilizationMatrix[0]?.[col] ?? 0;
    const high = result.betaPhaseUtilizationMatrix[2]?.[col] ?? 0;
    expect(high).toBeGreaterThan(low);
  });

  it("utilization decreases with current density at fixed temperature", () => {
    const result = runSweep();
    const row = 1;
    const lowCurrent = result.betaPhaseUtilizationMatrix[row]?.[0] ?? 0;
    const highCurrent = result.betaPhaseUtilizationMatrix[row]?.[2] ?? 0;
    expect(lowCurrent).toBeGreaterThan(highCurrent);
  });
});
