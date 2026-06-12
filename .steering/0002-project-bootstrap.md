# Iteration 0002: Project Bootstrap

## Status

Implemented

## Goal

Vite Plus (`vp`) と pnpm を用いて Vite React TypeScript monorepo を初期化する。

## Scope

- pnpm workspace
- `apps/web` Vite React TypeScript app
- Vitest setup
- oxfmt setup
- oxlint setup
- base tsconfig
- initial smoke test

## Out of Scope

- Rust solver
- WASM binding
- Figure 9 UI

## Related Docs

- `docs/300-directory-structure.md`
- `docs/400-development-workflow.md`
- `docs/410-tdd-policy.md`
- `docs/420-quality-gate.md`

## Red Tests

- [x] App smoke test fails before app shell exists
- [x] Shared package import test fails before workspace package exists

## Implementation Notes

- Used `vp create vite:application` for apps/web
- Root vitest 3.2.4 with @vitejs/plugin-react 4.7.0
- oxlint scoped to apps/packages/tests (not node_modules)

## Refactor Notes

To be filled during implementation.

## Validation

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

## Coverage

Target: 80%+

## Mock Usage

None expected.

## Risks / Follow-ups

- Exact `vp` command must be verified locally.
- oxfmt command flags must be confirmed.

## Commit Message

```text
chore: bootstrap Vite React TypeScript workspace
```
