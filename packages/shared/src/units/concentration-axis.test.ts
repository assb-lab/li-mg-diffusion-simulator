import { describe, expect, it } from "vitest";
import {
  buildConcentrationAxisFromInitial,
  isMajorConcentrationTick,
  majorConcentrationTicks,
} from "./concentration-axis";

describe("buildConcentrationAxisFromInitial", () => {
  it("sets ymax slightly above initial concentration on a 10 grid", () => {
    const axis = buildConcentrationAxisFromInitial(69.6);
    expect(axis.yMaxMmolPerCm3).toBe(70);
    expect(axis.yMinMmolPerCm3).toBe(0);
  });

  it("provides major ticks every 10 and minor every 5", () => {
    const axis = buildConcentrationAxisFromInitial(69.6);
    expect(axis.tickValuesMmolPerCm3).toEqual([
      0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70,
    ]);
    expect(isMajorConcentrationTick(10)).toBe(true);
    expect(isMajorConcentrationTick(5)).toBe(false);
    expect(majorConcentrationTicks(axis.tickValuesMmolPerCm3)).toEqual([
      0, 10, 20, 30, 40, 50, 60, 70,
    ]);
  });

  it("rounds ymax up to the next decade for larger initial values", () => {
    expect(buildConcentrationAxisFromInitial(72.1).yMaxMmolPerCm3).toBe(80);
  });
});
