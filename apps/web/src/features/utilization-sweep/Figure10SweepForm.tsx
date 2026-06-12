import { FormSection } from "../layout/FormSection";
import { BaseSimulationForm } from "../simulation-input/BaseSimulationForm";
import type { Figure10SweepFormState } from "./figure10SweepFormViewModel";

interface Figure10SweepFormProps {
  value: Figure10SweepFormState;
  onChange: (next: Figure10SweepFormState) => void;
}

export function Figure10SweepForm({ value, onChange }: Figure10SweepFormProps) {
  function update<K extends keyof Figure10SweepFormState>(
    key: K,
    nextValue: Figure10SweepFormState[K],
  ) {
    onChange({ ...value, [key]: nextValue });
  }

  return (
    <form className="simulation-form-wrapper" onSubmit={(event) => event.preventDefault()}>
      <BaseSimulationForm
        value={{ ...value, diffusionMode: "arrhenius" }}
        onChange={(base) => onChange({ ...value, ...base, diffusionMode: "arrhenius" })}
        showAdvanced
      />
      <FormSection
        title="Temperature sweep"
        description="Arrhenius D(T) is evaluated at each temperature (Ea = 0.57 eV)."
      >
        <div className="form-fields-grid">
          <label>
            Min (°C)
            <input
              type="number"
              value={value.temperatureMinC}
              onChange={(event) => update("temperatureMinC", Number(event.target.value))}
            />
          </label>
          <label>
            Max (°C)
            <input
              type="number"
              value={value.temperatureMaxC}
              onChange={(event) => update("temperatureMaxC", Number(event.target.value))}
            />
          </label>
          <label>
            Step (°C)
            <input
              type="number"
              value={value.temperatureStepC}
              onChange={(event) => update("temperatureStepC", Number(event.target.value))}
            />
          </label>
        </div>
      </FormSection>
      <FormSection
        title="Current density sweep"
        description="Log-uniform spacing between minimum and maximum loading."
      >
        <div className="form-fields-grid">
          <label>
            Min (µA cm⁻²)
            <input
              type="number"
              value={value.currentDensityMinUaCm2}
              onChange={(event) => update("currentDensityMinUaCm2", Number(event.target.value))}
            />
          </label>
          <label>
            Max (mA cm⁻²)
            <input
              type="number"
              value={value.currentDensityMaxMaCm2}
              onChange={(event) => update("currentDensityMaxMaCm2", Number(event.target.value))}
            />
          </label>
          <label>
            Steps
            <input
              type="number"
              value={value.currentDensitySteps}
              onChange={(event) => update("currentDensitySteps", Number(event.target.value))}
            />
          </label>
        </div>
      </FormSection>
    </form>
  );
}
