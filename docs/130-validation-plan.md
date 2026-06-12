# Validation Plan

Status: Accepted

## Validation Philosophy

Validationは以下の3段階で行う。

1. Mathematical sanity tests
2. Numerical convergence tests
3. Paper reproduction acceptance tests

---

## V-01 Mathematical Sanity Tests

### No current

Given:

```text
i = 0
c(x, 0) = c0
```

Expected:

```text
c(x, t) = c0
```

### No-flux both ends

If both boundaries are no-flux, total Li amount must be conserved.

### Increasing current

Higher current density must lead to lower utilization before beta-bound crossing.

### Increasing diffusion coefficient

Higher diffusion coefficient must lead to higher utilization at the same current density.

---

## V-02 Boundary Tests

- x = 0 no-flux boundary does not create artificial loss
- x = L flux boundary decreases concentration near interface
- stop condition triggers when interfacial concentration reaches lower bound

---

## V-03 Mass Balance Test

For constant current density:

```text
removed_by_current = i / F * t
```

must match concentration-integrated removed Li within tolerance.

Recommended tolerance:

```text
relative error <= 1e-3 for validation grid
```

This tolerance may be relaxed for coarse interactive settings.

---

## V-04 Figure 9 Acceptance Test

Default parameters:

```text
L = 25 µm
c0 = 69.6 mmol cm^-3
c_beta_min = 24.0 mmol cm^-3
D = 3.0e-11 cm^2 s^-1
```

Current densities:

| Case  | Current density | Target beta utilization |            Tolerance |
| ----- | --------------: | ----------------------: | -------------------: |
| Fig9a |     10 µA cm^-2 |                     93% | ±5 percentage points |
| Fig9b |    100 µA cm^-2 |                     41% | ±5 percentage points |
| Fig9c |      1 mA cm^-2 |                      9% | ±5 percentage points |

Total Li utilization reference:

| Case  | Current density | Target total utilization |            Tolerance |
| ----- | --------------: | -----------------------: | -------------------: |
| Fig9a |     10 µA cm^-2 |                      61% | ±5 percentage points |
| Fig9b |    100 µA cm^-2 |                      27% | ±5 percentage points |
| Fig9c |      1 mA cm^-2 |                       6% | ±3 percentage points |

---

## V-05 Figure 10 Acceptance Test

Initial Figure 10 validation focuses on monotonic behavior:

- utilization increases with temperature
- utilization decreases with current density
- at current densities exceeding 1 mA cm^-2, high utilization requires elevated temperature around 80 °C or higher

Exact curve reproduction is post-MVP unless full paper/SI parameterization is fixed.

---

## V-06 Regression Fixtures

Add JSON fixtures after first accepted solver implementation:

```text
tests/fixtures/figure9-10uA.json
tests/fixtures/figure9-100uA.json
tests/fixtures/figure9-1mA.json
```

Each fixture must include:

- solver version
- model version
- input parameters
- grid settings
- output summary
- selected profiles
