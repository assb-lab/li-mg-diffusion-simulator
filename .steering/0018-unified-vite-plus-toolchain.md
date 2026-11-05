# Iteration 0018: Unified Vite Plus Toolchain

## Status

Implemented

## Goal

Issue #1: Update Node.js 26 / pnpm 12 / Vite Plus and unify the toolchain.

## Scope

- docs first, toolchain contract tests, package/config/import migration
- root test/coverage/lint/fmt/staged configuration and workspace type checking
- Node/pnpm pins, Nix, README, lockfile and issue-linked PR
- current stable React, React plugin, Testing Library, jsdom, React Router, Recharts

## Out of scope

- Numerical model, UI features, scientific parameters, deployment
- Existing mobile layout overflow and bundle splitting

## Red tests

- Added `tests/integration/toolchain.test.ts` before implementation: 3 failed,
  original 73 tests passed (pnpm 11.5.3 / Vitest 4.1.8).
- Extended the dependency contract before removing top-level-await/esbuild:
  1 failed, 2 passed, as expected.
- Upgraded Recharts exposed its hidden text measurement span in the existing
  tick-label test. Scoped the query to rendered SVG labels, preserving all ticks.

## Implementation notes

- Registry stable versions checked on 2026-11-05: Vite Plus 1.5.0,
  pnpm 12.16.1. Node.js 26.13.0 pinned via `.node-version`, engines constrain 26.
- Ran official `vp migrate --full --no-interactive --no-agent --no-editor` with
  the original lockfile available. Completed config consolidation manually.
- All dev/build/test/lint/fmt/typecheck entrypoints delegate to Vite Plus.
  Root `vite.config.ts` owns tests, coverage, lint, fmt, staged configuration.
- Removed separate Vitest/ESLint/Oxlint/Oxfmt configs and standalone tool deps.
  Vite alias points to bundled core; Vitest/coverage provider follow the bundled
  5.1.0 through the catalog for third-party peer resolution.
- TypeScript 7.0.2 is root editor tooling only; removed `tsc` commands.
  Root tsconfig includes all workspace application/test sources. Root test
  dependencies include workspace packages so type checking resolves real exports.
- WASM-only suites explicitly use the Node environment. This fixes Vitest 5 /
  vite-plugin-wasm SSR detection without mocking WASM or changing application code.
- jest-dom 7.0.1 still declares Vitest 4 Assertion types. Added Matchers<R, T>
  augmentation for Vitest 5 and corrected a pre-existing mock's invalid spread.
  No new mocks introduced; existing component mocks remain unchanged in behavior.
- Removed vite-plugin-top-level-await, explicit esbuild, old override and SWC
  build allowlist. Bundled Vite targets support native top-level await; no browser
  target was raised. Fresh WASM production builds and browser calculations pass.
- Moved project hook to root. `prepare` installs `.vite-hooks` without editing
  AGENTS.md. Migrated this clone's old core.hooksPath, verified dispatcher active.
- Updated nixpkgs lock for nodejs_26 / pnpm_12. Nix pnpm bootstrap is 12.9.0;
  packageManager selects 12.16.1 in this repository (verified directly).

## Refactor notes

- Removed generated `clearMocks: false` from root, app and old Vitest configs.
  Full suite passes with Vitest 5 defaults; no v4 compatibility switches retained.
- Compared coverage reports using an isolated archive of original HEAD under
  Vitest 4.1.8 and the migrated workspace under Vitest 5.1.0: exactly the same
  38 source files. No coverage globs, thresholds, assertions or tests removed.
  Statements/branches/functions counts unchanged. V5 attributes one more covered
  line (354/411 vs 353/410), so lines change 86.09% -> 86.13%.

## Validation

- `pnpm install --frozen-lockfile`, `pnpm peers check`: pass on pnpm 12.16.1.
- `pnpm fmt`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `pnpm check`: pass.
- Test counts: 31 files / 76 tests, no skips (original 30 files / 73 tests).
- Coverage: statements 86.41%, lines 86.13%; existing 80% thresholds retained.
- `pnpm wasm:build`: pass; actual Rust/WASM core rebuilt from this branch.
- `pnpm build`, `pnpm --filter web build`: pass.
- shared/ui build entrypoints and web/shared test entrypoints: pass.
- `cargo test --manifest-path packages/diffusion-core/Cargo.toml`: 8 passed.
- `pnpm binary:test`: pass.
- Nix shell evaluates for aarch64-darwin and aarch64-linux with Node 26.13.0 /
  pnpm 12 bootstrap. Direct Nix binaries report Node 26.13.0 / pnpm 12.16.1.
  Full `nix develop --command bash -c 'node --version; pnpm --version'`: pass.
- Real Chromium (Playwright) checks at 1440px and 390px: all four routes load,
  Figure 9 validation and time slider, single simulation, Figure 10 sweep work.
  No browser console errors or uncaught exceptions. Modified thickness to 30 µm,
  ran real WASM and verified downloaded JSON params and result profiles.
- Chrome DevTools MCP and CUA unavailable; used isolated headless Chromium.
- Existing 390px horizontal overflow reproduced in original HEAD build for all
  four routes: Figure 9 scrollWidth 558px, single/Figure 10 400px. All eight
  route/viewport measurements match the original build exactly. Existing build chunk-size warning remains.
  Existing jsdom canvas-not-implemented diagnostics are informational; all tests pass.
- Confirmed docs/110, 120, 210 and 230 have no diff: model/API/UI specifications unchanged.

## Quality gate result

Pass: formatting, lint/type checking, all tests, coverage and production build.
Nix shell realization and runtime versions: pass. Issue #1 created; PR delivery
follows this iteration commit.

## Commit message

`chore: unify toolchain with vite plus and node 26`
