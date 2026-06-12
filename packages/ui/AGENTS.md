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
