# Li-Mg Alloy Diffusion Simulator - SSOT Bundle

---

## File: `.steering/0000-iteration-template.md`

# Iteration NNNN: <Title>

## Status

Proposed

## Goal

Describe the concrete outcome of this iteration.

## Scope

- Item 1
- Item 2

## Out of Scope

- Item 1
- Item 2

## Related Docs

- `docs/...`

## Red Tests

List tests written before implementation.

- [ ] Test name / behavior

## Implementation Notes

Record implementation choices.

## Refactor Notes

Record refactoring performed after green.

## Validation

Commands and results:

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

Rust if applicable:

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

## Coverage

Record coverage summary.

## Mock Usage

Record any mock and reason.

## Risks / Follow-ups

- Item

## Commit Message

```text
<type>: <summary>
```

---

## File: `.steering/0001-documentation-bootstrap.md`

# Iteration 0001: Documentation Bootstrap

## Status

Proposed

## Goal

Li-Mg Alloy Diffusion Simulator の初期SSOTを作成する。

## Scope

- Root `AGENTS.md`
- Package-level `AGENTS.md`
- `docs/` initial SSOT
- `.steering/` template
- Initial roadmap

## Out of Scope

- Vite project generation
- Rust crate generation
- Solver implementation
- UI implementation
- CI setup

## Related Docs

- `docs/000-index.md`
- `docs/010-product-requirements.md`
- `docs/300-directory-structure.md`
- `docs/400-development-workflow.md`

## Red Tests

Documentation-only iteration. No code tests.

## Implementation Notes

Initial documents define:

- Vite React TypeScript
- Vite Plus (`vp`)
- pnpm
- Vitest
- oxfmt
- oxlint
- Rust WASM calculation core
- Classical TDD
- Coverage target 80%+

## Refactor Notes

None yet.

## Validation

Manual documentation review.

## Coverage

Not applicable.

## Mock Usage

None.

## Risks / Follow-ups

- Confirm exact `vp` bootstrap command during Iteration 0002.
- Confirm actual oxfmt CLI flags during Iteration 0002.
- Confirm WASM packaging approach during Iteration 0005.

## Commit Message

```text
docs: add initial SSOT for Li-Mg diffusion simulator
```

---

## File: `.steering/0002-project-bootstrap.md`

# Iteration 0002: Project Bootstrap

## Status

Proposed

## Goal

Vite Plus (`vp`) と pnpm を用いて Vite React TypeScript monorepo を初期化する。

## Scope

- pnpm workspace
- `apps/web` Vite React TypeScript app
- Vitest setup
- oxfmt setup
- oxlint setup
- base tsconfig
- initial smoke test

## Out of Scope

- Rust solver
- WASM binding
- Figure 9 UI

## Related Docs

- `docs/300-directory-structure.md`
- `docs/400-development-workflow.md`
- `docs/410-tdd-policy.md`
- `docs/420-quality-gate.md`

## Red Tests

- [ ] App smoke test fails before app shell exists
- [ ] Shared package import test fails before workspace package exists

## Implementation Notes

To be filled during implementation.

## Refactor Notes

To be filled during implementation.

## Validation

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

## Coverage

Target: 80%+

## Mock Usage

None expected.

## Risks / Follow-ups

- Exact `vp` command must be verified locally.
- oxfmt command flags must be confirmed.

## Commit Message

```text
chore: bootstrap Vite React TypeScript workspace
```

---

## File: `.steering/0003-diffusion-core-solver.md`

# Iteration 0003: Diffusion Core Solver

## Status

Proposed

## Goal

Rustで1D Fick diffusion solverの最小実装を作る。

## Scope

- Rust crate skeleton
- domain structs
- no-current sanity test
- flux boundary test
- stop condition test
- utilization calculation

## Out of Scope

- WASM binding
- React UI
- Figure 10 sweep

## Related Docs

- `docs/110-diffusion-model.md`
- `docs/120-numerical-method.md`
- `docs/130-validation-plan.md`

## Red Tests

- [ ] zero current keeps uniform concentration
- [ ] positive delithiation current lowers interface concentration
- [ ] simulation stops at beta lower bound
- [ ] mass balance matches integrated concentration loss

## Implementation Notes

To be filled during implementation.

## Refactor Notes

To be filled during implementation.

## Validation

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

## Coverage

Rust coverage optional in MVP, but tests are required.

## Mock Usage

None expected.

## Risks / Follow-ups

- Boundary condition discretization must be documented.
- Mass balance tolerance must be selected carefully.

## Commit Message

```text
feat: implement one-dimensional diffusion core
```

---

## File: `.steering/0004-figure9-reproduction.md`

# Iteration 0004: Figure 9 Reproduction

## Status

Proposed

## Goal

Figure 9の3条件を再現するacceptance testとUI表示を追加する。

## Scope

- Figure 9 preset
- three current density simulations
- beta utilization acceptance tests
- concentration profile chart
- validation summary table

## Out of Scope

- Figure 10 temperature sweep
- export functionality
- multi-material support

## Related Docs

- `docs/010-product-requirements.md`
- `docs/020-functional-requirements.md`
- `docs/130-validation-plan.md`
- `docs/230-ui-design.md`

## Red Tests

- [ ] 10 µA cm^-2 beta utilization is within ±5 percentage points of 93%
- [ ] 100 µA cm^-2 beta utilization is within ±5 percentage points of 41%
- [ ] 1 mA cm^-2 beta utilization is within ±5 percentage points of 9%
- [ ] Figure 9 screen displays three cases and units

## Implementation Notes

To be filled during implementation.

## Refactor Notes

To be filled during implementation.

## Validation

```bash
pnpm check
cargo test
```

## Coverage

Target: 80%+

## Mock Usage

Avoid mocks. If WASM loading is too heavy in component tests, use integration-level test for real WASM and component test for view model.

## Risks / Follow-ups

- FEM from paper and FDM implementation may not match exactly; acceptance is utilization tolerance, not pixel-perfect chart reproduction.

## Commit Message

```text
feat: reproduce Figure 9 diffusion profiles
```

---

## File: `.steering/0005-figure10-temperature-sweep.md`

# Iteration 0005: Figure 10 Temperature Sweep

## Status

Proposed

## Goal

Arrhenius型D(T)と温度・電流密度スイープによりFigure 10風の利用率表示を実装する。

## Scope

- Arrhenius D(T)
- temperature sweep
- current density sweep
- utilization matrix
- line chart or heatmap

## Out of Scope

- fitting activation energy from experimental data
- multi-alloy database
- pressure coupling

