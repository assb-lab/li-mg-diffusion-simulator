import type { SimulationBaseFormState } from "@li-mg/shared";
import { PagePanel } from "../layout/PagePanel";
import { BaseSimulationForm } from "../simulation-input/BaseSimulationForm";

interface Figure9BasePanelProps {
  base: SimulationBaseFormState;
  onBaseChange: (next: SimulationBaseFormState) => void;
  loading: boolean;
  onRun: () => void;
}

const FIGURE9_LOADING_CASES = [
  { label: "10 µA cm⁻²", note: "Low rate" },
  { label: "100 µA cm⁻²", note: "Medium rate" },
  { label: "1 mA cm⁻²", note: "High rate" },
] as const;

export function Figure9BasePanel({ base, onBaseChange, loading, onRun }: Figure9BasePanelProps) {
  return (
    <PagePanel
      title="Simulation setup"
      description="Configure material, geometry, and diffusion parameters. Loading conditions are fixed to the paper cases below."
    >
      <BaseSimulationForm value={base} onChange={onBaseChange} showAdvanced={false} />
      <aside className="info-card" aria-label="Fixed Figure 9 loading cases">
        <h3 className="info-card-title">Fixed loading cases</h3>
        <ul className="info-card-list">
          {FIGURE9_LOADING_CASES.map((item) => (
            <li key={item.label}>
              <span className="info-card-term">{item.label}</span>
              <span className="info-card-detail">{item.note}</span>
            </li>
          ))}
        </ul>
      </aside>
      <div className="form-actions">
        <button type="button" onClick={onRun} disabled={loading}>
          {loading ? "Running..." : "Run validation"}
        </button>
      </div>
    </PagePanel>
  );
}
