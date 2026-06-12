# AGENTS.md

## Repository Purpose

本リポジトリは **Li-Mg Alloy Diffusion Simulator** の開発を目的とする。

第一目標は、Krauskopf et al., _Advanced Energy Materials_ 2019, DOI: `10.1002/aenm.201902568` における Li0.9Mg0.1 合金負極の拡散律速モデル、特に Figure 9 および Figure 10 の再現である。

---

## Absolute Rules

### 1. SSOT

恒久的な仕様は `docs/` を唯一の正本とする。

`AGENTS.md` には以下のみを置く。

- 開発ルール
- 品質ルール
- 実装規約
- エージェントが必ず守るべき手順

製品要求、機能設計、数値モデル、API定義、ディレクトリ詳細、開発作業手順は `docs/` に置く。

仕様変更がある場合は、必ず **docs更新 → テスト更新 → 実装更新** の順で行う。

---

### 2. Development Stack

必須スタック:

- Frontend: Vite React TypeScript
- Environment bootstrap: Vite Plus (`vp`)
- Package manager: pnpm
- Test runner: Vitest
- Formatter: oxfmt
- Linter: oxlint
- Calculation core: Rust + wasm-bindgen + WASM

React側に数値計算の本体を実装してはならない。
React側は UI、状態管理、入力検証、可視化、WASM呼び出しに限定する。

---

### 3. TDD Policy

古典学派スタイルのTDDを採用する。

必ず以下の順で進める。

1. Red: 失敗するテストを書く
2. Green: 最小実装で通す
3. Refactor: 振る舞いを変えずに改善する

モックは極力使用しない。

優先するテスト順:

1. Pure function test
2. Integration test
3. Component test
4. End-to-end test

モックを使う場合は、`.steering/` の該当イテレーションに理由を記録する。

---

### 4. Coverage

カバレッジ目標は **80%以上** とする。

対象:

- TypeScript application code
- Shared domain code
- WASM binding wrapper code

Rust coreについても単体テストを必須とする。
Rust側のカバレッジ取得は初期MVPでは必須ではないが、数値コアの境界条件・保存則・検証値テストは必須とする。

---

### 5. Quality Gate

コミット前に必ず以下を通す。

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

Rust coreを変更した場合は以下も通す。

```bash
cargo test
cargo fmt --check
cargo clippy -- -D warnings
```

`pnpm fmt` は oxfmt を呼び出す。
`pnpm lint` は oxlint を呼び出す。

---

### 6. Iteration Management

すべての実装イテレーションは `.steering/` に記録する。

ファイル名形式:

```text
.steering/0001-project-bootstrap.md
.steering/0002-diffusion-core-solver.md
.steering/0003-figure9-reproduction.md
```

各イテレーションファイルには以下を必ず含める。

- Goal
- Scope
- Out of scope
- Red tests
- Implementation notes
- Refactor notes
- Validation
- Quality gate result
- Commit message

---

### 7. Git Rule

原則として **1 iteration = 1 commit** とする。

コミット前に `.steering/` の該当ファイルを更新する。

コミットメッセージ形式:

```text
<type>: <iteration summary>
```

例:

```text
docs: add initial SSOT for diffusion simulator
feat: implement 1d diffusion solver
```

---

### 8. Numerical Modeling Rule

数値モデルは論文再現性を最優先する。

モデル実装時は必ず以下を `docs/` に記録する。

- governing equation
- domain
- initial condition
- boundary conditions
- units
- assumptions
- known limitations
- validation target
- source/reference

推測でモデルを変更してはならない。
モデル変更が必要な場合は、先に `docs/110-diffusion-model.md` または `docs/120-numerical-method.md` を更新する。

---

### 9. Unit Rule

内部計算単位を混在させてはならない。

初期方針:

- length: cm internally
- time: s
- concentration: mmol cm^-3
- diffusion coefficient: cm^2 s^-1
- current density: A cm^-2 internally
- Faraday constant: C mol^-1

UI表示単位:

- thickness: µm
- current density: µA cm^-2 / mA cm^-2
- concentration: mmol cm^-3
- time: s, min, h

単位変換は `packages/shared` の関数に集約する。

---

### 10. No Hidden Business Logic in UI

以下は UI component に直接書いてはならない。

- diffusion equation
- finite difference / finite volume / FEM logic
- tridiagonal solver
- utilization calculation
- unit conversion except display formatting
- validation thresholds

これらは `packages/diffusion-core` または `packages/shared` に置く。

---

### 11. Documentation Rule

実装済みの機能だけでなく、未実装の仕様にもステータスを明記する。

ステータス表記:

- Proposed
- Accepted
- Implemented
- Deprecated

---

### 12. Safety Against Overfitting Figure Reproduction

Figure 9 / Figure 10 の再現を目的に係数を都合よく調整してはならない。

調整可能パラメータは UI で明示し、デフォルト値と論文値を区別する。

---

## Agent Checklist

作業開始前:

- [ ] 関連する `docs/` を読んだ
- [ ] 関連する `.steering/` を確認した
- [ ] 今回のイテレーションファイルを作成または更新した
- [ ] Red test を先に書いた

作業完了前:

- [ ] docs と実装の整合性を確認した
- [ ] テストを通した
- [ ] カバレッジを確認した
- [ ] lint / format を通した
- [ ] `.steering/` に結果を記録した
- [ ] 1 iteration としてコミットできる状態にした
