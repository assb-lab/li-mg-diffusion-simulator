import { formatSimulationDurationS } from "@li-mg/shared";
import { useEffect, useMemo, useState } from "react";
import { PagePanel } from "../layout/PagePanel";
import {
  buildFigure9ColormapPanels,
  colormapPanelAtTime,
  getFigure9MaxStopTimeS,
} from "./figure9ViewModel";
import { ConcentrationTimeColormap } from "./ConcentrationTimeColormap";
import { Figure9BasePanel } from "./Figure9BasePanel";
import { TimeSeekBar } from "./TimeSeekBar";
import { UtilizationTable } from "./UtilizationTable";
import { useFigure9Simulation } from "./useFigure9Simulation";

export function Figure9ColormapPage() {
  const { base, setBase, result, error, loading, runValidation } = useFigure9Simulation();
  const [timeS, setTimeS] = useState(0);

  const maxTimeS = result ? getFigure9MaxStopTimeS(result) : 0;

  useEffect(() => {
    if (result) {
      setTimeS(getFigure9MaxStopTimeS(result));
    }
  }, [result]);

  const panelsAtTime = useMemo(() => {
    if (!result) {
      return [];
    }
    const panels = buildFigure9ColormapPanels(
      result,
      base.betaLowerBoundMmolPerCm3,
      base.initialConcentrationMmolPerCm3,
    );
    return panels.map((panel, index) =>
      colormapPanelAtTime(panel, result.cases[index]!.result, timeS),
    );
  }, [result, base.betaLowerBoundMmolPerCm3, base.initialConcentrationMmolPerCm3, timeS]);

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Figure 9 — Colormap</h1>
        <p className="page-lead">
          Time-colored overlay of c(x) profiles for three fixed current densities.
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
            title="Concentration evolution"
            description="Paper-style overlay of c(x) profiles up to the selected time. Line color encodes elapsed time from early (blue) to late (orange)."
          >
            <TimeSeekBar valueS={timeS} maxS={maxTimeS} onChange={setTimeS} />
            <p className="chart-subtitle">
              Showing profiles up to t = {formatSimulationDurationS(timeS).label}
            </p>
            <div className="chart-grid">
              {panelsAtTime.map((panel) => (
                <ConcentrationTimeColormap key={panel.label} panel={panel} />
              ))}
            </div>
          </PagePanel>
        </>
      ) : null}
    </section>
  );
}
