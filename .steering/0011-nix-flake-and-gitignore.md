# Iteration 0011: Nix Flake and Gitignore

## Status

Implemented

## Goal

Nix flakes による任意の開発シェル入口を追加し、Git 初期化後に生成物を除外する `.gitignore` を整備する。

## Scope

- Root `flake.nix` の追加
- Root `.gitignore` の追加
- README に Nix 利用手順を追加
- `docs/300-directory-structure.md` と `docs/400-development-workflow.md` に Nix flake の位置づけを追記

## Out of scope

- `flake.lock` の生成
- Nix package / app derivation の定義
- CI 設定
- 数値モデル、UI、WASM API の変更

## Red tests

- なし。開発環境とドキュメント整備のみ。

## Implementation notes

- `flake.nix` は `nixos-unstable` と `nix-systems/default` を使い、default devShell に Node.js 24、pnpm、Rust toolchain、wasm-pack を含めた。
- `.gitignore` は dependencies、build outputs、coverage、Rust target、WASM generated package、local env/cache を除外する。
- `packages/diffusion-core/pkg/` は `pnpm wasm:build` で再生成する前提の生成物として Git から除外する。

## Refactor notes

- なし。

## Validation

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
cargo test --manifest-path packages/diffusion-core/Cargo.toml
cargo fmt --check --manifest-path packages/diffusion-core/Cargo.toml
cargo clippy --manifest-path packages/diffusion-core/Cargo.toml -- -D warnings
pnpm fmt:check
git status --short --ignored
```

## Quality gate result

- Secret scan — no `.env`, key file, private key, common token pattern, or large non-ignored file found
- `pnpm fmt` — pass
- `pnpm lint` — pass
- `pnpm test` — pass, 73 tests
- `pnpm test:coverage` — pass, all files statements/lines 88.22%
- `cargo test --manifest-path packages/diffusion-core/Cargo.toml` — pass, 8 tests
- `cargo fmt --check --manifest-path packages/diffusion-core/Cargo.toml` — pass
- `cargo clippy --manifest-path packages/diffusion-core/Cargo.toml -- -D warnings` — pass
- `pnpm fmt:check` — pass
- `git status --short --ignored` — generated outputs ignored
- `git check-ignore -v node_modules apps/web/dist coverage packages/diffusion-core/pkg packages/diffusion-core/target` — pass
- `nix flake check` — not run; `nix` command is not available in this environment

## Commit message

```text
chore: add nix flake and gitignore
```
