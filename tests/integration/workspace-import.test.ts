import { MODEL_VERSION } from "@li-mg/shared";
import { describe, expect, it } from "vitest";

describe("workspace import", () => {
  it("imports @li-mg/shared from the monorepo", () => {
    expect(MODEL_VERSION).toBe("0.1.0");
  });
});
