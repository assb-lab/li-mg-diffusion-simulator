# Iteration 0008: Figure 10 Temperature Sweep

## Status

Implemented

## Goal

Arrhenius型D(T)と温度・電流密度スイープによりFigure 10風の利用率表示を実装する。

## Scope

- Arrhenius D(T)
- temperature sweep
- current density sweep
- utilization matrix
- line chart

## Out of Scope

- fitting activation energy from experimental data
- multi-alloy database
- pressure coupling
- heatmap (post-MVP)

## Related Docs

- `docs/110-diffusion-model.md`
- `docs/130-validation-plan.md`
- `docs/210-api-definition.md`
- `docs/230-ui-design.md`

## Red Tests

- [x] D(T) increases with temperature for positive activation energy
- [x] utilization increases with temperature at fixed current density
- [x] utilization decreases with current density at fixed temperature
- [x] Figure 10 screen displays axes with units

## Implementation Notes

- Figure10Page with utilization vs temperature line chart for multiple current densities.

## Refactor Notes

To be filled during implementation.

## Validation

```bash
pnpm check
cargo test
```

## Coverage

Target: 80%+

## Mock Usage

None expected.

## Risks / Follow-ups

- Exact Figure 10 curve reproduction depends on chosen D_ref/T_ref and paper/SI assumptions.

## Commit Message

```text
feat: add temperature-dependent utilization sweep
```
