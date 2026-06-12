import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ConcentrationHorizontalGrid, ConcentrationYAxis } from "../charts/ConcentrationYAxis";
import {
  CHART_AXIS_COLOR,
  CHART_GRID_COLOR,
  CHART_LINE_COLOR,
  chartAxisLabelStyle,
  chartAxisTickStyle,
} from "../charts/chartTheme";
import type { ConcentrationChartSeries } from "./figure9ViewModel";

interface ConcentrationChartProps {
  title: string;
  series: ConcentrationChartSeries;
}

function hasFixedConcentrationAxis(series: ConcentrationChartSeries): boolean {
  return (
    series.yMinMmolPerCm3 !== undefined &&
    series.yMaxMmolPerCm3 !== undefined &&
    series.yTickValuesMmolPerCm3 !== undefined &&
    series.yTickValuesMmolPerCm3.length > 0
  );
}

export function ConcentrationChart({ title, series }: ConcentrationChartProps) {
  const subtitle = series.selectedTimeLabel
    ? `t = ${series.selectedTimeLabel}`
    : series.stopTimeLabel
      ? `β lower bound reached at ${series.stopTimeLabel}`
      : null;
  const fixedAxis = hasFixedConcentrationAxis(series);

  return (
    <section aria-label={title}>
      <h3>{title}</h3>
      {subtitle ? <p className="chart-subtitle">{subtitle}</p> : null}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={series.data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          {fixedAxis ? (
            <ConcentrationHorizontalGrid tickValuesMmolPerCm3={series.yTickValuesMmolPerCm3!} />
          ) : (
            <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="3 3" />
          )}
          <XAxis
            dataKey="xUm"
            type="number"
            domain={[0, series.xMaxUm]}
            allowDataOverflow
            stroke={CHART_AXIS_COLOR}
            tick={chartAxisTickStyle}
            label={{
              value: "Distance (µm)",
              position: "insideBottom",
              offset: -5,
              ...chartAxisLabelStyle,
            }}
          />
          {fixedAxis ? (
            <ConcentrationYAxis
              yMinMmolPerCm3={series.yMinMmolPerCm3!}
              yMaxMmolPerCm3={series.yMaxMmolPerCm3!}
              tickValuesMmolPerCm3={series.yTickValuesMmolPerCm3!}
            />
          ) : (
            <YAxis
              stroke={CHART_AXIS_COLOR}
              tick={chartAxisTickStyle}
              label={{
                value: "Li concentration (mmol cm⁻³)",
                angle: -90,
                position: "insideLeft",
                ...chartAxisLabelStyle,
              }}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d4d4d8",
              color: "#000000",
            }}
          />
          <Legend wrapperStyle={{ color: "#000000" }} />
          <ReferenceLine
            y={series.betaLowerBoundMmolPerCm3}
            stroke={CHART_AXIS_COLOR}
            strokeDasharray="4 4"
            label={{
              value: "β lower bound",
              position: "insideTopRight",
              fill: CHART_AXIS_COLOR,
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="concentrationMmolPerCm3"
            name={`c_Li (${series.label})`}
            stroke={CHART_LINE_COLOR}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
