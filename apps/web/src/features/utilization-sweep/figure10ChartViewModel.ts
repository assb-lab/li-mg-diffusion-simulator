import {
  currentDensityAcm2ToMaCm2,
  currentDensityAcm2ToUaCm2,
  type UtilizationSweepResult,
} from "@li-mg/shared";

export interface Figure10Series {
  key: string;
  label: string;
}

export function formatCurrentDensityAcm2Label(currentDensityAcm2: number): string {
  const maCm2 = currentDensityAcm2ToMaCm2(currentDensityAcm2);
  if (maCm2 >= 1) {
    const rounded = Number(maCm2.toFixed(maCm2 % 1 === 0 ? 0 : 2));
    return `${rounded} mA cm⁻²`;
  }

  const uaCm2 = currentDensityAcm2ToUaCm2(currentDensityAcm2);
  const rounded = Number(uaCm2.toFixed(uaCm2 % 1 === 0 ? 0 : 1));
  return `${rounded} µA cm⁻²`;
}

export function formatTemperatureSeriesLabel(temperatureC: number): string {
  return `${temperatureC} °C`;
}

function currentDensitySeriesKey(currentDensityAcm2: number): string {
  return `i_${currentDensityAcm2}`;
}

function temperatureSeriesKey(temperatureC: number): string {
  return `t_${temperatureC}`;
}

export function buildFigure10SeriesByCurrentDensity(
  result: UtilizationSweepResult,
): Figure10Series[] {
  return result.currentDensityAcm2Values.map((currentDensityAcm2) => ({
    key: currentDensitySeriesKey(currentDensityAcm2),
    label: formatCurrentDensityAcm2Label(currentDensityAcm2),
  }));
}

export function buildFigure10SeriesByTemperature(result: UtilizationSweepResult): Figure10Series[] {
  return result.temperatureCValues.map((temperatureC) => ({
    key: temperatureSeriesKey(temperatureC),
    label: formatTemperatureSeriesLabel(temperatureC),
  }));
}

export function buildFigure10ChartByTemperature(result: UtilizationSweepResult) {
  return result.temperatureCValues.map((temperatureC, rowIndex) => {
    const row: Record<string, number> = { temperatureC };
    result.currentDensityAcm2Values.forEach((currentDensityAcm2, colIndex) => {
      const beta = result.betaPhaseUtilizationMatrix[rowIndex]?.[colIndex] ?? 0;
      row[currentDensitySeriesKey(currentDensityAcm2)] = beta * 100;
    });
    return row;
  });
}

export function buildFigure10ChartByCurrentDensity(result: UtilizationSweepResult) {
  return result.currentDensityAcm2Values.map((currentDensityAcm2, colIndex) => {
    const row: Record<string, number> = { currentDensityAcm2 };
    result.temperatureCValues.forEach((temperatureC, rowIndex) => {
      const beta = result.betaPhaseUtilizationMatrix[rowIndex]?.[colIndex] ?? 0;
      row[temperatureSeriesKey(temperatureC)] = beta * 100;
    });
    return row;
  });
}
