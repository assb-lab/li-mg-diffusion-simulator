import { FIGURE9_PRESET } from "../presets/figure9";
import { simulationParamsSchema } from "../schema/simulation-params";
import type { SimulationParams } from "../types/simulation";
import { MODEL_VERSION } from "../constants/physical";
import { resolveDiffusionCoeffCm2PerS, type SimulationBaseFormState } from "./simulation-base";

export function buildSimulationParamsFromBase(
  base: SimulationBaseFormState,
  currentDensityAcm2: number,
  savedProfileCount = 30,
): SimulationParams {
  const params: SimulationParams = {
    modelVersion: MODEL_VERSION,
    thicknessUm: base.thicknessUm,
    currentDensityAcm2,
    diffusionCoeffCm2PerS: resolveDiffusionCoeffCm2PerS(base),
    initialConcentrationMmolPerCm3: base.initialConcentrationMmolPerCm3,
    betaLowerBoundMmolPerCm3: base.betaLowerBoundMmolPerCm3,
    temperatureC: base.temperatureC,
    gridCount: base.gridCount,
    dtS: FIGURE9_PRESET.dtS,
    maxTimeS: base.maxTimeS,
    savedProfileCount,
  };

  const parsed = simulationParamsSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid simulation parameters");
  }

  return parsed.data;
}
