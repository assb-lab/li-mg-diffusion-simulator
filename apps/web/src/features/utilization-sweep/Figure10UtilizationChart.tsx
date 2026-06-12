import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_AXIS_COLOR,
  CHART_GRID_COLOR,
  chartAxisLabelStyle,
  chartAxisTickStyle,
} from "../charts/chartTheme";
import { seriesColorAt } from "../charts/seriesColors";
import type { Figure10Series } from "./figure10ChartViewModel";

interface Figure10UtilizationChartProps {
  title: string;
  data: Record<string, number>[];
  xDataKey: string;
  xLabel: string;
  xTickFormatter?: (value: number) => string;
  series: Figure10Series[];
}

export function Figure10UtilizationChart({
  title,
  data,
  xDataKey,
  xLabel,
  xTickFormatter,
  series,
}: Figure10UtilizationChartProps) {
  return (
    <figure className="figure10-chart">
      <figcaption>{title}</figcaption>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data}>
          <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="3 3" />
          <XAxis
            dataKey={xDataKey}
            stroke={CHART_AXIS_COLOR}
            tick={chartAxisTickStyle}
            tickFormatter={xTickFormatter}
            label={{
              value: xLabel,
              position: "insideBottom",
              offset: -5,
              ...chartAxisLabelStyle,
            }}
          />
          <YAxis
            stroke={CHART_AXIS_COLOR}
            tick={chartAxisTickStyle}
            label={{
              value: "Beta-phase utilization (%)",
              angle: -90,
              position: "insideLeft",
              ...chartAxisLabelStyle,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d4d4d8",
              color: "#000000",
            }}
          />
          <Legend wrapperStyle={{ color: "#000000" }} />
          {series.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              name={line.label}
              dataKey={line.key}
              stroke={seriesColorAt(index)}
              strokeWidth={2}
              dot
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
}
