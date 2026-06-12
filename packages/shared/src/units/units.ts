export function umToCm(thicknessUm: number): number {
  return thicknessUm * 1e-4;
}

export function cmToUm(thicknessCm: number): number {
  return thicknessCm * 1e4;
}

export function currentDensityUaCm2ToAcm2(currentDensityUaCm2: number): number {
  return currentDensityUaCm2 * 1e-6;
}

export function currentDensityMaCm2ToAcm2(currentDensityMaCm2: number): number {
  return currentDensityMaCm2 * 1e-3;
}

export function currentDensityAcm2ToUaCm2(currentDensityAcm2: number): number {
  return currentDensityAcm2 * 1e6;
}

export function currentDensityAcm2ToMaCm2(currentDensityAcm2: number): number {
  return currentDensityAcm2 * 1e3;
}

export function celsiusToKelvin(temperatureC: number): number {
  return temperatureC + 273.15;
}

export function kelvinToCelsius(temperatureK: number): number {
  return temperatureK - 273.15;
}
