# Quality Gate

Status: Accepted

## Required Commands Before Commit

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

If Rust code changed:

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

If WASM binding changed:

```bash
wasm-pack test --node
```

---

## Coverage Gate

Target:

```text
80%以上
```

Coverage below target is allowed only if:

- iteration is documentation-only, or
- project is before test infrastructure bootstrap, or
- exception is explicitly recorded in `.steering/` with remediation plan

---

## Lint Gate

oxlint warnings should be treated as actionable.

Disable rules only with comment explaining why.

---

## Format Gate

oxfmt is canonical for TypeScript/JavaScript formatting.

Rust uses rustfmt.

---

## Numerical Gate

For solver changes, the following must pass:

- mathematical sanity tests
- mass balance tests
- boundary tests
- Figure 9 acceptance tests once implemented

---

## Documentation Gate

If code behavior changes, at least one of the following must be updated or confirmed unchanged:

- `docs/110-diffusion-model.md`
- `docs/120-numerical-method.md`
- `docs/210-api-definition.md`
- `docs/230-ui-design.md`

`.steering/` must state which docs were checked.
