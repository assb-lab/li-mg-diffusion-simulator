# Iteration 0004: Diffusion Core Solver

## Status

Implemented

## Goal

Rustで1D Fick diffusion solverの最小実装を作る。

## Scope

- Rust crate skeleton
- domain structs
- Backward Euler + Thomas algorithm
- no-current sanity test
- flux boundary test
- stop condition test
- utilization calculation

## Out of Scope

- WASM binding
- React UI
- Figure 10 sweep

## Related Docs

- `docs/110-diffusion-model.md`
- `docs/120-numerical-method.md`
- `docs/130-validation-plan.md`

## Red Tests

- [x] zero current keeps uniform concentration
- [x] positive delithiation current lowers interface concentration
- [x] simulation stops at beta lower bound
- [x] mass balance matches integrated concentration loss

## Implementation Notes

- Backward Euler + Thomas algorithm with no-flux and galvanostatic flux BC.
- Figure 9 beta utilization passes ±5pp acceptance with dt=50s.

## Refactor Notes

To be filled during implementation.

## Validation

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

## Coverage

Rust coverage optional in MVP, but tests are required.

## Mock Usage

None expected.

## Risks / Follow-ups

- Boundary condition discretization must be documented.
- Mass balance tolerance must be selected carefully.

## Commit Message

```text
feat: implement one-dimensional diffusion core
```