## Related Docs

- `docs/110-diffusion-model.md`
- `docs/130-validation-plan.md`
- `docs/210-api-definition.md`
- `docs/230-ui-design.md`

## Red Tests

- [ ] D(T) increases with temperature for positive activation energy
- [ ] utilization increases with temperature at fixed current density
- [ ] utilization decreases with current density at fixed temperature
- [ ] Figure 10 screen displays axes with units

## Implementation Notes

To be filled during implementation.

## Refactor Notes

To be filled during implementation.

## Validation

```bash
pnpm check
cargo test
```

## Coverage

Target: 80%+

## Mock Usage

None expected.

## Risks / Follow-ups

- Exact Figure 10 curve reproduction depends on chosen D_ref/T_ref and paper/SI assumptions.

## Commit Message

```text
feat: add temperature-dependent utilization sweep
```

---

## File: `.steering/README.md`

# .steering

`.steering/` は各実装イテレーションの作業記録を置く場所である。

恒久的な仕様の正本ではない。
仕様として残すべき内容は `docs/` に昇格する。

---

## File Naming

```text
NNNN-short-name.md
```

Example:

```text
0001-documentation-bootstrap.md
0002-project-bootstrap.md
0003-diffusion-core-solver.md
```

---

## Rule

1 iteration = 1 steering file = 1 commit

---

## File: `AGENTS.md`

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

---

## File: `README.md`

# Li-Mg Alloy Diffusion Simulator SSOT Bundle

このバンドルは、Li-Mg Alloy Diffusion Simulator を Vite React TypeScript + Rust WASM で開発するための初期SSOTです。

主な前提:

- UI: Vite React TypeScript
- 環境構築: Vite Plus (`vp`)
- Package Manager: pnpm
- Calculation Core: Rust + wasm-bindgen + WASM
- TDD: 古典学派スタイル。Red → Green → Refactor
- Test: Vitest
- Coverage target: 80%以上
- Formatter: oxfmt
- Linter: oxlint
- 恒久的SSOT: `docs/`
- 実装イテレーション記録: `.steering/`
- 原則: 1 iteration = 1 commit

このバンドルに含まれるもの:

```text
.
├── AGENTS.md
├── README.md
├── apps/web/AGENTS.md
├── packages/diffusion-core/AGENTS.md
├── packages/shared/AGENTS.md
├── packages/ui/AGENTS.md
├── tests/AGENTS.md
├── docs/
└── .steering/
```

実プロジェクト生成後、このバンドル内のファイルをリポジトリルートへコピーして使用してください。

---

## File: `apps/web/AGENTS.md`

# apps/web/AGENTS.md

## Scope

`apps/web` は Vite React TypeScript によるWebアプリケーションを格納する。

責務:

- 入力フォーム
- パラメータスライダー
- グラフ表示
- WASM core 呼び出し
- CSV / JSON / PNG export UI
- アプリケーション状態管理

---

## Rules

### Do

- React component は小さく保つ
- 入力値検証は shared schema を使う
- 物理単位の表示変換は shared formatter を使う
- グラフ用ViewModelは component 外で生成する
- Vitest + React Testing Libraryでユーザー操作をテストする

### Do Not

- 数値計算ロジックを component に書かない
- diffusion equation を TypeScript UI 側に再実装しない
- 論文値を component に直書きしない
- chart library に依存した値変換を domain logic と混ぜない

---

## Testing Priorities

1. 入力値の検証
2. Figure 9 preset選択時のWASM呼び出しパラメータ
3. 結果表示の単位・ラベル
4. Export payload
5. エラー表示

---

## Recommended Structure

```text
apps/web/src/
├── app/
├── features/
│   ├── simulation-input/
│   ├── concentration-profile/
│   ├── utilization-sweep/
│   └── export-result/
├── routes/
├── wasm/
└── main.tsx
```

---

## File: `docs/000-index.md`

# Docs Index

## SSOT Rule

この `docs/` ディレクトリが製品仕様と開発仕様の恒久的SSOTである。

`AGENTS.md` は開発ルールを扱うが、製品要求・機能設計・API定義・ディレクトリ詳細・開発作業手順は `docs/` を正とする。

---

## Documents

| File                                 | Purpose              | Status   |
| ------------------------------------ | -------------------- | -------- |
| `010-product-requirements.md`        | 製品要求             | Accepted |
| `020-functional-requirements.md`     | 機能要求             | Accepted |
| `030-non-functional-requirements.md` | 非機能要求           | Accepted |
| `100-domain-model.md`                | ドメイン概念         | Accepted |
| `110-diffusion-model.md`             | 拡散モデル仕様       | Accepted |
| `120-numerical-method.md`            | 数値解法仕様         | Accepted |
| `130-validation-plan.md`             | 再現性検証           | Accepted |
| `200-architecture.md`                | アーキテクチャ       | Accepted |
| `210-api-definition.md`              | API / WASM interface | Proposed |
| `220-data-schema.md`                 | データ定義 / DB方針  | Proposed |
| `230-ui-design.md`                   | UI設計               | Proposed |
| `300-directory-structure.md`         | ディレクトリ構造     | Accepted |
| `400-development-workflow.md`        | 開発作業手順         | Accepted |
| `410-tdd-policy.md`                  | TDD詳細              | Accepted |
| `420-quality-gate.md`                | 品質ゲート           | Accepted |
| `500-roadmap.md`                     | ロードマップ         | Proposed |

---

## Source Reference

Primary scientific source:

- Thorben Krauskopf, Boris Mogwitz, Carolin Rosenbach, Wolfgang G. Zeier, Jürgen Janek, "Diffusion Limitation of Lithium Metal and Li–Mg Alloy Anodes on LLZO Type Solid Electrolytes as a Function of Temperature and Pressure", _Advanced Energy Materials_, 2019, DOI: `10.1002/aenm.201902568`.

---

## File: `docs/010-product-requirements.md`

# Product Requirements

Status: Accepted

## Product Name

Li-Mg Alloy Diffusion Simulator

---

## Product Vision

Li-rich Li-Mg alloy anodes on LLZO-type solid electrolytes の拡散律速を、研究者が直感的に理解・再現・探索できる軽量Webアプリを作る。

---

## Primary Goal

Krauskopf et al. 2019 の Figure 9 / Figure 10 に対応する Li0.9Mg0.1 合金負極の1D化学拡散モデルを再現し、以下を可視化する。

- concentration profile `c_Li(x, t)`
- delithiation current density dependence
- temperature dependence
- beta-phase Li utilization
- total Li utilization estimate

