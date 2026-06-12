import {
  DEFAULT_BETA_LOWER_BOUND_MMOL_PER_CM3,
  DEFAULT_DIFFUSION_COEFF_CM2_PER_S,
  DEFAULT_INITIAL_CONCENTRATION_MMOL_PER_CM3,
  MODEL_VERSION,
} from "../constants/physical";
import type { Figure9Case, SimulationParams } from "../types/simulation";
import { currentDensityMaCm2ToAcm2, currentDensityUaCm2ToAcm2 } from "../units/units";

export const FIGURE9_PRESET: Omit<SimulationParams, "currentDensityAcm2" | "temperatureC"> = {
  modelVersion: MODEL_VERSION,
  thicknessUm: 25,
  diffusionCoeffCm2PerS: DEFAULT_DIFFUSION_COEFF_CM2_PER_S,
  initialConcentrationMmolPerCm3: DEFAULT_INITIAL_CONCENTRATION_MMOL_PER_CM3,
  betaLowerBoundMmolPerCm3: DEFAULT_BETA_LOWER_BOUND_MMOL_PER_CM3,
  gridCount: 201,
  dtS: 50,
  maxTimeS: 1e8,
  savedProfileCount: 30,
};

export const FIGURE9_CASES: Figure9Case[] = [
  {
    label: "10uA",
    currentDensityAcm2: currentDensityUaCm2ToAcm2(10),
    targetBetaUtilizationPercent: 93,
    targetTotalUtilizationPercent: 61,
  },
  {
    label: "100uA",
    currentDensityAcm2: currentDensityUaCm2ToAcm2(100),
    targetBetaUtilizationPercent: 41,
    targetTotalUtilizationPercent: 27,
  },
  {
    label: "1mA",
    currentDensityAcm2: currentDensityMaCm2ToAcm2(1),
    targetBetaUtilizationPercent: 9,
    targetTotalUtilizationPercent: 6,
  },
];

export function buildFigure9SimulationParams(caseLabel: Figure9Case["label"]): SimulationParams {
  const caseDef = FIGURE9_CASES.find((c) => c.label === caseLabel);
  if (!caseDef) {
    throw new Error(`Unknown Figure 9 case: ${caseLabel}`);
  }
  return {
    ...FIGURE9_PRESET,
    currentDensityAcm2: caseDef.currentDensityAcm2,
  };
}
