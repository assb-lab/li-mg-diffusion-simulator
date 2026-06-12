import path from "node:path";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [react(), wasm(), topLevelAwait()],
  resolve: {
    alias: {
      "@li-mg/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@li-mg/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@li-mg/diffusion-core": path.resolve(
        __dirname,
        "../../packages/diffusion-core/pkg/diffusion_core.js",
      ),
    },
  },
  assetsInclude: ["**/*.wasm"],
});
