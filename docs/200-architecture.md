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
root                     pnpm workspace orchestration, cross-package tests
apps/web                 Vite Plus React app
packages/shared          TypeScript shared types/constants/unit utilities
packages/ui              reusable UI components
packages/diffusion-core  Rust solver + WASM bindings
```

---

## Responsibilities

### root

- pnpm workspace orchestration
- repository-level quality gate scripts
- Vitest configuration for cross-package tests
- shared tooling dependencies needed by tests and package scripts
- Nix flake entrypoint

Root is not the user-facing Vite application.
The runnable web app is `apps/web`.

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
- keep this package small until components are genuinely shared

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

Status: Accepted

MVP should be deployable as a static site.

No remote backend server is required for calculation.
The browser loads the React UI and the Rust WASM core, then runs simulation locally.

### Optional single-binary local serve

Status: Accepted

For offline / USB 配布向けに、本番ビルドした静的アセット（WASM 含む）を Go の `embed` で単体実行ファイルへ埋め込み、ローカル HTTP で配信できる。

```text
pnpm wasm:build
pnpm --filter web build
  └─ apps/web/dist/   (HTML/JS/CSS/WASM)
go build (apps/web/main.go)
  └─ bin/*.exe or bin/*   embeds dist/, serves via net/http
```

- Calculation remains in-browser WASM. The Go binary is a static file server only.
- Default listen address: `127.0.0.1:4173`
- React Router 向けに、実ファイルが無いパスは `index.html` へフォールバックする。
- Supported packaging targets for scripts:
  - Apple Silicon: `darwin/arm64`
  - Windows x86_64: `windows/amd64`

Reference pattern: [ks250206/afm_process](https://github.com/ks250206/afm_process) Go embed serve.

---

## Future Extension Points

- Web Worker wrapper for heavy sweeps
- Multi-alloy material library
- porous host geometry approximation
- FEM solver module
- comparison against experimental CSV
- fitting module for diffusion coefficient estimation
