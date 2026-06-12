import { buildConcentrationAxisFromInitial, majorConcentrationTicks } from "@li-mg/shared";
import { render, screen } from "@testing-library/react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { describe, expect, it } from "vitest";
import { ConcentrationYAxis } from "./ConcentrationYAxis";

describe("ConcentrationYAxis", () => {
  it("renders all major tick labels from 0 to ymax", () => {
    const axis = buildConcentrationAxisFromInitial(69.6);
    const majorTicks = majorConcentrationTicks(axis.tickValuesMmolPerCm3);

    render(
      <ResponsiveContainer width={400} height={300}>
        <LineChart
          data={[
            { xUm: 0, concentrationMmolPerCm3: 69.6 },
            { xUm: 25, concentrationMmolPerCm3: 24 },
          ]}
          margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
        >
          <ConcentrationYAxis
            yMinMmolPerCm3={axis.yMinMmolPerCm3}
            yMaxMmolPerCm3={axis.yMaxMmolPerCm3}
            tickValuesMmolPerCm3={axis.tickValuesMmolPerCm3}
          />
          <Line dataKey="concentrationMmolPerCm3" stroke="#dc2626" dot={false} />
        </LineChart>
      </ResponsiveContainer>,
    );

    for (const tick of majorTicks) {
      expect(screen.getByText(String(tick))).toBeInTheDocument();
    }
  });
});
