# Roadmap

Status: Accepted

## Iteration 0001: Documentation Bootstrap

Goal:

- Add root AGENTS.md
- Add package-level AGENTS.md
- Add docs SSOT
- Add steering templates

Deliverable:

- Documentation-only commit

---

## Iteration 0002: Project Bootstrap

Goal:

- Initialize Vite React TypeScript app with Vite Plus (`vp`)
- Configure pnpm workspace
- Configure Vitest
- Configure oxfmt
- Configure oxlint
- Configure base tsconfig

Acceptance:

- `pnpm check` runs
- first smoke test passes

---

## Iteration 0003: Shared Domain Package

Goal:

- Add unit conversion functions
- Add simulation parameter types
- Add validation schema
- Add Figure 9 presets

Acceptance:

- unit conversion tests pass
- invalid domain inputs fail validation

---

## Iteration 0004: Rust Diffusion Core MVP

Goal:

- Implement 1D solver
- Implement boundary conditions
- Implement stop condition
- Implement utilization calculation

Acceptance:

- mathematical sanity tests pass
- mass balance test passes

---

## Iteration 0005: WASM Binding

Goal:

- Expose solver to TypeScript
- Add error mapping
- Add integration test

Acceptance:

- TypeScript can call WASM solver
- invalid input returns typed error

---

## Iteration 0006: Figure 9 Reproduction UI

Goal:

- Add Figure 9 preset screen
- Show three concentration profile charts
- Show utilization comparison

Acceptance:

- beta utilization values are within tolerance
- chart labels include units

---

## Iteration 0007: Single Simulation UI

Goal:

- Add parameter form
- Add single simulation result chart
- Add export JSON/CSV

Acceptance:

- user can change current density and rerun
- exported JSON can reproduce simulation

---

## Iteration 0008: Figure 10 Temperature Sweep

Goal:

- Implement Arrhenius D(T)
- Implement utilization sweep
- Add temperature/current plot

Acceptance:

- utilization increases with temperature
- utilization decreases with current density

---

## Iteration 0009: Heatmap and Sweep UX

Goal:

- Add x-t concentration heatmap
- Add parameter sweep controls

Acceptance:

- UI remains responsive
- sweep result export works

---

## Iteration 0010: Multi-material Extension

Goal:

- Add material preset abstraction
- Prepare Li-In / Li-Al / Li-Ag support

Acceptance:

- Li-Mg behavior unchanged
- material library is documented
