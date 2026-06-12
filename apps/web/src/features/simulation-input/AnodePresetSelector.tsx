import {
  anodePresets,
  applyAnodePresetToBaseForm,
  findMatchingAnodePresetId,
  getAnodePresetById,
  modelApplicabilityLabel,
  type AnodePresetId,
  type SimulationBaseFormState,
} from "@li-mg/shared";
import type { ChangeEvent } from "react";

interface AnodePresetSelectorProps<T extends SimulationBaseFormState> {
  value: T;
  onChange: (next: T) => void;
}

export function AnodePresetSelector<T extends SimulationBaseFormState>({
  value,
  onChange,
}: AnodePresetSelectorProps<T>) {
  const selectedId = findMatchingAnodePresetId(value);
  const selectedPreset = selectedId === "custom" ? undefined : getAnodePresetById(selectedId);

  function handlePresetChange(event: ChangeEvent<HTMLSelectElement>) {
    const presetId = event.target.value as AnodePresetId | "custom";
    if (presetId === "custom") {
      return;
    }

    const preset = getAnodePresetById(presetId);
    if (!preset) {
      return;
    }

    onChange(applyAnodePresetToBaseForm(value, preset));
  }

  return (
    <div className="anode-preset-selector">
      <label>
        Anode preset
        <select value={selectedId} onChange={handlePresetChange}>
          {anodePresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label} ({preset.composition})
            </option>
          ))}
          {selectedId === "custom" ? <option value="custom">Custom</option> : null}
        </select>
      </label>
      {selectedPreset ? (
        <p className="preset-applicability">
          {modelApplicabilityLabel(selectedPreset.modelApplicability)}
        </p>
      ) : (
        <p className="preset-applicability">Custom material parameters (not a named preset)</p>
      )}
    </div>
  );
}
