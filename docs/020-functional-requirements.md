# Functional Requirements

Status: Accepted

## FR-01 Simulation Presets

アプリは以下のプリセットを提供する。

### Figure 9 Preset

| Parameter                |                                 Value |
| ------------------------ | ------------------------------------: |
| alloy                    |                            Li0.9Mg0.1 |
| thickness                |                                 25 µm |
| initial Li concentration |                       69.6 mmol cm^-3 |
| beta lower bound         |                       24.0 mmol cm^-3 |
| diffusion coefficient    |                     3.0e-11 cm^2 s^-1 |
| current densities        | 10 µA cm^-2, 100 µA cm^-2, 1 mA cm^-2 |

### Figure 10 Preset

| Parameter             |                                         Value |
| --------------------- | --------------------------------------------: |
| activation energy     |                                       0.57 eV |
| D reference           | project default, see `110-diffusion-model.md` |
| temperature range     |                            0-100 °C initially |
| current density range |                                  configurable |

---

## FR-02 Parameter Input

ユーザーは以下を入力できる。

- thickness [µm]
- current density [µA cm^-2 or mA cm^-2]
- diffusion coefficient [cm^2 s^-1]
- initial Li concentration [mmol cm^-3]
- beta lower bound [mmol cm^-3]
- temperature [°C]
- grid count
- time step or accuracy preset
- maximum simulation time

---

## FR-03 Simulation Output

単一simulationは以下を返す。

- x grid [µm]
- time points [s]
- concentration profiles [mmol cm^-3]
- interfacial concentration at x = L
- stop time [s]
- beta-phase Li utilization [%]
- total Li utilization estimate [%]
- areal capacity stripped [mAh cm^-2]
- stop reason

---

## FR-04 Visualization

MVPで提供する可視化:

1. concentration profile line chart
2. interfacial concentration vs time
3. beta utilization summary card
4. Figure 9 three-case comparison

Post-MVP:

1. x-t concentration heatmap
2. Figure 10 current density vs utilization curves
3. parameter sweep heatmap

---

## FR-05 Export

MVP export:

- JSON: simulation input + output metadata
- CSV: selected concentration profiles

Post-MVP export:

- PNG chart export
- all profiles CSV
- parameter sweep matrix CSV

---

## FR-06 Validation View

アプリは再現性確認用の validation view を提供する。

表示内容:

- target values from paper
- calculated values
- absolute error
- pass/fail within tolerance

---

## FR-07 Error Handling

以下の場合はユーザーに明示的なエラーを表示する。

- invalid unit range
- concentration lower bound >= initial concentration
- negative diffusion coefficient
- negative thickness
- unstable numerical configuration if explicit method is introduced
- WASM initialization failure
- simulation reaches max_time before stop condition
