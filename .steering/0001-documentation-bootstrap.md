# Iteration 0001: Documentation Bootstrap

## Status

Implemented

## Goal

Li-Mg Alloy Diffusion Simulator の初期SSOTを作成する。

## Scope

- Root `AGENTS.md`
- Package-level `AGENTS.md`
- `docs/` initial SSOT
- `.steering/` template
- Initial roadmap

## Out of Scope

- Vite project generation
- Rust crate generation
- Solver implementation
- UI implementation
- CI setup

## Related Docs

- `docs/000-index.md`
- `docs/010-product-requirements.md`
- `docs/300-directory-structure.md`
- `docs/400-development-workflow.md`

## Red Tests

Documentation-only iteration. No code tests.

## Implementation Notes

Initial documents define:

- Vite React TypeScript
- Vite Plus (`vp`)
- pnpm
- Vitest
- oxfmt
- oxlint
- Rust WASM calculation core
- Classical TDD
- Coverage target 80%+

## Refactor Notes

None yet.

## Validation

Manual documentation review.

## Coverage

Not applicable.

## Mock Usage

None.

## Risks / Follow-ups

- Confirm exact `vp` bootstrap command during Iteration 0002.
- Confirm actual oxfmt CLI flags during Iteration 0002.
- Confirm WASM packaging approach during Iteration 0005.

## Commit Message

```text
docs: add initial SSOT for Li-Mg diffusion simulator
```
