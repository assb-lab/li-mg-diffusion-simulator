import { describe, expect, it } from "vitest";
import { formatSimulationDurationS } from "./format-duration";

describe("formatSimulationDurationS", () => {
  it("formats long durations in hours", () => {
    expect(formatSimulationDurationS(1_033_450).label).toBe("287.1 h");
  });

  it("formats medium durations in minutes", () => {
    expect(formatSimulationDurationS(550).label).toBe("9.2 min");
  });

  it("formats short durations in seconds", () => {
    expect(formatSimulationDurationS(12.5).label).toBe("12.5 s");
  });
});
