# Iteration 0003: Shared Domain Package

## Status

Implemented

## Goal

TypeScript 側の型・単位変換・検証・プリセットを `packages/shared` に実装する。

## Scope

- unit conversion functions
- simulation parameter types
- Zod validation schema
- Figure 9 presets
- physical constants

## Out of Scope

- Rust solver
- WASM binding
- React UI

## Related Docs

- `docs/100-domain-model.md`
- `docs/210-api-definition.md`
- `docs/220-data-schema.md`

## Red Tests

- [x] unit conversion round-trip tests pass
- [x] invalid domain inputs fail validation
- [x] Figure 9 preset matches paper values

## Implementation Notes

- Added units, types, Zod schema, constants, Figure 9 presets, Arrhenius helper.

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

None.

## Commit Message

```text
feat: add shared domain types and unit conversion
```
