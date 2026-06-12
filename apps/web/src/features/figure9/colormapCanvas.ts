import { isMajorConcentrationTick, majorConcentrationTicks } from "@li-mg/shared";
import type { ConcentrationColormapPanel } from "./figure9ViewModel";

const GRID_COLOR = "#d4d4d8";
const AXIS_COLOR = "#000000";

export interface ColormapCanvasLayout {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
}

export function getColormapPlotArea(layout: ColormapCanvasLayout) {
  const plotWidth = layout.width - layout.padding.left - layout.padding.right;
  const plotHeight = layout.height - layout.padding.top - layout.padding.bottom;
  return { plotWidth, plotHeight };
}

function toPlotX(xUm: number, xMaxUm: number, plotWidth: number): number {
  return (xUm / xMaxUm) * plotWidth;
}

function toPlotY(concentration: number, yMin: number, yMax: number, plotHeight: number): number {
  return plotHeight - ((concentration - yMin) / (yMax - yMin)) * plotHeight;
}

export function renderColormapToCanvas(
  canvas: HTMLCanvasElement,
  panel: ConcentrationColormapPanel,
  layout: ColormapCanvasLayout,
): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(layout.width * dpr);
  canvas.height = Math.floor(layout.height * dpr);
  canvas.style.width = `${layout.width}px`;
  canvas.style.height = `${layout.height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, layout.width, layout.height);

  const { plotWidth, plotHeight } = getColormapPlotArea(layout);
  const originX = layout.padding.left;
  const originY = layout.padding.top;

  ctx.save();
  ctx.translate(originX, originY);

  for (const yValue of panel.yTickValuesMmolPerCm3) {
    const y = toPlotY(yValue, panel.yMinMmolPerCm3, panel.yMaxMmolPerCm3, plotHeight);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(plotWidth, y);
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = isMajorConcentrationTick(yValue) ? 1 : 0.6;
    ctx.setLineDash(isMajorConcentrationTick(yValue) ? [3, 3] : [2, 5]);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  for (const layer of panel.profileLayers) {
    if (layer.data.length === 0) {
      continue;
    }
    ctx.beginPath();
    layer.data.forEach((point, index) => {
      const x = toPlotX(point.xUm, panel.xMaxUm, plotWidth);
      const y = toPlotY(
        point.concentrationMmolPerCm3,
        panel.yMinMmolPerCm3,
        panel.yMaxMmolPerCm3,
        plotHeight,
      );
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = layer.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const betaY = toPlotY(
    panel.betaLowerBoundMmolPerCm3,
    panel.yMinMmolPerCm3,
    panel.yMaxMmolPerCm3,
    plotHeight,
  );
  ctx.beginPath();
  ctx.moveTo(0, betaY);
  ctx.lineTo(plotWidth, betaY);
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, plotWidth, plotHeight);

  ctx.restore();

  ctx.fillStyle = AXIS_COLOR;
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Distance (µm)", originX + plotWidth / 2, layout.height - 8);

  const majorTicks = majorConcentrationTicks(panel.yTickValuesMmolPerCm3);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const tick of majorTicks) {
    const y = originY + toPlotY(tick, panel.yMinMmolPerCm3, panel.yMaxMmolPerCm3, plotHeight);
    ctx.fillText(String(tick), originX - 6, y);
  }

  ctx.save();
  ctx.translate(14, originY + plotHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("Li concentration (mmol cm⁻³)", 0, 0);
  ctx.restore();

  const xTicks = [0, panel.xMaxUm * 0.25, panel.xMaxUm * 0.5, panel.xMaxUm * 0.75, panel.xMaxUm];
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const xUm of xTicks) {
    const x = originX + toPlotX(xUm, panel.xMaxUm, plotWidth);
    ctx.fillText(String(Math.round(xUm)), x, originY + plotHeight + 6);
  }
}
