# Iteration 0012: Non-Nix Setup Documentation

## Status

Implemented

## Goal

Nix を使わない場合の環境構築方法を README と開発ワークフロー docs に明記する。

## Scope

- `README.md` に Nix あり / なしのセットアップ手順を分離して記載
- `docs/400-development-workflow.md` に Non-Nix 前提ツールと macOS セットアップ例を追記
- `flake.nix` の Rust toolchain に `wasm32-unknown-unknown` target を明示
- Nix shell 内で `vp` / WASM build / web build を検証するコマンドを README と docs に追記
- WASM release build の最適化条件を明示

## Out of scope

- CI 設定
- アプリケーションコード、WASM、Rust core の変更

## Red tests

- なし。ドキュメント更新のみ。

## Implementation notes

- Non-Nix 前提として Node.js 24 系、pnpm 11 系、Rust toolchain、wasm-pack を明記した。
- Vite Plus (`vp`) は project dependency として `pnpm install` 後に scripts 経由で使うため、グローバルインストール不要である旨を明記した。
- macOS では Homebrew と rustup を使う例を記載した。
- プロジェクト操作は Nix 利用有無にかかわらず pnpm scripts を正とした。
- `vp` は npm/pnpm dependency として解決するため、flake の Nix package list には重複追加しない。
- `pnpm wasm:build` が Nix shell 内で通るように、Rust overlay の toolchain で `wasm32-unknown-unknown` target を含めた。
- `wasm-pack build` は release がデフォルトだが、script では `--release` を明示した。
- Rust release profile は WASM 配布サイズ優先で `opt-level = "z"`、LTO、single codegen unit、`panic = "abort"`、strip を有効にした。
- `wasm-opt` は `-Oz` と `--enable-bulk-memory` / `--enable-nontrapping-float-to-int` を明示した。最初は feature flags なしで失敗したため追加した。

## Refactor notes

- なし。

## Validation

```bash
pnpm fmt:check
pnpm exec vp --help
pnpm --filter web build
pnpm wasm:build
cargo test --manifest-path packages/diffusion-core/Cargo.toml
cargo fmt --check --manifest-path packages/diffusion-core/Cargo.toml
cargo clippy --manifest-path packages/diffusion-core/Cargo.toml -- -D warnings
nix develop --command bash -lc "pnpm install && pnpm exec vp --help && pnpm wasm:build && pnpm --filter web build"
```

## Quality gate result

- `pnpm fmt:check` — pass
- `pnpm exec vp --help` — pass
- `pnpm wasm:build` — pass
- `pnpm --filter web build` — pass
- `cargo test --manifest-path packages/diffusion-core/Cargo.toml` — pass, 8 tests
- `cargo fmt --check --manifest-path packages/diffusion-core/Cargo.toml` — pass
- `cargo clippy --manifest-path packages/diffusion-core/Cargo.toml -- -D warnings` — pass
- `nix develop` — pass, verified by user on local machine
- `nix develop --command ...` — not run in this agent environment; `nix` command is not available here

## Commit message

```text
docs: add non-nix setup instructions
```
