import { FormSection } from "../layout/FormSection";
import { BaseSimulationForm } from "./BaseSimulationForm";
import type { SimulationFormState, CurrentDensityUnit } from "./simulationFormViewModel";

interface SimulationFormProps {
  value: SimulationFormState;
  onChange: (next: SimulationFormState) => void;
}

export function SimulationForm({ value, onChange }: SimulationFormProps) {
  function updateCurrent<K extends "currentDensity" | "currentDensityUnit">(
    key: K,
    nextValue: SimulationFormState[K],
  ) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <form className="simulation-form-wrapper" onSubmit={(event) => event.preventDefault()}>
      <BaseSimulationForm
        value={value}
        onChange={(base) => onChange({ ...value, ...base })}
        showAdvanced
      />
      <FormSection
        title="Loading conditions"
        description="Galvanostatic current density applied at the electrolyte interface."
      >
        <div className="form-fields-grid">
          <label>
            Current density
            <input
              type="number"
              value={value.currentDensity}
              onChange={(event) => updateCurrent("currentDensity", Number(event.target.value))}
            />
          </label>
          <label>
            Unit
            <select
              value={value.currentDensityUnit}
              onChange={(event) =>
                updateCurrent("currentDensityUnit", event.target.value as CurrentDensityUnit)
              }
            >
              <option value="uAcm2">µA cm⁻²</option>
              <option value="mAcm2">mA cm⁻²</option>
            </select>
          </label>
        </div>
      </FormSection>
    </form>
  );
}
