import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const [statsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5001/api/admin/analytics', { headers: { 'x-auth-token': token } }),
          axios.get('http://localhost:5001/api/admin/users', { headers: { 'x-auth-token': token } })
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data)
      } catch (err) {
        console.error('Failed to fetch data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
        <MetricCard title="Total Users" value={loading ? '...' : stats.users} trend="+100%" />
        <MetricCard title="Total Revenue" value={loading ? '...' : `$${stats.revenue}`} trend="+100%" />
        <MetricCard title="Total Orders" value={loading ? '...' : stats.orders} trend="+100%" />
        <MetricCard title="Conversion Rate" value="100%" trend="Stable" />
      </div>

      <div className="panel">
        <div className="chart">
          <h4>Revenue (last 30d)</h4>
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fbff', borderRadius: '10px' }}>
            <p style={{ opacity: 0.6 }}>Revenue chart will appear here</p>
          </div>
        </div>
        <div className="list">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3">Loading...</td></tr>
              ) : (
                users.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
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
