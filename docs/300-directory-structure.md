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
├── flake.nix
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

### flake.nix

Status: Accepted

任意の Nix flakes 開発シェル定義。
Node.js、pnpm、Rust toolchain、wasm-pack を揃えるための補助入口であり、プロジェクトの package manager は引き続き pnpm とする。

---

## AGENTS.md Placement

以下に配置する。

- root: repository-wide rules
- apps/web: frontend-specific rules
- packages/diffusion-core: Rust/WASM-specific rules
- packages/shared: shared package rules
- packages/ui: UI package rules
- tests: testing-specific rules
