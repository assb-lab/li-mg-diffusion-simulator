import type {
  ArrheniusInput,
  Figure9Result,
  SimulationError,
  SimulationParams,
  SimulationResult,
  UtilizationSweepParams,
  UtilizationSweepResult,
} from "../types/simulation";
import { buildFigure9SimulationParams } from "../presets/figure9";

type WasmModule = {
  simulate_diffusion_json: (paramsJson: string) => string;
  simulate_figure9_preset_json: () => string;
  simulate_utilization_sweep_json: (paramsJson: string) => string;
  calculate_diffusion_coeff_arrhenius_json: (inputJson: string) => number;
};

let wasmModule: WasmModule | null = null;

function parseSimulationError(error: unknown): SimulationError {
  if (error instanceof Error) {
    try {
      return JSON.parse(error.message) as SimulationError;
    } catch {
      return { code: "NUMERICAL_FAILURE", message: error.message };
    }
  }
  return { code: "NUMERICAL_FAILURE", message: String(error) };
}

function callWasm<T>(fn: () => string): T {
  if (!wasmModule) {
    throw new Error("WASM module is not initialized");
  }
  try {
    return JSON.parse(fn()) as T;
  } catch (error) {
    const parsed = parseSimulationError(error);
    throw parsed;
  }
}

export async function initDiffusionWasm(importWasm: () => Promise<WasmModule>): Promise<void> {
  if (!wasmModule) {
    wasmModule = await importWasm();
  }
}

export function simulateDiffusion(params: SimulationParams): SimulationResult {
  return callWasm(() => wasmModule!.simulate_diffusion_json(JSON.stringify(params)));
}

export function simulateFigure9Preset(): Figure9Result {
  return callWasm(() => wasmModule!.simulate_figure9_preset_json());
}

export function simulateUtilizationSweep(params: UtilizationSweepParams): UtilizationSweepResult {
  return callWasm(() => wasmModule!.simulate_utilization_sweep_json(JSON.stringify(params)));
}

export function calculateDiffusionCoeffArrhenius(input: ArrheniusInput): number {
  if (!wasmModule) {
    throw new Error("WASM module is not initialized");
  }
  return wasmModule.calculate_diffusion_coeff_arrhenius_json(JSON.stringify(input));
}

export function buildFigure9WasmParams(caseLabel: "10uA" | "100uA" | "1mA"): SimulationParams {
  return buildFigure9SimulationParams(caseLabel);
}