---

## Target Users

- 全固体電池研究者
- 電池メーカーR&D担当者
- 材料科学・電気化学を学ぶ学生
- 論文再現を行う開発者

---

## Core User Stories

### US-01: Figure 9を再現したい

ユーザーは、25 µm厚 Li0.9Mg0.1 anode について、10 µA cm^-2、100 µA cm^-2、1 mA cm^-2の濃度プロファイルを表示できる。

### US-02: 電流密度を変えたい

ユーザーは、任意の電流密度を入力し、beta-phase lower boundに到達するまでの濃度変化と利用率を確認できる。

### US-03: 温度依存性を見たい

ユーザーは、Arrhenius型の拡散係数 `D(T)` を使って、温度ごとの利用率を比較できる。

### US-04: 設計パラメータを探索したい

ユーザーは、厚み、D、初期濃度、beta lower boundを変更し、利用率・停止時間・容量を探索できる。

### US-05: 結果を保存したい

ユーザーは、simulation resultをCSV、JSON、PNGとして保存できる。

---

## Success Criteria

### Figure 9 Acceptance

室温相当、Li0.9Mg0.1、25 µm級 anode において、beta-phase Li utilizationが論文値に対して ±5 percentage points以内であること。

| Current density | Target beta-phase Li utilization |
| --------------: | -------------------------------: |
|     10 µA cm^-2 |                              93% |
|    100 µA cm^-2 |                              41% |
|      1 mA cm^-2 |                               9% |

参考として、total Li utilizationは以下を目標にする。

| Current density | Target total Li utilization |
| --------------: | --------------------------: |
|     10 µA cm^-2 |                         61% |
|    100 µA cm^-2 |                         27% |
|      1 mA cm^-2 |                          6% |

---

## Non-goals for MVP

- 純Li金属の3D pore formation model
- 表面拡散・粒界拡散・転位拡散の明示的モデル化
- 力学連成
- LLZO内部のLi輸送モデル
- electrochemical Butler-Volmer kinetics
- 実験データ自動フィッティング
- ユーザーアカウント
- サーバーサイドDB

---

## File: `docs/020-functional-requirements.md`

# Functional Requirements

Status: Accepted

## FR-01 Simulation Presets

アプリは以下のプリセットを提供する。

### Figure 9 Preset

| Parameter                |                                 Value |
| ------------------------ | ------------------------------------: |
| alloy                    |                            Li0.9Mg0.1 |
| thickness                |                                 25 µm |
| initial Li concentration |                       69.6 mmol cm^-3 |
| beta lower bound         |                       24.0 mmol cm^-3 |
| diffusion coefficient    |                     3.0e-11 cm^2 s^-1 |
| current densities        | 10 µA cm^-2, 100 µA cm^-2, 1 mA cm^-2 |

### Figure 10 Preset

| Parameter             |                                         Value |
| --------------------- | --------------------------------------------: |
| activation energy     |                                       0.57 eV |
| D reference           | project default, see `110-diffusion-model.md` |
| temperature range     |                            0-100 °C initially |
| current density range |                                  configurable |

---

## FR-02 Parameter Input

ユーザーは以下を入力できる。

- thickness [µm]
- current density [µA cm^-2 or mA cm^-2]
- diffusion coefficient [cm^2 s^-1]
- initial Li concentration [mmol cm^-3]
- beta lower bound [mmol cm^-3]
- temperature [°C]
- grid count
- time step or accuracy preset
- maximum simulation time

---

## FR-03 Simulation Output

単一simulationは以下を返す。

- x grid [µm]
- time points [s]
- concentration profiles [mmol cm^-3]
- interfacial concentration at x = L
- stop time [s]
- beta-phase Li utilization [%]
- total Li utilization estimate [%]
- areal capacity stripped [mAh cm^-2]
- stop reason

---

## FR-04 Visualization

MVPで提供する可視化:

1. concentration profile line chart
2. interfacial concentration vs time
3. beta utilization summary card
4. Figure 9 three-case comparison

Post-MVP:

1. x-t concentration heatmap
2. Figure 10 current density vs utilization curves
3. parameter sweep heatmap

---

## FR-05 Export

MVP export:

- JSON: simulation input + output metadata
- CSV: selected concentration profiles

Post-MVP export:

- PNG chart export
- all profiles CSV
- parameter sweep matrix CSV

---

## FR-06 Validation View

アプリは再現性確認用の validation view を提供する。

表示内容:

- target values from paper
- calculated values
- absolute error
- pass/fail within tolerance

---

## FR-07 Error Handling

以下の場合はユーザーに明示的なエラーを表示する。

- invalid unit range
- concentration lower bound >= initial concentration
- negative diffusion coefficient
- negative thickness
- unstable numerical configuration if explicit method is introduced
- WASM initialization failure
- simulation reaches max_time before stop condition

---

## File: `docs/030-non-functional-requirements.md`

# Non-functional Requirements

Status: Accepted

## NFR-01 Performance

MVP target:

- Figure 9 three-case simulation completes within 500 ms on a typical laptop browser.
- Single simulation completes within 100 ms for default grid/time settings after WASM initialization.
- UI remains responsive during parameter changes.

Implementation guidance:

- Debounce slider-driven simulation.
- Use Web Worker if UI blocking becomes visible.
- Use Rust WASM for solver core.

---

## NFR-02 Reproducibility

同一入力に対して同一結果を返す。

- random numberを使わない
- solver versionをresult metadataに含める
- input unitsをmetadataに含める

---

## NFR-03 Maintainability

- 数値計算とUIを分離する
- domain typesをshared packageへ置く
- docsを先に更新する
- TDDを守る

---

## NFR-04 Portability

- Static web appとしてdeploy可能にする
- Server dependencyなし
- Browser local execution

---

## NFR-05 Browser Support

MVP:

- 最新版 Chrome / Edge / Safari / Firefox

WASM対応ブラウザを前提とする。

---

## NFR-06 Accessibility

- 入力フォームにlabelを付与する
- chartには数値テーブル代替を提供する
- keyboard操作可能にする
- contrastを保つ

---

## NFR-07 Internationalization

初期UIは日本語でもよい。

内部ラベル・コード・docsの識別子は英語を優先する。
科学単位はSI/論文単位を明示する。

---

## File: `docs/100-domain-model.md`

# Domain Model

Status: Accepted

## Concepts

### AlloyAnode

Li-rich alloy anode.

MVPでは `Li0.9Mg0.1` のみを扱う。

### BetaPhase

