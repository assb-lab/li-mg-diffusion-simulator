// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import config from "../../vite.config";

const root = new URL("../../", import.meta.url);
const readJson = (file: string) => JSON.parse(readFileSync(new URL(file, root), "utf8"));

describe("unified workspace toolchain", () => {
  it("pins Node 26 and pnpm 12 at the workspace root", () => {
    const manifest = readJson("package.json");
    expect(manifest.packageManager).toMatch(/^pnpm@12\.\d+\.\d+$/);
    expect(manifest.engines.node).toBe(">=26 <27");
    expect(readFileSync(new URL(".node-version", root), "utf8").trim()).toMatch(/^26\./);
    expect(readJson("apps/web/package.json").packageManager).toBeUndefined();
  });

  it("runs quality gates through Vite Plus without standalone lint and format tools", () => {
    const manifest = readJson("package.json");
    for (const script of ["fmt", "fmt:check", "lint", "test", "test:coverage", "check"]) {
      expect(manifest.scripts[script]).toMatch(/^vp /);
    }
    expect(manifest.devDependencies["vite-plus"]).toMatch(/^\d+\.\d+\.\d+$/);
    for (const file of ["package.json", "apps/web/package.json"]) {
      const deps = readJson(file).devDependencies;
      for (const name of [
        "eslint",
        "typescript-eslint",
        "oxlint",
        "oxfmt",
        "esbuild",
        "vite-plugin-top-level-await",
      ]) {
        expect(deps[name], `${file}: ${name} must be owned by Vite Plus`).toBeUndefined();
      }
    }
  });

  it("owns static checks and the existing coverage gate in the root Vite config", () => {
    expect(config.lint?.options).toMatchObject({ typeAware: true, typeCheck: true });
    expect(config.test?.coverage?.thresholds).toMatchObject({ lines: 80, statements: 80 });
    expect(config.test?.setupFiles).toEqual(["./tests/setup.ts"]);
    for (const file of [
      "vitest.config.ts",
      ".oxlintrc.json",
      ".oxfmtrc.jsonc",
      "apps/web/eslint.config.js",
    ]) {
      expect(existsSync(new URL(file, root)), `${file} must be consolidated`).toBe(false);
    }
  });
});
