import {
  buildSimulationParamsFromBase,
  FIGURE9_CASES,
  type Figure9Result,
  type SimulationBaseFormState,
} from "@li-mg/shared";
import { simulateDiffusion } from "@li-mg/shared/wasm/adapter";

export function runFigure9WithBase(base: SimulationBaseFormState): Figure9Result {
  return {
    cases: FIGURE9_CASES.map((caseDef) => {
      const params = buildSimulationParamsFromBase(base, caseDef.currentDensityAcm2);
      return {
        label: caseDef.label,
        currentDensityAcm2: caseDef.currentDensityAcm2,
        result: simulateDiffusion(params),
      };
    }),
  };
}
