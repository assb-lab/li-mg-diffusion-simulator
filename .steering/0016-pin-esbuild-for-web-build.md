# Iteration 0016: Pin esbuild for Web Build

## Status

Implemented

## Goal

`pnpm run build`（`apps/web` の production build）を通す。

## Scope

- `pnpm-workspace.yaml` に `overrides.esbuild = ^0.27.1` を追加（pnpm 11 では package.json の `pnpm.overrides` は無効）
- `docs/400-development-workflow.md` に override 理由を追記
- lockfile を再生成して `apps/web` が `esbuild@0.28.x` を解決しないようにする

## Out of scope

- `vite-plugin-top-level-await` の置き換え
- Vite / Vite Plus のメジャー更新（意図したものではない）
- build target の引き上げによる回避

## Red tests

- なし。ビルドツールチェーン修正。

## Implementation notes

- 失敗内容: `vite-plugin-top-level-await` + `esbuild@0.28.0` が default target (`chrome87` 等) 向けに destructuring を変換できず build 失敗。
- root には既に `esbuild@^0.27.1` があったが、`apps/web` の Vite Plus 解決グラフは別途 `esbuild@0.28.0` を取得していた。
- workspace 全体で `pnpm-workspace.yaml` の `overrides` により `esbuild@^0.27.1` に固定する。
- `pnpm install` 時に root / `apps/web` の `vite-plus: latest` が `0.1.24` → `0.2.4` へ更新された。build / test 成功を確認済み。

## Refactor notes

- なし。

## Validation

```bash
pnpm install
pnpm run build
pnpm why esbuild
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

## Quality gate result

- `pnpm run build` — pass
- `pnpm why esbuild` — `esbuild@0.27.1` only
- `pnpm fmt` — pass
- `pnpm lint` — pass
- `pnpm test` — pass, 73 tests
- `pnpm test:coverage` — pass, statements 86.41%, lines 86.09%

## Commit message

```text
fix: pin esbuild for web production build
```
