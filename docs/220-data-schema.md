# Data Schema and DB Definition

Status: Accepted

## DB Policy

MVPではサーバーサイドDBを使用しない。

理由:

- simulation is deterministic
- inputs are small
- results can be exported locally
- user account is out of scope
- static deploymentを優先する

---

## Local Persistence

MVP may use browser localStorage for UI convenience only.

Stored data:

```ts
export interface LocalAppStateV1 {
  version: 1;
  lastParams: SimulationParams;
  preferredCurrentDensityUnit: "uAcm2" | "mAcm2";
  preferredTemperatureUnit: "C";
}
```

localStorageはSSOTではない。
ExportされたJSONがsimulation再現の正本となる。

---

## Export JSON Schema

```ts
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
```

---

## CSV Schema

### Profile CSV

Columns:

```text
time_s,x_um,concentration_mmol_cm3
```

One row per `(time, x)`.

### Summary CSV

Columns:

```text
case_label,current_density_A_cm2,stop_time_s,beta_utilization,total_li_utilization,stripped_capacity_mAh_cm2,stop_reason,mass_balance_relative_error
```

---

## Future DB Option

If server-side project storage is introduced, create a new ADR and docs update first.

Candidate entities:

- Project
- SimulationRun
- MaterialPreset
- ExportArtifact

No DB migration should be introduced without updating this document.
