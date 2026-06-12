import { formatSimulationDurationS } from "@li-mg/shared";
import { useEffect, useRef } from "react";
import { renderColormapToCanvas } from "./colormapCanvas";
import type { ConcentrationColormapPanel } from "./figure9ViewModel";

interface ConcentrationTimeColormapProps {
  panel: ConcentrationColormapPanel;
}

const CANVAS_LAYOUT = {
  width: 480,
  height: 320,
  padding: { top: 12, right: 16, bottom: 36, left: 52 },
} as const;

export function ConcentrationTimeColormap({ panel }: ConcentrationTimeColormapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startLabel = formatSimulationDurationS(0).label;
  const endLabel = formatSimulationDurationS(panel.stopTimeS).label;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    renderColormapToCanvas(canvas, panel, CANVAS_LAYOUT);
  }, [panel]);

  return (
    <section className="colormap-panel" aria-label={`Colormap ${panel.label}`}>
      <h3>Concentration map ({panel.label})</h3>
      <div className="colormap-canvas-wrap">
        <canvas ref={canvasRef} className="colormap-canvas" aria-hidden="true" />
      </div>
      <div className="colormap-time-bar" aria-label="Time color scale">
        <span>{startLabel}</span>
        <div className="colormap-time-bar-gradient" />
        <span>{endLabel}</span>
      </div>
      <p className="chart-subtitle">
        Overlaid c(x) profiles colored by elapsed time (blue → orange). Dashed line: β lower bound (
        {panel.betaLowerBoundMmolPerCm3} mmol cm⁻³).
      </p>
    </section>
  );
}
