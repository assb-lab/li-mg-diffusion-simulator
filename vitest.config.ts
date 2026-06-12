import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      "@li-mg/shared": path.resolve(__dirname, "packages/shared/src"),
      "@li-mg/shared/wasm/adapter": path.resolve(__dirname, "packages/shared/src/wasm/adapter.ts"),
      "@li-mg/ui": path.resolve(__dirname, "packages/ui/src/index.ts"),
    },
  },
  assetsInclude: ["**/*.wasm"],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/pkg/**", "**/dist/**", "**/generate-fixtures.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["apps/web/src/**/*.{ts,tsx}", "packages/shared/src/**", "packages/ui/src/**"],
      exclude: [
        "**/*.d.ts",
        "**/wasm/**",
        "**/main.tsx",
        "packages/shared/src/types/**",
        "apps/web/src/features/utilization-sweep/Figure10Page.tsx",
        "apps/web/src/features/concentration-profile/SingleSimulationPage.tsx",
      ],
      thresholds: {
        lines: 80,
        statements: 80,
      },
    },
  },
});
