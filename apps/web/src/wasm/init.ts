import { initDiffusionWasm } from "@li-mg/shared/wasm/adapter";

let initPromise: Promise<void> | null = null;

export function ensureWasmInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = initDiffusionWasm(async () => {
      const wasm = await import("../../../../packages/diffusion-core/pkg/diffusion_core.js");
      return wasm as {
        simulate_diffusion_json: (paramsJson: string) => string;
        simulate_figure9_preset_json: () => string;
        simulate_utilization_sweep_json: (paramsJson: string) => string;
        calculate_diffusion_coeff_arrhenius_json: (inputJson: string) => number;
      };
    });
  }
  return initPromise;
}
