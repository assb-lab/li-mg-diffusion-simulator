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
│       ├── main.go
│       ├── go.mod
│       ├── staticserver/
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
│   ├── build-binary-apple-silicon.sh
│   └── build-binary-windows-x64.sh
├── bin/                      # binary build output (gitignored)
├── flake.nix
├── flake.lock
├── package.json
├── pnpm-workspace.yaml
├── vite.config.ts
├── vitest.config.ts
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

Vite Plus React Web app本体。
`vp dev` / `vp build` はこの package の scripts から実行する。

`main.go` / `go.mod` / `staticserver/` は任意の単体バイナリ配布用ローカル静的サーバである。
数値計算ロジックはここへ置かない。`dist/` を `embed` して配信するだけとする。

### scripts

Project automation scripts。
単体バイナリ向けには次の 2 系統を正とする。

- `build-binary-apple-silicon.sh` → `darwin/arm64`
- `build-binary-windows-x64.sh` → `windows/amd64`

### bin

単体バイナリの出力先。gitignore 対象。

### root package.json

Status: Accepted

pnpm workspace の統括、横断テスト、品質ゲート、共有 tooling の入口。
root は user-facing app ではない。
root の `vite` / `@vitejs/plugin-react` / `vitest` は root-level Vitest と plugin 解決のために置く。

### root vite.config.ts

Status: Accepted

Vite Plus git hook 用の root config。
`core.hooksPath` が `apps/web/.vite-hooks/_` を指していても、commit は root から実行されるため root の `staged` config を正とする。

### packages/diffusion-core

Rust/WASM solver。

### packages/shared

TypeScript shared domain package。

### packages/ui

Reusable UI components。
現時点では小さく保ち、複数 feature / package で再利用する UI primitive だけを置く。

### tests

Cross-package tests and fixtures。

### flake.nix

Status: Accepted

任意の Nix flakes 開発シェル定義。
Node.js、pnpm、Rust toolchain、wasm-pack、任意の単体バイナリ配布用 Go を揃えるための補助入口であり、プロジェクトの package manager は引き続き pnpm とする。

### flake.lock

Status: Accepted

Nix flake inputs の lock file。
再現可能な `nix develop` のために commit 対象とする。

---

## AGENTS.md Placement

以下に配置する。

- root: repository-wide rules
- apps/web: frontend-specific rules
- packages/diffusion-core: Rust/WASM-specific rules
- packages/shared: shared package rules
- packages/ui: UI package rules
- tests: testing-specific rules
