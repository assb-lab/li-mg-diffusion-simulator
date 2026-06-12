import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "pnpm fmt",
    "*.{js,jsx,ts,tsx}": "pnpm lint",
  },
});
