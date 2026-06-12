import {
  buildConcentrationAxisFromInitial,
  formatSimulationDurationS,
  type ConcentrationAxisConfig,
} from "@li-mg/shared";
import type { Figure9Result, SimulationProfile, SimulationResult } from "@li-mg/shared";

export function selectTerminalProfile(result: SimulationResult): SimulationProfile | undefined {
  const terminal = result.profiles.find(
    (profile) => Math.abs(profile.timeS - result.stopTimeS) < 1e-6,
  );
  return terminal ?? result.profiles.at(-1);
}

export function getFigure9MaxStopTimeS(result: Figure9Result): number {
  return Math.max(...result.cases.map((caseItem) => caseItem.result.stopTimeS));
}

export function selectProfileAtTime(
  result: SimulationResult,
  timeS: number,
): SimulationProfile | undefined {
  const profiles = [...result.profiles].sort((a, b) => a.timeS - b.timeS);
  if (profiles.length === 0) {
    return undefined;
  }

  const terminal = selectTerminalProfile(result);
  if (!terminal) {
    return undefined;
  }

  const clampedTime = Math.min(Math.max(timeS, 0), result.stopTimeS);
  if (clampedTime <= profiles[0]!.timeS) {
    return profiles[0];
  }
  if (clampedTime >= result.stopTimeS - 1e-9) {
    return terminal;
  }

  for (let index = 0; index < profiles.length - 1; index += 1) {
    const current = profiles[index]!;
    const next = profiles[index + 1]!;
    if (clampedTime >= current.timeS && clampedTime <= next.timeS) {
      if (Math.abs(next.timeS - current.timeS) < 1e-12) {
        return current;
      }
      const alpha = (clampedTime - current.timeS) / (next.timeS - current.timeS);
      return {
        timeS: clampedTime,
        concentrationsMmolPerCm3: current.concentrationsMmolPerCm3.map((value, pointIndex) => {
          const nextValue = next.concentrationsMmolPerCm3[pointIndex] ?? value;
          return value + alpha * (nextValue - value);
        }),
      };
    }
  }

  return terminal;
}

export interface ConcentrationChartSeries {
  label: string;
  stopTimeLabel?: string;
  selectedTimeLabel?: string;
  xMaxUm: number;
  yMinMmolPerCm3?: number;
  yMaxMmolPerCm3?: number;
  yTickValuesMmolPerCm3?: number[];
  betaLowerBoundMmolPerCm3: number;
  data: Array<{ xUm: number; concentrationMmolPerCm3: number }>;
}

export function toConcentrationChartSeries(
  label: string,
  xUm: number[],
  profile: SimulationProfile,
): ConcentrationChartSeries {
  return {
    label,
    xMaxUm: xUm.at(-1) ?? Math.max(0, ...xUm),
    betaLowerBoundMmolPerCm3: 0,
    data: xUm.map((x, index) => ({
      xUm: x,
      concentrationMmolPerCm3: profile.concentrationsMmolPerCm3[index] ?? 0,
    })),
  };
}

export function withConcentrationAxisRange(
  series: ConcentrationChartSeries,
  initialConcentrationMmolPerCm3: number,
): ConcentrationChartSeries {
  const { yMinMmolPerCm3, yMaxMmolPerCm3, tickValuesMmolPerCm3 } = colormapConcentrationAxisRange(
    initialConcentrationMmolPerCm3,
  );
  return {
    ...series,
    yMinMmolPerCm3,
    yMaxMmolPerCm3,
    yTickValuesMmolPerCm3: tickValuesMmolPerCm3,
  };
}

export function buildFigure9ChartSeriesAtTime(
  result: Figure9Result,
  timeS: number,
  betaLowerBoundMmolPerCm3: number,
  initialConcentrationMmolPerCm3: number,
): ConcentrationChartSeries[] {
  return result.cases.map((caseItem) => {
    const profile = selectProfileAtTime(caseItem.result, timeS);
    if (!profile) {
      return withConcentrationAxisRange(
        { label: caseItem.label, xMaxUm: 0, betaLowerBoundMmolPerCm3, data: [] },
        initialConcentrationMmolPerCm3,
      );
    }

    return withConcentrationAxisRange(
      {
        ...toConcentrationChartSeries(caseItem.label, caseItem.result.xUm, profile),
        betaLowerBoundMmolPerCm3,
        selectedTimeLabel: formatSimulationDurationS(profile.timeS).label,
      },
      initialConcentrationMmolPerCm3,
    );
  });
}

export function buildFigure9ChartSeries(
  result: Figure9Result,
  betaLowerBoundMmolPerCm3: number,
  initialConcentrationMmolPerCm3: number,
): ConcentrationChartSeries[] {
  return buildFigure9ChartSeriesAtTime(
    result,
    getFigure9MaxStopTimeS(result),
    betaLowerBoundMmolPerCm3,
    initialConcentrationMmolPerCm3,
  ).map((series, index) => {
    const caseItem = result.cases[index]!;
    const stopTimeLabel =
      caseItem.result.stopReason === "BetaLowerBoundReached"
        ? formatSimulationDurationS(caseItem.result.stopTimeS).label
        : undefined;
    return { ...series, stopTimeLabel, selectedTimeLabel: undefined };
  });
}

