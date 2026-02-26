import React, { useMemo, useState } from 'react'

const sampleUsers = [
  { id: 1, name: 'Aman Gupta', plan: 'PRO', active: true, joined: '2026-02-10' },
  { id: 2, name: 'Sara Lee', plan: 'STANDARD', active: true, joined: '2026-02-12' },
  { id: 3, name: 'John Park', plan: 'FREE', active: false, joined: '2026-02-14' },
  { id: 4, name: 'Ravi Kumar', plan: 'STANDARD', active: true, joined: '2026-02-15' },
  { id: 5, name: 'Neha Singh', plan: 'PRO', active: true, joined: '2026-02-16' },
]

const sampleOrders = [
  { id: 'ORD-1024', userId: 1, amount: 10, status: 'Paid', date: '2026-02-10' },
  { id: 'ORD-1025', userId: 2, amount: 5, status: 'Paid', date: '2026-02-12' },
  { id: 'ORD-1026', userId: 3, amount: 0, status: 'Free', date: '2026-02-14' },
  { id: 'ORD-1027', userId: 4, amount: 5, status: 'Paid', date: '2026-02-15' },
  { id: 'ORD-1028', userId: 5, amount: 10, status: 'Paid', date: '2026-02-16' },
]

export default function Analytics() {
  const [range, setRange] = useState(7)

  const metrics = useMemo(() => {
    const end = new Date('2026-02-16')
    const start = new Date(end)
    start.setDate(start.getDate() - range + 1)
    const byDay = {}
    for (let i = 0; i < range; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      byDay[key] = { revenue: 0, orders: 0, signups: 0 }
    }
    sampleOrders.forEach(o => {
      if (byDay[o.date]) {
        byDay[o.date].revenue += o.amount
        byDay[o.date].orders += 1
      }
    })
    sampleUsers.forEach(u => {
      if (byDay[u.joined]) {
        byDay[u.joined].signups += 1
      }
    })
    const revenueTotal = sampleOrders.reduce((s, o) => s + o.amount, 0)
    const activeCount = sampleUsers.filter(u => u.active).length
    const proCount = sampleUsers.filter(u => u.plan === 'PRO').length
    const standardCount = sampleUsers.filter(u => u.plan === 'STANDARD').length
    const freeCount = sampleUsers.filter(u => u.plan === 'FREE').length
    return { byDay, revenueTotal, activeCount, proCount, standardCount, freeCount }
  }, [range])

  const points = Object.values(metrics.byDay).map((d, i) => {
    const x = 20 + i * (360 / (Object.keys(metrics.byDay).length - 1 || 1))
    const y = 200 - d.revenue * 10
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="admin-analytics">
      <style>{`
        .row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 16px; }
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .title { font-size: 13px; opacity: 0.95; margin: 0; color: #3e5b74; }
        .value { font-size: 24px; font-weight: 800; margin-top: 6px; color: #0e3a63; }
        .panel { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .chart { background: #ffffff; border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; padding: 16px; color: #0b2a4a; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        .legend { display: flex; gap: 12px; font-size: 12px; opacity: 0.95; color: #0e3a63; }
        .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
        .table { border: 1px solid rgba(0,40,80,0.15); border-radius: 14px; overflow: hidden; background: #ffffff; box-shadow: 0 6px 20px rgba(11,42,74,0.08); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid rgba(0,40,80,0.1); color: #0b2a4a; }
        th { text-align: left; background: #f5f8fb; }
        .controls { display: flex; justify-content: flex-end; margin-bottom: 12px; }
        select { padding: 8px 10px; border-radius: 10px; border: 1px solid rgba(0,40,80,0.2); }
        @media (max-width: 1100px) { .row { grid-template-columns: repeat(2,1fr); } .panel { grid-template-columns: 1fr; } }
      `}</style>

      <div className="controls">
        <select value={range} onChange={(e) => setRange(Number(e.target.value))}>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      <div className="row">
        <div className="card"><p className="title">Active Users</p><div className="value">{metrics.activeCount}</div></div>
        <div className="card"><p className="title">Revenue</p><div className="value">${metrics.revenueTotal}</div></div>
        <div className="card"><p className="title">PRO</p><div className="value">{metrics.proCount}</div></div>
        <div className="card"><p className="title">STANDARD</p><div className="value">{metrics.standardCount}</div></div>
      </div>

      <div className="panel">
        <div className="chart">
          <div className="legend">
            <span><span className="dot" style={{ background: '#0b2a4a' }}></span>Revenue</span>
          </div>
          <svg width="100%" height="220">
            <polyline fill="none" stroke="#0b2a4a" strokeWidth="3" points={points} />
          </svg>
        </div>
        <div className="table">
          <table>
            <thead><tr><th>Order</th><th>User</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {sampleOrders.map(o => {
                const u = sampleUsers.find(x => x.id === o.userId)
                return <tr key={o.id}><td>{o.id}</td><td>{u?.name}</td><td>${o.amount}</td><td>{o.status}</td><td>{o.date}</td></tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
