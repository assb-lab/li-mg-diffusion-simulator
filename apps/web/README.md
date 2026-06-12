# apps/web

Li-Mg Alloy Diffusion Simulator の Web アプリ本体。

この package は Vite Plus (`vp`) で起動・ビルドする React TypeScript アプリである。
root package は pnpm workspace と横断テストを統括し、実際の画面アプリはこの `apps/web` に置く。

## Commands

root から実行する通常コマンド:

```bash
pnpm dev
pnpm --filter web build
pnpm --filter web dev
```

`pnpm dev` は root script から `pnpm --filter web dev` を呼び、最終的に `vp dev` を実行する。

## Responsibilities

- Page / feature composition
- React state and UI interaction
- Form rendering and client-side validation wiring
- Chart rendering
- WASM adapter invocation
- Export UI

以下は `apps/web` に直接置かない。

- diffusion equation implementation
- finite-difference / solver logic
- core utilization calculation
- reusable unit conversion logic

それらは `packages/diffusion-core` または `packages/shared` に置く。

## Vite Plus

`apps/web/package.json` の `dev` / `build` / `preview` / `prepare` は `vp` を呼ぶ。
`vp` は project dependency として `pnpm install` で入るため、グローバルインストールは不要。
