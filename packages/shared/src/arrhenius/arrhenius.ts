import {
  ACTIVATION_ENERGY_EV,
  BOLTZMANN_EV_PER_K,
  DEFAULT_DIFFUSION_COEFF_CM2_PER_S,
} from "../constants/physical";
import type { ArrheniusInput } from "../types/simulation";

export function calculateDiffusionCoeffArrhenius(input: ArrheniusInput): number {
  const { diffusionRefCm2PerS, temperatureRefK, temperatureK, activationEnergyEv } = input;
  if (temperatureK <= 0 || temperatureRefK <= 0) {
    throw new Error("Temperature must be positive in Kelvin");
  }
  const exponent =
    (-activationEnergyEv / BOLTZMANN_EV_PER_K) * (1 / temperatureK - 1 / temperatureRefK);
  return diffusionRefCm2PerS * Math.exp(exponent);
}

export const DEFAULT_ARRHENIUS_INPUT: ArrheniusInput = {
  diffusionRefCm2PerS: DEFAULT_DIFFUSION_COEFF_CM2_PER_S,
  temperatureRefK: 298.15,
  temperatureK: 298.15,
  activationEnergyEv: ACTIVATION_ENERGY_EV,
};
