import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#0038FF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AssessmentTrendChart({ data }) {
  if (!data || !data.points || data.points.length === 0) return null;

  return (
    <div className="ce-card p-5 md:p-6" data-testid="trend-chart-card">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
        <div>
          <div className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
            Your interest trend
          </div>
          <h3 className="font-display font-extrabold text-xl tracking-tight mt-1">
            How your match% has evolved
          </h3>
        </div>
        <div className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: "var(--text-2)" }}>
          {data.count} attempt{data.count === 1 ? "" : "s"}
        </div>
      </div>

      {data.points.length === 1 ? (
        <p className="text-sm" style={{ color: "var(--text-2)" }} data-testid="trend-single-note">
          Take the assessment again to see how your interests evolve over time.
        </p>
      ) : (
        <div data-testid="trend-chart-svg" style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.points} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#52525B", fontWeight: 600 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: "#52525B", fontWeight: 600 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E4E4E7", fontSize: 13 }}
                formatter={(v) => `${v}%`}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
              {data.careers.map((c, i) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
