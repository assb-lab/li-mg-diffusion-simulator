# Iteration 0007: Single Simulation UI

## Status

Implemented

## Goal

任意パラメータの単一シミュレーション UI と JSON/CSV export を実装する。

## Scope

- parameter form with shared schema validation
- concentration profile chart
- interfacial concentration vs time chart
- utilization summary
- JSON and CSV export

## Out of Scope

- Figure 10 temperature sweep
- PNG export
- multi-material support

## Related Docs

- `docs/020-functional-requirements.md`
- `docs/220-data-schema.md`
- `docs/230-ui-design.md`

## Red Tests

- [x] form input converts to correct internal units for WASM call
- [x] exported JSON can reproduce simulation
- [x] chart axis labels include units

## Implementation Notes

- SingleSimulationPage with SimulationForm, utilization summary, JSON/CSV export.

## Refactor Notes

To be filled during implementation.

## Validation

```bash
pnpm check
```

## Coverage

Target: 80%+

## Mock Usage

None expected.

## Risks / Follow-ups

None.

## Commit Message

```text
feat: add single simulation UI and export
```