Li-Mg binary systemにおけるbeta-phase。

MVPでは以下の濃度範囲を有効範囲とする。

```text
24.0 <= c_Li <= 69.6 mmol cm^-3
```

### Delithiation

Liがsolid electrolyte界面側から引き抜かれる過程。

### Interface

`x = L` または `ξ = L`。

Solid electrolyteとLi-Mg alloy anodeの接触界面。

### Nonactive Side

`x = 0` または `ξ = 0`。

delithiation反応が起きない側。

### Concentration Profile

`c_Li(x, t)`。

Li濃度の空間・時間分布。

### Utilization

delithiationによって利用されたLi量の割合。

MVPでは2種類を扱う。

1. total Li utilization
2. beta-phase Li utilization

---

## Coordinate System

論文の記号に合わせ、距離座標は `ξ` として説明されることがある。

実装では `x` を使う。

```text
x = 0: nonactive side
x = L: solid electrolyte interface
```

---

## Units

| Quantity              | Internal unit              | UI unit            |
| --------------------- | -------------------------- | ------------------ |
| length                | cm                         | µm                 |
| time                  | s                          | s, min, h          |
| concentration         | mmol cm^-3                 | mmol cm^-3         |
| diffusion coefficient | cm^2 s^-1                  | cm^2 s^-1          |
| current density       | A cm^-2                    | µA cm^-2, mA cm^-2 |
| capacity              | mAh cm^-2                  | mAh cm^-2          |
| temperature           | K internally for Arrhenius | °C in UI           |

---

## Constants

| Name               |             Value | Unit     |
| ------------------ | ----------------: | -------- |
| Faraday constant   |       96485.33212 | C mol^-1 |
| elementary charge  | not needed in MVP | -        |
| Boltzmann constant |    8.617333262e-5 | eV K^-1  |

---

## Default Material Parameters

| Parameter                              |   Value | Unit       | Source                |
| -------------------------------------- | ------: | ---------- | --------------------- |
| initial Li concentration               |    69.6 | mmol cm^-3 | Krauskopf et al. 2019 |
| beta lower bound                       |    24.0 | mmol cm^-3 | Krauskopf et al. 2019 |
| room-temperature diffusion coefficient | 3.0e-11 | cm^2 s^-1  | Krauskopf et al. 2019 |
| activation energy                      |    0.57 | eV         | Krauskopf et al. 2019 |

---

## Domain Invariants

- `thickness > 0`
- `diffusionCoeff > 0`
- `currentDensity >= 0`
- `initialConcentration > betaLowerBound`
- `gridCount >= 3`
- `maxTime > 0`
- `temperatureK > 0`

---

## File: `docs/110-diffusion-model.md`

# Diffusion Model Specification

Status: Accepted

## Scientific Scope

MVPでは Li0.9Mg0.1 alloy anode の beta-phase 内における1D化学拡散のみを扱う。

純Li金属のpore wall surface diffusion、3D morphology、stack pressureによるplastic deformationは扱わない。

---

## Governing Equation

Fick's second law:

```text
∂c/∂t = D ∂²c/∂x²
```

where:

- `c = c_Li(x, t)` is Li concentration in the alloy
- `D = D_beta` is average chemical diffusion coefficient
- `x` is distance from nonactive side
- `t` is time

---

## Domain

```text
0 <= x <= L
```

- `x = 0`: nonactive side
- `x = L`: solid electrolyte interface

---

## Initial Condition

```text
c(x, 0) = c0
```

Default:

```text
c0 = 69.6 mmol cm^-3
```

---

## Boundary Conditions

### Nonactive Side

No flux:

```text
∂c/∂x | x=0 = 0
```

### Solid Electrolyte Interface

Galvanostatic delithiation:

```text
-D ∂c/∂x | x=L = i / F
```

where:

- `i` is current density [A cm^-2]
- `F` is Faraday constant [C mol^-1]

Because `c` is represented in `mmol cm^-3`, implementation must handle mol/mmol conversion explicitly.

---

## Valid Concentration Range

Model validity is limited to beta-phase miscibility window:

```text
24.0 <= c_Li <= 69.6 mmol cm^-3
```

The simulation stops when:

```text
c(L, t) <= c_beta_min
```

Default:

```text
c_beta_min = 24.0 mmol cm^-3
```

---

## Default Figure 9 Parameters

| Parameter         |                                 Value |
| ----------------- | ------------------------------------: |
| alloy             |                            Li0.9Mg0.1 |
| L                 |                                 25 µm |
| c0                |                       69.6 mmol cm^-3 |
| c_beta_min        |                       24.0 mmol cm^-3 |
| D                 |                     3.0e-11 cm^2 s^-1 |
| current densities | 10 µA cm^-2, 100 µA cm^-2, 1 mA cm^-2 |

Note:

The paper also states that 5 mAh cm^-2 corresponds to around 25 µm, specifically 26.7 µm. For Figure 9 reproduction, use the caption value of 25 µm as default. Capacity mapping may expose 26.7 µm as a separate practical-capacity preset.

---

## Temperature Dependence

For Figure 10-like calculation, use Arrhenius relation:

```text
D(T) = D_ref * exp[-Ea / kB * (1/T - 1/T_ref)]
```

where:

- `Ea = 0.57 eV`
- `kB = 8.617333262e-5 eV K^-1`
- `T` is temperature in K

Reference selection:

- MVP should provide a clear `T_ref` and `D_ref` pair.
- Default may use `D_ref = 3.0e-11 cm^2 s^-1` at room temperature.
- Figure 10 validation may additionally check the paper-reported D(T) values.

Paper-reported D(T) values:

| Temperature |                 D |
| ----------: | ----------------: |
|        0 °C | 3.9e-12 cm^2 s^-1 |
|       50 °C | 1.7e-10 cm^2 s^-1 |
|       80 °C | 9.5e-10 cm^2 s^-1 |
|      100 °C |  2.6e-9 cm^2 s^-1 |

---

## Utilization Definitions

### Beta-phase Li utilization

Fraction of Li removable while staying within beta-phase miscibility window.

Implementation definition:

```text
util_beta = removed_Li / initial_removable_beta_Li
```

where:

```text
initial_removable_beta_Li = (c0 - c_beta_min) * L
```

### Total Li utilization

Fraction of total Li in the anode that has been removed.

Implementation definition:

```text
util_total = removed_Li / (c0 * L)
```

Both values are areal quantities because cross-sectional area is normalized to 1 cm^2.

---

## Assumptions

