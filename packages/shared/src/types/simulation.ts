export type StopReason =
  | "BetaLowerBoundReached"
  | "MaxTimeReached"
  | "InvalidInput"
  | "NumericalFailure";

export interface SimulationParams {
  modelVersion: string;
  thicknessUm: number;
  currentDensityAcm2: number;
  diffusionCoeffCm2PerS: number;
  initialConcentrationMmolPerCm3: number;
  betaLowerBoundMmolPerCm3: number;
  temperatureC?: number;
  gridCount: number;
  dtS?: number;
  maxTimeS: number;
  savedProfileCount: number;
}

export interface SimulationProfile {
  timeS: number;
  concentrationsMmolPerCm3: number[];
}

export interface SimulationResult {
  modelVersion: string;
  solverVersion: string;
  xUm: number[];
  profiles: SimulationProfile[];
  stopTimeS: number;
  stopReason: StopReason;
  betaPhaseUtilization: number;
  totalLiUtilization: number;
  strippedCapacityMahPerCm2: number;
  interfaceConcentrationMmolPerCm3: number;
  massBalanceRelativeError: number;
}

export type Figure9CaseLabel = "10uA" | "100uA" | "1mA";

export interface Figure9Case {
  label: Figure9CaseLabel;
  currentDensityAcm2: number;
  targetBetaUtilizationPercent: number;
  targetTotalUtilizationPercent: number;
}

export interface Figure9Result {
  cases: Array<{
    label: Figure9CaseLabel;
    currentDensityAcm2: number;
    result: SimulationResult;
  }>;
}

export interface ArrheniusInput {
  diffusionRefCm2PerS: number;
  temperatureRefK: number;
  temperatureK: number;
  activationEnergyEv: number;
}

export interface UtilizationSweepParams {
  base: Omit<SimulationParams, "currentDensityAcm2" | "temperatureC" | "diffusionCoeffCm2PerS">;
  currentDensityAcm2Values: number[];
  temperatureCValues: number[];
  arrhenius: ArrheniusInput;
}

export interface UtilizationSweepResult {
  currentDensityAcm2Values: number[];
  temperatureCValues: number[];
  betaPhaseUtilizationMatrix: number[][];
  totalLiUtilizationMatrix: number[][];
}

export type SimulationErrorCode =
  | "INVALID_THICKNESS"
  | "INVALID_CURRENT_DENSITY"
  | "INVALID_DIFFUSION_COEFFICIENT"
  | "INVALID_CONCENTRATION_RANGE"
  | "INVALID_GRID"
  | "INVALID_TIME"
  | "NUMERICAL_FAILURE";

export interface SimulationError {
  code: SimulationErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface SimulationExportV1 {
  exportVersion: 1;
  exportedAtIso: string;
  source: {
    appName: "Li-Mg Alloy Diffusion Simulator";
    modelVersion: string;
    solverVersion: string;
  };
  params: SimulationParams;
  result: SimulationResult;
}
