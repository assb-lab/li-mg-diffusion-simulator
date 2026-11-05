import path from "node:path";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
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