- One-dimensional diffusion dominates.
- Solid-solid interface does not wet newly formed pores.
- Structural changes at sub-micrometer scale are neglected until beta lower bound is reached.
- D is spatially constant in MVP.
- D is concentration-independent in MVP.
- Current density is constant during delithiation.
- Temperature is uniform and constant during a single simulation.

---

## Known Limitations

- No alpha-phase segregation dynamics after beta lower bound.
- No pore morphology model.
- No stress/pressure coupling.
- No grain boundary diffusion.
- No surface diffusion.
- No Butler-Volmer kinetics.
- No finite LLZO transport resistance.

---

## File: `docs/120-numerical-method.md`

# Numerical Method Specification

Status: Accepted

## MVP Method

MVPでは1D finite difference methodを用いる。

推奨:

- Backward Euler for initial robust implementation
- Crank-Nicolson for improved accuracy after validation
- Tridiagonal matrix solver / Thomas algorithm

---

## Spatial Discretization

Domain:

```text
0 <= x <= L
```

Grid:

```text
x_j = j * dx, j = 0..N-1
```

```text
dx = L / (N - 1)
```

---

## Time Discretization

```text
t_n = n * dt
```

MVPでは固定 `dt` を許容する。

Post-MVPで adaptive timestep を検討する。

---

## Boundary Handling

### x = 0 no-flux

Use ghost cell or modified matrix coefficient.

Condition:

```text
(c_1 - c_-1) / (2 dx) = 0
```

Equivalent:

```text
c_-1 = c_1
```

### x = L flux boundary

Condition:

```text
-D ∂c/∂x = i/F
```

Need explicit unit conversion:

```text
flux_mol_cm2_s = i_A_cm2 / F_C_mol
flux_mmol_cm2_s = flux_mol_cm2_s * 1000
```

Boundary gradient:

```text
∂c/∂x = - flux_mmol_cm2_s / D
```

---

## Stop Condition

Stop simulation at first time step where:

```text
c[N-1] <= c_beta_min
```

For better accuracy, interpolate stop time between previous and current step.

MVP may report the discrete first-crossing time, but this must be documented in result metadata.

---

## Mass Balance Check

For each step, removed areal amount should approximately equal:

```text
removed_mmol_cm2 = flux_mmol_cm2_s * t
```

This must be compared against concentration integral:

```text
removed_mmol_cm2 ≈ ∫_0^L (c0 - c(x,t)) dx
```

A mass balance test is mandatory.

---

## Numerical Parameters

Default initial values:

| Parameter           |                                         Default |
| ------------------- | ----------------------------------------------: |
| grid count          |                                             201 |
| saved profile count |                                           20-50 |
| dt                  |                                solver-dependent |
| max time            | derived from theoretical capacity or user input |

`N = 201` is a reasonable default for a 1D model. It may be lowered for interactive sliders or raised for validation.

---

## Acceptance Strategy

Numerical method does not need to exactly match FEM implementation from the paper.

Acceptance target is reproduction of paper-level outputs:

- profile shape visually consistent
- beta-phase utilization within tolerance
- monotonic dependence on current density
- monotonic dependence on D and temperature

---

## Future Methods

Optional future work:

- finite volume formulation for stronger conservation
- adaptive timestep near beta-bound crossing
- FEM implementation for closer comparison to paper
- Web Worker offload
- GPU/WebGPU sweep module

---

## File: `docs/130-validation-plan.md`

# Validation Plan

Status: Accepted

## Validation Philosophy

Validationは以下の3段階で行う。

1. Mathematical sanity tests
2. Numerical convergence tests
3. Paper reproduction acceptance tests

---

## V-01 Mathematical Sanity Tests

### No current

Given:

```text
i = 0
c(x, 0) = c0
```

Expected:

```text
c(x, t) = c0
```

### No-flux both ends

If both boundaries are no-flux, total Li amount must be conserved.

### Increasing current

Higher current density must lead to lower utilization before beta-bound crossing.

### Increasing diffusion coefficient

Higher diffusion coefficient must lead to higher utilization at the same current density.

---

## V-02 Boundary Tests

- x = 0 no-flux boundary does not create artificial loss
- x = L flux boundary decreases concentration near interface
- stop condition triggers when interfacial concentration reaches lower bound

---

## V-03 Mass Balance Test

For constant current density:

```text
removed_by_current = i / F * t
```

must match concentration-integrated removed Li within tolerance.

Recommended tolerance:

```text
relative error <= 1e-3 for validation grid
```

This tolerance may be relaxed for coarse interactive settings.

---

## V-04 Figure 9 Acceptance Test

Default parameters:

```text
L = 25 µm
c0 = 69.6 mmol cm^-3
c_beta_min = 24.0 mmol cm^-3
D = 3.0e-11 cm^2 s^-1
```

Current densities:

| Case  | Current density | Target beta utilization |            Tolerance |
| ----- | --------------: | ----------------------: | -------------------: |
| Fig9a |     10 µA cm^-2 |                     93% | ±5 percentage points |
| Fig9b |    100 µA cm^-2 |                     41% | ±5 percentage points |
| Fig9c |      1 mA cm^-2 |                      9% | ±5 percentage points |

Total Li utilization reference:

| Case  | Current density | Target total utilization |            Tolerance |
| ----- | --------------: | -----------------------: | -------------------: |
| Fig9a |     10 µA cm^-2 |                      61% | ±5 percentage points |
| Fig9b |    100 µA cm^-2 |                      27% | ±5 percentage points |
| Fig9c |      1 mA cm^-2 |                       6% | ±3 percentage points |

---

## V-05 Figure 10 Acceptance Test

Initial Figure 10 validation focuses on monotonic behavior:

- utilization increases with temperature
- utilization decreases with current density
- at current densities exceeding 1 mA cm^-2, high utilization requires elevated temperature around 80 °C or higher

Exact curve reproduction is post-MVP unless full paper/SI parameterization is fixed.

---

## V-06 Regression Fixtures

Add JSON fixtures after first accepted solver implementation:

```text
tests/fixtures/figure9-10uA.json
tests/fixtures/figure9-100uA.json
tests/fixtures/figure9-1mA.json
```

Each fixture must include:

- solver version
- model version
- input parameters
- grid settings
- output summary
- selected profiles

---

## File: `docs/200-architecture.md`

# Architecture

Status: Accepted

## Overview

```text
Browser
  └─ Vite React TypeScript app
      ├─ UI components
      ├─ input validation
      ├─ chart rendering
      ├─ export handling
      └─ Rust WASM diffusion core
```

---

## Monorepo Layout

