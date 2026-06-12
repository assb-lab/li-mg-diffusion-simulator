# Development Workflow

Status: Accepted

## Bootstrap Policy

環境構築には Vite Plus (`vp`) を用いる。

パッケージマネージャーは pnpm を用いる。

Nix flakes は任意の開発シェル入口として提供する。
Nix を使う場合も、依存関係のインストールとプロジェクト操作は pnpm scripts を正とする。

Bootstrap procedure is finalized in `.steering/0002-project-bootstrap.md` during implementation, because exact `vp` command options may depend on the installed Vite Plus version.

---

## Technology Choices

Status: Accepted

| Area            | Choice                       | Rationale                                    |
| --------------- | ---------------------------- | -------------------------------------------- |
| Chart library   | Recharts                     | Lightweight React integration                |
| WASM build      | wasm-pack + vite-plugin-wasm | Standard Rust WASM toolchain                 |
| Form validation | Zod                          | Schema-first validation in `packages/shared` |

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

Nix development shell:

```bash
nix develop
pnpm install
pnpm wasm:build
pnpm dev
```

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
