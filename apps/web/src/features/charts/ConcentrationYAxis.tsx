import { isMajorConcentrationTick, majorConcentrationTicks } from "@li-mg/shared";
import { ReferenceLine, YAxis } from "recharts";
import { CHART_AXIS_COLOR, CHART_GRID_COLOR, chartAxisLabelStyle } from "./chartTheme";

interface ConcentrationYAxisProps {
  yMinMmolPerCm3: number;
  yMaxMmolPerCm3: number;
  tickValuesMmolPerCm3: number[];
}

export function ConcentrationHorizontalGrid({
  tickValuesMmolPerCm3,
}: {
  tickValuesMmolPerCm3: number[];
}) {
  return (
    <>
      {tickValuesMmolPerCm3.map((y) => (
        <ReferenceLine
          key={`grid-y-${y}`}
          y={y}
          stroke={CHART_GRID_COLOR}
          strokeDasharray={isMajorConcentrationTick(y) ? "3 3" : "2 5"}
          strokeWidth={isMajorConcentrationTick(y) ? 1 : 0.6}
          ifOverflow="discard"
        />
      ))}
    </>
  );
}

export function ConcentrationYAxis({
  yMinMmolPerCm3,
  yMaxMmolPerCm3,
  tickValuesMmolPerCm3,
}: ConcentrationYAxisProps) {
  const majorTicks = majorConcentrationTicks(tickValuesMmolPerCm3);

  return (
    <YAxis
      type="number"
      stroke={CHART_AXIS_COLOR}
      domain={[yMinMmolPerCm3, yMaxMmolPerCm3]}
      ticks={majorTicks}
      allowDecimals={false}
      allowDataOverflow
      width={58}
      tickCount={majorTicks.length}
      tickLine={{ stroke: CHART_AXIS_COLOR }}
      axisLine={{ stroke: CHART_AXIS_COLOR }}
      tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
      label={{
        value: "Li concentration (mmol cm⁻³)",
        angle: -90,
        position: "insideLeft",
        ...chartAxisLabelStyle,
      }}
    />
  );
}