```text
apps/web                 React app
packages/shared          TypeScript shared types/constants/unit utilities
packages/ui              reusable UI components
packages/diffusion-core  Rust solver + WASM bindings
```

---

## Responsibilities

### apps/web

- route composition
- feature composition
- user interaction
- chart rendering
- calling WASM core
- export UI

### packages/shared

- TypeScript types
- schemas
- units
- constants
- presets metadata

### packages/ui

- reusable design system primitives
- no Li-Mg domain knowledge

### packages/diffusion-core

- numerical solver
- model implementation
- utilization calculation
- WASM boundary

---

## Data Flow

```text
User input
  ↓
React form state
  ↓
shared validation/schema
  ↓
WASM input adapter
  ↓
Rust diffusion-core
  ↓
SimulationResult
  ↓
View model mapping
  ↓
Charts / summary / export
```

---

## WASM Boundary Policy

The WASM API should be coarse-grained.

Preferred:

```text
simulate(params) -> SimulationResult
```

Avoid chatty APIs such as:

```text
step()
get_cell(i)
set_boundary(...)
```

unless interactive low-level solver inspection is explicitly needed.

---

## Error Boundary

WASM errors must be converted into typed application errors.

No Rust panic should leak directly into UI.

---

## Deployment

MVP should be deployable as a static site.

No backend server is required.

---

## Future Extension Points

- Web Worker wrapper for heavy sweeps
- Multi-alloy material library
- porous host geometry approximation
- FEM solver module
- comparison against experimental CSV
- fitting module for diffusion coefficient estimation

---

## File: `docs/210-api-definition.md`

# API Definition

Status: Proposed

## Scope

This document defines the stable interface between TypeScript UI and Rust WASM diffusion core.

---

## TypeScript Public Types

```ts
export type StopReason =
  | "BetaLowerBoundReached"
  | "MaxTimeReached"
  | "InvalidInput"
  | "NumericalFailure";

export interface SimulationParams {
  modelVersion: string;
  thicknessUm: number;
  currentDensityAcm2: number;
  diffusionCoeffCm2PerS: number;
  initialConcentrationMmolPerCm3: number;
  betaLowerBoundMmolPerCm3: number;
  temperatureC?: number;
  gridCount: number;
  dtS?: number;
  maxTimeS: number;
  savedProfileCount: number;
}

export interface SimulationProfile {
  timeS: number;
  concentrationsMmolPerCm3: number[];
}

export interface SimulationResult {
  modelVersion: string;
  solverVersion: string;
  xUm: number[];
  profiles: SimulationProfile[];
  stopTimeS: number;
  stopReason: StopReason;
  betaPhaseUtilization: number;
  totalLiUtilization: number;
  strippedCapacityMahPerCm2: number;
  interfaceConcentrationMmolPerCm3: number;
  massBalanceRelativeError: number;
}
```

---

## WASM Functions

### simulateDiffusion

```ts
simulateDiffusion(params: SimulationParams): SimulationResult
```

Runs a single 1D delithiation simulation.

### simulateFigure9Preset

```ts
simulateFigure9Preset(): Figure9Result
```

Runs the three default Figure 9 current densities.

```ts
export interface Figure9Result {
  cases: Array<{
    label: "10uA" | "100uA" | "1mA";
    currentDensityAcm2: number;
    result: SimulationResult;
  }>;
}
```

### calculateDiffusionCoeffArrhenius

```ts
calculateDiffusionCoeffArrhenius(input: ArrheniusInput): number
```

```ts
export interface ArrheniusInput {
  diffusionRefCm2PerS: number;
  temperatureRefK: number;
  temperatureK: number;
  activationEnergyEv: number;
}
```

### simulateUtilizationSweep

```ts
simulateUtilizationSweep(params: UtilizationSweepParams): UtilizationSweepResult
```

```ts
export interface UtilizationSweepParams {
  base: Omit<SimulationParams, "currentDensityAcm2" | "temperatureC" | "diffusionCoeffCm2PerS">;
  currentDensityAcm2Values: number[];
  temperatureCValues: number[];
  arrhenius: ArrheniusInput;
}

export interface UtilizationSweepResult {
  currentDensityAcm2Values: number[];
  temperatureCValues: number[];
  betaPhaseUtilizationMatrix: number[][];
  totalLiUtilizationMatrix: number[][];
}
```

---

## Error Format

```ts
export interface SimulationError {
  code:
    | "INVALID_THICKNESS"
    | "INVALID_CURRENT_DENSITY"
    | "INVALID_DIFFUSION_COEFFICIENT"
    | "INVALID_CONCENTRATION_RANGE"
    | "INVALID_GRID"
    | "INVALID_TIME"
    | "NUMERICAL_FAILURE";
  message: string;
  details?: Record<string, unknown>;
}
```

---

## Versioning

Result must include:

- `modelVersion`
- `solverVersion`

Breaking changes require updating `modelVersion`.

Numerical implementation changes require updating `solverVersion`.

---

## File: `docs/220-data-schema.md`

# Data Schema and DB Definition

Status: Proposed

## DB Policy

MVPではサーバーサイドDBを使用しない。

理由:

- simulation is deterministic
- inputs are small
- results can be exported locally
- user account is out of scope
- static deploymentを優先する

---

## Local Persistence

MVP may use browser localStorage for UI convenience only.

Stored data:

```ts
export interface LocalAppStateV1 {
  version: 1;
  lastParams: SimulationParams;
  preferredCurrentDensityUnit: "uAcm2" | "mAcm2";
  preferredTemperatureUnit: "C";
}
```

localStorageはSSOTではない。
ExportされたJSONがsimulation再現の正本となる。

---

## Export JSON Schema

```ts
export interface SimulationExportV1 {
  exportVersion: 1;
  exportedAtIso: string;
  source: {
    appName: "Li-Mg Alloy Diffusion Simulator";
    modelVersion: string;
    solverVersion: string;
  };
  params: SimulationParams;
  result: SimulationResult;
}
```

---

## CSV Schema

### Profile CSV

Columns:

```text
time_s,x_um,concentration_mmol_cm3
```

One row per `(time, x)`.

### Summary CSV

Columns:

```text
case_label,current_density_A_cm2,stop_time_s,beta_utilization,total_li_utilization,stripped_capacity_mAh_cm2,stop_reason,mass_balance_relative_error
```

---

## Future DB Option

If server-side project storage is introduced, create a new ADR and docs update first.

Candidate entities:

- Project
- SimulationRun
- MaterialPreset
- ExportArtifact

