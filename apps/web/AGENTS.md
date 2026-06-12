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