export interface ColormapProfileLayer {
  timeS: number;
  color: string;
  data: Array<{ xUm: number; concentrationMmolPerCm3: number }>;
}

export interface ConcentrationColormapPanel {
  label: string;
  stopTimeS: number;
  xMaxUm: number;
  yMinMmolPerCm3: number;
  yMaxMmolPerCm3: number;
  yTickValuesMmolPerCm3: number[];
  betaLowerBoundMmolPerCm3: number;
  profileLayers: ColormapProfileLayer[];
}

export function colormapConcentrationAxisRange(
  initialConcentrationMmolPerCm3: number,
): ConcentrationAxisConfig {
  return buildConcentrationAxisFromInitial(initialConcentrationMmolPerCm3);
}

/** Paper-style profile color: blue (t=0) → orange (t=stop). */
export function timeToProfileColor(timeS: number, stopTimeS: number): string {
  const timeNorm = stopTimeS > 0 ? Math.min(1, Math.max(0, timeS / stopTimeS)) : 0;
  const red = Math.round(33 + timeNorm * 209);
  const green = Math.round(102 + timeNorm * 18);
  const blue = Math.round(172 - timeNorm * 164);
  return `rgb(${red}, ${green}, ${blue})`;
}

export function buildConcentrationColormapPanel(
  label: string,
  result: SimulationResult,
  betaLowerBoundMmolPerCm3: number,
  initialConcentrationMmolPerCm3: number,
  timeStepCount = 100,
): ConcentrationColormapPanel {
  const stopTimeS = result.stopTimeS;
  const xMaxUm = result.xUm.at(-1) ?? 0;
  const timeValuesS =
    timeStepCount <= 1
      ? [0]
      : Array.from(
          { length: timeStepCount },
          (_, index) => (index / (timeStepCount - 1)) * stopTimeS,
        );

  const { yMinMmolPerCm3, yMaxMmolPerCm3, tickValuesMmolPerCm3 } = colormapConcentrationAxisRange(
    initialConcentrationMmolPerCm3,
  );
  const profileLayers: ColormapProfileLayer[] = [];

  for (const timeS of timeValuesS) {
    const profile = selectProfileAtTime(result, timeS);
    if (!profile) {
      continue;
    }
    const data = result.xUm.map((xUm, pointIndex) => ({
      xUm,
      concentrationMmolPerCm3: profile.concentrationsMmolPerCm3[pointIndex] ?? 0,
    }));
    profileLayers.push({
      timeS,
      color: timeToProfileColor(timeS, stopTimeS),
      data,
    });
  }

  return {
    label,
    stopTimeS,
    xMaxUm,
    yMinMmolPerCm3,
    yMaxMmolPerCm3,
    yTickValuesMmolPerCm3: tickValuesMmolPerCm3,
    betaLowerBoundMmolPerCm3,
    profileLayers,
  };
}

function profileToLayerData(
  result: SimulationResult,
  profile: SimulationProfile,
  stopTimeS: number,
): ColormapProfileLayer {
  return {
    timeS: profile.timeS,
    color: timeToProfileColor(profile.timeS, stopTimeS),
    data: result.xUm.map((xUm, pointIndex) => ({
      xUm,
      concentrationMmolPerCm3: profile.concentrationsMmolPerCm3[pointIndex] ?? 0,
    })),
  };
}

export function colormapPanelAtTime(
  panel: ConcentrationColormapPanel,
  result: SimulationResult,
  selectedTimeS: number,
): ConcentrationColormapPanel {
  const clampedTime = Math.min(Math.max(selectedTimeS, 0), panel.stopTimeS);
  const profileLayers = panel.profileLayers.filter((layer) => layer.timeS <= clampedTime + 1e-9);

  const terminalProfile = selectProfileAtTime(result, clampedTime);
  const lastLayer = profileLayers.at(-1);
  if (terminalProfile && (!lastLayer || Math.abs(lastLayer.timeS - clampedTime) > 1e-6)) {
    profileLayers.push(profileToLayerData(result, terminalProfile, panel.stopTimeS));
  }

  return {
    ...panel,
    profileLayers,
  };
}

export function buildFigure9ColormapPanels(
  result: Figure9Result,
  betaLowerBoundMmolPerCm3: number,
  initialConcentrationMmolPerCm3: number,
): ConcentrationColormapPanel[] {
  return result.cases.map((caseItem) =>
    buildConcentrationColormapPanel(
      caseItem.label,
      caseItem.result,
      betaLowerBoundMmolPerCm3,
      initialConcentrationMmolPerCm3,
    ),
  );
}
