# packages/diffusion-core/AGENTS.md

## Scope

`packages/diffusion-core` は Rust + wasm-bindgen による数値計算コアを格納する。

責務:

- 1D Fick diffusion solver
- Crank-Nicolson / Backward Euler
- tridiagonal solver
- Figure 9 reproduction calculation
- Figure 10 temperature/current sweep
- utilization calculation
- WASM binding

---

## Rules

### Do

- Rust側で単体テストを書く
- 境界条件ごとのテストを書く
- 単位変換は境界層で明示する
- solver は deterministic にする
- 浮動小数許容誤差をテストで明示する

### Do Not

- UI都合の表示整形をRust coreに入れない
- chart用データ構造に依存しない
- Figure再現のために隠し係数を入れない
- panic をWASM境界へ漏らさない

---

## Numerical Test Requirements

必須テスト:

- no-flux + no-current の場合、濃度が保存される
- current = 0 の場合、初期一様濃度を保つ
- flux boundary の符号が正しい
- boundary concentration が beta lower bound を下回ったら停止する
- grid refinement で結果が収束傾向を示す
- Figure 9 acceptance valuesに対し±5 percentage points以内

---

## Rust Quality Gate

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

WASM binding変更時:

```bash
wasm-pack test --node
```
