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
