import type { UtilizationSweepResult } from "@li-mg/shared";
import { simulateUtilizationSweep } from "@li-mg/shared/wasm/adapter";
import { useEffect, useMemo, useState } from "react";
import { PagePanel } from "../layout/PagePanel";
import { ensureWasmInitialized } from "../../wasm/init";
import { Figure10SweepForm } from "./Figure10SweepForm";
import {
  buildFigure10ChartByCurrentDensity,
  buildFigure10ChartByTemperature,
  buildFigure10SeriesByCurrentDensity,
  buildFigure10SeriesByTemperature,
  formatCurrentDensityAcm2Label,
} from "./figure10ChartViewModel";
import { Figure10UtilizationChart } from "./Figure10UtilizationChart";
import {
  DEFAULT_FIGURE10_FORM_STATE,
  figure10FormToSweepParams,
  type Figure10SweepFormState,
} from "./figure10SweepFormViewModel";

export function Figure10Page() {
  const [form, setForm] = useState<Figure10SweepFormState>(DEFAULT_FIGURE10_FORM_STATE);
  const [result, setResult] = useState<UtilizationSweepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSweep() {
    setLoading(true);
    setError(null);
    try {
      await ensureWasmInitialized();
      setResult(simulateUtilizationSweep(figure10FormToSweepParams(form)));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void runSweep();
  }, []);

  const chartByTemperature = useMemo(
    () => (result ? buildFigure10ChartByTemperature(result) : []),
    [result],
  );
  const chartByCurrentDensity = useMemo(
    () => (result ? buildFigure10ChartByCurrentDensity(result) : []),
    [result],
  );
  const seriesByCurrentDensity = useMemo(
    () => (result ? buildFigure10SeriesByCurrentDensity(result) : []),
    [result],
  );
  const seriesByTemperature = useMemo(
    () => (result ? buildFigure10SeriesByTemperature(result) : []),
    [result],
  );

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Figure 10 — Temperature sweep</h1>
        <p className="page-lead">
          Beta-phase utilization over temperature and current density with Arrhenius D(T).
        </p>
      </header>

      <PagePanel
        title="Simulation setup"
        description="Material parameters and 2D sweep ranges. Diffusion uses Arrhenius mode (Ea = 0.57 eV)."
      >
        <Figure10SweepForm value={form} onChange={setForm} />
        <div className="form-actions">
          <button type="button" onClick={() => void runSweep()} disabled={loading}>
            {loading ? "Running..." : "Run sweep"}
          </button>
        </div>
      </PagePanel>

      {error ? <p role="alert">{error}</p> : null}

      {result ? (
        <PagePanel
          title="Utilization maps"
          description="Two orientations of the same sweep data. The lower chart matches the paper axis (current density on x, temperature as series)."
        >
          <div className="figure10-charts">
            <Figure10UtilizationChart
              title="Beta utilization vs temperature (series: current density)"
              data={chartByTemperature}
              xDataKey="temperatureC"
              xLabel="Temperature (°C)"
              series={seriesByCurrentDensity}
            />
            <Figure10UtilizationChart
              title="Beta utilization vs current density (series: temperature, paper orientation)"
              data={chartByCurrentDensity}
              xDataKey="currentDensityAcm2"
              xLabel="Current density"
              xTickFormatter={(value) => formatCurrentDensityAcm2Label(value)}
              series={seriesByTemperature}
            />
          </div>
        </PagePanel>
      ) : null}
    </section>
  );
}
