import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MiniVitalsCharts({ vitalsHistory }) {
  if (!vitalsHistory) {
    return null;
  }

  return (
    <div className="chart-box">
      <h4>Trends</h4>

      <div className="mini-chart-grid">
        <div className="mini-chart-card">
          <span>HR</span>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={vitalsHistory}>
              <Tooltip />
              <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mini-chart-card">
          <span>BP</span>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={vitalsHistory}>
              <Tooltip />
              <Line type="monotone" dataKey="systolicBP" stroke="#f97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="diastolicBP" stroke="#facc15" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mini-chart-card">
          <span>SpO₂</span>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={vitalsHistory}>
              <Tooltip />
              <Line type="monotone" dataKey="oxygenSaturation" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mini-chart-card">
          <span>Temp</span>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={vitalsHistory}>
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MiniVitalsCharts;