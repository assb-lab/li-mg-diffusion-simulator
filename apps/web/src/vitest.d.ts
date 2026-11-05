import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import "vite-plus/test";

// Vitest 5 uses Matchers<R, T>; jest-dom 7 still augments the Vitest 4 Assertion type.
declare module "vite-plus/test" {
  interface Matchers<R, T> extends TestingLibraryMatchers<T, R> {}
}
