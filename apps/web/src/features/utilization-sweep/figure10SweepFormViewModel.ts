import {
  ACTIVATION_ENERGY_EV,
  buildNumericRange,
  buildSimulationParamsFromBase,
  currentDensityMaCm2ToAcm2,
  currentDensityUaCm2ToAcm2,
  DEFAULT_ARRHENIUS_INPUT,
  DEFAULT_BASE_FORM_STATE,
  MODEL_VERSION,
  type SimulationBaseFormState,
  type UtilizationSweepParams,
} from "@li-mg/shared";

export interface Figure10SweepFormState extends SimulationBaseFormState {
  temperatureMinC: number;
  temperatureMaxC: number;
  temperatureStepC: number;
  currentDensityMinUaCm2: number;
  currentDensityMaxMaCm2: number;
  currentDensitySteps: number;
}

export const DEFAULT_FIGURE10_FORM_STATE: Figure10SweepFormState = {
  ...DEFAULT_BASE_FORM_STATE,
  diffusionMode: "arrhenius",
  temperatureMinC: 0,
  temperatureMaxC: 100,
  temperatureStepC: 25,
  currentDensityMinUaCm2: 10,
  currentDensityMaxMaCm2: 1,
  currentDensitySteps: 4,
};

export function buildCurrentDensityRange(
  minUaCm2: number,
  maxMaCm2: number,
  steps: number,
): number[] {
  if (steps < 2) {
    throw new Error("current density steps must be at least 2");
  }

  const minAcm2 = currentDensityUaCm2ToAcm2(minUaCm2);
  const maxAcm2 = currentDensityMaCm2ToAcm2(maxMaCm2);
  const step = (maxAcm2 - minAcm2) / (steps - 1);

  return Array.from({ length: steps }, (_, index) => minAcm2 + step * index);
}

export function figure10FormToSweepParams(form: Figure10SweepFormState): UtilizationSweepParams {
  return {
    base: {
      modelVersion: MODEL_VERSION,
      thicknessUm: form.thicknessUm,
      initialConcentrationMmolPerCm3: form.initialConcentrationMmolPerCm3,
      betaLowerBoundMmolPerCm3: form.betaLowerBoundMmolPerCm3,
      gridCount: form.gridCount,
      dtS: buildSimulationParamsFromBase(form, 1e-5).dtS,
      maxTimeS: form.maxTimeS,
      savedProfileCount: 10,
    },
    currentDensityAcm2Values: buildCurrentDensityRange(
      form.currentDensityMinUaCm2,
      form.currentDensityMaxMaCm2,
      form.currentDensitySteps,
    ),
    temperatureCValues: buildNumericRange(
      form.temperatureMinC,
      form.temperatureMaxC,
      form.temperatureStepC,
    ),
    arrhenius: {
      ...DEFAULT_ARRHENIUS_INPUT,
      activationEnergyEv: ACTIVATION_ENERGY_EV,
      diffusionRefCm2PerS: form.diffusionCoeffCm2PerS,
    },
  };
}
