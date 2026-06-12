# Iteration 0006: Figure 9 Reproduction

## Status

Implemented

## Goal

Figure 9の3条件を再現するacceptance testとUI表示を追加する。

## Scope

- Figure 9 preset
- three current density simulations
- beta utilization acceptance tests
- concentration profile chart
- validation summary table

## Out of Scope

- Figure 10 temperature sweep
- export functionality
- multi-material support

## Related Docs

- `docs/010-product-requirements.md`
- `docs/020-functional-requirements.md`
- `docs/130-validation-plan.md`
- `docs/230-ui-design.md`

## Red Tests

- [x] 10 µA cm^-2 beta utilization is within ±5 percentage points of 93%
- [x] 100 µA cm^-2 beta utilization is within ±5 percentage points of 41%
- [x] 1 mA cm^-2 beta utilization is within ±5 percentage points of 9%
- [x] Figure 9 screen displays three cases and units

## Implementation Notes

- Figure9Page with Recharts concentration profiles and validation table.
- Regression fixtures in `tests/fixtures/figure9-*.json`.

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

Avoid mocks. If WASM loading is too heavy in component tests, use integration-level test for real WASM and component test for view model.

## Risks / Follow-ups

- FEM from paper and FDM implementation may not match exactly; acceptance is utilization tolerance, not pixel-perfect chart reproduction.

## Commit Message

```text
feat: reproduce Figure 9 diffusion profiles
```