No DB migration should be introduced without updating this document.

---

## File: `docs/230-ui-design.md`

# UI Design

Status: Proposed

## Main Screens

### 1. Figure 9 Reproduction

Purpose:

- Paper reproduction view
- Three current density cases side by side

Components:

- preset info card
- run validation button
- three concentration charts
- utilization comparison table

---

### 2. Single Simulation

Purpose:

- User-defined parameter simulation

Components:

- parameter form
- concentration profile chart
- interfacial concentration chart
- utilization summary
- export controls

---

### 3. Temperature Sweep

Purpose:

- Figure 10-like utilization map

Components:

- temperature range input
- current density range input
- utilization line chart
- heatmap post-MVP

---

## Input Form Fields

| Field                 | Control                   | Unit                |
| --------------------- | ------------------------- | ------------------- |
| thickness             | number + slider           | µm                  |
| current density       | number + unit selector    | µA cm^-2 / mA cm^-2 |
| diffusion coefficient | scientific notation input | cm^2 s^-1           |
| initial concentration | number                    | mmol cm^-3          |
| beta lower bound      | number                    | mmol cm^-3          |
| temperature           | number + slider           | °C                  |
| grid count            | advanced number           | count               |
| max time              | advanced number           | s                   |

---

## Chart Requirements

All charts must label:

- x-axis quantity
- x-axis unit
- y-axis quantity
- y-axis unit
- current density
- model preset

Use chart data generated from ViewModel mapping, not raw solver result directly.

---

## Accessibility Requirements

- All inputs have labels.
- All charts have text summary.
- Validation errors are associated with inputs.
- Keyboard navigation is supported.

---

## Error Display

Simulation errors should show:

- user-readable message
- affected parameter
- suggested correction

Raw Rust/WASM error strings must not be shown without mapping.

---

## File: `docs/300-directory-structure.md`

# Directory Structure

Status: Accepted

## Target Structure

```text
.
├── AGENTS.md
├── README.md
├── docs/
│   ├── 000-index.md
│   ├── 010-product-requirements.md
│   ├── 020-functional-requirements.md
│   ├── 030-non-functional-requirements.md
│   ├── 100-domain-model.md
│   ├── 110-diffusion-model.md
│   ├── 120-numerical-method.md
│   ├── 130-validation-plan.md
│   ├── 200-architecture.md
│   ├── 210-api-definition.md
│   ├── 220-data-schema.md
│   ├── 230-ui-design.md
│   ├── 300-directory-structure.md
│   ├── 400-development-workflow.md
│   ├── 410-tdd-policy.md
│   ├── 420-quality-gate.md
│   └── 500-roadmap.md
├── .steering/
│   ├── README.md
│   ├── 0000-iteration-template.md
│   └── 0001-documentation-bootstrap.md
├── apps/
│   └── web/
│       ├── AGENTS.md
│       ├── package.json
│       ├── index.html
│       ├── vite.config.ts
│       ├── vitest.config.ts
│       └── src/
├── packages/
│   ├── diffusion-core/
│   │   ├── AGENTS.md
│   │   ├── Cargo.toml
│   │   └── src/
│   ├── shared/
│   │   ├── AGENTS.md
│   │   ├── package.json
│   │   └── src/
│   └── ui/
│       ├── AGENTS.md
│       ├── package.json
│       └── src/
├── tests/
│   ├── AGENTS.md
│   ├── acceptance/
│   ├── integration/
│   └── fixtures/
├── scripts/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## Directory Rules

### docs

恒久的SSOT。

### .steering

イテレーションごとの作業記録。
恒久仕様の正本ではない。

### apps/web

Web app本体。

### packages/diffusion-core

Rust/WASM solver。

### packages/shared

TypeScript shared domain package。

### packages/ui

Reusable UI components。

### tests

Cross-package tests and fixtures。

### scripts

Project automation scripts。

---

## AGENTS.md Placement

以下に配置する。

- root: repository-wide rules
- apps/web: frontend-specific rules
- packages/diffusion-core: Rust/WASM-specific rules
- packages/shared: shared package rules
- packages/ui: UI package rules
- tests: testing-specific rules

---

## File: `docs/400-development-workflow.md`

# Development Workflow

Status: Accepted

## Bootstrap Policy

環境構築には Vite Plus (`vp`) を用いる。

パッケージマネージャーは pnpm を用いる。

Bootstrap procedure is finalized in `.steering/0002-project-bootstrap.md` during implementation, because exact `vp` command options may depend on the installed Vite Plus version.

---

## Standard Iteration Flow

Each iteration follows:

1. Create or update `.steering/NNNN-name.md`
2. Read relevant docs
3. Update docs first if specification changes
4. Write failing tests
5. Implement minimum code
6. Refactor
7. Run quality gate
8. Update steering result
9. Commit once

---

## Commands

Canonical package scripts:

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
pnpm check
```

Rust commands:

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

---

