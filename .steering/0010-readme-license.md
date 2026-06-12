# Iteration 0010: README and License

## Status

Implemented

## Goal

リポジトリ入口として README.md を整備し、利用方法、できること、論文インスパイアである旨、ライセンスを明記する。

## Scope

- Root `README.md` の更新
- Root `LICENSE` の追加
- Krauskopf et al. 2019 DOI `10.1002/aenm.201902568` 由来のインスパイアであり公式実装ではない旨を README に明記
- License 表記として `MIT ks250206 2026` を README に明記

## Out of scope

- 製品仕様・数値モデル仕様の変更
- UI / WASM / Rust core の変更
- package metadata の公開設定変更

## Red tests

- なし。ドキュメントとライセンス追加のみ。

## Implementation notes

- README は使い始めるための入口とし、恒久的な仕様は `docs/` を SSOT として参照する構成にした。
- LICENSE は標準 MIT License text とし、copyright holder を `ks250206`、year を `2026` とした。

## Refactor notes

- なし。

## Validation

```bash
pnpm fmt:check
```

## Quality gate result

- `pnpm fmt:check` — pass

## Commit message

```text
docs: add readme and license
```
