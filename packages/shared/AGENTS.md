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