## Suggested Root package.json Scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm -r build",
    "fmt": "oxfmt --write .",
    "fmt:check": "oxfmt --check .",
    "lint": "oxlint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "check": "pnpm fmt:check && pnpm lint && pnpm test:coverage"
  }
}
```

If actual oxfmt CLI flags differ, update this document and package scripts together during project bootstrap.

---

## Commit Rule

One iteration should produce one commit.

Example:

```bash
git add .
git commit -m "docs: add initial SSOT bundle"
```

---

## Branch Policy

MVP can use trunk-based development.

Recommended branch naming:

```text
iteration/0002-project-bootstrap
iteration/0003-diffusion-core-solver
```

---

## Definition of Done

An iteration is done when:

- `.steering/` entry is complete
- docs are updated if needed
- tests are written first
- implementation passes tests
- coverage target is satisfied or exception is documented
- format/lint pass
- commit is created

---

## File: `docs/410-tdd-policy.md`

# TDD Policy

Status: Accepted

## Style

古典学派スタイルのTDDを採用する。

特徴:

- 実装内部ではなく外部から観測できる振る舞いをテストする
- モックを極力使わない
- 小さなステップで Red → Green → Refactor を回す
- テストを設計ツールとして使う

---

## Red Phase

Before implementation:

- 期待する振る舞いを1つだけテストにする
- テスト名で仕様を説明する
- 失敗理由を確認する

---

## Green Phase

- 最小限の実装で通す
- まだ一般化しすぎない
- 追加テストなしに設計を広げない

---

## Refactor Phase

- 重複を除く
- 命名を改善する
- domain conceptを抽出する
- all tests greenを維持する

---

## Mock Policy

原則としてモックを使わない。

許容される例:

- browser API that is unavailable in test environment
- time/date provider for deterministic export timestamp
- file download trigger
- WASM initialization boundary in component tests

モックを使った場合、該当 `.steering/` に理由を書く。

---

## Test Pyramid

Preferred:

```text
many pure function tests
some integration tests
some component tests
few e2e tests
```

---

## Numerical TDD Examples

### First solver test

```text
Given uniform concentration and zero current,
when simulation runs,
then concentration remains uniform.
```

### Boundary test

```text
Given positive delithiation current,
when one time step runs,
then interface concentration decreases before nonactive-side concentration.
```

### Acceptance test

```text
Given Figure 9 preset,
when simulation runs,
then beta utilization matches paper values within tolerance.
```

---

## Coverage

Coverage target:

```text
>= 80%
```

Coverage should not be achieved by superficial tests.
Numerical invariants and user-visible behavior are more important than testing implementation details.

---

## File: `docs/420-quality-gate.md`

# Quality Gate

Status: Accepted

## Required Commands Before Commit

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

If Rust code changed:

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

If WASM binding changed:

```bash
wasm-pack test --node
```

---

## Coverage Gate

Target:

```text
80%以上
```

Coverage below target is allowed only if:

- iteration is documentation-only, or
- project is before test infrastructure bootstrap, or
- exception is explicitly recorded in `.steering/` with remediation plan

---

## Lint Gate

oxlint warnings should be treated as actionable.

Disable rules only with comment explaining why.

---

## Format Gate

oxfmt is canonical for TypeScript/JavaScript formatting.

Rust uses rustfmt.

---

## Numerical Gate

For solver changes, the following must pass:

- mathematical sanity tests
- mass balance tests
- boundary tests
- Figure 9 acceptance tests once implemented

---

## Documentation Gate

If code behavior changes, at least one of the following must be updated or confirmed unchanged:

- `docs/110-diffusion-model.md`
- `docs/120-numerical-method.md`
- `docs/210-api-definition.md`
- `docs/230-ui-design.md`

`.steering/` must state which docs were checked.

---

## File: `docs/500-roadmap.md`

# Roadmap

Status: Proposed

## Iteration 0001: Documentation Bootstrap

Goal:

- Add root AGENTS.md
- Add package-level AGENTS.md
- Add docs SSOT
- Add steering templates

Deliverable:

- Documentation-only commit

---

## Iteration 0002: Project Bootstrap

Goal:

- Initialize Vite React TypeScript app with Vite Plus (`vp`)
- Configure pnpm workspace
- Configure Vitest
- Configure oxfmt
- Configure oxlint
- Configure base tsconfig

Acceptance:

- `pnpm check` runs
- first smoke test passes

---

## Iteration 0003: Shared Domain Package

Goal:

- Add unit conversion functions
- Add simulation parameter types
- Add validation schema
- Add Figure 9 presets

Acceptance:

- unit conversion tests pass
- invalid domain inputs fail validation

---

## Iteration 0004: Rust Diffusion Core MVP

Goal:

- Implement 1D solver
- Implement boundary conditions
- Implement stop condition
- Implement utilization calculation

Acceptance:

- mathematical sanity tests pass
- mass balance test passes

---

## Iteration 0005: WASM Binding

Goal:

- Expose solver to TypeScript
- Add error mapping
- Add integration test

Acceptance:

- TypeScript can call WASM solver
- invalid input returns typed error

---

## Iteration 0006: Figure 9 Reproduction UI

Goal:

- Add Figure 9 preset screen
- Show three concentration profile charts
- Show utilization comparison

Acceptance:

- beta utilization values are within tolerance
- chart labels include units

---

## Iteration 0007: Single Simulation UI

Goal:

- Add parameter form
- Add single simulation result chart
- Add export JSON/CSV

Acceptance:

- user can change current density and rerun
- exported JSON can reproduce simulation

---

## Iteration 0008: Figure 10 Temperature Sweep

Goal:

- Implement Arrhenius D(T)
- Implement utilization sweep
- Add temperature/current plot

Acceptance:

- utilization increases with temperature
- utilization decreases with current density

---

## Iteration 0009: Heatmap and Sweep UX

Goal:

- Add x-t concentration heatmap
- Add parameter sweep controls

Acceptance:

- UI remains responsive
- sweep result export works

---

## Iteration 0010: Multi-material Extension

Goal:

- Add material preset abstraction
- Prepare Li-In / Li-Al / Li-Ag support

Acceptance:

- Li-Mg behavior unchanged
- material library is documented

---

## File: `packages/diffusion-core/AGENTS.md`

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

---

## File: `packages/shared/AGENTS.md`

# packages/shared/AGENTS.md

## Scope

`packages/shared` はTypeScript側で共有する型、単位変換、定数、スキーマを格納する。

責務:

- TypeScript domain types
- simulation parameter schema
- unit conversion
- display formatting
- validation constants
- presets metadata

---

## Rules

### Do

- 全ての単位を型名またはフィールド名に明示する
- 論文由来の定数はsourceコメントを付ける
- UI表示用の文字列はここに集約しすぎない
- pure function としてテスト可能にする

### Do Not

- Reactに依存しない
- WASM生成物に直接依存しない
- 数値solverを実装しない

---

## Example Naming

```ts
thicknessUm;
currentDensityAcm2;
diffusionCoeffCm2PerS;
concentrationMmolPerCm3;
```

---

## File: `packages/ui/AGENTS.md`

# packages/ui/AGENTS.md

## Scope

`packages/ui` は再利用可能なUIコンポーネントを格納する。

責務:

- Button
- Slider
- NumberField
- Card
- Layout primitives
- Chart container wrappers

---

## Rules

### Do

- 見た目と基本挙動だけを扱う
- domain logic を持たない
- accessibility を考慮する
- component testを書く

### Do Not

- Li-Mg固有の値を置かない
- diffusion model を参照しない
- data fetching / WASM call を行わない

---

## File: `tests/AGENTS.md`

# tests/AGENTS.md

## Scope

`tests` は横断的なintegration test、acceptance test、fixtureを格納する。

---

## Rules

- テスト名は振る舞いを説明する
- モックは極力使わない
- fixture は出典と意味を明記する
- Figure 9 / Figure 10 再現テストは acceptance として扱う
- 失敗時にどの物理量がずれたか分かるassertion messageを書く

---

## Coverage Goal

全体80%以上。

ただし、数値モデルのacceptance testはカバレッジ目的ではなく、再現性保証を目的とする。
