# UI Design

Status: Accepted

## Main Screens

### 1. Figure 9 Reproduction

Split into two screens sharing the same base parameters and three fixed current densities.

#### 1a. Figure 9 Colormap

Purpose:

- Paper-style overlay of c(x) profiles at successive times
- Line color encodes elapsed time (early blue → late orange)

Components:

- base parameter form (`BaseSimulationForm`)
- run validation button
- utilization comparison table
- three profile-overlay colormap panels (distance vs concentration, β lower bound dashed line)

#### 1b. Figure 9 Profiles

Purpose:

- Line profiles c(x) at a user-selected time
- Time seek bar to scrub t and refresh plots

Components:

- base parameter form (`BaseSimulationForm`)
- run validation button
- utilization comparison table
- time seek bar
- three concentration line charts (one per current density)

---

### 2. Single Simulation

Purpose:

- User-defined parameter simulation

Components:

- parameter form
- concentration profile chart
- interfacial concentration chart
- utilization summary
- export controls

---

### 3. Temperature Sweep

Purpose:

- Figure 10-like utilization map
- Adjustable base parameters and sweep ranges

Components:

- base parameter form (`BaseSimulationForm`, Arrhenius D(T) fixed)
- temperature range input (min / max / step)
- current density range input (min µA cm⁻², max mA cm⁻², steps)
- utilization line chart
- heatmap post-MVP

---

## Input Form Fields

| Field                 | Control                              | Unit                |
| --------------------- | ------------------------------------ | ------------------- |
| thickness             | number + slider                      | µm                  |
| current density       | number + unit selector               | µA cm^-2 / mA cm^-2 |
| diffusion mode        | radio (manual / arrhenius)           | —                   |
| diffusion coefficient | number (read-only in arrhenius mode) | cm^2 s^-1           |
| initial concentration | number                               | mmol cm^-3          |
| beta lower bound      | number                               | mmol cm^-3          |
| temperature           | number + slider                      | °C                  |
| grid count            | advanced number                      | count               |
| max time              | advanced number                      | s                   |

### Diffusion coefficient modes

- **manual**: user enters `D` directly; temperature is stored in export metadata only.
- **arrhenius**: user enters `T (°C)`; `D(T)` is computed from paper defaults (`D_ref = 3.0e-11 cm²/s`, `Ea = 0.57 eV` at 25°C). The D field is read-only and shows the resolved value.

Figure 10 sweep screen always uses arrhenius mode because temperature is a sweep axis.

---

## Chart Requirements

All charts must label:

- x-axis quantity
- x-axis unit
- y-axis quantity
- y-axis unit
- current density
- model preset

Use chart data generated from ViewModel mapping, not raw solver result directly.

---

## Accessibility Requirements

- All inputs have labels.
- All charts have text summary.
- Validation errors are associated with inputs.
- Keyboard navigation is supported.

---

## Error Display

Simulation errors should show:

- user-readable message
- affected parameter
- suggested correction

Raw Rust/WASM error strings must not be shown without mapping.
