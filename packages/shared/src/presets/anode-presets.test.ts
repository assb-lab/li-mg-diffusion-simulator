import { describe, expect, it } from "vitest";
import { DEFAULT_BASE_FORM_STATE } from "../form/simulation-base";
import {
  anodePresets,
  applyAnodePresetToBaseForm,
  findMatchingAnodePresetId,
  getAnodePresetById,
  getDefaultAnodePreset,
} from "./anode-presets";

describe("anodePresets", () => {
  it("defines four composition presets", () => {
    expect(anodePresets).toHaveLength(4);
    expect(anodePresets.map((preset) => preset.id)).toEqual([
      "li-metal-reference",
      "li095mg005",
      "li09mg01-eff",
      "li09mg01-fig9",
    ]);
  });

  it("uses beta lower bound 0 for Li metal reference", () => {
    const li = getAnodePresetById("li-metal-reference");
    expect(li?.betaLowerBoundMmolCm3).toBe(0);
    expect(li?.c0MmolCm3).toBe(76.8);
  });

  it("applies preset values to base form state", () => {
    const preset = getDefaultAnodePreset();
    const next = applyAnodePresetToBaseForm(DEFAULT_BASE_FORM_STATE, preset);
    expect(next.initialConcentrationMmolPerCm3).toBe(69.6);
    expect(next.betaLowerBoundMmolPerCm3).toBe(24);
    expect(next.diffusionCoeffCm2PerS).toBe(3e-11);
  });

  it("detects matching preset from base form values", () => {
    expect(findMatchingAnodePresetId(DEFAULT_BASE_FORM_STATE)).toBe("li09mg01-fig9");
    expect(
      findMatchingAnodePresetId({
        ...DEFAULT_BASE_FORM_STATE,
        initialConcentrationMmolPerCm3: 76.8,
        betaLowerBoundMmolPerCm3: 0,
        diffusionCoeffCm2PerS: 0.8e-11,
      }),
    ).toBe("li-metal-reference");
    expect(
      findMatchingAnodePresetId({
        ...DEFAULT_BASE_FORM_STATE,
        diffusionCoeffCm2PerS: 9e-11,
      }),
    ).toBe("custom");
  });
});
