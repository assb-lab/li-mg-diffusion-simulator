export interface ConcentrationAxisConfig {
  yMinMmolPerCm3: number;
  yMaxMmolPerCm3: number;
  tickValuesMmolPerCm3: number[];
}

export function buildConcentrationAxisFromInitial(
  initialConcentrationMmolPerCm3: number,
): ConcentrationAxisConfig {
  const yMinMmolPerCm3 = 0;
  const yMaxMmolPerCm3 = Math.ceil(initialConcentrationMmolPerCm3 / 10) * 10;
  const tickValuesMmolPerCm3: number[] = [];

  for (let value = yMinMmolPerCm3; value <= yMaxMmolPerCm3; value += 5) {
    tickValuesMmolPerCm3.push(value);
  }

  return {
    yMinMmolPerCm3,
    yMaxMmolPerCm3,
    tickValuesMmolPerCm3,
  };
}

export function isMajorConcentrationTick(value: number): boolean {
  const rounded = Math.round(value);
  return rounded % 10 === 0;
}

export function majorConcentrationTicks(tickValuesMmolPerCm3: number[]): number[] {
  return tickValuesMmolPerCm3.filter((value) => isMajorConcentrationTick(value));
}
