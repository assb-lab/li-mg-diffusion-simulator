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
