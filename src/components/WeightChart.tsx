// src/components/WeightChart.tsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useWeights } from "../hooks/useWeights";

// Trim '2026-07-19' -> 'Jul 19' for axis ticks.
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[Number(m) - 1]} ${Number(d)}`;
}

export function WeightChart() {
  const { data, isLoading, isError, error } = useWeights();

  if (isLoading) return <p className="chart__msg">Loading weight history…</p>;
  if (isError)
    return (
      <p className="chart__msg chart__msg--err">{(error as Error).message}</p>
    );
  if (!data || data.length === 0)
    return (
      <p className="chart__msg">
        No weigh-ins yet. Log one above to start the chart.
      </p>
    );

  // Give the Y axis a little breathing room around the real range.
  const weights = data.map((d) => d.weight_lbs ?? 0).filter(Boolean);
  const min = Math.floor(Math.min(...weights) - 1);
  const max = Math.ceil(Math.max(...weights) + 1);

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
        >
          <CartesianGrid
            stroke="var(--line-faint)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="entry_date"
            tickFormatter={shortDate}
            tick={{
              fill: "var(--ink-dim)",
              fontSize: 11,
              fontFamily: "var(--mono)",
            }}
            minTickGap={28}
            axisLine={{ stroke: "var(--line-faint)" }}
            tickLine={false}
          />
          <YAxis
            domain={[min, max]}
            tick={{
              fill: "var(--ink-dim)",
              fontSize: 11,
              fontFamily: "var(--mono)",
            }}
            width={44}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontFamily: "var(--mono)",
              fontSize: 12,
            }}
            labelFormatter={(v) => shortDate(String(v))}
            formatter={(val: number, name) => [
              `${val?.toFixed?.(1) ?? val} lbs`,
              name === "avg_7d" ? "7-day avg" : "Weight",
            ]}
          />
          {/* Raw daily weight — quiet, so the trend line reads as the signal. */}
          <Line
            type="monotone"
            dataKey="weight_lbs"
            stroke="var(--ink-dim)"
            strokeWidth={1}
            dot={false}
            connectNulls
          />
          {/* 7-day average — the accent line, the thing you actually track. */}
          <Line
            type="monotone"
            dataKey="avg_7d"
            stroke="var(--accent)"
            strokeWidth={2.5}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
