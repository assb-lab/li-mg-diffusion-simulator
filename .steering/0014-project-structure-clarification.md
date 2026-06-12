# Iteration 0014: Project Structure Clarification

## Status

Implemented

## Goal

案Aとして既存 monorepo 構成を維持しつつ、root / `apps/web` / packages の役割、Vite Plus と Vite 8 tooling の関係、品質ゲートの使い分けを明確にする。

## Scope

- `apps/web/README.md` を Vite template からアプリ固有 README に置換
- `docs/200-architecture.md` に root / app / package responsibilities を追記
- `docs/300-directory-structure.md` に root package、`flake.lock`、`packages/ui` の位置づけを追記
- `docs/400-development-workflow.md` に Vite Plus / Vite 8 / Rolldown / OXC / esbuild の関係を追記
- `docs/400-development-workflow.md` に `pnpm fmt` と `pnpm fmt:check` / `pnpm check` の使い分けを追記

## Out of scope

- package layout の変更
- `packages/ui` の削除
- Vite Plus から通常 Vite への移行
- application behavior の変更

## Red tests

- なし。構成説明とドキュメント整理のみ。

## Implementation notes

- root は pnpm workspace orchestration と横断テストの入口、`apps/web` は Vite Plus app と明記した。
- Vite Plus / Vite 8 は Rolldown + OXC 系を前提としつつ、`vite-plugin-top-level-await` の runtime dependency として `esbuild@^0.27.1` を明示保持する方針を記録した。
- `flake.lock` は `nix develop` の再現性のため commit 対象と記録した。

## Refactor notes

- なし。

## Validation

```bash
pnpm fmt
pnpm fmt:check
pnpm lint
pnpm peers check
pnpm test
pnpm test:coverage
pnpm --filter web build
pnpm wasm:build
cargo test --manifest-path packages/diffusion-core/Cargo.toml
cargo fmt --check --manifest-path packages/diffusion-core/Cargo.toml
cargo clippy --manifest-path packages/diffusion-core/Cargo.toml -- -D warnings
```

## Quality gate result

- `pnpm fmt` — pass
- `pnpm fmt:check` — pass
- `pnpm lint` — pass
- `pnpm peers check` — pass
- `pnpm test` — pass, 73 tests
- `pnpm test:coverage` — pass, statements 86.41%, lines 86.09%
- `pnpm --filter web build` — pass
- `pnpm wasm:build` — pass
- `cargo test --manifest-path packages/diffusion-core/Cargo.toml` — pass, 8 tests
- `cargo fmt --check --manifest-path packages/diffusion-core/Cargo.toml` — pass
- `cargo clippy --manifest-path packages/diffusion-core/Cargo.toml -- -D warnings` — pass

## Commit message

```text
docs: clarify project structure and tooling
```
