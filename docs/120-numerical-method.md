# Numerical Method Specification

Status: Accepted

## MVP Method

MVPでは1D finite difference methodを用いる。

推奨:

- Backward Euler for initial robust implementation
- Crank-Nicolson for improved accuracy after validation
- Tridiagonal matrix solver / Thomas algorithm

---

## Spatial Discretization

Domain:

```text
0 <= x <= L
```

Grid:

```text
x_j = j * dx, j = 0..N-1
```

```text
dx = L / (N - 1)
```

---

## Time Discretization

```text
t_n = n * dt
```

MVPでは固定 `dt` を許容する。

Post-MVPで adaptive timestep を検討する。

---

## Boundary Handling

### x = 0 no-flux

Use ghost cell or modified matrix coefficient.

Condition:

```text
(c_1 - c_-1) / (2 dx) = 0
```

Equivalent:

```text
c_-1 = c_1
```

### x = L flux boundary

Condition:

```text
-D ∂c/∂x = i/F
```

Need explicit unit conversion:

```text
flux_mol_cm2_s = i_A_cm2 / F_C_mol
flux_mmol_cm2_s = flux_mol_cm2_s * 1000
```

Boundary gradient:

```text
∂c/∂x = - flux_mmol_cm2_s / D
```

---

## Stop Condition

Stop simulation at first time step where:

```text
c[N-1] <= c_beta_min
```

For better accuracy, interpolate stop time between previous and current step.

MVP may report the discrete first-crossing time, but this must be documented in result metadata.

---

## Mass Balance Check

For each step, removed areal amount should approximately equal:

```text
removed_mmol_cm2 = flux_mmol_cm2_s * t
```

This must be compared against concentration integral:

```text
removed_mmol_cm2 ≈ ∫_0^L (c0 - c(x,t)) dx
```

A mass balance test is mandatory.

---

## Numerical Parameters

Default initial values:

| Parameter           |                                         Default |
| ------------------- | ----------------------------------------------: |
| grid count          |                                             201 |
| saved profile count |                                           20-50 |
| dt                  |                                solver-dependent |
| max time            | derived from theoretical capacity or user input |

`N = 201` is a reasonable default for a 1D model. It may be lowered for interactive sliders or raised for validation.

---

## Acceptance Strategy

Numerical method does not need to exactly match FEM implementation from the paper.

Acceptance target is reproduction of paper-level outputs:

- profile shape visually consistent
- beta-phase utilization within tolerance
- monotonic dependence on current density
- monotonic dependence on D and temperature

---

## Future Methods

Optional future work:

- finite volume formulation for stronger conservation
- adaptive timestep near beta-bound crossing
- FEM implementation for closer comparison to paper
- Web Worker offload
- GPU/WebGPU sweep module
