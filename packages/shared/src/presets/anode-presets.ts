import type { SimulationBaseFormState } from "../form/simulation-base";

export type ModelApplicability =
  | "reference-only"
  | "approximate"
  | "experimental-effective"
  | "figure9-reproduction";

export interface AnodePreset {
  id: string;
  label: string;
  composition: string;
  c0MmolCm3: number;
  diffusionCm2S: number;
  betaLowerBoundMmolCm3: number;
  modelApplicability: ModelApplicability;
}

export const DEFAULT_ANODE_PRESET_ID = "li09mg01-fig9";

export const anodePresets = [
  {
    id: "li-metal-reference",
    label: "Li metal reference",
    composition: "Li",
    c0MmolCm3: 76.8,
    diffusionCm2S: 0.8e-11,
    betaLowerBoundMmolCm3: 0,
    modelApplicability: "reference-only",
  },
  {
    id: "li095mg005",
    label: "Li0.95Mg0.05",
    composition: "Li0.95Mg0.05",
    c0MmolCm3: 73.2,
    diffusionCm2S: 1.4e-11,
    betaLowerBoundMmolCm3: 24.0,
    modelApplicability: "approximate",
  },
  {
    id: "li09mg01-eff",
    label: "Li0.9Mg0.1 experimental Deff",
    composition: "Li0.9Mg0.1",
    c0MmolCm3: 69.6,
    diffusionCm2S: 2.3e-11,
    betaLowerBoundMmolCm3: 24.0,
    modelApplicability: "experimental-effective",
  },
  {
    id: "li09mg01-fig9",
    label: "Li0.9Mg0.1 Fig.9 model",
    composition: "Li0.9Mg0.1",
    c0MmolCm3: 69.6,
    diffusionCm2S: 3.0e-11,
    betaLowerBoundMmolCm3: 24.0,
    modelApplicability: "figure9-reproduction",
  },
] as const satisfies readonly AnodePreset[];

export type AnodePresetId = (typeof anodePresets)[number]["id"];

export function getAnodePresetById(id: string): AnodePreset | undefined {
  return anodePresets.find((preset) => preset.id === id);
}

export function getDefaultAnodePreset(): AnodePreset {
  const preset = getAnodePresetById(DEFAULT_ANODE_PRESET_ID);
  if (!preset) {
    throw new Error(`Default anode preset not found: ${DEFAULT_ANODE_PRESET_ID}`);
  }
  return preset;
}

export function applyAnodePresetToBaseForm<T extends SimulationBaseFormState>(
  base: T,
  preset: AnodePreset,
): T {
  return {
    ...base,
    initialConcentrationMmolPerCm3: preset.c0MmolCm3,
    betaLowerBoundMmolPerCm3: preset.betaLowerBoundMmolCm3,
    diffusionCoeffCm2PerS: preset.diffusionCm2S,
  };
}

const PRESET_MATCH_TOLERANCE = 1e-12;

export function findMatchingAnodePresetId(
  base: Pick<
    SimulationBaseFormState,
    "initialConcentrationMmolPerCm3" | "betaLowerBoundMmolPerCm3" | "diffusionCoeffCm2PerS"
  >,
): AnodePresetId | "custom" {
  const match = anodePresets.find(
    (preset) =>
      Math.abs(preset.c0MmolCm3 - base.initialConcentrationMmolPerCm3) < PRESET_MATCH_TOLERANCE &&
      Math.abs(preset.betaLowerBoundMmolCm3 - base.betaLowerBoundMmolPerCm3) <
        PRESET_MATCH_TOLERANCE &&
      Math.abs(preset.diffusionCm2S - base.diffusionCoeffCm2PerS) < PRESET_MATCH_TOLERANCE,
  );

  return match?.id ?? "custom";
}

export function modelApplicabilityLabel(applicability: ModelApplicability): string {
  switch (applicability) {
    case "reference-only":
      return "Reference only (not validated for this model)";
    case "approximate":
      return "Approximate composition parameters";
    case "experimental-effective":
      return "Experimental effective diffusion coefficient";
    case "figure9-reproduction":
      return "Figure 9 reproduction parameters";
  }
}
