# Iteration 0009: Parameter Input on All Screens

## Status

Implemented

## Goal

全画面（Single Simulation、Figure 9、Figure 10）で膜厚・拡散係数・温度などのベースパラメータを変更可能にする。

## Scope

- `SimulationBaseFormState` と `resolveDiffusionCoeffCm2PerS` を `packages/shared` に追加
- `BaseSimulationForm` 共有コンポーネント（manual / arrhenius D モード切替）
- Single Simulation: 温度入力と Arrhenius D(T) 連携
- Figure 9: ベースパラメータフォーム + `runFigure9WithBase`（3×`simulateDiffusion`）
- Figure 10: ベースパラメータ + 温度・電流密度スイープ範囲フォーム

## Out of Scope

- Figure 9 の電流密度 3 ケース変更
- `D_ref` / `Ea` の UI フィッティング
- localStorage によるパラメータ永続化
- Rust / WASM API 変更

## Related Docs

- `docs/110-diffusion-model.md`
- `docs/230-ui-design.md`

## Red Tests

- [x] `resolveDiffusionCoeffCm2PerS` — manual / arrhenius、25°C で D_ref と一致
- [x] `buildSimulationParamsFromBase` — temperatureC が params に含まれる
- [x] `runFigure9WithBase` — カスタム膜厚が 3 ケースすべての params に反映
- [x] `figure10FormToSweepParams` — 範囲から sweep 配列を生成
- [x] `BaseSimulationForm` — 温度・モード切替のラベル表示
- [x] `Figure9Page` — ベースパラメータフォーム表示
- [x] acceptance Figure 9/10 — デフォルト値で引き続き合格

## Implementation Notes

- Arrhenius 計算は `packages/shared` の pure function を使用。WASM は integration test 用。
- Figure 9 は `simulateFigure9Preset()` の代わりに TS 側で 3 回 `simulateDiffusion` を呼び出す。
- Figure 10 は `Figure10SweepForm` + `figure10FormToSweepParams` で既存 `simulateUtilizationSweep` に接続。

## Refactor Notes

- `simulationFormViewModel` は `buildSimulationParamsFromBase` を再利用。
- ドメイン知識付きフォームは `apps/web/src/features/simulation-input/` に配置（AGENTS.md Rule 10）。

## Validation

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
cargo test --manifest-path packages/diffusion-core/Cargo.toml
pnpm --filter web build
```

## Coverage

Target: 80%+ (lines/statements)

## Mock Usage

- `Figure9Page.test.tsx`: `runFigure9WithBase` を mock（WASM 初期化を避けるため）

## Quality Gate Result

- `pnpm fmt` — pass
- `pnpm lint` — pass
- `pnpm test` — 45 tests pass
- `pnpm test:coverage` — lines 87%+ (threshold 80%)
- `cargo test` — 7 tests pass
- `pnpm --filter web build` — pass

## Commit Message

```
feat: add parameter input on all simulation screens
```
