# GitHub Pages

## Goal

Publish the simulator on GitHub Pages and link it from the README and repository About.

## Scope

Pages workflow, project base path, static-host-compatible navigation, documentation.

## Out of scope

Changes to the numerical model, API, or simulation behavior.

## Red tests

A navigation test checks that the Pages build creates hash links, including a direct route reload. Existing page mocks avoid invoking computationally expensive simulations, consistent with the existing App tests.

## Implementation notes

GitHub Actions builds WASM and publishes the web artifact. Pages uses the project base path and hash routes; local builds retain browser history. Repository Pages is configured for Actions and About points to the site.

## Refactor notes

Kept the router selection limited to the deployment base; no numerical logic changed.

## Validation

- Red test confirmed the existing browser router did not resolve the Pages hash route.
- 31 test files / 77 tests passed; coverage: statements 86.44%, lines 86.16%.
- WASM release build and Pages-configured web build passed.
- Reviewed docs/110, 120, 210 and 230: model, API and UI specifications unchanged.
- Deployment will run after merge; live site is not yet verified.

## Quality gate result

`pnpm fmt`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage` passed.

## Commit message

`ci: deploy simulator to github pages`
