import { formatSimulationDurationS } from "@li-mg/shared";
import { simulateDiffusion } from "@li-mg/shared/wasm/adapter";
import type { SimulationResult } from "@li-mg/shared";
import { useState } from "react";
import { ensureWasmInitialized } from "../../wasm/init";
import {
  buildSimulationExport,
  downloadTextFile,
  exportJson,
  exportProfileCsv,
} from "../export-result/export";
import { PagePanel } from "../layout/PagePanel";
import { SimulationForm } from "../simulation-input/SimulationForm";
import {
  DEFAULT_FORM_STATE,
  formStateToSimulationParams,
  type SimulationFormState,
} from "../simulation-input/simulationFormViewModel";
import { ConcentrationChart } from "../figure9/ConcentrationChart";
import { selectTerminalProfile, toConcentrationChartSeries } from "../figure9/figure9ViewModel";

export function SingleSimulationPage() {
  const [form, setForm] = useState<SimulationFormState>(DEFAULT_FORM_STATE);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSimulation() {
    setLoading(true);
    setError(null);
    try {
      await ensureWasmInitialized();
      const params = formStateToSimulationParams(form);
      setResult(simulateDiffusion(params));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const lastProfile = result ? selectTerminalProfile(result) : undefined;
  const chartSeries =
    result && lastProfile
      ? {
          ...toConcentrationChartSeries("single", result.xUm, lastProfile),
          xMaxUm: form.thicknessUm,
          betaLowerBoundMmolPerCm3: form.betaLowerBoundMmolPerCm3,
          stopTimeLabel:
            result.stopReason === "BetaLowerBoundReached"
              ? formatSimulationDurationS(result.stopTimeS).label
              : undefined,
        }
      : null;

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Single simulation</h1>
        <p className="page-lead">
          Run one diffusion case with user-defined material and loading parameters.
        </p>
      </header>

      <PagePanel
        title="Simulation setup"
        description="Configure material, geometry, diffusion, and loading."
      >
        <SimulationForm value={form} onChange={setForm} />
        <div className="form-actions">
          <button type="button" onClick={() => void runSimulation()} disabled={loading}>
            {loading ? "Running..." : "Run simulation"}
          </button>
        </div>
      </PagePanel>

      {error ? <p role="alert">{error}</p> : null}

      {result ? (
        <>
          <PagePanel
            title="Summary"
            description="Utilization and stopping criterion at the end of the run."
          >
            <dl className="summary-card">
              <dt>Beta-phase utilization</dt>
              <dd>{(result.betaPhaseUtilization * 100).toFixed(1)}%</dd>
              <dt>Total Li utilization</dt>
              <dd>{(result.totalLiUtilization * 100).toFixed(1)}%</dd>
              <dt>
                {result.stopReason === "BetaLowerBoundReached"
                  ? "Time to β lower bound"
                  : "Stop time"}
              </dt>
              <dd>
                {formatSimulationDurationS(result.stopTimeS).label}
                <span className="summary-secondary"> ({result.stopTimeS.toFixed(0)} s)</span>
              </dd>
            </dl>
          </PagePanel>

          {chartSeries ? (
            <PagePanel
              title="Concentration profile"
              description="Terminal Li concentration profile c(x)."
            >
              <ConcentrationChart title="Concentration profile c_Li(x)" series={chartSeries} />
            </PagePanel>
          ) : null}

          <PagePanel title="Export">
            <div className="export-actions">
              <button
                type="button"
                onClick={() => {
                  const params = formStateToSimulationParams(form);
                  downloadTextFile(
                    "simulation.json",
                    exportJson(buildSimulationExport(params, result)),
                    "application/json",
                  );
                }}
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadTextFile("profiles.csv", exportProfileCsv(result), "text/csv")
                }
              >
                Export CSV
              </button>
            </div>
          </PagePanel>
        </>
      ) : null}
    </section>
  );
}
