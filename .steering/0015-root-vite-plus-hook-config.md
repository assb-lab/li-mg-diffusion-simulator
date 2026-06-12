# Iteration 0015: Root Vite Plus Hook Config

## Status

Implemented

## Goal

Vite Plus の pre-commit hook が root で `vp staged` を実行して失敗する問題を修正する。

## Scope

- root `vite.config.ts` を追加
- root `vite.config.ts` に `staged` config を追加
- root `pnpm lint` の対象に `vite.config.ts` を追加
- `docs/300-directory-structure.md` に root `vite.config.ts` の位置づけを追記

## Out of scope

- Vite Plus hook の削除
- `core.hooksPath` の無効化
- app behavior の変更

## Red tests

- なし。commit hook 設定修正。

## Implementation notes

- `core.hooksPath` は `apps/web/.vite-hooks/_` を指しているが、hook は root cwd で `vp staged` を実行する。
- root に `vite.config.ts` がないため `No "staged" config found in vite.config.ts` で commit が失敗していた。
- root `vite.config.ts` は user-facing app config ではなく、Vite Plus hook config として扱う。

## Refactor notes

- なし。

## Validation

```bash
pnpm fmt
pnpm lint
git commit
```

## Quality gate result

- `pnpm fmt` — pass
- `pnpm lint` — pass
- `git commit` — pass; Vite Plus pre-commit hook completed

## Commit message

```text
chore: update development tooling
```
