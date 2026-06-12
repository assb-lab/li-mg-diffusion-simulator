# Iteration 0013: Vite React Plugin Update

## Status

Implemented

## Goal

`pnpm dev` 起動時に出る古い `@vitejs/plugin-react` / Babel transform 由来の Vite+ 警告を解消する。

## Scope

- Root と `apps/web` の Vite を `^8.0.16` に更新
- Root と `apps/web` の `@vitejs/plugin-react` を `^6.0.2` に更新
- Root の Vitest と coverage provider を `4.1.8` に更新
- Root に `esbuild@^0.27.1` を追加
- `apps/web/vite.config.ts` と `vitest.config.ts` は `@vitejs/plugin-react` を継続使用
- `docs/400-development-workflow.md` に React plugin 選択を記録

## Out of scope

- Vite+ 本体の更新
- `optimizeDeps.rollupOptions` を出している upstream plugin の修正
- React Compiler 導入

## Red tests

- なし。開発サーバー警告と build/test 設定の保守更新。

## Implementation notes

- 最初に `@vitejs/plugin-react-oxc` を試したが、同 plugin は deprecated であり、OXC changes は `@vitejs/plugin-react` に統合済みという警告が出た。
- root で `@vitejs/plugin-react@6` を使うと、Vitest 側の Vite 6 と不整合になり `Package subpath './internal' is not defined by "exports"` で起動失敗した。
- root の Vite / Vitest も最新化し、root と `apps/web` を Vite 8 + `@vitejs/plugin-react@6` に揃えた。
- `vite-plugin-top-level-await` が `esbuild` を require するため root devDependency に追加した。
- `esbuild@0.28.0` は build 時に destructuring transform error を起こしたため、Vite 8 の peer 条件内で build が通る `^0.27.1` を採用した。

## Refactor notes

- なし。

## Validation

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm --filter web build
pnpm --filter web dev
```

## Quality gate result

- `pnpm fmt` — pass
- `pnpm fmt:check` — pass
- `pnpm lint` — pass
- `pnpm test` — pass, 73 tests
- `pnpm test:coverage` — pass, statements 86.41%, lines 86.09%
- `pnpm peers check` — pass
- `pnpm --filter web build` — pass; original React/Babel and optimizeDeps warnings removed
- `pnpm --filter web dev` — pass; original React/Babel and optimizeDeps warnings removed, stopped manually with SIGINT

## Commit message

```text
chore: update vite react plugin
```
