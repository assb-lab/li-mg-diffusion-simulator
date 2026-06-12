import { resolveDiffusionCoeffCm2PerS, type SimulationBaseFormState } from "@li-mg/shared";
import { FormSection } from "../layout/FormSection";
import { AnodePresetSelector } from "./AnodePresetSelector";

interface BaseSimulationFormProps {
  value: SimulationBaseFormState;
  onChange: (next: SimulationBaseFormState) => void;
  showAdvanced?: boolean;
}

export function BaseSimulationForm({
  value,
  onChange,
  showAdvanced = true,
}: BaseSimulationFormProps) {
  function update<K extends keyof SimulationBaseFormState>(
    key: K,
    nextValue: SimulationBaseFormState[K],
  ) {
    onChange({ ...value, [key]: nextValue });
  }

  const resolvedDiffusion =
    value.diffusionMode === "arrhenius"
      ? resolveDiffusionCoeffCm2PerS(value)
      : value.diffusionCoeffCm2PerS;

  return (
    <div className="simulation-form-grouped">
      <FormSection
        title="Material"
        description="Anode composition, initial Li concentration, and beta-phase lower bound."
      >
        <AnodePresetSelector value={value} onChange={onChange} />
        <div className="form-fields-grid">
          <label>
            Initial Li concentration (mmol cm⁻³)
            <input
              type="number"
              value={value.initialConcentrationMmolPerCm3}
              onChange={(event) =>
                update("initialConcentrationMmolPerCm3", Number(event.target.value))
              }
            />
          </label>
          <label>
            Beta lower bound (mmol cm⁻³)
            <input
              type="number"
              value={value.betaLowerBoundMmolPerCm3}
              onChange={(event) => update("betaLowerBoundMmolPerCm3", Number(event.target.value))}
            />
          </label>
        </div>
      </FormSection>

      <FormSection title="Geometry" description="Electrode thickness along the diffusion axis.">
        <div className="form-fields-grid">
          <label>
            Thickness (µm)
            <input
              type="number"
              value={value.thicknessUm}
              onChange={(event) => update("thicknessUm", Number(event.target.value))}
            />
          </label>
        </div>
      </FormSection>

      <FormSection
        title="Diffusion transport"
        description="Effective Li diffusion coefficient. Use Arrhenius mode when temperature is swept."
      >
        <fieldset className="diffusion-mode-fieldset">
          <legend>Diffusion coefficient mode</legend>
          <label className="radio-inline">
            <input
              type="radio"
              name="diffusionMode"
              value="manual"
              checked={value.diffusionMode === "manual"}
              onChange={() => update("diffusionMode", "manual")}
            />
            Manual D
          </label>
          <label className="radio-inline">
            <input
              type="radio"
              name="diffusionMode"
              value="arrhenius"
              checked={value.diffusionMode === "arrhenius"}
              onChange={() => update("diffusionMode", "arrhenius")}
            />
            Arrhenius D(T)
          </label>
        </fieldset>
        <div className="form-fields-grid">
          <label>
            Temperature (°C)
            <input
              type="number"
              value={value.temperatureC}
              onChange={(event) => update("temperatureC", Number(event.target.value))}
            />
          </label>
          <label>
            Diffusion coefficient (cm² s⁻¹)
            <input
              type="number"
              step="any"
              value={resolvedDiffusion}
              readOnly={value.diffusionMode === "arrhenius"}
              onChange={(event) => update("diffusionCoeffCm2PerS", Number(event.target.value))}
            />
          </label>
        </div>
      </FormSection>

      {showAdvanced ? (
        <FormSection
          title="Solver"
          description="Spatial discretization and maximum integration time."
        >
          <div className="form-fields-grid">
            <label>
              Grid count
              <input
                type="number"
                value={value.gridCount}
                onChange={(event) => update("gridCount", Number(event.target.value))}
              />
            </label>
            <label>
              Max time (s)
              <input
                type="number"
                value={value.maxTimeS}
                onChange={(event) => update("maxTimeS", Number(event.target.value))}
              />
            </label>
          </div>
        </FormSection>
      ) : null}
    </div>
  );
}
