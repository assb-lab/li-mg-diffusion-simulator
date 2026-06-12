# API Definition

Status: Accepted

## Scope

This document defines the stable interface between TypeScript UI and Rust WASM diffusion core.

---

## TypeScript Public Types

```ts
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
```

---

## WASM Functions

### simulateDiffusion

```ts
simulateDiffusion(params: SimulationParams): SimulationResult
```

Runs a single 1D delithiation simulation.

### simulateFigure9Preset

```ts
simulateFigure9Preset(): Figure9Result
```

Runs the three default Figure 9 current densities.

```ts
export interface Figure9Result {
  cases: Array<{
    label: "10uA" | "100uA" | "1mA";
    currentDensityAcm2: number;
    result: SimulationResult;
  }>;
}
```

### calculateDiffusionCoeffArrhenius

```ts
calculateDiffusionCoeffArrhenius(input: ArrheniusInput): number
```

```ts
export interface ArrheniusInput {
  diffusionRefCm2PerS: number;
  temperatureRefK: number;
  temperatureK: number;
  activationEnergyEv: number;
}
```

### simulateUtilizationSweep

```ts
simulateUtilizationSweep(params: UtilizationSweepParams): UtilizationSweepResult
```

```ts
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
```

---

## Error Format

```ts
export interface SimulationError {
  code:
    | "INVALID_THICKNESS"
    | "INVALID_CURRENT_DENSITY"
    | "INVALID_DIFFUSION_COEFFICIENT"
    | "INVALID_CONCENTRATION_RANGE"
    | "INVALID_GRID"
    | "INVALID_TIME"
    | "NUMERICAL_FAILURE";
  message: string;
  details?: Record<string, unknown>;
}
```

---

## Versioning

Result must include:

- `modelVersion`
- `solverVersion`

Breaking changes require updating `modelVersion`.

Numerical implementation changes require updating `solverVersion`.
