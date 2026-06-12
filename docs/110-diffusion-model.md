# Diffusion Model Specification

Status: Accepted

## Scientific Scope

MVPでは Li0.9Mg0.1 alloy anode の beta-phase 内における1D化学拡散のみを扱う。

純Li金属のpore wall surface diffusion、3D morphology、stack pressureによるplastic deformationは扱わない。

---

## Governing Equation

Fick's second law:

```text
∂c/∂t = D ∂²c/∂x²
```

where:

- `c = c_Li(x, t)` is Li concentration in the alloy
- `D = D_beta` is average chemical diffusion coefficient
- `x` is distance from nonactive side
- `t` is time

---

## Domain

```text
0 <= x <= L
```

- `x = 0`: nonactive side
- `x = L`: solid electrolyte interface

---

## Initial Condition

```text
c(x, 0) = c0
```

Default:

```text
c0 = 69.6 mmol cm^-3
```

---

## Boundary Conditions

### Nonactive Side

No flux:

```text
∂c/∂x | x=0 = 0
```

### Solid Electrolyte Interface

Galvanostatic delithiation:

```text
-D ∂c/∂x | x=L = i / F
```

where:

- `i` is current density [A cm^-2]
- `F` is Faraday constant [C mol^-1]

Because `c` is represented in `mmol cm^-3`, implementation must handle mol/mmol conversion explicitly.

---

## Valid Concentration Range

Model validity is limited to beta-phase miscibility window:

```text
24.0 <= c_Li <= 69.6 mmol cm^-3
```

The simulation stops when:

```text
c(L, t) <= c_beta_min
```

Default:

```text
c_beta_min = 24.0 mmol cm^-3
```

---

## Default Figure 9 Parameters

| Parameter         |                                 Value |
| ----------------- | ------------------------------------: |
| alloy             |                            Li0.9Mg0.1 |
| L                 |                                 25 µm |
| c0                |                       69.6 mmol cm^-3 |
| c_beta_min        |                       24.0 mmol cm^-3 |
| D                 |                     3.0e-11 cm^2 s^-1 |
| current densities | 10 µA cm^-2, 100 µA cm^-2, 1 mA cm^-2 |

Note:

The paper also states that 5 mAh cm^-2 corresponds to around 25 µm, specifically 26.7 µm. For Figure 9 reproduction, use the caption value of 25 µm as default. Capacity mapping may expose 26.7 µm as a separate practical-capacity preset.

---

## Temperature Dependence

For Figure 10-like calculation, use Arrhenius relation:

```text
D(T) = D_ref * exp[-Ea / kB * (1/T - 1/T_ref)]
```

where:

- `Ea = 0.57 eV`
- `kB = 8.617333262e-5 eV K^-1`
- `T` is temperature in K

Reference selection:

- MVP should provide a clear `T_ref` and `D_ref` pair.
- Default may use `D_ref = 3.0e-11 cm^2 s^-1` at room temperature.
- Figure 10 validation may additionally check the paper-reported D(T) values.

Paper-reported D(T) values:

| Temperature |                 D |
| ----------: | ----------------: |
|        0 °C | 3.9e-12 cm^2 s^-1 |
|       50 °C | 1.7e-10 cm^2 s^-1 |
|       80 °C | 9.5e-10 cm^2 s^-1 |
|      100 °C |  2.6e-9 cm^2 s^-1 |

---

## Utilization Definitions

### Beta-phase Li utilization

Fraction of Li removable while staying within beta-phase miscibility window.

Implementation definition:

```text
util_beta = removed_Li / initial_removable_beta_Li
```

where:

```text
initial_removable_beta_Li = (c0 - c_beta_min) * L
```

### Total Li utilization

Fraction of total Li in the anode that has been removed.

Implementation definition:

```text
util_total = removed_Li / (c0 * L)
```

Both values are areal quantities because cross-sectional area is normalized to 1 cm^2.

---

## Assumptions

- One-dimensional diffusion dominates.
- Solid-solid interface does not wet newly formed pores.
- Structural changes at sub-micrometer scale are neglected until beta lower bound is reached.
- D is spatially constant in MVP.
- D is concentration-independent in MVP.
- Current density is constant during delithiation.
- Temperature is uniform and constant during a single simulation.

---

## Known Limitations

- No alpha-phase segregation dynamics after beta lower bound.
- No pore morphology model.
- No stress/pressure coupling.
- No grain boundary diffusion.
- No surface diffusion.
- No Butler-Volmer kinetics.
- No finite LLZO transport resistance.
