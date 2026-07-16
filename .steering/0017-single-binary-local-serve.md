# Iteration 0017: Single Binary Local Serve

## Status

Implemented

## Goal

`afm_process` と同様に、本番静的アセットを Go `embed` した単体バイナリでローカル配信できるようにする。
Apple Silicon と Windows x86_64 の 2 系統スクリプトを用意する。

## Scope

- docs / README / flake に単体バイナリ配布を追記
- `apps/web/main.go` + `staticserver`（SPA fallback 付き静的配信）
- `scripts/build-binary-apple-silicon.sh`
- `scripts/build-binary-windows-x64.sh`
- root `pnpm binary:build:*` / `binary:test`
- `bin/` を gitignore

## Out of scope

- Bun compile 代替経路
- GitHub Actions release workflow
- Intel Mac (`darwin/amd64`) 向けスクリプト
- Go 側への数値計算移植

## Red tests

- `apps/web/staticserver/handler_test.go`
  - root / existing asset / SPA fallback / missing asset / method rejection

## Implementation notes

- 参考: https://github.com/ks250206/afm_process の Go embed + `net/http`
- 計算は引き続きブラウザ WASM。Go は静的ファイルサーバのみ
- React Router 向けに実ファイルが無いパスは `index.html` へフォールバック
- 拡張子付きの missing asset は 404
- ビルドは `pnpm wasm:build` → `pnpm --filter web build` → `go build`
- Apple Silicon: `GOOS=darwin GOARCH=arm64`
- Windows x64: `GOOS=windows GOARCH=amd64`（クロスコンパイル）

## Refactor notes

- handler を `staticserver` に分離し、embed なしで単体テスト可能にした

## Validation

```bash
pnpm binary:test
pnpm binary:build:apple-silicon
pnpm binary:build:windows-x64
file bin/*
curl http://127.0.0.1:4179/
curl http://127.0.0.1:4179/figure9/colormap
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

## Quality gate result

- `pnpm binary:test` — pass
- `pnpm binary:build:apple-silicon` — pass (`Mach-O arm64`, ~6.5MB)
- `pnpm binary:build:windows-x64` — pass (`PE32+ x86-64`, ~7.0MB)
- smoke: `/` and `/figure9/colormap` both return 200 with SPA index
- `pnpm fmt` — pass
- `pnpm lint` — pass
- `pnpm test` — pass, 73 tests
- `pnpm test:coverage` — pass, statements 86.41%, lines 86.09%

## Commit message

```text
feat: add go embed binary packaging scripts
```
