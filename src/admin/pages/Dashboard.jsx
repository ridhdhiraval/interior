import React from 'react'

export default function Dashboard() {
  return (
    <div className="admin-dashboard">
      <style>{`
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .card h3 { margin: 0; font-size: 13px; opacity: 0.9; color: #3e5b74; }
        .metric { font-size: 24px; font-weight: 800; margin-top: 8px; color: #0e3a63; }
        .trend { font-size: 12px; color: #27ae60; margin-top: 4px; }
        .panel { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .chart { height: 280px; background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .chart h4 { margin: 0 0 10px; font-size: 14px; opacity: 0.95; color: #0e3a63; }
        .list { border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; overflow: hidden; background: #ffffff; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .list table { width: 100%; border-collapse: collapse; }
        .list th, .list td { font-size: 13px; padding: 12px 14px; border-bottom: 1px solid rgba(0,40,80,0.1); }
        .list th { text-align: left; background: #f5f8fb; color: #0b2a4a; opacity: 0.95; }
        .list tr:hover td { background: #f8fbff; }
        @media (max-width: 1100px) { .grid { grid-template-columns: repeat(2,1fr); } .panel { grid-template-columns: 1fr; } }
      `}</style>

      <div className="grid">
        <MetricCard title="Active Users" value="1,248" trend="+4.8%" />
        <MetricCard title="Monthly Revenue" value="$5,230" trend="+3.1%" />
        <MetricCard title="New Orders" value="86" trend="+1.7%" />
        <MetricCard title="Refund Rate" value="0.8%" trend="-0.2%" />
      </div>

      <div className="panel">
        <div className="chart">
          <h4>Revenue (last 30d)</h4>
          <svg width="100%" height="220">
            <polyline
              fill="none"
              stroke="#7cc4ff"
              strokeWidth="3"
              points="10,180 60,150 110,160 160,130 210,120 260,140 310,110 360,100 410,120 460,90"
            />
          </svg>
        </div>
        <div className="list">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {[
                { user: 'Aman Gupta', plan: 'PRO', status: 'Active', joined: '2026-02-10' },
                { user: 'Sara Lee', plan: 'STANDARD', status: 'Active', joined: '2026-02-12' },
                { user: 'John Park', plan: 'FREE', status: 'Pending', joined: '2026-02-14' },
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row.user}</td>
                  <td>{row.plan}</td>
                  <td>{row.status}</td>
                  <td>{row.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, trend }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="metric">{value}</div>
      <div className="trend">{trend}</div>
    </div>
  )
}
