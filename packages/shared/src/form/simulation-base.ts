import { calculateDiffusionCoeffArrhenius, DEFAULT_ARRHENIUS_INPUT } from "../arrhenius/arrhenius";
import { getDefaultAnodePreset } from "../presets/anode-presets";
import { FIGURE9_PRESET } from "../presets/figure9";
import type { ArrheniusInput } from "../types/simulation";
import { celsiusToKelvin } from "../units/units";

const defaultAnodePreset = getDefaultAnodePreset();

export type DiffusionMode = "manual" | "arrhenius";

export interface SimulationBaseFormState {
  thicknessUm: number;
  diffusionMode: DiffusionMode;
  diffusionCoeffCm2PerS: number;
  temperatureC: number;
  initialConcentrationMmolPerCm3: number;
  betaLowerBoundMmolPerCm3: number;
  gridCount: number;
  maxTimeS: number;
}

export const DEFAULT_BASE_FORM_STATE: SimulationBaseFormState = {
  thicknessUm: FIGURE9_PRESET.thicknessUm,
  diffusionMode: "manual",
  temperatureC: 25,
  initialConcentrationMmolPerCm3: defaultAnodePreset.c0MmolCm3,
  betaLowerBoundMmolPerCm3: defaultAnodePreset.betaLowerBoundMmolCm3,
  diffusionCoeffCm2PerS: defaultAnodePreset.diffusionCm2S,
  gridCount: FIGURE9_PRESET.gridCount,
  maxTimeS: FIGURE9_PRESET.maxTimeS,
};

export function resolveDiffusionCoeffCm2PerS(
  base: Pick<SimulationBaseFormState, "diffusionMode" | "diffusionCoeffCm2PerS" | "temperatureC">,
  arrhenius: ArrheniusInput = DEFAULT_ARRHENIUS_INPUT,
): number {
  if (base.diffusionMode === "manual") {
    return base.diffusionCoeffCm2PerS;
  }

  return calculateDiffusionCoeffArrhenius({
    ...arrhenius,
    temperatureK: celsiusToKelvin(base.temperatureC),
  });
}

export function buildNumericRange(min: number, max: number, step: number): number[] {
  if (step <= 0) {
    throw new Error("step must be positive");
  }
  if (max < min) {
    throw new Error("max must be greater than or equal to min");
  }

  const values: number[] = [];
  for (let value = min; value <= max + step / 2; value += step) {
    values.push(Number(value.toFixed(6)));
  }
  return values;
}
