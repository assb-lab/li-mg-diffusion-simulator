import {
  buildSimulationParamsFromBase,
  currentDensityMaCm2ToAcm2,
  currentDensityUaCm2ToAcm2,
  DEFAULT_BASE_FORM_STATE,
  type SimulationBaseFormState,
  type SimulationParams,
} from "@li-mg/shared";

export type CurrentDensityUnit = "uAcm2" | "mAcm2";

export interface SimulationFormState extends SimulationBaseFormState {
  currentDensity: number;
  currentDensityUnit: CurrentDensityUnit;
}

export const DEFAULT_FORM_STATE: SimulationFormState = {
  ...DEFAULT_BASE_FORM_STATE,
  currentDensity: 100,
  currentDensityUnit: "uAcm2",
};

export function formStateToSimulationParams(form: SimulationFormState): SimulationParams {
  const currentDensityAcm2 =
    form.currentDensityUnit === "mAcm2"
      ? currentDensityMaCm2ToAcm2(form.currentDensity)
      : currentDensityUaCm2ToAcm2(form.currentDensity);

  return buildSimulationParamsFromBase(form, currentDensityAcm2);
}
