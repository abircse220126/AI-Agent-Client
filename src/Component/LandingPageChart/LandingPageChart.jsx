
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
const LandingPageChart = ({ page }) => {
  const chartData = [
    {
      name: "Views",
      value: Number(page.views || 0),
    },
    {
      name: "Clicks",
      value: Number(page.clicks || 0),
    },
  ];

  return (
    <div className="w-full h-40 mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3">
      <div className="text-xs text-gray-400 mb-2">Performance</div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: -25,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="name"
            tick={{
              fill: "#94a3b8",
              fontSize: 10,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#64748b",
              fontSize: 9,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#fff",
            }}
          />

          <Bar dataKey="value" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default LandingPageChart;
