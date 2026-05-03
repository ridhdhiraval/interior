import React, { useMemo, useState, useEffect } from 'react'
import axios from 'axios'

export default function Analytics() {
  const [range, setRange] = useState(7)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const [analyticsRes, ordersRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/admin/analytics/detailed?range=${range}`, {
            headers: { 'x-auth-token': token }
          }),
          axios.get('http://localhost:5001/api/admin/orders', {
            headers: { 'x-auth-token': token }
          })
        ])
        setData(analyticsRes.data)
        setRecentOrders(ordersRes.data)
      } catch (err) {
        setError('Failed to load analytics data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [range])

  const chartPoints = useMemo(() => {
    if (!data || !data.revenueByDay || data.revenueByDay.length === 0) return ""
    
    // Normalize data for chart (simple polyline)
    const maxRev = Math.max(...data.revenueByDay.map(d => parseFloat(d.revenue) || 0), 1)
    const points = data.revenueByDay.map((d, i) => {
      const x = (i / (data.revenueByDay.length - 1 || 1)) * 100 // % width
      const y = 100 - ((parseFloat(d.revenue) || 0) / maxRev) * 80 // % height (inverted, 20% margin)
      return `${x},${y}`
    }).join(' ')
    return points
  }, [data])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Analytics...</div>
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>

  return (
    <div className="admin-analytics">
      <style>{`
        .row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #ffffff; border: 1px solid rgba(0,40,80,0.1); border-radius: 16px; padding: 20px; color: #0b2a4a; box-shadow: 0 4px 12px rgba(11,42,74,0.05); }
        .title { font-size: 13px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
        .value { font-size: 28px; font-weight: 800; color: #0f172a; }
        
        .panel { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
        .chart-box { background: #ffffff; border: 1px solid rgba(0,40,80,0.1); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(11,42,74,0.05); }
        .legend { display: flex; gap: 12px; font-size: 13px; font-weight: 500; color: #64748b; margin-bottom: 20px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
        
        .table-box { border: 1px solid rgba(0,40,80,0.1); border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(11,42,74,0.05); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 14px 18px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        th { text-align: left; background: #f8fafc; font-weight: 600; color: #64748b; text-transform: uppercase; }
        tr:hover td { background: #f8fafc; }
        
        .controls { display: flex; justify-content: flex-end; margin-bottom: 16px; }
        select { padding: 8px 16px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; outline: none; }
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
        <div className="card"><p className="title">Active Users</p><div className="value">{data.activeUsers}</div></div>
        <div className="card"><p className="title">PRO Plans</p><div className="value">{data.planStats.find(p => p.plan_type === 'PRO')?.count || 0}</div></div>
        <div className="card"><p className="title">Standard Plans</p><div className="value">{data.planStats.find(p => p.plan_type === 'STANDARD')?.count || 0}</div></div>
      </div>

      <div className="panel">
        <div className="table-box" style={{ gridColumn: '1 / -1' }}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 8).map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.order_id}</td>
                  <td>${o.amount}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '99px', 
                      fontSize: '11px', 
                      background: o.status === 'paid' ? '#ecfdf5' : '#fef2f2',
                      color: o.status === 'paid' ? '#059669' : '#dc2626',
                      fontWeight: 600
                    }}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
