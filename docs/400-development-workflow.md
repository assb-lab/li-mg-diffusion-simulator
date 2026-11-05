# Development Workflow

Status: Accepted

## Bootstrap Policy

環境構築には Vite Plus (`vp`) を用いる。

パッケージマネージャーは pnpm を用いる。

Nix flakes は任意の開発シェル入口として提供する。
Nix を使う場合も、依存関係のインストールとプロジェクト操作は pnpm scripts を正とする。

Nix を使わない場合は、開発者のローカル環境に以下を用意する。

- Node.js 26 系
- pnpm 12 系
- Rust toolchain (`cargo`, `rustc`, `rustfmt`, `clippy`)
- wasm-pack
- （任意）Go 1.22+ — 単体バイナリ配布時のみ

Vite Plus (`vp`) は project dependency として管理する。
グローバル `vp` のインストールを前提にせず、`pnpm install` 後に pnpm scripts から呼び出す。

The bootstrap commands below are canonical. Historical bootstrap decisions are
recorded in `.steering/0002-project-bootstrap.md`.

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
It owns workspace orchestration, repository-level scripts, unified Vite Plus config, and shared tooling dependencies.

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

delegates directly to Vite Plus:

```bash
vp dev apps/web
```

---

## Unified Vite Plus Toolchain

Status: Implemented

Node.js is pinned to 26.13.0 in `.node-version` and constrained to major 26 in
`package.json`. pnpm is pinned to 12.16.1 in root `packageManager`; workspace
packages inherit it. Vite Plus is pinned to 1.5.0, the registry stable release
verified on 2026-11-05. Bundled tool versions are owned by Vite Plus, not updated
individually. Use `pnpm exec vp toolchain` to inspect the effective versions.

Root `vite.config.ts` owns test, coverage, lint, format, and staged-file settings.
`apps/web/vite.config.ts` owns only application build/dev settings. Remove separate
Vitest, ESLint, Oxlint, and Oxfmt config files. Tests import `vite-plus/test`;
Vite/Vitest aliases required by third-party plugins must resolve to the Vite Plus
bundled packages. Avoid independent runner/formatter/linter dependencies. The optional
`@vitest/coverage-v8` provider and `vitest` peer dependency for jest-dom are pinned
to the bundled Vitest version via the workspace catalog. TypeScript 7.0.2 remains
an editor dependency at the root; builds use the Vite Plus type checker, without a
separate `tsc` invocation. React 19.3.1, React plugin 6.2.1, jsdom 30.1.3,
Testing Library React 16.3.3 and jest-dom 7.0.1 are the verified stable releases
for this migration. React Router and Recharts remain on their current major lines.
WASM acceptance/integration suites run in the Node environment;
component tests retain jsdom. Vitest 5 matcher types are augmented in
`apps/web/src/vitest.d.ts` until jest-dom adopts the new `Matchers<R, T>` API.

`vp check` runs Oxfmt, Oxlint, type-aware rules and TypeScript type checking
(`lint.options.typeAware` and `typeCheck`). All workspace sources and root tests
must belong to TypeScript projects. Keep the existing pnpm command entrypoints,
but delegate to Vite Plus. `pnpm check` combines non-mutating static checks with
coverage tests; production build runs the static checks before the app build.
Root staged checks use `vp check --fix`; install the hook from the root package.
`prepare` runs `vp config --hooks --hooks-dir .vite-hooks --no-agent`. For clones
with the previous app-local hook, set the new dispatcher path with
`git config --local core.hooksPath .vite-hooks/_`, then run
`pnpm exec vp hooks enable --hooks-dir .vite-hooks`. Vite Plus preserves an
existing hook path instead of overwriting it automatically.

Rust/WASM compilation remains `wasm-pack`, and optional Go packaging remains Go.
Native top-level await is supported by the bundled Vite browser targets.
`vite-plugin-top-level-await`, its explicit esbuild dependency and compatibility
override have been removed after validating the upgraded build.
`vite-plugin-wasm` provides WASM ESM integration.
Do not raise browser targets just to make migration pass.

Vitest 5 migration must preserve all tests, acceptance criteria, and the 80% line
and statement coverage gates. Review generated compatibility settings with actual
test runs; keep only settings needed for existing behavior. Do not weaken coverage
or add skips to resolve migration failures.

References:

- [Vite Plus migration](https://www.viteplus.dev/guide/migrate)
- [Vite Plus configuration](https://www.viteplus.dev/config/)
- [Vite Plus check](https://www.viteplus.dev/guide/check)
- [pnpm 12 release](https://pnpm.io/blog/releases/12.0)

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
brew install node@26 wasm-pack
npm install -g pnpm@12.16.1
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
`pnpm check` is the non-mutating aggregate gate: `vp check` plus coverage tests.

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

## Canonical Root Scripts

Status: Accepted

```json
{
  "scripts": {
    "dev": "vp dev apps/web",
    "build": "vp check && vp build apps/web",
    "fmt": "vp fmt",
    "fmt:check": "vp fmt --check",
    "lint": "vp lint",
    "test": "vp test run",
    "test:watch": "vp test",
    "test:coverage": "vp test run --coverage",
    "check": "vp check && vp test run --coverage"
  }
}
```

Nix uses Node.js 26.13.0 and pnpm_12 as the bootstrap package. The repository
packageManager field selects pnpm 12.16.1 inside the shell. Keep flake inputs
locked and validate the shell's Node/pnpm versions when updating them.

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
