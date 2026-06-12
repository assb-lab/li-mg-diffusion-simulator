import { useEffect, useState } from "react";
import { PagePanel } from "../layout/PagePanel";
import { ConcentrationChart } from "./ConcentrationChart";
import { Figure9BasePanel } from "./Figure9BasePanel";
import { TimeSeekBar } from "./TimeSeekBar";
import { UtilizationTable } from "./UtilizationTable";
import { buildFigure9ChartSeriesAtTime, getFigure9MaxStopTimeS } from "./figure9ViewModel";
import { useFigure9Simulation } from "./useFigure9Simulation";

export function Figure9ProfilePage() {
  const { base, setBase, result, error, loading, runValidation } = useFigure9Simulation();
  const [timeS, setTimeS] = useState(0);

  const maxTimeS = result ? getFigure9MaxStopTimeS(result) : 0;

  useEffect(() => {
    if (result) {
      setTimeS(getFigure9MaxStopTimeS(result));
    }
  }, [result]);

  const chartSeries = result
    ? buildFigure9ChartSeriesAtTime(
        result,
        timeS,
        base.betaLowerBoundMmolPerCm3,
        base.initialConcentrationMmolPerCm3,
      )
    : [];

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Figure 9 — Profiles</h1>
        <p className="page-lead">
          Concentration profiles c(x) at a selected time for three fixed current densities.
        </p>
      </header>

      <Figure9BasePanel
        base={base}
        onBaseChange={setBase}
        loading={loading}
        onRun={() => void runValidation()}
      />

      {error ? <p role="alert">{error}</p> : null}

      {result ? (
        <>
          <PagePanel
            title="Validation"
            description="Simulated beta-phase utilization compared with Krauskopf et al. 2019 targets."
          >
            <UtilizationTable result={result} />
          </PagePanel>

          <PagePanel
            title="Concentration profiles"
            description="Line profiles at the selected simulation time. Scrub the time bar to inspect intermediate states."
          >
            <TimeSeekBar valueS={timeS} maxS={maxTimeS} onChange={setTimeS} />
            <div className="chart-grid">
              {chartSeries.map((series) => (
                <ConcentrationChart
                  key={series.label}
                  title={`Concentration profile (${series.label})`}
                  series={series}
                />
              ))}
            </div>
          </PagePanel>
        </>
      ) : null}
    </section>
  );
}
