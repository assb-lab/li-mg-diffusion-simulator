# Iteration 0005: WASM Binding

## Status

Implemented

## Goal

Rust solver を TypeScript から wasm-bindgen 経由で呼び出し可能にする。

## Scope

- wasm-bindgen exports
- JSON serialize/deserialize at WASM boundary
- error mapping to typed SimulationError
- apps/web WASM adapter
- integration test

## Out of Scope

- Figure 9 UI
- export functionality

## Related Docs

- `docs/200-architecture.md`
- `docs/210-api-definition.md`

## Red Tests

- [x] Figure 9 preset 10 uA/cm2 runs via WASM
- [x] invalid input returns typed error

## Implementation Notes

- wasm-pack bundler target, JSON API in `wasm_api.rs`, adapter in `packages/shared/src/wasm/adapter.ts`.

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

- WASM build integration with Vite must be verified early.

## Commit Message

```text
feat: expose diffusion solver via WASM bindings
```
