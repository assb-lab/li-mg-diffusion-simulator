# Architecture

Status: Accepted

## Overview

```text
Browser
  └─ Vite React TypeScript app
      ├─ UI components
      ├─ input validation
      ├─ chart rendering
      ├─ export handling
      └─ Rust WASM diffusion core
```

---

## Monorepo Layout

```text
apps/web                 React app
packages/shared          TypeScript shared types/constants/unit utilities
packages/ui              reusable UI components
packages/diffusion-core  Rust solver + WASM bindings
```

---

## Responsibilities

### apps/web

- route composition
- feature composition
- user interaction
- chart rendering
- calling WASM core
- export UI

### packages/shared

- TypeScript types
- schemas
- units
- constants
- presets metadata

### packages/ui

- reusable design system primitives
- no Li-Mg domain knowledge

### packages/diffusion-core

- numerical solver
- model implementation
- utilization calculation
- WASM boundary

---

## Data Flow

```text
User input
  ↓
React form state
  ↓
shared validation/schema
  ↓
WASM input adapter
  ↓
Rust diffusion-core
  ↓
SimulationResult
  ↓
View model mapping
  ↓
Charts / summary / export
```

---

## WASM Boundary Policy

The WASM API should be coarse-grained.

Preferred:

```text
simulate(params) -> SimulationResult
```

Avoid chatty APIs such as:

```text
step()
get_cell(i)
set_boundary(...)
```

unless interactive low-level solver inspection is explicitly needed.

---

## Error Boundary

WASM errors must be converted into typed application errors.

No Rust panic should leak directly into UI.

---

## Deployment

MVP should be deployable as a static site.

No backend server is required.

---

## Future Extension Points

- Web Worker wrapper for heavy sweeps
- Multi-alloy material library
- porous host geometry approximation
- FEM solver module
- comparison against experimental CSV
- fitting module for diffusion coefficient estimation
