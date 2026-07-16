# Development Workflow

Status: Accepted

## Bootstrap Policy

環境構築には Vite Plus (`vp`) を用いる。

パッケージマネージャーは pnpm を用いる。

Nix flakes は任意の開発シェル入口として提供する。
Nix を使う場合も、依存関係のインストールとプロジェクト操作は pnpm scripts を正とする。

Nix を使わない場合は、開発者のローカル環境に以下を用意する。

- Node.js 24 系
- pnpm 11 系
- Rust toolchain (`cargo`, `rustc`, `rustfmt`, `clippy`)
- wasm-pack
- （任意）Go 1.22+ — 単体バイナリ配布時のみ

Vite Plus (`vp`) は project dependency として管理する。
グローバル `vp` のインストールを前提にせず、`pnpm install` 後に pnpm scripts から呼び出す。

Bootstrap procedure is finalized in `.steering/0002-project-bootstrap.md` during implementation, because exact `vp` command options may depend on the installed Vite Plus version.

---

## Technology Choices

Status: Accepted

| Area             | Choice                       | Rationale                                       |
| ---------------- | ---------------------------- | ----------------------------------------------- |
| Web app runner   | Vite Plus (`vp`)             | Unified app dev/build entrypoint for `apps/web` |
| Bundler family   | Vite 8 / Rolldown / OXC      | Vite+ compatible current toolchain              |
| React plugin     | @vitejs/plugin-react         | Vite 8 compatible React transform               |
| Chart library    | Recharts                     | Lightweight React integration                   |
| WASM build       | wasm-pack + vite-plugin-wasm | Standard Rust WASM toolchain                    |
| Form validation  | Zod                          | Schema-first validation in `packages/shared`    |
| Binary packaging | Go `embed` + `net/http`      | Optional local static serve of `apps/web/dist`  |

---

## Root and App Roles

Status: Accepted

The root package is not the web app.
It owns workspace orchestration, repository-level scripts, cross-package Vitest config, and shared tooling dependencies.

`apps/web` is the Vite Plus application.
Its app lifecycle commands are:

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web preview
```

The root convenience command:

```bash
pnpm dev
```

delegates to:

```bash
pnpm --filter web dev
```

---

## Vite Plus, Rolldown, OXC, and esbuild

Status: Accepted

Vite Plus / Vite 8 is treated as a Rolldown + OXC based toolchain.
Prefer current Vite 8 names when adding configuration:

- use `build.rolldownOptions` instead of `build.rollupOptions`
- use `optimizeDeps.rolldownOptions` instead of `optimizeDeps.rollupOptions`
- use `oxc` instead of deprecated `esbuild` transform options when possible

`esbuild` is still an explicit root devDependency because `vite-plugin-top-level-await` requires it at runtime.
It is not the intended primary bundler for this app.
`esbuild@^0.27.1` is used because it satisfies Vite 8 peer requirements and keeps the current `vite-plugin-top-level-await` build path working.
`esbuild@0.28.x` fails production builds with a destructuring transform error under the default browser targets, so `pnpm-workspace.yaml` `overrides.esbuild` pins `^0.27.1` for every workspace package, including `apps/web`.

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
pnpm exec vp --help
pnpm wasm:build
pnpm dev
```

Nix shell verification command:

```bash
nix develop --command bash -lc "pnpm install && pnpm exec vp --help && pnpm wasm:build && pnpm --filter web build"
```

WASM release build:

```bash
pnpm wasm:build
```

`pnpm wasm:build` は `wasm-pack build --release` を呼ぶ。
`packages/diffusion-core/Cargo.toml` の release profile は WASM 配布サイズを優先し、`opt-level = "z"`、LTO、single codegen unit、`panic = "abort"`、strip を有効にする。
`wasm-pack` の release profile metadata では `wasm-opt = ["-Oz", "--enable-bulk-memory", "--enable-nontrapping-float-to-int"]` を使う。

Non-Nix local setup example for macOS:

```bash
brew install node@24 pnpm wasm-pack
rustup toolchain install stable
rustup default stable
rustup component add rustfmt clippy
node --version
pnpm --version
cargo --version
wasm-pack --version
pnpm install
pnpm wasm:build
pnpm dev
```

Canonical package scripts:

```bash
pnpm fmt
pnpm fmt:check
pnpm lint
pnpm test
pnpm test:coverage
pnpm check
```

`pnpm fmt` applies formatting.
`pnpm fmt:check` verifies formatting without writing changes.
`pnpm check` is the non-mutating aggregate gate and intentionally uses `fmt:check`.

### Optional single-binary packaging

Status: Accepted

Requires Go toolchain (`go`) in addition to the usual Node/pnpm/Rust/wasm-pack stack.
The Go binary only serves static assets; calculation stays in browser WASM.

```bash
# Apple Silicon (darwin/arm64)
pnpm binary:build:apple-silicon
./bin/li-mg-diffusion-simulator-apple-silicon

# Windows x86_64 (windows/amd64), cross-compile from macOS/Linux is supported
pnpm binary:build:windows-x64
# transfer bin/li-mg-diffusion-simulator-windows-x64.exe to a Windows machine
```

Equivalent direct scripts:

```bash
./scripts/build-binary-apple-silicon.sh
./scripts/build-binary-windows-x64.sh
```

Each script runs `pnpm wasm:build`, `pnpm --filter web build`, then `go build` with `CGO_ENABLED=0`.
Default listen address is `127.0.0.1:4173`. Override with flags:

```bash
./bin/li-mg-diffusion-simulator-apple-silicon --port 4183
./bin/li-mg-diffusion-simulator-apple-silicon --host 0.0.0.0 --port 8080
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
