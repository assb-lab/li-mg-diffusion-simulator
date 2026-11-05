import { describe, expect, it } from "vite-plus/test";
import { UI_PACKAGE_NAME } from "./index";

describe("ui package", () => {
  it("exports package name", () => {
    expect(UI_PACKAGE_NAME).toBe("@li-mg/ui");
  });
});
